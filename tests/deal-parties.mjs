// Deal parties (HOUSE_STYLE R39m — the 2026-10 party audit). Every deal names its
// borrower, sponsor, lender(s) and the tracked firm's real role; a club deal is ONE row
// that counts under each lender; the drawer reads summary → parties → details; the
// Source label is the outlet, never the manager's name unless the URL is its own site.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { register } from "node:module";
register("data:text/javascript," + encodeURIComponent(`
  const ROOT = ${JSON.stringify(new URL("../", import.meta.url).href)};
  export async function resolve(spec, ctx, next) {
    if (/^\\/(credit|v2|legal)\\//.test(spec) || /^\\/[a-z-]+\\.js$/.test(spec)) return next(ROOT + spec.slice(1), ctx);
    return next(spec, ctx);
  }`));
const { deals, managers, managerById } = await import("../credit/js/data.js");
const { creditSource } = await import("../credit/js/shared.js");
const { srcHost, isOwnSite } = await import("../util.js");
const { MANAGER_ROLES, dealLenders, dealLenderIds } = await import("../v2/js/deal-parse.js");

// 1) Data: every deal carries managerRole; lenders are well-formed and resolve to profiles.
const noRole = deals.filter((d) => !MANAGER_ROLES.includes(d.managerRole)).map((d) => d.id);
check(!noRole.length, `every deal has a managerRole (${noRole.length} missing${noRole.length ? ": " + noRole.slice(0, 8).join(", ") : ""})`);
const ROLES = ["lead", "participant", "arranger", "investor"];
const badL = deals.filter((d) => !Array.isArray(d.lenders) || d.lenders.some((l) => !l.name || !ROLES.includes(l.role) || (l.managerId && !managerById[l.managerId]))).map((d) => d.id);
check(!badL.length, `every deal's lenders[] is well-formed and each managerId resolves (${badL.length} bad${badL.length ? ": " + badL.slice(0, 8).join(", ") : ""})`);
const unlinked = deals.filter((d) => (d.lenders || []).some((l) => !l.managerId)).map((d) => d.id);
check(!unlinked.length, `every lender named in a deal has a profile (${unlinked.length} unlinked${unlinked.length ? ": " + unlinked.slice(0, 8).join(", ") : ""})`);
const badSp = deals.filter((d) => d.sponsorId && !managerById[d.sponsorId]).map((d) => d.id);
check(!badSp.length, `every sponsorId resolves to a profile (${badSp.join(", ") || "ok"})`);

// 2) The worked example — d534 (CoStar): Signal borrows; Signal Capital Partners sponsors;
// Investec leads, AIB participates.
const d534 = deals.find((d) => d.id === "d534");
checkEq(d534 && d534.borrower, "Signal", "d534 borrower");
checkEq(d534 && d534.sponsor, "Signal Capital Partners", "d534 sponsor");
checkEq(d534 && d534.managerRole, "sponsor", "d534: the tracked firm (Signal Capital Partners) is the sponsor");
const l534 = d534 ? dealLenders(d534).map((l) => `${l.name}:${l.role}`).join(", ") : "";
check(/^Investec\b[^,]*:lead, AIB:participant$/.test(l534), `d534 lenders: Investec (lead) + AIB (participant) (${l534})`);
checkEq(d534 && creditSource(d534), "CoStar", "d534 source label is the outlet");

// 2b) Owner rules (2026-10-15): banking arms and asset-management arms stay separate —
// a bank lender is never linked to a bank's tracked asset-management / special arm unless
// the source names that arm (or the deal is filed under it); and confidence is explicit.
const ARM = { m118: /direct lending/i, m133: /asset management|alternative credit/i, m176: /asset management|private debt/i, m9: /alternatives|asset management|gsam/i, m101: /special situations/i, m57: /distressed/i, m58: /capital solutions/i };
const armBad = deals.flatMap((d) => (d.lenders || []).filter((l) => ARM[l.managerId] && !ARM[l.managerId].test(l.name) && d.managerId !== l.managerId).map((l) => `${d.id}:${l.name}`));
check(!armBad.length, `no bank lender is linked to a bank's asset-management arm (${armBad.slice(0, 6).join(", ") || "ok"})`);
const invL = d534 && (d534.lenders || []).find((l) => /^Investec/.test(l.name));
check(invL && invL.managerId !== "m118" && (managerById[invL.managerId] || {}).category === "bank", `d534's Investec is the bank's own profile, not "Investec (Direct Lending)" (${invL && invL.managerId})`);
const { dealCounterparty: cp } = await import("../v2/js/deal-parse.js");
const unk = deals.find((d) => d.borrower === "Unknown");
check(!!unk && cp(unk, "") === "Unknown", `a borrower no source supports reads "Unknown" (${unk && unk.id})`);
const unc = deals.find((d) => d.borrowerUnconfirmed && d.borrower);
check(!!unc && cp(unc, "") === unc.borrower + "*", `a very likely but unconfirmed borrower carries an asterisk (${unc && unc.id}: ${unc && cp(unc, "")})`);
const badUnk = deals.filter((d) => d.borrowerUnconfirmed && (!d.borrower || d.borrower === "Unknown")).map((d) => d.id);
check(!badUnk.length, `"Unknown" is never marked unconfirmed (${badUnk.join(", ") || "ok"})`);

// 3) Source labels: a manager's name only on the manager's own site.
const mgrNames = new Set(managers.map((m) => m.name));
const badSrc = deals.filter((d) => { const l = creditSource(d); return mgrNames.has(l) && !isOwnSite(srcHost(d.sourceUrl), l); }).map((d) => `${d.id}:${srcHost(d.sourceUrl)}`);
check(!badSrc.length, `no deal labels its source with a manager name unless the URL is that manager's own site (${badSrc.slice(0, 6).join(", ") || "ok"})`);
check(isOwnSite("aresmgmt.com", "Ares Management") && isOwnSite("ir.apollo.com", "Apollo Global Management") && !isOwnSite("costar.com", "Signal Capital Partners"), "isOwnSite: own domains yes, outlets no");

// 4) One deal = one record: a club deal carries every lender (Phoenix Tower: Ares + Apollo).
const ptc = deals.filter((d) => /Phoenix Tower International/.test(d.headline));
const club = ptc.find((d) => dealLenderIds(d).length > 1);
check(ptc.length === 1 && !!club, `Phoenix Tower is ONE record with every lender (${ptc.map((d) => d.id + ":" + dealLenders(d).map((l) => l.name).join("+")).join(" | ")})`);
const withAmt = club ? dealLenders(club).filter((l) => l.amount != null).length : 0;
check(withAmt >= 2, `each club lender keeps its own amount where the source gives it (${withAmt})`);

// 5) UI: the club deal is one row and counts under EACH lender in the Lender facet; the
// drawer reads summary → parties → details; d534 shows its parties and CoStar.
const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;
const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/");
await pg.waitForTimeout(400);
if (club) {
  const ids = dealLenderIds(club);
  const rowsUnder = [];
  for (const id of ids) {
    await pg.goto(`${base}/v2/transactions/#/lending?scope=all&lender=${id}`, { waitUntil: "load" });
    await pg.waitForSelector("#tx-body", { timeout: 8000 }); await pg.waitForTimeout(300);
    rowsUnder.push(await pg.evaluate((cid) => document.querySelectorAll(`#tx-body tr.tx-row[data-deal="${cid}"]`).length, club.id));
  }
  check(rowsUnder.length > 1 && rowsUnder.every((n) => n === 1), `the club deal is one row under each of its lenders in the Lender facet (${rowsUnder.join(", ")})`);
  await pg.goto(`${base}/v2/transactions/#/lending?scope=all&q=Phoenix%20Tower`, { waitUntil: "load" });
  await pg.waitForTimeout(500);
  const one = await pg.evaluate(() => ({ n: document.querySelectorAll("#tx-body tr.tx-row").length, cell: (document.querySelector("#tx-body tr.tx-row td.txc-lender") || {}).textContent || "" }));
  check(one.n === 1 && /\+\d/.test(one.cell), `searching the club deal finds ONE row whose Lender reads "lead +N" (${one.n} · ${one.cell.trim()})`);
}
await pg.goto(`${base}/v2/transactions/#/deal/d534`, { waitUntil: "load" });
await pg.waitForSelector("#tx-drawer:not([hidden]) .tbiz", { timeout: 8000 });
const dr = await pg.evaluate(() => {
  const d = document.querySelector("#tx-drawer");
  const kids = [...d.querySelector(".tx-drawer-b").children].map((e) => e.className || e.tagName);
  const facts = [...d.querySelectorAll(".tbiz li")].map((li) => [li.querySelector(".tbiz-k").textContent.trim(), li.querySelector(".tbiz-v").textContent.replace(/\s+/g, " ").trim()]);
  const links = [...d.querySelectorAll(".tbiz li")].filter((li) => /Lender|Sponsor|Borrower/.test(li.querySelector(".tbiz-k").textContent)).map((li) => li.querySelectorAll("a").length);
  return { kids, facts, links };
});
const keys = dr.facts.map(([k]) => k);
const at = (re) => keys.findIndex((k) => re.test(k));
check(dr.kids.indexOf("tx-sum") === 1 && dr.kids.indexOf("tbiz") === 2, `drawer: headline → summary → facts (${dr.kids.slice(0, 3).join(" → ")})`);
check(at(/^Borrower/) === 0 && at(/^Sponsor/) === 1 && at(/^Lenders?$/) === 2 && at(/^Type/) > at(/^Lenders?$/) && at(/^Source/) === keys.length - 1 - keys.filter((k) => k === "Also reported").length,
  `drawer: Borrower · Sponsor · Lender(s) · … · Source (${keys.join(" · ")})`);
const fv = Object.fromEntries(dr.facts);
check(/^Signal\b/.test(fv["Borrower / company"] || "") && /Signal Capital Partners/.test(fv.Sponsor || "") && /Investec\b[^A]* lead/.test(fv.Lenders || "") && /AIB participant/.test(fv.Lenders || "") && /CoStar/.test(fv.Source || ""),
  `d534 drawer: Borrower Signal · Sponsor Signal Capital Partners · Lenders Investec (lead) + AIB · Source CoStar (${JSON.stringify(fv).slice(0, 220)})`);
check(dr.links.length >= 3 && dr.links.every((n) => n >= 1), `every party in the drawer links to its profile (${dr.links.join(",")})`);
// 6) Profiles: the sponsor's Investments tab labels its role; a new lender profile renders.
const aib = d534 && (d534.lenders || []).find((l) => /AIB/.test(l.name));
await pg.goto(`${base}/v2/profiles/#/manager/${d534.managerId}`, { waitUntil: "load" });
await pg.waitForSelector("#mgr-tabs", { timeout: 8000 });
await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
await pg.waitForTimeout(300);
const inv = await pg.evaluate(() => { const tr = document.querySelector('.tinv-tbl tr.tinv-row[data-id="d534"]'); return tr ? (tr.querySelector(".tinv-role") || {}).textContent || "(no role)" : "(no row)"; });
checkEq(inv, "Sponsor", "Signal Capital Partners' Investments tab shows d534 with its role");
if (aib && aib.managerId) {
  await pg.goto(`${base}/v2/profiles/#/manager/${aib.managerId}`, { waitUntil: "load" });
  await pg.waitForSelector("#pf-detail .tdet-id", { timeout: 8000 });
  await pg.evaluate(() => { const t = document.querySelector('#mgr-tabs .tchip[data-p="investments"]'); if (t) t.click(); });
  await pg.waitForTimeout(300);
  const lp = await pg.evaluate(() => ({ h1: (document.querySelector("#pf-detail .tdet-id h1") || {}).textContent || "", role: (document.querySelector('.tinv-tbl tr.tinv-row[data-id="d534"] .tinv-role') || {}).textContent || "" }));
  check(/AIB/.test(lp.h1) && lp.role === "Lender", `the new AIB lender profile renders and lists d534 as Lender (${lp.h1} · ${lp.role})`);
}
// The drawer: "Unknown" is plain text (no profile link); "Name*" carries the unconfirmed note.
if (unk) {
  await pg.goto(`${base}/v2/transactions/#/deal/${unk.id}`, { waitUntil: "load" });
  await pg.waitForSelector("#tx-drawer:not([hidden]) .tbiz", { timeout: 8000 });
  const u = await pg.evaluate(() => { const li = document.querySelector("#tx-drawer .tbiz li"); return { v: li.querySelector(".tbiz-v").textContent.trim(), a: li.querySelectorAll(".tbiz-v a").length }; });
  check(/^Unknown/.test(u.v) && u.a === 0, `drawer: an unknown borrower reads "Unknown", unlinked (${u.v} · ${u.a} links)`);
}
if (unc) {
  await pg.goto(`${base}/v2/transactions/#/deal/${unc.id}`, { waitUntil: "load" });
  await pg.waitForSelector("#tx-drawer:not([hidden]) .tbiz", { timeout: 8000 });
  const u = await pg.evaluate(() => document.querySelector("#tx-drawer .tbiz li .tbiz-v").textContent.replace(/\s+/g, " ").trim());
  check(/\*/.test(u) && /unconfirmed/.test(u), `drawer: an unconfirmed borrower shows its asterisk and note (${u.slice(0, 90)})`);
}
checkErrs(errs, "deal parties");
await ctx.close(); await b.close(); srv.close();
finish();
