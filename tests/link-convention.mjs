// Link convention (HOUSE_STYLE R39l): underlined links only in READING content.
//  • deal card (Transactions drawer) + profile info cards: internal → blue underline;
//  • deal card: external → orange underline;
//  • tables, lists, briefing sources, Dashboard SRC tags: no underline (source style kept).
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";
const srv = await serve(); const b = await launchChromium(); const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/transactions/#/lending?deal=d1");
await pg.waitForSelector("#tx-drawer a.tx-mgr", { timeout: 8000 });
const ORANGE = "rgb(251, 139, 30)";
const st = (sel) => pg.evaluate((sel) => [...document.querySelectorAll(sel)].filter((a) => a.offsetParent).map((a) => { const s = getComputedStyle(a); return [s.textDecorationLine, s.textDecorationColor, s.borderTopStyle]; }), sel);
const card = { int: await st("#tx-drawer a.tx-mgr"), ext: await st('#tx-drawer a[target="_blank"]') };
check(card.int.length && card.int.every(([l, c]) => l === "underline" && c !== ORANGE), `deal card: internal links have a blue underline (${JSON.stringify(card.int[0])})`);
check(card.ext.length && card.ext.every(([l, c]) => l === "underline" && c === ORANGE), `deal card: external links have an orange underline (${card.ext.length})`);
const table = await st("#tx-body .tx-list a");
check(table.length && table.every(([l]) => l === "none"), `Transactions table: names and sources keep their plain style (${table.length} links, none underlined)`);
await pg.goto(base + "/v2/transactions/#/bdc"); await pg.waitForTimeout(600);
check((await st("#tx-bdc-body a")).every(([l]) => l === "none"), "BDC table: no underlined links");
await pg.goto(base + "/v2/profiles/#/manager/m8"); await pg.waitForTimeout(1200);
const pfSrc = await st("#pf-detail .tw-src a, #pf-detail .tdet-src a, #pf-detail .tw-head");
check(pfSrc.every(([l]) => l === "none"), `Profiles: news rows and sources keep their source style (${pfSrc.length})`);
await pg.goto(base + "/v2/dashboard/"); await pg.waitForTimeout(1800);
const src = await st(".dsh a.dsh-src");
check(src.length && src.every(([l, , bd]) => l === "none" && bd === "solid"), `Dashboard: SRC tags are the grey boxed tag, not underlined (${src.length})`);
check((await st(".dsh a.dsh-drill")).every(([l]) => l === "none"), "Dashboard: drill-down names in tables are plain");
await pg.goto(base + "/v2/"); await pg.waitForTimeout(1500);
check((await st("a.g-hbrief-src")).every(([l]) => l === "none"), "Home briefing: sources keep the subtle source style");
checkErrs(errs, "link convention");
await ctx.close(); await b.close(); srv.close();
finish();
