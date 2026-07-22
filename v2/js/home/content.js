// Home (Glance) markup — the <main class="g-main"> block, extracted verbatim
// from index.html. The shell provides the header, so the inner #wire-header and
// Glance's own cmdk overlay (v2 uses palette.js) are omitted.
export const HOME_HTML = `    <main class="g-main tui" id="jump-top">

      <div class="g-layout">
        <!-- LEFT RAIL: markets / rates data, with Top movers filling the base -->
        <aside class="g-side">
          <section class="tui-pnl g-anchor" id="jump-markets">
            <header class="tui-ph g-mkt-head">
              <span class="g-mkt-tabs" role="tablist" aria-label="Markets or portfolio">
                <button type="button" class="g-mkt-tab is-on" data-k="markets" role="tab">Markets</button>
                <button type="button" class="g-mkt-tab" data-k="portfolio" role="tab">Portfolio</button>
              </span>
              <span class="tui-px" id="g-mkt-meta">live</span>
            </header>
            <div id="g-markets" class="rates-band markets-band" aria-label="Equity indices and ETFs">
              <div class="g-loading">Loading markets…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-rates">
            <header class="tui-ph"><span>Key rates &amp; spreads</span><span class="tui-px">bp · %</span></header>
            <div id="g-rates" class="rates-band" aria-label="Key rates and credit spreads">
              <div class="g-loading">Loading market rates…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-vol">
            <header class="tui-ph"><span>Volatility &amp; risk</span><span class="tui-px">vol · spreads</span></header>
            <div id="g-vol" class="rates-band" aria-label="Equity volatility and credit risk spreads">
              <div class="g-loading">Loading risk…</div>
            </div>
          </section>
          <!-- Top movers grows to fill the rail; only its list scrolls, so the
               data panels around it stay put. -->
          <section class="tui-pnl g-movers-pnl">
            <header class="tui-ph"><span>Top movers</span><span class="tui-px">1D</span></header>
            <div id="g-movers" aria-label="Top market movers"><div class="g-loading">Loading movers…</div></div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-fx">
            <header class="tui-ph"><span>FX matrix</span><span class="tui-px">spot</span></header>
            <div id="g-fx" class="g-fx-card" aria-label="USD, GBP, EUR and JPY cross rates">
              <div class="g-loading">Loading FX…</div>
            </div>
          </section>
        </aside>

        <!-- CENTER: news wire -->
        <section class="g-feed-wrap g-anchor" id="jump-feed">
          <div class="g-feed-head" id="g-feed-head">Today</div>
          <div class="g-feed" id="g-feed"><div class="g-loading">Loading today's news…</div></div>
        </section>

        <!-- RIGHT: macroeconomic data, macro read, cross-desk counts -->
        <aside class="g-side2">
          <section class="tui-pnl g-anchor" id="jump-macro">
            <header class="tui-ph"><span>Policy rate</span><span class="tui-px">US · UK</span></header>
            <div id="g-macro-snap" class="g-snap" aria-label="Policy rate snapshot">
              <div class="g-loading">Loading policy rate…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-indicators">
            <header class="tui-ph"><span>Economic indicators</span><span class="tui-px">US · UK</span></header>
            <div id="g-indicators" class="rates-band" aria-label="Key macroeconomic indicators">
              <div class="g-loading">Loading indicators…</div>
            </div>
          </section>
          <section class="tui-pnl g-anchor" id="jump-curve">
            <header class="tui-ph"><span>Yield curve</span><span class="tui-px">UST</span></header>
            <div id="g-curve" class="rates-band" aria-label="US Treasury yield curve and 2s10s slope">
              <div class="g-loading">Loading curve…</div>
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
