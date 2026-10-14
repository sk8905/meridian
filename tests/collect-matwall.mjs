// Maturity-wall lead collector (scripts/collect-matwall.mjs) — offline. Leads are
// on-topic, de-duplicated, newest first and flagged when published after the held
// write-up; a PDF's maturity schedule lines are picked out for the routine to verify.
import { leadsFrom, maturityLines, QUERIES, DOCS } from "../scripts/collect-matwall.mjs";
import { MATWALL } from "../macro/js/content.js";
import { check, checkEq, finish } from "./lib.mjs";

const item = (t, d, src = "PitchBook") => `<item><title>${t} - ${src}</title><link>https://example.com/${encodeURIComponent(t)}</link><pubDate>${new Date(d + "T09:00:00Z").toUTCString()}</pubDate><source url="https://pitchbook.com">${src}</source></item>`;
const xml = (...items) => `<rss><channel>${items.join("")}</channel></rss>`;
const leads = leadsFrom([
  xml(item("Europe tackles 2028 loan maturity wall faster than expected", "2026-08-05"), item("Fund X hires a new partner", "2026-09-01")),
  xml(item("Europe tackles 2028 loan maturity wall faster than expected", "2026-08-05"), item("European high yield refinancing surges", "2026-10-02", "Yahoo Finance")),
], "2026-08-05");
checkEq(leads.length, 2, "off-topic and duplicate headlines are dropped");
check(leads[0].date === "2026-10-02" && leads[0].newer && !leads[1].newer, "newest first; only leads published after the held write-up are flagged newer");

const pdf = ["Index Dashboard", "Maturity Wall (EUR bn)", "2026 1.2", "2027 8.4", "2028 41.0", "Sector weights", "Healthcare 14%"].join("\n");
const lines = maturityLines(pdf);
check(lines.includes("2028 41.0") && lines.includes("Maturity Wall (EUR bn)") && !lines.includes("Healthcare 14%"), "maturity schedule lines are picked out of a PDF's text");
checkEq(maturityLines("no schedule here").length, 0, "a document without a maturity schedule yields nothing");

check(QUERIES.some((q) => /Europe/i.test(q)) && DOCS.every((d) => /^https:\/\//.test(d.url)), "European queries and free official documents are configured");
check(MATWALL.europe && /^\d{4}-\d{2}-\d{2}$/.test(MATWALL.europe.published || ""), "the held European block records its source's publication date");
finish();
