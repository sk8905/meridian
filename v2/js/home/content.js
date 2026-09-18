// Home (Glance) markup — the <main class="g-main"> block, extracted verbatim
// from index.html. The shell provides the header, so the inner #wire-header and
// Glance's own cmdk overlay (v2 uses palette.js) are omitted.
import { bandHTML } from "/v2/js/searchband.js?v=v2-2";
export const HOME_HTML = `    <main class="g-main tui" id="jump-top">
      ${bandHTML("Search…")}

      <div class="g-layout">
        <!-- Mobile-only segmented control: on phones the news wire and the
             manager (watchlist) wire can't sit side by side, so a chip pair at
             the very top swaps between them. Hidden on desktop, where both
             columns show at once. -->
        <div class="g-wiretabs" role="tablist" aria-label="News, managers, chart or X wire">
          <button type="button" class="g-wiretab is-on" data-wire="news" role="tab" aria-selected="true">News</button>
          <button type="button" class="g-wiretab" data-wire="watch" role="tab" aria-selected="false">Managers</button>
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
            <div class="g-hero-yaxis" id="g-hero-yaxis" aria-hidden="true"></div>
            <div class="g-hero-xaxis" id="g-hero-xaxis" aria-hidden="true"></div>
          </div>
          <!-- Related news for the six charted tickers, rendered by glance.js in the
               news-wire row format (real Yahoo Finance headlines via /api/hero-news).
               Shown on the phone/tablet Chart pane, where there is room beneath the
               chart; the desktop terminal already carries the full News column. -->
          <div class="g-hero-news" id="g-hero-news" aria-label="News for the charted securities"></div>
        </section>

        <!-- CENTER: news wire. The filter row leads (pinned under the chips), then
             the tri-daily market briefing (rendered by glance.js renderHomeBriefing
             from BRIEFINGS; collapsible) as the day's lede over the live feed; the
             feed's day-break marker sticks beneath the filter row on scroll. -->
        <section class="g-feed-wrap g-anchor" id="jump-feed">
          <div class="g-feed-head" id="g-feed-head">Today</div>
          <div class="g-hbrief" id="g-hbrief" aria-label="Market briefing" hidden></div>
          <div class="g-feed wire-ptr-list" id="g-feed"><div class="g-loading">Loading today's news…</div></div>
        </section>

        <!-- MANAGER FEED: watchlist-first manager activity wire (its own column,
             separate from the aggregated news feed). Only its list scrolls. -->
        <aside class="g-side3">
          <div class="g-mw-scroll">
            <section class="tui-pnl g-mw">
              <!-- No title row: the label-filter chips + Group-by-manager control
                   are rendered here by glance.js (renderManagerWire) as a desk row,
                   mirroring the news wire's fixed filter header. -->
              <div class="g-mw-head" id="g-mw-head"></div>
              <div class="g-mw-body">
                <div id="g-mgrwire" class="g-mw-pane" aria-label="Manager activity wire"><div class="g-loading">Loading managers…</div></div>
              </div>
            </section>
          </div>
        </aside>

        <!-- X WIRE: its own rail between the manager wire and the macro rail — a
             merged, newest-first live feed of the roster's public accounts (fetched
             server-side via /api/xfeed, drawn as our own cards). No title row (the
             X chip / rail is label enough) so posts start at the top. Only the list
             scrolls. Like the manager wire, it stays on phones (it is content, not
             the markets/rates data). -->
        <aside class="g-side-x">
          <div class="g-x-scroll">
            <section class="tui-pnl g-x g-anchor" id="jump-xwire">
              <div class="g-x-body">
                <div id="g-xwire" class="g-x-pane" aria-label="Live posts from tracked X accounts"><div class="g-loading">Loading X…</div></div>
              </div>
            </section>
          </div>
        </aside>

        <!-- RIGHT: macroeconomic data, macro read, cross-desk counts -->
        <aside class="g-side2">
          <section class="tui-pnl g-anchor" id="jump-macro">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/macro" data-godash="macro" title="Open Dashboard › Macro">Policy rate</a><span class="tui-px">US · UK</span></header>
            <div id="g-macro-snap" class="g-snap" aria-label="Policy rate snapshot">
              <div class="g-loading">Loading policy rate…</div>
            </div>
          </section>
          <!-- Yield curve sits directly beneath Policy rate (the full economic-
               indicators grid lives on the Macro dashboard, /v2/macro/). -->
          <section class="tui-pnl g-anchor" id="jump-curve">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/macro" data-godash="macro" title="Open Dashboard › Macro">Yield curve</a><span class="tui-px">UST</span></header>
            <div id="g-curve" class="rates-band" aria-label="US Treasury yield curve and 2s10s slope">
              <div class="g-loading">Loading curve…</div>
            </div>
          </section>
          <!-- Key rates & credit spreads and Volatility & risk sit with the macro /
               rates data they belong to. -->
          <section class="tui-pnl g-anchor" id="jump-rates">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/fixed-income" data-godash="fixed-income" title="Open Dashboard › Fixed Income">Key rates &amp; spreads</a><span class="tui-px">bp · %</span></header>
            <div id="g-rates" class="rates-band" aria-label="Key rates and credit spreads">
              <div class="g-loading">Loading market rates…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-vol">
            <header class="tui-ph"><a class="g-ph-link" href="/v2/dashboard/credit" data-godash="credit" title="Open Dashboard › Credit">Volatility &amp; risk</a><span class="tui-px">vol · spreads</span></header>
            <div id="g-vol" class="rates-band" aria-label="Equity volatility and credit risk spreads">
              <div class="g-loading">Loading risk…</div>
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
    </main>`;
