/** "+91 94282 80683" -> "+919428280683". Indian mobiles or +<8-15 digits> abroad. Null if invalid. */
export function normalisePhone(input: string): string | null {
  const s = input.replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) {
    if (s.startsWith("+91")) return /^\+91[6-9]\d{9}$/.test(s) ? s : null;
    return /^\+[1-9]\d{7,14}$/.test(s) ? s : null;
  }
  const m = /^(?:0|91|0091)?([6-9]\d{9})$/.exec(s);
  return m ? "+91" + m[1] : null;
}
