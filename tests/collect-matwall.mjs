// Maturity-wall lead collector (scripts/collect-matwall.mjs) — offline. Leads are
// on-topic, de-duplicated, newest first and flagged when published after the held
// write-up; a PDF's maturity schedule lines are picked out for the routine to verify.
import { leadsFrom, maturityLines, pageFacts, pdfAnchors, chartPages, QUERIES, DOCS } from "../scripts/collect-matwall.mjs";
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
check(lines.includes("2028 41.0") && lines.includes("2026 1.2") && !lines.includes("Healthcare 14%"), "a schedule table under a maturity heading is picked out of a PDF's text");
const body = ["1. Contents", "6.8 European Corporate High Yield Maturity Wall", "Executive summary", "Sector weights", "Healthcare 14%", "Market overview", "More text", "Still more", "And more", "Filler", "Filler 2", "Filler 3", "Filler 4", "Filler 5", "Filler 6", "Filler 7", "Later page: €96bn of European high yield bonds mature in 2027, up from €70bn."].join("\n");
check(maturityLines(body).some((l) => /€96bn/.test(l)), "a maturity figure stated in the body text (past the contents page) is picked out");
checkEq(maturityLines("no schedule here").length, 0, "a document without a maturity schedule yields nothing");

const pf = pageFacts('<meta property="article:published_time" content="2026-01-30T10:00:00+00:00"><p>Fitch: 40% of EMEA leveraged loans mature in 2028-2029.</p><p>Unrelated shipping news paragraph here.</p>', /matur/i);
check(pf.published === "2026-01-30" && pf.paras.length === 1 && /40%/.test(pf.paras[0]), "an article page yields its own published date and the on-topic paragraphs");
check(DOCS.find((d) => d.id === "spdji_weu_ll").urls.length >= 2 && DOCS.every((d) => d.urls.every((u) => !/-20\d\d-\d\d\.pdf$/.test(u))), "the S&P loan-index report has a known alternate copy; no guessed month-stamped URLs");
const pa = pdfAnchors('<a href="/Publications/FTS1.pdf">Global Refinancing</a><a href="/Publications/FTS1.pdf">dup</a><a class="x" href="https://a.b/c.pdf?x=1"><span>Credit Trends</span></a>', "https://www.maalot.co.il/en");
check(pa.length === 2 && pa[0].url === "https://www.maalot.co.il/Publications/FTS1.pdf" && pa[0].text === "Global Refinancing" && pa[1].text === "Credit Trends", "PDF links are collected with their titles, de-duplicated");
checkEq(chartPages(["Contents … High Yield Maturity Wall", "Issuance", "6.8 European Corporate High Yield Maturity Wall chart"], /high yield maturity wall/i).join(","), "3", "the chart page is found, skipping the contents page");
checkEq(chartPages(["intro", "High Yield Maturity Wall"], /high yield maturity wall/i).join(","), "2", "a single match is used as is");
check(QUERIES.some((q) => /Europe/i.test(q)) && DOCS.every((d) => d.urls.every((u) => /^https:\/\//.test(u))), "European queries and free official documents are configured");
check(MATWALL.europe && /^\d{4}-\d{2}-\d{2}$/.test(MATWALL.europe.published || ""), "the held European block records its source's publication date");
finish();
