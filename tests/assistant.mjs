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
  return { vis: !p.hidden, input: !!p.querySelector(".na-ask-in"), hint: !!p.querySelector(".na-ask-hint") };
});
check(opened.vis, "Ask button opens the Ask Wire panel");
check(opened.input && opened.hint, "panel shows a question input and an initial hint");

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

checkErrs(errs, "ask wire");
await ctx.close();
await b.close(); srv.close();
finish();
