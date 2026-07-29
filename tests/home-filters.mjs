// Home news-feed primary filter mirrors the Dashboard sections: a single-select
// with All news · Macro · Equities · Fixed Income · Credit · Hedge Funds · Legal.
// Macro/Credit/Hedge/Legal are their own desks; Equities & Fixed Income are keyword
// views over the macro stream, so the filter set lines up with the dashboard.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(2500);

const opts = await pg.evaluate(() => {
  const sel = document.querySelector("#g-feed-desk-sel");
  return sel ? [...sel.options].map((o) => o.textContent) : [];
});
checkEq(opts.join(" · "), "All news · Macro · Equities · Fixed Income · Credit · Hedge Funds · Legal",
  "home feed has the six ordered, labelled filters (mirrors the Dashboard)");

// Switching to each new filter re-renders without error and reflects the selection.
const switched = await pg.evaluate(() => {
  const sel = document.querySelector("#g-feed-desk-sel");
  const out = {};
  for (const v of ["eq", "fi", "hdg", "m"]) {
    sel.value = v; sel.dispatchEvent(new Event("change"));
    out[v] = document.querySelector("#g-feed-desk-sel").value;
  }
  return out;
});
check(switched.eq === "eq" && switched.fi === "fi" && switched.hdg === "hdg", "Equities / Fixed Income / Hedge Funds filters activate");

checkErrs(errs, "home feed filters");
await ctx.close();
await b.close(); srv.close();
finish();
