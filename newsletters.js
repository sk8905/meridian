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
    id: "nl-bbg-economicsdaily-20260720",
    publication: "Bloomberg",
    author: "Tom Rees",
    series: "Economics Daily",
    title: "Economics Daily: Growth gamble",
    date: "2026-07-20",
    time: "12:00",
    summary: "Burnham faces a tough economic inheritance with tepid growth rates and a lingering inflation problem.",
    url: "https://www.bloomberg.com/news/newsletters/2026-07-20/uk-latest-andy-burnham-s-growth-gamble-starts-today",
  },
  {
    id: "nl-bbg-marketsdaily-20260720",
    publication: "Bloomberg",
    series: "Markets Daily",
    title: "Markets Daily: Prove it, Big Tech",
    date: "2026-07-20",
    time: "11:05",
    summary: "Big Tech needs to prove that AI spending is going somewhere; plus, new private asset alchemy.",
    url: "https://www.bloomberg.com/news/newsletters/2026-07-20/big-tech-needs-to-prove-that-ai-spending-is-going-somewhere",
  },
  {
    id: "nl-bbg-morningbriefingeurope-20260720",
    publication: "Bloomberg",
    author: "Victoria Batchelor",
    series: "Morning Briefing Europe",
    title: "Escalating attacks",
    date: "2026-07-20",
    time: "07:21",
    summary: "Oil pushes higher as US-Iran attacks escalate, Spain wins the World Cup, and Andy Burnham takes over as UK prime minister.",
    url: "https://www.bloomberg.com/news/newsletters/2026-07-20/us-strikes-iran-in-escalating-campaign-after-troops-killed",
  },
  {
    id: "nl-econ-worldinbrief-20260720",
    publication: "The Economist",
    series: "The World in Brief",
    title: "The World in Brief: America launches ninth round of strikes",
    date: "2026-07-20",
    time: "06:40",
    summary: "US launches its ninth round of strikes on Iran as Brent crosses $90 a barrel; Spain beats Argentina to win the World Cup.",
    url: "https://www.economist.com/the-world-in-brief",
  },
  {
    id: "nl-bbg-pointsofreturn-20260720",
    publication: "Bloomberg",
    author: "John Authers",
    series: "Points of Return",
    title: "How the market broadened and nobody noticed",
    date: "2026-07-20",
    time: "05:01",
    summary: "Earnings season gets going amid escalating Iran-US hostilities and Brent above $90; the real Q2 story is quietly broadening market breadth.",
    url: "https://bloom.bg/4prWQW6",
  },
  {
    id: "nl-bbg-thebrink-20260718",
    publication: "Bloomberg",
    author: "Angélica Serrano-Román",
    series: "The Brink",
    title: "The Brink: Bankruptcy tourism",
    date: "2026-07-18",
    time: "16:00",
    summary: "Distressed US companies are finding a British way to bypass Chapter 11.",
    url: "https://www.bloomberg.com/news/newsletters/2026-07-18/distressed-us-companies-find-a-british-detour-around-chapter-11",
  },
  {
    id: "nl-econ-worldinbrief-20260718",
    publication: "The Economist",
    series: "The World in Brief",
    title: "The World in Brief: Global stocks sink",
    date: "2026-07-18",
    time: "05:40",
    summary: "Chip selloff sinks global stocks; Apple briefly overtakes Nvidia.",
    url: "https://www.economist.com/the-world-in-brief",
  },
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
