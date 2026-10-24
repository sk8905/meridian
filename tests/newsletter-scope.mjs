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
await ctx.close(); srv.close();

// Two issues sharing ONE "read online" link (Economist World in Brief, Reuters Trading Day) each
// open their own text — matched by issue id, never by the link (bug fixed 2026-10-24).
{
  const LINK = "https://www.economist.com/the-world-in-brief";
  const twins = [
    { id: "nl-econ-wib-new", publication: "The Economist", author: null, series: "The World in Brief", title: "The World in Brief: France braces for more protests", date: today, time: "06:00", summary: "Also: France braces", url: LINK, body: true },
    { id: "nl-econ-wib-old", publication: "The Economist", author: null, series: "The World in Brief", title: "The World in Brief: Nord Stream mystery", date: today, time: "05:00", summary: "Also: who blew up the Nord Stream pipelines?", url: LINK },
  ];
  const JS2 = `export const PUBLISHERS = {}; export const NOT_FOR_WIRE = ${JSON.stringify(NOT_FOR_WIRE)}; export const NEWSLETTERS = ${JSON.stringify(twins)};`;
  let asked = "";
  const srv2 = await serve({ "/newsletters.js": () => [200, JS2, "text/javascript"],
    "/api/nl-body": (q) => { asked = new URL("http://x" + q.url).searchParams.get("id"); return [200, JSON.stringify({ accessible: true, title: "WIB", blocks: [{ t: "Body of the issue " + asked + " with enough words to read as a paragraph." }, { t: "Second paragraph of that same issue, also long enough to count." }], paragraphs: ["Body of the issue " + asked, "Second"] })]; } });
  const c2 = await open(b, DESKTOP, `http://localhost:${srv2.port}/v2/`);
  await c2.pg.waitForSelector("#g-feed .g-feed-row", { timeout: 10000 });
  const openRow = async (sid) => {
    await c2.pg.evaluate((id) => document.querySelector(`#g-feed .g-feed-row[data-sid="${id}"]`).click(), sid);
    await c2.pg.waitForFunction(() => !/Fetching the full text/.test((document.getElementById("g-readpane") || {}).textContent || ""), null, { timeout: 8000 }).catch(() => {});
    return c2.pg.evaluate(() => (document.getElementById("g-readpane") || {}).textContent || "");
  };
  const newer = await openRow("nl-econ-wib-new");
  check(/Body of the issue nl-econ-wib-new/.test(newer), "the newer World in Brief opens its OWN stored text");
  const older = await openRow("nl-econ-wib-old");
  check(/who blew up the Nord Stream/.test(older) && !/Body of the issue/.test(older), "the older issue (no stored text) opens as its own summary, not the newer issue's text");
  checkErrs(c2.errs, "shared-link newsletters");
  await c2.ctx.close(); srv2.close();
}
await b.close();
finish();
