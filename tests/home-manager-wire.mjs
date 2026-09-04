// Home "Manager wire" column (4-column terminal: markets · feed · manager wire ·
// macro). By DEFAULT it is a single flat chronological stream of every manager's
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
      cols: tracks.length, feedEq: tracks.length === 4 && tracks[1] === tracks[2],
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
    };
  });
  check(r.side3, "Home: manager wire lives in its own column (.g-side3)");
  checkEq(r.cols, 4, "Home: desktop terminal is a 4-column grid");
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
      namesToMgr: names.length > 0 && names.every((a) => /\/credit\/#\/manager\//.test(a.getAttribute("href") || "")),
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

await b.close(); srv.close();
finish();
