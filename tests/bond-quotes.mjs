// Listed-bond quotes for the stressed names (CR_BONDS, v2/js/bonds.js). The data is
// TradingView's own record of each issue, so every row must be internally sound — a
// real ISIN (valid check digit), a stressed name, a widget venue TradingView's free
// widget can quote (never LSE / LuxSE / FINRA, which show "only available on
// TradingView"), its symbol page as source, and any press price dated + sourced.
// The Restructuring hub lists every line; "Quote" opens a sheet holding TradingView's
// widget embed for that symbol, captioned as a delayed exchange quote; a press-only line
// shows its dated price instead. The borrower page carries the same widgets. The embed
// markup is what's checked (the third-party frame's content is not).
import { serve, launchChromium, open, PHONE, DESKTOP, check, checkEq, checkErrs, finish } from "./lib.mjs";
import { CR_BONDS, CR_STRESS } from "../dashboard/js/data.js";

// ---- data integrity ------------------------------------------------------------------
const isinOk = (s) => {
  if (!/^[A-Z]{2}[A-Z0-9]{9}\d$/.test(s)) return false;
  const digits = s.slice(0, 11).split("").map((c) => (/\d/.test(c) ? c : String(c.charCodeAt(0) - 55))).join("");
  let sum = 0;
  [...digits].reverse().forEach((d, i) => { let n = +d; if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; } sum += n; });
  return (10 - (sum % 10)) % 10 === +s[11];
};
const names = new Set(CR_STRESS.map((s) => s.name));
const DATE = /^\d{4}-\d{2}-\d{2}$/;
// A widget line needs its ISIN + TradingView record; a press-only line (owner 2026-10-16:
// keep press prices where that's all there is) needs a dated, sourced price, and an ISIN
// or the article's own description of the bond.
const pxOk = (p) => p && (typeof p.v === "number" || (typeof p.text === "string" && p.text)) && (DATE.test(p.asOf) || /^\d{4}-\d{2}$/.test(p.asOf))
  && /^https:\/\//.test(p.src) && p.quote && p.outlet;
const bad = CR_BONDS.filter((b) => !(
  names.has(b.name) && (b.isin == null ? !b.tv && b.bond : isinOk(b.isin)) && (b.issuer || b.bond)
  && (b.coupon == null || typeof b.coupon === "number")
  && (b.maturity === null || DATE.test(b.maturity) || /^\d{4}$/.test(b.maturity)) && DATE.test(b.checked)
  && (b.tv === null || /^(TRADEGATE|GETTEX|FWB|MUN|DUS|HAM|HAN):[A-Z0-9]+$/.test(b.tv))
  && (b.src == null ? !b.tv : /^https:\/\/www\.tradingview\.com\/symbols\/[A-Z]+-[A-Z0-9]+\/$/.test(b.src))
  && (!b.tv || b.src === `https://www.tradingview.com/symbols/${b.tv.replace(":", "-")}/`)
  && (b.px === null || pxOk(b.px))
  && (b.tv || b.px)));
check(CR_BONDS.length >= 10, `CR_BONDS maps the stressed names' listed bonds (${CR_BONDS.length})`);
check(!bad.length, `every bond line is sound: stressed name, valid ISIN, widget venue, TradingView source, dated press price (bad: ${bad.map((b) => b.isin || b.bond).join(", ")})`);
checkEq(new Set(CR_BONDS.map((b) => b.isin || `${b.name}|${b.bond}`)).size, CR_BONDS.length, "no bond listed twice");
check(!CR_BONDS.some((b) => b.tv && b.maturity && b.maturity <= b.checked), "no matured issue carries a live quote");
check(isinOk("XS2576550326") && !isinOk("XS2576550327"), "ISIN check-digit test itself works");

const srv = await serve();
const base = `http://localhost:${srv.port}`;
const b = await launchChromium();
const listed = CR_BONDS.length;
const pressOnly = CR_BONDS.find((x) => !x.tv && x.px && x.isin);

// ---- Restructuring hub: the bonds card + quote sheet ------------------------------------
for (const [name, dev] of [["phone", PHONE], ["desktop", DESKTOP]]) {
  const { ctx, pg, errs } = await open(b, dev, `${base}/v2/restructuring/`);
  await pg.waitForSelector("#rxh-bonds .rxh-bond", { timeout: 15000 });
  const r = await pg.evaluate(() => {
    const rows = [...document.querySelectorAll("#rxh-bonds .rxh-bond")];
    return {
      rows: rows.length,
      hrefs: rows.map((li) => li.querySelector("a.rxh-co").getAttribute("href")),
      srcs: rows.map((li) => (li.querySelector(".c-src a") || {}).href || ""),
      lead: rows.map((li) => li.querySelector(".c-date").textContent),
      stressMeta: [...document.querySelectorAll("#rxh-stress .rxh-i")].some((li) => /\d listed bonds?/.test(li.textContent)),
      pressMeta: rows.filter((li) => li.querySelector(".rxh-q").textContent === "Press").map((li) => li.querySelector(".g-ev-m").textContent),
      sub: document.querySelector(".rxh-sub").textContent,
      hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });
  checkEq(r.rows, listed, `${name}: the bonds card lists every mapped line (incl. behind See all)`);
  check(r.hrefs.every((h) => /^\/v2\/profiles\/#\/co\/[^/]+$/.test(h)), `${name}: each bond row opens its borrower page`);
  const press = new Set(CR_BONDS.filter((x) => !x.src).map((x) => x.px.src));
  check(r.srcs.every((s) => /^https:\/\/www\.tradingview\.com\/symbols\//.test(s) || press.has(s)), `${name}: each bond row's source is its TradingView symbol page (or, with no ISIN, the press article)`);
  check(r.lead.every((d) => /^([A-Z][a-z]{2} \d{4}|\d{4}|Perp|—)$/.test(d)), `${name}: rows lead with the maturity (${r.lead.slice(0, 3).join(" / ")})`);
  check(r.stressMeta, `${name}: stress rows note their listed bonds`);
  check(r.pressMeta.length > 0 && r.pressMeta.every((m) => /^press \S+ \((\d{1,2} [A-Z][a-z]{2} \d{2}|[A-Z][a-z]{2} \d{4})\)/.test(m)), `${name}: press-priced rows lead line 2 with "press <price> (date)" (${r.pressMeta[0]})`);
  check(new RegExp(`${listed} listed bonds`).test(r.sub), `${name}: hub header counts the listed bonds (${r.sub})`);
  check(!r.hscroll, `${name}: no horizontal page scroll`);

  // Quote → sheet with TradingView's Mini Symbol Overview frame for that symbol.
  await pg.click("#rxh-bonds .rxh-bond .rxh-q");
  await pg.waitForSelector(".rxh-qsheet .bq-w", { timeout: 5000 });
  const q = await pg.evaluate(() => {
    const sh = document.querySelector(".rxh-qsheet");
    const w = sh.querySelector(".bq-w");
    const f = w.querySelector("iframe");
    let cfg = {}; try { cfg = JSON.parse(decodeURIComponent(f.src.split("#")[1])); } catch { /* */ }
    return { tv: w.getAttribute("data-tv"), js: f.src.split("#")[0], cfg, title: f.title, cap: sh.querySelector(".bq-cap").textContent, tvLink: (sh.querySelector(".bq-cap a[href*='tradingview.com/symbols']") || {}).href || "", n: sh.querySelectorAll(".bq").length };
  });
  check(/^(TRADEGATE|GETTEX|FWB|MUN|DUS|HAM|HAN):/.test(q.tv) && q.cfg.symbol === q.tv, `${name}: Quote opens the widget for the bond's symbol (${q.tv})`);
  checkEq(q.js, "https://www.tradingview-widget.com/embed-widget/mini-symbol-overview/?locale=en", `${name}: the widget is TradingView's Mini Symbol Overview frame (no third-party script in the page)`);
  check(/TradingView quote$/.test(q.title), `${name}: the widget frame carries a title (a11y)`);
  check(q.cfg.colorTheme === "dark" && q.cfg.isTransparent === true, `${name}: widget follows the dark theme on the card surface`);
  check(/delayed .* exchange quote, not a composite price/.test(q.cap) && q.tvLink, `${name}: caption says what the number is and links TradingView ("${q.cap.slice(0, 80)}")`);
  await pg.click(".rxh-qsheet .dsh-sheet-x");
  check(!(await pg.$(".rxh-qsheet")), `${name}: the quote sheet closes`);

  // A press-only line: no widget, the dated price with its source.
  if (pressOnly) {
    await pg.click("#rxh-bonds .dsh-seeall").catch(() => {});
    const sel = `.rxh-q[data-bq="${pressOnly.isin}"]`;
    await pg.click(`.dsh-sheet ${sel}`).catch(() => pg.click(`#rxh-bonds ${sel}`));
    await pg.waitForSelector(".rxh-qsheet .bq", { timeout: 5000 });
    const p = await pg.evaluate((isin) => {
      const first = document.querySelector(".rxh-qsheet .bq");
      return { widget: !!first.querySelector(".bq-w"), text: first.textContent, src: (first.querySelector(".bq-px a") || {}).href || "", isin };
    }, pressOnly.isin);
    check(!p.widget && p.text.includes(String(pressOnly.px.v != null ? pressOnly.px.v : pressOnly.px.text)) && p.src === pressOnly.px.src && /no free live quote/.test(p.text), `${name}: a press-only line shows its sourced price and no widget`);
    check(/Press price \S+ \(\d{1,2} [A-Z][a-z]{2} \d{2}\)/.test(p.text), `${name}: the press price carries its as-of date as "(date)" ("${p.text.slice(0, 40)}")`);
    await pg.click(".rxh-qsheet .dsh-sheet-x");
  }
  checkErrs(errs, `restructuring hub bonds (${name})`);
  await ctx.close();
}

// ---- Borrower page: the same widgets; none for a name with no listed bond --------------
{
  const tw = CR_BONDS.filter((x) => x.name === "Thames Water" && x.tv).length;
  const { ctx, pg, errs } = await open(b, PHONE, `${base}/v2/profiles/#/co/Thames%20Water`);
  await pg.waitForSelector("#co-bonds .bq-w", { timeout: 15000 });
  const r = await pg.evaluate(() => ({
    n: document.querySelectorAll("#co-bonds .bq-w").length,
    head: [...document.querySelectorAll("#pf-detail .tpg-h")].map((h) => h.textContent).find((t) => /Listed bonds/.test(t)) || "",
    hscroll: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  }));
  checkEq(r.n, tw, "borrower page: one quote widget per Thames Water line");
  check(/Listed bonds — quotes/.test(r.head), "borrower page: Listed bonds section");
  check(!r.hscroll, "borrower page with widgets: no horizontal scroll");
  await pg.goto(`${base}/v2/profiles/#/co/Galeria`);
  await pg.waitForFunction(() => /legal record/.test((document.querySelector("#pf-detail .tdet-sub") || {}).textContent || ""), null, { timeout: 15000 });
  check(!(await pg.$("#co-bonds")), "borrower page: no bonds section for a name with no listed bond");
  checkErrs(errs, "borrower page bonds");
  await ctx.close();
}
await b.close(); srv.close();
finish();
