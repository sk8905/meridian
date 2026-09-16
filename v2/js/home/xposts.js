// X (Twitter) wire — a single, always-current, merged stream rendered LIVE by X's
// official widgets.js as a **List timeline**. We embed a public X List (the roster
// below); X serves each account's newest posts, newest-first, so the wire never
// goes stale and nothing is curated or stored here — the embed is the source.
//
// Maintenance is done ON X, not in code: add/remove accounts in the List, keep it
// PUBLIC (the widget only renders public Lists). The only thing pinned here is the
// List's numeric id. See HOUSE_STYLE R26 + refresh-routines.

export const X_ASOF = "2026-09-16";

// The embedded public X List. `id` is the numeric list id from its URL
// (x.com/i/lists/<id>); `url` is the human link used as the offline fallback.
export const X_LIST = {
  id: "2100283810713649423",
  url: "https://x.com/i/lists/2100283810713649423",
  name: "Wire",
};

// The accounts curated into the List (for reference / the HOUSE_STYLE roster). The
// wire renders the List, not this array — membership is managed on X.
export const X_ACCOUNTS = [
  { handle: "elerianm",       name: "Mohamed A. El-Erian", note: "Economist · Allianz / Queens' College" },
  { handle: "negligible_cap", name: "Negligible Capital",  note: "Long/short equity commentary" },
  { handle: "LeylaKuni",      name: "Leyla Kunimoto",      note: "Private markets, from the LP seat" },
  { handle: "lcdnews",        name: "LCD News",            note: "Leveraged loans & private credit · PitchBook" },
  { handle: "michaeljburry",  name: "Michael Burry",       note: "Scion Asset Management" },
  { handle: "RayDalio",       name: "Ray Dalio",           note: "Bridgewater founder" },
  { handle: "sindap",         name: "Sujeet Indap",        note: "Wall Street editor · Financial Times" },
  { handle: "ArashMassoudi",  name: "Arash Massoudi",      note: "Finance & markets editor · Financial Times" },
  { handle: "nishantkumar07", name: "Nishant Kumar",       note: "Hedge funds · Bloomberg" },
];
