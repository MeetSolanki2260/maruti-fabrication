import { Fragment } from "react";
/** Renders "a\nb" as two lines, so headings break where the design breaks them. */
export default function Lines({ text }: { text: string }) {
  return <>{text.split("\n").map((s, i) => <Fragment key={i}>{i > 0 && <br />}{s}</Fragment>)}</>;
}
