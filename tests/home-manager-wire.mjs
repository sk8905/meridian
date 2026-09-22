// Home MERGED WIRE — Manager & Watchlist lanes (desktop). The News and Manager wires
// merged into one column with a top-level lane switch (All · News · Manager ·
// Watchlist); the Manager/Watchlist lanes render the flat manager-event stream (the
// shared .g-feed-row engine) with the deal categories as the second-level filter, and
// the old manager quadrant is now a reading pane. On phones the manager wire keeps its
// own Watch tab (with the group-by-manager toggle) — covered at the end.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const lane = (pg, name) => pg.evaluate((n) => [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((b) => b.textContent.trim() === n).click(), name);

// ---- Desktop: the merged wire's lanes + the Manager lane's flat stream ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });

  // The top-level lane switch + the reading pane replacing the manager quadrant.
  const shell = await pg.evaluate(() => ({
    lanes: [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].map((b) => b.textContent.trim()),
    readVisible: (() => { const r = document.getElementById("g-read"); return !!r && r.offsetParent !== null; })(),
    mgrHidden: (() => { const m = document.getElementById("g-mgrwire"); return !m || m.offsetParent === null; })(),
    cols: getComputedStyle(document.querySelector(".g-layout")).gridTemplateColumns.trim().split(/\s+/).length,
    defaultRead: ((document.querySelector("#g-readpane .g-read-title") || {}).textContent || "").trim().length > 0,
  }));
  checkEq(shell.lanes.join(" · "), "All · News · Manager · Watchlist", "merged wire: top-level lanes are All · News · Manager · Watchlist");
  check(shell.readVisible && shell.mgrHidden, "desktop: the manager quadrant is now a reading pane (the manager wire is hidden here)");
  checkEq(shell.cols, 5, "desktop terminal stays a 5-column grid");
  check(shell.defaultRead, "reading pane: defaults to the top story of the day");

  // Manager lane: the flat manager-event stream in the shared column.
  await lane(pg, "Manager");
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 6000 });
  const r = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll("#g-feed .g-mw-fev")];
    const first = rows[0];
    const feedT = document.querySelector("#g-feed .g-feed-title");
    return {
      flatRows: rows.length,
      everyHasMgr: rows.length > 0 && rows.every((a) => a.getAttribute("data-mgr")),
      isFeedRow: !!(first && first.classList.contains("g-feed-row")),
      hasParts: !!(first && first.querySelector(".g-feed-time") && first.querySelector(".g-feed-code") && first.querySelector(".g-feed-title") && first.querySelector(".g-feed-src")),
      stacked: first ? /title title/.test(getComputedStyle(first).gridTemplateAreas || "") : false,
      dates: rows.slice(0, 12).map((a) => (a.querySelector(".g-feed-time") || {}).textContent || ""),
      bands: [...document.querySelectorAll("#g-feed .g-mw-month")].map((x) => x.textContent.trim()),
      evSize: feedT ? getComputedStyle(feedT).fontSize : "",
    };
  });
  check(r.flatRows >= 8, `Manager lane: a flat manager-event stream (${r.flatRows} rows)`);
  check(r.everyHasMgr, "Manager lane: every row carries its manager id (data-mgr)");
  check(r.isFeedRow && r.hasParts, "Manager lane: rows use the shared news-wire engine (.g-feed-row: code · date · source)");
  check(r.stacked, "Manager lane: rows adopt the news wire's stacked layout");
  const dn = r.dates.map((s) => { const m = /(\d+)\s+(\w+)/.exec(s); return m ? MON[m[2]] * 31 + (+m[1]) : -1; });
  check(r.dates.every((s) => /^\d+\s+\w+$/.test(s)) && dn.every((v, i) => i === 0 || dn[i - 1] >= v), `Manager lane: the meta line shows the DATE, newest → oldest (${r.dates.slice(0, 6).join(", ")})`);
  check(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b.*\d{4}/i.test(r.bands[0] || ""), `Manager lane: a month band leads the stream (${r.bands[0]})`);

  // Second-level category filter: All + the present deal categories (each with a
  // pastel dot; All has none), and picking one narrows the wire to that label.
  const f = await pg.evaluate(() => {
    const chips = [...document.querySelectorAll("#g-feed-head .g-feed-deskchip[data-mglcat]")];
    return { count: chips.length, first: chips[0]?.textContent.trim(), allOn: chips[0]?.classList.contains("is-on"),
      dots: chips.filter((c) => c.querySelector(".g-feed-deskdot")).length, allDot: !!chips[0]?.querySelector(".g-feed-deskdot") };
  });
  check(f.count >= 4 && f.first === "All" && f.allOn, `Manager lane: a category chip row leads with All, selected (${f.count} chips)`);
  check(!f.allDot && f.dots === f.count - 1, `Manager lane: All carries no dot; every category chip does (${f.dots}/${f.count})`);
  const narrowed = await pg.evaluate(() => {
    const chip = [...document.querySelectorAll("#g-feed-head .g-feed-deskchip[data-mglcat]")].find((c) => c.dataset.mglcat !== "all");
    const want = chip.dataset.mglcat; chip.click();
    return new Promise((res) => setTimeout(() => res({ want, onSel: document.querySelector("#g-feed-head .g-feed-deskchip.is-on")?.dataset.mglcat,
      codes: [...new Set([...document.querySelectorAll("#g-feed .g-mw-fev .g-feed-code")].map((c) => c.textContent.trim()))] }), 300));
  });
  check(narrowed.onSel === narrowed.want, `Manager lane: clicking a category selects it (${narrowed.onSel})`);
  check(narrowed.codes.length === 1, `Manager lane: the wire narrows to only that label's stories (${narrowed.codes.join(", ")})`);

  // Reading pane: clicking a manager row opens it in the pane in reading mode.
  await pg.evaluate(() => { const c = [...document.querySelectorAll("#g-feed-head .g-feed-deskchip[data-mglcat]")].find((x) => x.dataset.mglcat === "all"); if (c) c.click(); });
  await pg.waitForTimeout(200);
  const read = await pg.evaluate(() => {
    const row = document.querySelectorAll("#g-feed .g-mw-fev")[2];
    const title = row.querySelector(".g-feed-title").textContent.replace(/^★\s*/, "").trim();
    row.click();
    return { title, paneTitle: (document.querySelector("#g-readpane .g-read-title") || {}).textContent.trim(), sel: !!document.querySelector("#g-feed .g-feed-row.is-reading") };
  });
  check(read.paneTitle && read.paneTitle.startsWith(read.title.slice(0, 24)), `reading pane: clicking a row opens it (${read.paneTitle.slice(0, 40)})`);
  check(read.sel, "reading pane: the open row is marked as selected");

  // No exact-duplicate headline survives on the live Manager-lane stream.
  const dups = await pg.evaluate(() => {
    const t = [...document.querySelectorAll("#g-feed .g-mw-fev .g-feed-title")].map((x) => x.textContent.replace(/^★\s*/, "").trim());
    const c = {}; t.forEach((x) => { c[x] = (c[x] || 0) + 1; });
    return { rows: t.length, dups: Object.values(c).filter((v) => v > 1).length };
  });
  check(dups.rows > 0 && dups.dups === 0, `Manager lane: no exact-duplicate headline (${dups.dups} dups in ${dups.rows} rows)`);
  checkErrs(errs, "merged wire manager lane");
  await ctx.close();
}

// ---- Watchlist lane: only followed managers, flagged with an orange ★ ----
{
  const ACC = "rgb(251, 139, 30)";
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  // Empty watchlist → the lane coaches to follow someone.
  await lane(pg, "Watchlist");
  await pg.waitForTimeout(250);
  const empty = await pg.evaluate(() => (document.querySelector("#g-feed .g-mw-empty") || {}).textContent || "");
  check(/watchlist/i.test(empty), `Watchlist lane (empty): prompts you to follow a manager (${empty.slice(0, 40)})`);
  // Follow the manager behind a Manager-lane row, then the Watchlist lane shows only
  // their activity, each row starred, headline itself not orange.
  await lane(pg, "Manager");
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 6000 });
  const mgr = await pg.evaluate(() => document.querySelector("#g-feed .g-mw-fev[data-mgr]").dataset.mgr);
  await pg.evaluate((id) => localStorage.setItem("meridian.follows", JSON.stringify({ manager: [id] })), mgr);
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  await lane(pg, "Watchlist");
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 6000 });
  const wl = await pg.evaluate(({ id, acc }) => {
    const rows = [...document.querySelectorAll("#g-feed .g-mw-fev[data-mgr]")];
    const st = rows[0] && rows[0].querySelector(".g-mw-fev-star");
    return { total: rows.length, mine: rows.filter((r) => r.dataset.mgr === id).length, star: !!st,
      starAccent: st ? getComputedStyle(st).color === acc : false,
      titleNotAccent: rows[0] ? getComputedStyle(rows[0].querySelector(".g-feed-title")).color !== acc : false };
  }, { id: mgr, acc: ACC });
  check(wl.total > 0 && wl.mine === wl.total, `Watchlist lane: shows only the followed manager's activity (${wl.mine}/${wl.total})`);
  check(wl.star && wl.starAccent, "Watchlist lane: each row carries an orange ★");
  check(wl.titleNotAccent, "Watchlist lane: the headline itself is not orange (the ★ carries the flag)");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); } catch {} });
  checkErrs(errs, "merged wire watchlist lane");
  await ctx.close();
}

// ---- Phone: the Manager/Watchlist lanes reached via the wire-tab dropdown --------
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 8000 });
  const shell = await pg.evaluate(() => ({
    tabs: [...document.querySelectorAll(".g-wiretabs .g-wiretab")].map((t) => t.textContent.trim()),
    laneLbl: (document.querySelector(".g-wiretab-lane .g-wire-lanelbl") || {}).textContent || "",
    menu: [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].map((i) => i.textContent.trim()),
    chipsHidden: (() => { const l = document.getElementById("g-wire-lanes"); return !l || l.offsetParent === null; })(),
  }));
  check(!shell.tabs.includes("Managers"), `phone: the separate Managers tab is gone — merged into the wire (${shell.tabs.join(" · ")})`);
  check(shell.menu.join(" · ") === "All · News · Manager · Watchlist", `phone: the wire-tab dropdown carries the four lanes (${shell.menu.join(", ")})`);
  check(shell.chipsHidden, "phone: the desktop lane chip row is hidden (the dropdown drives the lane on phones)");
  // Pick Manager from the dropdown → manager events render in the shared feed.
  await pg.evaluate(() => document.querySelector(".g-wiretab-lane").click());
  await pg.waitForTimeout(150);
  await pg.evaluate(() => [...document.querySelectorAll("#g-wire-lanemenu .tchip-menu-item")].find((i) => i.textContent.trim() === "Manager").click());
  await pg.waitForSelector("#g-feed .g-mw-fev", { timeout: 6000 });
  const m = await pg.evaluate(() => ({
    lbl: (document.querySelector(".g-wiretab-lane .g-wire-lanelbl") || {}).textContent || "",
    rows: document.querySelectorAll("#g-feed .g-mw-fev").length,
    subs: document.querySelectorAll("#g-feed-head .g-feed-deskchip[data-mglcat]").length,
  }));
  check(m.lbl === "Manager" && m.rows >= 8, `phone: the Manager lane renders the manager wire in the feed (${m.rows} rows)`);
  check(m.subs >= 4, `phone: the Manager lane keeps its category sub-filters (${m.subs})`);
  checkErrs(errs, "phone merged wire lanes");
  await ctx.close();
}

// ---- De-duplication (manager-signals.dedupeEvents) — unchanged unit coverage ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/`);
  await pg.waitForTimeout(300);
  const d = await pg.evaluate(async () => {
    const m = await import("/v2/js/manager-signals.js?v=v2-5");
    const ev = (cat, title, source) => ({ cat, title, source: source || "", ext: !!source, ts: Date.parse("2026-09-18"), date: "2026-09-18" });
    const n = (arr) => { const r = m.dedupeEvents(arr); return { out: r.length, cats: r.map((e) => e.cat) }; };
    return {
      sameTitleMultiTag: n([ev("fundraising", "Partners Group explores €800m continuation vehicle for private-credit loans", "https://x/a"), ev("strategy", "Partners Group explores €800m continuation vehicle for private-credit loans", "https://x/a"), ev("news", "Partners Group explores €800 million continuation fund for private credit loans", "https://y/b")]),
      rewordedFinancing: n([ev("financing", "Triple Point provides Ayan Capital £75m Shariah-compliant facility", "https://a"), ev("news", "UK Islamic fintech Ayan Capital secures £75m facility originated by Triple Point", "https://b")]),
      launchVsNews: n([ev("fundraising", "Stockdale Capital Partners launches real estate credit platform", "https://a"), ev("news", "Stockdale launches real estate credit platform", "https://b")]),
      distinctKept: n([ev("deal", "Apollo provides $1.25bn equity capital solution for BMG-Concord combination", "https://a"), ev("deal", "Apollo and KKR complete €3bn capital solution for Bayer LARC business", "https://b")]),
    };
  });
  check(d.sameTitleMultiTag.out === 1 && d.sameTitleMultiTag.cats[0] === "fundraising", `dedup: one story tagged 3 ways collapses to 1, keeping the specific tag (${d.sameTitleMultiTag.out}, ${d.sameTitleMultiTag.cats.join("/")})`);
  check(d.rewordedFinancing.out === 1, `dedup: the same financing reworded by two outlets collapses to 1 (${d.rewordedFinancing.out})`);
  check(d.launchVsNews.out === 1, `dedup: a launch carried as a deal + as press collapses to 1 (${d.launchVsNews.out})`);
  check(d.distinctKept.out === 2, `dedup: two genuinely distinct deals are NOT merged (${d.distinctKept.out})`);
  const cm = await pg.evaluate(async () => {
    const m = await import("/v2/js/manager-signals.js?v=v2-5");
    const ev = (cat, title, src) => ({ cat, title, source: src || "", ext: !!src, ts: Date.now(), date: "2026-09-18" });
    return {
      same: m.dedupeEvents([ev("deal", "Affordable Care completes $1bn restructuring", "https://a"), ev("news", "Affordable Care completes $1bn restructuring", "https://b")], { fuzzy: false }).length,
      reworded: m.dedupeEvents([ev("deal", "Affordable Care completes $1bn restructuring", "https://a"), ev("news", "Blackstone and KKR take control of Affordable Care", "https://b")], { fuzzy: false }).length,
    };
  });
  check(cm.same === 1, `dedup (cross-manager): identical headlines from two managers merge (${cm.same})`);
  check(cm.reworded === 2, `dedup (cross-manager): differently-worded stories are kept — conservative (${cm.reworded})`);
  checkErrs(errs, "manager wire dedup");
  await ctx.close();
}

await b.close(); srv.close();
finish();
