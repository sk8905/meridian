// csv.js — export what is on screen as a CSV file (monitoring: take a filtered list
// into a spreadsheet). One helper for every surface: rows in, a download out.
const cell = (v) => {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export function toCSV(header, rows) {
  return [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
}
// Save as <name>-YYYY-MM-DD.csv (a BOM so Excel reads UTF-8 names correctly).
export function downloadCSV(name, header, rows) {
  const blob = new Blob(["﻿" + toCSV(header, rows)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
// A rendered table's VISIBLE rows (header from its <th>s), for list views whose
// on-screen filters live in the DOM.
export function tableRows(table) {
  const header = [...table.querySelectorAll("thead th")].map((th) => th.textContent.replace(/[▲▼]/g, "").trim());
  const rows = [...table.querySelectorAll("tbody tr")].filter((tr) => tr.style.display !== "none" && !tr.hidden && tr.cells.length === header.length)
    .map((tr) => [...tr.cells].map((td) => td.textContent.replace(/\s+/g, " ").replace(/^▸\s*/, "").trim()));
  return { header, rows };
}
