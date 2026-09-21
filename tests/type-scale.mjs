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

// ---- 3) Transactions ▸ iPhone type-list reads at the SAME league density ----
// The on-screen type options (Primary ▸ Direct lending / unitranche, …) must be
// the app's 11.5px list-row scale — name in sans, count in mono — NOT a bespoke
// oversized 14px. This is exactly the drift the user has repeatedly flagged, so
// it is pinned here alongside the league anchor.
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector(".tx-typelist .tx-typeopt", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
    const opt = document.querySelector(".tx-typeopt");
    const lbl = document.querySelector(".tx-typeopt .tx-typeopt-l") || opt;
    const n = document.querySelector(".tx-typeopt .tx-typeopt-n");
    const caret = document.querySelector(".tx-typeopt .tx-typeopt-caret");
    const mono = (el) => (el ? /mono|SF ?Mono|Menlo|Consolas|ui-monospace/i.test(getComputedStyle(el).fontFamily) : false);
    return {
      rowSize: opt ? getComputedStyle(opt).fontSize : "",
      lblSize: lbl ? getComputedStyle(lbl).fontSize : "",
      lblMono: mono(lbl),
      nMono: mono(n),
      caretSize: caret ? parseFloat(getComputedStyle(caret).fontSize) : 0,
    };
  });
  checkEq(r.rowSize, "11.5px", "Transactions type-list: the option row sits at the 11.5px league density (not 14px)");
  checkEq(r.lblSize, "11.5px", "Transactions type-list: the type name is 11.5px, like every other app row");
  check(!r.lblMono, "Transactions type-list: the type name uses the sans family (matches league names)");
  check(r.nMono, "Transactions type-list: the count uses the mono family (every figure in the app is mono)");
  check(r.caretSize <= 14, `Transactions type-list: the drill caret is app-scaled, not oversized (${r.caretSize}px)`);
  checkErrs(errs, "transactions type-list");
}

await b.close();
srv.close();
finish();
