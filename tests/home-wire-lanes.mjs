// Desktop merged wire: the top-level lane tabs are the ONLY control — All · Research ·
// Managers · Watchlist · Newsletters. The desk/category sub-filter rows were removed, so
// there is no #g-wire-subs slot and no #g-feed-head band; every row keeps its own colour
// label. The Newsletters lane shows the (padlocked) newsletter items. The reading pane
// still defaults to the most-recent UNLOCKED story and a subscriber story shows just the
// padlock. Runs on the app's real bundled wire content.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

// A readable, recent News wire (court judgments are not news since 2026-10-21, so the
// lane is filled by the live feed alone — the shared fixture is mostly paywalled FT).
const today = new Date().toISOString().slice(0, 10);
const FEED = { items: Array.from({ length: 40 }, (_, i) => ({ title: `Markets story ${i} on rates, oil and the dollar`, url: `https://www.cnbc.com/2026/10/x${i}.html`, source: i % 3 ? "CNBC" : "Associated Press", date: today, time: `${String(20 - Math.floor(i / 3)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`, desk: "m" })) };
const srv = await serve({ "/api/feed": () => [200, JSON.stringify(FEED)] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.removeItem("wire.home.v1"); } catch {} });
await pg.reload({ waitUntil: "load" });
await pg.waitForSelector("#g-wire-lanes .g-wire-lane", { timeout: 8000 });
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
await pg.waitForTimeout(500);

// ---- Reading pane auto-opens the most-recent story ON LOAD (R3a) --------------
// (The .is-reading row highlight is transient — a later re-render rebuilds the feed and
// drops it — but the opened story persists in the pane, which is what proves auto-open.)
const auto = await pg.evaluate(() => ({
  title: ((document.querySelector("#g-readpane .g-read-title") || {}).textContent || "").trim().length > 0,
  open: !!document.querySelector("#g-readpane .g-read-open, #g-readpane .g-read-lock"),
}));
check(auto.title && auto.open, `desktop: the most-recent story auto-opens the reading pane on page load (title=${auto.title})`);

// ---- Lane tabs are the only control; no sub-filter rows ----------------------
const lanes = await pg.evaluate(() => ({
  tabs: [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].map((b) => b.textContent.trim()),
  hasSubsSlot: !!document.getElementById("g-wire-subs"),
  headVisible: (() => { const h = document.getElementById("g-feed-head"); return !!h && getComputedStyle(h).display !== "none" && h.getBoundingClientRect().height > 1; })(),
  deskChips: document.querySelectorAll("#g-wire-lanes .g-feed-deskchip, #g-wire-lanes .g-feed-grpbtn, #g-wire-lanes [data-mglcat], #g-feed-head .g-feed-deskchip, #g-feed-head .g-feed-grpbtn, #g-feed-head [data-mglcat]").length,
}));
check(lanes.tabs.join(" · ") === "News · Deals · Profiles · Research · Watchlist", `lane tabs are News · Deals · Profiles · Research · Watchlist (${lanes.tabs.join(" · ")})`);
check(!lanes.hasSubsSlot, "no inline sub-filter slot (#g-wire-subs) exists");
check(!lanes.headVisible, "the #g-feed-head sub-filter band takes no space");
check(lanes.deskChips === 0, `no desk / category / group sub-filter chips anywhere (${lanes.deskChips})`);

// ---- Court judgments are not news (owner 2026-10-21) ---------------------------
const judg = await pg.evaluate(async () => {
  const L = await import("/legal/js/data.js");
  const urls = new Set((L.cases || []).map((c) => c.url).filter(Boolean));
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")];
  return { rows: rows.length, cases: rows.filter((r) => urls.has(r.getAttribute("href"))).length, known: urls.size };
});
check(judg.known > 0 && judg.cases === 0, `News lane carries no court judgments (${judg.cases} of ${judg.rows} rows)`);

// ---- News rows keep their per-item colour label ------------------------------
const labelled = await pg.evaluate(() => {
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")].slice(0, 20);
  return rows.filter((r) => r.querySelector(".g-feed-code")).length;
});
check(labelled >= 10, `news rows keep their own colour label (${labelled}/20)`);

// ---- Newsletters run in the News lane (owner 2026-10-23: the Newsletters lane is retired) ----
const nl = await pg.evaluate(async () => {
  const urls = new Set(((await import("/newsletters.js")).NEWSLETTERS || []).map((n) => n.url));
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => urls.has(r.getAttribute("href")));
  return { rows: rows.length, locked: rows.filter((r) => r.classList.contains("is-locked") || r.querySelector(".g-feed-lock")).length,
    lane: [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].some((x) => x.textContent.trim() === "Newsletters") };
});
check(nl.rows > 0 && nl.locked === 0, `the News lane carries the newsletters, none padlocked (${nl.rows} rows, ${nl.locked} locked)`);
check(!nl.lane, "there is no Newsletters lane tab");

// ---- Auto-open runs ONCE per load; a lane switch re-renders but does NOT re-jump the
// pane (R3a), and the OPEN story's row stays SHADED across the repaint when that story is
// still in the lane (persistent selection — the shade no longer drops on a re-render).
const readingIdx = () => pg.evaluate(() => { const rows = [...document.querySelectorAll("#g-feed .g-feed-row")]; return rows.findIndex((r) => r.classList.contains("is-reading")); });
const beforeTitle = await pg.evaluate(() => ((document.querySelector("#g-readpane .g-read-title") || {}).textContent || "").trim());
await pg.evaluate(() => { const b = [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === "News"); if (b) b.click(); });
await pg.waitForTimeout(500);
const afterSwitch = await pg.evaluate(() => {
  const shaded = document.querySelector("#g-feed .g-feed-row.is-reading");
  let last = ""; try { last = localStorage.getItem("m_read_last") || ""; } catch { }
  const key = (r) => (r && (r.getAttribute("data-sid") || r.getAttribute("href"))) || "";
  return {
    rows: document.querySelectorAll("#g-feed .g-feed-row").length,
    title: ((document.querySelector("#g-readpane .g-read-title") || {}).textContent || "").trim(),
    shadedMatchesSelection: !!shaded && key(shaded) === last,
  };
});
check(afterSwitch.rows > 0 && afterSwitch.title === beforeTitle, `desktop: a lane switch does not re-jump the pane (story unchanged: ${afterSwitch.title === beforeTitle})`);
check(afterSwitch.shadedMatchesSelection, "desktop: the open story's row stays shaded across the lane switch (persistent selection, not a re-jump)");

// The ↑/↓ arrows cycle the feed FROM the current selection; clamp at the ends (no wrap).
const press = async (key) => { await pg.evaluate((k) => document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true })), key); await pg.waitForTimeout(120); };
const start = await readingIdx();
check(start >= 0, `arrows: the open story is shaded as the starting point (idx ${start})`);
await press("ArrowDown");
const i1 = await readingIdx();
check(i1 === start + 1, `arrows: ArrowDown advances to the next story (idx ${i1})`);
await press("ArrowUp");
const i2 = await readingIdx();
check(i2 === start, `arrows: ArrowUp steps back to the previous story (idx ${i2})`);
// Walk to the TOP, then ArrowUp clamps (does nothing) — it must NOT wrap to the last row.
for (let k = 0; k <= start; k++) await press("ArrowUp");
const iTop = await readingIdx();
check(iTop === 0, `arrows: ArrowUp walks to the top row (idx ${iTop})`);
await press("ArrowUp");
const i3 = await readingIdx();
check(i3 === 0, `arrows: ArrowUp at the top does nothing — no wrap to the bottom (idx ${i3})`);
// The keyboard-focused row must not carry the browser's default outline (white ring).
const outline = await pg.evaluate(() => {
  const r = document.querySelector("#g-feed .g-feed-row.is-reading"); if (!r) return null;
  const s = getComputedStyle(r);
  return { w: s.outlineWidth, style: s.outlineStyle };
});
check(outline && (outline.style === "none" || outline.w === "0px"), `arrows: focused row has no default outline ring (${outline ? outline.style + "/" + outline.w : "no row"})`);
check(await pg.evaluate(() => !!document.querySelector("#g-readpane .g-read-ttl, #g-readpane .g-read-body, #g-readpane [class*='g-read']")), "arrows: the selected story renders in the reading pane");

// ---- Readable-only Home newswire: the All lane carries NO subscriber-paywalled rows.
// The premium four (FT/Bloomberg/WSJ/Economist) and Nikkei are culled from the general
// news + macro desks, so nothing on the All lane needs a login. (The old ≤30% cap was
// replaced by this hard cull — see renderWire in glance.js. Bot-walled-but-free sources
// (e.g. AP) still appear: they render in-pane via the browser proxy (Jina by default),
// so they carry the "opens at the publisher" mark, not the subscriber padlock. Reuters
// was removed as a wire source in 2026-10 — it never opened in the reading pane.) -----
const sub = await pg.evaluate(() => {
  // News rows only — manager-event rows (.g-mw-fev) merged into the All lane can be
  // sourced from Bloomberg/FT and are shown (with a padlock / link-out) by design;
  // the readable-only cull applies to the news stream, not manager events.
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row:not(.g-mw-fev)")];
  const isSub = (r) => /needs a login/i.test(((r.querySelector(".g-feed-lock") || {}).title) || "");
  const subscriber = rows.filter(isSub);
  const subSrcs = [...new Set(subscriber.map((r) => ((r.querySelector(".g-feed-src") || {}).textContent || "").trim()))].filter(Boolean);
  return { total: rows.length, subscriber: subscriber.length, subSrcs: subSrcs.slice(0, 6) };
});
check(sub.total > 0 && sub.subscriber === 0,
  `All lane is readable-only — no subscriber-paywalled rows (${sub.subscriber}/${sub.total}${sub.subSrcs.length ? " — leaked: " + sub.subSrcs.join(", ") : ""})`);

// ---- Bot-walled (openly-published but reader-refused) sources count as NON-readable
// too: Reuters &c open at the publisher, get the "opens externally" mark (NOT the
// subscriber padlock), and are throttled into the ≤30% along with the paywalls. This
// is what keeps the readable-in-pane share honest (a Reuters row that shows a dead
// in-pane fallback would otherwise be miscounted as "readable"). -----------------
const linkout = await pg.evaluate(async () => {
  // Reuters STORIES (a Reuters newsletter is the owner's own email — never a link-out).
  const nlUrls = new Set(((await import("/newsletters.js")).NEWSLETTERS || []).map((n) => n.url));
  const rows = [...document.querySelectorAll("#g-feed .g-feed-row")].filter((r) => !nlUrls.has(r.getAttribute("href")));
  const reuters = rows.filter((r) => /reuters/i.test(((r.querySelector(".g-feed-src") || {}).textContent) || ""));
  if (!reuters.length) return null;
  return {
    n: reuters.length,
    allLocked: reuters.every((r) => r.classList.contains("is-locked")),
    extMark: reuters.every((r) => /opens at the publisher/i.test(((r.querySelector(".g-feed-lock") || {}).title) || "")),
  };
});
if (linkout) {
  check(linkout.allLocked, `bot-walled Reuters rows are flagged non-readable (is-locked), throttled with the paywalls (${linkout.n} rows)`);
  check(linkout.extMark, "bot-walled rows carry the 'opens at the publisher' mark, not the subscriber padlock");
} else check(true, "no Reuters rows in this cycle to check the link-out mark");

// ---- A newsletter with no stored text opens as its summary + "Open at <publication>" ----
const nlOpen = await pg.evaluate(async () => {
  const all = ((await import("/newsletters.js")).NEWSLETTERS || []);
  // By issue id (data-sid): several issues share one "read online" link.
  const byId = new Map(all.filter((n) => !n.body && n.summary).map((n) => [n.id, n]));
  const r = [...document.querySelectorAll("#g-feed .g-feed-row")].find((x) => byId.has(x.getAttribute("data-sid")));
  if (!r) return null;
  r.click();
  await new Promise((res) => setTimeout(res, 250));
  const n = byId.get(r.getAttribute("data-sid")), p = document.getElementById("g-readpane");
  return { pub: n.publication, sum: n.summary, text: (p || {}).textContent || "", open: ((p && p.querySelector(".g-read-open")) || {}).textContent || "", lock: !!(p && p.querySelector(".g-read-lock")) };
});
if (nlOpen) {
  check(nlOpen.text.includes(nlOpen.sum) && nlOpen.text.includes("Summary · " + nlOpen.pub), `a newsletter without stored text shows its summary, credited (${nlOpen.pub})`);
  check(nlOpen.open === "Open at " + nlOpen.pub && !nlOpen.lock, `…and "Open at ${nlOpen.pub}", no padlock (${nlOpen.open})`);
} else check(true, "no body-less newsletter in this data to open");

checkErrs(errs, "home wire lanes");
await ctx.close();
await b.close();
srv.close();
finish();
