// Cloudflare Worker entry — serves the static site (via the ASSETS binding) and
// the per-user watchlist API at /api/watchlist plus the Meridian Legal saved-
// items API at /api/saved (both backed by the WATCHLIST KV, distinct prefixes).
//
// The whole Worker is gated by Cloudflare Access, so every request that reaches
// here is already authenticated; Access injects a signed identity JWT
// (Cf-Access-Jwt-Assertion) which we decode to key each user's watchlist by
// their verified email. Static asset requests are served before this Worker is
// invoked; anything else (the API, unknown paths) lands here.

const FOLLOW_TYPES = ["manager", "fund", "lp"];

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
// Meridian Legal saved alerts/cases/matters — a flat array of item ids, keyed
// under a distinct prefix in the same KV namespace so it never collides with a
// watchlist. Per-user isolation comes from the verified Access email, exactly
// like the watchlist, so saved items sync across that user's devices.
// Two distinct saved-items stores share this handler via different key prefixes
// so the Legal and Credit apps never overwrite each other's saved sets.
const savedKeyFor = (email) => "lsv:" + email;         // Meridian Legal
const savedCreditKeyFor = (email) => "csv:" + email;   // Meridian Credit

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
    const clean = {};
    for (const t of FOLLOW_TYPES) {
      clean[t] = Array.isArray(body[t])
        ? body[t].filter((x) => typeof x === "string" && x.length <= 16).slice(0, 5000)
        : [];
    }
    await env.WATCHLIST.put(keyFor(email), JSON.stringify(clean));
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
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

// Given [date, valueStr] pairs (any order), return the latest value + day change.
function lastTwo(pairs) {
  pairs.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const last = pairs[pairs.length - 1], prev = pairs[pairs.length - 2];
  const val = last ? parseFloat(last[1]) : null;
  const prevVal = prev ? parseFloat(prev[1]) : null;
  return {
    value: Number.isFinite(val) ? val : null,
    change: (Number.isFinite(val) && Number.isFinite(prevVal)) ? +(val - prevVal).toFixed(4) : null,
    asOf: last ? last[0] : null,
  };
}

// SOFR from the NY Fed's public JSON API (no key; not behind FRED's Cloudflare).
async function nyfedSofr() {
  const txt = await fetchText("https://markets.newyorkfed.org/api/rates/secured/sofr/last/5.json");
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
    const txt = await fetchText(`https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${env.FRED_API_KEY}&file_type=json&sort_order=desc&limit=8`);
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
    const txt = await fetchText(`https://data-api.ecb.europa.eu/service/data/FM/${key}?lastNObservations=6&format=csvdata`);
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
  const cacheKey = new Request(new URL("/api/rates?v=9", request.url).toString());
  const cached = await cache.match(cacheKey);
  if (cached) return cached;
  const data = await Promise.all(RATE_SERIES.map(async (s) => {
    const r = s.src === "ecb" ? await ecbSeries(s.keys)
      : s.src === "nyfed" ? await nyfedSofr()
      : s.src === "treasury" ? await treasurySeries(s.col)
      : await fredSeries(s.id, cosd, env);
    return { label: s.label, unit: s.unit, value: r.value, change: r.change, asOf: r.asOf, href: s.href };
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

// ============================ MACRO DASHBOARD ==============================
// Key economic indicators (US + UK) with ~5y monthly history, fetched server-
// side so there's no CORS issue or browser-visible key. Most series come from
// FRED (keyed); Services PMI comes from DBnomics (free JSON, re-hosts ISM); the
// UK 2y gilt comes from the Bank of England database. Every series carries an
// `href` to its public source so each figure is independently verifiable.
const MACRO_START = () => new Date(Date.now() - 5.3 * 365 * 864e5).toISOString().slice(0, 10);

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
  { country: "US", key: "base_rate", label: "Base rate", unit: "%", sub: "Fed funds effective rate", src: "fred", id: "FEDFUNDS", tf: "level", href: "https://fred.stlouisfed.org/series/FEDFUNDS", source: "FRED / Federal Reserve" },
  { country: "US", key: "core_cpi", label: "Core inflation", unit: "%", sub: "Core CPI · YoY", src: "fred", id: "CPILFESL", tf: "yoy", href: "https://fred.stlouisfed.org/series/CPILFESL", source: "FRED / BLS" },
  { country: "US", key: "wages", label: "Wage growth", unit: "%", sub: "Avg hourly earnings · YoY", src: "fred", id: "CES0500000003", tf: "yoy", href: "https://fred.stlouisfed.org/series/CES0500000003", source: "FRED / BLS" },
  { country: "US", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "fred", id: "UNRATE", tf: "level", href: "https://fred.stlouisfed.org/series/UNRATE", source: "FRED / BLS" },
  // DBnomics' ISM mirror lags (~Aug 2025); recent months curated from ISM's own
  // monthly releases keep it current (merged onto the real history).
  { country: "US", key: "services_pmi", label: "Services PMI", unit: "", sub: "ISM Services PMI", src: "dbnomics", id: "ISM/nm-pmi/pm", curated: [["2025-09", 50.0], ["2025-10", 52.4], ["2026-02", 56.1], ["2026-03", 54.0], ["2026-04", 53.6], ["2026-05", 54.5], ["2026-06", 54.0]], tf: "level", href: "https://www.ismworld.org/supply-management-news-and-reports/reports/ism-report-on-business/services/", source: "ISM" },
  { country: "US", key: "two_year", label: "2-year yield", unit: "%", sub: "2Y Treasury", src: "fred", id: "DGS2", tf: "level", agg: true, href: "https://fred.stlouisfed.org/series/DGS2", source: "FRED / U.S. Treasury" },
  // UK Bank Rate via FRED's OECD "central bank rate" mirror, kept current (the
  // native BOERUK* series is a historical archive that stops in 2017, and
  // bankofengland.co.uk itself blocks the Worker). Curated tail keeps the recent
  // MPC decisions current/verified if the OECD mirror lags a month.
  { country: "UK", key: "base_rate", label: "Base rate", unit: "%", sub: "BoE Bank Rate", src: "fred", id: "IRSTCB01GBM156N", curated: [["2025-08", 4.00], ["2025-11", 3.75], ["2026-06", 3.75]], tf: "level", href: "https://fred.stlouisfed.org/series/IRSTCB01GBM156N", source: "FRED / OECD · BoE" },
  // UK macro: official-source-first — the ONS time-series API returns the
  // headline annual-rate/level directly (CDID/DATASET).
  { country: "UK", key: "core_cpi", label: "Core inflation", unit: "%", sub: "Core CPI · YoY", src: "ons", id: "DKO8/MM23", tf: "level", href: "https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/dko8/mm23", source: "ONS" },
  { country: "UK", key: "wages", label: "Wage growth", unit: "%", sub: "Regular pay (AWE) · YoY", src: "ons", id: "KAI9/LMS", tf: "level", href: "https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours/timeseries/kai9/lms", source: "ONS" },
  { country: "UK", key: "unemployment", label: "Unemployment", unit: "%", sub: "Unemployment rate", src: "ons", id: "MGSX/LMS", tf: "level", href: "https://www.ons.gov.uk/employmentandlabourmarket/peoplenotinwork/unemployment/timeseries/mgsx/lms", source: "ONS" },
  // S&P Global/CIPS PMI is proprietary (not on FRED/DBnomics); seed the latest
  // verifiable value and finalise history/source with the user.
  // S&P Global/CIPS is proprietary (no free API); curated from its releases.
  { country: "UK", key: "services_pmi", label: "Services PMI", unit: "", sub: "S&P Global/CIPS Services PMI", src: "curated", curated: [["2025-11", 51.3], ["2025-12", 51.4], ["2026-04", 52.7], ["2026-05", 49.3], ["2026-06", 48.8]], tf: "level", href: "https://www.pmi.spglobal.com/Public/Home/PressRelease", source: "S&P Global/CIPS" },
  // No free live API for the 2y constant-maturity gilt: BoE's IADB benchmarks are
  // 5/10/20y (no 2y point) and bankofengland.co.uk blocks the Worker. Curated from
  // the BoE nominal yield curve; the tile links there for verification.
  { country: "UK", key: "two_year", label: "2-year yield", unit: "%", sub: "2Y gilt", src: "curated", curated: [["2025-07", 3.87], ["2026-06", 4.38], ["2026-07", 4.13]], tf: "level", href: "https://www.bankofengland.co.uk/statistics/yield-curves", source: "Bank of England" },
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
  return t.slice(-60); // last 5 years of monthly points
}

async function handleMacro(request, env, ctx) {
  const url = new URL(request.url);
  // ?debug — probe each series and report point counts so codes can be finalised.
  if (url.searchParams.get("debug")) {
    const probes = await Promise.all(MACRO_SERIES.map(async (s) => {
      try {
        const p = await macroSeriesPairs(s, env);
        return { key: s.country + ":" + s.key, src: s.src, id: s.id, points: p.length, last: p[p.length - 1] || null };
      } catch (e) { return { key: s.country + ":" + s.key, src: s.src, id: s.id, error: String((e && e.message) || e) }; }
    }));
    return new Response(JSON.stringify({ probes }, null, 2), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/macro?v=8", request.url).toString());
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/api/rates") return handleRates(request, env, ctx);
    if (url.pathname === "/api/macro") return handleMacro(request, env, ctx);
    if (url.pathname === "/api/watchlist") return handleWatchlist(request, env);
    if (url.pathname === "/api/saved") return handleSaved(request, env, savedKeyFor);
    if (url.pathname === "/api/saved-credit") return handleSaved(request, env, savedCreditKeyFor);
    if (url.pathname === "/api/me") return handleMe(request);
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
  },
};
