// Source trial (scripts/source-trial.mjs) — offline: the pass rule, and that the
// Worker's own feedParse reads a plain RSS feed the trial fetches.
import { verdict } from "../scripts/source-trial.mjs";
import { feedParse } from "../src/index.js";
import { check, finish } from "./lib.mjs";
check(verdict({ items: 10, newestDays: 1, articles: [{ inPane: true }, { inPane: true }, { inPane: false }] }), "a live feed with 2 of 3 articles readable in-pane passes");
check(!verdict({ items: 10, newestDays: 1, articles: [{ inPane: true }, { inPane: false }, { inPane: false }] }), "1 of 3 readable fails");
check(!verdict({ items: 10, newestDays: 60, articles: [{ inPane: true }, { inPane: true }] }), "a stale feed (>30 days) fails");
check(!verdict({ items: 2, newestDays: 1, articles: [{ inPane: true }, { inPane: true }] }), "a feed with under 3 items fails");
const rss = `<rss><channel><item><title>ECB holds rates</title><link>https://www.ecb.europa.eu/press/pr/1.html</link><pubDate>Tue, 13 Oct 2026 12:00:00 GMT</pubDate></item><item><title>Lagarde speech on inflation</title><link>https://www.ecb.europa.eu/press/key/2.html</link><pubDate>Mon, 12 Oct 2026 09:00:00 GMT</pubDate></item></channel></rss>`;
const items = feedParse(rss, { source: "European Central Bank", region: "EU" });
check(items.length === 2 && items[0].source === "European Central Bank" && items[0].when, "feedParse reads a plain RSS feed (title, link, date, source)");
finish();
