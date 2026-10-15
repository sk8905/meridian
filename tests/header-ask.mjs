// Header ▸ Ask Wire (R16): a chat button in the header cluster on phone AND desktop
// opens the shared assistant (assistant.js mountAssistant, Ask only) in the header
// panel, with 4–6 suggested-question chips tied to Wire's committed data. Tapping a
// chip asks it (POST /api/ask with the question + the grounding context, which
// carries the slices the chips lean on). Menu → Chat keeps working, and "'" still
// opens the panel on desktop.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import * as LG from "../legal/js/data.js";

const ANSWER = "Here is what Wire holds on that.";
const srv = await serve({ "/api/ask": () => [200, JSON.stringify({ answer: ANSWER, sources: [] })] });
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const hasPlans = (LG.restructurings || []).some((r) => r.type === "plan");

for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/");
  await pg.waitForSelector("#na-ask", { timeout: 8000 });
  check(await pg.evaluate(() => !!document.querySelector("#na-ask").offsetParent), `${name}: Ask Wire button is in the header cluster`);
  await pg.click("#na-ask");
  await pg.waitForSelector("#na-ask-panel:not([hidden]) .na-ask-in", { timeout: 5000 });
  await pg.waitForSelector("#na-ask-panel .na-ask-q", { timeout: 15000 });
  const qs = await pg.evaluate(() => [...document.querySelectorAll("#na-ask-panel .na-ask-q")].map((x) => x.textContent.trim()));
  check(qs.length >= 4 && qs.length <= 6, `${name}: 4–6 suggested questions (${qs.length}: ${qs.join(" | ")})`);
  if (hasPlans) check(qs.includes("Latest Part 26A judgments"), `${name}: a Part 26A chip shows because Wire holds restructuring plans`);
  check(qs.some((q) => /^Who advised on European unitranche deals (this quarter|in the last six months|this year)\?$/.test(q)), `${name}: the unitranche chip names a window that actually holds unitranche records`);
  const geo = await pg.evaluate(() => { const r = document.querySelector("#na-ask-panel").getBoundingClientRect(); return { r: Math.round(r.right), w: innerWidth, pageW: document.documentElement.scrollWidth }; });
  check(geo.r <= geo.w && geo.pageW <= geo.w, `${name}: the panel fits the viewport (no sideways scroll)`);

  // Tap a chip → it is asked (question + grounding context) and answered inline.
  const pick = qs.find((q) => /Part 26A/.test(q)) || qs[0];
  const reqP = pg.waitForRequest((r) => r.url().endsWith("/api/ask") && r.method() === "POST", { timeout: 15000 });
  await pg.evaluate((q) => [...document.querySelectorAll("#na-ask-panel .na-ask-q")].find((x) => x.textContent.trim() === q).click(), pick);
  const req = await reqP;
  const body = JSON.parse(req.postData() || "{}");
  checkEq(body.question, pick, `${name}: tapping a chip asks exactly that question`);
  check(/PART 26A/.test(body.context || "") && /FUND CLOSES/.test(body.context || "") && /MOST ACTIVE LENDERS/.test(body.context || ""), `${name}: the grounding context carries the slices the chips lean on`);
  check((body.context || "").length <= 60000, `${name}: context stays within the /api/ask cap (${(body.context || "").length})`);
  await pg.waitForFunction((a) => ((document.querySelector("#na-ask-panel .na-chat") || {}).textContent || "").includes(a), ANSWER, { timeout: 10000 });
  const after = await pg.evaluate(() => ({ chips: document.querySelectorAll("#na-ask-panel .na-ask-q").length, q: (document.querySelector("#na-ask-panel .na-chat-q") || {}).textContent }));
  check(after.chips === 0 && after.q === pick, `${name}: the answer shows under the question and the chips step aside`);
  checkErrs(errs, `header ask (${name})`);
  await ctx.close();
}

// Desktop: "'" toggles the panel; Menu → Chat still mounts the docked/bare assistant.
{
  const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
  await pg.waitForSelector("#na-ask", { timeout: 8000 });
  await pg.keyboard.press("'");
  await pg.waitForSelector("#na-ask-panel:not([hidden])", { timeout: 3000 });
  check(true, "desktop: the ' key opens Ask Wire");
  await pg.keyboard.press("Escape");
  await ctx.close();
  checkErrs(errs, "header ask (keyboard)");
}
{
  const { ctx, pg, errs } = await open(b, PHONE, base + "/v2/menu/");
  await pg.waitForSelector("#v2-menu-omni .na-ask-in", { timeout: 8000 });
  const m = await pg.evaluate(() => ({ topics: document.querySelectorAll("#v2-menu-omni .na-sugg").length, qs: document.querySelectorAll("#v2-menu-omni .na-ask-q").length }));
  check(m.topics === 3 && m.qs === 0, `Menu → Chat keeps its own new-chat topics (${m.topics}) — header chips stay in the header`);
  const reqP = pg.waitForRequest((r) => r.url().endsWith("/api/ask") && r.method() === "POST", { timeout: 15000 });
  await pg.fill("#v2-menu-omni .na-ask-in", "Which managers are in London?");
  await pg.press("#v2-menu-omni .na-ask-in", "Enter");
  checkEq(JSON.parse((await reqP).postData()).question, "Which managers are in London?", "Menu → Chat still asks /api/ask");
  checkErrs(errs, "menu chat");
  await ctx.close();
}

await b.close(); srv.close();
finish();
