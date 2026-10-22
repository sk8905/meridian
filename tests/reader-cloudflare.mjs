// Reader proxy: Cloudflare Browser Rendering in front of Jina (owner 2026-10-21 — a paid
// Jina key was the expensive option). Pure, no egress: global fetch is stubbed. Locks:
//   • without BOTH Worker secrets (CF_ACCOUNT_ID + CF_BROWSER_TOKEN) Cloudflare is never called;
//   • with them, a bot-walled page is read through Cloudflare and Jina is not called;
//   • a Cloudflare miss (quota 429, error) falls through to Jina, and the note keeps both reasons.
import worker, { readProxyOrder, cfReaderOn, mdTitle, cfRetryWait, readMissIsTransient } from "../src/index.js";
import { check, finish } from "./lib.mjs";

check(JSON.stringify(readProxyOrder("someblog.example.com", {})) === '["jina"]', "order: no Cloudflare secrets → Jina only");
check(JSON.stringify(readProxyOrder("someblog.example.com", { CF_ACCOUNT_ID: "a" })) === '["jina"]' && !cfReaderOn({ CF_BROWSER_TOKEN: "t" }), "order: one secret alone does not switch Cloudflare on");
check(JSON.stringify(readProxyOrder("someblog.example.com", { CF_ACCOUNT_ID: "a", CF_BROWSER_TOKEN: "t" })) === '["cloudflare","jina"]', "order: both secrets → Cloudflare first, Jina as the backstop");
check(cfRetryWait(429, "3") === 3000 && cfRetryWait(429, null) === 10000 && cfRetryWait(429, "60") === 10000 && cfRetryWait(500, "3") === null, "a Cloudflare 429 waits its Retry-After (capped at 10s) and retries once; other errors don't");
check(readMissIsTransient({ accessible: false, reason: "fetch-403/cf-429/proxy-429" }) && !readMissIsTransient({ accessible: false, reason: "fetch-403/cf-500/proxy-402" }) && !readMissIsTransient({ accessible: true, reason: "" }), "a miss caused only by a rate limit (429) is transient — never cached");
check(mdTitle("intro\n# Big Fund Closes at $5bn\n\ntext") === "Big Fund Closes at $5bn", "the page title is the markdown's first # heading");

const ARTICLE = "https://someblog.example.com/2026/10/fund-closes";
const MD = "# Big Fund Closes at $5bn\n\n" + ["The manager said on Tuesday that its fifth direct lending fund closed at its hard cap after eight months in market.", "Investors included pension plans, insurers and sovereign wealth funds across Europe, North America and Asia.", "The fund will make senior secured loans to sponsor-backed mid-market companies in the UK and Western Europe."].join("\n\n");
const realFetch = globalThis.fetch;
// Node has no Workers edge cache: a no-op one (always a miss) is enough here.
globalThis.caches = globalThis.caches || { default: { match: async () => undefined, put: async () => {} } };
let calls = [];
const stub = (cf) => { calls = []; globalThis.fetch = async (req, init) => {
  const url = typeof req === "string" ? req : req.url; calls.push(url);
  if (url.includes("api.cloudflare.com")) return cf();
  if (url.startsWith("https://r.jina.ai/")) return new Response("blocked", { status: 402 });
  return new Response("<html><body>Access denied</body></html>", { status: 403, headers: { "content-type": "text/html" } });   // the bot wall
}; };
const read = async (env, q = "") => (await worker.fetch(new Request("https://wire.test/api/read?url=" + encodeURIComponent(ARTICLE + q)), env, { waitUntil() {} })).json();
const CF = { CF_ACCOUNT_ID: "acct123", CF_BROWSER_TOKEN: "tok" };

try {
  stub(() => new Response(JSON.stringify({ success: true, result: MD }), { headers: { "content-type": "application/json" } }));
  const ok = await read(CF, "?a=1");
  const cfCall = calls.find((u) => u.includes("api.cloudflare.com"));
  check(ok.accessible === true && ok.via === "cloudflare" && ok.paragraphs.length >= 2, `with both secrets a bot-walled page reads via Cloudflare (via=${ok.via}, ${ok.paragraphs && ok.paragraphs.length} paras)`);
  check(cfCall && /\/accounts\/acct123\/browser-rendering\/markdown/.test(cfCall), "it calls the account's /browser-rendering/markdown endpoint");
  check(!calls.some((u) => u.startsWith("https://r.jina.ai/")), "Jina is not called when Cloudflare read the page");
  check(/Big Fund Closes/.test(ok.title || ""), `the title comes from the page (${ok.title})`);

  const limited = () => new Response(JSON.stringify({ success: false, errors: [{ message: "rate limited" }] }), { status: 429, headers: { "retry-after": "1" } });
  stub(limited);
  const miss = await read(CF, "?a=2");
  check(calls.filter((u) => u.includes("api.cloudflare.com")).length === 2, "a Cloudflare 429 is retried once after its Retry-After");
  check(calls.some((u) => u.startsWith("https://r.jina.ai/")), "a second Cloudflare 429 falls through to Jina");
  check(miss.accessible === false && /cf-429/.test(miss.reason || "") && /proxy-402/.test(miss.reason || ""), `when both miss, the note keeps both reasons (${miss.reason})`);

  // 429 then success: the one retry reads the page.
  let n = 0;
  stub(() => (++n === 1 ? limited() : new Response(JSON.stringify({ success: true, result: MD }), { headers: { "content-type": "application/json" } })));
  const retried = await read(CF, "?a=4");
  check(retried.accessible === true && retried.via === "cloudflare" && n === 2, `a 429 then a free slot: the retry reads the page via Cloudflare (${retried.via}, ${n} calls)`);

  // Background prefetch (warm=1): direct only — no Cloudflare / Jina spend, nothing cached.
  stub(() => { throw new Error("prefetch must not call Cloudflare"); });
  const w = await (await worker.fetch(new Request("https://wire.test/api/read?warm=1&url=" + encodeURIComponent(ARTICLE + "?a=5")), CF, { waitUntil() {} })).json();
  check(w.warm === true && w.accessible === false && !calls.some((u) => u.includes("api.cloudflare.com") || u.startsWith("https://r.jina.ai/")), "a background prefetch the direct fetch can't read never calls Cloudflare or Jina");

  stub(() => { throw new Error("must not be called"); });
  await read({}, "?a=3");
  check(!calls.some((u) => u.includes("api.cloudflare.com")), "without the secrets Cloudflare is never called");
} finally { globalThis.fetch = realFetch; }
{ // The client's top-story prefetch marks itself warm, so it never spends the proxies.
  const { readFileSync } = await import("node:fs");
  const g = readFileSync(new URL("../v2/js/home/glance.js", import.meta.url), "utf8");
  const pf = g.slice(g.indexOf("function prefetchTopReads"), g.indexOf("function prefetchTopReads") + 600);
  check(/_fetchRead\(it\.href, true\)/.test(pf) && /warm \? "&warm=1" : ""/.test(g), "Home's top-story prefetch asks for a direct-only (warm=1) read");
}
finish();
