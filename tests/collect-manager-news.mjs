// Manager-site collector (scripts/collect-manager-news.mjs) — offline. Own-domain
// inference must accept a manager's own site and never a news outlet, wire or social
// site; the known-URL set must cover what Wire already holds.
import { ownHost, managerDomains, knownManagerUrls } from "../scripts/collect-manager-news.mjs";
import { check, checkEq, finish } from "./lib.mjs";
check(ownHost("www.tikehaucapital.com", "Tikehau Capital"), "a manager's own domain is recognised from its name");
check(ownHost("www.bridgepointgroup.com", "Bridgepoint Credit"), "…including a group domain");
check(!ownHost("www.bloomberg.com", "Bloomberg Credit Partners"), "news outlets are never a manager's own site");
check(!ownHost("www.businesswire.com", "Ares Management"), "press wires are never a manager's own site");
check(!ownHost("www.capital.com", "Ares Capital Management"), "generic name words (Capital, Management) never match on their own");
const doms = managerDomains([
  { id: "mA", name: "Tikehau Capital", webNews: [{ url: "https://www.tikehaucapital.com/en/news/x" }, { url: "https://www.bloomberg.com/news/y" }] },
  { id: "mB", name: "Nobody Partners", webNews: [{ url: "https://www.reuters.com/z" }] },
]);
check(doms.mA && doms.mA.length === 1 && doms.mA[0] === "www.tikehaucapital.com", "domains come from the manager's own webNews hosts only");
check(!doms.mB, "a manager with no own-site evidence gets no domain (never guessed)");
check(knownManagerUrls().size > 1000, "the known-URL set covers Wire's existing manager news and deal/intel sources");
check(Object.keys(managerDomains()).length >= 150, `most managers resolve to an own site (${Object.keys(managerDomains()).length})`);
finish();
