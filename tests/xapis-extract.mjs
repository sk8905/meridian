// Worker /api/xfeed — TwitterAPIs.com provider. Its exact response envelope isn't
// pinned in our offline docs, so xApisTweetsFrom() locates the tweets array across the
// plausible shapes, and the shared xNormalizeApiTweet() (already covered by
// xfeed-parse) flattens each into a card. Pure functions — no network. This guards the
// extraction so a provider swap can't silently yield an empty wire on a known shape.
import { xApisTweetsFrom, xNormalizeApiTweet } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

const one = {
  id: "2100283810713649999", url: "https://x.com/elerianm/status/2100283810713649999",
  text: "Flash PMIs split the Atlantic story wide open this morning. https://t.co/abc",
  createdAt: "Tue Sep 22 08:15:00 +0000 2026",
  author: { userName: "elerianm", name: "Mohamed A. El-Erian", profilePicture: "https://pbs.twimg.com/x.jpg" },
  extendedEntities: { media: [{ media_url_https: "https://pbs.twimg.com/media/y.jpg" }] },
};

// The tweets array may sit at .tweets, .data.tweets, .data (array), .results, .timeline,
// or the body may be a bare array — every one must be found.
checkEq(xApisTweetsFrom({ tweets: [one] }).length, 1, "extract: .tweets");
checkEq(xApisTweetsFrom({ data: { tweets: [one, one] } }).length, 2, "extract: .data.tweets");
checkEq(xApisTweetsFrom({ data: [one] }).length, 1, "extract: .data (array)");
checkEq(xApisTweetsFrom({ results: [one] }).length, 1, "extract: .results");
checkEq(xApisTweetsFrom({ timeline: [one] }).length, 1, "extract: .timeline");
checkEq(xApisTweetsFrom([one]).length, 1, "extract: bare array body");
checkEq(xApisTweetsFrom({}).length, 0, "extract: unknown shape → empty (no throw)");
checkEq(xApisTweetsFrom(null).length, 0, "extract: null → empty (no throw)");

// End to end: extracted records normalise into the app's card shape.
const cards = xApisTweetsFrom({ tweets: [one] }).map(xNormalizeApiTweet).filter(Boolean);
checkEq(cards.length, 1, "normalize: an extracted TwitterAPIs.com tweet becomes a card");
const c = cards[0];
checkEq(c.handle, "elerianm", "normalize: handle from author.userName");
check(/Flash PMIs/.test(c.text) && !/t\.co/.test(c.text), "normalize: text kept, trailing t.co trimmed");
check(c.ts > 0 && c.url.includes("/status/"), "normalize: timestamp + permalink present");

finish();
