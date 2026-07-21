// The identity (email/sign-out) + last-refresh block must never sit in the top
// nav bar. On desktop it's lifted to the bottom of Home's right rail (the only
// page with one) / the app-page footer. On phones it's hidden in the bar (the
// /menu/ page owns it), so it must not be a visible top-bar element there.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

const place = (pg) => pg.evaluate(() => {
  const a = document.getElementById("account-nav");
  const s = document.getElementById("data-status");
  const zone = (el) => !el ? "MISSING"
    : el.closest(".topbar-right, .topbar, header.topbar") ? "TOPBAR"
    : el.closest(".g-side2") ? "RAIL"
    : el.closest(".footer, #g-footer") ? "FOOTER" : "OTHER";
  return { acct: zone(a), stat: zone(s) };
});

// Desktop: out of the top bar on every page; Home → rail, apps → footer.
for (const [path, want] of [["/", "RAIL"], ["/macro/", "FOOTER"], ["/credit/", "FOOTER"], ["/legal/", "FOOTER"]]) {
  const { ctx, pg, errs } = await open(b, DESKTOP, base + path);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(1500);
  const p = await place(pg);
  check(p.acct !== "TOPBAR" && p.stat !== "TOPBAR", `desktop ${path}: identity block NOT in the top bar`);
  checkEq(p.stat, want, `desktop ${path}: last-refresh in ${want}`);
  await ctx.close();
}

// Phone: the block must not be a VISIBLE element in the top bar (it's hidden
// there and surfaced in the /menu/ page instead).
for (const path of ["/", "/macro/"]) {
  const { ctx, pg } = await open(b, PHONE, base + path);
  await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
  await pg.waitForTimeout(1400);
  const vis = await pg.evaluate(() => {
    const a = document.getElementById("account-nav");
    const inBar = !!a && !!a.closest(".topbar-right, .topbar");
    return inBar && a.getClientRects().length > 0;
  });
  check(!vis, `phone ${path}: identity block is not a visible top-bar element`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
