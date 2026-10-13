// The deterministic candidate collector (scripts/collect-candidates.mjs) — offline,
// against a fixture feed (no egress in the suite). It must: parse Google News RSS;
// keep only headlines that NAME the entity (not "Blue Man Group" for Man Group) AND
// carry an event word; drop stories Wire already holds; drop aggregator-only stories;
// and group one event syndicated by several outlets into ONE candidate.
import { parseRss, collect, rosterEntities, collectPremium, mergeCandidates } from "../scripts/collect-candidates.mjs";
import { deals } from "../credit/js/data.js";
import { check, checkEq, finish } from "./lib.mjs";

const known = deals.find((d) => d.sourceUrl && /^https?:/.test(d.sourceUrl));
const item = (title, source, link, date = "Mon, 12 Oct 2026 09:00:00 GMT") =>
  `<item><title>${title} - ${source}</title><link>${link}</link><pubDate>${date}</pubDate><source url="https://x">${source}</source></item>`;
const xml = `<rss><channel>
${item("Man Group raises $1bn for new credit fund", "Financial Times", "https://www.ft.com/a1")}
${item("Man Group closes $1bn credit fund", "Bloomberg", "https://www.bloomberg.com/a2")}
${item("Blue Man Group origin story heads to the big screen", "Variety", "https://variety.com/a3")}
${item("Man Group shares rise on results day", "Reuters", "https://reuters.com/a4")}
${item("Man Group appoints new head of credit", "Kalkine Media", "https://kalkine.com/a5")}
${item(known.headline, "Somewhere", known.sourceUrl)}
</channel></rss>`;

const parsed = parseRss(xml);
checkEq(parsed.length, 6, "parses every RSS item");
check(parsed[0].title === "Man Group raises $1bn for new credit fund" && parsed[0].source === "Financial Times" && parsed[0].date === "2026-10-12",
  "title has the ' - Source' suffix stripped; source and ISO date captured");

const man = { kind: "manager", id: "mX", name: "Man Group (Credit)", q: "x" };
const res = await collect([man], { fetcher: async () => xml });
const titles = res.candidates.map((c) => c.title);
checkEq(res.candidates.length, 1, `one candidate survives (${titles.join(" | ")})`);
check(res.candidates[0] && res.candidates[0].outlets.length === 2, "the event carried by FT + Bloomberg is grouped into ONE candidate with both outlets");
check(!titles.some((t) => /Blue Man Group/.test(t)), "a longer proper name containing the entity ('Blue Man Group') is not a match");
check(!titles.some((t) => /shares rise/.test(t)), "a headline with no event word (share-price chatter) is dropped");
check(!titles.some((t) => /appoints/.test(t)), "a story carried only by an aggregator (Kalkine) is dropped");
check(!titles.includes(known.headline), "a story Wire already holds (by URL/headline) is dropped");

const ents = rosterEntities();
check(ents.some((e) => e.kind === "manager") && ents.some((e) => e.kind === "hf") && ents.some((e) => e.kind === "firm"),
  `the roster covers managers, hedge funds and law firms (${ents.length} entities)`);
// PREMIUM leads: a paywalled specialist's public headline naming a tracked entity becomes
// a cue, matched across the roster; stories carried only by paywalled outlets are flagged.
{
  const pxml = `<rss><channel>
${item("Man Group raises $2bn for European direct lending", "Private Debt Investor", "https://www.privatedebtinvestor.com/p1")}
${item("Private credit market outlook for 2027", "Private Debt Investor", "https://www.privatedebtinvestor.com/p2")}
</channel></rss>`;
  const prem = await collectPremium([man, { kind: "hf", id: "hX", name: "Unrelated Capital", q: "x" }], { fetcher: async () => pxml });
  check(prem.items.length >= 1 && prem.items.every((x) => x.entityId === "mX" && x.premium), `a paywalled headline naming a tracked entity becomes a premium cue (${prem.items.length})`);
  check(!prem.items.some((x) => /outlook/.test(x.title)), "a paywalled headline naming no tracked entity is ignored");
  const merged = mergeCandidates([], prem.items.slice(0, 1));
  check(merged.length === 1 && merged[0].paywalledOnly === true, "a story carried only by paywalled outlets is flagged paywalledOnly");
  const mixed = mergeCandidates([{ kind: "manager", entityId: "mX", entity: man.name, title: "Man Group raises $2bn for European direct lending fund", url: "https://open.example/x", source: "Alternative Credit Investor", date: "2026-10-12" }], prem.items.slice(0, 1));
  check(mixed.length === 1 && mixed[0].paywalledOnly === false, "the same story also carried by an open outlet is one candidate, not paywalled-only");
}
finish();
