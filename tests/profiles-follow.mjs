// Profiles watchlist star (☆/★) — the safety net for "I clicked the star and
// nothing happened". Profiles HOSTS the entity profile pages, but its click
// delegation used to handle only rows/links/chips, never `[data-follow]`, so the
// follow star in the profile header was DEAD on the live surface (observed:
// couldn't add Sona Asset Management, m38). This spec proves the header star now
// toggles ★/☆ on tap and persists to the shared follow store (which is
// cloud-synced to /api/watchlist — what the refresh routine reads for the
// watchlist deep-research).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => { try { localStorage.setItem("m_signed_in", "1"); localStorage.removeItem("meridian.follows"); } catch {} });
await pg.waitForTimeout(1500);

const cdp = await ctx.newCDPSession(pg);
const tapAt = async (x, y) => {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};

// Activate Profiles, then open a real manager profile.
const tb = await pg.evaluate(() => { const t = document.querySelector('.mobile-tabbar .mtab[data-key="profiles"]'); const r = t.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await tapAt(tb.x, tb.y);
await pg.waitForTimeout(1200);
checkEq(await pg.evaluate(() => document.documentElement.dataset.v2tab), "profiles", "Profiles tab is active");

const mid = await pg.evaluate(async () => (await import("/credit/js/data.js")).managers[0].id);
await pg.evaluate((id) => { location.hash = "#/manager/" + id; }, mid);
await pg.waitForTimeout(900);

// ---- detail-header star ---------------------------------------------------
const starBox = await pg.evaluate(() => {
  const fb = document.querySelector('#pf-detail [data-follow]');
  if (!fb) return null;
  const r = fb.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, follow: fb.getAttribute("data-follow"), on: fb.classList.contains("on"), txt: fb.textContent.trim() };
});
check(!!starBox, "detail: the profile header carries a watchlist star");
const stored = () => pg.evaluate(() => { try { return JSON.parse(localStorage.getItem("meridian.follows") || "{}"); } catch { return {}; } });
if (starBox) {
  const [type, id] = starBox.follow.split(":");
  check(!starBox.on && starBox.txt === "☆", "detail: the star starts empty (not following)");
  const before = await stored();
  check(!((before[type] || []).includes(id)), "detail: the id is not in the follow store yet");

  await tapAt(starBox.x, starBox.y);
  await pg.waitForTimeout(300);
  const afterOn = await pg.evaluate(() => { const fb = document.querySelector('#pf-detail [data-follow]'); return { on: fb.classList.contains("on"), txt: fb.textContent.trim() }; });
  check(afterOn.on && afterOn.txt === "★", "detail: tapping the star marks it following (★)");
  const s1 = await stored();
  check((s1[type] || []).includes(id), `detail: the follow PERSISTS to meridian.follows.${type} (cloud-synced to /api/watchlist)`);

  await tapAt(starBox.x, starBox.y);
  await pg.waitForTimeout(300);
  const afterOff = await pg.evaluate(() => { const fb = document.querySelector('#pf-detail [data-follow]'); return { on: fb.classList.contains("on"), txt: fb.textContent.trim() }; });
  check(!afterOff.on && afterOff.txt === "☆", "detail: tapping again un-follows (☆)");
  const s2 = await stored();
  check(!((s2[type] || []).includes(id)), "detail: the un-follow is removed from the store");
}

checkErrs(errs, "profiles follow star");
await ctx.close();
await b.close(); srv.close();
finish();
