"use client";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";
type Ev = Parameters<typeof track>[0];
export function TrackLink({ href, event, className, children, external }: { href: string; event?: Ev; className?: string; children: ReactNode; external?: boolean }) {
  return <a href={href} className={className} onClick={event ? () => track(event) : undefined} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
}
