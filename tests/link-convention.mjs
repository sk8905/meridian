// Link convention (HOUSE_STYLE R39l), app-wide: every INTERNAL text link has a blue
// underline and every EXTERNAL text link an orange one; rows / navigation are exempt.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
const srv = await serve(); const b = await launchChromium(); const base = `http://localhost:${srv.port}`;
const ROWS = ".g-feed-row, .tw-head, .dsh-news-i > a, .dsh-pc-report, .dsh-hf-prof, .tchip, .dsh-navchip, .g-ph-link, .g-snap-blk, .wb-link, .brand, .g-read-open, .tcr-rt, .sls-chip, .tfocus-btn";
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
for (const u of ["/v2/", "/v2/dashboard/", "/v2/dashboard/rates", "/v2/profiles/#/manager/m8", "/v2/profiles/#/lp/l1", "/v2/transactions/#/lending?deal=d1", "/v2/transactions/#/bdc?open=ARCC"]) {
  await pg.goto(base + u); await pg.waitForTimeout(1500);
  const r = await pg.evaluate((ROWS) => {
    const links = [...document.querySelectorAll("#app a[href]")].filter((a) => a.offsetParent && a.textContent.trim() && !a.closest(ROWS) && !a.matches(ROWS));
    const bad = [], seen = { int: 0, ext: 0 };
    for (const a of links) {
      const ext = a.target === "_blank"; const s = getComputedStyle(a);
      const c = s.textDecorationColor, u = s.textDecorationLine === "underline";
      const want = ext ? "rgb(251, 139, 30)" : null;
      if (!u || (ext && c !== want) || (!ext && (c === "rgb(251, 139, 30)" || c === s.color))) bad.push(`${ext ? "EXT" : "INT"} ${a.className || a.parentElement.className} "${a.textContent.trim().slice(0, 30)}" ${s.textDecorationLine} ${c}`);
      seen[ext ? "ext" : "int"]++;
    }
    return { bad: bad.slice(0, 6), n: bad.length, seen };
  }, ROWS);
  check(!r.n, `${u}: internal links blue-underlined, external orange (${r.seen.int} int, ${r.seen.ext} ext${r.n ? "; bad: " + r.bad.join(" | ") : ""})`);
}
checkErrs(errs, "link convention");
await ctx.close(); await b.close(); srv.close();
finish();
