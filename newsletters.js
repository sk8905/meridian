// =============================================================================
// Newsletters — the reader's own aggregated email newsletters, surfaced in the
// Home news feed under a "Newsletter" label.
//
// Source: newsletters forwarded (via a Gmail filter) to the connected mailbox
// skaidrive2@gmail.com — Bloomberg (Money Stuff etc.), The Economist, Legal
// Business, JP Morgan, Thomson Reuters, Mailbrew and others. They are pulled
// from Gmail through the connector, parsed, and written here as feed items.
// This list is regenerated on each refresh.
//
// We keep only the headline, a one-line topic summary, the publication/author
// and the newsletter's own "read online" link — never the full article body.
// This deployment sits behind Cloudflare Access (single reader), so the list is
// personal to it.
//
// PUBLISHERS maps a sender address/domain to a display name (used by the refresh
// routine); extend it as new newsletters are added.
export const PUBLISHERS = {
  "news.bloomberg.com": "Bloomberg",
  "e.economist.com": "The Economist",
  "legalbusiness.co.uk": "Legal Business",
  "pb.jpmorgan.com": "JP Morgan Private Bank",
  "mail.sailthru.com": "Thomson Reuters",
  "mailbrew.com": "Mailbrew",
  "cntraveller.com": "Condé Nast Traveller",
};

export const NEWSLETTERS = [
  {
    id: "nl-bbg-moneystuff-20260716",
    publication: "Bloomberg",
    author: "Matt Levine",
    series: "Money Stuff",
    title: "Money Stuff: Shorts Will Sell You SpaceX",
    date: "2026-07-16",
    time: "18:56",
    summary: "Leveraged ETFs, alpha, drugs, Truth.",
    url: "https://links.message.bloomberg.com/s/c/C97YKE6IMq_BNecJzfV3PxxRc_CwTUJSpnBymWcRArDGwTVQiq4OGkJRwfTNlnRTuQyHAqfu9YE7E-dACc_d6HE4c3i-YgGhZx3zUJiL3e1-JXaM3BWY8njsV8in19JrhpjNuhXP65zcdH1XJRWuCPvKxRYzzaesQ2ML-hT9k0QDnzDpAHIR4_w9Sd5v9ieMbeKkkzZSn9B2tydXFtKtybP5N0bJ4LZBg-Cooc_u8qHKqscv7CVNsLlFJvCrkcxi34BCMxxNR8DoWFGclc1pJzROlJ4o3K24qyLt_8VwcNUBA0zJvD35-SLd0Lk71u18iIOQqNLodxHxeWm1LgL1X6JXFtiVTRX6vaQGuwlbyLoV2IgeKn3E77UybA/ZE_9OokeD_IRqTlU2mP6qsFWMIHfTZg0/22",
  },
];
