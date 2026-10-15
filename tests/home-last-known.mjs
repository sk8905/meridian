// Home rails never hang on "Loading…" (review 2026-10-15, #1): when /api/rates and
// /api/markets answer but carry nothing (the harness stubs every /api/* with {}), a
// first-time viewer (no browser cache) sees the committed last-known values
// (dashboard/js/live-snapshot.js) with a visible "Not live · as of <time>".
import { serve, launchChromium, open, WIDE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { pg, errs } = await open(b, WIDE, `http://localhost:${srv.port}/v2/`);
await pg.waitForFunction(() => document.querySelectorAll("#g-rates .rate-tile").length > 0 && document.querySelectorAll("#g-markets .rate-tile").length > 0, null, { timeout: 12000 }).catch(() => {});
const r = await pg.evaluate(() => ({
  rates: document.querySelectorAll("#g-rates .rate-tile").length,
  mkts: document.querySelectorAll("#g-markets .rate-tile").length,
  rLbl: (document.querySelector("#g-rates .g-stale") || {}).textContent || "",
  mLbl: (document.querySelector("#g-markets .g-stale") || {}).textContent || "",
  loading: /Loading market rates|Loading markets/.test(document.body.innerText),
}));
check(r.rates > 0 && r.mkts > 0, `Key rates and Markets show last-known tiles (${r.rates} / ${r.mkts})`);
// R42(d): plain and one line — "Not live · as of <d Mon HH:MM>" (the long reason is its title).
check(/^Not live · (as of \d|last-known values)/.test(r.rLbl) && /^Not live · (as of \d|last-known values)/.test(r.mLbl), `each says it is not live, with its as-of time (${r.rLbl})`);
check(!r.loading, "no rail is left on Loading…");
checkErrs(errs, "home last-known");
await b.close(); srv.close();
finish();
