// LinkedIn-connections importer (menu ▸ Network): a pasted Connections.csv is
// parsed + matched against the roster IN THE BROWSER, the "My network" list
// groups matches by Managers / Hedge Funds / Law firms, ambiguous company names
// go to a confirm step, and — once imported — the matching entity profile shows
// a "N connections here" badge. All state is localStorage; nothing is fetched.
import { serve, launchChromium, open, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";

const srv = await serve();
const b = await launchChromium();
const base = `http://localhost:${srv.port}`;

// A realistic export: a Notes preamble, then the header, then rows — exact
// matches (Bridgewater/Kirkland+LLP/Bridgepoint Credit/A&O Shearman), one
// ambiguous ("Citadel Securities" ~ "Citadel"), one unmatched ("Acme Widgets").
const CSV = [
  "Notes:",
  '"Some preamble line about your data export."',
  "",
  "First Name,Last Name,URL,Email Address,Company,Position,Connected On",
  // A full firm name carrying an extra qualifier must still match confidently
  // (the "strong" tier) — it resolves to the roster entity, not the confirm queue.
  'Jane,Doe,https://lnkd.in/a,,"Bridgewater Associates (Westport)",Portfolio Manager,15 Jun 2024',
  'John,Smith,https://lnkd.in/b,,"Kirkland & Ellis LLP",Partner,02 Feb 2023',
  "Ana,Lopez,https://lnkd.in/c,,Bridgepoint Credit,Principal,10 Jan 2025",
  "Bo,Ng,https://lnkd.in/d,,Citadel Securities,Quant,11 Mar 2022",
  "Ce,Fu,https://lnkd.in/e,,Acme Widgets Inc,CFO,01 Jan 2020",
  "Di,Ma,https://lnkd.in/f,,A&O Shearman,Associate,05 May 2025",
].join("\n");

const { ctx, pg, errs } = await open(b, DESKTOP, base + "/v2/menu/");
await pg.waitForSelector(".na-menu-bar .tchip", { timeout: 8000 });

// Open the Network section.
await pg.evaluate(() => document.querySelector('.na-menu-bar .tchip[data-sec="network"]').click());
await pg.waitForSelector("#wn-paste-txt", { state: "attached", timeout: 5000 });

// Paste the CSV and import (programmatic click drives it even inside the
// collapsed <details>, exactly as the real handler would once expanded).
await pg.evaluate((csv) => {
  document.querySelector("#wn-paste-txt").value = csv;
  document.querySelector("#wn-paste-go").click();
}, CSV);
await pg.waitForSelector(".wn-sum", { timeout: 8000 });

const state = await pg.evaluate(() => {
  const grp = (label) => {
    const h = [...document.querySelectorAll(".wn-grp-h")].find((x) => x.textContent.trim().startsWith(label));
    if (!h) return [];
    return [...h.parentElement.querySelectorAll(".wn-ent-nm .wn-ent-t")].map((t) => t.textContent.trim());
  };
  return {
    managers: grp("Managers"),
    hedge: grp("Hedge Funds"),
    firms: grp("Law firms"),
    pending: [...document.querySelectorAll(".wn-pend-co")].map((x) => x.textContent.trim()),
    sum: (document.querySelector(".wn-sum") || {}).textContent || "",
  };
});
check(state.managers.includes("Bridgepoint Credit"), `Network: manager match listed (${state.managers.join(", ")})`);
check(state.hedge.includes("Bridgewater Associates"), `Network: hedge-fund match listed (${state.hedge.join(", ")})`);
check(state.firms.includes("Kirkland & Ellis") && state.firms.includes("A&O Shearman"), `Network: law-firm matches listed (${state.firms.join(", ")})`);
check(!state.hedge.includes("Citadel"), "Network: ambiguous 'Citadel Securities' is NOT auto-matched into the list");
check(state.pending.includes("Citadel Securities"), `Network: ambiguous company queued for confirmation (${state.pending.join(", ")})`);
check(/4 firms you follow/.test(state.sum) && /6 scanned/.test(state.sum), `Network: summary counts matched vs scanned (${state.sum})`);

// Confirm the ambiguous one → it folds into Hedge Funds; pending clears.
await pg.evaluate(() => document.querySelector('.wn-yes[data-acc="Citadel Securities"]').click());
await pg.waitForFunction(() => !document.querySelector(".wn-pend"), { timeout: 4000 });
const afterAccept = await pg.evaluate(() => {
  const h = [...document.querySelectorAll(".wn-grp-h")].find((x) => x.textContent.trim().startsWith("Hedge Funds"));
  return [...h.parentElement.querySelectorAll(".wn-ent-t")].map((t) => t.textContent.trim());
});
check(afterAccept.includes("Citadel"), `Network: accepting an ambiguous match adds it to the list (${afterAccept.join(", ")})`);

// Navigate to a matched hedge fund's profile → the collapsible badge appears.
await pg.evaluate(() => document.querySelector('.wn-ent-nm[data-net-route="#/hf/h1"]').click());
await pg.waitForSelector("#pf-detail .wn-badge", { timeout: 8000 });
const badge = await pg.evaluate(() => {
  const el = document.querySelector("#pf-detail .wn-badge");
  return { text: el ? el.textContent : "", tag: el ? el.tagName : "", open: el ? el.open : null, hasPerson: el ? /Jane Doe/.test(el.textContent) : false };
});
check(/connection/.test(badge.text), "Profile badge: renders 'N connection(s) here' on the matched profile");
check(badge.hasPerson, `Profile badge: names the known connection (${badge.text.replace(/\s+/g, " ").slice(0, 80)})`);
checkEq(badge.tag, "DETAILS", "Profile badge: is a collapsible <details> element");
checkEq(badge.open, false, "Profile badge: collapsed by default");
// Clicking the summary expands it.
await pg.evaluate(() => document.querySelector("#pf-detail .wn-badge > summary").click());
const opened = await pg.evaluate(() => { const el = document.querySelector("#pf-detail .wn-badge"); return el ? el.open : null; });
checkEq(opened, true, "Profile badge: clicking the summary expands it");

// A profile with no known connection shows no badge.
await pg.goto(base + "/v2/profiles/#/hf/h3", { waitUntil: "load" });
await pg.waitForSelector("#pf-detail", { timeout: 8000 });
await pg.waitForTimeout(400);
const noBadge = await pg.evaluate(() => !document.querySelector("#pf-detail .wn-badge"));
check(noBadge, "Profile badge: absent on a profile with no imported connection");

checkErrs(errs, "network connections importer");
await ctx.close();

await b.close(); srv.close();
finish();
