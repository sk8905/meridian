// Realistic /api/rates + /api/eurates payloads for the Dashboard specs (shapes
// mirror src/index.js handleRates / handleEuRates; values are real readings from
// 12–14 Oct 2026 so rendered figures look like production).
const hist = (end, step, n = 22) => Array.from({ length: n }, (_, i) => +(end - step * (n - 1 - i)).toFixed(4));
export const rates = { rates: [
  { label: "3M EURIBOR", unit: "%", value: 2.635, asOf: "2026-09", href: "https://data.ecb.europa.eu/", history: [] },
  { label: "SONIA", unit: "%", value: 3.733, asOf: "2026-10-09", href: "https://fred.stlouisfed.org/series/IUDSOIA", history: [] },
  { label: "SOFR", unit: "%", value: 4.31, asOf: "2026-10-13", href: "https://www.newyorkfed.org/markets/reference-rates/sofr", history: [] },
  { label: "US 10Y", unit: "%", value: 5.24, asOf: "2026-10-09", href: "https://home.treasury.gov/", history: [] },
  { label: "US IG OAS", unit: "bp", value: 0.83, asOf: "2026-10-12", href: "https://fred.stlouisfed.org/series/BAMLC0A0CM", history: hist(0.83, 0.002) },
  { label: "US HY OAS", unit: "bp", value: 3.11, asOf: "2026-10-12", href: "https://fred.stlouisfed.org/series/BAMLH0A0HYM2", history: hist(3.11, 0.01) },
  { label: "US CCC OAS", unit: "bp", value: 12.53, asOf: "2026-10-12", href: "https://fred.stlouisfed.org/series/BAMLH0A3HYC", history: hist(12.53, -0.02) },
  { label: "EURO HY OAS", unit: "bp", value: 3.23, asOf: "2026-10-12", href: "https://fred.stlouisfed.org/series/BAMLHE00EHYIOAS", history: hist(3.23, 0.005) },
] };
const pt = (value, asOf, chg1w, chg1m) => ({ value, asOf, chg1w, chg1m, history: [] });
export const eurates = {
  series: [
    { key: "ecb_dfr", label: "ECB deposit rate", unit: "%", href: "https://data.ecb.europa.eu/", source: "ECB", ...pt(2.5, "2026-10-14", 0, 0.25) },
    { key: "estr", label: "€STR", unit: "%", href: "https://data.ecb.europa.eu/", source: "ECB", ...pt(2.439, "2026-10-12", 0.001, 0.25) },
    { key: "euribor3m", label: "3M Euribor (monthly avg)", unit: "%", href: "https://data.ecb.europa.eu/", source: "ECB", ...pt(2.635, "2026-09", null, null) },
    { key: "boe_bank", label: "BoE Bank Rate", unit: "%", href: "https://www.bankofengland.co.uk/", source: "Bank of England", ...pt(3.75, "2026-10-12", 0, 0) },
    { key: "sonia", label: "SONIA", unit: "%", href: "https://www.bankofengland.co.uk/", source: "Bank of England", ...pt(3.7331, "2026-10-09", 0.0014, 0.0035) },
  ],
  curve: { label: "Euro area AAA govt curve", source: "ECB", href: "https://data.ecb.europa.eu/data/datasets/YC", tenors: ["3M", "2Y", "5Y", "10Y", "30Y"], asOf: "2026-10-12",
    points: [2.553, 3.066, 3.205, 3.499, 3.76].map((v) => pt(v, "2026-10-12", null, null)) },
  bankruptcies: { label: "EU bankruptcy declarations", unit: "index 2021=100", value: 195.9, asOf: "2026-Q2", yearAgo: 187.4, yearAgoAsOf: "2025-Q2", history: [], href: "https://ec.europa.eu/eurostat/databrowser/view/sts_rb_q/default/table", source: "Eurostat" },
};
export const apis = { "/api/rates": () => [200, JSON.stringify(rates)], "/api/eurates": () => [200, JSON.stringify(eurates)] };
