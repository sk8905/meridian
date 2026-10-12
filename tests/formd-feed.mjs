// Unit coverage for the /api/formd deal-feed mapping (formdParse). The live EDGAR
// full-text fetch can't run here (egress), but the mapping from EDGAR's response to
// Form D candidate rows is pure, so we feed a representative response and assert the
// contract the deal-sweep routine depends on: cleaned issuer name, a real EDGAR
// filing-index URL built from accession + CIK, metadata only (never a fabricated
// amount), and that dateless/issuerless hits are dropped.
import { formdParse } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

const resp = {
  hits: {
    total: { value: 3 },
    hits: [
      { _id: "0002149019-26-000001:primary_doc.xml", _source: {
        ciks: ["0002149019"], display_names: ["AVSF - Apollo Atomics 2026, LLC  (CIK 0002149019)"],
        file_date: "2026-09-28", file_type: "D", adsh: "0002149019-26-000001" } },
      { _id: "0001655888-26-000045:primary_doc.xml", _source: {
        ciks: ["0001655888"], display_names: ["Blue Owl Credit Fund IV (CIK 0001655888)"],
        file_date: "2026-10-02", file_type: "D/A", adsh: "0001655888-26-000045" } },
      // dropped: no file_date
      { _id: "x:y", _source: { ciks: ["1"], display_names: ["No Date Co (CIK 1)"], file_date: "" } },
      // dropped: no issuer
      { _id: "z:w", _source: { ciks: ["2"], display_names: [], file_date: "2026-10-01" } },
    ],
  },
};

const rows = formdParse(resp);
checkEq(rows.length, 2, `formd: keeps the 2 well-formed hits, drops the dateless + issuerless ones (${rows.length})`);

const a = rows[0];
checkEq(a.issuer, "AVSF - Apollo Atomics 2026, LLC", "formd: issuer name has the '(CIK …)' suffix stripped");
checkEq(a.date, "2026-09-28", "formd: carries the filing date");
checkEq(a.form, "D", "formd: carries the form type (D / D/A)");
checkEq(a.url, "https://www.sec.gov/Archives/edgar/data/2149019/000214901926000001/0002149019-26-000001-index.htm",
  "formd: builds the EDGAR filing-index URL from the un-padded CIK + de-dashed accession");
check(!("amount" in a) && !("offering" in a), "formd: returns metadata ONLY — no fabricated offering amount (the routine opens the filing to verify)");
checkEq(rows[1].form, "D/A", "formd: a Form D amendment (D/A) is preserved as its own form type");

// Robust to an empty / malformed response — never throws, returns [].
checkEq(formdParse({}).length, 0, "formd: an empty response yields no candidates (no throw)");
checkEq(formdParse(null).length, 0, "formd: a null response yields no candidates (no throw)");

finish();
