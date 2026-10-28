/** Quotes a CSV cell and defuses spreadsheet formulas (= + - @ and tab/CR prefixes). */
export function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replaceAll('"', '""') + '"';
}
