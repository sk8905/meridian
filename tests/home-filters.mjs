// Home news-feed primary filter is a VISIBLE, colour-anchored desk chip row
// (F6 — was a hidden <select>): All · Macro · Equities · Fixed Income · Credit ·
// Hedge · Legal. Macro/Credit/Hedge/Legal are their own desks; Equities & Fixed
// Income are keyword views over the macro stream. Selecting a real desk reveals an
// "Open <desk>" link into its full view (F3).
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(2500);

// The chip row replaces the dropdown and lists every desk, in order.
const chips = await pg.evaluate(() => ({
  labels: [...document.querySelectorAll(".g-feed-deskchip")].map((c) => c.textContent.trim()),
  keys: [...document.querySelectorAll(".g-feed-deskchip")].map((c) => c.dataset.desk),
  noSelect: !document.querySelector("#g-feed-desk-sel"),
  dots: [...document.querySelectorAll(".g-feed-deskchip")].filter((c) => c.querySelector(".g-feed-deskdot")).length,
}));
checkEq(chips.labels.join(" · "), "All · Views · Macro · Equities · Fixed Income · Credit · Hedge · Legal · Newsletters",
  "home feed chips: All + Views lenses, then the ordered topic desks incl. Newsletters");
check(chips.noSelect, "the hidden <select> desk filter is gone (chips are the visible control)");
check(chips.dots === 7, `seven topic desks carry a colour dot; the All/Views lenses have none (${chips.dots})`);

// Switching desks activates the chip (aria-selected + is-on) and re-renders.
const switched = await pg.evaluate(() => {
  const out = {};
  for (const k of ["eq", "fi", "hdg", "m", "c", "l", "n"]) {
    const chip = document.querySelector(`.g-feed-deskchip[data-desk="${k}"]`);
    chip.click();
    const now = document.querySelector(`.g-feed-deskchip[data-desk="${k}"]`);
    out[k] = now.classList.contains("is-on") && now.getAttribute("aria-selected") === "true";
  }
  return out;
});
check(Object.values(switched).every(Boolean), `every desk chip activates on click (${Object.entries(switched).map(([k, v]) => k + (v ? "✓" : "✗")).join(" ")})`);

// Macro no longer carries the All/News/Comm sub-chip row (removed in favour of a
// dedicated commentary filter).
const macroSubs = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="m"]').click();
  return document.querySelectorAll(".g-feed-chip[data-type]").length;
});
checkEq(macroSubs, 0, "Macro shows no All/News/Comm sub-chips");

// F: the cross-desk "Views" commentary lane — serious analysis, not headlines.
const views = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="views"]').click();
  const chip = document.querySelector('.g-feed-deskchip[data-desk="views"]');   // re-query: the click rebuilds the chip row
  return {
    on: chip.classList.contains("is-on"),
    sep: chip.classList.contains("g-feed-deskchip-sep"),
    noOpen: !document.querySelector(".g-feed-openbtn"),
    rows: document.querySelectorAll("#g-feed .g-feed-row").length,
  };
});
check(views.on && views.sep, "Views is a content lens (activates; set apart from the topic desks by a separator)");
check(views.noOpen, "Views shows no Open link (a cross-desk lens, not a routable desk)");
check(views.rows > 0, `Views surfaces commentary/research items (${views.rows})`);

// F3 — a real desk shows an "Open <desk>" control that routes to its full view.
const openBtn = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="c"]').click();
  const b = document.querySelector(".g-feed-openbtn");
  return { present: !!b, text: b ? b.textContent.trim() : "", route: b ? b.dataset.openDesk : "" };
});
check(openBtn.present, "Credit desk selected: an 'Open …' link into the full desk view appears");
checkEq(openBtn.route, "/v2/credit/", "the Open link routes to the Credit desk view");

// The Newsletters filter narrows the wire and offers its own reading surface.
const nl = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="n"]').click();
  const chip = document.querySelector('.g-feed-deskchip[data-desk="n"]');
  const b = document.querySelector(".g-feed-openbtn");
  return { on: chip.classList.contains("is-on"), route: b ? b.dataset.openDesk : "", text: b ? b.textContent.trim() : "" };
});
check(nl.on, "Newsletters filter activates");
checkEq(nl.route, "/v2/newsletters/", "Newsletters shows an Open link to its reading surface");
// Restore the Credit selection for the navigation test below.
await pg.evaluate(() => document.querySelector('.g-feed-deskchip[data-desk="c"]').click());

// Clicking it navigates to the Credit view (SPA route via the router).
await pg.evaluate(() => document.querySelector(".g-feed-openbtn").click());
await pg.waitForTimeout(900);
checkEq(await pg.evaluate(() => new URL(location.href).pathname), "/v2/credit/", "Open Credit navigates to /v2/credit/");
checkEq(await pg.evaluate(() => (document.querySelector(".v2-view:not([hidden])") || {}).dataset?.view), "credit", "the Credit desk view is now active");

// "All" (the default) has no Open link — there's no single desk to open.
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(700);
const allNoOpen = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="all"]').click();
  return !document.querySelector(".g-feed-openbtn");
});
check(allNoOpen, "the All-news view shows no Open link (nothing single to open)");

checkErrs(errs, "home feed desk switcher");
await ctx.close();
await b.close(); srv.close();
finish();
