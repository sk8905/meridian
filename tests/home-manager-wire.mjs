// Home: a dedicated "Manager wire" column (4-column terminal: markets · feed ·
// manager wire · macro), equal width with the aggregated feed. Each manager is a
// mini-section — header (name + fundraising to the right) · activity line · its
// news stories together, feed-sized to match the aggregated wire. Watchlist-first.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- default (no watchlist) ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#g-mgrwire .g-mw-item", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const items = [...box.querySelectorAll(".g-mw-item")];
    const names = [...box.querySelectorAll(".g-mw-nm")];
    const tracks = getComputedStyle(document.querySelector(".g-layout")).gridTemplateColumns.trim().split(/\s+/);
    const evT = box.querySelector(".g-mw-ev-t"), feedT = document.querySelector("#g-feed .g-feed-title");
    // green fundraising must sit to the right of the manager name
    let greenRight = null;
    const fundItem = items.find((it) => it.querySelector(".g-mw-fund"));
    if (fundItem) { const nm = fundItem.querySelector(".g-mw-nm").getBoundingClientRect(), fd = fundItem.querySelector(".g-mw-fund").getBoundingClientRect(); greenRight = fd.left >= nm.right - 1; }
    return {
      items: items.length,
      cols: tracks.length, feedEq: tracks.length === 4 && tracks[1] === tracks[2],
      side3: !!document.querySelector(".g-side3 #g-mgrwire"),
      namesToMgr: names.length > 0 && names.every((a) => /\/credit\/#\/manager\//.test(a.getAttribute("href") || "")),
      groups: [...box.querySelectorAll(".g-feed-dayhdr")].map((g) => g.textContent.trim()),
      stories: box.querySelectorAll(".g-mw-ev").length,
      metas: box.querySelectorAll(".g-mw-meta").length,
      activity: [...box.querySelectorAll(".g-mw-meta .g-mw-m")].some((s) => /·30d/.test(s.textContent)),
      aum: box.querySelectorAll(".g-mw-aum").length, mix: box.querySelectorAll(".g-mw-mix").length,
      fundLines: box.querySelectorAll(".g-mw-hdr .g-mw-fund").length,
      greenRight,
      evSize: evT ? getComputedStyle(evT).fontSize : "", feedSize: feedT ? getComputedStyle(feedT).fontSize : "",
    };
  });
  check(r.side3, "Home: manager wire lives in its own column (.g-side3)");
  checkEq(r.cols, 4, "Home: desktop terminal is a 4-column grid");
  check(r.feedEq, "Home: the aggregated-feed and manager-wire columns are equal width");
  check(r.items >= 8, `Home: manager wire lists active managers (${r.items})`);
  check(r.namesToMgr, "Home: each manager header links to its profile");
  check(r.groups.includes("Active managers"), `Home: managers grouped under an activity heading (${r.groups.join(", ")})`);
  check(r.metas >= r.items, `Home: every manager carries an activity line (${r.metas}/${r.items})`);
  check(r.activity, "Home: activity line shows count (·30d) + trend");
  check(r.aum > 0 && r.mix > 0, `Home: AUM + signal-mix chips present (aum ${r.aum}, mix ${r.mix})`);
  check(r.stories >= r.items, `Home: news stories are listed together beneath each manager (${r.stories})`);
  checkEq(r.evSize, r.feedSize, "Home: story headline text size matches the news feed");
  check(r.fundLines > 0 && r.greenRight === true, "Home: fundraising (green) sits to the right of the manager name");

  // Expand a manager → its remaining stories become visible.
  const expanded = await pg.evaluate(() => {
    const btn = document.querySelector("#g-mgrwire .g-mw-exp"); if (!btn) return null;
    const item = btn.closest(".g-mw-item");
    const before = item.querySelector(".g-mw-events").hasAttribute("hidden");
    btn.click();
    return { before, after: item.querySelector(".g-mw-events").hasAttribute("hidden") };
  });
  check(expanded && expanded.before === true && expanded.after === false, "Home: a manager expands to its remaining stories");
  checkErrs(errs, "manager wire default");
  await ctx.close();
}

// ---- with a watchlisted manager ----
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.evaluate(() => localStorage.setItem("meridian.follows", JSON.stringify({ manager: ["m7"] })));
  await pg.reload({ waitUntil: "load" });
  await pg.waitForSelector("#g-mgrwire .g-mw-item", { timeout: 8000 });
  const r = await pg.evaluate(() => {
    const box = document.querySelector("#g-mgrwire");
    const groups = [...box.querySelectorAll(".g-feed-dayhdr")].map((g) => g.textContent.trim());
    const first = box.querySelector(".g-mw-item");
    return {
      groups,
      firstHref: first ? (first.querySelector(".g-mw-nm") || {}).getAttribute("href") : "",
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
