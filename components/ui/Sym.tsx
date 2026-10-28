/** One icon from the sprite in components/layout/Sprite.tsx. Size comes from the surrounding CSS. */
export default function Sym({ id, size }: { id: string; size?: number }) {
  return <svg style={size ? { width: size, height: size } : undefined} aria-hidden="true"><use href={`#${id}`} /></svg>;
}
