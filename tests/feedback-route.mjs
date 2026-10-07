// The /api/feedback Worker route backs the reader's ⋯ "Not interested" / "Mute source"
// menu. It stores a reader's mutes per-user in KV (keyed on the verified Access email),
// serves them back for the cross-device merge (?mine=1), and — gated by the RESEARCH_KEY
// secret — dumps every reader's mutes so the scheduled refresh routine can bake durable
// excludes into curation. This exercises the handler directly with a fake KV + requests.
import { handleFeedback } from "../src/index.js";
import { check, checkEq, finish } from "./lib.mjs";

// Minimal in-memory KV with the three methods the handler uses.
function fakeKV() {
  const store = new Map();
  return {
    store,
    async get(k) { return store.has(k) ? store.get(k) : null; },
    async put(k, v) { store.set(k, v); },
    async list({ prefix = "", cursor, limit = 1000 } = {}) {
      const keys = [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name }));
      return { keys, list_complete: true, cursor: null };
    },
  };
}
// A request whose Access JWT carries the given email (identity() decodes the payload).
function req({ method = "GET", path = "/api/feedback", query = "", email = null, body = null, key = null }) {
  const headers = {};
  if (email) headers["cf-access-jwt-assertion"] = "h." + Buffer.from(JSON.stringify({ email })).toString("base64url") + ".s";
  if (key != null) headers["x-research-key"] = key;
  return {
    method,
    url: "https://wire.example" + path + (query ? "?" + query : ""),
    headers: { get: (k) => (headers[k.toLowerCase()] ?? null) },
    json: async () => { if (body == null) throw new Error("no body"); return body; },
  };
}
const body = (res) => res.json();

const EMAIL = "reader@example.com";

// --- unauthenticated write is refused -----------------------------------------
{
  const env = { WATCHLIST: fakeKV(), RESEARCH_KEY: "sekret" };
  const r = await handleFeedback(req({ method: "POST", body: { reason: "mute-source", source: "Channel NewsAsia" } }), env);
  checkEq(r.status, 401, "POST without an Access identity → 401");
}

// --- mute-source: stored, de-duped, and read back via ?mine=1 -----------------
{
  const env = { WATCHLIST: fakeKV(), RESEARCH_KEY: "sekret" };
  let r = await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "mute-source", source: "Channel NewsAsia", title: "Some story", url: "https://cna/x" } }), env);
  checkEq(r.status, 200, "mute-source POST → 200");
  // Same source again → de-duped to a single record.
  await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "mute-source", source: "Channel NewsAsia" } }), env);
  r = await handleFeedback(req({ method: "GET", query: "mine=1", email: EMAIL }), env);
  const d = await body(r);
  checkEq(d.items.length, 1, "mute-source is de-duped to one record");
  checkEq(d.items[0].source, "Channel NewsAsia", "the stored mute names the source");
  checkEq(d.items[0].reason, "mute-source", "the stored record carries the reason");
}

// --- not-interested keeps the story url + title; unmute removes it ------------
{
  const env = { WATCHLIST: fakeKV(), RESEARCH_KEY: "sekret" };
  await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "not-interested", url: "https://site/a", title: "A", source: "Site" } }), env);
  await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "not-interested", url: "https://site/b", title: "B", source: "Site" } }), env);
  let d = await body(await handleFeedback(req({ method: "GET", query: "mine=1", email: EMAIL }), env));
  checkEq(d.items.length, 2, "two distinct not-interested stories stored");
  // Unmute one story by url.
  await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "unmute", url: "https://site/a" } }), env);
  d = await body(await handleFeedback(req({ method: "GET", query: "mine=1", email: EMAIL }), env));
  checkEq(d.items.length, 1, "unmute drops the matching story");
  checkEq(d.items[0].url, "https://site/b", "the other story survives the unmute");
}

// --- an empty record (no url, no source) is rejected --------------------------
{
  const env = { WATCHLIST: fakeKV(), RESEARCH_KEY: "sekret" };
  const r = await handleFeedback(req({ method: "POST", email: EMAIL, body: { reason: "not-interested" } }), env);
  checkEq(r.status, 400, "a record with neither url nor source → 400");
}

// --- admin dump: wrong key forbidden, right key returns every reader's mutes --
{
  const env = { WATCHLIST: fakeKV(), RESEARCH_KEY: "sekret" };
  await handleFeedback(req({ method: "POST", email: "a@x.com", body: { reason: "mute-source", source: "Daily Mail" } }), env);
  await handleFeedback(req({ method: "POST", email: "b@x.com", body: { reason: "not-interested", url: "https://y/1", title: "Y1" } }), env);

  const forbidden = await handleFeedback(req({ method: "GET", query: "key=wrong" }), env);
  checkEq(forbidden.status, 403, "admin dump with a wrong key → 403");

  const r = await handleFeedback(req({ method: "GET", key: "sekret" }), env);
  checkEq(r.status, 200, "admin dump with the RESEARCH_KEY → 200");
  const d = await body(r);
  checkEq(d.users, 2, "dump counts both readers");
  check(Array.isArray(d.feedback) && d.feedback.length === 2, `dump returns every mute record (${d.feedback.length})`);
  check(d.feedback.some((f) => f.source === "Daily Mail") && d.feedback.some((f) => f.url === "https://y/1"),
    "dump includes each reader's mute");
}

// --- the dump requires the secret to be configured ----------------------------
{
  const env = { WATCHLIST: fakeKV() };   // no RESEARCH_KEY
  const r = await handleFeedback(req({ method: "GET", key: "anything" }), env);
  checkEq(r.status, 503, "admin dump with no RESEARCH_KEY configured → 503");
}

finish();
