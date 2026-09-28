// Type-scale contract — ONE font, ONE size knob, no per-device bump.
// The app is unified to a flat 5-step scale driven by a SINGLE offset token,
// --fs-adj (premium.css): micro/body/head/title/hero = 10/12/14/16/26px + --fs-adj.
// --fs-adj is currently -0.5px, so BODY = 11.5px everywhere. The whole app resizes
// by changing that one number. Body text — feed headlines, reading pane, list rows,
// table values, the league, the transactions type-list — is BODY on phone AND
// desktop. This guards against drift back to the old mixed sans/mono and the +1px
// mobile bump. The one font is --t-mono (Gotham, self-hosted via Montserrat).
// Sizes only — layout is untouched.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
// BODY, read live from the --fs-adj knob so the spec tracks it (12 + adj).
const bodyPx = (adj) => `${12 + adj}px`;
// The one app family, as it appears in a computed font-family string. Must NOT be
// a monospace stack (the pre-unification mixed sans/mono is what we guard against).
const isAppFont = (fam) => /montserrat|gotham|futura/i.test(fam || "") && !/mono/i.test(fam || "");

// ---- 1) the Profiles league — names AND figures are one app font at BODY size ----
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
      adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
      nmSize: a && a.fontSize, nmFam: a && a.fontFamily,
      nSize: c && c.fontSize, nFam: c && c.fontFamily,
    };
  });
  checkEq(r.bump, 0, "no per-device bump: --fs-bump resolves to 0 on phones (same size on both)");
  checkEq(r.nmSize, bodyPx(r.adj), `Profiles league: manager names are the body size (${bodyPx(r.adj)})`);
  check(isAppFont(r.nmFam), "Profiles league: manager names use the one app font (Gotham)");
  check(isAppFont(r.nFam), "Profiles league: figures use the one app font (Gotham)");
  checkErrs(errs, "profiles");
}

// ---- 2) the news feed headlines are the same BODY size ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => {
    const t = document.querySelector("#g-feed .g-feed-title");
    const cs = t ? getComputedStyle(t) : null;
    return {
      feed: cs ? cs.fontSize : "", feedFam: cs ? cs.fontFamily : "",
      body: parseFloat(getComputedStyle(document.body).fontSize),
      adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
    };
  });
  checkEq(r.feed, bodyPx(r.adj), `Home feed headlines are the body size (${bodyPx(r.adj)})`);
  check(isAppFont(r.feedFam), "Home feed headlines use the one app font (Gotham)");
  checkEq(r.body, 12 + r.adj, "content default (--fs-content / body) is 12px + --fs-adj");
}

// ---- 3) Transactions type-list rows read at the same BODY size ----
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
      adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
    };
  });
  checkEq(r.rowSize, bodyPx(r.adj), `Transactions type-list: the option row is the body size (${bodyPx(r.adj)})`);
  checkEq(r.lblSize, bodyPx(r.adj), `Transactions type-list: the type name is the body size (${bodyPx(r.adj)})`);
  check(isAppFont(r.lblFam), "Transactions type-list: the type name uses the one app font (Gotham)");
  check(isAppFont(r.nFam), "Transactions type-list: the count uses the one app font (Gotham)");
  checkErrs(errs, "transactions type-list");
}

// ---- 4) BODY on BOTH — the same body size holds on the desktop terminal ----
{
  const { pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForTimeout(1500);
  const r = await pg.evaluate(() => ({
    bump: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-bump")) || 0,
    adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
    body: parseFloat(getComputedStyle(document.body).fontSize),
  }));
  checkEq(r.bump, 0, "desktop: --fs-bump is 0 (no device offset)");
  checkEq(r.body, 12 + r.adj, "desktop: body text is 12px + --fs-adj — identical to phone");
  checkErrs(errs, "desktop home");
}

await b.close();
srv.close();
finish();
