// Dashboard ▸ Legal ▸ "Restructuring & insolvency" carries the UK Insolvency Service's
// official statistics (owner 2026-10-21 — moved here from the News wire), live from
// /api/insolvency, above the firms' R&I alerts; each row links its gov.uk release.
import { serve, launchChromium, open, DESKTOP, PHONE, check, checkErrs, finish } from "./lib.mjs";

const API = { source: "https://www.gov.uk/government/organisations/insolvency-service.atom", items: [
  { title: "Company insolvencies, September 2026", url: "https://www.gov.uk/government/statistics/company-insolvencies-september-2026", date: "2026-10-20" },
  { title: "Individual insolvencies, September 2026", url: "https://www.gov.uk/government/statistics/individual-insolvencies-september-2026", date: "2026-10-20" },
] };
const srv = await serve({ "/api/insolvency": () => [200, JSON.stringify(API)] });
const b = await launchChromium();
for (const [name, dev] of [["desktop", DESKTOP], ["phone", PHONE]]) {
  const { pg, errs, ctx } = await open(b, dev, `http://localhost:${srv.port}/v2/dashboard/legal`);
  await pg.waitForSelector("#dsh-rxl #dsh-insolv-b .dsh-insolv", { state: "attached", timeout: 10000 });
  const r = await pg.evaluate(() => {
    const blk = document.querySelector("#dsh-rxl #dsh-insolv-b");
    const links = [...blk.querySelectorAll(".dsh-insolv a")].map((a) => a.href);
    const head = (blk.querySelector(".dsh-fed-h") || {}).textContent || "";
    return { links, head, txt: blk.textContent };
  });
  check(/UK Insolvency Service/.test(r.head), `${name}: the R&I card has an official Insolvency Service block (${r.head})`);
  check(r.links.length >= 1 && r.links.every((u) => /^https:\/\/www\.gov\.uk\//.test(u)) && /Company insolvencies, September 2026/.test(r.txt), `${name}: each statistics release links its gov.uk page (${r.links.length})`);
  if (name === "desktop") {
    // Owner 2026-10-21: Legal cards drop the "Alert"/citation line — the headline takes the
    // card's full width and line 2 is the source (firm / court) alone.
    const L = await pg.evaluate(() => [...document.querySelectorAll("#dsh-cases li.g-ev, #dsh-lbank li.g-ev, #dsh-rxl li.g-ev")].slice(0, 12).map((li) => ({
      src2: li.classList.contains("g-ev-src2"), meta: (li.querySelector(".g-ev-m") || {}).textContent || "",
      srcShown: getComputedStyle(li.querySelector(".c-src")).display !== "none",
      tw: li.querySelector(".g-ev-t").getBoundingClientRect().right, rw: li.getBoundingClientRect().right })));
    check(L.length > 0 && L.every((r) => r.src2 && !r.srcShown), `desktop: Legal card rows use the source-on-line-2 layout (${L.length})`);
    check(L.every((r) => r.meta && !/^(Alert|Case)\b/.test(r.meta) && !/EWHC|\[20\d\d\]/.test(r.meta)), `desktop: line 2 is the source only — no "Alert"/citation (${L.slice(0, 3).map((r) => r.meta).join(" | ")})`);
    check(L.every((r) => r.rw - r.tw < 24), "desktop: each headline stretches to the card's right edge");
  }
  checkErrs(errs, `legal insolvency (${name})`);
  await (ctx || pg.context()).close();
}
await b.close(); srv.close();
finish();
