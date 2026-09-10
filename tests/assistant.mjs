// Ask Wire assistant (feature B). The header "Ask Wire" button opens a Q&A panel
// that POSTs the question (+ a compact roster context) to the Access-gated
// /api/ask Worker route and renders the answer with its sourced links. The Worker
// route is dormant until ANTHROPIC_API_KEY is set; here we stub /api/ask to
// exercise the client wiring — the answer path, the sourced links, and the
// graceful "not switched on yet" (unconfigured) path.
import { serve, launchChromium, open, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, { viewport: { width: 1440, height: 900 }, colorScheme: "dark" }, base + "/v2/");
await pg.waitForTimeout(1500);

check(await pg.evaluate(() => !!document.getElementById("na-ask")), "Ask Wire button present in the header cluster");
check(await pg.evaluate(() => !!document.getElementById("na-ask-panel")), "Ask Wire panel built");

// Stub the endpoint with a canned answer + one source.
await pg.route("**/api/ask", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ answer: "Sona is the largest tracked manager.", sources: [{ url: "https://sona-am.com/about/", title: "Sona — About" }] }),
}));

await pg.evaluate(() => document.getElementById("na-ask").click());
await pg.waitForTimeout(300);
const opened = await pg.evaluate(() => {
  const p = document.getElementById("na-ask-panel");
  return { vis: !p.hidden, input: !!p.querySelector(".na-ask-in"), ask: !!p.querySelector(".na-ask-go"), noHint: !p.querySelector(".na-ask-hint") };
});
check(opened.vis, "Ask button opens the Ask Wire panel");
check(opened.input && opened.ask, "panel shows a question input and an Ask button");
check(opened.noHint, "no idle explainer text in the header Ask panel");

await pg.evaluate(() => { document.querySelector(".na-ask-in").value = "Who is the biggest manager?"; document.querySelector(".na-ask-form").requestSubmit(); });
await pg.waitForTimeout(500);
const ans = await pg.evaluate(() => ({
  a: ((document.querySelector(".na-ask-answer") || {}).textContent || ""),
  s: document.querySelectorAll(".na-ask-srcs a[href^='http']").length,
}));
check(ans.a.includes("largest tracked manager"), "renders the assistant's answer");
check(ans.s === 1, `every answer carries its sourced links (${ans.s})`);

// Dormant / unconfigured route (no ANTHROPIC_API_KEY) shows a graceful note.
await pg.unroute("**/api/ask");
await pg.route("**/api/ask", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ unconfigured: true, message: "The assistant isn’t switched on yet." }),
}));
await pg.evaluate(() => { document.querySelector(".na-ask-in").value = "anything"; document.querySelector(".na-ask-form").requestSubmit(); });
await pg.waitForTimeout(400);
check(await pg.evaluate(() => ((document.querySelector(".na-ask-err") || {}).textContent || "").includes("switched on")),
  "dormant (unconfigured) route shows a graceful note, not an error");

// The countdown ring moved OUT of the header action cluster to sit beside the
// "Last refresh" marker; verify it left the cluster and landed in a refresh slot.
check(await pg.evaluate(() => !document.querySelector(".na-actions .na-ring")), "countdown ring no longer in the header action cluster");
check(await pg.evaluate(() => !!document.querySelector(".ds-text .na-ring")), "countdown ring renders beside the Last refresh marker");

// Feature C ("Add" → propose a firm → open a PR) now lives in the Menu → Dialogue
// chip, NOT the header Ask panel (which is Ask-only). Close the header panel and
// open the Menu to drive Add there.
await pg.keyboard.press("Escape");
await pg.waitForTimeout(150);
await pg.evaluate(() => { const b = document.querySelector(".nav-menu-btn") || document.querySelector('.mtab[data-key="menu"]'); if (b) b.click(); });
await pg.waitForTimeout(700);
check(await pg.evaluate(() => [...document.querySelectorAll(".v2-menu .na-menu-bar .tchip")].map((c) => c.textContent.trim()).join("/") === "Dialogue/Coverage/Settings"), "Menu shows the Dialogue/Coverage/Settings chips");
// Dialogue chip (default): a BARE Ask field — one input styled like .tsearch,
// NO action button (Search/Add/Ask all absent); Enter submits.
check(await pg.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); return !!c && c.querySelectorAll(".na-ask-in").length === 1 && !c.querySelector(".na-ask-search") && !c.querySelector(".na-ask-go") && !c.querySelector(".na-ask-add"); }), "Dialogue chip is a bare Ask field: one input, no buttons");
check(await pg.evaluate(() => { const i = document.querySelector("#v2-menu-omni .na-ask-in"); return !!i && /ask/i.test(i.placeholder) && !/search/i.test(i.placeholder); }), "Dialogue placeholder is the Ask prompt (no 'Search…')");
check(await pg.evaluate(() => !document.querySelector("#v2-menu-omni .na-ask-hint")), "no idle explainer text in the Dialogue Ask box");
// Enter (form submit) still fires an Ask even with no button.
await pg.route("**/api/ask", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answer: "Apollo is the biggest.", sources: [] }) }));
await pg.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); c.querySelector(".na-ask-in").value = "Biggest manager?"; c.querySelector(".na-ask-form").requestSubmit(); });
await pg.waitForTimeout(400);
check(await pg.evaluate(() => (document.querySelector("#v2-menu-omni .na-ask-answer")?.textContent || "").includes("Apollo")), "bare Ask field submits on Enter and renders the answer");
await pg.unroute("**/api/ask");
// Coverage chip: Add (C) + Network.
await pg.evaluate(() => document.querySelector('.v2-menu .na-menu-bar .tchip[data-sec="coverage"]').click());
await pg.waitForTimeout(300);
check(await pg.evaluate(() => !!document.querySelector("#v2-menu-add .na-ask-add") && !document.querySelector("#v2-menu-add .na-ask-go")), "Coverage chip has Add (C) only, no Ask");
check(await pg.evaluate(() => !!document.querySelector(".v2-menu .wire-net")), "Coverage chip includes the Network importer");

await pg.route("**/api/propose", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ prUrl: "https://github.com/sk8905/meridian/pull/123", prNumber: 123, name: "Example Capital", sources: [{ url: "https://example.com/", title: "Example" }] }),
}));
await pg.evaluate(() => { const c = document.querySelector("#v2-menu-add"); c.querySelector(".na-ask-in").value = "Example Capital"; c.querySelector(".na-ask-add").click(); });
await pg.waitForTimeout(500);
const proposed = await pg.evaluate(() => { const c = document.querySelector("#v2-menu-add"); return {
  a: ((c.querySelector(".na-ask-answer") || {}).textContent || ""),
  pr: [...c.querySelectorAll(".na-ask-srcs a[href]")].some((x) => x.href.includes("/pull/123")),
}; });
check(proposed.a.includes("pull request"), "Add renders the drafted-and-PR-opened confirmation");
check(proposed.pr, "renders the pull-request link");

await pg.unroute("**/api/propose");
await pg.route("**/api/propose", (route) => route.fulfill({
  status: 200, contentType: "application/json",
  body: JSON.stringify({ unconfigured: true, message: "Proposing additions isn’t switched on yet." }),
}));
await pg.evaluate(() => { const c = document.querySelector("#v2-menu-add"); c.querySelector(".na-ask-in").value = "X Capital"; c.querySelector(".na-ask-add").click(); });
await pg.waitForTimeout(400);
check(await pg.evaluate(() => ((document.querySelector("#v2-menu-add .na-ask-err") || {}).textContent || "").includes("switched on")),
  "dormant propose route shows a graceful note");

checkErrs(errs, "ask wire");
await ctx.close();
await b.close(); srv.close();
finish();
