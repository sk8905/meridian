// Regulatory AUM on a hedge-fund profile: when a fund carries `raum` (SEC Form ADV,
// written by scripts/apply-sec.mjs), the identity header shows it as its own,
// clearly-labelled chip beside net AUM, and the sources line links the ADV record.
// A fund without `raum` shows neither. (The data module is intercepted to add raum
// to h1, since the live data may not carry it yet.)
import { serve, launchChromium, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const ctx = await b.newContext(DESKTOP);
const pg = await ctx.newPage();
const errs = [];
pg.on("pageerror", (e) => errs.push(String(e.message).slice(0, 160)));
await pg.route(/\/credit\/js\/data\.js(\?.*)?$/, async (route) => {
  const r = await route.fetch();
  let body = await r.text();
  body = body.replace(/^(  \{ id: "h1",.*?)( \},?)$/m, `$1, raum: 171.2, raumAsOf: "2026-03-30", raumSource: "https://adviserinfo.sec.gov/firm/summary/105129"$2`);
  await route.fulfill({ response: r, body });
});
await pg.goto(`${base}/v2/profiles/#/hf/h1`, { waitUntil: "load" });
await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 8000 });
const r = await pg.evaluate(() => {
  const id = document.querySelector("#pf-detail .tdet-id");
  const chip = id.querySelector(".tdet-chip[data-raum]");
  const a = [...id.querySelectorAll(".tdet-src a")].find((x) => /adviserinfo\.sec\.gov/.test(x.href));
  return { chip: chip ? chip.textContent.trim() : null, title: chip ? chip.title : "", link: a ? a.textContent.trim() : null };
});
check(r.chip === "$171.2bn regulatory AUM (SEC)", `the regulatory-AUM chip is shown and labelled (${r.chip})`);
check(/gross of leverage/.test(r.title), "its tooltip says it is gross of leverage (not net AUM)");
check(r.link === "SEC Form ADV (filed 2026-03-30)", `the sources line links the Form ADV record with its filing date (${r.link})`);
await pg.goto(`${base}/v2/profiles/#/hf/h2`, { waitUntil: "load" });
await pg.waitForFunction(() => /Man Group/.test(document.querySelector("#pf-detail .tdet-id h1")?.textContent || ""), null, { timeout: 8000 });
check(!(await pg.$("#pf-detail .tdet-chip[data-raum]")), "a fund without regulatory AUM shows no such chip");
checkErrs(errs, "hedge-fund profile with regulatory AUM");
await b.close(); srv.close();
finish();
