// Reading pane must NEVER get stuck on the "Fetching the full text…" loading note.
// If the reader service (/api/read) hangs — a slow/cold proxy, an abort that didn't
// reject — a UI timeout (glance.js _renderReaderInto: Promise.race against
// window.__readUiTimeoutMs, 26s in prod) resolves it to the "open the original"
// fallback. This guards the bug where a desktop pane sat on the loading note for 20
// minutes after the auto-opened story's fetch never settled.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

// Sources NOT readable in-pane (subscriber paywall or bot-walled link-out) — a row from
// one of these shows a preview, not the loading→fetch path we need to exercise.
const WALLED_SRC_PATTERN = "financial times|bloomberg|wall street journal|\\bwsj\\b|economist|new york times|\\bnyt\\b|barron|business insider|the times|telegraph|nikkei|forbes|washington post|the information|seeking alpha|reuters";

const srv = await serve();                       // /api/read is intercepted in the page (hangs), never reaches here
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
// Shrink the UI timeout to keep the test fast, and make the reader service HANG so the
// fetch promise never settles on its own — only the UI timeout can rescue the pane.
await pg.addInitScript(() => { window.__readUiTimeoutMs = 1500; });
await pg.route("**/api/read**", () => { /* never fulfill — simulate a hung reader service */ });
await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); localStorage.removeItem("m_read_last"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });

// Click an openly-readable row (source NOT in the walled/link-out set) so the pane
// enters reading mode and starts the (hung) fetch — showing the loading note.
const clicked = await pg.evaluate((pat) => {
  const re = new RegExp(pat, "i");
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  const r = rows.find((x) => !x.classList.contains("is-locked") && !re.test((x.querySelector(".g-feed-src") || {}).textContent || ""));
  if (!r) return false; (r.querySelector(".g-feed-src") || r).click(); return true;
}, WALLED_SRC_PATTERN);
check(clicked, "a readable wire row was opened in the pane");

// The loading note appears first…
const sawLoading = await pg.waitForSelector("#g-readpane .g-read-loading", { timeout: 4000 }).then(() => true).catch(() => false);
check(sawLoading, "reading pane shows the 'Fetching the full text…' loading note while the fetch is in flight");

// …and within the UI timeout it must resolve to the fallback — never stay stuck.
const resolved = await pg.waitForFunction(() => {
  const box = document.getElementById("g-readpane");
  if (!box) return false;
  const stillLoading = !!box.querySelector(".g-read-loading");
  const hasFallback = !!box.querySelector(".g-read-open") || /isn't available in-pane/i.test(box.textContent || "");
  return !stillLoading && hasFallback;
}, { timeout: 4000 }).then(() => true).catch(() => false);
check(resolved, "reading pane resolves the hung fetch to the 'open the original' fallback within the UI timeout — never stuck on the loading note");

checkErrs(errs, "read pane timeout");
await ctx.close();
await b.close(); srv.close();
finish();
