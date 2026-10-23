// Menu ▸ Settings ▸ Subscriptions (owner 2026-10-23): the owner pastes each site's login
// cookie in Wire itself (no Cloudflare dashboard, no 5 kB secret cap). /api/subs is
// Access-only, never returns a cookie, and the subscriber reader uses the saved one.
import worker, { subCookie, cleanCookie } from "../src/index.js";
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

checkEq(cleanCookie("cookie: a=1; b=2;\n c=3\n"), "a=1; b=2; c=3", "cleanCookie: header name, line wraps and stray ';' are dropped");

const kv = new Map();
const env = { WATCHLIST: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); }, delete: async (k) => { kv.delete(k); } } };
const jwt = "h." + Buffer.from(JSON.stringify({ email: "owner@wire" })).toString("base64url") + ".s";
const call = (init = {}, e = env) => worker.fetch(new Request("https://wire.test/api/subs", init), e, { waitUntil() {} });
const auth = { "Cf-Access-Jwt-Assertion": jwt };
const post = (body, extra = {}) => call({ method: "POST", headers: { ...auth, "content-type": "application/json", ...extra }, body: JSON.stringify(body) });

checkEq((await call()).status, 401, "/api/subs: never answered without an Access identity");
const g0 = await (await call({ headers: auth })).json();
checkEq(g0.sites.map((s) => s.name).join(","), "FT,Bloomberg,WSJ,The Economist,Financial News", "/api/subs: one row per subscribed site");
check(g0.sites.every((s) => s.saved === null), "/api/subs: nothing saved to start");

const BIG = "session=" + "x".repeat(9800) + "; other=1";   // Bloomberg-sized: over Cloudflare's 5 kB secret cap
const sv = await post({ site: "bloomberg.com", cookie: "cookie: " + BIG });
const sj = await sv.json();
check(sv.status === 200 && sj.sites.find((s) => s.site === "bloomberg.com").saved === "page", "save: a ~10 kB cookie is accepted (no secret cap)");
check(!JSON.stringify(sj).includes("xxxxxxxx"), "save: the response never echoes the cookie");
check(/private/.test(sv.headers.get("cache-control") || "") && /no-store/.test(sv.headers.get("cache-control") || ""), "/api/subs: private, no-store");
checkEq(await subCookie(env, "bloomberg.com"), BIG, "subCookie: the saved cookie is what the reader sends");
checkEq((await post({ site: "evil.com", cookie: "a=1" })).status, 400, "save: only the subscribed sites");
checkEq((await post({ site: "ft.com", cookie: "a=1" }, { origin: "https://evil.example" })).status, 403, "save: a cross-origin POST is refused");
checkEq((await call({ method: "POST", headers: { ...auth, "content-type": "application/x-www-form-urlencoded" }, body: "site=ft.com&cookie=a%3D1" })).status, 415, "save: a form post is refused (JSON only)");
checkEq((await post({ site: "ft.com", cookie: "not a cookie" })).status, 400, "save: text that isn't a cookie is refused");

// The page-saved cookie wins over a Worker secret; removing it falls back to the secret.
const senv = { ...env, SUB_COOKIE_FT: "from=secret" };
await post({ site: "ft.com", cookie: "from=page" });
checkEq(await subCookie(senv, "ft.com"), "from=page", "subCookie: the page-saved cookie wins over the secret");
await post({ site: "ft.com", cookie: "" });
checkEq(await subCookie(senv, "ft.com"), "from=secret", "remove: falls back to the Cloudflare secret");

// The reader records how the last read went, and the panel shows it.
await post({ site: "ft.com", cookie: "FTSession_s=abc" });
const realFetch = globalThis.fetch;
const paras = Array.from({ length: 6 }, (_, i) => `<p>Gilts rallied for a ${i}th session as traders priced in faster rate cuts after the inflation print.</p>`).join("");
globalThis.fetch = async () => new Response(`<html><head><meta property="og:title" content="Gilts"></head><body><article>${paras}</article></body></html>`, { status: 200, headers: { "content-type": "text/html" } });
try {
  const rd = await (await worker.fetch(new Request("https://wire.test/api/read?url=" + encodeURIComponent("https://www.ft.com/content/abcdabcd-1111-2222-3333-444455556666"), { headers: auth }), env, { waitUntil() {} })).json();
  check(rd.accessible && rd.via === "subscription", "the reader uses the cookie saved on the page");
} finally { globalThis.fetch = realFetch; }
const g1 = await (await call({ headers: auth })).json();
const ft = g1.sites.find((s) => s.site === "ft.com");
check(ft.last && ft.last.ok === true && ft.usedToday === 1, `the panel sees the last read worked (${JSON.stringify(ft.last)} · ${ft.usedToday} today)`);

// ---- Browser: Menu ▸ Settings ▸ Subscriptions ------------------------------------------
let saved = null;
const SITES = (bbg) => JSON.stringify({ sites: [
  { site: "ft.com", name: "FT", saved: "page", savedAt: "2026-10-23T10:00:00Z", last: { ok: true, at: "2026-10-23T14:02:00Z" }, usedToday: 3, cap: 200 },
  { site: "bloomberg.com", name: "Bloomberg", saved: bbg ? "page" : null, savedAt: null, last: null, usedToday: 0, cap: 200 },
  { site: "wsj.com", name: "WSJ", saved: null, last: null, usedToday: 0, cap: 200 },
  { site: "economist.com", name: "The Economist", saved: "secret", last: { ok: false, reason: "session-expired", at: "2026-10-23T09:00:00Z" }, usedToday: 1, cap: 200 },
  { site: "fnlondon.com", name: "Financial News", saved: null, last: null, usedToday: 0, cap: 200 },
] });
const srv = await serve({
  "/api/subs": (q) => {
    if (q.method === "POST") { let b = ""; q.on("data", (c) => { b += c; }); q.on("end", () => { saved = b; }); return [200, SITES(true)]; }
    return [200, SITES(false)];
  },
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/menu/settings`);
await pg.waitForSelector("#v2-menu-subs .subs-row", { timeout: 10000 });
const rows = await pg.evaluate(() => [...document.querySelectorAll("#v2-menu-subs .subs-row")].map((r) => r.querySelector(".subs-name").textContent + ":" + r.querySelector(".subs-pill").textContent));
checkEq(rows.join(" | "), "FT:Reading in full | Bloomberg:Not set | WSJ:Not set | The Economist:Not working | Financial News:Not set", "Settings ▸ Subscriptions lists each site with its state");
check(/Logged out — paste a fresh cookie/.test(await pg.textContent('#v2-menu-subs .subs-row[data-site="economist.com"]')), "a lapsed login says what to do");
await pg.click('#v2-menu-subs .subs-row[data-site="bloomberg.com"] [data-act="open"]');
await pg.fill('#v2-menu-subs .subs-row[data-site="bloomberg.com"] .subs-box', "session=abc; other=1");
await pg.click('#v2-menu-subs .subs-row[data-site="bloomberg.com"] [data-act="save"]');
await pg.waitForFunction(() => /Saved — open one of its stories/.test((document.querySelector('#v2-menu-subs .subs-row[data-site="bloomberg.com"]') || {}).textContent || ""), null, { timeout: 5000 }).catch(() => {});
check(saved && JSON.parse(saved).site === "bloomberg.com" && JSON.parse(saved).cookie === "session=abc; other=1", "Save posts the pasted cookie for that site");
checkEq(await pg.textContent('#v2-menu-subs .subs-row[data-site="bloomberg.com"] .subs-pill'), "Saved", "after saving, the row shows Saved");
const fsz = await pg.evaluate(() => { const t = document.createElement("textarea"); t.className = "subs-box"; document.querySelector("#v2-menu-subs").appendChild(t); const v = parseFloat(getComputedStyle(t).fontSize); t.remove(); return v; });
check(fsz >= 16, `the paste box is ≥16px so iOS doesn't zoom (${fsz}px)`);
checkErrs(errs, "subscriptions panel");
await ctx.close(); await b.close(); srv.close();
finish();
