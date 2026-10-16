// =============================================================================
// v2/js/bonds.js — listed-bond quotes for the stressed names (Restructuring hub +
// borrower pages). The bond lines are curated data (dashboard/js/data.js CR_BONDS:
// TradingView's record of each issue + the venue its free widget can quote); the
// price itself is TradingView's embeddable Mini Symbol Overview widget — a delayed /
// end-of-day EXCHANGE quote on that venue (Tradegate, gettex, Frankfurt, Munich),
// not a composite. The widget renders in TradingView's own iframe, so Wire never
// reads, stores or re-labels the number. An optional news-quoted price (`px`) is
// shown only with its date and source.
// =============================================================================
import { CR_BONDS } from "/dashboard/js/data.js";
import { esc, fmtD } from "/util.js";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const VENUE = { TRADEGATE: "Tradegate", GETTEX: "gettex", FWB: "Frankfurt", MUN: "Munich", DUS: "Düsseldorf", HAM: "Hamburg", HAN: "Hanover" };
export const TV_WIDGET_URL = "https://www.tradingview-widget.com/embed-widget/mini-symbol-overview/";

// Pure helpers (exported for specs).
// A line is shown when it has a widget venue OR a dated, sourced press price.
export const hasPx = (b) => !!(b && b.px && b.px.v != null && b.px.asOf && b.px.src);
export const listable = (b) => !!(b && b.isin && b.name && (b.tv || hasPx(b)));
export const bondsFor = (stressName) => (CR_BONDS || []).filter((b) => listable(b) && b.name === stressName);
export const venueOf = (b) => VENUE[String((b && b.tv) || "").split(":")[0]] || String((b && b.tv) || "").split(":")[0] || "";
export const couponTxt = (c) => (typeof c === "number" ? `${+c.toFixed(3)}%` : c ? String(c) : "");
// "Apr 2029" · "Perp" — the maturity in the lead (date) column.
export const maturityTxt = (m) => {
  const x = /^(\d{4})-(\d{2})/.exec(String(m || ""));
  return x ? `${MON[+x[2] - 1]} ${x[1]}` : m == null ? "Perp" : "";
};
export const bondLabel = (b) => [couponTxt(b.coupon), b.maturity ? String(b.maturity).slice(0, 4) : "Perp"].filter(Boolean).join(" ");
export const pxTxt = (b) => (hasPx(b) ? `${b.px.v} (${fmtD(b.px.asOf)})` : "");

// The widget: the iframe TradingView's documented embed script itself inserts (its
// mini-symbol-overview page, config in the URL hash). Embedding the frame directly keeps
// third-party script out of Wire's own page and lets a sheet close mid-load without the
// loader's console error. Dark is Wire's only theme; transparent on the card surface.
export function widgetSrc(b, { height = 180, range = "3M" } = {}) {
  const cfg = { symbol: b.tv, width: "100%", height, dateRange: range, colorTheme: "dark", isTransparent: true, autosize: false, largeChartUrl: "" };
  return `${TV_WIDGET_URL}?locale=en#${encodeURIComponent(JSON.stringify(cfg))}`;
}
export function quoteWidget(b, opts = {}) {
  const height = opts.height || 180;
  const box = document.createElement("div");
  box.className = "tradingview-widget-container bq-w";
  box.setAttribute("data-tv", b.tv);
  box.style.height = `${height}px`;
  const f = document.createElement("iframe");
  f.src = widgetSrc(b, opts);
  f.title = `${b.issuer || b.name} ${bondLabel(b)} — TradingView quote`;
  f.loading = "lazy";
  f.referrerPolicy = "strict-origin-when-cross-origin";
  f.setAttribute("scrolling", "no");
  f.setAttribute("allowtransparency", "true");
  box.appendChild(f);
  return box;
}

// One bond's caption under its widget: what the number is, and where it comes from.
export function quoteCaption(b) {
  const px = hasPx(b)
    ? `<span class="bq-px">Press price <span class="c-num">${esc(String(b.px.v))}</span> on ${esc(fmtD(b.px.asOf))} <a href="${esc(b.px.src)}" target="_blank" rel="noopener noreferrer">src</a></span> · `
    : "";
  const what = b.tv ? `delayed ${esc(venueOf(b))} exchange quote, not a composite price` : "no free live quote for this line";
  return `<p class="bq-cap">${px}${esc(b.issuer || "")} ${esc(bondLabel(b))} · ${esc(b.isin)} · ${what} · `
    + `<a href="${esc(b.src)}" target="_blank" rel="noopener noreferrer">TradingView</a></p>`;
}

// A block of quote widgets (borrower page / the hub's quote sheet).
export function mountQuotes(host, bonds, opts) {
  if (!host) return;
  host.textContent = "";
  for (const b of bonds) {
    const w = document.createElement("div");
    w.className = "bq";
    if (b.tv) w.appendChild(quoteWidget(b, opts));
    w.insertAdjacentHTML("beforeend", quoteCaption(b));
    host.appendChild(w);
  }
}
