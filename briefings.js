// =============================================================================
// briefings.js — the AI market briefing surfaced at the head of the Home News
// wire (v2/js/home/glance.js renderHomeBriefing). Only the LATEST (freshest-
// stamped) slot is shown — there is no header button and no slot selector.
//
// GENERATION (see docs/refresh-routines.md): these are written by the 5×/day
// refresh routine, NOT at runtime. Three rolling slots are kept as the store;
// each run regenerates whichever slot the clock is in (morning < 12:00 · afternoon
// 12:00–17:00 · evening ≥ 17:00 BST) and restamps it, so the freshest slot — the
// one the reader sees — is renewed on every run (up to 5× a day).
//
// DESK FOCUS: the briefings cover the three MARKET desks — Macro, Equities and
// Fixed income — and ONLY those (no Credit or Legal; those have their own
// surfaces). Every slot touches all three, and each bullet's <strong> lead is
// tagged with its desk. The first four bullets are the ones the Home card renders
// (HB_MAX_BULLETS — one iPhone screen), so they carry the three-desk spread.
// ONE CONTINUOUS ITEM PER DESK: the card groups bullets by their desk lead, and a
// desk that carries two stories (e.g. two Macro items) is ALWAYS combined into a
// SINGLE continuous item — one "Macro" kicker, the two stories folded into one
// flowing run of prose, and both sources on one trailing line — never stacked as
// separate sub-bullets and never a repeated kicker. Author each item with its own
// desk lead and source as usual; the render strips the follow-on's kicker,
// re-capitalises its lead and folds it in, so each story should stand as its own
// self-contained sentence that reads cleanly when run on after the one before it.
// Equities & Fixed income bullets LEAD WITH THE MOVE AND ITS DRIVER — the index
// or yield change, then the specific catalyst behind it (a stock, a data print,
// an issuance event) — not a standing description.
//
// GROUNDING (HOUSE_STYLE / non-negotiables): a briefing is a SUMMARY of items
// Wire already holds — every bullet carries a real `src` URL to the wire/desk item
// it compresses. No invented figures, no uncited claims. A thin news slot gets a
// short briefing, never padding. Both the `lede` and each bullet `html` are
// authored, trusted HTML (entities like &pound;/&mdash; render). Served no-cache +
// tokenless (see _headers), so a routine refresh is picked up without a code token
// bump (HOUSE_STYLE T1). The lede is a TOP-LINE SYNTHESIS of the day's arc — it must
// NOT restate the bullets: no bullet's lead sentence or specific claim is repeated
// verbatim in the lede. Keep it tight (the card shows it in full).
// =============================================================================
export const BRIEFINGS = {
  tz: "BST",
  // Ordered for the slot chips; the view picks the current slot by clock.
  order: ["morning", "afternoon", "evening"],
  slots: {
    morning: {
      label: "Morning",
      date: "2026-10-05",
      time: "05:14 BST",
      bullets: [
        { html: "<strong>Macro &mdash; Why a booming economy is not helping Trump</strong>, the FT asks, as strong US growth fails to lift the president's standing; Friday's payrolls print showed just 29,000 jobs added in September.", src: "https://www.ft.com/content/8f4525eb-ce7c-4323-9dda-698aa1e8521a", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; UK banks are expected to lobby Chancellor Healey for a cut to capital rules</strong>, a senior MP tells the FT, ahead of the 28 October Budget.", src: "https://www.ft.com/content/6296da53-a9e3-4441-ae6d-f579b3c1b414", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT asks what can revive the battered government bond market</strong> after the sell-off that took 10-year Treasury yields to their highest since 2002.", src: "https://www.ft.com/content/1a94931f-421e-4d0e-888a-7727f15c3d5f", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; global pension funds are cutting US equity exposure over AI concentration risk</strong>, the FT reports, while Wall Street's IPO fervour cools on tepid demand and valuation worries.", src: "https://www.ft.com/content/18e475be-1012-43e9-a0ff-ef0181b772ad", srcName: "Financial Times" },
      ],
    },
    afternoon: {
      label: "Afternoon",
      date: "2026-10-04",
      time: "14:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the US economy added just 29,000 jobs in September</strong> as hiring slowed sharply, the FT reports, and the weak print is likely to keep Fed rate setters on the sidelines in October.", src: "https://www.ft.com/content/7fc80097-1926-4306-81e0-83d90a3d8a1d", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the FT's Sunday opinion asks &ldquo;The US is looking more like Italy&rdquo;</strong> as the global bond sell-off keeps fiscal and debt-sustainability worries in focus.", src: "https://www.ft.com/content/a2711e64-145b-4df6-baf7-56a3da7ed0b0", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT asks what can revive the battered government bond market</strong> after a sell-off that pushed 10-year Treasury yields to their highest since 2002.", src: "https://www.ft.com/content/1a94931f-421e-4d0e-888a-7727f15c3d5f", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; rising gilt yields are attracting UK retail investors</strong> hunting for tax-efficient assets, the FT reports.", src: "https://www.ft.com/content/17a502a2-f8cb-4d79-996e-f2c7018585de", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; Wall Street's IPO fervour is cooling</strong> on tepid demand and valuation worries, the FT reports, while investors look to shelter portfolios from rising AI concentration risks after Friday's rally on the soft jobs print.", src: "https://www.ft.com/content/b8924d77-364b-46c1-b783-5db73a91f351", srcName: "Financial Times" },
      ],
    },
    evening: {
      label: "Evening",
      date: "2026-10-05",
      time: "00:15 BST",
      bullets: [
        { html: "<strong>Macro &mdash; the FT's Sunday opinion asks &ldquo;The US is looking more like Italy&rdquo;</strong>, while September payrolls of just 29,000 jobs point to a Fed hold in October.", src: "https://www.ft.com/content/a2711e64-145b-4df6-baf7-56a3da7ed0b0", srcName: "Financial Times" },
        { html: "<strong>Macro &mdash; the FT argues Britain's Budget needs to tame spending and boost growth</strong>, as chancellor Healey is expected to deliver a &ldquo;breathing space&rdquo; statement.", src: "https://www.ft.com/content/dfa07e3f-5557-46ba-8128-72f43aa6558d", srcName: "Financial Times" },
        { html: "<strong>Fixed income &mdash; the FT asks what can revive the battered government bond market</strong> after the global sell-off, while rising gilt yields draw UK retail investors seeking tax-efficient assets.", src: "https://www.ft.com/content/1a94931f-421e-4d0e-888a-7727f15c3d5f", srcName: "Financial Times" },
        { html: "<strong>Equities &mdash; the FT reports the boss of Japan's biggest trading house warning that the bull run for Japan stocks is at risk</strong>, while a dealmaking slowdown threatens an early end to the M&amp;A boom even as Schneider Electric nears a $20bn deal to buy industrial software group PTC.", src: "https://www.ft.com/content/1fdb8380-2fac-474a-a184-616c0a29feb6", srcName: "Financial Times" },
      ],
    },
  },
};
