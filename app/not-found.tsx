import Link from "next/link";
export default function NotFound() {
  return <html lang="en"><body style={{ padding: 24, fontFamily: "system-ui" }}><h1>Page not found</h1><p><Link href="/en/">Go to the home page</Link> or <a href="tel:+919428280683">call 9428280683</a>.</p></body></html>;
}
