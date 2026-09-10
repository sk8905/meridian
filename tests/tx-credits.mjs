// Transactions ▸ Credits sub-tab: a Deal flow / Credits mode toggle. Credits mode
// shows the European credit universe (ELLI) organised by sector with issuer
// ratings — or, until the sourced roster has landed, an honest "being compiled"
// state. Toggling swaps the chrome + body (no leftover deal-flow controls).
import { serve, launchChromium, open, PHONE, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, PHONE, `http://localhost:${srv.port}/v2/transactions/`);
await pg.evaluate(() => localStorage.setItem("m_signed_in", "1"));
await pg.waitForTimeout(1600);

// The primary mode toggle: Deal flow (default, on) + Credits.
const modes = await pg.evaluate(() => [...document.querySelectorAll("#tx-mode .tchip")].map((c) => ({ label: c.textContent.trim().replace(/\s+\d+$/, ""), on: c.classList.contains("is-on") })));
check(modes.length === 2 && modes[0].label === "Deal flow" && modes[1].label === "Credits", `mode chips are Deal flow / Credits (${modes.map((m) => m.label).join("/")})`);
check(modes[0].on && !modes[1].on, "Deal flow is the default mode");

// Deal-flow chrome shows the type table; the credits body is hidden.
const flow = await pg.evaluate(() => { const d = (id) => getComputedStyle(document.querySelector("#" + id)).display; return { period: d("tx-period-h"), body: d("tx-body"), credits: d("tx-credits-body") }; });
check(flow.period !== "none" && flow.body !== "none" && flow.credits === "none", "Deal flow mode shows the type table, hides the credits body");

// Switch to Credits.
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="credits"]').click());
await pg.waitForTimeout(300);
const cr = await pg.evaluate(() => {
  const d = (id) => getComputedStyle(document.querySelector("#" + id)).display;
  const cb = document.querySelector("#tx-credits-body");
  return {
    periodHidden: d("tx-period-h") === "none", flowSearchHidden: d("tx-flow-search") === "none", flowBodyHidden: d("tx-body") === "none",
    crSearchShown: d("tx-credits-search") !== "none", crBodyShown: d("tx-credits-body") !== "none",
    groups: cb.querySelectorAll(".tcr-grp").length,
    empty: !!cb.querySelector(".tw-empty"),
    text: (cb.textContent || "").trim().length,
  };
});
check(cr.periodHidden && cr.flowSearchHidden && cr.flowBodyHidden, "Credits mode hides all the deal-flow chrome (no leftover period/search/table)");
check(cr.crSearchShown && cr.crBodyShown, "Credits mode shows the credit search + roster body");
// Either the sourced roster (sector groups) or the honest "being compiled" state.
check((cr.groups > 0) || (cr.empty && cr.text > 0), `Credits body shows the sector roster or the compiling state (groups ${cr.groups})`);

// Toggling back restores Deal flow.
await pg.evaluate(() => document.querySelector('#tx-mode .tchip[data-mode="flow"]').click());
await pg.waitForTimeout(200);
checkEq(await pg.evaluate(() => getComputedStyle(document.querySelector("#tx-body")).display !== "none" && getComputedStyle(document.querySelector("#tx-credits-body")).display === "none"), true, "toggling back restores Deal flow");

checkErrs(errs, "transactions credits");
await ctx.close();
await b.close(); srv.close();
finish();
