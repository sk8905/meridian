// Type-scale contract — the whole app uses the Profiles ▸ Managers league
// (.tleague) font + size. The user pinned that dense terminal type as the app
// standard: content/feed text sits at the league density (~11px), NOT the old
// 13.6px prose scale. This guards the shared --fs-* token block (premium.css)
// and the feed engine against drifting back up. Sizes only — layout is untouched.
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- 1) the league itself — the anchor the user pointed at (unchanged) ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/profiles/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const nm = document.querySelector(".tleague .tl-nm");
    const n = document.querySelector(".tleague .tl-n");
    return {
      nmSize: nm ? getComputedStyle(nm).fontSize : "",
      nmFam: nm ? getComputedStyle(nm).fontFamily : "",
      nMono: n ? /mono|SF ?Mono|Menlo|Consolas|ui-monospace/i.test(getComputedStyle(n).fontFamily) : false,
    };
  });
  checkEq(r.nmSize, "11.5px", "Profiles league: manager names anchor the scale at 11.5px");
  check(!/mono/i.test(r.nmFam), "Profiles league: names use the sans family (not mono)");
  check(r.nMono, "Profiles league: figures use the mono family");
  checkErrs(errs, "profiles");
}

// ---- 2) the news feed matches that density (was 13/14px) -----------------
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const t = document.querySelector("#g-feed .g-feed-title");
    const body = getComputedStyle(document.body).fontSize;
    return { feed: t ? parseFloat(getComputedStyle(t).fontSize) : 0, body: parseFloat(body) };
  });
  check(r.feed > 0 && r.feed <= 12.5, `Home feed headlines sit at league density (≤12.5px, got ${r.feed}px)`);
  check(r.feed >= 11, `Home feed headlines stay legible (≥11px, got ${r.feed}px)`);
  check(r.body <= 12.1, `content default (--fs-content) is the terminal density, not 13.6px prose (got ${r.body}px)`);
  checkErrs(errs, "home");
}

await b.close();
srv.close();
finish();
