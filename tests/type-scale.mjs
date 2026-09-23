// Type-scale contract — ONE font, ONE body size, no per-device bump.
// The app was unified to a single flat 5-step px scale (micro 10 · body 12 ·
// head 14 · title 16 · hero 26) in ONE font (--t-mono, the terminal monospace).
// Body text — feed headlines, reading pane, list rows, table values, the league,
// the transactions type-list — is 12px on phone AND desktop. This guards against
// drift back to the old mixed sans/mono, the 11.5px league density, and the +1px
// mobile bump. Sizes only — layout is untouched.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const isMono = (fam) => /mono|SF ?Mono|SFMono|Menlo|Consolas|ui-monospace/i.test(fam || "");

// ---- 1) the Profiles league — names AND figures are now one 12px mono ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/profiles/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const nm = document.querySelector(".tleague .tl-nm");
    const n = document.querySelector(".tleague .tl-n");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const a = cs(nm), c = cs(n);
    return {
      bump: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-bump")) || 0,
      nmSize: a && a.fontSize, nmFam: a && a.fontFamily,
      nSize: c && c.fontSize, nFam: c && c.fontFamily,
    };
  });
  checkEq(r.bump, 0, "no per-device bump: --fs-bump resolves to 0 on phones (12px on both)");
  checkEq(r.nmSize, "12px", "Profiles league: manager names are the 12px body size");
  check(isMono(r.nmFam), "Profiles league: manager names use the one mono font");
  check(isMono(r.nFam), "Profiles league: figures use the one mono font");
  checkErrs(errs, "profiles");
}

// ---- 2) the news feed headlines are the same 12px mono body size ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const t = document.querySelector("#g-feed .g-feed-title");
    const cs = t ? getComputedStyle(t) : null;
    return {
      feed: cs ? cs.fontSize : "", feedFam: cs ? cs.fontFamily : "",
      body: parseFloat(getComputedStyle(document.body).fontSize),
    };
  });
  checkEq(r.feed, "12px", "Home feed headlines are the 12px body size");
  check(isMono(r.feedFam), "Home feed headlines use the one mono font");
  checkEq(r.body, 12, "content default (--fs-content / body) is 12px");
}

// ---- 3) Transactions type-list rows read at the same 12px mono body size ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector(".tx-typelist .tx-typeopt", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
    const opt = document.querySelector(".tx-typeopt");
    const lbl = document.querySelector(".tx-typeopt .tx-typeopt-l") || opt;
    const n = document.querySelector(".tx-typeopt .tx-typeopt-n");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const o = cs(opt), l = cs(lbl), c = cs(n);
    return {
      rowSize: o && o.fontSize, lblSize: l && l.fontSize, lblFam: l && l.fontFamily,
      nFam: c && c.fontFamily,
    };
  });
  checkEq(r.rowSize, "12px", "Transactions type-list: the option row is the 12px body size");
  checkEq(r.lblSize, "12px", "Transactions type-list: the type name is 12px");
  check(isMono(r.lblFam), "Transactions type-list: the type name uses the one mono font");
  check(isMono(r.nFam), "Transactions type-list: the count uses the one mono font");
  checkErrs(errs, "transactions type-list");
}

// ---- 4) 12px on BOTH — the same body size holds on the desktop terminal ----
{
  const { pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => ({
    bump: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-bump")) || 0,
    body: parseFloat(getComputedStyle(document.body).fontSize),
  }));
  checkEq(r.bump, 0, "desktop: --fs-bump is 0 (no device offset)");
  checkEq(r.body, 12, "desktop: body text is 12px too — identical to phone");
  checkErrs(errs, "desktop home");
}

await b.close();
srv.close();
finish();
