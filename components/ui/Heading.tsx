import Lines from "./Lines";
export default function Heading({ eyebrow, title, lead, level = 2 }: { eyebrow: string; title: string; lead?: string; level?: 1 | 2 }) {
  const H = `h${level}` as "h1" | "h2";
  return <div className="sec-head"><div><span className="eyebrow">{eyebrow}</span><H><Lines text={title} /></H></div>{lead && <p>{lead}</p>}</div>;
}
