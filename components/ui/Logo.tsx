/** Orange framed "M" mark, redrawn from the design. */
export default function LogoMark({ size = 40 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 44 44" fill="none" stroke="#ef6a32" strokeWidth="3.6" aria-hidden="true"><path d="M2 2h12M30 2h12v40H2V2" /><path d="M13 2l9 30 9-30M12 22v20M32 22v20" /></svg>;
}
