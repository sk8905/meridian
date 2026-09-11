// nb-format.js — shared colour-marking for AI/explainer copy: the briefing bullets
// AND every "Key moments" / "why it moved" explainer across the app. ONE source of
// truth so the treatment stays identical everywhere (HOUSE_STYLE single-source).
//
//   • nbNums(html)  — every NUMBER reads blue (.nb-num → var(--wb-txt)), EXCEPT
//     date components: a day directly before a month name ("16 September") and bare
//     4-digit years ("2026", "2007") keep the plain colour.
//   • nbTopic(html) — a leading "<strong>Topic —</strong>" heading reads orange
//     (.nb-topic → var(--accent)).
//   • briefMarkup(html) — both passes, for the briefing lines.
//
// All passes operate on HTML (or esc()'d text): numbers are wrapped only inside
// text runs, never inside a tag, so existing markup and source links stay intact.
const NB_MONTH = "Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec";

export function nbNums(html) {
  // Tokenise into HTML tags, HTML ENTITIES, and plain text runs. Entities and
  // tags are skipped verbatim — critically, so the digits inside a numeric entity
  // like &#39; (esc()'s apostrophe) are NEVER wrapped, which would split the entity
  // and leak literal "&#39;" into the page. The text branch stops at "<" and "&".
  return String(html || "").replace(/(<[^>]*>|&#?[a-z0-9]+;)|([^<&]+)/gi, (_m, skip, text) => skip
    ? skip
    : text.replace(new RegExp(`(^|[^\\w$£€.])((?:[$£€])?\\d+(?:,\\d{3})*(?:\\.\\d+)?%?)(\\s+(?:${NB_MONTH})[a-z]*)?`, "gi"), (m, pre, num, monthTail) => {
        const isDateDay = !!monthTail && /^\d{1,2}$/.test(num);
        const isYear = /^(?:19|20)\d\d$/.test(num);
        if (isDateDay || isYear) return m;
        return `${pre}<span class="nb-num">${num}</span>${monthTail || ""}`;
      }));
}

export function nbTopic(html) {
  return String(html || "").replace(/(<strong>)\s*([^<]*?)\s*(&mdash;|—)/, (_m, s, topic, dash) => `${s}<span class="nb-topic">${topic}</span> ${dash}`);
}

export function briefMarkup(html) { return nbNums(nbTopic(html)); }
