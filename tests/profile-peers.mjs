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
    const id = document.querySelector("#pf-detail .tdet-id");
    // The Peers dropdown is a collapsible <details> in the identity header, styled
    // like Sources, and it sits ABOVE the LinkedIn-connections + Sources lines.
    const det = id && id.querySelector("details.tdet-peers");
    if (!det) return { has: false };
    const sum = (det.querySelector("summary") || {}).textContent?.trim() || "";
    const links = [...det.querySelectorAll("a.tdet-peer[href]")];
    const kids = [...id.children];
    const src = id.querySelector(":scope > .tdet-src-det:not(.tdet-peers), :scope > .tdet-src");
    const net = id.querySelector(":scope > .wn-badge");
    return {
      has: true, summary: sum,
      count: links.length,
      hrefs: links.map((x) => x.getAttribute("href")),
      names: links.map((x) => x.textContent.trim()),
      allHaveSub: links.every((x) => (x.nextElementSibling && x.nextElementSibling.classList.contains("tdet-peer-sub") && x.nextElementSibling.textContent.trim())),
      aboveSources: src ? kids.indexOf(det) < kids.indexOf(src) : true,
      aboveNet: net ? kids.indexOf(det) < kids.indexOf(net) : true,
    };
  });
  check(r.has, `${c.label}: a "Peers" dropdown renders in the profile header`);
  check(r.has && /^peers/i.test(r.summary), `${c.label}: the dropdown summary reads "Peers" (${r.summary})`);
  check(r.has && r.count >= 3 && r.count <= 5, `${c.label}: shows 3–5 peers (${r.count})`);
  check(r.has && r.hrefs.every((h) => h.startsWith(c.prefix)), `${c.label}: every peer links to a ${c.prefix}… profile`);
  check(r.has && !r.hrefs.some((h) => h === c.prefix + c.selfId), `${c.label}: the profile is not listed as its own peer`);
  check(r.has && new Set(r.hrefs).size === r.hrefs.length, `${c.label}: peers are distinct (no duplicates)`);
  check(r.has && r.names.every(Boolean) && r.allHaveSub, `${c.label}: each peer shows a name + a strategy/size rationale`);
  check(r.has && r.aboveSources && r.aboveNet, `${c.label}: the Peers dropdown sits above the LinkedIn / Sources lines`);
  checkErrs(errs, `${c.label} peers`);
  await ctx.close();
}

// Clicking a peer navigates to that peer's own profile (the links are live).
{
  const { ctx, pg, errs } = await open(b, DESKTOP, `${base}/v2/profiles/#/manager/m5`);
  await pg.waitForSelector("#pf-detail .tdet-peers a.tdet-peer", { timeout: 8000, state: "attached" });
  await pg.waitForTimeout(300);
  const target = await pg.evaluate(() => {
    const det = document.querySelector("#pf-detail .tdet-peers");
    det.open = true;   // expand the dropdown so its links are interactive
    const a = det.querySelector("a.tdet-peer[href]");
    return { href: a.getAttribute("href"), name: a.textContent.trim() };
  });
  await pg.evaluate(() => { document.querySelector("#pf-detail .tdet-peers a.tdet-peer").click(); });
  await pg.waitForTimeout(600);
  const landed = await pg.evaluate(() => ({ hash: location.hash, h1: (document.querySelector("#pf-detail .tdet-id h1") || {}).textContent?.trim() || "" }));
  check(landed.hash === target.href, `clicking a peer navigates to its route (${landed.hash})`);
  check(landed.h1.includes(target.name.split(" (")[0].slice(0, 6)), `the peer's own profile opens (${landed.h1})`);
  checkErrs(errs, "peer navigation");
  await ctx.close();
}

await b.close(); srv.close();
finish();
