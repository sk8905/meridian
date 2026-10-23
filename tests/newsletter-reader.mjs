// Subscriber newsletters read IN-PANE (owner request 2026-10-14). The routine posts each
// newsletter email's plain-text body to /api/nl-ingest (RESEARCH_KEY-guarded) → KV; the
// reading pane reads it from /api/nl-body (Access identity required). Bodies never live in
// the public git repo — newsletters.js only carries `body: true`.
import worker, { nlBlocks } from "../src/index.js";
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

// (1) plain-text email → blocks: titles split off, URLs/markdown links dropped, footer cut.
const EMAIL = "Good morning, here's what's moving.\n\nVirgin Media spirals\nBondholders are weighing a punitive debt overhaul after Altice signalled talks (https://bloom.bg/abc).\nThe bonds fell 5 points.\n\n[Read the story](https://www.bloomberg.com/x) for more.\n\nGilts\nGilts rallied as UK inflation cooled to 2.1%, the lowest since 2021.\n\n----\nYou received this message because you are subscribed to The Brink.\nUnsubscribe https://x.y\nBloomberg L.P. 731 Lexington Avenue";
const bl = nlBlocks(EMAIL);
check(bl.some((x) => x.h && x.t === "Virgin Media spirals") && bl.some((x) => x.h && x.t === "Gilts"), "nlBlocks: section titles become headings");
check(!JSON.stringify(bl).match(/https?:|unsubscribe|Lexington|received this message/i), "nlBlocks: URLs and the footer are dropped");
check(bl.some((x) => !x.h && /Bondholders are weighing .* The bonds fell 5 points\./.test(x.t)), "nlBlocks: wrapped lines join into one paragraph");

// (2) Worker endpoints with an in-memory KV.
const kv = new Map();
const env = { RESEARCH_KEY: "k3y", WATCHLIST: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => { kv.set(k, v); } } };
const call = (path, init) => worker.fetch(new Request("https://wire.test" + path, init), env, { waitUntil() {} });
const post = (key, body) => call("/api/nl-ingest", { method: "POST", headers: { "content-type": "application/json", ...(key ? { "x-research-key": key } : {}) }, body: JSON.stringify(body) });
const NL = { id: "nl-bloomberg-thebrink-test-20261014", title: "The Brink: Virgin Media spirals", publication: "Bloomberg", author: "Irene Garcia Perez", date: "2026-10-14", url: "https://www.bloomberg.com/news/newsletters/2026-10-14/x", text: EMAIL };
checkEq((await post(null, NL)).status, 403, "nl-ingest: refused without the key");
checkEq((await post("wrong", NL)).status, 403, "nl-ingest: refused with a wrong key");
const ok = await post("k3y", NL);
checkEq(ok.status, 200, "nl-ingest: stores a body with the key");
checkEq((await post("k3y", { ...NL, id: "nl-empty-x", text: "Unsubscribe" })).status, 422, "nl-ingest: an email with no body is rejected");
checkEq((await call("/api/nl-body?id=" + NL.id)).status, 401, "nl-body: never served without an Access identity");
const jwt = "h." + Buffer.from(JSON.stringify({ email: "owner@wire" })).toString("base64url") + ".s";
const got = await call("/api/nl-body?id=" + NL.id, { headers: { "Cf-Access-Jwt-Assertion": jwt } });
const gj = await got.json();
check(got.status === 200 && gj.accessible && gj.blocks.length >= 4 && gj.title === NL.title, "nl-body: the reader gets the stored issue");
check(/no-store/.test(got.headers.get("cache-control") || ""), "nl-body: private, never cached");
checkEq((await call("/api/nl-body?id=nl-missing", { headers: { "Cf-Access-Jwt-Assertion": jwt } })).status, 404, "nl-body: unknown id → 404 (pane falls back to the link)");

// (3) Browser: a stored Bloomberg newsletter opens in the pane, unlocked.
const NLJS = `export const PUBLISHERS = {}; export const NEWSLETTERS = [${JSON.stringify({ id: NL.id, publication: "Bloomberg", author: NL.author, series: "The Brink", title: NL.title, date: new Date().toISOString().slice(0, 10), time: "09:00", summary: "Virgin Media", url: NL.url, body: true })}];`;
const srv = await serve({
  "/newsletters.js": () => [200, NLJS, "text/javascript"],
  "/api/nl-body": () => [200, JSON.stringify(gj)],
  "/api/read": () => [200, JSON.stringify({ accessible: false, paragraphs: [], reason: "should-not-be-called" })],
});
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(400);
const row = pg.locator(`#g-feed .g-feed-row[href="${NL.url}"]`).first();
check(await row.count() === 1, "newsletter row is on the News lane (Newsletters lane folded in, owner 2026-10-23)");
check(!(await row.evaluate((r) => r.classList.contains("is-locked") || !!r.querySelector(".g-feed-lock"))), "a stored newsletter carries no padlock");
await row.click();
await pg.waitForFunction(() => /Bondholders are weighing/.test((document.getElementById("g-readpane") || {}).textContent || ""), null, { timeout: 8000 }).catch(() => {});
const pane = await pg.evaluate(() => (document.getElementById("g-readpane") || {}).textContent || "");
check(/Bondholders are weighing/.test(pane) && /Virgin Media spirals/.test(pane), "the reading pane shows the full newsletter issue");
checkErrs(errs, "newsletter reader");
await ctx.close(); await b.close(); srv.close();
finish();
