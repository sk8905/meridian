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

// The chip row replaces the dropdown and lists every desk, in order. Scope to the
// news wire's desk chips (data-desk) — the manager wire reuses .g-feed-deskchip for
// its own label filter (data-mwcat), which must not be counted here.
const chips = await pg.evaluate(() => ({
  labels: [...document.querySelectorAll(".g-feed-deskchip[data-desk]")].map((c) => c.textContent.trim()),
  keys: [...document.querySelectorAll(".g-feed-deskchip[data-desk]")].map((c) => c.dataset.desk),
  noSelect: !document.querySelector("#g-feed-desk-sel"),
  dots: [...document.querySelectorAll(".g-feed-deskchip[data-desk]")].filter((c) => c.querySelector(".g-feed-deskdot")).length,
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
    noOpen: !document.querySelector(".g-feed-openbtn[data-open-desk]"),
    rows: document.querySelectorAll("#g-feed .g-feed-row").length,
  };
});
check(views.on && views.sep, "Views is a content lens (activates; set apart from the topic desks by a separator)");
check(views.noOpen, "Views shows no Open link (a cross-desk lens, not a routable desk)");
check(views.rows > 0, `Views surfaces commentary/research items (${views.rows})`);

// No per-desk "Open …" button anywhere — the desk chips filter the wire in place;
// the full desk views are reached through the app's own navigation, not from here.
const noOpenAnywhere = await pg.evaluate(() => {
  const seen = [];
  for (const d of ["c", "l", "m", "hdg", "n", "all", "views"]) {
    const chip = document.querySelector(`.g-feed-deskchip[data-desk="${d}"]`);
    if (chip) chip.click();
    if (document.querySelector(".g-feed-openbtn[data-open-desk]")) seen.push(d);
  }
  return seen;
});
check(noOpenAnywhere.length === 0, `no desk shows an "Open …" button (offenders: ${noOpenAnywhere.join(", ") || "none"})`);

// Group-by-type stays — it now sits alone at the right edge of the desk row.
const ctl = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="c"]').click();
  const row = document.querySelector(".g-feed-deskrow");
  const grp = row && row.querySelector(".g-feed-grpbtn");
  const openLeft = row && row.querySelector(".g-feed-openbtn:not(.g-feed-grpbtn)");
  return { hasGrp: !!grp, hasOpen: !!openLeft, grpStyled: grp ? grp.classList.contains("g-feed-openbtn") : false };
});
check(ctl.hasGrp && !ctl.hasOpen, "the desk row keeps only Group-by-type on its right edge (no Open button)");
check(ctl.grpStyled, "Group-by-type keeps the outlined-accent styling");

// "All" (the default) has no Open link — there's no single desk to open.
await pg.evaluate(() => { history.pushState({ v2: true }, "", "/v2/"); dispatchEvent(new PopStateEvent("popstate")); });
await pg.waitForTimeout(700);
const allNoOpen = await pg.evaluate(() => {
  document.querySelector('.g-feed-deskchip[data-desk="all"]').click();
  return !document.querySelector(".g-feed-openbtn[data-open-desk]");
});
check(allNoOpen, "the All-news view shows no Open link (nothing single to open)");

checkErrs(errs, "home feed desk switcher");
await ctx.close();
await b.close(); srv.close();
finish();
