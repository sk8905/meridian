// Worker /api/xfeed parser: xCollectTweets deep-walks X's syndication JSON for
// tweet-shaped records (defensive against envelope drift), xNormalizeTweet flattens
// each into the card shape the app renders. Pure functions — no network.
import { xCollectTweets, xNormalizeTweet } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

// A realistic __NEXT_DATA__-style envelope: two tweets under different shapes
// (inline `user`, and the newer `core.user_results.result.legacy`), plus noise.
const envelope = { props: { pageProps: { timeline: { entries: [
  { type: "tweet", content: { tweet: {
    id_str: "2097419714045624433",
    full_text: "The Fed delivered a 25bp hike, its first since 2023. https://t.co/abc123",
    created_at: "Wed Sep 16 18:30:00 +0000 2026",
    user: { name: "Mohamed A. El-Erian", screen_name: "elerianm", profile_image_url_https: "https://pbs.twimg.com/profile_images/e.jpg" },
    entities: { media: [{ media_url_https: "https://pbs.twimg.com/media/x.jpg" }] },
  } } },
  { type: "tweet", content: { tweet: {
    id: "2097400000000000000",
    text: "Passing along principles.",
    created_at: "Wed Sep 16 17:30:00 +0000 2026",
    core: { user_results: { result: { legacy: { name: "Ray Dalio", screen_name: "RayDalio", profile_image_url_https: "https://pbs.twimg.com/profile_images/r.jpg" } } } },
  } } },
  { type: "timelineCursor", content: { cursor: { value: "abc" } } },   // noise, not a tweet
] } } } };

const raw = [];
xCollectTweets(envelope, raw);
check(raw.length === 2, `collect: found the two tweet records, skipped the cursor (${raw.length})`);

const tweets = raw.map(xNormalizeTweet).filter(Boolean).sort((a, b) => b.ts - a.ts);
checkEq(tweets.length, 2, "normalize: both tweets normalise to card shape");

const el = tweets[0];
checkEq(el.handle, "elerianm", "normalize: inline user.screen_name is read");
checkEq(el.name, "Mohamed A. El-Erian", "normalize: display name is read");
check(!/t\.co/.test(el.text), "normalize: trailing t.co shortlink is stripped from the body");
check(/25bp hike/.test(el.text), "normalize: the real body text is kept");
checkEq(el.url, "https://x.com/elerianm/status/2097419714045624433", "normalize: permalink built from handle + id");
check(el.media[0] === "https://pbs.twimg.com/media/x.jpg", "normalize: media_url_https extracted");
check(el.ts > 0, "normalize: created_at parses to a sortable timestamp");

const rd = tweets[1];
checkEq(rd.handle, "RayDalio", "normalize: newer core.user_results.result.legacy shape is read");
checkEq(rd.id, "2097400000000000000", "normalize: numeric id (from `id`) is kept");

// Non-tweets normalise to null.
check(xNormalizeTweet({ id_str: "x", text: "no id", created_at: "now", user: {} }) === null, "normalize: a non-numeric id is rejected");
check(xNormalizeTweet(null) === null, "normalize: null input is safe");

finish();
