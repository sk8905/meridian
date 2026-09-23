// The phone header is position:fixed and the body is padded by its MEASURED height
// (--wire-head-h) so the search band sits flush beneath it. That height can change
// after the first measure with no window resize (web-font swap re-metrics the logo,
// the identity block relocates, the safe-area inset settles) — a stale value then
// over-pads the body and opens a gap between the header and the search band. A
// ResizeObserver on the bar must keep the measure in lockstep. Guarded here.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#wire-header .topbar", { timeout: 10000 });
await pg.waitForSelector(".wire-band", { timeout: 10000 });
await pg.waitForTimeout(600);

const gap = () => pg.evaluate(() => {
  const head = document.querySelector("#wire-header .topbar");
  const band = document.querySelector(".wire-band");
  return Math.round(band.getBoundingClientRect().top - head.getBoundingClientRect().bottom);
});

check(Math.abs(await gap()) <= 1, "phone: the search band sits flush under the fixed header at load (no gap)");

// A LATE header-height change with no window resize — the exact condition that left
// --wire-head-h stale and opened the gap. The observer must re-measure so it stays flush.
await pg.evaluate(() => { const i = document.querySelector(".topbar-inner"); i.style.paddingTop = "20px"; i.style.paddingBottom = "20px"; });
await pg.waitForTimeout(150);
check(Math.abs(await gap()) <= 1, "phone: the band stays flush after the header grows (measure re-syncs, no gap)");

await pg.evaluate(() => { const i = document.querySelector(".topbar-inner"); i.style.paddingTop = ""; i.style.paddingBottom = ""; });
await pg.waitForTimeout(150);
check(Math.abs(await gap()) <= 1, "phone: the band stays flush after the header shrinks back (no stale over-pad / gap)");

checkErrs(errs, "header lock");
await b.close();
srv.close();
finish();
