// Gazette corporate-notice collector (pure logic, no egress). OGL excludes personal
// data, so only corporate (24xx) notices ABOUT a tracked company are kept, person-name
// fields are dropped, and robots.txt's Crawl-delay (10s) is honoured.
import { pickNotices, isCorporateCode, normCo, targets, CRAWL_DELAY_MS } from "../scripts/collect-gazette.mjs";
import { check, checkEq, finish } from "./lib.mjs";

const entry = (id, title, code, extra = {}) => ({ id: `https://www.thegazette.co.uk/id/notice/${id}`, "f:notice-code": code, "f:name": "Jane", "f:familyName": "Doe", title,
  link: [{ "@href": `https://www.thegazette.co.uk/id/notice/${id}`, "@rel": "self" }, { "@href": `https://www.thegazette.co.uk/notice/${id}` }],
  published: "2026-10-01T10:00:00", category: { "@term": "Petitions to Wind Up (Companies)" }, content: "<div>Company Address …</div>", ...extra });
const json = { entry: [
  entry(1, "THAMES WATER UTILITIES LIMITED", "2450"),
  entry(2, "HAYMILLS ENGINEERING LIMITED", "2431"),            // text hit inside another company's notice
  entry(3, "THAMES WATER UTILITIES LTD", "2501"),               // personal-insolvency code range → never kept
] };
const got = pickNotices("Thames Water Utilities Limited", json);
checkEq(got.length, 1, "gazette: only the corporate notice ABOUT the tracked company is kept");
checkEq(got[0].url, "https://www.thegazette.co.uk/notice/1", "gazette: links the notice page");
check(!JSON.stringify(got).includes("Jane") && !JSON.stringify(got).includes("Doe") && !("content" in got[0]), "gazette: person-name fields and addresses are not carried");
check(isCorporateCode("2441") && !isCorporateCode("2501") && !isCorporateCode("2903"), "gazette: corporate insolvency codes only (24xx)");
checkEq(normCo("EG Group Limited"), normCo("EG Group"), "gazette: legal suffixes ignored in the title match");
check(CRAWL_DELAY_MS >= 10000, "gazette: robots.txt Crawl-delay (10s) honoured");
check(targets().length > 50, `gazette: targets = restructuring companies + UK obligors (${targets().length})`);
finish();
