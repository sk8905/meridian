// Peers feature: every Profiles detail page (managers · hedge funds · investors ·
// law firms) shows a "Peers" card of 3–5 similar entities, ranked by strategy and
// AUM/size, each a clickable link to that peer's own profile (never the profile
// itself, never a dead entity). Computed from the real roster (peers.js), so the
// links always resolve.
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// route: the hash to open; prefix: the route every peer link must share; selfId:
// the opened profile's id (peers must exclude it).
const CASES = [
  { label: "Managers",    route: "#/manager/m5",         prefix: "#/manager/", selfId: "m5" },
  { label: "Hedge funds", route: "#/hf/h3",              prefix: "#/hf/",      selfId: "h3" },
  { label: "Investors",   route: "#/lp/l1",              prefix: "#/lp/",      selfId: "l1" },
  { label: "Law firms",   route: "#/firm/aoshearman",    prefix: "#/firm/",    selfId: "aoshearman" },
];

for (const c of CASES) {
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/${c.route}`);
  await pg.waitForSelector("#pf-detail .tdet-id h1", { timeout: 8000 });
  await pg.waitForTimeout(400);
  const r = await pg.evaluate(() => {
    const det = document.querySelector("#pf-detail");
    const card = [...det.querySelectorAll(".tpanel")].find((p) => {
      const h = p.querySelector(".tpanel-h > span:first-child");
      return h && /^peers$/i.test(h.textContent.trim());
    });
    if (!card) return { hasCard: false };
    const rows = [...card.querySelectorAll(".tmini-row.clickable[data-href]")];
    return {
      hasCard: true,
      count: rows.length,
      hrefs: rows.map((x) => x.getAttribute("data-href")),
      names: rows.map((x) => (x.querySelector(".tmini-t") || {}).textContent?.trim() || ""),
      allHaveSub: rows.every((x) => (x.querySelector(".tmini-m") || {}).textContent?.trim()),
    };
  });
  check(r.hasCard, `${c.label}: a "Peers" card renders on the profile`);
  check(r.hasCard && r.count >= 3 && r.count <= 5, `${c.label}: shows 3–5 peers (${r.count})`);
  check(r.hasCard && r.hrefs.every((h) => h.startsWith(c.prefix)), `${c.label}: every peer links to a ${c.prefix}… profile`);
  check(r.hasCard && !r.hrefs.some((h) => h === c.prefix + c.selfId), `${c.label}: the profile is not listed as its own peer`);
  check(r.hasCard && new Set(r.hrefs).size === r.hrefs.length, `${c.label}: peers are distinct (no duplicate rows)`);
  check(r.hasCard && r.names.every(Boolean) && r.allHaveSub, `${c.label}: each peer shows a name + a strategy/size rationale`);
  checkErrs(errs, `${c.label} peers`);
  await ctx.close();
}

// Clicking a peer navigates to that peer's own profile (the links are live).
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/#/manager/m5`);
  await pg.waitForSelector("#pf-detail .tdet-peers .tmini-row.clickable", { timeout: 8000 });
  await pg.waitForTimeout(300);
  const target = await pg.evaluate(() => {
    const row = document.querySelector("#pf-detail .tdet-peers .tmini-row.clickable[data-href]");
    return { href: row.getAttribute("data-href"), name: (row.querySelector(".tmini-t") || {}).textContent?.trim() };
  });
  await pg.evaluate(() => { document.querySelector("#pf-detail .tdet-peers .tmini-row.clickable").click(); });
  await pg.waitForTimeout(600);
  const landed = await pg.evaluate(() => ({ hash: location.hash, h1: (document.querySelector("#pf-detail .tdet-id h1") || {}).textContent?.trim() || "" }));
  check(landed.hash === target.href, `clicking a peer navigates to its route (${landed.hash})`);
  check(landed.h1.includes(target.name.split(" (")[0].slice(0, 6)), `the peer's own profile opens (${landed.h1})`);
  checkErrs(errs, "peer navigation");
  await ctx.close();
}

await b.close(); srv.close();
finish();
