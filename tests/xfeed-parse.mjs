// Worker /api/xfeed parser: xCollectTweets deep-walks X's syndication JSON for
// tweet-shaped records (defensive against envelope drift), xNormalizeTweet flattens
// each into the card shape the app renders. Pure functions — no network.
import { xCollectTweets, xNormalizeTweet, xNormalizeApiTweet, xQuotedCard } from "../src/index.js";
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
  // Newer GraphQL shape: tweet fields under `legacy`, user under core.user_results.
  { content: { tweetResult: { result: {
    rest_id: "2099999999999999999",
    core: { user_results: { result: {
      rest_id: "111",
      legacy: { screen_name: "sindap", name: "Sujeet Indap", profile_image_url_https: "https://pbs.twimg.com/profile_images/s.jpg" },
    } } },
    legacy: { full_text: "LIV ch 11 petition hits the docket.", created_at: "Wed Sep 16 19:00:00 +0000 2026", entities: { media: [] } },
  } } } },
  { type: "timelineCursor", content: { cursor: { value: "abc" } } },   // noise, not a tweet
] } } } };

const raw = [];
xCollectTweets(envelope, raw);
check(raw.length === 3, `collect: found all three tweet records (2 old-shape + 1 GraphQL), skipped the cursor (${raw.length})`);

const tweets = raw.map(xNormalizeTweet).filter(Boolean).sort((a, b) => b.ts - a.ts);
checkEq(tweets.length, 3, "normalize: all three tweets normalise to card shape");

// The GraphQL/legacy-shaped tweet is the newest — it must be captured, not skipped.
const gql = tweets[0];
checkEq(gql.handle, "sindap", "normalize: GraphQL core.user_results.result.legacy.screen_name is read");
checkEq(gql.id, "2099999999999999999", "normalize: GraphQL rest_id is used as the id");
check(/LIV ch 11/.test(gql.text), "normalize: GraphQL legacy.full_text is read");

const el = tweets.find((t) => t.handle === "elerianm");
checkEq(el.handle, "elerianm", "normalize: inline user.screen_name is read");
checkEq(el.name, "Mohamed A. El-Erian", "normalize: display name is read");
check(!/t\.co/.test(el.text), "normalize: trailing t.co shortlink is stripped from the body");
check(/25bp hike/.test(el.text), "normalize: the real body text is kept");
checkEq(el.url, "https://x.com/elerianm/status/2097419714045624433", "normalize: permalink built from handle + id");
check(el.media[0] === "https://pbs.twimg.com/media/x.jpg", "normalize: media_url_https extracted");
check(el.ts > 0, "normalize: created_at parses to a sortable timestamp");

const rd = tweets.find((t) => t.handle === "RayDalio");
checkEq(rd.handle, "RayDalio", "normalize: newer core.user_results.result.legacy shape is read");
checkEq(rd.id, "2097400000000000000", "normalize: numeric id (from `id`) is kept");

// Non-tweets normalise to null.
check(xNormalizeTweet({ id_str: "x", text: "no id", created_at: "now", user: {} }) === null, "normalize: a non-numeric id is rejected");
check(xNormalizeTweet(null) === null, "normalize: null input is safe");

// --- twitterapi.io (paid) tweet shape --------------------------------------
const apiTweet = {
  id: "2100000000000000001",
  url: "https://x.com/nishantkumar07/status/2100000000000000001",
  text: "EXCLUSIVE: Millennium is taking back cash from Engineers Gate. https://t.co/zzz",
  createdAt: "Wed Sep 16 20:15:00 +0000 2026",
  author: { userName: "nishantkumar07", name: "Nishant Kumar", profilePicture: "https://pbs.twimg.com/profile_images/n.jpg" },
  extendedEntities: { media: [{ media_url_https: "https://pbs.twimg.com/media/z.jpg" }] },
};
const api = xNormalizeApiTweet(apiTweet);
check(!!api, "api-normalize: a twitterapi.io tweet normalises");
checkEq(api.handle, "nishantkumar07", "api-normalize: author.userName → handle");
checkEq(api.name, "Nishant Kumar", "api-normalize: author.name → name");
check(!/t\.co/.test(api.text) && /Millennium/.test(api.text), "api-normalize: text kept, trailing t.co stripped");
checkEq(api.url, "https://x.com/nishantkumar07/status/2100000000000000001", "api-normalize: post url preserved");
check(api.media[0] === "https://pbs.twimg.com/media/z.jpg", "api-normalize: extendedEntities media extracted");
check(api.ts > 0, "api-normalize: createdAt parses to a timestamp");
check(xNormalizeApiTweet({ id: "nope", text: "x", createdAt: "now" }) === null, "api-normalize: non-numeric id rejected");

// A repost (retweet): render the ORIGINAL's content, attributed with repostedBy,
// ordered by the repost time, linking the original permalink.
const repost = xNormalizeApiTweet({
  id: "2100000000000000099",
  createdAt: "Wed Sep 17 06:00:00 +0000 2026",
  author: { userName: "elerianm", name: "Mohamed A. El-Erian", profilePicture: "https://pbs.twimg.com/e.jpg" },
  retweeted_tweet: {
    id: "2099999999999999000",
    text: "The most important factor driving up bond yields is the fundamental imbalance...",
    createdAt: "Wed Sep 17 00:00:00 +0000 2026",
    author: { userName: "TheEconomist", name: "The Economist", profilePicture: "https://pbs.twimg.com/econ.jpg" },
    extendedEntities: { media: [{ media_url_https: "https://pbs.twimg.com/media/e.jpg" }] },
  },
});
check(!!repost, "repost: a retweet normalises (not dropped)");
checkEq(repost.handle, "TheEconomist", "repost: content is attributed to the ORIGINAL author");
checkEq(repost.repostedBy, "Mohamed A. El-Erian", "repost: repostedBy names the account that reposted it");
check(/driving up bond yields/.test(repost.text), "repost: the original tweet's text is shown");
checkEq(repost.id, "2100000000000000099", "repost: the retweet's own id is used for dedupe");
checkEq(repost.url, "https://x.com/TheEconomist/status/2099999999999999000", "repost: links the original post");
check(repost.media[0] === "https://pbs.twimg.com/media/e.jpg", "repost: original media is carried through");
// The feed ORDERS by the repost time (when it hit the timeline) …
checkEq(repost.ts, Date.parse("Wed Sep 17 06:00:00 +0000 2026"), "repost: ordered (ts) by the repost time");
// … but DISPLAYS the ORIGINAL tweet's timestamp, matching how X shows "· 1h" next
// to the original author (not the age of the repost action).
check(repost.date === "Wed Sep 17 00:00:00 +0000 2026", "repost: displays the ORIGINAL tweet's timestamp (like X)");
// The two must genuinely differ here, or the assertion above proves nothing.
check(repost.ts !== Date.parse(repost.date), "repost: display time and ordering time are distinct on a repost");
// An ordinary tweet / a plain repost carries no quoted card.
check(api.quoted === undefined, "quote: an ordinary tweet has no quoted card");
check(repost.quoted === undefined, "quote: a plain repost has no quoted card");

// --- Quote tweet: the quoter's own commentary + the embedded ORIGINAL ----------
// twitterapi.io nests the quoted tweet under `quoted_tweet`; we keep the outer card
// as the quoter's commentary and carry the original through as `quoted` so the
// client nests it (the original was previously dropped entirely).
const quote = xNormalizeApiTweet({
  id: "2100000000000000200",
  url: "https://x.com/AntoineGara/status/2100000000000000200",
  text: "What kind of DCF are we using here??? The cutoff is $4.4bn...",
  createdAt: "Wed Sep 17 07:00:00 +0000 2026",
  author: { userName: "AntoineGara", name: "Antoine Gara", profilePicture: "https://pbs.twimg.com/a.jpg" },
  quoted_tweet: {
    id: "2099999999999999500",
    url: "https://x.com/Forbes/status/2099999999999999500",
    text: "Taylor Swift joined the billionaire ranks in 2023, on the back of her record-breaking global Eras Tour. https://t.co/xyz",
    createdAt: "Wed Sep 17 01:00:00 +0000 2026",
    author: { userName: "Forbes", name: "Forbes" },
    extendedEntities: { media: [{ media_url_https: "https://pbs.twimg.com/media/ts.jpg" }] },
  },
});
check(!!quote, "quote: a quote tweet normalises");
checkEq(quote.handle, "AntoineGara", "quote: the OUTER card stays the quoter (their own commentary)");
check(/DCF/.test(quote.text), "quote: the quoter's own text is shown on the card");
check(!!quote.quoted, "quote: the embedded original is carried through as `quoted` (was dropped before)");
checkEq(quote.quoted.handle, "Forbes", "quote: the quoted card names the original author");
checkEq(quote.quoted.name, "Forbes", "quote: the quoted author display name is read");
check(/Taylor Swift/.test(quote.quoted.text), "quote: the quoted original's text comes through");
check(!/t\.co/.test(quote.quoted.text), "quote: the quoted text strips its trailing t.co");
check(quote.quoted.media[0] === "https://pbs.twimg.com/media/ts.jpg", "quote: the quoted media is carried");
checkEq(quote.quoted.url, "https://x.com/Forbes/status/2099999999999999500", "quote: the quoted card links the original tweet");

// Syndication/GraphQL shape: the original lives under quoted_status_result.result.
const synQuote = xNormalizeTweet({
  rest_id: "2099999999999999600",
  core: { user_results: { result: { legacy: { screen_name: "sindap", name: "Sujeet Indap" } } } },
  legacy: { full_text: "This is worth reading.", created_at: "Wed Sep 16 21:00:00 +0000 2026" },
  quoted_status_result: { result: {
    rest_id: "2099999999999999601",
    core: { user_results: { result: { legacy: { screen_name: "FT", name: "Financial Times" } } } },
    legacy: { full_text: "Private equity's next reckoning.", created_at: "Wed Sep 16 20:00:00 +0000 2026" },
  } },
});
check(!!synQuote && !!synQuote.quoted, "quote: a GraphQL quoted_status_result original is carried");
checkEq(synQuote.quoted.handle, "FT", "quote: the GraphQL quoted author handle is read");
check(/next reckoning/.test(synQuote.quoted.text), "quote: the GraphQL quoted text comes through");

// Direct guards.
check(xQuotedCard(null) === null, "quote: xQuotedCard(null) is safe");
check(xQuotedCard({}) === null, "quote: an empty quoted object yields nothing to render");

finish();
