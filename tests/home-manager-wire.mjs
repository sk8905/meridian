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
