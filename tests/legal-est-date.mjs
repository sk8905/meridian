// A legal alert whose source shows no exact publication date (dateEstimated) must
// not read as exactly dated. The Dashboard ▸ Legal search shows "c." before its
// date (with an explanatory tooltip); exactly-dated items show the bare date.
// The shared feed row (feed.js) renders such an item's time cell as "≈".
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
import { items } from "../legal/js/data.js";

const est = items.filter((i) => i.dateEstimated && i.date);
check(est.length > 0, `fixture: the legal data has estimated-date alerts (${est.length})`);

const srv = await serve({ "/api/xfeed": () => [200, JSON.stringify({ tweets: [] })] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/dashboard/legal/`);
await pg.waitForSelector("#dsh-lgl-q", { state: "attached", timeout: 10000 });
// Search a word from an estimated item's title and check its row.
const word = est[0].title.split(/\W+/).filter((w) => w.length > 4)[0] || "restructuring";
const r = await pg.evaluate((w) => {
  const q = document.querySelector("#dsh-lgl-q"); q.value = w; q.dispatchEvent(new Event("input"));
  const ds = [...document.querySelectorAll(".dsh-lgl-d")];
  const marked = ds.filter((d) => /^c\. /.test(d.textContent));
  return { n: ds.length, marked: marked.length, tip: marked[0] ? marked[0].getAttribute("title") || "" : "" };
}, word);
check(r.n > 0, `Legal search returns rows for "${word}" (${r.n})`);
check(r.marked > 0 && /approximate/i.test(r.tip), `estimated dates read "c. <date>" with an explanatory tooltip (${r.marked} rows)`);
// Shared feed row (loaded in the page — feed.js uses browser-absolute imports):
// ≈ + tooltip for an estimated item; an exactly-dated item keeps its time.
const fr = await pg.evaluate(async () => {
  const { feedRow } = await import("/feed.js");
  return { er: feedRow({ desk: "alert", href: "#", title: "x", date: "2026-01-01", est: true }),
    nr: feedRow({ desk: "alert", href: "#", title: "y", date: "2026-01-01", time: "09:30" }) };
});
check(/g-feed-time-est[^>]*title="Approximate date[^"]*">≈</.test(fr.er), "feed row: an estimated item shows ≈ with an 'Approximate date' tooltip");
check(/>09:30</.test(fr.nr) && !/≈/.test(fr.nr), "feed row: an exactly-dated item keeps its time and no ≈");
checkErrs(errs, "legal estimated dates");
await ctx.close(); await b.close(); srv.close();
finish();
