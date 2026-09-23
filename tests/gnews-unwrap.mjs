// Worker feed/reader helper: unwrapGnews decodes a Google-News RSS redirect link
// (news.google.com/rss/articles/<base64url>) to the real publisher URL embedded in
// the classic protobuf blob, so the wire row opens — and the in-app reader can fetch
// — the article itself, not Google's interstitial. Pure function, no network.
import { unwrapGnews } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

// Build a classic Google-News article link: a small protobuf-ish envelope with the
// real URL as an ASCII run, wrapped by a length-prefix byte and a trailing field, all
// base64url-encoded into the /rss/articles/<blob> path (exactly the shape the RSS feed
// hands us). unwrapGnews should hand back the embedded URL, tail bytes trimmed.
function gnewsLink(realUrl) {
  const bin = "\x08\x13\x22\x5e" + realUrl + "\xd2\x01\x0f\x74\x72\x75\x65";
  const b64 = Buffer.from(bin, "latin1").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `https://news.google.com/rss/articles/${b64}?oc=5`;
}

const bw = "https://www.businesswire.com/news/home/20260909/en/KKR-Akrapoint-Commercial-Capital";
checkEq(unwrapGnews(gnewsLink(bw)), bw, "classic Business Wire gnews link decodes to the real article");

const reuters = "https://www.reuters.com/markets/us/fed-holds-2026-09-17/";
checkEq(unwrapGnews(gnewsLink(reuters)), reuters, "classic Reuters gnews link decodes (query + path preserved)");

// A non-Google URL is returned untouched (the unwrap only ever touches news.google.com).
const direct = "https://www.businesswire.com/news/home/plain";
checkEq(unwrapGnews(direct), direct, "a direct publisher URL is passed through unchanged");

// A modern blob with NO inline URL can't be decoded offline — return the link as-is so
// the caller keeps it (and the reader falls back to preview + link) rather than throwing.
const modernBin = "\x08\x13\x22\x40" + "AABBCCDDEEFFGGHHIIJJKKLLMMNNOOPPqrst";   // no "http" run
const modernB64 = Buffer.from(modernBin, "latin1").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const modern = `https://news.google.com/rss/articles/${modernB64}?oc=5`;
checkEq(unwrapGnews(modern), modern, "a non-decodable modern blob is returned unchanged (no throw)");

// Junk / empty inputs never throw — they come back as given.
checkEq(unwrapGnews(""), "", "empty string is safe");
checkEq(unwrapGnews("not a url"), "not a url", "non-URL string is safe");
check(typeof unwrapGnews("https://news.google.com/rss/articles/") === "string", "empty blob path is safe");

finish();
