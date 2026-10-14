// Reader terms guard (pure logic, no egress). Hosts whose terms of use forbid
// automated access / scraping / storage (READ_LINKONLY in src/index.js — e.g. Moody's
// ToU §1(c), §2) are never fetched by /api/read: the row stays as headline + link and
// opens at the publisher. The refusal must happen BEFORE any cache or proxy step.
import worker, { readProxyAllowed } from "../src/index.js";
import { check, finish } from "./lib.mjs";

const read = async (url) => {
  const res = await worker.fetch(new Request("https://wire.test/api/read?url=" + encodeURIComponent(url)), {}, { waitUntil() {} });
  return res.json();
};
for (const url of ["https://www.moodys.com/web/en/us/insights/credit-risk/outlooks/private-credit-2027.html", "https://moodys.com/research/x",
  "https://www.scmp.com/business/article/1/x", "https://www.straitstimes.com/business/x", "https://mohamedelerian.substack.com/p/x", "https://www.butthistime.com/p/x"]) {
  const r = await read(url);
  check(r.accessible === false && r.reason === "link-only" && (r.paragraphs || []).length === 0, `reader: ${new URL(url).host} is link-only (got ${r.reason})`);
}
// The proxy never gets round a publisher's refusal, and never serves NOAUTO/LINKONLY hosts.
for (const r of ["fetch-401", "fetch-403", "fetch-429", "fetch-503", "redirect-blocked"])
  check(readProxyAllowed("example-news.com", r) === false, `reader: no proxy after a refusal (${r})`);
check(readProxyAllowed("example-news.com", "thin-body") === true, "reader: proxy may render an openly-served page that needs a browser");
for (const h of ["apnews.com", "cnbc.com", "www.marketwatch.com".replace(/^www\./, ""), "scmp.com", "moodys.com"])
  check(readProxyAllowed(h, "thin-body") === false, `reader: ${h} is never proxied`);
// Pre-warm (unattended KV storage) is an allowlist of hosts whose terms permit reuse.
import fs from "node:fs";
const src = fs.readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
const pw = src.slice(src.indexOf("async function prewarmReads"), src.indexOf("async function handleHero"));
check(/!_readInSet\(host, READ_PREWARM_OK\)/.test(pw), "reader: prewarmReads only stores READ_PREWARM_OK hosts");
check(!/READ_OPEN/.test(src), "reader: READ_OPEN (render metered pages) is retired");
finish();
