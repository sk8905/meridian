// Home: a dedicated "Manager wire" column (4-column terminal: markets · feed ·
// manager wire · macro). Watchlist-first, then most-recently-active covered
// managers; rows conform to the news-wire row engine (.g-feed-row) and the feed
// + manager columns are equal width. Each row links to the manager profile.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- default (no watchlist) ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#g-mgrwire .g-feed-row", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const rows = [...box.querySelectorAll(".g-feed-row")];
    const tracks = getComputedStyle(document.querySelector(".g-layout")).gridTemplateColumns.trim().split(/\s+/);
    return {
      rows: rows.length,
      allManagerHrefs: rows.every((a) => /\/credit\/#\/manager\//.test(a.getAttribute("href") || "")),
      groups: [...box.querySelectorAll(".g-feed-dayhdr")].map((g) => g.textContent.trim()),
      firstFeedStyled: !!(rows[0] && rows[0].querySelector(".g-feed-time") && rows[0].querySelector(".g-feed-code") && rows[0].querySelector(".g-feed-title")),
      firstName: !!(rows[0] && rows[0].querySelector(".g-mw-nm")),
      cols: tracks.length,
      feedEqManager: tracks.length === 4 && tracks[1] === tracks[2],
      side3: !!document.querySelector(".g-side3 #g-mgrwire"),
      // monitoring detail
      metas: box.querySelectorAll(".g-mw-item .g-mw-meta").length,
      fundLines: box.querySelectorAll(".g-mw-fund").length,
      activity: [...box.querySelectorAll(".g-mw-meta .g-mw-m")].some((s) => /·30d/.test(s.textContent)),
      aum: box.querySelectorAll(".g-mw-aum").length,
      mixChips: box.querySelectorAll(".g-mw-mix").length,
      expanders: box.querySelectorAll(".g-mw-exp").length,
    };
  });
  check(r.side3, "Home: manager wire lives in its own column (.g-side3)");
  checkEq(r.cols, 4, "Home: desktop terminal is a 4-column grid");
  check(r.feedEqManager, "Home: the aggregated-feed and manager-wire columns are equal width");
  check(r.rows >= 8, `Home: manager wire lists active managers (${r.rows})`);
  check(r.allManagerHrefs, "Home: every manager-wire row links to a manager profile");
  check(r.groups.includes("Active managers"), `Home: rows grouped under an activity heading (${r.groups.join(", ")})`);
  check(r.firstFeedStyled, "Home: rows use the news-wire row engine (time · code · title)");
  check(r.firstName, "Home: the manager name leads the row (manager-first)");
  check(r.metas >= r.rows, `Home: every row carries a monitoring meta line (${r.metas}/${r.rows})`);
  check(r.activity, "Home: rows show activity count (·30d) + trend");
  check(r.aum > 0 && r.mixChips > 0, `Home: rows show AUM + signal-mix chips (aum ${r.aum}, mix ${r.mixChips})`);
  check(r.fundLines > 0, `Home: managers in market show a fundraising line (${r.fundLines})`);

  // Expand a row → its recent-events list becomes visible.
  const expanded = await pg.evaluate(() => {
    const btn = document.querySelector("#g-mgrwire .g-mw-exp"); if (!btn) return null;
    const item = btn.closest(".g-mw-item");
    const before = item.querySelector(".g-mw-events") && item.querySelector(".g-mw-events").hasAttribute("hidden");
    btn.click();
    const evs = item.querySelector(".g-mw-events");
    return { before, after: evs ? evs.hasAttribute("hidden") : null, rows: evs ? evs.querySelectorAll(".g-mw-ev").length : 0 };
  });
  check(expanded && expanded.before === true && expanded.after === false && expanded.rows > 0, `Home: a row expands to its recent events (${expanded && expanded.rows})`);
  checkErrs(errs, "manager wire default");
  await ctx.close();
}

// ---- with a watchlisted manager ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m7"] })));
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-feed-row", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const groups = [...box.querySelectorAll(".g-feed-dayhdr")].map((g) => g.textContent.trim());
    const first = box.querySelector(".g-feed-row");
    return {
      groups,
      firstHref: first ? first.getAttribute("href") : "",
      firstStar: !!(first && first.querySelector(".g-mw-star")),
      firstName: first ? (first.querySelector(".g-mw-nm") || {}).textContent : "",
    };
  });
  check(r.groups[0] === "Watchlist", `Home: a "Watchlist" group leads once a manager is followed (${r.groups.join(", ")})`);
  check(/\/manager\/m7/.test(r.firstHref) && r.firstStar, `Home: the watchlisted manager is first + starred (${r.firstName})`);
  checkErrs(errs, "manager wire watchlist");
  await ctx.close();
}

await b.close(); srv.close();
finish();
