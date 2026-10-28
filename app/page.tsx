import Link from "next/link";
// "/" forwards to the English home page. When deployed, _redirects does this before this page loads.
export default function Root() {
  return (
    <html lang="en">
      <head><meta httpEquiv="refresh" content="0;url=/en/" /></head>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <p><Link href="/en/">English</Link> · <Link href="/gu/">ગુજરાતી</Link> · <Link href="/hi/">हिन्दी</Link></p>
        <p><a href="tel:+919428280683">Call 9428280683</a></p>
      </body>
    </html>
  );
}
