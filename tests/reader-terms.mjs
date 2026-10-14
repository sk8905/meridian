// Reader reach guard (pure logic, no egress). OWNER RULE (2026-10-14): Wire is a private,
// single-user, non-commercial tool and the reading pane is a key feature — every newswire
// source that serves its article publicly is read in-pane (via the browser proxy when a
// site is bot-shielded). The one hard line: READ_PAYWALL hosts (subscriber content) are
// never fetched, directly or via the proxy, so no paywall is ever bypassed.
import worker, { readProxyAllowed } from "../src/index.js";
import { check, finish } from "./lib.mjs";
import fs from "node:fs";

const read = async (url) => {
  const res = await worker.fetch(new Request("https://wire.test/api/read?url=" + encodeURIComponent(url)), {}, { waitUntil() {} });
  return res.json();
};
// Paywalls are refused before any fetch, cache or proxy step.
for (const url of ["https://www.ft.com/content/x", "https://www.bloomberg.com/news/articles/x", "https://www.wsj.com/articles/x", "https://www.economist.com/x"]) {
  const r = await read(url);
  check(r.accessible === false && r.reason === "paywall", `reader: ${new URL(url).host} (paywall) is never fetched (got ${r.reason})`);
}
// Every other newswire host is readable, incl. through the proxy when bot-shielded.
for (const h of ["moodys.com", "scmp.com", "straitstimes.com", "apnews.com", "cnbc.com", "marketwatch.com", "investing.com", "mohamedelerian.substack.com", "butthistime.com"])
  check(readProxyAllowed(h) === true, `reader: ${h} reads in-pane (proxy allowed)`);
for (const h of ["ft.com", "bloomberg.com", "wsj.com", "economist.com"])
  check(readProxyAllowed(h) === false, `reader: ${h} is never proxied (paywall)`);

const src = fs.readFileSync(new URL("../src/index.js", import.meta.url), "utf8");
const pw = src.slice(src.indexOf("async function prewarmReads"), src.indexOf("async function handleHero"));
check(/_readInSet\(host, READ_PAYWALL\)/.test(pw), "reader: prewarmReads skips paywalled hosts and warms the rest");
check(/const READ_OPEN = new Set\(\[\s*"scmp\.com"/.test(src), "reader: SCMP's metered pages render from its public body (READ_OPEN)");
check(/async function fetchXProfile/.test(src), "x: the free fallback is back for a no-key / empty paid read");
finish();
