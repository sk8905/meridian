// One item, one lane (HOUSE_STYLE R50, owner 2026-10-17). The Home wire lanes never
// share an item: News is journalism only; deals, raises, CLOs and restructurings live
// in Deals; firm and people news (team moves, strategy, hedge-fund and law-firm
// records) in Profiles; newsletters in Newsletters; house research and strategist
// commentary in Research. (Watchlist is a follow FILTER across all of them, so it is
// exempt.) Every pair of lanes is checked for overlap by link and by headline.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 15000 });
await pg.waitForLoadState("networkidle");

const LANES = ["News", "Deals", "Profiles", "Research"];   // Newsletters folded into News (owner 2026-10-23)
const norm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
const got = {};
for (const name of LANES) {
  await pg.evaluate((n) => [...document.querySelectorAll("#g-wire-lanes .g-wire-lane")].find((x) => x.textContent.trim() === n).click(), name);
  await pg.waitForFunction((n) => (document.querySelector("#g-wire-lanes .g-wire-lane.is-on") || {}).textContent?.trim() === n, name);
  got[name] = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].map((r) => ({
    href: r.getAttribute("href") || "", title: (r.querySelector(".g-feed-title") || {}).textContent || "",
    code: ((r.querySelector(".g-feed-code") || {}).textContent || "").trim(), mgr: r.classList.contains("g-mw-fev"),
  })));
  check(got[name].length > 0, `${name} lane has rows (${got[name].length})`);
}

for (let i = 0; i < LANES.length; i++) for (let j = i + 1; j < LANES.length; j++) {
  const a = LANES[i], c = LANES[j];
  const hrefs = new Set(got[a].map((x) => x.href).filter((h) => /^https?:/.test(h)));
  const titles = new Set(got[a].map((x) => norm(x.title)).filter(Boolean));
  const dup = got[c].filter((x) => (/^https?:/.test(x.href) && hrefs.has(x.href)) || titles.has(norm(x.title)));
  check(dup.length === 0, `${a} and ${c} share no item${dup.length ? " — e.g. " + dup.slice(0, 2).map((x) => x.title.slice(0, 60)).join(" | ") : ""}`);
}

const DEALISH = /^(DEAL|CLO|RAISE|FIN|M&A|EXIT|RX)$/;
check(!got.News.some((x) => x.mgr), "News carries no manager / profile events");
check(!got.News.some((x) => DEALISH.test(x.code)), `News carries no deal-type rows (${got.News.filter((x) => DEALISH.test(x.code)).map((x) => x.code).slice(0, 5).join(",")})`);
check(!got.Profiles.some((x) => DEALISH.test(x.code)), `Profiles carries no deal-type rows (${got.Profiles.filter((x) => DEALISH.test(x.code)).map((x) => x.code).slice(0, 5).join(",")})`);

checkErrs(errs, "home lane exclusivity");
await ctx.close(); await b.close(); srv.close();
finish();
