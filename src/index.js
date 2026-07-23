// Cloudflare Worker entry — serves the static site (via the ASSETS binding) and
// the per-user watchlist API at /api/watchlist plus the Wire Legal saved-
// items API at /api/saved (both backed by the WATCHLIST KV, distinct prefixes).
//
// The whole Worker is gated by Cloudflare Access, so every request that reaches
// here is already authenticated; Access injects a signed identity JWT
// (Cf-Access-Jwt-Assertion) which we decode to key each user's watchlist by
// their verified email. Static asset requests are served before this Worker is
// invoked; anything else (the API, unknown paths) lands here.

const FOLLOW_TYPES = ["manager", "fund", "lp", "firm"];

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

// Read + decode the Access JWT email claim. Access has already verified the
// token at the edge, so we only decode (not re-verify) the payload here.
function identity(request) {
  const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!jwt) return null;
  try {
    const part = jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part));
    return (payload.email || payload.sub || "").toLowerCase() || null;
  } catch {
    return null;
  }
}

const keyFor = (email) => "wl:" + email;
// Wire Legal saved alerts/cases/matters — a flat array of item ids, keyed
// under a distinct prefix in the same KV namespace so it never collides with a
// watchlist. Per-user isolation comes from the verified Access email, exactly
// like the watchlist, so saved items sync across that user's devices.
// Two distinct saved-items stores share this handler via different key prefixes
// so the Legal and Credit apps never overwrite each other's saved sets.
const savedKeyFor = (email) => "lsv:" + email;         // Wire Legal
const savedCreditKeyFor = (email) => "csv:" + email;   // Wire Credit
const savedMacroKeyFor = (email) => "msv:" + email;    // Wire Macro
const savedHomeKeyFor = (email) => "hsv:" + email;     // Home-wire bookmarks (self-contained snapshots)
// Per-user "notifications seen" sets — the ids a user has already acknowledged in
// each app's notification bell, so an item marked seen on one device stops
// showing as new on that user's other devices. One prefix per app.
const notifMacroKey = (email) => "nmac:" + email;
const notifCreditKey = (email) => "ncre:" + email;
const notifLegalKey = (email) => "nleg:" + email;
const chartPrefsKey = (email) => "chart:" + email;

// GET → { email, seen: [...ids] }; PUT { seen: [...ids] } stores it. Ids can be
// long (some are URLs), so the cap is generous; the set is bounded to a user's
// recent feed on each acknowledge.
async function handleNotifSeen(request, env, keyFor) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);
  if (request.method === "GET") {
    const raw = await env.WATCHLIST.get(keyFor(email));
    let seen = [];
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p)) seen = p; } catch { /* keep default */ } }
    return json({ email, seen });
  }
  if (request.method === "PUT") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
    const seen = Array.isArray(body.seen)
      ? body.seen.filter((x) => typeof x === "string" && x.length <= 400).slice(0, 4000)
      : [];
    await env.WATCHLIST.put(keyFor(email), JSON.stringify(seen));
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
}

// Per-user Chart selection (selected indicators + toggled events), synced across
// devices via KV keyed on the verified Access email.
async function handleChartPrefs(request, env) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);
  if (request.method === "GET") {
    const raw = await env.WATCHLIST.get(chartPrefsKey(email));
    let sel = [], events = [], range = "5y", dashRange = "5y", stored = false;
    if (raw) {
      try { const p = JSON.parse(raw); if (p && Array.isArray(p.sel) && Array.isArray(p.events)) { sel = p.sel; events = p.events; if (typeof p.range === "string") range = p.range; if (typeof p.dashRange === "string") dashRange = p.dashRange; stored = true; } } catch { /* keep default */ }
    }
    return json({ email, stored, sel, events, range, dashRange });
  }
  if (request.method === "PUT") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
    const clean = (a) => (Array.isArray(a) ? a.filter((x) => typeof x === "string" && x.length <= 60).slice(0, 60) : []);
    const range = (typeof body.range === "string" && body.range.length <= 8) ? body.range : "5y";
    const dashRange = (typeof body.dashRange === "string" && body.dashRange.length <= 8) ? body.dashRange : "5y";
    await env.WATCHLIST.put(chartPrefsKey(email), JSON.stringify({ sel: clean(body.sel), events: clean(body.events), range, dashRange }));
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
}

async function handleSaved(request, env, keyFor) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);

  if (request.method === "GET") {
    const raw = await env.WATCHLIST.get(keyFor(email));
    let saved = [];
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p)) saved = p; } catch { /* keep default */ } }
    return json({ email, saved });
  }

  if (request.method === "PUT") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
    const saved = Array.isArray(body.saved)
      ? body.saved.filter((x) => typeof x === "string" && x.length <= 24).slice(0, 10000)
      : [];
    await env.WATCHLIST.put(keyFor(email), JSON.stringify(saved));
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
}

// Home-wire bookmarks — the press-and-hold saves on rows with NO app saved-id
// (live headlines, Letters, FT, Substacks). Unlike the three id-set stores
// above these are self-contained SNAPSHOT OBJECTS ({k, desk, title, href, ext,
// date, time, src}) — the underlying wire is ephemeral, so the row itself is
// what's kept. Same per-user KV, "hsv:" prefix; fields sanitised and bounded.
async function handleSavedHome(request, env) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);
  if (request.method === "GET") {
    const raw = await env.WATCHLIST.get(savedHomeKeyFor(email));
    let saved = [];
    if (raw) { try { const p = JSON.parse(raw); if (Array.isArray(p)) saved = p; } catch { /* keep default */ } }
    return json({ email, saved });
  }
  if (request.method === "PUT") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
    const str = (v, max) => (typeof v === "string" ? v.slice(0, max) : "");
    const saved = (Array.isArray(body.saved) ? body.saved : [])
      .filter((o) => o && typeof o === "object" && typeof o.k === "string" && o.k && typeof o.title === "string" && o.title)
      .slice(0, 500)
      .map((o) => ({
        k: str(o.k, 700), desk: str(o.desk, 12) || "m", title: str(o.title, 500),
        href: str(o.href, 1000) || "#", ext: !!o.ext,
        date: str(o.date, 10), time: str(o.time, 5), src: str(o.src, 120),
      }));
    await env.WATCHLIST.put(savedHomeKeyFor(email), JSON.stringify(saved));
    return json({ ok: true });
  }
  return json({ error: "method not allowed" }, 405);
}

async function handleWatchlist(request, env) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);

  if (request.method === "GET") {
    const raw = await env.WATCHLIST.get(keyFor(email));
    let watchlist = { manager: [], fund: [], lp: [] };
    if (raw) { try { watchlist = JSON.parse(raw); } catch { /* keep default */ } }
    return json({ email, watchlist });
  }

  if (request.method === "PUT") {
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
    // A type the client didn't send keeps its stored value (older clients only
    // send manager/fund/lp — a PUT from them must not wipe firm follows).
    let prev = {};
    const rawPrev = await env.WATCHLIST.get(keyFor(email));
    if (rawPrev) { try { prev = JSON.parse(rawPrev) || {}; } catch { /* keep default */ } }
    const clean = {};
    for (const t of FOLLOW_TYPES) {
      clean[t] = Array.isArray(body[t])
        ? body[t].filter((x) => typeof x === "string" && x.length <= 16).slice(0, 5000)
        : (Array.isArray(prev[t]) ? prev[t] : []);
    }
    await env.WATCHLIST.put(keyFor(email), JSON.stringify(clean));
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
}

// Aggregate "research targets" — the UNION of every user's watchlisted entity ids
// (managers / funds / investors), so the scheduled refresh routine can spend its
// deeper research budget on exactly the names people follow. It returns only the
// set of ids to research (which the routine resolves to names via data.js) — never
// who follows what. Guarded by a shared secret (the RESEARCH_KEY Worker secret):
// the caller sends `X-Research-Key: <secret>` (or ?key=<secret>). Because the whole
// site sits behind Cloudflare Access, a headless routine must also be let past the
// edge — add an Access *Bypass* policy for this one path, or call it with an Access
// service token. Read-only; never mutates KV.
async function handleResearchTargets(request, env) {
  if (request.method !== "GET") return json({ error: "method not allowed" }, 405);
  const secret = env.RESEARCH_KEY;
  if (!secret) return json({ error: "not configured" }, 503);
  const url = new URL(request.url);
  const given = request.headers.get("x-research-key") || url.searchParams.get("key") || "";
  // Constant-ish comparison; lengths differ rarely and this is not a timing-sensitive path.
  if (!given || given !== secret) return json({ error: "forbidden" }, 403);

  const out = { manager: new Set(), fund: new Set(), lp: new Set() };
  let users = 0, cursor;
  try {
    do {
      const page = await env.WATCHLIST.list({ prefix: keyFor(""), cursor, limit: 1000 });
      for (const k of page.keys) {
        const raw = await env.WATCHLIST.get(k.name);
        if (!raw) continue;
        let wl; try { wl = JSON.parse(raw); } catch { continue; }
        let any = false;
        for (const t of FOLLOW_TYPES) {
          const arr = Array.isArray(wl[t]) ? wl[t] : [];
          for (const id of arr) { if (typeof id === "string" && id) { out[t].add(id); any = true; } }
        }
        if (any) users++;
      }
      cursor = page.list_complete ? null : page.cursor;
    } while (cursor);
  } catch (e) {
    return json({ error: String((e && e.message) || e) }, 500);
  }
  return json({ users, manager: [...out.manager], fund: [...out.fund], lp: [...out.lp], ts: Date.now() });
}

// Return the signed-in identity (from the Access JWT) so the branded landing
// page can greet the user and gate entry to both /credit/ and /legal/. When the
// site is behind one Cloudflare Access application covering the whole host, a
// single sign-in authenticates every path here.
function handleMe(request) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);
  return json({ email });
}

// Key rates & credit spreads for the Credit dashboard. Pulled server-side (so
// there's no CORS issue and no browser-visible key). Five series come from FRED's
// public keyless CSV feed; 3M EURIBOR comes from the ECB Data Portal (also
// keyless) since FRED has no live daily EURIBOR (its EUR3MTD156N was Euro LIBOR,
// discontinued). Results are edge-cached 30 min (these are daily fixings), but
// only when fully populated so a transient upstream miss can't stick.
const RATE_SERIES = [
  { label: "US 10Y", unit: "%", src: "treasury", col: "10 Yr", href: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve" },
  { label: "SOFR", unit: "%", src: "nyfed", href: "https://www.newyorkfed.org/markets/reference-rates/sofr" },
  { label: "SONIA", unit: "%", src: "fred", id: "IUDSOIA", href: "https://fred.stlouisfed.org/series/IUDSOIA" },
  // EURIBOR is published on TARGET business days; ECB's business-daily frequency
  // code is "B" (not "D"). Try business-daily, then daily, then monthly average
  // as a guaranteed fallback so the tile always resolves.
  { label: "3M EURIBOR", unit: "%", src: "ecb",
    href: "https://data.ecb.europa.eu/data/datasets/FM/FM.M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA",
    keys: [
    "B.U2.EUR.RT.MM.EURIBOR3MD_.HSTA",
    "D.U2.EUR.RT.MM.EURIBOR3MD_.HSTA",
    "M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA",
  ] },
  // ICE BofA option-adjusted spreads (FRED, via the API key). Reported in % → shown as bp.
  { label: "US IG OAS", unit: "bp", src: "fred", id: "BAMLC0A0CM", href: "https://fred.stlouisfed.org/series/BAMLC0A0CM" },
  { label: "US HY OAS", unit: "bp", src: "fred", id: "BAMLH0A0HYM2", href: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2" },
  { label: "US CCC OAS", unit: "bp", src: "fred", id: "BAMLH0A3HYC", href: "https://fred.stlouisfed.org/series/BAMLH0A3HYC" },
  { label: "EURO HY OAS", unit: "bp", src: "fred", id: "BAMLHE00EHYIOAS", href: "https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS" },
];

// Browser-like headers: FRED's fredgraph.csv endpoint throttles/blocks obvious
// bot user-agents, so present as a normal browser (harmless for ECB too). Referer
// is set to the target's own origin, which some endpoints check.
function fetchHeaders(url) {
  return {
    "accept": "text/csv, application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "referer": new URL(url).origin + "/",
  };
}

// Fetch text with a couple of retries; small CSVs so this is cheap. Only 200s are
// cached (no cacheEverything) so a transient 404/403 is never held.
async function fetchText(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(url, { headers: fetchHeaders(url), cf: { cacheTtl: 900 } });
      if (r.ok) return await r.text();
    } catch { /* retry */ }
  }
  return null;
}

// Given [date, valueStr] pairs (any order), return the latest value + day change
// plus a short recent history (~1 month) for a trend sparkline.
function lastTwo(pairs) {
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const nums = pairs.map((p) => parseFloat(p[1])).filter((v) => Number.isFinite(v));
  const last = pairs[pairs.length - 1], prev = pairs[pairs.length - 2];
  const val = last ? parseFloat(last[1]) : null;
  const prevVal = prev ? parseFloat(prev[1]) : null;
  return {
    value: Number.isFinite(val) ? val : null,
    change: (Number.isFinite(val) && Number.isFinite(prevVal)) ? +(val - prevVal).toFixed(4) : null,
    asOf: last ? last[0] : null,
    history: nums.slice(-22), // ~1 month of trading days
  };
}

// SOFR from the NY Fed's public JSON API (no key; not behind FRED's Cloudflare).
async function nyfedSofr() {
  const txt = await fetchText("https://markets.newyorkfed.org/api/rates/secured/sofr/last/25.json");
  if (!txt) return { value: null, change: null, asOf: null };
  let j; try { j = JSON.parse(txt); } catch { return { value: null, change: null, asOf: null }; }
  const pairs = (j.refRates || [])
    .filter((r) => r.type === "SOFR" && r.percentRate != null)
    .map((r) => [r.effectiveDate, String(r.percentRate)]);
  return lastTwo(pairs);
}

// US 10Y from the Treasury's daily par-yield-curve CSV (no key). The header is
// quoted ("10 Yr" etc.) and dates are MM/DD/YYYY, newest first.
async function treasurySeries(col) {
  const y = new Date().getFullYear();
  const txt = await fetchText(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&_format=csv`);
  if (!txt) return { value: null, change: null, asOf: null };
  const lines = txt.trim().split(/\r?\n/);
  if (lines.length < 2) return { value: null, change: null, asOf: null };
  const header = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
  const ci = header.indexOf(col), di = header.indexOf("Date");
  if (ci < 0 || di < 0) return { value: null, change: null, asOf: null };
  const pairs = [];
  for (const line of lines.slice(1)) {
    const c = line.split(",");
    const m = (c[di] || "").replace(/^"|"$/g, "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    const v = (c[ci] || "").trim();
    if (!m || v === "") continue;
    pairs.push([`${m[3]}-${m[1]}-${m[2]}`, v]); // normalise to YYYY-MM-DD for sorting
  }
  return lastTwo(pairs);
}

// The whole US Treasury par yield curve in ONE fetch: pulls the latest-dated row
// from the daily curve CSV and reads the requested columns (e.g. "3 Mo", "2 Yr",
// "10 Yr", "30 Yr"). Returns { values: {col: yield|null}, asOf: "YYYY-MM-DD"|null }.
async function treasuryCurve(cols) {
  const res = {}; cols.forEach((c) => (res[c] = null));
  const y = new Date().getFullYear();
  const txt = await fetchText(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&_format=csv`);
  if (!txt) return { values: res, asOf: null };
  const lines = txt.trim().split(/\r?\n/);
  if (lines.length < 2) return { values: res, asOf: null };
  const header = lines[0].split(",").map((h) => h.replace(/^"|"$/g, "").trim());
  const di = header.indexOf("Date");
  if (di < 0) return { values: res, asOf: null };
  // Find the newest-dated row (the CSV isn't guaranteed sorted).
  let bestIso = "", best = null;
  for (const line of lines.slice(1)) {
    const c = line.split(",");
    const m = (c[di] || "").replace(/^"|"$/g, "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) continue;
    const iso = `${m[3]}-${m[1]}-${m[2]}`;
    if (iso > bestIso) { bestIso = iso; best = c; }
  }
  if (!best) return { values: res, asOf: null };
  cols.forEach((col) => {
    const ci = header.indexOf(col);
    const v = ci >= 0 ? parseFloat((best[ci] || "").trim()) : NaN;
    if (Number.isFinite(v)) res[col] = v;
  });
  return { values: res, asOf: bestIso };
}

// Latest yield from MarketWatch's keyless "download data" CSV for a bond (e.g.
// tmbmkgb-02y = the Tullett Prebon UK 2Y gilt benchmark). Returns the most recent
// Close (the yield) or null. countrycode=bx is MarketWatch's cross-venue feed.
async function marketwatchBondYield(ticker) {
  const now = new Date();
  const start = new Date(now.getTime() - 45 * 864e5);
  const fmt = (d) => `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`;
  const url = `https://www.marketwatch.com/investing/bond/${encodeURIComponent(ticker)}/downloaddatapartial`
    + `?startdate=${encodeURIComponent(fmt(start) + " 00:00:00")}&enddate=${encodeURIComponent(fmt(now) + " 23:59:59")}`
    + `&daterange=d30&frequency=p1d&csvdownload=true&downloadpartial=false&newdates=false&countrycode=bx`;
  const txt = await fetchText(url);
  if (!txt) return null;
  const lines = txt.trim().split(/\r?\n/);
  if (lines.length < 2) return null;
  const h = lines[0].split(",").map((x) => x.replace(/^"|"$/g, "").trim());
  const ci = h.indexOf("Close"), di = h.indexOf("Date");
  if (ci < 0) return null;
  const clean = (x) => (x || "").replace(/["%,]/g, "").trim();
  const norm = (x) => { const m = clean(x).match(/(\d{2})\/(\d{2})\/(\d{4})/); return m ? `${m[3]}-${m[1]}-${m[2]}` : clean(x); };
  const pairs = lines.slice(1).map((l) => l.split(","))
    .map((c) => [di >= 0 ? norm(c[di]) : "", parseFloat(clean(c[ci]))])
    .filter((p) => Number.isFinite(p[1]));
  if (!pairs.length) return null;
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : 1)); // oldest→newest, take the latest close
  return pairs[pairs.length - 1][1];
}

// Latest yield from CNBC's keyless quote service for a bond symbol (e.g.
// UK2Y-GB = the UK 2Y gilt). Returns the last price (the yield) or null.
async function cnbcYield(symbol) {
  const url = `https://quote.cnbc.com/quote-html-webservice/restQuote/symbolType/symbol?symbols=${encodeURIComponent(symbol)}&requestMethod=itv&noform=1&partnerId=2&fund=1&exthrs=1&output=json&events=1`;
  const txt = await fetchText(url);
  if (!txt) return null;
  try {
    const j = JSON.parse(txt);
    const q = j && j.FormattedQuoteResult && j.FormattedQuoteResult.FormattedQuote && j.FormattedQuoteResult.FormattedQuote[0];
    const v = q ? parseFloat(String(q.last).replace(/[%,]/g, "")) : NaN;
    return Number.isFinite(v) ? v : null;
  } catch { return null; }
}

// Parse a FRED CSV body (DATE,VALUE header) into [date, value] pairs.
function parseFredCsv(txt) {
  return txt.trim().split(/\r?\n/).slice(1)
    .map((l) => l.split(","))
    .filter((c) => c.length >= 2 && c[1] !== "" && c[1] !== ".")
    .map((c) => [c[0], c[1]]);
}

// FRED-only series (SONIA, ICE BofA OAS spreads) have no working no-key source —
// FRED's site returns Cloudflare 520 to Workers. Use the official FRED API when a
// key is configured (api.stlouisfed.org is reachable); fall back to the CSV.
async function fredSeries(id, cosd, env) {
  if (env && env.FRED_API_KEY) {
    const txt = await fetchText(`https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${env.FRED_API_KEY}&file_type=json&sort_order=desc&limit=30`);
    if (txt) {
      try {
        const obs = (JSON.parse(txt).observations || [])
          .filter((o) => o.value !== "." && o.value !== "")
          .map((o) => [o.date, o.value]);
        if (obs.length) return lastTwo(obs);
      } catch { /* fall through to CSV */ }
    }
  }
  const txt = await fetchText(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=${cosd}`);
  const pairs = txt ? parseFredCsv(txt) : [];
  return pairs.length ? lastTwo(pairs) : { value: null, change: null, asOf: null };
}

async function ecbSeries(keys) {
  for (const key of keys) {
    const txt = await fetchText(`https://data-api.ecb.europa.eu/service/data/FM/${key}?lastNObservations=30&format=csvdata`);
    if (!txt) continue;
    const lines = txt.trim().split(/\r?\n/);
    if (lines.length < 2) continue;
    const h = lines[0].split(",");
    const ti = h.indexOf("TIME_PERIOD"), vi = h.indexOf("OBS_VALUE");
    if (ti < 0 || vi < 0) continue;
    const pairs = lines.slice(1)
      .map((l) => l.split(","))
      .filter((c) => c[vi] !== undefined && c[vi] !== "")
      .map((c) => [c[ti], c[vi]]);
    if (pairs.length) return lastTwo(pairs);
  }
  return { value: null, change: null, asOf: null };
}

async function handleRates(request, env, ctx) {
  const url = new URL(request.url);
  // Only the last ~60 days, so each FRED CSV is small and fast.
  const cosd = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);

  // /api/rates?debug=1 — probe candidate upstream hosts directly and report the
  // HTTP status + a short response snippet, so we can see which sources this Worker
  // can actually reach (FRED's site returns Cloudflare 520 to Workers). Not cached;
  // read-only, no secrets. ?debug=2 additionally probes no-key alternative sources.
  if (url.searchParams.get("debug")) {
    const y = cosd.slice(0, 4);
    const probeUrls = [
      ["ecb M EURIBOR", `https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.RT.MM.EURIBOR3MD_.HSTA?lastNObservations=3&format=csvdata`],
      ["FRED csv DGS10", `https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10&cosd=${cosd}`],
    ];
    if (url.searchParams.get("debug") === "2") {
      probeUrls.push(
        ["FRED api DGS10 (no key)", `https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&file_type=json&sort_order=desc&limit=2`],
        ["DBnomics A DGS10", `https://api.db.nomics.world/v22/series/FRED/DGS10?observations=1`],
        ["DBnomics B DGS10", `https://api.db.nomics.world/v22/series?series_ids=FRED/DGS10&observations=1`],
        ["DBnomics HY-OAS", `https://api.db.nomics.world/v22/series?series_ids=FRED/BAMLH0A0HYM2&observations=1`],
        ["NYFed SOFR", `https://markets.newyorkfed.org/api/rates/secured/sofr/last/2.json`],
        ["Treasury 10Y", `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&_format=csv`],
      );
    }
    const probes = await Promise.all(probeUrls.map(async ([label, u]) => {
      try {
        const r = await fetch(u, { headers: fetchHeaders(u) });
        const body = await r.text();
        return { label, status: r.status, ok: r.ok, len: body.length, snippet: body.slice(0, 200) };
      } catch (e) {
        return { label, error: String(e && e.message || e) };
      }
    }));
    return new Response(JSON.stringify({ cosd, probes }, null, 2), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }

  const cache = caches.default;
  // Versioned key so a previously-cached partial response is ignored.
  const cacheKey = new Request(new URL("/api/rates?v=10", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const data = await Promise.all(RATE_SERIES.map(async (s) => {
    const r = s.src === "ecb" ? await ecbSeries(s.keys)
      : s.src === "nyfed" ? await nyfedSofr()
      : s.src === "treasury" ? await treasurySeries(s.col)
      : await fredSeries(s.id, cosd, env);
    return { label: s.label, unit: s.unit, value: r.value, change: r.change, asOf: r.asOf, href: s.href, history: r.history || [] };
  }));
  const resp = new Response(JSON.stringify({ rates: data }), {
    // Short browser cache (band also caches in-module per load); edge does the heavy lifting.
    headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
  });
  // Only cache once every series resolved, so a transient miss doesn't stick 30 min.
  if (ctx && ctx.waitUntil && data.every((d) => d.value != null)) {
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  }
  return resp;
}

// ============================ MARKETS BANNER ===============================
// Equity indices + ETFs for the Glance dashboard (the banner above key rates).
// The two US indices come from FRED (keyed, reliable); the two LSE-listed iShares
// UCITS ETFs come from Yahoo Finance's keyless chart API (FRED carries no ETF
// prices). Same tile shape as the rates band: latest level/price, daily % change
// and a ~1-month sparkline. Edge-cached briefly so it's near-live without
// hammering the upstreams, and only cached once fully populated.
// Primary source is Yahoo Finance's chart API (live intraday `regularMarketPrice`
// for every instrument — indices, LSE ETFs, Brent oil & gold front-month futures,
// the ICE US Dollar Index (DXY)
// and Bitcoin). `fred`/`stooq` are daily-close FALLBACKS used only if Yahoo can't
// be reached from the Worker, so a tile degrades to a daily print rather than "—".
const MARKET_SERIES = [
  { label: "S&P 500", symbol: "^GSPC", future: "ES=F", fred: "SP500", href: "https://finance.yahoo.com/quote/%5EGSPC" },
  { label: "NASDAQ", symbol: "^IXIC", future: "NQ=F", fred: "NASDAQCOM", href: "https://finance.yahoo.com/quote/%5EIXIC" },
  { label: "IGWD", symbol: "IGWD.L", stooq: "igwd.uk", href: "https://uk.finance.yahoo.com/quote/IGWD.L" },
  { label: "EMEE", symbol: "EMEE.L", stooq: "emee.uk", href: "https://uk.finance.yahoo.com/quote/EMEE.L" },
  // Second row: commodity, FX & crypto spot. "Oil" is WTI crude — Investing.com's
  // "CL" (crude oil WTI); the live quote comes from the equivalent NYMEX front-
  // month (CL=F), with FRED's Cushing WTI spot as the fallback, and the tile links
  // to Investing.com's CL page. "DXY" is the ICE US Dollar Index.
  { label: "Oil", symbol: "CL=F", fred: "DCOILWTICO", href: "https://www.investing.com/commodities/crude-oil" },
  { label: "Gold", symbol: "GC=F", fred: "GOLDPMGBD228NLBM", href: "https://finance.yahoo.com/quote/GC=F" },
  { label: "DXY", symbol: "DX-Y.NYB", href: "https://finance.yahoo.com/quote/DX-Y.NYB" },
  { label: "Bitcoin", symbol: "BTC-USD", fred: "CBBTCUSD", href: "https://finance.yahoo.com/quote/BTC-USD" },
];

// The reader's own ETF book (the Markets-panel Portfolio tab). EMEE and IGWD are
// already in MARKET_SERIES (the tiles) so their quotes are reused; these are the
// remaining holdings that need a live GBP price. LSE lines quote in GBp and
// yahooQuote rescales them to GBP-major, so the client's £ buy prices compare
// like-for-like. BTC-GBP is priced directly in GBP.
const PORTFOLIO_EXTRA = [
  { label: "COMM", symbol: "COMM.L", stooq: "comm.uk" },
  { label: "CNX1", symbol: "CNX1.L", stooq: "cnx1.uk" },
  { label: "WMVG", symbol: "WMVG.L", stooq: "wmvg.uk" },
  { label: "BTCGBP", symbol: "BTC-GBP" },
];

// Extra cross-asset instruments used ONLY to widen the pool the Glance one-liner
// ticker chips pick their top movers from — so the chips aren't limited to the 8
// banner tiles above. Fetched lightly (spot only, no futures), best-effort: any
// that fail to resolve are simply dropped.
const MOVERS_EXTRA = [
  { label: "Dow", symbol: "^DJI" },
  { label: "FTSE 100", symbol: "^FTSE" },
  { label: "DAX", symbol: "^GDAXI" },
  { label: "Nikkei", symbol: "^N225" },
  { label: "Euro Stoxx 50", symbol: "^STOXX50E" },
  { label: "Silver", symbol: "SI=F" },
  { label: "Copper", symbol: "HG=F" },
  { label: "Nat gas", symbol: "NG=F" },
  { label: "EUR/USD", symbol: "EURUSD=X" },
  { label: "GBP/USD", symbol: "GBPUSD=X" },
  { label: "USD/JPY", symbol: "JPY=X" },
  { label: "Ether", symbol: "ETH-USD" },
  { label: "VIX", symbol: "^VIX" },
];

// The Top Movers board is a cross-asset ETF universe — every asset class expressed
// as a liquid, US-listed ETF rather than a raw index/spot/yield, so the board reads
// as one comparable set of tradeable instruments. Broad equity + the 11 SPDR sector
// funds + semis, plus bond, commodity and crypto ETFs. Spot-only, best-effort (any
// that fail to resolve are dropped). Yahoo symbols.
const MOVERS_ETF = [
  // Broad equity
  { label: "S&P 500", symbol: "SPY", href: "https://finance.yahoo.com/quote/SPY" },
  { label: "Nasdaq 100", symbol: "QQQ", href: "https://finance.yahoo.com/quote/QQQ" },
  { label: "Small caps", symbol: "IWM", href: "https://finance.yahoo.com/quote/IWM" },
  // Equity sectors — SPDR Select Sector funds (+ semiconductors)
  { label: "Technology", symbol: "XLK", href: "https://finance.yahoo.com/quote/XLK" },
  { label: "Semis", symbol: "SMH", href: "https://finance.yahoo.com/quote/SMH" },
  { label: "Financials", symbol: "XLF", href: "https://finance.yahoo.com/quote/XLF" },
  { label: "Health Care", symbol: "XLV", href: "https://finance.yahoo.com/quote/XLV" },
  { label: "Energy", symbol: "XLE", href: "https://finance.yahoo.com/quote/XLE" },
  { label: "Industrials", symbol: "XLI", href: "https://finance.yahoo.com/quote/XLI" },
  { label: "Cons. Staples", symbol: "XLP", href: "https://finance.yahoo.com/quote/XLP" },
  { label: "Cons. Discr.", symbol: "XLY", href: "https://finance.yahoo.com/quote/XLY" },
  { label: "Utilities", symbol: "XLU", href: "https://finance.yahoo.com/quote/XLU" },
  { label: "Real Estate", symbol: "XLRE", href: "https://finance.yahoo.com/quote/XLRE" },
  // Bonds / rates
  { label: "Long Treasuries", symbol: "TLT", href: "https://finance.yahoo.com/quote/TLT" },
  { label: "High Yield", symbol: "HYG", href: "https://finance.yahoo.com/quote/HYG" },
  // Commodities
  { label: "Gold", symbol: "GLD", href: "https://finance.yahoo.com/quote/GLD" },
  { label: "Oil", symbol: "USO", href: "https://finance.yahoo.com/quote/USO" },
  // Crypto
  { label: "Bitcoin", symbol: "IBIT", href: "https://finance.yahoo.com/quote/IBIT" },
];

// Latest price/level + daily change + ~1-month daily-close history from Yahoo
// Finance's public chart API (no key). Symbols like "^GSPC" must be URL-encoded.
async function yahooQuote(symbol) {
  const nil = { value: null, change: null, changePct: null, asOf: null, history: [], marketState: null };
  const txt = await fetchText(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d`);
  if (!txt) return nil;
  let j; try { j = JSON.parse(txt); } catch { return nil; }
  const res = j && j.chart && j.chart.result && j.chart.result[0];
  if (!res) return nil;
  const meta = res.meta || {};
  const closes = ((((res.indicators || {}).quote || [])[0] || {}).close) || [];
  const hist = closes.filter((v) => Number.isFinite(v));
  const value = Number.isFinite(meta.regularMarketPrice) ? meta.regularMarketPrice : (hist.length ? hist[hist.length - 1] : null);
  // Daily change = live price vs the PRIOR TRADING DAY's close. Use meta.previousClose
  // (prior-session close) or the second-to-last daily close — NOT chartPreviousClose,
  // which for a 1-month range is the close a month ago (that gave a monthly % change).
  const prev = Number.isFinite(meta.previousClose) ? meta.previousClose
    : (hist.length >= 2 ? hist[hist.length - 2] : null);
  if (!Number.isFinite(value)) return nil;
  const changePct = (Number.isFinite(prev) && prev) ? +(((value - prev) / prev) * 100).toFixed(2) : null;
  const asOf = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString().slice(0, 10) : null;
  // LSE instruments quote in GBp (pence): rescale to the major unit (GBP) so the
  // tile shows a real price, not a pence figure. % change is a ratio — unchanged.
  const scale = meta.currency === "GBp" ? 0.01 : 1;
  const change = Number.isFinite(prev) ? +((value - prev) * scale).toFixed(4) : null;
  // Authoritative trading-session status from the exchange feed (REGULAR / PRE /
  // POST / PREPRE / POSTPOST / CLOSED). This inherently accounts for holidays and
  // half-days, so Glance uses it for the open/closed dot instead of guessing from
  // the clock. Falls back to null for the FRED/Stooq paths (no session field).
  return { value: +(value * scale), change, changePct, asOf, history: hist.slice(-22).map((v) => v * scale), marketState: meta.marketState || null };
}

// Fallback ETF/index source: Stooq's keyless daily CSV (oldest→newest). LSE
// tickers use a ".uk" suffix, indices "^spx"/"^ndq". Returns the same shape.
async function stooqQuote(sym) {
  const nil = { value: null, change: null, changePct: null, asOf: null, history: [] };
  const txt = await fetchText(`https://stooq.com/q/d/l/?s=${encodeURIComponent(sym)}&i=d`);
  if (!txt) return nil;
  const lines = txt.trim().split(/\r?\n/);
  if (lines.length < 2) return nil;
  const h = lines[0].split(",");
  const di = h.indexOf("Date"), ci = h.indexOf("Close");
  if (ci < 0) return nil;
  const pairs = lines.slice(1).map((l) => l.split(","))
    .filter((c) => c[ci] && c[ci] !== "" && Number.isFinite(parseFloat(c[ci])))
    .map((c) => [di >= 0 ? c[di] : "", c[ci]]);
  if (!pairs.length) return nil;
  const r = lastTwo(pairs);
  const prev = (r.value != null && r.change != null) ? r.value - r.change : null;
  return { value: r.value, change: r.change, changePct: (r.change != null && prev) ? +((r.change / prev) * 100).toFixed(2) : null, asOf: r.asOf, history: r.history };
}

async function handleMarkets(request, env, ctx) {
  const url = new URL(request.url);
  const cosd = new Date(Date.now() - 60 * 864e5).toISOString().slice(0, 10);
  // /api/markets?debug=1 — probe Yahoo reachability from the Worker (read-only).
  if (url.searchParams.get("debug")) {
    const probes = await Promise.all([
      ["yahoo1 ^GSPC", "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?range=5d&interval=1d"],
      ["yahoo2 ^GSPC", "https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC?range=5d&interval=1d"],
      ["yahoo1 BTC-USD", "https://query1.finance.yahoo.com/v8/finance/chart/BTC-USD?range=5d&interval=1d"],
      ["yahoo1 GC=F", "https://query1.finance.yahoo.com/v8/finance/chart/GC%3DF?range=5d&interval=1d"],
      ["yahoo1 IGWD.L", "https://query1.finance.yahoo.com/v8/finance/chart/IGWD.L?range=5d&interval=1d"],
      ["stooq igwd.uk", "https://stooq.com/q/d/l/?s=igwd.uk&i=d"],
    ].map(async ([label, u]) => {
      try {
        const r = await fetch(u, { headers: fetchHeaders(u) }); const b = await r.text();
        // Surface Yahoo's session status so the /api/markets dot source is verifiable.
        let marketState;
        try { marketState = JSON.parse(b).chart.result[0].meta.marketState; } catch { /* stooq / non-JSON */ }
        return { label, status: r.status, len: b.length, marketState, snippet: b.slice(0, 160) };
      } catch (e) { return { label, error: String((e && e.message) || e) }; }
    }));
    // Futures-implied-open diagnostic: for each equity index show the cash
    // session state and the future's move, plus whether the tile WOULD get a
    // futuresPct (fetched only when the cash market is not REGULAR).
    const FUT_PAIRS = [["S&P 500", "^GSPC", "ES=F"], ["NASDAQ", "^IXIC", "NQ=F"]];
    const futures = await Promise.all(FUT_PAIRS.map(async ([label, cashSym, futSym]) => {
      const cash = await yahooQuote(cashSym);
      const fut = await yahooQuote(futSym);
      return {
        label,
        cash: { symbol: cashSym, marketState: cash.marketState, value: cash.value, changePct: cash.changePct },
        future: { symbol: futSym, marketState: fut.marketState, value: fut.value, changePct: fut.changePct },
        futuresPctAttached: fut.changePct != null,   // now always fetched & attached
        note: "shown in the tile only while the cash market is closed (client-side, US/London hours)",
      };
    }));
    return new Response(JSON.stringify({ nowUTC: new Date().toISOString(), probes, futures }, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/markets?v=12", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const fromFred = async (id) => {
    const f = await fredSeries(id, cosd, env);
    const prev = (f.value != null && f.change != null) ? f.value - f.change : null;
    return { value: f.value, change: f.change, changePct: (f.change != null && prev) ? +((f.change / prev) * 100).toFixed(2) : null, asOf: f.asOf, history: f.history };
  };
  const data = await Promise.all(MARKET_SERIES.map(async (s) => {
    let r = await yahooQuote(s.symbol);            // live intraday (primary)
    if (r.value == null && s.fred) r = await fromFred(s.fred);   // daily-close fallback
    if (r.value == null && s.stooq) r = await stooqQuote(s.stooq);
    // Attach the near-24h index future's % move (vs its prior settle) so the
    // tile can show an implied open beside the now-stale daily change while the
    // cash market is closed. Yahoo's chart API does NOT return marketState for
    // these symbols, so we can't gate the fetch on the session here — we always
    // fetch and let the client show it only during closed hours (clock-based).
    let futuresPct = null;
    if (s.future) {
      const f = await yahooQuote(s.future);
      if (f.changePct != null) futuresPct = f.changePct;
    }
    return { label: s.label, value: r.value, change: r.change, changePct: r.changePct, asOf: r.asOf, history: r.history || [], marketState: r.marketState || null, futuresPct, href: s.href };
  }));
  // Wider mover pool for the Glance one-liner chips (spot only, best-effort).
  const moversExtra = (await Promise.all(MOVERS_EXTRA.map(async (s) => {
    const r = await yahooQuote(s.symbol);
    return r.value != null ? { label: s.label, value: r.value, changePct: r.changePct, marketState: r.marketState || null } : null;
  }))).filter(Boolean);
  // Cross-asset ETF universe for the Top Movers board (spot + daily % only).
  const moversEtf = (await Promise.all(MOVERS_ETF.map(async (s) => {
    const r = await yahooQuote(s.symbol);
    return r.value != null ? { label: s.label, value: r.value, changePct: r.changePct, marketState: r.marketState || null, href: s.href } : null;
  }))).filter(Boolean);
  // Reader's ETF book: reuse EMEE/IGWD from the tiles above, fetch the rest.
  // value = live GBP price/unit, change = GBP daily move/unit (for the £ total).
  const pfExtra = await Promise.all(PORTFOLIO_EXTRA.map(async (s) => {
    let r = await yahooQuote(s.symbol);
    if (r.value == null && s.stooq) r = await stooqQuote(s.stooq);
    return { label: s.label, value: r.value, change: r.change, changePct: r.changePct, marketState: r.marketState || null };
  }));
  const pfPick = (l) => { const d = data.find((x) => x.label === l); return d ? { label: l, value: d.value, change: d.change, changePct: d.changePct, marketState: d.marketState || null } : null; };
  const portfolio = [pfPick("EMEE"), pfPick("IGWD"), ...pfExtra].filter(Boolean);
  const resp = new Response(JSON.stringify({ markets: data, moversExtra, moversEtf, portfolio }), {
    // Short cache so the live prices stay near-real-time without hammering upstreams.
    headers: { "content-type": "application/json", "cache-control": "public, max-age=60" },
  });
  // Cache once the reliable (FRED) tiles resolve — don't let a flaky ETF source
  // force every request to re-hit the upstreams. The two ETFs may lag as "—".
  if (ctx && ctx.waitUntil && data.filter((d) => d.value != null).length >= 6) {
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  }
  return resp;
}

// ---- Prediction markets (Polymarket + Kalshi), finance & finance-adjacent -----
// Both expose public, no-auth market-data REST endpoints, fetched from the edge
// like every other upstream. Display-only: question + implied YES probability +
// venue + volume + close date. A keyword gate keeps it to finance-relevant events.
// Finance + finance-adjacent (market-moving politics / geopolitics) gate.
const PREDICT_RX = /\b(fed|fomc|interest[ -]?rate|rate (?:hike|cut|decision|change)|powell|cpi|inflation|deflation|recession|gdp|unemploy|jobless|payroll|nonfarm|s\s?&\s?p\s?500|sp500|nasdaq|dow jones|stock market|equit|bitcoin|btc|ethereum|eth|crypto|solana|xrp|dogecoin|stablecoin|treasur|bond yield|10[- ]year|debt ceiling|government shutdown|shutdown|oil price|opec|brent|crude|gold price|dollar index|dxy|tariff|trade war|\becb\b|bank of england|\bboe\b|earnings|nvidia|tesla|\bipo\b|trump|biden|harris|president|election|nominee|nomination|prime minister|\biran\b|israel|gaza|ukraine|russia|\bchina\b|taiwan|\bnato\b|ceasefire|nuclear|hormuz|strait|tanker)\b/i;
// Sports / esports / entertainment novelty markets sneak past the finance gate
// on an incidental keyword (e.g. a Valorant "VCT China" esports match matching
// "china"). Reject them outright — the pane stays finance / macro / politics.
const PREDICT_EXCLUDE_RX = /\b(valorant|counter[- ]?strike|cs:?go|cs2|\bdota\b|league of legends|\blol\b|overwatch|rocket league|apex legends|fortnite|call of duty|\bcod\b|esports?|e-sports|\bvct\b|\blck\b|\brlcs\b|\blpl\b|bo[35]\b|best of [357]\b|grand final|group (?:omega|alpha|sigma|stage)|\bnba\b|\bnfl\b|\bmlb\b|\bnhl\b|\bncaa\b|premier league|la liga|serie a|bundesliga|uefa|champions league|super bowl|world cup|olympic|\bufc\b|\bwwe\b|grand prix|formula 1|\bf1\b|wimbledon|oscars?|grammys?|emmys?|golden globe|box office|rotten tomatoes|billboard|eurovision|met gala|\bmovie\b|\bfilm\b)\b/i;
// Group each market into a type (used for section breaks + the rail filter).
function predictType(q) {
  const s = " " + String(q).toLowerCase() + " ";
  if (/\bfed\b|fomc|interest[ -]?rate|rate (?:hike|cut|decision|change)|powell|jerome/.test(s)) return "Fed & rates";
  if (/recession|\bgdp\b|inflation|\bcpi\b|unemploy|jobless|payroll|nonfarm|jobs report/.test(s)) return "Economy";
  if (/s\s?&\s?p|sp500|nasdaq|dow jones|stock market|equit|\bipo\b|nvidia|tesla|earnings/.test(s)) return "Equities";
  if (/bitcoin|\bbtc\b|ethereum|\beth\b|crypto|solana|\bxrp\b|dogecoin|stablecoin/.test(s)) return "Crypto";
  if (/\btrump\b/.test(s)) return "Trump";
  if (/\biran\b|israel|gaza|hezbollah|houthi|ukraine|russia|\bchina\b|taiwan|\bwar\b|\bnato\b|ceasefire|nuclear|hormuz|strait|tanker/.test(s)) return "Geopolitics";
  if (/election|president|nominee|nomination|prime minister|senate|congress|governor|mayor|\bpope\b|secretary general|referendum|parliament/.test(s)) return "Elections";
  return "Other";
}
async function predictPolymarket() {
  const out = [];
  // Three volume-sorted pages — finance/adjacent markets sit below the novelty
  // leaders, so a deeper sweep is needed to fill a 30–40 market pane.
  for (const offset of [0, 500, 1000]) {
    const txt = await fetchText(`https://gamma-api.polymarket.com/markets?active=true&closed=false&archived=false&order=volumeNum&ascending=false&limit=500&offset=${offset}`);
    let arr; try { arr = JSON.parse(txt); } catch { continue; }
    if (!Array.isArray(arr)) continue;
    for (const m of arr) {
      const q = m.question || m.title || "";
      if (!q || !PREDICT_RX.test(q) || PREDICT_EXCLUDE_RX.test(q)) continue;
      let prices = m.outcomePrices, outs = m.outcomes;
      try { if (typeof prices === "string") prices = JSON.parse(prices); } catch { /* */ }
      try { if (typeof outs === "string") outs = JSON.parse(outs); } catch { /* */ }
      if (!Array.isArray(prices) || !prices.length) continue;
      let idx = 0;
      if (Array.isArray(outs)) { const i = outs.findIndex((o) => /^yes$/i.test(String(o))); if (i >= 0) idx = i; }
      const p = parseFloat(prices[idx]);
      if (!isFinite(p)) continue;
      // Daily change in implied YES odds (percentage points). Polymarket's
      // oneDayPriceChange is a fraction on the primary (outcome-0) token; flip its
      // sign when YES is the second outcome so the delta tracks the YES odds shown.
      const dRaw = parseFloat(m.oneDayPriceChange);
      const chg = isFinite(dRaw) ? +((idx === 0 ? dRaw : -dRaw) * 100).toFixed(1) : null;
      // Grouped markets (e.g. Fed) 404 at /event/{market-slug} — use the parent
      // EVENT slug from the market's events[] when present.
      const evSlug = (Array.isArray(m.events) && m.events[0] && m.events[0].slug) || m.eventSlug || m.slug || null;
      out.push({ venue: "Polymarket", type: predictType(q), q, yes: Math.round(p * 100), chg, vol: Math.round(parseFloat(m.volumeNum ?? m.volume ?? m.volume24hr ?? 0) || 0), end: m.endDate || null, url: evSlug ? "https://polymarket.com/event/" + evSlug : "https://polymarket.com" });
    }
  }
  return out;
}
async function handlePredict(request, env, ctx) {
  const url = new URL(request.url);
  if (url.searchParams.get("debug")) {
    const pm = await predictPolymarket().catch((e) => ({ err: String(e) }));
    return new Response(JSON.stringify({ polymarket: { count: Array.isArray(pm) ? pm.length : pm, sample: Array.isArray(pm) ? pm.slice(0, 12) : null } }, null, 2),
      { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/predict?v=8", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const pm = await predictPolymarket().catch(() => []);
  // Dedupe by normalised question, keep the deepest listing.
  const seen = new Map();
  for (const m of pm) {
    const k = m.q.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 56);
    const ex = seen.get(k);
    if (!ex || m.vol > ex.vol) seen.set(k, m);
  }
  // Drop long-shots (< 7.5% implied YES) then take a per-type quota so high-volume
  // politics can't crowd finance (Fed/Economy/Equities/Crypto) out of the rail.
  const TYPE_ORDER = ["Fed & rates", "Economy", "Equities", "Crypto", "Trump", "Geopolitics", "Elections", "Other"];
  const byType = new Map();
  for (const m of seen.values()) {
    if (!(m.yes >= 7.5)) continue;
    const g = byType.get(m.type) || [];
    g.push(m);
    byType.set(m.type, g);
  }
  const markets = [];
  for (const t of TYPE_ORDER) {
    const g = byType.get(t);
    if (!g) continue;
    g.sort((a, b) => b.vol - a.vol);
    markets.push(...g.slice(0, 12));
  }
  const resp = new Response(JSON.stringify({ markets }), { headers: { "content-type": "application/json", "cache-control": "public, max-age=120" } });
  if (ctx && ctx.waitUntil && markets.length) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}

// Live government yield curves for the Macro dashboard: the US Treasury par curve
// (one CSV fetch) and the UK gilt curve (Tullett Prebon benchmarks via MarketWatch).
// Any maturity that can't be sourced comes back null and the client falls back to
// its compiled value, so the chart never breaks. Cached 30 min (yields are daily).
const YC_MATS = ["3M", "2Y", "5Y", "10Y", "30Y"];
const YC_US_COL = { "3M": "3 Mo", "2Y": "2 Yr", "5Y": "5 Yr", "10Y": "10 Yr", "30Y": "30 Yr" };
const YC_UK_TICKER = { "2Y": "tmbmkgb-02y", "5Y": "tmbmkgb-05y", "10Y": "tmbmkgb-10y", "30Y": "tmbmkgb-30y" };
async function handleYieldCurve(request, env, ctx) {
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/yield-curve?v=1", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const [usc, ...uk] = await Promise.all([
    treasuryCurve(YC_MATS.map((m) => YC_US_COL[m])),
    ...YC_MATS.map((m) => (YC_UK_TICKER[m] ? marketwatchBondYield(YC_UK_TICKER[m]) : Promise.resolve(null))),
  ]);
  const us = YC_MATS.map((m) => { const v = usc.values[YC_US_COL[m]]; return Number.isFinite(v) ? +(+v).toFixed(2) : null; });
  const ukArr = YC_MATS.map((m, i) => (Number.isFinite(uk[i]) ? +(+uk[i]).toFixed(2) : null));
  const body = {
    maturities: YC_MATS, us, uk: ukArr, asOf: usc.asOf,
    sources: [
      ["US Treasury — daily par yield curve", "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve"],
      ["UK gilt benchmarks (Tullett Prebon via MarketWatch)", "https://www.marketwatch.com/investing/bond/tmbmkgb-10y?countrycode=bx"],
    ],
  };
  const resp = new Response(JSON.stringify(body), { headers: { "content-type": "application/json", "cache-control": "public, max-age=1800" } });
  // Only cache once we actually have most of the US curve (don't pin a failed fetch).
  if (ctx && ctx.waitUntil && us.filter((v) => v != null).length >= 3) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}

// ============================ MACRO DASHBOARD ==============================
// Key economic indicators (US + UK) with ~5y monthly history, fetched server-
// side so there's no CORS issue or browser-visible key. Most series come from
// FRED (keyed); Services PMI comes from DBnomics (free JSON, re-hosts ISM); the
// UK 2y gilt comes from the Bank of England database. Every series carries an
// `href` to its public source so each figure is independently verifiable.
// ~6.5 years back: YoY series (tf "yoy") drop their first 12 months to the
// year-over-year calc, so the extra lead-in keeps them reaching back a full 5
// years (to 2021) after toYoY + slice(-60); level series just slice to 5 years.
const MACRO_START = () => new Date(Date.now() - 6.5 * 365 * 864e5).toISOString().slice(0, 10);

// FRED monthly observations → [YYYY-MM, value] ascending. `agg` averages a daily
// series (e.g. a yield) to a monthly figure.
async function fredMonthly(id, env, agg) {
  if (!env || !env.FRED_API_KEY) return [];
  const u = `https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${env.FRED_API_KEY}&file_type=json&observation_start=${MACRO_START()}&sort_order=asc&frequency=m${agg ? "&aggregation_method=avg" : ""}`;
  const txt = await fetchText(u);
  if (!txt) return [];
  try {
    return (JSON.parse(txt).observations || [])
      .filter((o) => o.value !== "." && o.value !== "")
      .map((o) => [o.date.slice(0, 7), parseFloat(o.value)])
      .filter((p) => Number.isFinite(p[1]));
  } catch { return []; }
}
// DBnomics series (path like "ISM/nm-pmi/pm") → [YYYY-MM, value] ascending.
async function dbnomicsMonthly(path) {
  const txt = await fetchText(`https://api.db.nomics.world/v22/series/${path}?observations=1`);
  if (!txt) return [];
  try {
    const docs = (((JSON.parse(txt) || {}).series) || {}).docs || [];
    if (!docs.length) return [];
    const periods = docs[0].period || [], values = docs[0].value || [];
    const out = [];
    for (let i = 0; i < periods.length; i++) {
      const v = values[i];
      if (v != null && v !== "NA" && Number.isFinite(+v)) out.push([String(periods[i]).slice(0, 7), +v]);
    }
    return out;
  } catch { return []; }
}
// Bank of England IADB CSV → monthly [YYYY-MM, value] (last obs per month).
// Tabular no-titles (CSVF=TN); dates are real (not future) so the endpoint
// returns data. Rows are "DD Mmm YYYY,<value>"; header/blank lines don't match
// the date regex and are skipped.
const BOE_MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const boeDate = (d) => `${String(d.getUTCDate()).padStart(2, "0")}/${BOE_MN[d.getUTCMonth()]}/${d.getUTCFullYear()}`;
async function boeMonthly(code) {
  const from = boeDate(new Date(Date.now() - 5.3 * 365 * 864e5));
  const to = boeDate(new Date());
  const u = `https://www.bankofengland.co.uk/boeapps/database/_iadb-FromShowColumns.asp?csv.x=yes&Datefrom=${from}&Dateto=${to}&SeriesCodes=${code}&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`;
  const txt = await fetchText(u);
  if (!txt) return [];
  const MM = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
  const byMonth = new Map();
  for (const line of txt.trim().split(/\r?\n/)) {
    const c = line.split(",");
    const m = (c[0] || "").replace(/^"|"$/g, "").trim().match(/(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})/);
    const v = parseFloat((c[c.length - 1] || "").trim());
    if (!m || !MM[m[2]] || !Number.isFinite(v)) continue;
    byMonth.set(`${m[3]}-${MM[m[2]]}`, v);
  }
  return [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}
// Monthly index series → year-on-year % change series.
function toYoY(pairs) {
  const out = [];
  for (let i = 12; i < pairs.length; i++) {
    const cur = pairs[i][1], prev = pairs[i - 12][1];
    if (Number.isFinite(cur) && Number.isFinite(prev) && prev !== 0) out.push([pairs[i][0], +(((cur / prev) - 1) * 100).toFixed(2)]);
  }
  return out;
}
// ONS time series → monthly [YYYY-MM, value]. The website's own timeseries page
// serves the data as JSON at `<page-url>/data` (the api.ons.gov.uk developer API
// is retired). `pageUrl` is the full www.ons.gov.uk timeseries URL; the `months`
// array carries the headline annual-rate/level directly.
const ONS_MM = { JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06", JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12" };
async function onsMonthly(pageUrl) {
  const txt = await fetchText(String(pageUrl).replace(/\/+$/, "") + "/data");
  if (!txt) return [];
  try {
    const months = (JSON.parse(txt).months) || [];
    return months.map((m) => {
      const g = String(m.date || "").toUpperCase().match(/(\d{4})\s+([A-Z]{3})/);
      const v = parseFloat(m.value);
      return (g && ONS_MM[g[2]] && Number.isFinite(v)) ? [`${g[1]}-${ONS_MM[g[2]]}`, v] : null;
    }).filter(Boolean);
  } catch { return []; }
}

const MACRO_SERIES = [
  // Order (per country): base rate · 2-year yield · core inflation · services PMI
  // · wage growth · unemployment.
  { country: "US", key: "base_rate", label: "Base rate", unit: "%", sub: "Fed funds effective rate", src: "fred", id: "FEDFUNDS", tf: "level", href: "https://fred.stlouisfed.org/series/FEDFUNDS", source: "FRED / Federal Reserve" },
  // Live current value from the official US Treasury daily yield-curve CSV (its
  // "2 Yr" column — the same feed the live US 10Y already uses), spliced onto the
  // FRED DGS2 monthly history. Yahoo/Stooq are secondary fallbacks.
  { country: "US", key: "two_year", label: "2-year yield", unit: "%", sub: "2Y Treasury", src: "fred", id: "DGS2", tf: "level", agg: true, live: [{ treasury: "2 Yr" }, { stooq: "2usy.b" }, { yahoo: "2YY=F" }], href: "https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve", source: "U.S. Treasury (daily) · FRED history" },
  { country: "US", key: "core_cpi", label: "Core inflation", unit: "%", sub: "Core CPI · YoY", src: "fred", id: "CPILFESL", tf: "yoy", href: "https://fred.stlouisfed.org/series/CPILFESL", source: "FRED / BLS" },
  // DBnomics' ISM mirror lags (~Aug 2025); recent months curated from ISM's own
  // monthly releases keep it current (merged onto the real history).
  { country: "US", key: "services_pmi", label: "Services PMI", unit: "", sub: "ISM Services PMI", src: "dbnomics", id: "ISM/nm-pmi/pm", curated: [["2025-09", 50.0], ["2025-10", 52.4], ["2026-02", 56.1], ["2026-03", 54.0], ["2026-04", 53.6], ["2026-05", 54.5], ["2026-06", 54.0]], tf: "level", href: "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/services/", source: "ISM" },
  { country: "US", key: "wages", label: "Wage growth", unit: "%", sub: "Avg hourly earnings · YoY", src: "fred", id: "CES0500000003", tf: "yoy", href: "https://fred.stlouisfed.org/series/CES0500000003", source: "FRED / BLS" },
  { country: "US", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "UNRATE", tf: "level", href: "https://fred.stlouisfed.org/series/UNRATE", source: "FRED / BLS" },
  // UK Bank Rate is a published MPC step function; curated here as the full,
  // verified monthly path (every change date confirmed against BoE MPC releases).
  // FRED's native BoE series is a historical archive ending 2017 and
  // bankofengland.co.uk blocks the Worker, so a live fetch isn't possible; the
  // tile links to the BoE Bank Rate page for verification.
  { country: "UK", key: "base_rate", label: "Base rate", unit: "%", sub: "BoE Bank Rate", src: "curated", curated: [["2021-07", 0.10], ["2021-08", 0.10], ["2021-09", 0.10], ["2021-10", 0.10], ["2021-11", 0.10], ["2021-12", 0.25], ["2022-01", 0.25], ["2022-02", 0.50], ["2022-03", 0.75], ["2022-04", 0.75], ["2022-05", 1.00], ["2022-06", 1.25], ["2022-07", 1.25], ["2022-08", 1.75], ["2022-09", 2.25], ["2022-10", 2.25], ["2022-11", 3.00], ["2022-12", 3.50], ["2023-01", 3.50], ["2023-02", 4.00], ["2023-03", 4.25], ["2023-04", 4.25], ["2023-05", 4.50], ["2023-06", 5.00], ["2023-07", 5.00], ["2023-08", 5.25], ["2023-09", 5.25], ["2023-10", 5.25], ["2023-11", 5.25], ["2023-12", 5.25], ["2024-01", 5.25], ["2024-02", 5.25], ["2024-03", 5.25], ["2024-04", 5.25], ["2024-05", 5.25], ["2024-06", 5.25], ["2024-07", 5.25], ["2024-08", 5.00], ["2024-09", 5.00], ["2024-10", 5.00], ["2024-11", 4.75], ["2024-12", 4.75], ["2025-01", 4.75], ["2025-02", 4.50], ["2025-03", 4.50], ["2025-04", 4.50], ["2025-05", 4.25], ["2025-06", 4.25], ["2025-07", 4.25], ["2025-08", 4.00], ["2025-09", 4.00], ["2025-10", 4.00], ["2025-11", 4.00], ["2025-12", 3.75], ["2026-01", 3.75], ["2026-02", 3.75], ["2026-03", 3.75], ["2026-04", 3.75], ["2026-05", 3.75], ["2026-06", 3.75], ["2026-07", 3.75]], tf: "level", href: "https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate", source: "Bank of England" },
  // BoE's IADB benchmarks are 5/10/20y (no 2y point) and bankofengland.co.uk
  // blocks the Worker, so the monthly history is curated from the BoE nominal
  // yield curve. The current value is refreshed live from Stooq's keyless
  // current value refreshed live from CNBC's keyless quote service (UK2Y-GB, the
  // UK 2Y gilt), spliced onto that history. (MarketWatch is bot-blocked and Stooq
  // has no data for the Worker, so CNBC is the reachable source.)
  { country: "UK", key: "two_year", label: "2-year yield", unit: "%", sub: "2Y gilt", src: "curated", live: [{ cnbc: "UK2Y-GB" }], curated: [["2021-07", 0.10], ["2021-08", 0.20], ["2021-09", 0.40], ["2021-10", 0.68], ["2021-11", 0.50], ["2021-12", 0.68], ["2022-01", 0.90], ["2022-02", 1.25], ["2022-03", 1.35], ["2022-04", 1.60], ["2022-05", 1.55], ["2022-06", 1.88], ["2022-07", 1.85], ["2022-08", 3.00], ["2022-09", 4.20], ["2022-10", 3.30], ["2022-11", 3.30], ["2022-12", 3.60], ["2023-01", 3.50], ["2023-02", 3.90], ["2023-03", 3.40], ["2023-04", 3.80], ["2023-05", 4.30], ["2023-06", 5.30], ["2023-07", 5.00], ["2023-08", 5.10], ["2023-09", 4.90], ["2023-10", 4.75], ["2023-11", 4.60], ["2023-12", 4.00], ["2024-01", 4.20], ["2024-02", 4.35], ["2024-03", 4.20], ["2024-04", 4.50], ["2024-05", 4.40], ["2024-06", 4.20], ["2024-07", 3.80], ["2024-08", 3.90], ["2024-09", 3.90], ["2024-10", 4.30], ["2024-11", 4.40], ["2024-12", 4.40], ["2025-01", 4.50], ["2025-02", 4.20], ["2025-03", 4.30], ["2025-04", 3.90], ["2025-05", 4.00], ["2025-06", 3.85], ["2025-07", 3.85], ["2025-08", 3.90], ["2025-09", 4.00], ["2025-10", 3.95], ["2025-11", 4.20], ["2025-12", 4.25], ["2026-01", 4.35], ["2026-02", 4.40], ["2026-03", 4.55], ["2026-04", 4.40], ["2026-05", 4.35], ["2026-06", 4.38], ["2026-07", 4.41]], tf: "level", href: "https://www.cnbc.com/quotes/UK2Y-GB", source: "CNBC (live) · BoE curve history" },
  // UK macro: official-source-first — the ONS time-series API returns the
  // headline annual-rate/level directly (CDID/DATASET).
  { country: "UK", key: "core_cpi", label: "Core inflation", unit: "%", sub: "Core CPI · YoY", src: "ons", id: "DKO8/MM23", tf: "level", href: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/dko8/mm23", source: "ONS" },
  // S&P Global/CIPS is proprietary (no free API); curated from its releases.
  { country: "UK", key: "services_pmi", label: "Services PMI", unit: "", sub: "S&P Global/CIPS Services PMI", src: "curated", curated: [["2021-07", 59.6], ["2021-08", 55.0], ["2021-09", 55.4], ["2021-10", 59.1], ["2021-11", 58.5], ["2021-12", 53.6], ["2022-01", 54.1], ["2022-02", 60.5], ["2022-03", 62.6], ["2022-04", 58.9], ["2022-05", 53.4], ["2022-06", 54.3], ["2022-07", 52.6], ["2022-08", 50.9], ["2022-09", 50.0], ["2022-10", 48.8], ["2022-11", 48.8], ["2022-12", 49.9], ["2023-01", 48.7], ["2023-02", 53.5], ["2023-03", 52.9], ["2023-04", 55.9], ["2023-05", 55.2], ["2023-06", 53.7], ["2023-07", 51.5], ["2023-08", 49.5], ["2023-09", 49.3], ["2023-10", 49.5], ["2023-11", 50.9], ["2023-12", 53.4], ["2024-01", 54.3], ["2024-02", 53.8], ["2024-03", 53.1], ["2024-04", 55.0], ["2024-05", 52.9], ["2024-06", 52.1], ["2024-07", 52.5], ["2024-08", 53.7], ["2024-09", 52.4], ["2024-10", 52.0], ["2024-11", 50.8], ["2024-12", 51.1], ["2025-01", 50.8], ["2025-02", 51.0], ["2025-03", 52.5], ["2025-04", 49.0], ["2025-05", 50.9], ["2025-06", 52.8], ["2025-07", 51.8], ["2025-08", 54.2], ["2025-09", 50.8], ["2025-10", 52.3], ["2025-11", 50.5], ["2025-12", 51.0], ["2026-01", 54.0], ["2026-02", 52.5], ["2026-03", 50.5], ["2026-04", 52.7], ["2026-05", 49.3], ["2026-06", 48.8]], tf: "level", href: "https://www.pmi.spglobal.com/Public/Home/PressRelease", source: "S&P Global/CIPS" },
  { country: "UK", key: "wages", label: "Wage growth", unit: "%", sub: "Regular pay (AWE) · YoY", src: "ons", id: "KAI9/LMS", tf: "level", href: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/timeseries/kai9/lms", source: "ONS" },
  { country: "UK", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "ons", id: "MGSX/LMS", tf: "level", href: "https://www.ons.gov.uk/employmentandlabourmarket/peoplenotinwork/unemployment/timeseries/mgsx/lms", source: "ONS" },

  // ---- G7 (ex US/UK) + Euro Area + Ireland ----------------------------------
  // Same six-indicator frame as US/UK, sourced from FRED's international mirrors:
  //   · policy rate — ECB deposit facility (shared by the euro members) · BoC · BoJ
  //   · core/headline inflation — Eurostat HICP YoY · OECD CPI YoY
  //   · unemployment — OECD harmonised rate
  // 2-year yields, services PMI and wage growth aren't freely available for most
  // of these, so those tiles are simply omitted — the client renders "–". Any id
  // that no longer resolves also degrades to "–"; the /api/macro?debug probe
  // reports point counts so dead codes can be swapped.
  // Euro Area (aggregate).
  { country: "EA", key: "base_rate", label: "Base rate", unit: "%", sub: "ECB deposit facility rate", src: "fred", id: "ECBDFR", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/ECBDFR", source: "FRED / ECB" },
  { country: "EA", key: "core_cpi", label: "Core inflation", unit: "%", sub: "HICP · YoY", src: "fred", id: "CP0000EZ19M086NEST", tf: "yoy", href: "https://fred.stlouisfed.org/series/CP0000EZ19M086NEST", source: "FRED / Eurostat" },
  // Candidate fills (verified via /api/macro?debug): 2Y via the ECB euro-area
  // AAA spot-rate curve; unemployment via Eurostat's live monthly series (the
  // FRED mirror is frozen). Dead codes degrade to "–".
  { country: "EA", key: "two_year", label: "2-year yield", unit: "%", sub: "Euro-area AAA 2Y", src: "dbnomics", id: "ECB/YC/B.U2.EUR.4F.G_N_A.SV_C_YM.SR_2Y", tf: "level", href: "https://data.ecb.europa.eu/", source: "ECB yield curve" },
  { country: "EA", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "dbnomics", id: "Eurostat/une_rt_m/M.SA.TOTAL.PC_ACT.T.EA20", tf: "level", href: "https://ec.europa.eu/eurostat/databrowser/view/une_rt_m", source: "Eurostat" },
  // (The euro-area AGGREGATE harmonised-unemployment mirror is discontinued on
  // FRED — both NSA and SA freeze at Jan 2023 — so EA unemployment renders "–";
  // the member states DE/FR/IT/IE each carry their own live rate below.)
  // Germany.
  { country: "DE", key: "base_rate", label: "Base rate", unit: "%", sub: "ECB deposit facility rate", src: "fred", id: "ECBDFR", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/ECBDFR", source: "FRED / ECB" },
  { country: "DE", key: "core_cpi", label: "Core inflation", unit: "%", sub: "HICP · YoY", src: "fred", id: "CP0000DEM086NEST", tf: "yoy", href: "https://fred.stlouisfed.org/series/CP0000DEM086NEST", source: "FRED / Eurostat" },
  { country: "DE", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTDEM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTDEM156N", source: "FRED / OECD" },
  // France.
  { country: "FR", key: "base_rate", label: "Base rate", unit: "%", sub: "ECB deposit facility rate", src: "fred", id: "ECBDFR", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/ECBDFR", source: "FRED / ECB" },
  { country: "FR", key: "core_cpi", label: "Core inflation", unit: "%", sub: "HICP · YoY", src: "fred", id: "CP0000FRM086NEST", tf: "yoy", href: "https://fred.stlouisfed.org/series/CP0000FRM086NEST", source: "FRED / Eurostat" },
  { country: "FR", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTFRM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTFRM156N", source: "FRED / OECD" },
  // Italy.
  { country: "IT", key: "base_rate", label: "Base rate", unit: "%", sub: "ECB deposit facility rate", src: "fred", id: "ECBDFR", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/ECBDFR", source: "FRED / ECB" },
  { country: "IT", key: "core_cpi", label: "Core inflation", unit: "%", sub: "HICP · YoY", src: "fred", id: "CP0000ITM086NEST", tf: "yoy", href: "https://fred.stlouisfed.org/series/CP0000ITM086NEST", source: "FRED / Eurostat" },
  { country: "IT", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTITM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTITM156N", source: "FRED / OECD" },
  // Ireland.
  { country: "IE", key: "base_rate", label: "Base rate", unit: "%", sub: "ECB deposit facility rate", src: "fred", id: "ECBDFR", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/ECBDFR", source: "FRED / ECB" },
  { country: "IE", key: "core_cpi", label: "Core inflation", unit: "%", sub: "HICP · YoY", src: "fred", id: "CP0000IEM086NEST", tf: "yoy", href: "https://fred.stlouisfed.org/series/CP0000IEM086NEST", source: "FRED / Eurostat" },
  { country: "IE", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTIEM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTIEM156N", source: "FRED / OECD" },
  // Canada, Japan & China — the OECD MEI policy-rate/CPI mirrors and the BIS
  // policy-rate dataset don't resolve here, but the OECD 3-month interbank rate
  // (IR3TIB01) is still live and current for all three (verified via debug), so
  // it stands in for the base-rate column. Core CPI has no free, current monthly
  // source for these (the OECD mirrors are frozen ≥1yr), so it renders "–".
  { country: "CA", key: "base_rate", label: "Base rate", unit: "%", sub: "3-month interbank rate", src: "fred", id: "IR3TIB01CAM156N", tf: "level", href: "https://fred.stlouisfed.org/series/IR3TIB01CAM156N", source: "FRED / OECD" },
  { country: "CA", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTCAM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTCAM156N", source: "FRED / OECD" },
  { country: "JP", key: "base_rate", label: "Base rate", unit: "%", sub: "3-month interbank rate", src: "fred", id: "IR3TIB01JPM156N", tf: "level", href: "https://fred.stlouisfed.org/series/IR3TIB01JPM156N", source: "FRED / OECD" },
  { country: "JP", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "LRHUTTTTJPM156N", tf: "level", href: "https://fred.stlouisfed.org/series/LRHUTTTTJPM156N", source: "FRED / OECD" },
  { country: "CN", key: "base_rate", label: "Base rate", unit: "%", sub: "3-month interbank rate", src: "fred", id: "IR3TIB01CNM156N", tf: "level", href: "https://fred.stlouisfed.org/series/IR3TIB01CNM156N", source: "FRED / OECD" },
];

async function macroSeriesPairs(s, env) {
  let raw = s.src === "fred" ? await fredMonthly(s.id, env, s.agg)
    : s.src === "dbnomics" ? await dbnomicsMonthly(s.id)
    : s.src === "boe" ? await boeMonthly(s.id)
    : s.src === "ons" ? await onsMonthly(s.href)
    : s.src === "curated" ? (s.curated || []) : [];
  // A `curated` list on a LIVE source extends it: source-verified recent months
  // override/append to a mirror that lags (e.g. DBnomics' ISM stops ~Aug 2025).
  if (s.curated && s.src !== "curated") {
    const map = new Map(raw);
    for (const [d, v] of s.curated) map.set(d, v);
    raw = [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }
  const t = s.tf === "yoy" ? toYoY(raw) : raw;
  const out = t.slice(-60); // last 5 years of monthly points
  // A `live` source (yields only) splices a fresh daily reading onto the current
  // month, so the tile shows today's yield rather than the last monthly close.
  // Yahoo's 2Y yield future (US) and Stooq's keyless bond-yield CSV (UK) both
  // quote the yield directly; an unavailable/implausible reading is ignored, so
  // the monthly FRED/curated history remains the fallback.
  if (s.live && out.length) {
    const lv = await liveYieldValue(s.live);
    if (lv != null) {
      const ym = new Date().toISOString().slice(0, 7);
      if (out[out.length - 1][0] === ym) out[out.length - 1] = [ym, lv];
      else out.push([ym, lv]);
    }
  }
  return out;
}

// Raw reading from one live candidate (no clamp) — the yield as the feed quotes
// it. Used both by the accept path and the ?debug diagnostic. `treasury` reads a
// column of the official US Treasury daily yield-curve CSV (the same source the
// live US 10Y on the rates band already uses, so it's known-reachable).
async function liveYieldRaw(c) {
  try {
    if (c.treasury) return (await treasurySeries(c.treasury)).value;
    if (c.cnbc) return await cnbcYield(c.cnbc);
    if (c.marketwatch) return await marketwatchBondYield(c.marketwatch);
    if (c.yahoo) return (await yahooQuote(c.yahoo)).value;
    if (c.stooq) return (await stooqQuote(c.stooq)).value;
  } catch { /* fall through */ }
  return null;
}
// Fetch a live daily yield for a macro tile. `live` is an ordered list of
// candidate sources (Yahoo yield future / Stooq keyless bond-yield CSV); the
// first that returns a plausible reading wins. Both feeds quote the yield
// directly (~0–20%), so a value outside that band is treated as a bad parse and
// skipped, leaving the monthly FRED/curated history as the fallback.
async function liveYieldValue(live) {
  for (const c of (Array.isArray(live) ? live : [live])) {
    let v = await liveYieldRaw(c);
    if (v == null) continue;
    v = +Number(v).toFixed(2);
    if (v > 0 && v < 20) return v;
  }
  return null;
}

async function handleMacro(request, env, ctx) {
  const url = new URL(request.url);
  // ?debug — probe each series and report point counts so codes can be finalised.
  if (url.searchParams.get("debug")) {
    const probes = await Promise.all(MACRO_SERIES.map(async (s) => {
      try {
        const p = await macroSeriesPairs(s, env);
        const out = { key: s.country + ":" + s.key, src: s.src, id: s.id, points: p.length, last: p[p.length - 1] || null };
        // For live-spliced series, report each candidate's raw reading + the one
        // that was accepted, so the correct symbol can be confirmed in prod.
        if (s.live) {
          const cands = Array.isArray(s.live) ? s.live : [s.live];
          out.live = { candidates: await Promise.all(cands.map(async (c) => ({ sym: c.treasury || c.cnbc || c.marketwatch || c.yahoo || c.stooq, via: c.treasury ? "treasury" : c.cnbc ? "cnbc" : c.marketwatch ? "marketwatch" : c.yahoo ? "yahoo" : "stooq", raw: await liveYieldRaw(c) }))), accepted: await liveYieldValue(s.live) };
        }
        return out;
      } catch (e) { return { key: s.country + ":" + s.key, src: s.src, id: s.id, error: String((e && e.message) || e) }; }
    }));
    return new Response(JSON.stringify({ probes }, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/macro?v=87", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const series = await Promise.all(MACRO_SERIES.map(async (s) => {
    let pairs = [];
    try { pairs = await macroSeriesPairs(s, env); } catch { pairs = []; }
    const last = pairs[pairs.length - 1], prev = pairs[pairs.length - 2];
    return {
      country: s.country, key: s.key, label: s.label, unit: s.unit, sub: s.sub,
      source: s.source, href: s.href,
      value: last ? last[1] : null,
      change: (last && prev) ? +(last[1] - prev[1]).toFixed(2) : null,
      asOf: last ? last[0] : null,
      history: pairs.map(([d, v]) => ({ label: d, value: v })),
    };
  }));
  const resp = new Response(JSON.stringify({ series }), { headers: { "content-type": "application/json", "cache-control": "public, max-age=600" } });
  // Cache 6h once a solid majority of series resolved (so a transient miss on one
  // source doesn't cache a mostly-empty payload).
  if (ctx && ctx.waitUntil && series.filter((x) => x.value != null).length >= 7) {
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  }
  return resp;
}

// ============================ MARKET PULSE =================================
// Two short "direction + driver" one-liners for the Glance hero — a light
// synthesis of the LIVE markets + rates feeds and the latest market headlines,
// written by Workers AI. Generation is lazy and shared by all users: /api/pulse
// returns the stored text immediately and, if it's gone stale (and it's a
// weekday within active hours), kicks off a throttled background regeneration —
// so it only runs while someone is actually viewing the page, and only when
// something material has changed. No Claude, no cron; degrades to the client's
// deterministic lines if Workers AI is unavailable.
const PULSE_KEY = "mpulse";                 // single global KV record (WATCHLIST ns)
const PULSE_THROTTLE_MS = 15 * 60 * 1000;   // regenerate at most every 15 min
// Candidate Workers AI models, newest first. Models get deprecated over time, so
// we try each until one responds — the fallback survives any single retirement.
const PULSE_MODELS = [
  "@cf/meta/llama-3.3-70b-instruct-fp8-fast",     // strong prose + instruction-following
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/meta/llama-4-scout-17b-16e-instruct",      // known-good on this account
  "@cf/google/gemma-3-12b-it",
  "@cf/qwen/qwen2.5-14b-instruct",
  "@cf/meta/llama-3.2-3b-instruct",
];
// Run the first model that answers; `trace` (optional) collects per-model outcomes
// for the debug endpoint.
async function runPulseModel(env, messages, trace) {
  for (const model of PULSE_MODELS) {
    try {
      const res = await env.AI.run(model, { max_tokens: 220, temperature: 0.2, messages });
      // Most models return { response: "<string>" }; some (e.g. Llama 4) return
      // the response already parsed as an object — stringify it so the JSON is
      // preserved for parsePulse rather than collapsing to "[object Object]".
      let raw = res == null ? "" : (res.response != null ? res.response : (res.result != null ? res.result : (res.output_text != null ? res.output_text : res)));
      const text = typeof raw === "string" ? raw : (raw && typeof raw === "object" ? JSON.stringify(raw) : String(raw ?? ""));
      if (trace) trace.push({ model, ok: true, len: text.length, type: typeof raw });
      if (text && text.trim() && text !== "[object Object]") return { text, model };
    } catch (e) {
      if (trace) trace.push({ model, err: String((e && e.message) || e).slice(0, 120) });
    }
  }
  return { text: "", model: null };
}

// Strip CDATA / tags / HTML entities from an RSS or JSON title.
function cleanHeadline(s) {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;|&rsquo;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ").trim();
}
// Fetch and decode as UTF-8 regardless of the (often mislabelled) feed charset —
// the default text() used Latin-1, which is what produced the "â€™" mojibake.
async function fetchUtf8(url) {
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, { headers: fetchHeaders(url), cf: { cacheTtl: 900 } });
      if (r.ok) return new TextDecoder("utf-8").decode(await r.arrayBuffer());
    } catch { /* retry */ }
  }
  return "";
}
// Terms that mark a headline as genuinely market-moving, so those rank ahead of
// the lifestyle/promo items the broad feeds mix in.
const MKT_RE = /\b(stock|market|s&p|nasdaq|dow|treasur|yield|bond|spread|fed|rate|inflation|cpi|ppi|jobs|payroll|unemploy|oil|crude|opec|gold|dollar|tariff|trade|geopolit|war|sanction|earnings|gdp|recession|ecb|boe|central bank|equit|selloff|sell-off|rally|risk|hormuz|iran|ukraine|china)\b/i;
// Latest market-MOVING headlines from markets-news RSS (CNBC Markets + MarketWatch
// market feeds), UTF-8-decoded, de-duplicated, with clearly market-relevant items
// ranked first. Falls back to Yahoo's keyless news search only if every feed is
// unreachable. All keyless and edge-cached (~15 min).
async function fetchHeadlines() {
  const feeds = [
    "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=20910258",  // CNBC Markets
    "https://feeds.content.dowjones.io/public/rss/mw_marketpulse",                           // MarketWatch MarketPulse
    "https://feeds.content.dowjones.io/public/rss/mw_realtimeheadlines",                     // MarketWatch Real-time
    "https://feeds.content.dowjones.io/public/rss/mw_topstories",                            // MarketWatch Top Stories
  ];
  const out = [];
  await Promise.all(feeds.map(async (u) => {
    try {
      const txt = await fetchUtf8(u);
      if (!txt) return;
      for (const it of txt.split(/<item[\s>]/i).slice(1, 13)) {
        const tm = it.match(/<title>([\s\S]*?)<\/title>/i);
        if (!tm) continue;
        const title = cleanHeadline(tm[1]);
        const pm = it.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
        const t = pm ? (Date.parse(pm[1].trim()) || 0) : 0;
        if (title && title.length > 12) out.push({ title, t });
      }
    } catch { /* skip feed */ }
  }));
  if (!out.length) { // fallback — Yahoo news search
    for (const q of ["stock market", "oil"]) {
      try {
        const txt = await fetchUtf8(`https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&newsCount=6&quotesCount=0`);
        if (!txt) continue;
        (JSON.parse(txt).news || []).forEach((n) => { if (n && n.title) out.push({ title: cleanHeadline(n.title), t: (n.providerPublishTime || 0) * 1000 }); });
      } catch { /* skip */ }
    }
  }
  const seen = new Set(), uniq = [];
  out.sort((a, b) => b.t - a.t).forEach((n) => { const k = n.title.toLowerCase(); if (!seen.has(k)) { seen.add(k); uniq.push(n); } });
  // Pass ONLY clearly market-relevant items (newest first) so the model isn't
  // tempted to build a "driver" out of a lifestyle/promo headline. If none
  // qualify, return nothing → the wrap states direction with no driver.
  return uniq.filter((n) => MKT_RE.test(n.title)).slice(0, 8);
}
// A coarse fingerprint of the inputs — day moves to 0.1% and rate changes to 1bp,
// plus the two freshest headlines — so we only spend a model call when something
// actually moved or the news changed.
// Bump PULSE_VERSION whenever the prompt/model/headline logic changes so stored
// text is treated as stale and regenerated (rather than matched by signature).
const PULSE_VERSION = "v5";
function pulseSig(markets, rates, headlines) {
  const m = markets.map((x) => `${x.label}:${x.changePct == null ? "-" : Math.round(x.changePct * 10) / 10}:${x.futuresPct == null ? "-" : Math.round(x.futuresPct * 10) / 10}`).join(",");
  const r = rates.map((x) => `${x.label}:${x.change == null ? "-" : Math.round(x.change * 100)}`).join(",");
  const h = (headlines[0]?.title || "") + "|" + (headlines[1]?.title || "");
  return `${PULSE_VERSION}||${m}||${r}||${h}`;
}
function parsePulse(text) {
  if (!text) return null;
  const s = String(text);
  const clean = (x) => x.replace(/["*`]/g, "").replace(/\s+/g, " ").trim().slice(0, 220);
  // 1) A JSON object anywhere in the reply.
  const m = s.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]);
      if (o && typeof o.markets === "string" && typeof o.rates === "string" && o.markets.trim() && o.rates.trim()) {
        return { markets: clean(o.markets), rates: clean(o.rates) };
      }
    } catch { /* fall through to line parsing */ }
  }
  // 2) Labelled lines — "Markets: …" / "Rates & spreads: …" (small models often
  // ignore the JSON instruction and just write the two lines).
  const mk = s.match(/market[s]?\s*[:\-–]\s*(.+)/i);
  const rt = s.match(/rate[s]?(?:\s*(?:&|and)\s*spread[s]?)?\s*[:\-–]\s*(.+)/i);
  if (mk && rt) {
    const mm = clean(mk[1].split(/\n/)[0]), rr = clean(rt[1].split(/\n/)[0]);
    if (mm && rr) return { markets: mm, rates: rr };
  }
  return null;
}
// /api/pulse?debug=1 — run the generation steps inline and report what happens
// (whether Workers AI is bound, the data/headline counts, the raw model text and
// whether it parsed) so a null pulse can be diagnosed without Worker logs.
async function debugPulse(request, env, ctx) {
  const info = { hasAI: !!(env && env.AI), models: PULSE_MODELS };
  const base = new URL(request.url);
  let markets = [], rates = [];
  try { markets = (await (await handleMarkets(new Request(new URL("/api/markets?v=9", base).toString()), env, ctx)).json()).markets || []; } catch (e) { info.marketsErr = String((e && e.message) || e); }
  try { rates = (await (await handleRates(new Request(new URL("/api/rates?v=10", base).toString()), env, ctx)).json()).rates || []; } catch (e) { info.ratesErr = String((e && e.message) || e); }
  info.marketsCount = markets.length; info.ratesCount = rates.length;
  let headlines = [];
  try { headlines = await fetchHeadlines(); } catch (e) { info.headErr = String((e && e.message) || e); }
  info.headlinesCount = headlines.length; info.headlineSample = headlines.slice(0, 6).map((h) => h.title);
  if (env && env.AI) {
    const trace = [];
    // Use the REAL production prompt so this reflects what the page will show.
    const { text, model } = await runPulseModel(env, pulseMessages(markets, rates, headlines), trace);
    info.modelTried = trace;
    info.modelUsed = model;
    info.aiRaw = text;
    info.parsed = parsePulse(text);
  }
  return new Response(JSON.stringify(info, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
// Build the chat messages for the pulse — the actual production prompt, shared by
// generatePulse and the debug endpoint so ?debug=1 reflects the real output.
function pulseMessages(markets, rates, headlines) {
  const mktStr = markets.map((x) => `${x.label} ${x.value}${x.changePct != null ? ` (${x.changePct > 0 ? "+" : ""}${x.changePct}% day)` : ""}${x.futuresPct != null ? ` [fut ${x.futuresPct > 0 ? "+" : ""}${x.futuresPct}%]` : ""}`).join("; ");
  const rateStr = rates.map((x) => `${x.label} ${x.unit === "bp" ? Math.round(x.value * 100) + "bp" : x.value + "%"}${x.change != null ? ` (${x.change > 0 ? "+" : ""}${x.unit === "bp" ? Math.round(x.change * 100) + "bp" : x.change})` : ""}`).join("; ");
  const headStr = headlines.map((h, i) => `${i + 1}. ${h.title}`).join("\n") || "(none)";
  const sys = [
    "You are a senior markets strategist writing a two-sentence market wrap for a dashboard.",
    "Write flowing, analytical prose — NOT a list. Never list instruments one by one (do NOT write 'S&P up; Nasdaq up; oil down').",
    "THE WHOLE POINT is the DRIVER — the 'why'. Each line MUST pair the move with the single most relevant driver drawn from the provided headlines, woven in with 'as/after/amid/on/with …' (e.g. 'as Middle-East supply fears lift crude', 'after soft jobs data', 'amid tariff relief', 'as bond investors eye Fed policy').",
    "Line 1 (markets): ONE synthesised view of equities plus a note on oil/gold, tied to the most fitting market headline.",
    "Line 2 (rates): Treasury yields and credit spreads together, tied to the most fitting macro/rates/geopolitics headline.",
    "Pick the driver from the headlines that best fits each move; you may connect a headline to a plausibly-related move. Only drop the driver if NONE of the headlines are market-relevant at all.",
    "Never fabricate: every driver must trace to a provided headline; invent no events, numbers or facts not in the inputs.",
    "No hype, no advice, no numbers unless essential; each line ONE sentence of 26 words or fewer.",
  ].join(" ");
  const example = '{"markets":"US equities firmer and London higher as easing Middle-East tensions steady risk appetite, while crude slips and gold edges up.","rates":"Treasury yields drift lower and credit spreads hold steady as bond investors weigh the Fed policy outlook."}';
  const user = `DATA — markets: ${mktStr}\nDATA — rates/spreads: ${rateStr}\nRECENT HEADLINES (use these for the drivers):\n${headStr}\n\nWrite the two lines for THIS data, each naming a driver from the headlines. Return ONLY JSON in exactly this shape (no prose, no lists):\n${example}`;
  return [{ role: "system", content: sys }, { role: "user", content: user }];
}
async function generatePulse(request, env, ctx) {
  if (!env || !env.AI) return; // Workers AI not bound → leave pulse empty (client falls back)
  const base = new URL(request.url);
  let markets = [], rates = [];
  try { markets = (await (await handleMarkets(new Request(new URL("/api/markets?v=9", base).toString()), env, ctx)).json()).markets || []; } catch { /* ignore */ }
  try { rates = (await (await handleRates(new Request(new URL("/api/rates?v=10", base).toString()), env, ctx)).json()).rates || []; } catch { /* ignore */ }
  if (!markets.length && !rates.length) return;
  const headlines = await fetchHeadlines();
  const sig = pulseSig(markets, rates, headlines);
  let prev = null;
  try { const raw = await env.WATCHLIST.get(PULSE_KEY); prev = raw ? JSON.parse(raw) : null; } catch { /* ignore */ }
  if (prev && prev.sig === sig) { // nothing material changed — refresh the clock, skip the model
    prev.ts = Date.now();
    await env.WATCHLIST.put(PULSE_KEY, JSON.stringify(prev));
    return;
  }
  const { text } = await runPulseModel(env, pulseMessages(markets, rates, headlines));
  const parsed = parsePulse(text);
  if (!parsed) {
    // Keep the last good text but stamp the clock so we don't retry every poll.
    const rec = prev || { markets: null, rates: null, sig: null };
    rec.ts = Date.now();
    await env.WATCHLIST.put(PULSE_KEY, JSON.stringify(rec));
    return;
  }
  await env.WATCHLIST.put(PULSE_KEY, JSON.stringify({ markets: parsed.markets, rates: parsed.rates, ts: Date.now(), sig }));
}
async function handlePulse(request, env, ctx) {
  try {
    const url = new URL(request.url);
    if (url.searchParams.get("debug")) return await debugPulse(request, env, ctx);
    // ?force=1 — regenerate now (bypasses the throttle + hours gate) and return
    // the fresh text, so a new prompt/model can be verified on demand.
    if (url.searchParams.get("force")) { await generatePulse(request, env, ctx).catch(() => {}); }
    let cur = null;
    try { const raw = await env.WATCHLIST.get(PULSE_KEY); cur = raw ? JSON.parse(raw) : null; } catch { /* ignore */ }
    // Regenerate in the background when stale — weekdays, 06:00–23:00 UTC only.
    const d = new Date(), day = d.getUTCDay(), hr = d.getUTCHours();
    const active = day >= 1 && day <= 5 && hr >= 6 && hr < 23;
    if (active && (!cur || Date.now() - (cur.ts || 0) > PULSE_THROTTLE_MS) && ctx && ctx.waitUntil) {
      ctx.waitUntil(generatePulse(request, env, ctx).catch(() => {}));
    }
    return new Response(JSON.stringify({ markets: (cur && cur.markets) || null, rates: (cur && cur.rates) || null, ts: (cur && cur.ts) || null }), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  } catch (e) {
    // Never let the pulse take down the route — the client falls back to its
    // deterministic lines on any non-200.
    return new Response(JSON.stringify({ markets: null, rates: null, ts: null, error: String((e && e.message) || e) }), {
      status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
}

// ============================ LIVE NEWS FEED ===============================
// Curated finance / macro RSS+Atom feeds (US & UK focus), fetched and parsed at
// the edge, normalised to the Glance feed-item shape { title, url, source, date,
// time } and merged into the home "Latest news" list by the client. Same pattern
// as the markets/rates handlers: fan out with Promise.allSettled, skip anything
// that fails, edge-cache the combined result ~5 min, only cache once non-empty.
// Lead with the financial specialists (WSJ, FT, The Economist, CNBC, MarketWatch)
// and the central banks; keep a few FX/global desks but cap them low. Every feed
// except the pure-policy central-bank ones (filter:false) is run through the STRICT
// macro filter below, so only key-indicator / central-bank / index-move / major-
// earnings stories get through. `cap` bounds each source so no single desk floods.
// Bloomberg & Reuters have no usable public RSS, so they're bridged through Google
// News search feeds (gnews:true) — reliable and not IP-blocked; the trade-off is
// that their links route via a news.google.com redirect to the real article.
const FEED_SOURCES = [
  // The reader's personalised myFT (followed-topics) feed. `myft: true` marks the
  // emitted items so the Home page routes them to the FT stream, not Macro; no
  // topic/quality filters — the reader curated this feed themselves.
  { url: "https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss", source: "Financial Times", region: "GEN", cap: 40, myft: true, soft: true },
  // Reuters & Bloomberg via Google News search (site:-scoped, macro terms, last 2
  // days). Reuters US + UK are CONSOLIDATED into one query (the two macro keyword
  // sets OR'd together) to save a Worker subrequest — one gnews source instead of
  // two, each of which also spends a variant/Bing fallback.
  { url: "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&q=site%3Areuters.com%20%28Fed%20OR%20inflation%20OR%20%22interest%20rate%22%20OR%20GDP%20OR%20economy%20OR%20Treasury%20OR%20%22stock%20market%22%20OR%20%22Bank%20of%20England%22%20OR%20gilt%20OR%20%22UK%20economy%22%20OR%20sterling%29%20when%3A2d", source: "Reuters", region: "GEN", cap: 11, gnews: true },
  { url: "https://news.google.com/rss/search?q=site%3Abloomberg.com%20%28Fed%20OR%20inflation%20OR%20%22interest%20rate%22%20OR%20economy%20OR%20%22Bank%20of%20England%22%20OR%20bonds%29%20when%3A2d&hl=en-US&gl=US&ceid=US%3Aen", source: "Bloomberg", region: "GEN", cap: 6, gnews: true },
  // Bloomberg's OFFICIAL section feeds (feeds.bloomberg.com) — live, so stories
  // stream in as published. They carry the Asia-desk's broad industrial/politics
  // coverage overnight, so they take the STANDARD macro-relevance title filter
  // (same as the FT/CNBC/MarketWatch sections) rather than filter:false;
  // title-dedupe collapses overlap with the Google-News Bloomberg fallback.
  { url: "https://feeds.bloomberg.com/markets/news.rss", source: "Bloomberg", region: "GEN", cap: 8, soft: true },
  { url: "https://feeds.bloomberg.com/business/news.rss", source: "Bloomberg", region: "GEN", cap: 6, soft: true },
  { url: "https://feeds.bloomberg.com/economics/news.rss", source: "Bloomberg", region: "GEN", cap: 6, soft: true },
  // (FT Alphaville's Google-News bridge removed: path-scoped site: queries
  // return zero items from Google News — confirmed by the live probe — so it
  // was pure dead weight against the news.google.com rate limit. The direct
  // ft.com/alphaville RSS below carries the column.)
  // (The Economist's Google-News bridge removed to save a Worker subrequest — the
  // two DIRECT economist.com section feeds below, finance-and-economics + business,
  // return the recent archive in full and carry all the macro-relevant coverage.)
  // Financial specialists — US
  // WSJ — DIRECT publisher feeds on Dow Jones's CURRENT feed host
  // (feeds.content.dowjones.io), the same host MarketWatch pulls from fine below.
  // These are the reliable route: the OLD feeds.a.dj.com/rss mirrors serve a
  // frozen >6-day back-catalogue, and Google HARD-pins the site:wsj.com search
  // (503s it run after run). STANDARD macro/markets filter (not soft): these
  // section feeds carry a lot of single-company and human-interest copy
  // ("Northrop lifts outlook", "luxury taxi tracking") that isn't wire-relevant,
  // so only genuine macro/markets/megacap headlines ("Oil gains on Iran risks")
  // pass. title-dedupe collapses overlap between the two.
  { url: "https://feeds.content.dowjones.io/public/rss/RSSMarketsMain", source: "The Wall Street Journal", region: "US", cap: 12 },
  { url: "https://feeds.content.dowjones.io/public/rss/WSJcomUSBusiness", source: "The Wall Street Journal", region: "US", cap: 10 },
  // WSJ backup behind the direct feeds + last-good cache: the Google-News bridge
  // (5-day depth), used only when the direct feeds miss. (The WSJ GDELT route was
  // removed — the direct feeds solved WSJ, and dropping it leaves GDELT's tight
  // per-IP rate limit entirely for TradingEconomics below.)
  { url: "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&q=site%3Awsj.com%20when%3A5d", source: "The Wall Street Journal", region: "US", cap: 18, gnews: true },
  // Macro-data desk (always MAC) — the economic-INDICATOR releases (CPI / GDP /
  // PMI / jobs / rates) TradingEconomics was meant to supply. TE itself is
  // unreachable from this Worker on EVERY route (its RSS 403s the datacenter IP;
  // Google has the content but hard-pins the query; Bing/GDELT don't index it —
  // all debug=2-verified), so this SUBSTITUTES Investing.com's Economic
  // Indicators feed, which carries the same releases and IS reachable (plain 200
  // from the Worker). Distinct source name — NOT "Investing.com" — so it dodges
  // the drop-unless-Reuters screen on the general Investing.com feed below;
  // filter:false (the feed is already indicator-scoped) and the client labels
  // every item MAC by source (feed.js deskFor).
  { url: "https://www.investing.com/rss/news_95.rss", source: "Investing.com Economics", region: "GEN", cap: 16, filter: false },
  // Business Wire — corporate press-release wire, SCOPED via Google News to
  // private-markets / credit deals (fund closes, significant risk transfer / SRT,
  // direct lending, CLOs, capital-relief trades) so the general PR firehose stays
  // out. filter:false because the query already scopes it.
  { url: "https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US%3Aen&q=site%3Abusinesswire.com%20(%22private%20credit%22%20OR%20%22risk%20transfer%22%20OR%20%22direct%20lending%22%20OR%20%22asset-based%22%20OR%20CLO%20OR%20%22credit%20fund%22%20OR%20%22capital%20relief%22%20OR%20%22collateralized%22)%20when%3A7d", source: "Business Wire", region: "GEN", cap: 10, gnews: true, filter: false },
  { url: "https://www.cnbc.com/id/20910258/device/rss/rss.html", source: "CNBC", region: "US", cap: 10 }, // Economy
  { url: "https://www.cnbc.com/id/20409666/device/rss/rss.html", source: "CNBC", region: "US", cap: 8 },  // Markets
  { url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", source: "CNBC", region: "US", cap: 6 },  // Finance
  { url: "https://feeds.content.dowjones.io/public/rss/mw_topstories", source: "MarketWatch", region: "US", cap: 5, core: true },
  { url: "https://www.federalreserve.gov/feeds/press_monetary.xml", source: "Federal Reserve", region: "US", cap: 6, filter: false },
  // Financial specialists — UK / Europe
  { url: "https://www.ft.com/markets?format=rss", source: "Financial Times", region: "UK", cap: 10 },
  { url: "https://www.ft.com/global-economy?format=rss", source: "Financial Times", region: "UK", cap: 8 },
  // Premium, already-curated finance/economics sections — trusted like the Fed feed
  // (filter:false), so the strict macro-keyword title filter doesn't drop their
  // (often oblique) headlines. Capped, so they can't flood the feed.
  { url: "https://www.ft.com/alphaville?format=rss", source: "FT Alphaville", region: "GEN", cap: 6, filter: false },
  { url: "https://www.economist.com/finance-and-economics/rss.xml", source: "The Economist", region: "GEN", cap: 12, filter: false },
  { url: "https://www.economist.com/business/rss.xml", source: "The Economist", region: "GEN", cap: 6, filter: false },
  { url: "https://www.bankofengland.co.uk/rss/news", source: "Bank of England", region: "UK", cap: 6 },
  { url: "https://www.theguardian.com/business/economics/rss", source: "The Guardian", region: "UK", cap: 6 },
  { url: "https://www.theguardian.com/uk/business/rss", source: "The Guardian", region: "UK", cap: 5 },
  // Asia — reputable regional business/finance desks for overnight coverage.
  { url: "https://asia.nikkei.com/rss/feed/nar", source: "Nikkei Asia", region: "GEN", cap: 4 },
  { url: "https://www.scmp.com/rss/92/feed", source: "South China Morning Post", region: "GEN", cap: 4 },
  { url: "https://www.straitstimes.com/news/business/rss.xml", source: "The Straits Times", region: "GEN", cap: 3 },
  // Global aggregator — capped low. Yahoo Finance removed: its RSS is dominated by
  // sensational single-company clickbait with no reliable title signature to filter.
  { url: "https://www.investing.com/rss/news_25.rss", source: "Investing.com", region: "GEN", cap: 3 },
  // Curated Substacks — reader-chosen credit/macro newsletters. `substack: true`
  // marks the emitted items so the Home page routes them to their own "SUBS"
  // desk label (integrated into the All wire, like the myFT stream). filter:false
  // — these are hand-picked, so the macro-keyword title screen is bypassed.
  { url: "https://investorama.substack.com/feed", source: "Accredited Investor Insights", region: "GEN", cap: 4, filter: false, substack: true },
  { url: "https://mohamedelerian.substack.com/feed", source: "Mohamed El-Erian", region: "GEN", cap: 4, filter: false, substack: true },
  { url: "https://debtserious.substack.com/feed", source: "Debt Serious", region: "GEN", cap: 4, filter: false, substack: true },
  // Moved to a custom domain (butthistime.com) — the old sineados.substack.com
  // feed returns 200 with zero items. Substack serves the same RSS at /feed on
  // custom domains.
  { url: "https://www.butthistime.com/feed", source: "But This Time It's Different", region: "GEN", cap: 4, filter: false, substack: true },
  // Legal-industry news — The Lawyer & Legal Business (UK). `legal: true` routes
  // the emitted items to the Legal desk (labelled NEWS there); filter:false so the
  // macro-keyword title screen doesn't drop legal-market headlines. Their direct
  // WordPress feeds carry the recent posts (dated) — the debug probe confirmed
  // 100 / 10 items, whereas the Google-News site-searches barely indexed these
  // trade titles AND their variant/Bing fallbacks blew the Worker subrequest cap
  // (knocking out Business Wire), so the direct feeds are used alone.
  { url: "https://www.thelawyer.com/feed/", source: "The Lawyer", region: "UK", cap: 12, filter: false, legal: true },
  { url: "https://www.legalbusiness.co.uk/feed/", source: "Legal Business", region: "UK", cap: 12, filter: false, legal: true },
];
// STRICT macro filter — a title must touch one of: central-bank policy, a key
// economic indicator, an index / rates / commodity / FX move, or major earnings.
// Deliberately excludes single-stock tips, crypto, personal finance and general
// news so the high-volume FX/aggregator desks contribute only genuine macro.
const FEED_MACRO_RE = new RegExp([
  // central banks & monetary policy
  "fed(eral reserve)?\\b", "\\bfomc\\b", "powell", "warsh", "waller", "\\bboe\\b", "bank of england", "bailey",
  "\\bmpc\\b", "\\becb\\b", "lagarde", "central bank", "monetary policy", "rate (decision|hike|cut|rise|hold|path|bets)",
  "interest rate", "policy rate", "bank rate", "basis point", "\\bbps\\b", "quantitative", "hawkish", "dovish", "rate-setter",
  // key economic indicators
  "inflation", "deflation", "\\bcpi\\b", "\\bppi\\b", "\\bpce\\b", "\\bgdp\\b", "recession", "unemploy", "jobless",
  "payroll", "nonfarm", "jobs report", "labou?r market", "wage", "retail sales", "industrial production", "\\bpmi\\b",
  "\\bism\\b", "consumer (confidence|sentiment|spending)", "housing", "trade (balance|deficit|war)",
  "budget|fiscal|deficit|borrowing", "tariff",
  // indices / rates / commodities / FX (macro-level moves)
  "s&p 500|s&p500|\\bs&p\\b", "nasdaq", "dow jones|\\bdow\\b", "\\bftse\\b", "nikkei", "\\bdax\\b", "stoxx",
  "wall street", "stock market|stock-market", "\\bindex\\b|indices|equit", "treasur", "\\byield", "\\bgilt", "\\bbond",
  "\\bbund", "\\boil\\b|brent|crude|\\bopec\\b", "\\bgold\\b", "dollar|sterling|\\bpound\\b|\\beuro\\b|\\byen\\b",
  // NB: bare move-verbs (rally/slump/sell-off) were removed — index-level moves are
  // caught by the index/Wall-Street terms above, so dropping them keeps single-stock
  // "share rally" notes out.
  // major earnings
  "earnings|profit warning|results beat|results miss",
].join("|"), "i");
// A TIGHTER filter for sources whose general desk skews click-baity (MarketWatch):
// only central-bank policy and top-tier economic data get through — no market
// chatter, single stocks, FX crosses or earnings.
const FEED_CORE_MACRO_RE = new RegExp([
  "fed(eral reserve)?\\b", "\\bfomc\\b", "powell", "warsh", "waller", "\\bboe\\b", "bank of england", "bailey",
  "\\bmpc\\b", "\\becb\\b", "lagarde", "central bank", "monetary policy", "rate (decision|hike|cut|rise|hold|path|bets)",
  "interest rate", "policy rate", "bank rate", "rate-setter",
  "inflation", "deflation", "\\bcpi\\b", "\\bppi\\b", "\\bpce\\b", "\\bgdp\\b", "recession", "unemploy", "jobless",
  "payroll", "nonfarm", "jobs report", "labou?r market", "wage", "retail sales", "\\bpmi\\b",
  "consumer (confidence|sentiment|spending)", "trade (balance|deficit|war)", "budget|fiscal|deficit", "tariff",
].join("|"), "i");
// Reject even when a macro term matched: single-stock broker rating notes (not
// macro), and FX stories led by a minor currency (we only want USD/GBP/EUR/JPY —
// unless a major currency is also in play, i.e. it's a cross vs a major).
const FEED_BROKER_RE = /\b(price target|target price|raises? target|cuts? target|lifts? target|upgrade[sd]?|downgrade[sd]?|overweight|underweight|outperform|market perform|initiates? coverage|reiterate[sd]?|buy rating|sell rating|hold rating|valuation discount|(cut|raised?|lowered?) to (buy|sell|hold|neutral))\b/i;
// Non-major currencies. When one of these is *named* in a headline the story is
// about that currency, so it's cut even if a major (USD/EUR/GBP/JPY) also appears
// — FX-desk notes are always "X against the dollar". Ambiguous tokens that double
// as ordinary words (real yields, "won" the verb, Rand the surname) are pinned to
// their currency form to avoid false positives.
const FEED_MINOR_FX_RE = /\b(rupee|renminbi|yuan|korean won|ringgit|baht|rupiah|peso|brazilian real|south african rand|rouble|ruble|hryvnia|zloty|forint|krona|krone|shekel|dirham|riyal|naira|cedi|birr|taka|dong\b|tenge|lira|franc|aussie dollar|australian dollar|canadian dollar|kiwi dollar|new zealand dollar|loonie)\b/i;
// Mega-cap / high-profile names — single-stock notes on these are market-moving,
// so they stay in (both as an include signal and an exception to the broker cut).
// Smaller names (e.g. Sandvik) still get filtered out.
const FEED_MEGACAP_RE = /\b(apple|microsoft|alphabet|google|amazon|nvidia|meta|facebook|tesla|berkshire|broadcom|tsmc|taiwan semiconductor|eli lilly|jpmorgan|goldman sachs|netflix|aramco|exxon|walmart|mastercard|oracle|openai|boeing|spacex|samsung|\bmag ?7\b|magnificent seven)\b/i;
// Single-stock promo / clickbait pitches ("X Is Too Cheap To Ignore", "3 stocks
// to buy", "Wall Street thinks …", "is a screaming buy", dividend-stock lists).
const FEED_STOCKPITCH_RE = /\b(too cheap to ignore|to ignore now|is (a |an )?(screaming |strong |compelling |must-own )?buy\b|screaming buy|stocks? to buy|best stocks?|top (stock )?picks?|is it time to buy|should you buy|why i('|')?m buying|undervalued|overvalued|hidden gem|is (a |too )?(cheap|bargain|steal)|dividend (stock|aristocrat|king|machine)|wall street thinks|motley fool|zacks)\b/i;
// Earnings-move / trading-bait headlines ("X shares may move 9% on earnings",
// "stock could jump", "options imply a big move", "straddle"). These push readers
// to trade a single name rather than inform — cut regardless of the company.
const FEED_TRADEBAIT_RE = /\b((shares?|stock) (may|might|could|to|set to|likely to) (move|jump|surge|soar|swing|rally|plunge|tumble|sink|slide)|move \d+(\.\d+)?% on (its |the )?earnings|(implied|expected) move|options? (traders?|market) (are |is )?(betting|pricing|implying)|straddle|priced for a (big|large) move|earnings (play|bet))\b/i;
// FOMO / hype clickbait ("you're missing the deal of the decade", "guaranteed to
// beat inflation", "get rich", "the only trade you need"). Pure induce-to-trade
// junk — cut unconditionally, whatever the subject.
const FEED_HYPE_RE = /\b(you'?(re| are) missing|don'?t miss (out )?on|before (it'?s|its) too late|(deal|trade|stock|opportunity|buy) of (the|a) (decade|lifetime|century|year)|once[- ]in[- ]a[- ](lifetime|generation)|guaranteed (to|returns?|income|profit|gains?)|get(ting)? rich|will make you rich|makes? you rich|retire (early|rich|a millionaire)|this (one|single) (stock|trade|move|chart)|the only (stock|trade|etf|fund) you (need|will ever need)|smart money is (buying|piling)|screaming (buy|deal)|can'?t[- ]miss)\b/i;
// A stock ticker in parentheses — "Chemours Company (CC)" — is a strong single-
// stock signal; ignore common macro/geo abbreviations that also appear that way.
const FEED_TICKER_RE = /\(([A-Z]{1,5})\)/;
const FEED_TICKER_OK = new Set(["US", "UK", "EU", "EC", "UN", "CPI", "GDP", "PCE", "PPI", "PMI", "ISM", "ECB", "BOE", "BOJ", "FOMC", "OPEC", "IMF", "G7", "G20", "AI", "EV", "IPO", "CEO", "CFO", "QE", "QT", "FX", "WTI", "OBR", "ONS", "IFS", "NIESR"]);
function feedHasStockTicker(title) { const m = FEED_TICKER_RE.exec(title); return m ? !FEED_TICKER_OK.has(m[1]) : false; }
function feedReject(title) {
  // Hype / FOMO clickbait is junk regardless of subject — cut it outright.
  if (FEED_HYPE_RE.test(title)) return true;
  // Single-stock notes/pitches and earnings-move trading bait are cut unless the
  // story is about a mega-cap (those are genuinely market-moving).
  if (!FEED_MEGACAP_RE.test(title) && (FEED_BROKER_RE.test(title) || FEED_STOCKPITCH_RE.test(title) || FEED_TRADEBAIT_RE.test(title) || feedHasStockTicker(title))) return true;
  // A named non-major currency means the story is about that currency — cut it
  // even when a major (USD/EUR/GBP/JPY) also appears, since FX notes always quote
  // the pair against the dollar. Only USD/EUR/GBP/JPY stories get through.
  if (FEED_MINOR_FX_RE.test(title)) return true;
  return false;
}
function feedDecode(s) {
  return String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => { try { return String.fromCodePoint(parseInt(h, 16)); } catch { return ""; } })
    .replace(/&#(\d+);/g, (_, d) => { try { return String.fromCodePoint(parseInt(d, 10)); } catch { return ""; } })
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}
function feedTag(block, tag) {
  const m = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "i").exec(block);
  return m ? m[1] : "";
}
function feedAtomLink(block) {
  const links = (block.match(/<link\b[^>]*\/?>/gi) || []);
  const pick = links.find((l) => /rel=["']?alternate/i.test(l)) || links.find((l) => !/rel=/i.test(l)) || links[0];
  if (!pick) return "";
  const h = /href=["']([^"']+)["']/i.exec(pick);
  return h ? h[1] : "";
}
// Europe/London calendar date (YYYY-MM-DD) + 24h time (HH:MM) for a Date.
function feedLondon(d) {
  if (!d || isNaN(d.getTime())) return { date: "", time: "" };
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d).map((x) => [x.type, x.value]));
  const hh = p.hour === "24" ? "00" : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hh}:${p.minute}` };
}
function feedParse(xml, feed) {
  const out = [];
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  for (const block of blocks) {
    let title = feedDecode(feedTag(block, "title"));
    // Google News appends " - <Outlet>" to every headline — strip that trailing
    // publisher tag so the title reads cleanly (the source is set from the feed).
    if (feed.gnews) title = title.replace(/\s+[-–—]\s+[^-–—]{2,40}$/, "").trim();
    if (!title || title.length < 8) continue;
    let link = feedDecode(feedTag(block, "link"));
    if (!/^https?:\/\//i.test(link)) link = feedAtomLink(block);
    link = (link || "").trim();
    if (!/^https?:\/\//i.test(link)) continue;
    // Bing News RSS (the bingMirror fallback) wraps links in an apiclick
    // redirect — unwrap to the real article URL.
    if (/bing\.com\/news\/apiclick/i.test(link)) {
      try { const u = new URL(link).searchParams.get("url"); if (u && /^https?:\/\//i.test(u)) link = u; } catch { /* keep wrapped */ }
    }
    const ds = feedTag(block, "pubDate") || feedTag(block, "published") || feedTag(block, "updated") || feedTag(block, "dc:date") || feedTag(block, "date");
    const when = ds ? new Date(feedDecode(ds)) : null;
    out.push({ title, url: link, source: feed.source, region: feed.region, myft: feed.myft || undefined, substack: feed.substack || undefined, legal: feed.legal || undefined, when: (when && !isNaN(when.getTime())) ? when : null });
  }
  return out;
}
const feedSleep = (ms) => new Promise((res) => setTimeout(res, ms));
// Same-host burst control. The live probe showed news.google.com answering 503
// and substack.com 429 when all their queries fire in ONE parallel burst from
// the same edge IP — rate limiting, not blocking (siblings in the same burst
// got 200s). Space out the fetch STARTS for those two hosts (every other host
// stays fully parallel); returns a per-source delay array aligned to FEED_SOURCES.
function feedStagger() {
  const seen = {};
  return FEED_SOURCES.map((f) => {
    let h = "";
    try { h = new URL(f.url).hostname; } catch { return 0; }
    const k = h === "news.google.com" ? h
      : h === "api.gdeltproject.org" ? "gdelt"
      : h.endsWith(".substack.com") ? "substack" : "";
    if (!k) return 0;
    const n = seen[k] || 0;
    seen[k] = n + 1;
    // Substack throttles harder than Google (still flapping 429s at 450ms
    // spacing) — double the gap. GDELT rate-limits by IP (429s two concurrent
    // domain queries), so space its calls ~2s apart.
    return n * (k === "substack" ? 900 : k === "gdelt" ? 2000 : 450);
  });
}
async function feedFetch(url, delayMs = 0, diag = null, budget = null) {
  if (delayMs) await feedSleep(delayMs);
  // Subrequest budget. Cloudflare caps total subrequests per invocation (~50).
  // The old per-source retry DOUBLED every rate-limited fetch, so with ~34
  // sources a burst of 429/503s blew the ceiling — and whichever feeds fetch
  // LAST were the ones starved with "Too many subrequests", which feedStagger
  // reliably makes the google.com queries (WSJ & TradingEconomics). So: exactly
  // ONE attempt per URL, hard-capped by a shared budget. A stuck gnews query
  // gets its second chance from the locale variant in feedAssemble (a DIFFERENT
  // URL, still budget-gated), not from a same-window retry that the live probes
  // showed just lands in the same throttle and fails anyway.
  if (budget) { if (budget.left <= 0) { if (diag && !diag.err) diag.err = "subrequest-budget"; return null; } budget.left--; }
  try {
    // Bound each feed so one slow host can't stall the combined response.
    // cacheTtl 0 — NOT 300: the edge cache can pin a stale/poisoned body (a
    // bot-wall challenge page) for 5 minutes; the assembled payload has its own
    // 5-minute cache so origin hit-rates are identical, and symmetry with the
    // uncached debug=2 probe is worth more.
    // news.google.com slow-walls datacenter IPs — it answered fine intermittently
    // but timed out on EVERY gnews source at the old 4.5s abort, starving both the
    // fresh wire AND the last-good cache. Give google.com a longer leash so more
    // of those fetches land; the assembled payload is cached 5 min, so an
    // occasional slow origin hit is cheap. Everyone else keeps the tight bound.
    // news.google.com slow-walls datacenter IPs, and GDELT's doc API is simply a
    // slow index (3-8s) — both timed out on the tight 4.5s abort, starving the
    // fresh wire AND the last-good cache. Give those two a longer leash; the
    // assembled payload is cached 5 min, so an occasional slow origin hit is
    // cheap. Everyone else keeps the tight bound.
    let toMs = 4500;
    try { if (new URL(url).hostname === "news.google.com") toMs = 9000; } catch { /* keep default */ }
    const r = await fetch(url, { headers: fetchHeaders(url), cf: { cacheTtl: 0 }, signal: AbortSignal.timeout(toMs) });
    if (diag) diag.status = r.status;
    if (r.ok) return await r.text();
  } catch (e) { if (diag) diag.err = String((e && e.message) || e).slice(0, 80); }
  return null;
}
// Google News pins 503s to SPECIFIC query strings from datacenter IPs (live
// probes: the same three queries fail run after run while structurally
// identical siblings pass — per-query-hash scoring, not burst throttling).
// Re-roll the bucket: flip the locale params and nudge the when: window, so
// the variant hashes differently but returns the same journalism. Used as an
// automatic fallback whenever a gnews primary comes back empty.
function gnewsVariant(url) {
  let v = url.replace(/when%3A(\d+)d/, (m, d) => "when%3A" + Math.max(1, +d - 1) + "d");
  v = /ceid=US%3Aen/.test(v)
    ? v.replace("hl=en-US", "hl=en-GB").replace("gl=US", "gl=GB").replace("ceid=US%3Aen", "ceid=GB%3Aen")
    : v.replace("hl=en-GB", "hl=en-US").replace("gl=GB", "gl=US").replace("ceid=GB%3Aen", "ceid=US%3Aen");
  return v;
}
// LAST-resort mirror when Google pins a query no matter how it's dressed up
// (live probes: three queries 503 across hours, surviving param reordering AND
// the locale-flipped variant — Google has scored the SEARCH itself, likely a
// scraping heuristic on broad site: queries). Bing News serves the same
// site:-scoped news search as RSS, tolerates datacenter IPs, and links land
// on the article directly (its apiclick redirect is unwrapped in feedParse).
// The when: window doesn't map — sortbydate + the wire's own 6-day cutoff and
// newest-first per-source cap do the windowing instead.
function bingMirror(url) {
  try {
    const q = (new URL(url).searchParams.get("q") || "").replace(/\s*when:\d+[dh]\s*/i, " ").trim();
    if (!q) return null;
    return "https://www.bing.com/news/search?q=" + encodeURIComponent(q) + "&format=RSS&qft=sortbydate%3d%221%22";
  } catch { return null; }
}
// Soft screen for the reader-curated feeds (myFT + Bloomberg's official section
// wires): EVERYTHING passes except lifestyle / arts / culture / travel / sport.
// A headline that ALSO matches the finance vocabulary survives even when it
// brushes lifestyle terms (business-of-culture: "Netflix earnings", a studio
// merger), so the reject list can afford to be broad.
const FEED_LIFESTYLE_RE = new RegExp([
  "travel", "holiday", "\\bhotels?\\b", "restaurant", "recipe", "cook(ing|book)", "\\bdining\\b", "\\bwine\\b", "whisky", "cocktail",
  "fashion", "beauty", "jewell?er", "luxury watch", "\\byacht", "interior design",
  // beauty / self-care / style-advice ("How does she get that glow?" got through)
  "skincare", "make-?up", "cosmetics?", "fragrance", "perfume", "grooming", "\\bglow\\b", "hairstyl",
  "gift guide", "what to wear", "wardrobe", "\\bdating\\b", "parenting", "\\bfitness\\b", "\\bgym\\b",
  "\\barts\\b", "artist", "\\bgallery\\b", "museum", "exhibition", "theatre", "theater", "\\bopera\\b", "ballet",
  "\\bfilm\\b", "\\bmovie", "\\bcinema", "box office", "\\bpodcast", "\\bmusic\\b", "\\balbum\\b", "\\bconcert\\b", "celebrit", "royal family", "memoir", "poetry",
  "crossword", "puzzle", "horoscope", "wellness", "\\byoga\\b", "recipes", "lunch with the ft", "how to spend it",
  "obituar", "\\bdies aged\\b", "\\b(19|20)\\d\\d[–—-](19|20)\\d\\d\\b",
].join("|"), "i");
const feedNorm = (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
async function handleFeed(request, env, ctx) {
  const url = new URL(request.url);
  // /api/feed?debug=1 — probe every source and report ok/status/item counts.
  if (url.searchParams.get("debug") === "1") {
    const dbgDelays = feedStagger();
    const probes = await Promise.all(FEED_SOURCES.map(async (f, i) => {
      try {
        if (dbgDelays[i]) await feedSleep(dbgDelays[i]);
        let r = await fetch(f.url, { headers: fetchHeaders(f.url), cf: { cacheTtl: 0 } });
        // Mirror feedFetch's rate-limit retry so the probe reports what the
        // real assembly would actually get, not the first throttled answer.
        if (r.status === 429 || r.status === 503) {
          await feedSleep(700);
          r = await fetch(f.url, { headers: fetchHeaders(f.url), cf: { cacheTtl: 0 } });
        }
        // Mirror the assembly's fallbacks for stuck Google queries — the
        // locale-flipped variant, then the Bing mirror; `via` marks which
        // fallback served the row.
        let via;
        if (!r.ok && f.gnews) {
          await feedSleep(300);
          const vr = await fetch(gnewsVariant(f.url), { headers: fetchHeaders(f.url), cf: { cacheTtl: 0 } });
          if (vr.ok) { r = vr; via = "variant"; }
        }
        if (!r.ok && f.gnews) {
          const b = bingMirror(f.url);
          if (b) {
            await feedSleep(200);
            const br = await fetch(b, { headers: fetchHeaders(b), cf: { cacheTtl: 0 } });
            if (br.ok) { r = br; via = "bing"; }
          }
        }
        const txt = r.ok ? await r.text() : "";
        const parsed = txt ? feedParse(txt, f).filter((x) => !feedReject(x.title)) : [];
        const kept = f.soft ? parsed.filter((x) => !FEED_LIFESTYLE_RE.test(x.title) || FEED_MACRO_RE.test(x.title) || FEED_MEGACAP_RE.test(x.title))
          : (f.filter === false) ? parsed
          : f.core ? parsed.filter((x) => FEED_CORE_MACRO_RE.test(x.title))
          : parsed.filter((x) => FEED_MACRO_RE.test(x.title) || FEED_MEGACAP_RE.test(x.title));
        // `dated` is the count that actually matters downstream: an item with
        // no parseable pubDate used to be dropped silently by the assembly's
        // cutoff check, so a source could probe "kept: 20" yet contribute
        // NOTHING to the wire. (Undated items now get stable first-seen
        // stamps, but the gap between kept and dated remains the diagnostic.)
        return { source: f.source, url: f.url, status: r.status, parsed: parsed.length, kept: kept.length, dated: kept.filter((x) => x.when).length, ...(via ? { via } : {}) };
      } catch (e) { return { source: f.source, url: f.url, error: String((e && e.message) || e) }; }
    }));
    return new Response(JSON.stringify({ probes }, null, 2), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  // /api/feed?debug=2 — the GROUND TRUTH: run the real assembly (no cache) and
  // report the per-source composition of the exact payload clients receive.
  // debug=1 shows what each fetch returns; THIS shows what survives into the
  // wire — the two together pinpoint any silently-vanishing source.
  if (url.searchParams.get("debug") === "2") {
    const trace = [];
    const items = await feedAssemble(env, ctx, trace);
    const bySource = {};
    for (const it of items) {
      const s = bySource[it.source] || (bySource[it.source] = { n: 0, newest: "", oldest: "" });
      s.n++;
      const d = `${it.date} ${it.time}`;
      if (!s.newest || d > s.newest) s.newest = d;
      if (!s.oldest || d < s.oldest) s.oldest = d;
    }
    // `assembly` = THIS run's per-source fetch/filter/cap stages (status/err,
    // bytes, parsed→kept→capped) — where a probe-healthy source actually dies.
    return new Response(JSON.stringify({ total: items.length, bySource, assembly: trace }, null, 2), {
      headers: { "content-type": "application/json", "cache-control": "no-store" },
    });
  }
  // /api/feed?cull=1 — instrument the shared quality cull: how many items the
  // source + relevance gate drops from the assembled wire, and examples.
  if (url.searchParams.get("cull")) {
    const stats = { kept: 0, dropped: 0, examples: [] };
    const items = await feedAssemble(env, ctx, null, stats);
    const before = stats.kept + stats.dropped;
    return new Response(JSON.stringify({ before, after: items.length, dropped: stats.dropped,
      pct: before ? +((stats.dropped / before) * 100).toFixed(1) : 0, examples: stats.examples }, null, 2),
      { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/feed?v=46", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const items = await feedAssemble(env, ctx);
  const resp = new Response(JSON.stringify({ items, asOf: new Date().toISOString() }), {
    headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
  });
  if (ctx && ctx.waitUntil && items.length) ctx.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
}
// ---- Wire quality cull (server-side) — applied to the assembled stream so EVERY
// surface (Home + the Macro/Credit/Legal live-wire folds) consumes ONE filtered
// set: drop low-tier sources, and require a general-news headline (non-premium,
// non-flagged, non-macro) to read as finance/markets/economy/policy/dealmaking.
const FEED_LOWTIER = new Set([
  "Benzinga", "TheStreet", "Yahoo Finance", "Yahoo Finance UK", "Sunday Guardian Live",
  "HomeOwners Alliance", "U.S. News", "CityAM", "Enterprise AM", "exchangerates.org.uk",
  "TradingView", "GV Wire", "CryptoTimes",
  "ActionForex", "FXStreet", "DailyFX", "FXEmpire", "Kitco", "MoneyWeek",
  "MarketBeat", "Simply Wall St", "The Motley Fool", "Motley Fool", "Zacks",
  "InvestorPlace", "TipRanks", "Finbold", "AInvest",
]);
const FEED_PREMIUM = new Set([
  "Financial Times", "FT Alphaville", "Bloomberg", "CNBC", "Reuters",
  "Reuters (via Investing.com)", "The Wall Street Journal", "WSJ", "The Economist",
  // Curated official-data desk (ONS/Eurostat/BLS releases via Investing.com's
  // Economics feed) — trusted macro, never relevance-gated.
  "Investing.com Economics",
]);
const FEED_LEGAL_SRC = new Set(["The Lawyer", "Legal Business"]);
const FEED_RELEVANCE = /\b(econom|market|stock|share\b|shares|equit|bond|yield|treasur|gilt|bund|rate|interest|inflation|deflation|cpi|ppi|pce|gdp|growth|recession|jobs|payroll|unemploy|labou?r|wage|\bpay\b|pay award|earnings growth|productivity|cost of living|fed|fomc|powell|ecb|lagarde|central bank|\bboe\b|dollar|euro|sterling|\byen\b|currenc|forex|\bfx\b|oil|crude|opec|brent|\bgas\b|gold|silver|copper|commodit|bitcoin|crypto|ethereum|stablecoin|earnings|profit|revenue|guidance|\bipo\b|merger|acquisition|buyout|takeover|\bdeal|\bm&a\b|bank|lend|credit|debt|default|bankrupt|restructur|tariff|trade|export|import|sanction|budget|fiscal|deficit|\btax\b|stimulus|housing|house price|mortgage|property|rent\b|retail sales|consumer|manufactur|\bpmi\b|factory|industr|semiconductor|\bchip|\bai\b|artificial intelligence|tech|nvidia|apple|microsoft|tesla|amazon|alphabet|google|meta\b|openai|geopolit|\bwar\b|election|tariff|trump|\bchina\b|russia|\biran\b|ukraine|opec|hedge fund|private equity|venture|valuation|bond market|stock market|wall street|ftse|s&p|nasdaq|dow|nikkei|dax|hang seng)\b/i;
// Routine corporate IR / press-release boilerplate — quarterly-results notices,
// dividend declarations, earnings-call scheduling, board appointments. Low signal
// even when they carry a finance keyword; dropped for non-premium/non-flagged wires
// (a genuine deal or restructuring headline doesn't read like this).
const FEED_PR_NOISE = /\bto (announce|report)\b.*\b(results|earnings)\b|\breports?\b.*\b(q[1-4]|first|second|third|fourth|quarter|half[- ]?year|full[- ]?year|fiscal|annual|interim)\b.*\b(results|earnings|financial)\b|\bdeclares?\b.*\bdividend\b|\b(earnings|conference|investor) call\b|\bannounces?\b.*\bappointment of\b|\bappoints?\b.*\bas\b.*\b(director|officer|ceo|cfo|chair|president)\b|\bschedules?\b.*\b(earnings|results)\b|\bto (present|participate) at\b.*\bconference\b/i;
// Off-topic geography — frontier / small emerging-market economies outside the
// app's developed-market universe (G7 + EU + Ireland, plus the China/Russia/
// Iran/Ukraine geopolitics it already tracks). We only reject when such a
// country is the SUBJECT of the headline (leading word, possessive, or demonym,
// e.g. "Ghana Keeps Rates…", "Zambia's Bond Rally", "Cuban Population…"), so a
// developed-market story that merely mentions one in passing still passes. This
// runs before the premium bypass so even a Bloomberg/Reuters frontier-macro
// story ("Cuba's Population Decline…") is dropped.
const FEED_OFFTOPIC_GEO = /^(?:the\s+)?(?:ghana(?:ian)?|nigeria(?:n)?|kenya(?:n)?|zambia(?:n)?|zimbabwe(?:an)?|uganda(?:n)?|tanzania(?:n)?|ethiopia(?:n)?|angola(?:n)?|mozambique|malawi(?:an)?|rwanda(?:n)?|senegal(?:ese)?|cameroon(?:ian)?|sudan(?:ese)?|namibia(?:n)?|botswana|tunisia(?:n)?|algeria(?:n)?|cuba(?:n)?|venezuela(?:n)?|bolivia(?:n)?|ecuador(?:ian)?|paraguay(?:an)?|uruguay(?:an)?|peru(?:vian)?|pakistan(?:i)?|bangladesh(?:i)?|sri\s*lanka(?:n)?|myanmar|nepal(?:ese|i)?|cambodia(?:n)?|laos|laotian|mongolia(?:n)?|kazakh(?:stan)?|uzbek(?:istan)?)(?:'s|’s)?\b/i;
function feedQualityKeep(it) {
  const s = it.source || "";
  if (FEED_LOWTIER.has(s)) return false;
  if (FEED_OFFTOPIC_GEO.test(it.title)) return false;   // frontier-EM subject — off universe
  // Premium newsrooms, the curated legal wire, and reader-flagged streams
  // (myFT / Substack) always pass; everything else must read as finance-relevant
  // (strict macro, megacap, or the broader markets/economy/policy/deal vocabulary).
  if (FEED_PREMIUM.has(s) || FEED_LEGAL_SRC.has(s) || it.myft || it.substack || it.legal) return true;
  if (!(FEED_MACRO_RE.test(it.title) || FEED_MEGACAP_RE.test(it.title) || FEED_RELEVANCE.test(it.title))) return false;
  return !FEED_PR_NOISE.test(it.title);   // drop routine IR/PR boilerplate that slipped through
}
// The actual wire assembly — fetch every source (with the variant/Bing
// fallbacks), filter, cap, stamp, merge, dedupe. Shared by the live /api/feed
// path and the debug=2 ground-truth probe so they can never drift apart.
// `trace` (debug=2): collects THIS assembly's per-source fetch/filter/cap
// stats, so a source that fetches healthily in the debug=1 probe but dies in
// the real assembly is visible with the exact stage where it died.
async function feedAssemble(env, ctx, trace = null, stats = null) {
  const delays = feedStagger();
  // Per-source LAST-GOOD cache. Every failure mode we've chased (Google 503s,
  // Substack 429s, WSJ/Fed direct-feed timeouts under the parallel burst) is a
  // TRANSIENT single-source outage: the source is healthy in one probe and
  // empty in the next, so it flickers in and out of the wire. Remember each
  // source's last successful capped items in KV and REUSE them (up to 24h) when
  // its current fetch fails — so a source that succeeds even occasionally stays
  // in the wire continuously. The 6-day cutoff below still ages reused items.
  let lastGood = {};
  try { lastGood = (await env.WATCHLIST.get("feed:lastgood", "json")) || {}; } catch { /* KV miss — no reuse this run */ }
  const nowT = Date.now();
  const LASTGOOD_MAX = 24 * 3600e3;
  const serWhen = (x) => ({ title: x.title, url: x.url, source: x.source, region: x.region, myft: x.myft, substack: x.substack, when: x.when ? x.when.toISOString() : null });
  const deWhen = (x) => ({ ...x, when: x.when ? new Date(x.when) : null });
  // ONE subrequest budget shared across every source (Cloudflare caps total
  // subrequests per invocation at ~50). Without it, a 429/503 retry burst blew
  // the ceiling and starved whichever feeds fetched last — the staggered
  // google.com WSJ / TradingEconomics queries. Leave headroom for the KV
  // reads/writes below.
  const budget = { left: 46 };
  const results = await Promise.allSettled(FEED_SOURCES.map(async (f, i) => {
    // Key the last-good cache by the STABLE source URL, never by array position.
    // Position keys ("s"+i) silently corrupt the cache the moment a source is
    // added or removed: every downstream index shifts, so a failing feed reuses
    // a DIFFERENT feed's cached items (this is exactly how, after two WSJ direct
    // feeds were removed, WSJ/TE gnews reused those feeds' stale >6-day items and
    // vanished at the cutoff).
    const key = f.url;
    const d = trace ? { source: f.source, url: f.url } : null;
    let txt = await feedFetch(f.url, delays[i], d, budget);
    // Stuck Google query → one locale-flipped variant (also budget-gated). The
    // Bing mirror was removed: live probes showed it returns empty for these
    // site: queries, and the per-source last-good cache now covers persistence.
    if (!txt && f.gnews) { txt = await feedFetch(gnewsVariant(f.url), 300, d, budget); if (txt && d) d.via = "variant"; }
    if (d) d.bytes = txt ? txt.length : 0;
    let items = [];
    if (txt) {
      items = feedParse(txt, f).filter((x) => !feedReject(x.title));
      if (d) d.parsed = items.length;
      // Reader-curated feeds (myFT, Bloomberg official wires): everything passes
      // except lifestyle — unless the headline also reads as finance/business.
      if (f.soft) {
        items = items.filter((x) => !FEED_LIFESTYLE_RE.test(x.title) || FEED_MACRO_RE.test(x.title) || FEED_MEGACAP_RE.test(x.title));
      } else if (f.filter !== false) {
        items = f.core
          ? items.filter((x) => FEED_CORE_MACRO_RE.test(x.title))
          : items.filter((x) => FEED_MACRO_RE.test(x.title) || FEED_MEGACAP_RE.test(x.title));
      }
      // Cap the FRESHEST items, not the first-parsed: Google News search RSS is
      // relevance-ordered, so slicing in parse order could fill a source's cap
      // with days-old stories that then sort to the bottom and get cut.
      items.sort((a, b) => (b.when ? b.when.getTime() : 0) - (a.when ? a.when.getTime() : 0));
      items = items.slice(0, f.cap || 8);
    }
    if (items.length) {
      lastGood[key] = { at: nowT, items: items.map(serWhen) };   // refresh the cache
      if (d) { d.kept = items.length; d.dated = items.filter((x) => x.when).length; d.capped = items.length; trace.push(d); }
      return items;
    }
    // Fetch failed / empty → reuse this source's last-good items if still fresh.
    const lg = lastGood[key];
    if (lg && Array.isArray(lg.items) && lg.items.length && (nowT - lg.at) < LASTGOOD_MAX) {
      if (d) { d.reusedLastGood = Math.round((nowT - lg.at) / 60000) + "m"; d.capped = lg.items.length; trace.push(d); }
      return lg.items.map(deWhen);
    }
    if (d) { d.capped = 0; trace.push(d); }
    return [];
  }));
  // Persist the refreshed last-good map. Prune anything not keyed by a CURRENT
  // source URL — this drops the legacy "s"+i position keys and any removed
  // source's entry, so the blob can't accumulate orphaned/mismatched caches.
  const liveKeys = new Set(FEED_SOURCES.map((f) => f.url));
  for (const k of Object.keys(lastGood)) if (!liveKeys.has(k)) delete lastGood[k];
  try { if (ctx && ctx.waitUntil) ctx.waitUntil(env.WATCHLIST.put("feed:lastgood", JSON.stringify(lastGood))); } catch { /* KV write best-effort */ }
  let all = [];
  for (const r of results) if (r.status === "fulfilled") all = all.concat(r.value);
  // ---- Stable stamps for undated items --------------------------------------
  // Some feeds ship items with no parseable pubDate. These used to die at the
  // cutoff check below — silently, AFTER the probe had already counted them as
  // "kept", which is exactly how a healthy-looking source contributes nothing
  // to the wire. Stamp each undated item with the time this Worker FIRST SAW
  // its title, persisted in KV so the stamp holds across assemblies (stamping
  // "now" each cycle would pin the item to the top of the wire forever).
  if (all.some((it) => !it.when)) {
    let firstSeen = {};
    try { firstSeen = (await env.WATCHLIST.get("feed:firstseen", "json")) || {}; } catch { /* KV miss — stamp fresh */ }
    let dirty = false;
    const now = Date.now();
    for (const it of all) {
      if (it.when) continue;
      const h = feedNorm(it.title);
      if (!h) continue;
      if (!firstSeen[h]) { firstSeen[h] = now; dirty = true; }
      it.when = new Date(firstSeen[h]);
    }
    if (dirty && env && env.WATCHLIST) {
      // Prune to the newest ~800 stamps so the map stays bounded.
      const pruned = Object.fromEntries(Object.entries(firstSeen).sort((a, b) => b[1] - a[1]).slice(0, 800));
      const put = env.WATCHLIST.put("feed:firstseen", JSON.stringify(pruned));
      if (ctx && ctx.waitUntil) ctx.waitUntil(put);
    }
  }
  all.sort((a, b) => (b.when ? b.when.getTime() : 0) - (a.when ? a.when.getTime() : 0));
  const cutoff = Date.now() - 6 * 864e5; // drop anything older than ~6 days
  const seen = new Set();
  const items = [];
  for (const it of all) {
    if (!it.when || it.when.getTime() < cutoff) continue;
    // Investing.com is dropped as a source UNLESS the item is a Reuters story
    // delivered via Investing.com (its title carries the Reuters attribution),
    // in which case it's relabelled to Reuters.
    if (it.source === "Investing.com") {
      if (/\breuters\b/i.test(it.title)) it.source = "Reuters"; else continue;
    }
    // Quality cull (shared server-side gate) — drop low-tier sources and off-topic
    // general news so every surface consumes the same filtered stream.
    if (!feedQualityKeep(it)) {
      if (stats) { stats.dropped = (stats.dropped || 0) + 1; if (stats.examples && stats.examples.length < 40) stats.examples.push(`${it.source} — ${it.title}`); }
      continue;
    }
    if (stats) stats.kept = (stats.kept || 0) + 1;
    const k = feedNorm(it.title);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    const { date, time } = feedLondon(it.when);
    if (!date) continue;
    // myFT links carry tracking params — keep the canonical /content/ URL.
    items.push({ title: it.title, url: it.myft ? it.url.replace(/\?.*$/, "") : it.url, source: it.source, region: it.region, myft: it.myft || undefined, substack: it.substack || undefined, legal: it.legal || undefined, date, time });
    // 250 (was 100): with ~270 capped candidates across the sources, a 100-item
    // wire only ever carried the newest ~day — the 5-day back-catalogue (WSJ /
    // TradingEconomics backfill) never made the cut. The 6-day cutoff above
    // still bounds the window; clients render day-grouped so depth is cheap.
    if (items.length >= 250) break;
  }
  return items;
}

// ============================ WEB PUSH ======================================
// Push notifications to the reader's iPhone Home-Screen web app (iOS 16.4+) —
// standard Web Push (RFC 8030), VAPID auth (RFC 8292) and aes128gcm payload
// encryption (RFC 8291), all via WebCrypto. The VAPID keypair self-provisions
// into KV on first use (no dashboard secrets needed). Subscriptions live in KV
// under "push:subs"; the scheduled() cron (every 15 min) sends:
//   1. a refresh digest when a routine deploy lands new desk data,
//   2. watchlist mentions (followed manager/firm ids newly appearing in data),
//   3. breaking live-feed headlines (strict core-macro filter, ≤1/hour, 07–22).
const PUSH_SUB_CONTACT = "mailto:kenneds7@tcd.ie";
const pb64 = {
  enc: (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s) => {
    s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
    const pad = s.length % 4 ? "====".slice(s.length % 4) : "";
    const bin = atob(s + pad);
    const u = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    return u;
  },
};
async function pushVapid(env) {
  let v = await env.WATCHLIST.get("push:vapid", "json");
  if (!v || !v.pub || !v.priv) {
    const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    v = { pub: await crypto.subtle.exportKey("jwk", kp.publicKey), priv: await crypto.subtle.exportKey("jwk", kp.privateKey) };
    await env.WATCHLIST.put("push:vapid", JSON.stringify(v));
  }
  return v;
}
const vapidPublicRaw = (jwk) => {
  const x = pb64.dec(jwk.x), y = pb64.dec(jwk.y);
  const out = new Uint8Array(65); out[0] = 4; out.set(x, 1); out.set(y, 33);
  return out;
};
async function vapidAuthHeader(env, endpoint) {
  const v = await pushVapid(env);
  const key = await crypto.subtle.importKey("jwk", v.priv, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const te = new TextEncoder();
  const hdr = pb64.enc(te.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const pay = pb64.enc(te.encode(JSON.stringify({ aud: new URL(endpoint).origin, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: PUSH_SUB_CONTACT })));
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, te.encode(hdr + "." + pay));
  return `vapid t=${hdr}.${pay}.${pb64.enc(sig)}, k=${pb64.enc(vapidPublicRaw(v.pub))}`;
}
async function pushHkdf(salt, ikm, info, len) {
  const key = await crypto.subtle.importKey("raw", ikm, "HKDF", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "HKDF", hash: "SHA-256", salt, info }, key, len * 8));
}
// RFC 8291 aes128gcm encryption. Exported (with injectable ephemeral key +
// salt) so the spec's Appendix-A test vector can verify it byte-for-byte.
export async function encryptPushRaw(uaPubRaw, authSecret, ephKeyPair, salt, plaintextBytes) {
  const te = new TextEncoder();
  const uaKey = await crypto.subtle.importKey("raw", uaPubRaw, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const ecdh = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: uaKey }, ephKeyPair.privateKey, 256));
  const ephRaw = new Uint8Array(await crypto.subtle.exportKey("raw", ephKeyPair.publicKey));
  const keyInfo = new Uint8Array([...te.encode("WebPush: info\0"), ...uaPubRaw, ...ephRaw]);
  const prk = await pushHkdf(authSecret, ecdh, keyInfo, 32);
  const cek = await pushHkdf(salt, prk, te.encode("Content-Encoding: aes128gcm\0"), 16);
  const nonce = await pushHkdf(salt, prk, te.encode("Content-Encoding: nonce\0"), 12);
  const plain = new Uint8Array([...plaintextBytes, 2]); // 0x02 = final-record delimiter
  const gk = await crypto.subtle.importKey("raw", cek, "AES-GCM", false, ["encrypt"]);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, gk, plain));
  const header = new Uint8Array(16 + 4 + 1 + 65);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, 4096); // rs
  header[20] = 65;
  header.set(ephRaw, 21);
  const body = new Uint8Array(header.length + ct.length);
  body.set(header, 0); body.set(ct, header.length);
  return body;
}
async function sendPush(env, sub, obj) {
  try {
    const eph = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const body = await encryptPushRaw(pb64.dec(sub.keys.p256dh), pb64.dec(sub.keys.auth), eph, salt, new TextEncoder().encode(JSON.stringify(obj)));
    const r = await fetch(sub.endpoint, {
      method: "POST",
      headers: { "authorization": await vapidAuthHeader(env, sub.endpoint), "content-encoding": "aes128gcm", "ttl": "3600", "urgency": "normal" },
      body,
    });
    return r.status;
  } catch { return 0; }
}
async function handlePushVapid(request, env) {
  if (!identity(request)) return json({ error: "unauthenticated" }, 401);
  const v = await pushVapid(env);
  return json({ publicKey: pb64.enc(vapidPublicRaw(v.pub)) });
}
async function handlePushSubscribe(request, env) {
  const email = identity(request);
  if (!email) return json({ error: "unauthenticated" }, 401);
  let body;
  try { body = await request.json(); } catch { return json({ error: "invalid json" }, 400); }
  const subs = (await env.WATCHLIST.get("push:subs", "json")) || {};
  if (request.method === "DELETE" || body.unsubscribe) {
    if (body.endpoint) delete subs[body.endpoint];
  } else {
    if (!body.endpoint || !body.keys || !body.keys.p256dh || !body.keys.auth) return json({ error: "invalid subscription" }, 400);
    subs[body.endpoint] = { endpoint: body.endpoint, keys: { p256dh: body.keys.p256dh, auth: body.keys.auth }, email, added: new Date().toISOString() };
  }
  await env.WATCHLIST.put("push:subs", JSON.stringify(subs));
  return json({ ok: true, count: Object.keys(subs).length });
}
// One-tap end-to-end test: GET /api/push/test (signed in via Access) sends a
// real push to every stored subscription and reports the push service's status
// per endpoint — 201 means Apple/Google accepted it for delivery.
async function handlePushTest(request, env) {
  if (!identity(request)) return json({ error: "unauthenticated" }, 401);
  const subs = (await env.WATCHLIST.get("push:subs", "json")) || {};
  const results = [];
  for (const [ep, sub] of Object.entries(subs)) {
    const status = await sendPush(env, sub, { title: "Wire test", body: "Push pipeline OK — notifications are working.", url: "/" });
    results.push({ endpoint: ep.slice(0, 60) + "…", status, accepted: status === 201 });
    if (status === 404 || status === 410) { delete subs[ep]; await env.WATCHLIST.put("push:subs", JSON.stringify(subs)); }
  }
  return new Response(JSON.stringify({ subscriptions: results.length, results }, null, 2), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
const prettyId = (id) => String(id).replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
// iOS banner discipline: title must hold one line, body two. Apple adds its own
// "from Wire" attribution line to web-app pushes (not in our payload, not
// suppressible), so our text has to stay tight. ~78 chars ≈ two banner lines.
const PUSH_SRC_ABBR = {
  "Financial Times": "FT", "The Wall Street Journal": "WSJ", "The Economist": "Economist",
  "South China Morning Post": "SCMP", "The Straits Times": "Straits Times", "Nikkei Asia": "Nikkei",
  "Federal Reserve": "Fed", "Bank of England": "BoE", "The Guardian": "Guardian", "FT Alphaville": "Alphaville",
};
const pushClamp = (s, max) => {
  s = String(s || "").trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max - 1);
  return (cut.includes(" ") ? cut.replace(/\s+\S*$/, "") : cut) + "…";
};
export async function pushScheduled(env) {
  const KV = env.WATCHLIST;
  const subs = await KV.get("push:subs", "json");
  if (!subs || !Object.keys(subs).length) return; // nobody subscribed — free
  const state = (await KV.get("push:state", "json")) || {};
  const now = Date.now();
  const hour = +new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", hour12: false }).format(now);
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(now);
  const msgs = [];

  // --- 1+2: refresh digest + watchlist mentions (data-change detection) ---
  // A routine deploy replaces the desk data modules; hash them to detect it,
  // count today's dated items for the digest, and diff per-id occurrence
  // counts for watchlist mentions.
  const files = { legal: "/legal/js/data.js", credit: "/credit/js/data.js", macro: "/macro/js/content.js" };
  const texts = {}, hashes = {};
  for (const [k, p] of Object.entries(files)) {
    try {
      const r = await env.ASSETS.fetch("https://assets.local" + p);
      texts[k] = r.ok ? await r.text() : "";
    } catch { texts[k] = ""; }
    hashes[k] = texts[k] ? pb64.enc(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texts[k]))) : "";
  }
  const changed = Object.keys(files).filter((k) => hashes[k] && state.hashes && state.hashes[k] !== hashes[k]);
  const dateRe = new RegExp('["\']?date["\']?\\s*:\\s*"' + today + '"', "g");
  const counts = {};
  for (const k of Object.keys(files)) counts[k] = (texts[k].match(dateRe) || []).length;
  // Today's item HEADLINES per desk (regex over the data-module source): for
  // each today-dated item, the nearest headline/title/name/company string in
  // the surrounding object literal. Diffed against the previous run so the
  // digest can lead with an actual new headline, not just counts.
  const todayTitles = {};
  for (const k of Object.keys(files)) {
    const out = [];
    let m;
    const re = new RegExp(dateRe.source, "g");
    while ((m = re.exec(texts[k])) && out.length < 40) {
      const start = Math.max(0, m.index - 800);
      const slice = texts[k].slice(start, m.index + 800);
      const datePos = m.index - start;
      // The item's own headline field precedes its date in these files, so take
      // the LAST title-ish string before the date (fall back to the first one
      // after) — plain nearest-by-distance can grab the NEXT object's title.
      let before = null, after = null, t;
      const tre = /(?:headline|title|name|company)\s*:\s*"((?:[^"\\]|\\.)*)"/g;
      while ((t = tre.exec(slice))) {
        if (t.index < datePos) before = t[1];
        else { after = after ?? t[1]; }
      }
      const best = before ?? after;
      if (best) out.push(best.replace(/\\(["\\])/g, "$1"));
    }
    todayTitles[k] = [...new Set(out)];
  }
  // Followed ids (single-reader: first watchlist record) for mention diffs.
  let follows = null;
  try {
    const list = await KV.list({ prefix: "wl:" });
    if (list.keys.length) follows = await KV.get(list.keys[0].name, "json");
  } catch { /* mention check skipped */ }
  const followIds = [...((follows && follows.manager) || []), ...((follows && follows.firm) || [])];
  const allText = texts.legal + "\n" + texts.credit + "\n" + texts.macro;
  const nameCounts = {};
  for (const id of followIds) nameCounts[id] = (allText.split(id).length - 1);
  // NOTE: the routine "Refresh — …" digest push is retired by request —
  // refresh detection still runs (it keeps state current and gates the
  // watchlist mention diff below), it just no longer notifies on its own.
  if (changed.length) {
    const hits = followIds.filter((id) => nameCounts[id] > ((state.nameCounts && state.nameCounts[id]) || 0));
    if (hits.length) {
      msgs.push({ title: "Watchlist", body: pushClamp(hits.map(prettyId).join(", ") + " in new items", 78), url: "/" });
    }
  }
  state.todayTitles = todayTitles;

  // --- 3: breaking headlines (strict core-macro filter, ≤1/hour, 07–22 UK) ---
  if (hour >= 7 && hour < 22 && (!state.lastBreakAt || now - state.lastBreakAt > 3600e3)) {
    try {
      const feed = await (await handleFeed(new Request("https://internal/api/feed"), env, null)).json();
      const seen = new Set(state.seenBreak || []);
      const nowMin = hour * 60 + +new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", minute: "2-digit" }).format(now);
      const fresh = (feed.items || []).filter((x) => {
        if (!FEED_CORE_MACRO_RE.test(x.title) || seen.has(feedNorm(x.title))) return false;
        if (x.date !== today) return false;
        const [h, m] = String(x.time || "").split(":").map(Number);
        return Number.isFinite(h) && nowMin - (h * 60 + m) <= 45; // published in the last ~45 min
      });
      // Mark ALL current qualifying titles seen (even unsent) so a backlog never
      // floods later runs; push only the newest, noting how many more there are.
      (feed.items || []).forEach((x) => { if (FEED_CORE_MACRO_RE.test(x.title)) seen.add(feedNorm(x.title)); });
      state.seenBreak = [...seen].slice(-400);
      if (fresh.length) {
        // No title line: iOS then leads with its own "from Wire" attribution
        // and the body is just the headline, with the source at the end.
        const src = " — " + (PUSH_SRC_ABBR[fresh[0].source] || fresh[0].source);
        const suffix = (fresh.length > 1 ? ` (+${fresh.length - 1} more)` : "") + src;
        msgs.push({
          title: "",
          body: pushClamp(fresh[0].title, 78 - suffix.length) + suffix,
          url: fresh[0].url,
        });
        state.lastBreakAt = now;
      }
    } catch { /* feed unavailable this tick */ }
  }

  for (const m of msgs) {
    for (const [ep, sub] of Object.entries(subs)) {
      const st = await sendPush(env, sub, m);
      if (st === 404 || st === 410) { delete subs[ep]; await KV.put("push:subs", JSON.stringify(subs)); }
    }
  }
  state.hashes = hashes; state.counts = counts; state.nameCounts = nameCounts;
  await KV.put("push:state", JSON.stringify(state));
}

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(pushScheduled(env));
  },
  async fetch(request, env, ctx) {
   try {
    const url = new URL(request.url);
    if (url.pathname === "/api/rates") return handleRates(request, env, ctx);
    if (url.pathname === "/api/markets") return handleMarkets(request, env, ctx);
    if (url.pathname === "/api/pulse") return handlePulse(request, env, ctx);
    if (url.pathname === "/api/macro") return handleMacro(request, env, ctx);
    if (url.pathname === "/api/yield-curve") return handleYieldCurve(request, env, ctx);
    if (url.pathname === "/api/feed") return handleFeed(request, env, ctx);
    if (url.pathname === "/api/predict") return handlePredict(request, env, ctx);
    if (url.pathname === "/api/watchlist") return handleWatchlist(request, env);
    if (url.pathname === "/api/research-targets") return handleResearchTargets(request, env);
    if (url.pathname === "/api/saved") return handleSaved(request, env, savedKeyFor);
    if (url.pathname === "/api/saved-credit") return handleSaved(request, env, savedCreditKeyFor);
    if (url.pathname === "/api/saved-macro") return handleSaved(request, env, savedMacroKeyFor);
    if (url.pathname === "/api/saved-home") return handleSavedHome(request, env);
    if (url.pathname === "/api/notif-macro") return handleNotifSeen(request, env, notifMacroKey);
    if (url.pathname === "/api/notif-credit") return handleNotifSeen(request, env, notifCreditKey);
    if (url.pathname === "/api/notif-legal") return handleNotifSeen(request, env, notifLegalKey);
    if (url.pathname === "/api/chart-prefs") return handleChartPrefs(request, env);
    if (url.pathname === "/api/push/vapid") return handlePushVapid(request, env);
    if (url.pathname === "/api/push/subscribe") return handlePushSubscribe(request, env);
    if (url.pathname === "/api/push/test") return handlePushTest(request, env);
    if (url.pathname === "/api/me") return handleMe(request);
    // v2 SPA (the ground-up rebuild, served alongside the current app). Every
    // /v2/ NAVIGATION route — anything with no file extension that isn't a real
    // asset — returns the single shell; the client router renders the right
    // view. Real files under /v2/ (js, css, index.html) are served as assets
    // by the block below untouched. The current app at / /macro/ … is wholly
    // unaffected. no-cache so a fresh deploy's shell is picked up immediately.
    if (url.pathname.startsWith("/v2/") && !/\.[a-z0-9]+$/i.test(url.pathname)) {
      const shell = await env.ASSETS.fetch(new URL("/v2/index.html", url.origin).toString());
      const headers = new Headers(shell.headers);
      headers.set("cache-control", "no-cache");
      return new Response(shell.body, { status: shell.status, statusText: shell.statusText, headers });
    }
    // Deploy-freshness probe: the newest Worker returns this JSON; an older
    // deploy has no such route and falls through to the static site. `build` is
    // bumped on each deploy so you can confirm the edge is running current code.
    if (url.pathname === "/api/version") {
      return new Response(JSON.stringify({ build: "2026-07-13-2Ylive+tickers+10headlines+overflowfix", macroCache: "v36", now: new Date().toISOString() }), {
        headers: { "content-type": "application/json", "cache-control": "no-store" },
      });
    }
    // Sign-in helper: hitting this behind Access triggers the Access login,
    // then bounces the user to `to` (default the landing page).
    if (url.pathname === "/api/login") {
      const to = url.searchParams.get("to") || "/";
      const dest = to.startsWith("/") ? to : "/";
      return Response.redirect(new URL(dest, url.origin).toString(), 302);
    }
    // Everything else: serve the static site. NOTE: with run_worker_first unset,
    // static assets (incl. the HTML documents) are served by the asset system
    // BEFORE this Worker runs, so HTML cache headers are set in the `_headers`
    // file (no-cache on the app entry points) — not here. The block below only
    // affects any HTML that DOES route through the Worker (a fallback), forcing
    // it to revalidate so a fresh deploy is never masked by a stale HTML cache.
    const res = await env.ASSETS.fetch(request);
    if ((res.headers.get("content-type") || "").includes("text/html")) {
      const headers = new Headers(res.headers);
      headers.set("cache-control", "no-cache");
      return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
    }
    return res;
   } catch (e) {
    // Last-resort guard: return a clean error for /api/* (JSON) or a plain 500
    // for anything else, so a handler bug never surfaces as a raw Cloudflare 1101.
    const isApi = new URL(request.url).pathname.startsWith("/api/");
    return new Response(isApi ? JSON.stringify({ error: String((e && e.message) || e) }) : "Internal error", {
      status: 500, headers: { "content-type": isApi ? "application/json" : "text/plain", "cache-control": "no-store" },
    });
   }
  },
};
