// Newsletter scope (owner 2026-10-23): the owner receives some newsletters that are off
// Wire's beat. newsletters.js NOT_FOR_WIRE lists them; the routine never sweeps them and the
// Home feed hides any already recorded. The sender maps stay disjoint.
import { PUBLISHERS as NLP, NOT_FOR_WIRE } from "../newsletters.js";
import { PUBLISHERS as RP, isResearchPublication } from "../research.js";
import { serve, launchChromium, open, DESKTOP, check, checkErrs, finish } from "./lib.mjs";

const nl = Object.keys(NLP), rs = Object.keys(RP), skip = NOT_FOR_WIRE.senders;
check(!nl.some((d) => skip.includes(d)), "no newsletter sender is also NOT_FOR_WIRE");
check(!nl.some((d) => rs.includes(d)), "newsletter and research sender maps are disjoint");
for (const [d, name] of [["morganstanley.com", "Morgan Stanley"], ["oaktreecapital.com", "Oaktree"], ["cf.com", "Chatham Financial"]])
  check(RP[d] === name && isResearchPublication(name), `${name} routes to Research`);
for (const d of ["thomsonreuters.com", "mail.sailthru.com", "go.reuters.com"]) check(NLP[d] === "Reuters", `${d} newsletters read "Reuters"`);
for (const n of ["Le Monde", "The New Yorker", "The 42", "Business Post", "The Sydney Morning Herald"]) check(NOT_FOR_WIRE.publications.includes(n), `${n} is not for Wire`);

// Browser: an off-beat newsletter never reaches the News lane; an on-beat one does.
const today = new Date().toISOString().slice(0, 10);
const items = [
  { id: "nl-lemonde-x-1", publication: "Le Monde", author: null, series: "Le brief", title: "La une du jour au Monde", date: today, time: "07:00", summary: "x", url: "https://infos.lemonde.fr/x1" },
  { id: "nl-bloomberg-x-1", publication: "Bloomberg", author: "Joe Flynn", series: "Markets Daily", title: "Markets Daily: Gilts rally on soft CPI", date: today, time: "07:05", summary: "Gilts rally", url: "https://bloom.bg/x1" },
];
const NLJS = `export const PUBLISHERS = {}; export const NOT_FOR_WIRE = ${JSON.stringify(NOT_FOR_WIRE)}; export const NEWSLETTERS = ${JSON.stringify(items)};`;
const srv = await serve({ "/newsletters.js": () => [200, NLJS, "text/javascript"] });
const b = await launchChromium();
const { ctx, pg, errs } = await open(b, DESKTOP, `http://localhost:${srv.port}/v2/`);
await pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
const hrefs = await pg.evaluate(() => [...document.querySelectorAll("#g-feed .g-feed-row")].map((r) => r.getAttribute("href")));
check(hrefs.includes("https://bloom.bg/x1"), "an on-beat newsletter (Bloomberg) is on the News lane");
check(!hrefs.includes("https://infos.lemonde.fr/x1"), "an off-beat newsletter (Le Monde) is not");
checkErrs(errs, "newsletter scope");
await ctx.close(); await b.close(); srv.close();
finish();
