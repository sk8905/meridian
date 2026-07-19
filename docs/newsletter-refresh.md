# Newsletter refresh runbook

A step for the scheduled 5×/day refresh routines: pull the reader's forwarded
email newsletters from Gmail and fold them into the Home news feed as `LETTER`
items. Self-contained — an agent run can follow this end-to-end.

Also includes the **myFT pull** (§6): the reader's personalised Financial Times
followed-topics RSS feed, folded into the Home feed as `FT` items.

**Prerequisite:** the run must have the **Gmail connector** enabled and pointed at
`skaidrive2@gmail.com` (the mailbox the newsletters forward into). If the Gmail
tools aren't available in the run, skip this step and leave `newsletters.js`
unchanged — do not blank it out.

## 1. Find newsletters received since the last pull

Newsletters reach the mailbox two ways, and BOTH searches must run every time —
Gmail auto-forwarding preserves the ORIGINAL sender, so a from:stevedkennedy
search alone misses every auto-forwarded newsletter (this is exactly how an
Economist issue was missed on 2026-07-18):

1. Manual forwards (sender = stevedkennedy; original sender is in the body's
   `From:` line):

   ```
   in:anywhere from:stevedkennedy@gmail.com newer_than:2d
   ```

2. Auto-forwarded copies (sender = the publisher; the To: header still shows
   stevedkennedy — that's normal). Build the from-list from the `PUBLISHERS`
   map in `newsletters.js`:

   ```
   in:anywhere {from:news.bloomberg.com from:e.economist.com from:legalbusiness.co.uk from:pb.jpmorgan.com from:mail.sailthru.com from:mailbrew.com from:cntraveller.com} newer_than:2d
   ```

3. Catch-all sweep for NEW senders (self-healing). Everything delivered to the
   mailbox, whatever its labels/folder:

   ```
   in:anywhere deliveredto:skaidrive2@gmail.com newer_than:2d
   ```

   Ignore system/admin mail (google.com / workspace senders, forwarding
   confirmations). Anything that reads as an email newsletter from a sender NOT
   yet in `PUBLISHERS` is a newly-added subscription: ADD its sender domain →
   publication name to the `PUBLISHERS` map in `newsletters.js`, then parse it
   like any other newsletter. This keeps the pull complete when the reader
   subscribes to (or auto-forwards) something new without telling anyone.

Parsing note for auto-forwarded copies: there is no "Begin forwarded message"
wrapper — the message's own headers ARE the original (sender domain →
publication via `PUBLISHERS`; `Date:` = original send time). If a newsletter's
links are all click-tracking redirects (e.g. click.e.economist.com), use the
newsletter's canonical web page instead (e.g.
https://www.economist.com/the-world-in-brief).

## 2. Parse each message

Fetch the full message. Newsletter emails are large HTML — extract, don't dump:

- **publication / author** — from the forwarded `From:` line (e.g.
  `Matt Levine <noreply@news.bloomberg.com>` → author "Matt Levine",
  publication "Bloomberg" via `PUBLISHERS`). Bloomberg "Money Stuff" etc. → set
  `series`.
- **title** — the subject with a leading `Fwd:` / `Re:` stripped.
- **date / time** — the original send time from the forwarded `Date:` header,
  as `YYYY-MM-DD` + `HH:MM` (24h).
- **url** — the newsletter's own "View in browser" / "Read online" link
  (`href` of the anchor whose text is "View in browser"). Store that exact URL.
- **summary** — ONE short line: the newsletter's own topic subhead / lead
  sentence (e.g. Money Stuff's "Leveraged ETFs, alpha, drugs, Truth."). Keep it
  to a phrase — **do not** copy article body paragraphs.

## 3. Update `/newsletters.js`

Prepend new items to the `NEWSLETTERS` array. Schema per item:

```js
{ id, publication, author, series, title, date, time, summary, url }
```

- `id`: stable slug, `nl-<pub>-<slug>-<YYYYMMDD>` (e.g. `nl-bbg-moneystuff-20260716`).
- **Dedupe** on `id` (and on `url`) — never add a message already present.
- Keep the most recent **~40** items; drop older ones (the feed backfills by date).
- Store only headline + one-line summary + link. No full article text (copyright +
  personal-data hygiene; this deployment is single-reader behind Access).

No token bump needed — `newsletters.js` is served `Cache-Control: no-cache`
(see `_headers`), so the change ships on its own. `glance.js` already renders
`NEWSLETTERS` into the feed under the `LETTER` label (`_deskClass.n` / `DESK.n`).

## 4. Commit & deploy

Standard flow used by the other refresh commits:

```
git add newsletters.js glance.js
git commit -m "Newsletter refresh: <N> new (<publications>)"
git push -u origin claude/pensive-pasteur-ohak8x
git fetch origin main -q && git rebase origin/main
git push origin claude/pensive-pasteur-ohak8x:main
```

If no new newsletters were found, make no commit.

## 5. Delete the processed emails from the inbox

**Only after step 4 has committed & pushed successfully** — never delete before
the information is safely persisted — remove each email that was added this run
from the skaidrive2 inbox, using the Gmail connector:

- `apply_sensitive_message_label(messageId, labelOption: "TRASH")` on each
  processed message (or `apply_sensitive_thread_label(threadId, "TRASH")` for the
  whole forwarded thread).

Notes:
- This moves the email to **Trash**, which Gmail **permanently purges after ~30
  days**. The connector has no immediate hard-delete / empty-trash capability, so
  30-day auto-purge is the permanent-deletion mechanism (and gives a recovery
  window if a parse was wrong).
- Only ever trash a message whose data made it into `newsletters.js` **and** was
  committed. If a message failed to parse or wasn't added, leave it in the inbox
  so the next run can retry it.
- Also sweep stragglers: if a search result dedupes as **already present** in the
  committed `newsletters.js` (a previous run parsed it but couldn't trash it),
  trash it now — an inbox message whose data is committed should never linger.
- These are disposable forwarded copies in the ingestion inbox; the originals
  remain in the source mailbox (stevedkennedy), so trashing here is safe.

## 6. myFT pull (Financial Times followed topics)

Independent of Gmail — do this every run, even when the Gmail step is skipped.

**Prerequisite:** the run's environment network policy must allow `www.ft.com`.
If the fetch fails (403 / blocked / timeout), skip this step and leave `ft.js`
unchanged — never blank it out on a failed fetch.

1. Fetch the reader's myFT RSS feed:

   ```
   curl -sSL "https://www.ft.com/myft/following/601965b2-62d0-47e1-88cf-576ebc8a8a2e.rss"
   ```

2. Parse each RSS `<item>`:
   - `title` — the headline, exactly as published (decode XML entities).
   - `url` — the `<link>`, with tracking query params stripped
     (keep only the canonical `https://www.ft.com/content/<uuid>` form when
     that's what the link resolves to).
   - `id` — the `<guid>` if present, else the cleaned URL.
   - `date` / `time` — from `<pubDate>`, converted to **Europe/London**, as
     `YYYY-MM-DD` + `HH:MM` (24h).

3. **Lifestyle screen (required).** KEEP EVERY story — news, business,
   politics, geopolitics, sport — EXCEPT lifestyle: arts, culture,
   film/TV/music, travel, dining, fashion, obituaries and general-interest
   features.
   Mirror the live feed's soft screen in `src/index.js` (`FEED_LIFESTYLE_RE`
   rejects; a headline also matching `FEED_MACRO_RE`/`FEED_MEGACAP_RE` is
   rescued — business-of-culture stories stay).

4. Update `/ft.js`: regenerate the `FT_ITEMS` array — dedupe by `id` against the
   existing entries, newest first, keep the most recent **~40** that pass the
   screen. Headline, date, time and URL only — never article body text
   (paywalled content).

5. No token bump needed — `ft.js` is served `Cache-Control: no-cache` (see
   `_headers`), so the change ships on its own. `glance.js` already renders
   `FT_ITEMS` into the Home "All" feed under the `FT` label (`_deskClass.f` /
   `DESK.f`); no other file needs editing.

6. Commit `ft.js` + `glance.js` in the same refresh commit as the rest of the
   run (or its own `myFT refresh: <N> new` commit if nothing else changed). If
   nothing new, make no commit.
