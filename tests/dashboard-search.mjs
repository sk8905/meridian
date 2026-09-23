// The Dashboard search is scoped to the visible SECTION and sits beneath the section
// chips (the Profiles/Transactions pattern) — not the old global palette band above
// them. Each section gets its own placeholder and filters its own cards/rows in place;
// Legal opts out (it carries its own case-law search).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// ---- Macro: section-specific search below the chips, filters in place ----
{
  const { pg, errs } = await open(b, PHONE, base + "/v2/dashboard/macro/");
  await pg.waitForSelector(".dsh-railnav", { timeout: 8000 });
  await pg.waitForTimeout(500);
  const s = await pg.evaluate(() => {
    const mid = document.querySelector(".dsh-mid");
    const search = document.querySelector(".dsh-search");
    const input = document.querySelector(".dsh-q");
    return {
      noTopBand: !document.querySelector(".dsh > .wire-band"),
      searchInMid: !!(mid && mid.firstElementChild && mid.firstElementChild.classList.contains("dsh-search")),
      hasInput: !!input,
      placeholder: input ? input.getAttribute("placeholder") : "",
    };
  });
  check(s.noTopBand, "no global search band above the chips");
  check(s.searchInMid, "the search sits beneath the chips (first element of the section body)");
  check(s.hasInput, "the section carries a search input");
  checkEq(s.placeholder, "Search Macro…", "the placeholder names the section (Macro)");

  // Filter: a no-match query hides every card; clearing restores them.
  const f = await pg.evaluate(() => {
    const inp = document.querySelector(".dsh-q");
    const vis = () => [...document.querySelectorAll(".dsh-mid .dsh-card")].filter((c) => !c.hidden).length;
    const before = vis();
    inp.value = "zqxjnothing"; inp.dispatchEvent(new Event("input", { bubbles: true }));
    const none = vis();
    inp.value = ""; inp.dispatchEvent(new Event("input", { bubbles: true }));
    return { before, none, restored: vis() };
  });
  check(f.before > 0 && f.none === 0, `a no-match query hides every card (${f.before} → ${f.none})`);
  check(f.restored === f.before, `clearing the query restores every card (${f.restored})`);
  checkErrs(errs, "dashboard macro search");
}

// ---- The placeholder tracks the section (Equities) ----
{
  const { pg } = await open(b, PHONE, base + "/v2/dashboard/equities/");
  await pg.waitForSelector(".dsh-q", { timeout: 8000 });
  const ph = await pg.evaluate(() => document.querySelector(".dsh-q").getAttribute("placeholder"));
  checkEq(ph, "Search Equities…", "the Equities section names itself in the placeholder");
}

// ---- Legal keeps its OWN case search — no duplicate section search ----
{
  const { pg } = await open(b, PHONE, base + "/v2/dashboard/legal/");
  await pg.waitForSelector(".dsh-railnav", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const legal = await pg.evaluate(() => ({
    noGenericSearch: !document.querySelector(".dsh-search"),
    hasOwnSearch: !!document.querySelector(".dsh-lgl-search, .dsh-lgl-q, input[type=search]"),
  }));
  check(legal.noGenericSearch, "Legal does not add the generic section search");
  check(legal.hasOwnSearch, "Legal keeps its own case-law search");
}

await b.close();
srv.close();
finish();
