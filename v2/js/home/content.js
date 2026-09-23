// Home (Glance) markup — the <main class="g-main"> block, extracted verbatim
// from index.html. The shell provides the header, so the inner #wire-header and
// Glance's own cmdk overlay (v2 uses palette.js) are omitted.
import { bandHTML } from "/v2/js/searchband.js?v=v2-3";
export const HOME_HTML = `    <main class="g-main tui" id="jump-top">
      ${bandHTML("Search…")}

      <div class="g-layout">
        <!-- Mobile-only segmented control: on phones the news wire and the
             manager (watchlist) wire can't sit side by side, so a chip pair at
             the very top swaps between them. Hidden on desktop, where both
             columns show at once. -->
        <div class="g-wiretabs" role="tablist" aria-label="Briefing, wire, chart or X">
          <!-- Market Briefing rides its own pane (default, always expanded — no
               collapse). News + Managers share the next tab: the lane (All · News ·
               Manager · Watchlist) is chosen from a dropdown (same style as the
               Menu → Chat chip). Rendered/wired by glance.js. -->
          <button type="button" class="g-wiretab is-on" data-wire="brief" role="tab" aria-selected="true">Briefing</button>
          <button type="button" class="g-wiretab g-wiretab-lane tchip-has-menu" data-wire="news" role="tab" aria-selected="false" aria-haspopup="menu" aria-expanded="false"><span class="g-wire-lanelbl">News</span><svg class="tchip-caret" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg></button>
          <div class="g-wire-lanemenu tchip-menu" id="g-wire-lanemenu" role="menu" hidden></div>
          <button type="button" class="g-wiretab" data-wire="chart" role="tab" aria-selected="false">Chart</button>
          <button type="button" class="g-wiretab" data-wire="x" role="tab" aria-selected="false">X Feed</button>
        </div>
        <!-- LEFT RAIL: markets + earnings, with Top movers filling the base -->
        <aside class="g-side">
          <section class="tui-pnl g-anchor" id="jump-markets">
            <header class="tui-ph"><span>Markets</span><span class="tui-px" id="g-mkt-meta">live</span></header>
            <div id="g-markets" class="rates-band markets-band" aria-label="Equity indices and ETFs">
              <div class="g-loading">Loading markets…</div>
            </div>
          </section>
          <!-- Top movers grows to fill the rail; only its list scrolls, so the
               panels around it stay put. Sits directly under Markets. -->
          <section class="tui-pnl g-movers-pnl">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/equities" data-godash="equities" title="Open Dashboard › Equities">Top movers</a><span class="tui-px">1D</span></header>
            <div id="g-movers" aria-label="Top market movers"><div class="g-loading">Loading movers…</div></div>
          </section>
          <!-- Strait of Hormuz — daily vessel transits vs the trailing 30-day
               average, from IMF PortWatch's AIS feed (a live geopolitical / oil
               chokepoint gauge). Sits under Top movers. -->
          <section class="tui-pnl g-anchor" id="jump-hormuz">
            <header class="tui-ph"><a class="g-ph-link" href="https://portwatch.imf.org/pages/chokepoint6" target="_blank" rel="noopener noreferrer" title="IMF PortWatch — Strait of Hormuz daily transits">Strait of Hormuz</a><span class="tui-px">transits · vs 30d</span></header>
            <div id="g-hormuz" class="rates-band" aria-label="Strait of Hormuz daily vessel transits versus the 30-day average">
              <div class="g-loading">Loading transits…</div>
            </div>
          </section>
          <!-- This week's corporate earnings — date · pre/post-market · forecast
               → outcome. Sits with the equities data (Markets / Top movers). Hugs
               its content (capped at 5 companies; the rest scroll internally). -->
          <div class="g-earn-scroll">
            <section class="tui-pnl g-earn">
              <header class="tui-ph g-earn-head"><a class="g-ph-link" href="/v2/dashboard/equities" data-godash="equities" title="Open the earnings calendar in Dashboard › Equities">This week's earnings</a><span class="tui-px">est → act</span></header>
              <div class="g-earn-body">
                <div id="g-earn" class="g-earn-pane" aria-label="This week's corporate earnings"><div class="g-loading">Loading earnings…</div></div>
              </div>
            </section>
          </div>
          <section class="tui-pnl g-anchor" id="jump-fx">
            <header class="tui-ph"><span>FX matrix</span><span class="tui-px">spot</span></header>
            <div id="g-fx" class="g-fx-card" aria-label="USD, GBP, EUR and JPY cross rates">
              <div class="g-loading">Loading FX…</div>
            </div>
          </section>
        </aside>

        <!-- HERO CHART BAND (Option C): a price/performance chart for the market
             basket. On desktop it spans the news + manager wire columns (the two
             flexible mid-panes), which start beneath it; on phones it is the
             swappable "Chart" pane in the wire-tab strip. The instrument chips and
             range toggle are rendered by glance.js (renderHero). -->
        <section class="g-hero g-anchor" id="jump-hero" aria-label="Price and performance chart">
          <header class="tui-ph g-hero-head"><span>Chart</span><span class="tui-px">performance</span></header>
          <!-- One unified securities row (rendered by glance.js): every instrument
               with its window change, a colour dot (filled = plotted, hollow = off);
               tapping toggles it on/off the chart. Doubles as the chart legend, so
               there is no separate chip selector to duplicate it. -->
          <div class="g-hero-sel" id="g-hero-sel" role="group" aria-label="Securities — tap to add or remove"></div>
          <div class="g-hero-range" id="g-hero-range" role="tablist" aria-label="Chart range">
            <button type="button" class="g-hero-rg" data-r="1D" role="tab">1D</button>
            <button type="button" class="g-hero-rg" data-r="5D" role="tab">5D</button>
            <button type="button" class="g-hero-rg is-on" data-r="1M" role="tab">1M</button>
            <button type="button" class="g-hero-rg" data-r="6M" role="tab">6M</button>
            <button type="button" class="g-hero-rg" data-r="1Y" role="tab">1Y</button>
            <button type="button" class="g-hero-rg" data-r="ALL" role="tab">ALL</button>
          </div>
          <div class="g-hero-plot">
            <div class="g-hero-canvas">
              <svg id="g-hero-svg" viewBox="0 0 900 150" preserveAspectRatio="none" role="img" aria-label="Price chart"><title>Price chart</title></svg>
              <div class="g-hero-tip" id="g-hero-tip" hidden></div>
            </div>
            <div class="g-hero-endlbls" id="g-hero-endlbls" aria-hidden="true"></div>
            <div class="g-hero-yaxis" id="g-hero-yaxis" aria-hidden="true"></div>
            <div class="g-hero-xaxis" id="g-hero-xaxis" aria-hidden="true"></div>
          </div>
          <!-- Related news for the six charted tickers, rendered by glance.js in the
               news-wire row format (real Yahoo Finance headlines via /api/hero-news).
               Shown on the phone/tablet Chart pane, where there is room beneath the
               chart; the desktop terminal already carries the full News column. -->
          <div class="g-hero-news" id="g-hero-news" aria-label="News for the charted securities"></div>
        </section>

        <!-- MARKET BRIEFING: on the desktop terminal this is its own quadrant (top-
             left of the 2×2 centre: Briefing · Chart over News · Managers). On phones
             it flows inside the News pane, beneath the filter row and above the feed
             (the feed-wrap is display:contents there so the briefing sits between the
             pinned filter and the live feed). Rendered by glance.js renderHomeBriefing
             from BRIEFINGS; collapsible. -->
        <div class="g-hbrief g-anchor" id="g-hbrief" aria-label="Market briefing" hidden></div>

        <!-- CENTER: news wire. The filter row leads (pinned under the chips); the
             feed's day-break marker sticks beneath the filter row on scroll. -->
        <section class="g-feed-wrap g-anchor" id="jump-feed">
          <!-- Top-level lane switch (desktop merged wire): All · News · Manager ·
               Watchlist. Rendered by glance.js renderWireLanes(); the desk/category
               sub-filters sit in #g-feed-head below, switching to match the lane. -->
          <div class="g-wire-lanes" id="g-wire-lanes" role="tablist" aria-label="Wire"></div>
          <div class="g-feed-head" id="g-feed-head">Today</div>
          <div class="g-feed wire-ptr-list" id="g-feed"><div class="g-loading">Loading today's news…</div></div>
        </section>

        <!-- MANAGER FEED: watchlist-first manager activity wire (its own column,
             separate from the aggregated news feed). Only its list scrolls. -->
        <aside class="g-side3">
          <!-- DESKTOP: reading pane — a clicked wire item opens here in reading mode;
               defaults to the top story of the day. Hidden on phones. -->
          <section class="tui-pnl g-read" id="g-read" aria-label="Reading pane">
            <div class="g-read-head"><span class="g-read-h-t">Reading pane</span><span class="g-read-h-x" id="g-read-badge"></span></div>
            <div class="g-read-body" id="g-readpane"><div class="g-loading">Loading top story…</div></div>
          </section>
          <!-- MOBILE watch tab: the manager activity wire. Hidden on desktop, where
               its content moves into the merged wire's Manager / Watchlist lanes. -->
          <div class="g-mw-scroll">
            <section class="tui-pnl g-mw">
              <div class="g-mw-head" id="g-mw-head"></div>
              <div class="g-mw-body">
                <div id="g-mgrwire" class="g-mw-pane" aria-label="Manager activity wire"><div class="g-loading">Loading managers…</div></div>
              </div>
            </section>
          </div>
        </aside>

        <!-- X WIRE: its own rail between the manager wire and the macro rail — a
             merged, newest-first live feed of the roster's public accounts (fetched
             server-side via /api/xfeed, drawn as our own cards). A pinned header row
             (matching the other panes) tops it; only the list scrolls. Like the
             manager wire, it stays on phones (it is content, not markets/rates data). -->
        <aside class="g-side-x">
          <div class="g-x-scroll">
            <section class="tui-pnl g-x g-anchor" id="jump-xwire">
              <header class="tui-ph g-x-head"><span>X feed</span><span class="tui-px">live</span></header>
              <div class="g-x-body">
                <div id="g-xwire" class="g-x-pane" aria-label="Live posts from tracked X accounts"><div class="g-loading">Loading X…</div></div>
              </div>
            </section>
          </div>
        </aside>

        <!-- RIGHT: macroeconomic data, macro read, cross-desk counts -->
        <aside class="g-side2">
          <!-- Order: Key rates → Spreads → Volatility → Yield curve → Policy rate
               (three separate market gauges lead; the central-bank read follows). -->
          <section class="tui-pnl g-anchor" id="jump-rates">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/fixed-income" data-godash="fixed-income" title="Open Dashboard › Fixed Income">Key rates</a><span class="tui-px">%</span></header>
            <div id="g-rates" class="rates-band" aria-label="Key benchmark rates and yields">
              <div class="g-loading">Loading market rates…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-spreads">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/credit" data-godash="credit" title="Open Dashboard › Credit">Spreads</a><span class="tui-px">bp</span></header>
            <div id="g-spreads" class="rates-band" aria-label="Credit spreads — OAS and quality/distress premia">
              <div class="g-loading">Loading spreads…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-vol">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/credit" data-godash="credit" title="Open Dashboard › Credit">Volatility</a><span class="tui-px">vol</span></header>
            <div id="g-vol" class="rates-band" aria-label="Equity and rate volatility">
              <div class="g-loading">Loading volatility…</div>
            </div>
          </section>
          <!-- Yield curve (the full economic-indicators grid lives on the Macro
               dashboard, /v2/macro/). -->
          <section class="tui-pnl g-anchor" id="jump-curve">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/macro" data-godash="macro" title="Open Dashboard › Macro">Yield curve</a><span class="tui-px">UST</span></header>
            <div id="g-curve" class="rates-band" aria-label="US Treasury yield curve and 2s10s slope">
              <div class="g-loading">Loading curve…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-macro">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/macro" data-godash="macro" title="Open Dashboard › Macro">Policy rate</a><span class="tui-px">US · UK</span></header>
            <div id="g-macro-snap" class="g-snap" aria-label="Policy rate snapshot">
              <div class="g-loading">Loading policy rate…</div>
            </div>
          </section>
          <!-- Prediction markets — finance & finance-adjacent implied odds
               (Polymarket). Only this list scrolls, so the macro data pinned
               above it never moves. -->
          <div class="g-flow-scroll">
            <section class="tui-pnl g-flow">
              <header class="tui-ph g-flow-head"><span>Prediction markets</span><span class="tui-px">'Yes' implied odds</span></header>
              <div class="g-flow-body">
                <div id="g-predict" class="g-flow-pane" aria-label="Prediction markets"><div class="g-loading">Loading prediction markets…</div></div>
              </div>
            </section>
          </div>
        </aside>
      </div>
      <!-- MOBILE reading pane: a full-screen terminal reader. Openly-readable wire
           rows open here in-app (fetched via /api/read); subscriber (padlocked) rows
           keep their native "open at the publisher" tap. Hidden on desktop, which
           uses the side reading pane. -->
      <div class="g-reader" id="g-reader" role="dialog" aria-label="Reader" hidden>
        <div class="g-reader-bar">
          <button type="button" class="g-reader-back" id="g-reader-back" aria-label="Back to the wire"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg><span>Wire</span></button>
          <span class="g-reader-src" id="g-reader-src"></span>
        </div>
        <div class="g-reader-body g-read-body" id="g-reader-body"><div class="g-loading">Loading…</div></div>
      </div>
    </main>`;
