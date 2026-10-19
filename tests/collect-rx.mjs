// Restructurings collector (scripts/collect-rx.mjs, owner 2026-10-19). Pure logic — no
// network: the TNA Atom parser, the Part 26 / 26A classifier (creditor restructurings in;
// solvent takeover schemes, FSMA Part VII transfers and passing mentions out), the
// already-held check, and the South Square / GRR lead pickers.
import fs from "node:fs";
import path from "node:path";
import { ROOT, check, checkEq, finish } from "./lib.mjs";
import { parseAtom, isPart26, heldIn, pickSouthSquare, pickGrr, normCo } from "../scripts/collect-rx.mjs";

const atom = `<feed><entry><title>TG Jones High Street Limited, Re</title><link href="https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2079" rel="alternate"/><published>2026-08-05T00:00:00+00:00</published><updated>2026-08-07T10:00:00+00:00</updated><author><name>High Court (Insolvency and Companies List)</name></author><link href="https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2079/data.xml" rel="alternate" type="application/akn+xml"/><tna:identifier slug="ewhc/ch/2026/2079" type="ukncn">[2026] EWHC 2079 (Ch)</tna:identifier></entry></feed>`;
const e = parseAtom(atom);
check(e.length === 1 && e[0].citation === "[2026] EWHC 2079 (Ch)" && e[0].published === "2026-08-05" && /data\.xml$/.test(e[0].xml), `parses a TNA Atom entry (${JSON.stringify(e[0])})`);

check(isPart26("The plan company seeks sanction of a restructuring plan under Part 26A of the Companies Act 2006. Section 901F … Part 26A cross-class cram down."), "a Part 26A plan judgment is a candidate");
check(isPart26("The scheme creditors met at the convening hearing; the scheme creditors voted… creditors' scheme sanctioned."), "a Part 26 creditor scheme is a candidate");
check(!isPart26("A scheme of arrangement between the company and its scheme shareholders under the Takeover Code; scheme creditors scheme creditors."), "a solvent takeover (members') scheme is NOT");
check(!isPart26("An insurance business transfer scheme under Part VII of FSMA; the court sanctioned the transfer."), "an FSMA Part VII transfer is NOT");
check(!isPart26("In passing, counsel referred to a restructuring plan."), "a passing mention is NOT");

const rows = [{ company: "TG Jones High Street Limited", date: "2026-08-05", citation: "[2026] EWHC 2079 (Ch)", judgmentUrl: "https://caselaw.nationalarchives.gov.uk/ewhc/ch/2026/2079" }];
check(heldIn(rows, e[0]), "a judgment Wire already holds (same citation) is skipped");
check(heldIn(rows, { title: "TG Jones High Street Ltd, Re", published: "2026-08-08" }), "the same company within 10 days is treated as held");
check(!heldIn(rows, { title: "Thames Water Utilities Holdings Ltd, Re", published: "2026-10-20" }), "a new company is not held");
checkEq(normCo("Fossil (UK) Global Services Limited, Re"), "fossil global services", "company names normalise");

const ss = pickSouthSquare([{ date: "2026-08-07T10:00:00", link: "https://southsquare.com/x", title: { rendered: "New restructuring plan judgment: Re TG Jones High Street Limited [2026] EWHC 2079 (Ch)" } },
  { date: "2026-10-16T08:05:57", link: "https://southsquare.com/y", title: { rendered: "Pupillage Open Evening: Women In Law" } }]);
check(ss.length === 1 && ss[0].date === "2026-08-07", "South Square: judgment notes kept, chambers news dropped");
const grr = pickGrr('<a href="/article/thames-water-pursue-interim-maturity-extension"></a><a href="/article/grr-awards-2026-advocate-of-the-year"></a><a href="/article/thames-water-pursue-interim-maturity-extension"></a>');
check(grr.length === 1 && /thames water/.test(grr[0].title), "GRR: articles kept once, awards dropped");

const file = path.join(ROOT, "backfill/rx-candidates.json");
check(fs.existsSync(file) && Array.isArray(JSON.parse(fs.readFileSync(file, "utf8")).judgments), "backfill/rx-candidates.json is present and well-formed");
check(fs.existsSync(path.join(ROOT, ".github/workflows/collect-rx.yml")), "the daily collect-rx workflow exists");
finish();
