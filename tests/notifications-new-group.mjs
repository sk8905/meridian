// Notifications pane: new (unseen, orange) items group together at the TOP under
// a "New" heading the FIRST time they're viewed; opening marks them seen, so on
// the next open the headings drop and they assimilate into the date-sorted list.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/`);
// Seed an EMPTY seen-set (not null) so the current items read as new without the
// first-run baseline suppressing them.
await pg.evaluate(() => {
  localStorage.setItem("m_signed_in", "1");
  localStorage.setItem("meridian.credit.notifSeen", "[]");
  localStorage.setItem("meridian.legal.notifSeen", "[]");
});
await pg.waitForTimeout(1600);

check(await pg.evaluate(() => !!document.getElementById("na-notif")), "Notifications bell present in the header");
await pg.evaluate(() => document.getElementById("na-notif") && document.getElementById("na-notif").click());
await pg.waitForTimeout(700);

const first = await pg.evaluate(() => {
  const p = document.getElementById("na-notif-panel");
  const rows = Array.from(p.querySelectorAll(".nf-row"));
  let contiguous = true, seenNonNew = false;
  for (const r of rows) { const isNew = r.classList.contains("nf-new"); if (isNew && seenNonNew) contiguous = false; if (!isNew) seenNonNew = true; }
  return {
    groups: Array.from(p.querySelectorAll(".nf-grp")).map((g) => g.textContent.trim()),
    rows: rows.length,
    firstRowNew: rows.length ? rows[0].classList.contains("nf-new") : false,
    newContiguous: contiguous,
  };
});
check(first.rows > 0, `notifications pane lists recent items (${first.rows})`);
check(first.groups.includes("New"), "first view groups new items under a 'New' heading");
check(first.firstRowNew, "the first row is a new (orange) item");
check(first.newContiguous, "all new items sit contiguously at the top");

// Close and reopen — the first open marked them seen, so nothing is fresh now.
await pg.evaluate(() => document.getElementById("na-notif").click());
await pg.waitForTimeout(250);
await pg.evaluate(() => document.getElementById("na-notif").click());
await pg.waitForTimeout(600);
const second = await pg.evaluate(() => {
  const p = document.getElementById("na-notif-panel");
  return {
    groups: p.querySelectorAll(".nf-grp").length,
    newRows: p.querySelectorAll(".nf-row.nf-new").length,
    rows: p.querySelectorAll(".nf-row").length,
  };
});
check(second.groups === 0, "on reopen the New/Earlier headings are gone");
check(second.newRows === 0, "on reopen nothing is highlighted as new (assimilated by date)");
check(second.rows > 0, "on reopen the items are still listed (by date)");

checkErrs(errs, "notifications new-group");
await ctx.close();
await b.close(); srv.close();
finish();
