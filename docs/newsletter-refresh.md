# Newsletter refresh runbook

A step for the scheduled 4×/day refresh routines: pull the reader's forwarded
email newsletters from Gmail and fold them into the Home news feed as `LETTER`
items. Self-contained — an agent run can follow this end-to-end.

**Prerequisite:** the run must have the **Gmail connector** enabled and pointed at
`skaidrive2@gmail.com` (the mailbox the newsletters forward into). If the Gmail
tools aren't available in the run, skip this step and leave `newsletters.js`
unchanged — do not blank it out.

## 1. Find newsletters received since the last pull

Newsletters arrive as forwarded mail from `stevedkennedy@gmail.com`; the original
sender is in the body's `From:` line. Search Gmail (via the connector) with:

```
in:anywhere from:stevedkennedy@gmail.com newer_than:2d
```

Also acceptable (direct senders, in case forwarding changes): `news.bloomberg.com`,
`e.economist.com`, `legalbusiness.co.uk`, `pb.jpmorgan.com`, `mail.sailthru.com`,
`mailbrew.com`, `cntraveller.com`. The `PUBLISHERS` map in `newsletters.js` is the
authoritative sender→publication list — extend it when a new sender appears.

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

Bump the import token in `glance.js` (`/newsletters.js?v=YYYYMMDD-N`) so the change
ships. No other file needs editing — `glance.js` already renders `NEWSLETTERS`
into the feed under the `LETTER` label (see `_deskClass.n` / `DESK.n`).

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
- These are disposable forwarded copies in the ingestion inbox; the originals
  remain in the source mailbox (stevedkennedy), so trashing here is safe.
