// Feed codes (R3, revised by the owner 2026-10-15): the wire itself carries NO "?" —
// the plain-language explanation of every code chip the feed engine renders (the eight
// domain codes NWS · MAC · BND · CRD · LAW · HDG · RSH · LTR), the manager-event pills
// Home merges into its wire (RAISE · DEAL · …) and the time-column marks lives on
// Menu ▸ Sources ("What the wire's codes mean"). Every chip actually on the wire must be
// explained there.
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const DOMAIN = ["NWS", "MAC", "BND", "CRD", "LAW", "HDG", "RSH", "LTR"];

for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  // 1) The wire: no "?" anywhere (Home and News).
  const { ctx, pg, errs } = await open(b, dev, base + "/v2/news/");
  await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
  const onWire = await pg.evaluate(() => ({
    legends: document.querySelectorAll("details.g-feed-legend, .g-feed-dayhdr summary").length,
    codes: [...new Set([...document.querySelectorAll("#g-feed .g-feed-row .g-feed-code")].map((c) => c.textContent.trim()).filter(Boolean))],
  }));
  checkEq(onWire.legends, 0, `${name}: no "?" legend on the wire`);
  await pg.goto(base + "/v2/");
  await pg.waitForSelector(".g-feed-row", { timeout: 10000, state: "attached" });
  checkEq(await pg.evaluate(() => document.querySelectorAll("details.g-feed-legend").length), 0, `${name}: no "?" legend on Home`);
  // 2) Menu ▸ Sources explains every code.
  await pg.goto(base + "/v2/menu/sources");
  await pg.waitForSelector(".g-feed-codes", { timeout: 10000, state: "attached" });
  const box = await pg.evaluate(() => {
    const p = document.querySelector(".g-feed-codes");
    return { codes: [...p.querySelectorAll("dt.g-feed-code")].map((d) => ({ c: d.textContent.trim(), dd: (d.nextElementSibling || {}).textContent || "" })), text: p.textContent,
      head: (document.getElementById("cov-codes") || {}).textContent || "" };
  });
  const have = new Set(box.codes.map((x) => x.c));
  check(/codes mean/i.test(box.head), `${name}: Sources has a "What the wire's codes mean" block`);
  check(DOMAIN.every((c) => have.has(c)), `${name}: all eight domain codes are explained (${DOMAIN.filter((c) => !have.has(c)).join(",") || "none missing"})`);
  check(box.codes.every((x) => x.dd.trim().length > 8), `${name}: every code has a plain-language explanation`);
  checkEq(onWire.codes.filter((c) => !have.has(c)).join(","), "", `${name}: every code chip on the wire is explained on Sources (${onWire.codes.join(" ")})`);
  check(/≈/.test(box.text) && /added to Wire/.test(box.text), `${name}: the time-column marks are explained too`);
  checkErrs(errs, `feed codes (${name})`);
  await ctx.close();
}

await b.close(); srv.close();
finish();
