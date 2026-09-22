// Home "Manager wire" column (5-column terminal: markets · feed · manager wire ·
// X wire · macro). By DEFAULT it is a single flat chronological stream of every manager's
// events, newest first, regardless of manager. A "Group by manager" toggle in the
// header switches to a mini-section per manager, managers ordered most-active →
// least-active; watchlisted managers lead, each row links to its profile, and a
// row expands to the manager's remaining stories.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };

// ---- default: flat chronological, regardless of manager ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const rows = [...box.querySelectorAll(".g-mw-fev")];
    const tracks = getComputedStyle(document.querySelector(".g-layout")).gridTemplateColumns.trim().split(/\s+/);
    const btn = document.querySelector(".g-mw-grpbtn");
    const evT = box.querySelector(".g-mw-fev .g-feed-title"), feedT = document.querySelector("#g-feed .g-feed-title");
    const first = box.querySelector(".g-mw-fev");
    return {
      flatRows: rows.length,
      cols: tracks.length, feedEq: tracks.length === 5 && tracks[1] === tracks[2],
      side3: !!document.querySelector(".g-side3 #g-mgrwire"),
      everyHasMgr: rows.length > 0 && rows.every((a) => a.getAttribute("data-mgr")),
      noNameLabel: box.querySelectorAll(".g-mw-fev-m").length === 0,
      notGrouped: box.querySelectorAll(".g-mw-item").length === 0,
      dates: rows.slice(0, 12).map((a) => (a.querySelector(".g-feed-time") || {}).textContent || ""),
      btnOff: !!btn && !btn.classList.contains("is-on") && btn.getAttribute("aria-pressed") === "false",
      btnLabel: btn ? btn.textContent.trim() : "",
      evDivided: evT ? parseFloat(getComputedStyle(evT.closest(".g-mw-fev")).borderBottomWidth) >= 1 : false,
      evSize: evT ? getComputedStyle(evT).fontSize : "", feedSize: feedT ? getComputedStyle(feedT).fontSize : "",
      // matches the news wire: rows use the shared .g-feed-row engine, stacked
      // (headline over a code · date · source meta line via the feedwrap container).
      isFeedRow: !!(first && first.classList.contains("g-feed-row")),
      hasParts: !!(first && first.querySelector(".g-feed-time") && first.querySelector(".g-feed-code") && first.querySelector(".g-feed-title") && first.querySelector(".g-feed-src")),
      stacked: first ? /title title/.test(getComputedStyle(first).gridTemplateAreas || "") : false,
      // a month-break band sits beneath the heading (like the news wire's day bands)
      monthBand: ((box.querySelector(".g-mw-flat .g-feed-dayhdr") || {}).textContent || "").trim(),
      // the whole window: every month band shown + the expected current/previous
      // month labels (the wire spans the current month to date + all of the
      // previous month — e.g. September also carries all of August).
      bands: [...box.querySelectorAll(".g-mw-flat .g-feed-dayhdr")].map((x) => x.textContent.trim()),
      curMonth: (() => { const d = new Date(), M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${M[d.getUTCMonth()]} ${d.getUTCFullYear()}`; })(),
      prevMonth: (() => { const d = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - 1, 1)), M = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${M[d.getUTCMonth()]} ${d.getUTCFullYear()}`; })(),
    };
  });
  check(r.side3, "Home: manager wire lives in its own column (.g-side3)");
  checkEq(r.cols, 5, "Home: desktop terminal is a 5-column grid (markets · feed · manager · X wire · macro)");
  check(r.feedEq, "Home: the aggregated-feed and manager-wire columns are equal width");
  check(r.flatRows >= 8, `Home: the wire defaults to a flat event stream (${r.flatRows} rows)`);
  check(r.notGrouped, "Home: by default the wire is NOT grouped into per-manager cards");
  check(r.everyHasMgr, "Home: every flat row carries its manager id (data-mgr)");
  check(r.noNameLabel, "Home: the flat wire has NO separate manager-name label (headline only)");
  check(r.isFeedRow && r.hasParts, "Home: flat rows use the shared news-wire row engine (.g-feed-row: code · date · source)");
  check(r.stacked, "Home: manager rows adopt the news wire's stacked layout (headline over the meta line)");
  check(r.btnOff && /group by manager/i.test(r.btnLabel), `Home: a 'Group by manager' toggle is present and off by default (${r.btnLabel})`);
  const dn = r.dates.map((s) => { const m = /(\d+)\s+(\w+)/.exec(s); return m ? MON[m[2]] * 31 + (+m[1]) : -1; });
  check(r.dates.every((s) => /^\d+\s+\w+$/.test(s)) && dn.every((v, i) => i === 0 || dn[i - 1] >= v), `Home: the meta line shows the DATE (not a time), newest → oldest (${r.dates.join(", ")})`);
  checkEq(r.evSize, r.feedSize, "Home: story headline text size matches the news feed");
  check(r.evDivided, "Home: flat rows are divided by a hairline, like the news wire");
  check(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b.*\d{4}/i.test(r.monthBand), `Home: a month band sits beneath the Manager wire heading (${r.monthBand})`);
  // The wire spans two full months: the current month to date + all of the
  // previous month, and nothing older leaks in (every band is one of those two).
  check(r.bands.includes(r.prevMonth), `Home: the wire reaches back into the whole previous month (${r.prevMonth} band present in ${r.bands.join(" · ")})`);
  check(r.bands.length > 0 && r.bands.every((bnd) => bnd === r.curMonth || bnd === r.prevMonth), `Home: the wire shows only the current + previous month, nothing older (${r.bands.join(" · ")})`);

  // Watchlisted managers are flagged by an orange ★ before the headline. With no
  // follows there are no stars (--t-accent === rgb(251,139,30)).
  const ACC = "rgb(251, 139, 30)";
  const preStar = await pg.evaluate(() => ({
    stars: document.querySelectorAll(".g-mw-fev-star").length,
    firstMgr: (document.querySelector(".g-mw-fev") || {}).getAttribute("data-mgr") || "",
  }));
  check(preStar.stars === 0, "Home: with no watchlist, no ★ is shown in the flat wire");

  // Follow the manager of the first flat row → its rows gain an orange ★, and the
  // headline itself stays a regular (non-accent) colour.
  await pg.evaluate((id) => { localStorage.setItem("meridian.follows", JSON.stringify({ manager: [id] })); }, preStar.firstMgr);
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev", { timeout: 8000 });
  const star = await pg.evaluate(({ id, acc }) => {
    const row = [...document.querySelectorAll(".g-mw-fev")].find((a) => a.getAttribute("data-mgr") === id);
    const st = row && row.querySelector(".g-mw-fev-star");
    return { hasStar: !!st, starAccent: st ? getComputedStyle(st).color === acc : false, titleNotAccent: row ? getComputedStyle(row.querySelector(".g-feed-title")).color !== acc : false };
  }, { id: preStar.firstMgr, acc: ACC });
  check(star.hasStar && star.starAccent, "Home: a watchlisted manager's flat rows show an orange ★ before the headline");
  check(star.titleNotAccent, "Home: the headline itself is not orange (the ★ carries the watchlist flag)");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev", { timeout: 8000 });

  // Toggle → grouped by manager, most-active first.
  await pg.evaluate(() => document.querySelector(".g-mw-grpbtn").click());
  await pg.waitForSelector("#g-mgrwire .g-mw-item", { timeout: 4000 });
  const g = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const items = [...box.querySelectorAll(".g-mw-item")];
    const names = [...box.querySelectorAll(".g-mw-nm")];
    return {
      items: items.length,
      btnOn: document.querySelector(".g-mw-grpbtn").classList.contains("is-on"),
      groups: [...box.querySelectorAll(".g-feed-dayhdr")].map((x) => x.textContent.trim()),
      namesToMgr: names.length > 0 && names.every((a) => /\/v2\/profiles\/#\/manager\//.test(a.getAttribute("href") || "")),
      metas: box.querySelectorAll(".g-mw-meta").length,
      counts: [...box.querySelectorAll(".g-mw-meta .g-mw-m")].map((s) => s.textContent).filter((t) => /·30d/.test(t)).map((t) => parseInt(t, 10)),
      aum: box.querySelectorAll(".g-mw-aum").length, mix: box.querySelectorAll(".g-mw-mix").length,
    };
  });
  check(g.btnOn, "Home: the toggle turns on and the wire groups by manager");
  check(g.items >= 8, `Home: grouped view lists per-manager cards (${g.items})`);
  check(g.groups.includes("Active managers"), `Home: managers grouped under an activity heading (${g.groups.join(", ")})`);
  check(g.namesToMgr, "Home: each grouped manager header links to its profile");
  check(g.metas >= g.items, `Home: every grouped manager carries an activity line (${g.metas}/${g.items})`);
  check(g.aum > 0 && g.mix > 0, `Home: AUM + signal-mix chips present (aum ${g.aum}, mix ${g.mix})`);
  check(g.counts.length > 1 && g.counts.every((v, i) => i === 0 || g.counts[i - 1] >= v), `Home: grouped managers run most-active → least-active by 30d count (${g.counts.join(", ")})`);

  // Expand a grouped manager → its remaining stories become visible.
  const expanded = await pg.evaluate(() => {
    const btn = document.querySelector("#g-mgrwire .g-mw-exp"); if (!btn) return null;
    const item = btn.closest(".g-mw-item");
    const before = item.querySelector(".g-mw-events").hasAttribute("hidden");
    btn.click();
    return { before, after: item.querySelector(".g-mw-events").hasAttribute("hidden") };
  });
  check(expanded && expanded.before === true && expanded.after === false, "Home: a grouped manager expands to its remaining stories");
  checkErrs(errs, "manager wire default+group");
  await ctx.close();
}

// ---- grouped, with a watchlisted manager → Watchlist leads ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m7"] })));
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev, #g-mgrwire .g-mw-item", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector(".g-mw-grpbtn").click());
  await pg.waitForSelector("#g-mgrwire .g-mw-item", { timeout: 4000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const first = box.querySelector(".g-mw-item");
    return {
      groups: [...box.querySelectorAll(".g-feed-dayhdr")].map((g) => g.textContent.trim()),
      firstHref: first ? (first.querySelector(".g-mw-nm") || {}).getAttribute("href") : "",
      firstStar: !!(first && first.querySelector(".g-mw-fav .follow-btn.on")),
      firstName: first ? (first.querySelector(".g-mw-nm") || {}).textContent : "",
      noCoach: !box.querySelector(".g-mw-coach"),
    };
  });
  check(r.groups[0] === "Watchlist", `Home: a "Watchlist" group leads the grouped view once a manager is followed (${r.groups.join(", ")})`);
  check(/\/manager\/m7/.test(r.firstHref) && r.firstStar, `Home: the watchlisted manager is first + starred (${r.firstName})`);
  check(r.noCoach, "Home: the watchlist-coaching banner is gone once you follow someone");
  checkErrs(errs, "manager wire watchlist");
  await ctx.close();
}

// ---- grouped, empty watchlist: coaching + one-tap follow from the wire ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev", { timeout: 8000 });
  await pg.evaluate(() => document.querySelector(".g-mw-grpbtn").click());
  await pg.waitForSelector("#g-mgrwire .g-mw-item", { timeout: 4000 });
  const before = await pg.evaluate(() => ({
    coach: !!document.querySelector("#g-mgrwire .g-mw-coach"),
    favButtons: document.querySelectorAll("#g-mgrwire .g-mw-fav .follow-btn").length,
    anyOn: document.querySelectorAll("#g-mgrwire .g-mw-fav .follow-btn.on").length,
  }));
  check(before.coach, "Home: grouped view with an empty watchlist shows a 'Build your watchlist' coaching banner");
  check(before.favButtons > 0 && before.anyOn === 0, `Home: every grouped manager row has a ☆ follow control, none yet followed (${before.favButtons})`);

  // Tap the first ☆ → the manager is followed (persisted) and restacks under Watchlist.
  const after = await pg.evaluate(() => {
    const btn = document.querySelector("#g-mgrwire .g-mw-fav .follow-btn");
    btn.click();
    let follows = {}; try { follows = JSON.parse(localStorage.getItem("meridian.follows") || "{}"); } catch {}
    return {
      followed: Array.isArray(follows.manager) && follows.manager.length === 1,
      leadGroup: (document.querySelector("#g-mgrwire .g-feed-dayhdr") || {}).textContent?.trim(),
      coachGone: !document.querySelector("#g-mgrwire .g-mw-coach"),
      firstOn: !!document.querySelector("#g-mgrwire .g-mw-item .g-mw-fav .follow-btn.on"),
    };
  });
  check(after.followed, "Home: tapping ☆ writes the manager to the watchlist (meridian.follows)");
  checkEq(after.leadGroup, "Watchlist", "Home: the followed manager restacks under a 'Watchlist' heading");
  check(after.coachGone, "Home: the coaching banner disappears after the first follow");
  check(after.firstOn, "Home: the followed manager now shows a filled ★");
  checkErrs(errs, "manager wire follow");
  await ctx.close();
}

// ---- label filter: a news-wire-style chip row narrows the wire by category ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => { try { localStorage.removeItem("meridian.follows"); localStorage.removeItem("wire.home.v1"); } catch {} });
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-fev", { timeout: 8000 });
  const f = await pg.evaluate(() => {
    // The filter chips live in the fixed header (#g-mw-head), not in the scroll —
    // and there is no "Manager wire" title text.
    const head = document.getElementById("g-mw-head");
    const chips = [...head.querySelectorAll(".g-feed-deskchip[data-mwcat]")];
    const isLens = (c) => c.dataset.mwcat === "all" || c.dataset.mwcat === "watchlist";
    const watch = chips.find((c) => c.dataset.mwcat === "watchlist");
    return { count: chips.length, first: chips[0]?.textContent.trim(), second: chips[1]?.textContent.trim(), allOn: chips[0]?.classList.contains("is-on"),
      dots: chips.filter((c) => c.querySelector(".g-feed-deskdot")).length,
      lensDots: chips.filter((c) => isLens(c) && c.querySelector(".g-feed-deskdot")).length,
      watchSep: !!watch && watch.classList.contains("g-feed-deskchip-sep"),
      noTitle: !(head.textContent || "").includes("Manager wire"), grpInHead: !!head.querySelector(".g-mw-grpbtn") };
  });
  check(f.count >= 4, `manager wire has a label-filter chip row in the header (${f.count} chips)`);
  check(f.first === "All" && f.allOn, "the filter leads with 'All', selected by default");
  check(f.second === "Watchlist" && f.watchSep, "a Watchlist lens sits second, set apart from the label chips (news-wire All/Views style)");
  check(f.lensDots === 0 && f.dots === f.count - 2, `the All + Watchlist lenses carry no dot; every category chip does (${f.dots}/${f.count})`);
  check(f.noTitle && f.grpInHead, "the 'Manager wire' title is gone; chips + Group-by-manager share the header row");
  // Watchlist lens: follow one manager in the wire, then it shows only that
  // manager's activity (the lens re-reads the follow store on render).
  const wlMgr = await pg.evaluate(() => {
    const mgr = document.querySelector("#g-mgrwire .g-mw-fev[data-mgr]")?.dataset.mgr;
    if (!mgr) return null;
    let f = {}; try { f = JSON.parse(localStorage.getItem("meridian.follows") || "{}") || {}; } catch { /* */ }
    f.manager = [mgr]; localStorage.setItem("meridian.follows", JSON.stringify(f));
    document.querySelector("#g-mw-head .g-feed-deskchip[data-mwcat='watchlist']").click();
    return mgr;
  });
  await pg.waitForTimeout(400);
  const wl = await pg.evaluate((mgr) => {
    const rows = [...document.querySelectorAll("#g-mgrwire .g-mw-fev[data-mgr]")];
    return { onWatch: document.querySelector("#g-mw-head .g-feed-deskchip.is-on")?.dataset.mwcat, total: rows.length, mine: rows.filter((r) => r.dataset.mgr === mgr).length };
  }, wlMgr);
  check(wlMgr && wl.onWatch === "watchlist", "the Watchlist lens activates on tap");
  check(wl.total > 0 && wl.mine === wl.total, `the Watchlist lens shows only followed managers' activity (${wl.mine}/${wl.total})`);
  // Reset to All, then pick a specific category and confirm the wire narrows to that label.
  const narrowed = await pg.evaluate(() => {
    document.querySelector("#g-mw-head .g-feed-deskchip[data-mwcat='all']").click();
    const chip = [...document.querySelectorAll("#g-mw-head .g-feed-deskchip[data-mwcat]")].find((c) => c.dataset.mwcat !== "all" && c.dataset.mwcat !== "watchlist");
    const want = chip.dataset.mwcat; chip.click();
    return new Promise((res) => setTimeout(() => {
      const on = document.querySelector("#g-mw-head .g-feed-deskchip.is-on");
      const codes = [...new Set([...document.querySelectorAll("#g-mgrwire .g-feed-code")].map((c) => c.textContent.trim()))];
      res({ want, onSel: on?.dataset.mwcat, codes });
    }, 400));
  });
  check(narrowed.onSel === narrowed.want, `clicking a category selects it (${narrowed.onSel})`);
  check(narrowed.codes.length === 1, `the wire narrows to only that label's stories (${narrowed.codes.join(", ")})`);
  checkErrs(errs, "manager wire label filter");
  await ctx.close();
}

// --- De-duplication: the same story recorded under several tags / outlets is
//     collapsed to ONE row (keeping the most specific tag), while genuinely
//     distinct stories are kept. Exercises manager-signals.dedupeEvents directly. -
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
  // Cross-manager pass (fuzzy:false) merges identical headlines but keeps reworded ones.
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
  // On the live flat wire, no exact-duplicate headline survives.
  await pg.waitForSelector("#g-mgrwire .g-feed-title", { timeout: 8000 });
  const wireDups = await pg.evaluate(() => {
    const t = [...document.querySelectorAll("#g-mgrwire .g-feed-title")].map((x) => x.textContent.replace(/^★\s*/, "").trim());
    const c = {}; t.forEach((x) => { c[x] = (c[x] || 0) + 1; });
    return { rows: t.length, dups: Object.values(c).filter((v) => v > 1).length };
  });
  check(wireDups.rows > 0 && wireDups.dups === 0, `dedup: the live manager wire shows no exact-duplicate headline (${wireDups.dups} dups in ${wireDups.rows} rows)`);
  checkErrs(errs, "manager wire dedup");
  await ctx.close();
}

await b.close(); srv.close();
finish();
