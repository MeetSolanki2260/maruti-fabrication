import "../styles/globals.css";
import type { ReactNode } from "react";
// Each locale layout renders <html>; this root only loads the shared styles.
export default function Root({ children }: { children: ReactNode }) { return children; }
