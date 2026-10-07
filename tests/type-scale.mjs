// Type-scale contract — ONE font, ONE size knob, no per-device bump.
// The app is unified to a flat 5-step scale driven by a SINGLE offset token,
// --fs-adj (premium.css): micro/body/head/title/hero = 10/12/14/16/26px + --fs-adj.
// --fs-adj's baseline is 0.5px, so BODY = 12.5px everywhere (the reader can nudge
// it in Menu → Settings → Text size). The whole app resizes by changing that one
// number, so every assertion reads --fs-adj live. Body text — feed headlines,
// reading pane, list rows,
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

// ---- 3) Transactions type-filter chips read at the same BODY size ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector(".tx-typestrip .tx-secchip", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const r = await pg.evaluate(() => {
    const chip = document.querySelector(".tx-typestrip .tx-secchip");
    const n = chip && chip.querySelector(".tx-secn");
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const o = cs(chip), c = cs(n);
    return {
      chipSize: o && o.fontSize, chipFam: o && o.fontFamily, nFam: c && c.fontFamily,
      adj: parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0,
    };
  });
  checkEq(r.chipSize, bodyPx(r.adj), `Transactions type filter: the type chip reads at the body size (${bodyPx(r.adj)})`);
  check(isAppFont(r.chipFam), "Transactions type filter: the type chip uses the one app font (Gotham)");
  check(isAppFont(r.nFam), "Transactions type filter: the count uses the one app font (Gotham)");
  checkErrs(errs, "transactions type filter");
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

// ---- 5) fine print (`.small`) is the META tier, never larger than body ----
// `.small` tags dates, sources, captions and empty states ("Nothing tracked
// yet."). premium.css owns it as --fs-item-meta (= --fs-micro, 10 + adj), i.e.
// SMALLER than body. The retired desk stylesheets each used to carry a legacy
// `.small { font-size:var(--fs-head) }` (14 + adj) that, imported AFTER premium
// in the v2 bundle, inflated every "muted small" caption ABOVE the body size.
// This guards against that regression — on a REAL empty state and on a probe.
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/transactions/");
  await pg.waitForSelector(".tx-typestrip", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    const adj = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--fs-adj")) || 0;
    const body = parseFloat(getComputedStyle(document.body).fontSize);
    // Probe the cascade directly: a bare `.small` and a `.muted.small` caption.
    const mk = (cls) => { const el = document.createElement("span"); el.className = cls; el.textContent = "x"; document.body.appendChild(el); const s = parseFloat(getComputedStyle(el).fontSize); el.remove(); return s; };
    // A real rendered empty state: filter the type list to nothing.
    const q = document.querySelector(".tx-dash input[type='search'], .tx-dash .tx-q, #tx-q");
    let emptyPx = null;
    if (q) { q.value = "zzzqqqnomatch"; q.dispatchEvent(new Event("input", { bubbles: true })); }
    const empty = document.querySelector(".tw-empty.small, .tw-empty.muted.small");
    if (empty) emptyPx = parseFloat(getComputedStyle(empty).fontSize);
    return { adj, body, smallPx: mk("small"), mutedSmallPx: mk("muted small"), emptyPx };
  });
  checkEq(r.smallPx, 10 + r.adj, `.small is the meta tier (--fs-micro ${10 + r.adj}px), not head size`);
  checkEq(r.mutedSmallPx, 10 + r.adj, `"muted small" captions are the meta tier (${10 + r.adj}px)`);
  check(r.smallPx < r.body, `fine print (.small ${r.smallPx}px) is smaller than body (${r.body}px) — not larger`);
  if (r.emptyPx != null) check(r.emptyPx <= r.body + 0.01, `real empty-state text (${r.emptyPx}px) is not larger than body (${r.body}px)`);
  checkErrs(errs, "fine-print scale");
}

await b.close();
srv.close();
finish();
