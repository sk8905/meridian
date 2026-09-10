// Ask Wire assistant (feature B). The header "Ask Wire" button opens a Q&A panel
// that POSTs the question (+ a compact roster context) to the Access-gated
// /api/ask Worker route and renders the answer with its sourced links. The Worker
// route is dormant until ANTHROPIC_API_KEY is set; here we stub /api/ask to
// exercise the client wiring — the answer path, the sourced links, and the
// graceful "not switched on yet" (unconfigured) path.
import { serve, launchChromium, open, PHONE, check, checkErrs, finish } from "./lib.mjs";

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
check(await pg.evaluate(() => [...document.querySelectorAll(".v2-menu .na-menu-bar .tchip")].map((c) => c.textContent.trim()).join("/") === "Chat/Coverage/Settings"), "Menu shows the Chat/Coverage/Settings chips");
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

// ---- Multi-turn CHAT: follow-ups keep a transcript and carry prior turns ----
// Reset any transcript from the single-ask test above, then drive two turns
// through a capturing stub that numbers its answers and records each request.
await pg.evaluate(() => document.querySelector("#v2-menu-omni .na-chat-clear")?.click());
await pg.waitForTimeout(120);
await pg.unroute("**/api/ask");
const asked = [];
let askN = 0;
await pg.route("**/api/ask", (route) => {
  try { asked.push(JSON.parse(route.request().postData() || "{}")); } catch { asked.push(null); }
  askN += 1;
  route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answer: `Answer number ${askN}.`, sources: [{ url: "https://example.com/s" + askN, title: "Source " + askN }] }) });
});
await pg.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); c.querySelector(".na-ask-in").value = "First question about Apollo?"; c.querySelector(".na-ask-form").requestSubmit(); });
await pg.waitForTimeout(400);
await pg.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); c.querySelector(".na-ask-in").value = "And its AUM?"; c.querySelector(".na-ask-form").requestSubmit(); });
await pg.waitForTimeout(400);
const chat = await pg.evaluate(() => {
  const c = document.querySelector("#v2-menu-omni");
  const turns = [...c.querySelectorAll(".na-chat-turn")];
  return {
    count: turns.length,
    qs: turns.map((t) => (t.querySelector(".na-chat-q")?.textContent || "").trim()),
    as: turns.map((t) => (t.querySelector(".na-ask-answer")?.textContent || "").trim()),
    inputEmpty: (c.querySelector(".na-ask-in")?.value || "") === "",
    followPh: /follow-up/i.test(c.querySelector(".na-ask-in")?.placeholder || ""),
    hasClear: !!c.querySelector(".na-chat-clear"),
  };
});
check(chat.count === 2, `chat keeps a transcript of both turns (${chat.count})`);
check(chat.qs[0] === "And its AUM?" && chat.qs[1] === "First question about Apollo?", `transcript is newest-first (${chat.qs.join(" | ")})`);
check(chat.as[0].includes("number 2") && chat.as[1].includes("number 1"), `each turn keeps its own answer (${chat.as.join(" | ")})`);
check(chat.inputEmpty, "the input clears after each send");
check(chat.followPh, "the placeholder invites a follow-up once a chat is going");
check(chat.hasClear, "a 'New chat' control appears");
const followReq = asked[asked.length - 1];
check(followReq && Array.isArray(followReq.history) && followReq.history.length === 1
  && /First question about Apollo/.test(followReq.history[0].q) && /Answer number 1/.test(followReq.history[0].a),
  `the follow-up request carries the prior turn as history (${JSON.stringify(followReq && followReq.history)})`);
// Sources are COLLAPSED by default — a <details> disclosure, not an open list.
const src = await pg.evaluate(() => {
  const d = document.querySelector("#v2-menu-omni .na-ask-srcd");
  return { isDetails: !!d && d.tagName === "DETAILS", open: d ? d.open : null,
    summary: d ? (d.querySelector("summary")?.textContent || "").trim() : "",
    linksVisible: d ? d.querySelectorAll(".na-ask-srcs a[href]").length : 0 };
});
check(src.isDetails && src.open === false, "Sources render as a collapsed disclosure by default");
check(/sources/i.test(src.summary), `the summary is labelled 'Sources' (${src.summary})`);
// Clicking the summary expands it to reveal the links.
await pg.evaluate(() => document.querySelector("#v2-menu-omni .na-ask-srcd > summary").click());
await pg.waitForTimeout(120);
check(await pg.evaluate(() => { const d = document.querySelector("#v2-menu-omni .na-ask-srcd"); return d.open === true && d.querySelectorAll(".na-ask-srcs a[href]").length >= 1; }), "clicking Sources expands it to show the links");
await pg.evaluate(() => document.querySelector("#v2-menu-omni .na-chat-clear").click());
await pg.waitForTimeout(150);
check(await pg.evaluate(() => document.querySelectorAll("#v2-menu-omni .na-chat-turn").length === 0), "'New chat' clears the transcript");
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

// ---- PHONE: an active chat DOCKS the input to the bottom, transcript oldest→newest ----
{
  const { ctx: pc, pg: pp, errs: pe } = await open(b, PHONE, base + "/v2/menu/");
  await pp.waitForSelector("#v2-menu-omni .na-ask-in", { timeout: 8000 });
  // New-chat empty state: the docked view shows a spark + three ONE-WORD news
  // topics, with the input already at the bottom.
  const empty = await pp.evaluate(() => {
    const c = document.querySelector("#v2-menu-omni");
    const view = document.querySelector('.v2-view[data-view="menu"]');
    return {
      viewFixed: getComputedStyle(view).position === "fixed",
      mark: !!c.querySelector(".na-sugg-mark"),
      suggs: [...c.querySelectorAll(".na-sugg")].map((s) => s.textContent.trim()),
    };
  });
  check(empty.viewFixed, "empty chat: the menu view is docked (input already at the bottom)");
  check(empty.mark && empty.suggs.length === 3, `empty chat shows a spark + 3 topic suggestions (${empty.suggs.join(", ")})`);
  check(empty.suggs.every((s) => /^\S+$/.test(s)), `each suggested topic is one word (${empty.suggs.join(", ")})`);
  await pp.route("**/api/ask", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answer: "Answer text.", sources: [{ url: "https://example.com/", title: "Src" }] }) }));
  await pp.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); c.querySelector(".na-ask-in").value = "First?"; c.querySelector(".na-ask-form").requestSubmit(); });
  await pp.waitForTimeout(400);
  await pp.evaluate(() => { const c = document.querySelector("#v2-menu-omni"); c.querySelector(".na-ask-in").value = "Second?"; c.querySelector(".na-ask-form").requestSubmit(); });
  await pp.waitForTimeout(400);
  const dock = await pp.evaluate(() => {
    const c = document.querySelector("#v2-menu-omni");
    const view = document.querySelector('.v2-view[data-view="menu"]');
    const form = c.querySelector(".na-ask-form");
    const chat = c.querySelector(".na-chat");
    const chip = document.querySelector(".na-menu-bar");
    const fr = form.getBoundingClientRect();
    const cr = chat.getBoundingClientRect();
    const se = document.scrollingElement;
    const qs = [...c.querySelectorAll(".na-chat-q")].map((q) => q.textContent.trim());
    return {
      docked: c.classList.contains("is-docked"), viewPos: getComputedStyle(view).position,
      formBottom: Math.round(fr.bottom), formTop: Math.round(fr.top), chatBottom: Math.round(cr.bottom),
      chipTop: Math.round(chip.getBoundingClientRect().top),
      chatScrollbar: chat.offsetWidth - chat.clientWidth,
      bodyScrolls: se.scrollHeight > se.clientHeight + 1,
      vh: window.innerHeight, qs,
    };
  });
  // The whole menu VIEW is a fixed flex column; the input is pinned at its base.
  check(dock.docked && dock.viewPos === "fixed", `active chat: the menu view docks as a fixed column (got ${dock.viewPos})`);
  check(dock.chipTop <= 80, `the chip bar stays at the top (no drift; top ${dock.chipTop})`);
  check(!dock.bodyScrolls, "the page body does not scroll (no page scrollbar) — only the transcript scrolls");
  check(dock.chatScrollbar === 0, `the transcript scrollbar is hidden (${dock.chatScrollbar}px)`);
  check(dock.formBottom >= dock.vh - 120 && dock.formBottom <= dock.vh, `docked input sits at the bottom of the screen (bottom ${dock.formBottom} of ${dock.vh})`);
  // Transcript is bottom-anchored: it ends right at the input (no dead space between).
  check(Math.abs(dock.chatBottom - dock.formTop) <= 2, `transcript is bottom-anchored right above the input (chat ${dock.chatBottom}, input top ${dock.formTop})`);
  check(dock.qs[0] === "First?" && dock.qs[1] === "Second?", `docked transcript is oldest→newest (${dock.qs.join(" | ")})`);
  // "New chat" sits in the input row (right side), not as a separate top row.
  check(await pp.evaluate(() => { const f = document.querySelector("#v2-menu-omni .na-ask-form .na-chat-clear"); return !!f && !document.querySelector("#v2-menu-omni .na-chat-top"); }), "New chat sits in the input row, not above the transcript");
  // Focusing the input (keyboard up) hides the bottom tab bar so nothing sits
  // between the field and the keyboard; blurring restores it.
  const tabDisplay = () => pp.evaluate(() => getComputedStyle(document.querySelector(".mobile-tabbar")).display);
  check(await tabDisplay() !== "none", "tab bar is visible before typing a follow-up");
  await pp.evaluate(() => document.querySelector("#v2-menu-omni .na-ask-in").focus());
  await pp.waitForTimeout(120);
  check(await tabDisplay() === "none", "focusing the follow-up input hides the bottom tab bar");
  check(await pp.evaluate(() => document.documentElement.classList.contains("chat-kbd")), "the typing flag (html.chat-kbd) is set while focused");
  await pp.evaluate(() => document.querySelector("#v2-menu-omni .na-ask-in").blur());
  await pp.waitForTimeout(120);
  check(await tabDisplay() !== "none", "blurring the input brings the tab bar back");
  await pp.unroute("**/api/ask");
  checkErrs(pe, "docked phone chat");
  await pc.close();
}

// ---- Topic suggestions are DERIVED from today's headlines; tapping one asks ----
{
  const ctx2 = await b.newContext(PHONE);
  const p2 = await ctx2.newPage();
  // A day whose headlines are about the Fed, inflation and oil.
  await p2.route("**/api/feed", (route) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ items: [
    { title: "Fed holds rates as Powell signals caution", source: "FT", date: "2026-07-19", time: "12:00" },
    { title: "Fed minutes show a split on the next cut", source: "Reuters", date: "2026-07-19", time: "11:00" },
    { title: "Inflation cools but core CPI stays sticky", source: "Bloomberg", date: "2026-07-19", time: "10:00" },
    { title: "Oil jumps as OPEC weighs supply cuts", source: "Reuters", date: "2026-07-19", time: "09:00" },
    { title: "Brent crude climbs on Middle East risk", source: "FT", date: "2026-07-19", time: "08:00" },
    { title: "Powell testimony in focus for markets", source: "WSJ", date: "2026-07-19", time: "07:00" },
  ] }) }));
  await p2.goto(base + "/v2/menu/", { waitUntil: "load" });
  await p2.waitForSelector("#v2-menu-omni .na-sugg", { timeout: 8000 });
  await p2.waitForTimeout(400);
  const topics = await p2.evaluate(() => [...document.querySelectorAll("#v2-menu-omni .na-sugg")].map((s) => s.textContent.trim()));
  check(topics.includes("Fed"), `topics are derived from today's headlines — Fed present (${topics.join(", ")})`);
  check(topics.includes("Oil") || topics.includes("Inflation"), `a second real topic present (${topics.join(", ")})`);
  // The three suggestions sit SIDE BY SIDE in one row (equal offsetTop).
  const tops = await p2.evaluate(() => [...document.querySelectorAll("#v2-menu-omni .na-sugg")].map((s) => Math.round(s.getBoundingClientRect().top)));
  check(tops.length === 3 && tops.every((t) => t === tops[0]), `the 3 topics sit side by side in a row (tops ${tops.join(",")})`);
  const radius = await p2.evaluate(() => getComputedStyle(document.querySelector("#v2-menu-omni .na-sugg")).borderRadius);
  check(radius === "0px", `topic pills are square, matching the app (border-radius ${radius})`);
  // Clear-text ✕: typing shows it; tapping it empties the field.
  const clr = await p2.evaluate(() => {
    const i = document.querySelector("#v2-menu-omni .na-ask-in"), c = document.querySelector("#v2-menu-omni .na-ask-clr");
    const before = c.hidden;
    i.value = "some text"; i.dispatchEvent(new Event("input", { bubbles: true }));
    const shown = !c.hidden;
    c.click();
    return { present: !!c, hiddenWhenEmpty: before, shownWithText: shown, clearedVal: i.value, hiddenAfter: c.hidden };
  });
  check(clr.present && clr.hiddenWhenEmpty, "clear ✕ is hidden when the field is empty");
  check(clr.shownWithText, "clear ✕ appears once the field has text");
  check(clr.clearedVal === "" && clr.hiddenAfter, "tapping the clear ✕ empties the field and hides itself");
  // Tapping a topic seeds its question and starts the chat.
  let asked = null;
  await p2.route("**/api/ask", (route) => { try { asked = JSON.parse(route.request().postData() || "{}"); } catch {} route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ answer: "On the Fed…", sources: [] }) }); });
  await p2.evaluate(() => [...document.querySelectorAll("#v2-menu-omni .na-sugg")].find((s) => s.textContent.trim() === "Fed").click());
  await p2.waitForTimeout(400);
  check(asked && /Fed/i.test(asked.question || ""), `tapping 'Fed' asks about it (${asked && asked.question})`);
  check(await p2.evaluate(() => document.querySelectorAll("#v2-menu-omni .na-chat-turn").length === 1 && !document.querySelector("#v2-menu-omni .na-chat-empty")), "tapping a topic starts the chat (empty state replaced by the transcript)");
  await ctx2.close();
}

await b.close(); srv.close();
finish();
