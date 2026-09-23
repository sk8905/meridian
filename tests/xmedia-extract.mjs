// Worker X-wire media extraction: xExtractMedia() pulls a tweet's image/video-thumbnail
// URLs out of whatever field the upstream used (extendedEntities / entities /
// extended_entities / legacy.* / mediaDetails / photos / a bare media[]), and — as a
// catch-all so an image is never silently dropped — deep-scans the record for
// pbs.twimg.com media URLs. Avatars are always excluded, and a quoted tweet's image is
// never mis-attributed to the quoter. Pure function, no network.
import { xExtractMedia, xNormalizeApiTweet } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

const IMG = "https://pbs.twimg.com/media/AbC123XyZ.jpg";
const IMG2 = "https://pbs.twimg.com/media/DeF456UvW.png";
const AVATAR = "https://pbs.twimg.com/profile_images/1016847534080155648/NGnyajkE_normal.jpg";

// Every structured shape the providers use resolves to the image.
checkEq(xExtractMedia({ extendedEntities: { media: [{ media_url_https: IMG }] } })[0], IMG, "extendedEntities.media (camelCase)");
checkEq(xExtractMedia({ entities: { media: [{ media_url_https: IMG }] } })[0], IMG, "entities.media");
checkEq(xExtractMedia({ extended_entities: { media: [{ media_url_https: IMG }] } })[0], IMG, "extended_entities.media (snake_case)");
checkEq(xExtractMedia({ legacy: { extended_entities: { media: [{ media_url_https: IMG }] } } })[0], IMG, "legacy.extended_entities.media (GraphQL)");
checkEq(xExtractMedia({ photos: [{ url: IMG }] })[0], IMG, "photos[].url (syndication)");
checkEq(xExtractMedia({ media: [{ type: "photo", media_url_https: IMG }] })[0], IMG, "bare media[]");

// The reported bug: a tweet whose image the structured fields miss, but whose JSON still
// carries the media URL (e.g. under a card / unexpected key) — the deep scan recovers it.
checkEq(xExtractMedia({ text: "👇🏼", card: { binding_values: { photo: { image_value: { url: IMG } } } } })[0], IMG, "deep-scan recovers a media URL from an unexpected field");

// Avatars are NEVER treated as media.
checkEq(xExtractMedia({ user: { profile_image_url_https: AVATAR }, text: "no image here" }).length, 0, "a profile avatar is not counted as media");
checkEq(xExtractMedia({ extendedEntities: { media: [{ media_url_https: IMG }] }, user: { profile_image_url_https: AVATAR } })[0], IMG, "avatar ignored when real media present");

// A quoted tweet's image is not mis-attributed to the quoter (deep-scan skipped when a
// quote is present and the outer tweet has no media of its own).
checkEq(xExtractMedia({ text: "look 👇", quoted_status: { extended_entities: { media: [{ media_url_https: IMG }] } } }).length, 0, "quoted-only media is NOT attributed to the quoter");

// &amp;-escaped URLs are normalised.
check(!xExtractMedia({ photos: [{ url: IMG + "?format=jpg&amp;name=large" }] })[0].includes("&amp;"), "&amp; in a media URL is normalised to &");

// Multiple images are kept (capped), de-duplicated.
checkEq(xExtractMedia({ extendedEntities: { media: [{ media_url_https: IMG }, { media_url_https: IMG2 }, { media_url_https: IMG }] } }).length, 2, "two distinct images kept, duplicate dropped");

// End to end through the TwitterAPIs.com / twitterapi.io normaliser.
const card = xNormalizeApiTweet({
  id: "2102556293974183982", text: "👇🏼", createdAt: "Wed Sep 23 00:30:58 +0000 2026",
  author: { userName: "elerianm", name: "Mohamed A. El-Erian" },
  extendedEntities: { media: [{ media_url_https: IMG }] },
});
checkEq((card.media || [])[0], IMG, "normalize: the El-Erian tweet now carries its image");

finish();
