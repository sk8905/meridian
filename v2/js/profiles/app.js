// Profiles — a cross-desk directory. It renders the EXACT same three lists that
// live under Credit (Managers, Hedge Funds) and Legal (Law firms) by borrowing
// those apps' own pane builders (via ctx.view → their control object), so there
// is one source per list and no second version. Three chips switch between them;
// a row opens that record's existing profile page in its home desk via the runtime.

export async function mount(host, ctx) {
  // Borrow Credit's and Legal's list builders (mounts them off-screen if needed).
  const [credit, legal] = await Promise.all([ctx.view("credit"), ctx.view("legal")]);
  const CHIPS = [["managers", "Managers"], ["hedgefunds", "Hedge Funds"], ["firms", "Law firms"]];
  host.innerHTML = `
    <div class="tdash">
      <div class="tdash-grid tdash-1">
        <section class="tcol tcol-c tcol-full">
          <header class="tpanel-h twire-head">
            <div class="tchips" id="pf-chips">${CHIPS
              .map(([k, l], i) => `<button type="button" class="tchip${i === 0 ? " is-on" : ""}" data-p="${k}">${l}</button>`).join("")}</div>
          </header>
          <div class="tpanes" id="pf-panes">
            ${credit.buildManagers()}
            ${credit.buildHedgeFunds()}
            ${legal.buildLawFirms()}
          </div>
        </section>
      </div>
    </div>`;
  const panes = host.querySelector("#pf-panes");
  const chips = host.querySelector("#pf-chips");
  const showPane = (p) => panes.querySelectorAll(".tpane").forEach((el) => { el.hidden = el.dataset.pane !== p; });
  showPane("managers");                                 // first chip active on open
  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".tchip"); if (!b) return;
    chips.querySelectorAll(".tchip").forEach((c) => c.classList.toggle("is-on", c === b));
    showPane(b.dataset.p);
  });
  // Each list's search box filters its rows in place by the row's data-name.
  // Scoped to this host so it never touches the desks' own (hidden) copies.
  host.addEventListener("input", (e) => {
    const inp = e.target.closest("#mgr-q, #hf-q, #lf-q"); if (!inp) return;
    const sel = inp.id === "mgr-q" ? "#mgr-rows tr" : inp.id === "hf-q" ? "#hf-rows tr" : "#lf-rows tr";
    const v = inp.value.toLowerCase().trim();
    host.querySelectorAll(sel).forEach((tr) => { tr.style.display = (!v || (tr.dataset.name || "").includes(v)) ? "" : "none"; });
  });
  // A row opens the record's existing profile page in its home desk. #/firm/… →
  // Legal, everything else (#/manager/…, #/hf/…) → Credit. Clicks on a cell's own
  // link (AUM source, 13F, SLS chip) open that link instead (defer to the anchor).
  host.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-href]");
    if (!row || e.target.closest("a")) return;
    const href = row.getAttribute("data-href");
    const tab = href.startsWith("#/firm/") ? "legal" : "credit";
    ctx.navigate(`${ctx.base}/${tab}/${href}`);
  });
  return { enter() {}, leave() {} };
}
