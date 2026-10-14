// Reader terms guard (pure logic, no egress). Hosts whose terms of use forbid
// automated access / scraping / storage (READ_LINKONLY in src/index.js — e.g. Moody's
// ToU §1(c), §2) are never fetched by /api/read: the row stays as headline + link and
// opens at the publisher. The refusal must happen BEFORE any cache or proxy step.
import worker from "../src/index.js";
import { check, finish } from "./lib.mjs";

const read = async (url) => {
  const res = await worker.fetch(new Request("https://wire.test/api/read?url=" + encodeURIComponent(url)), {}, { waitUntil() {} });
  return res.json();
};
for (const url of ["https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/private-credit-2027.html", "https://moodys.com/research/x"]) {
  const r = await read(url);
  check(r.accessible === false && r.reason === "link-only" && (r.paragraphs || []).length === 0, `reader: ${new URL(url).host} is link-only (got ${r.reason})`);
}
finish();
