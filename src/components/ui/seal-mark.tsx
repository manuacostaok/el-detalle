type SealMarkProps = {
  className?: string;
  wax?: string;
  ink?: string;
  cracked?: boolean;
};

/**
 * El sello de El Detalle — un sello de lacre con el monograma "D", no un corazón.
 * `cracked` parte el sello en dos mitades (usado en la apertura del regalo).
 */
export function SealMark({
  className,
  wax = "var(--color-accent)",
  ink = "var(--color-gold-soft)",
  cracked = false,
}: SealMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g id="seal-left">
        <path d="M50 4 A46 46 0 0 0 50 96 Z" fill={wax} />
      </g>
      <g id="seal-right">
        <path d="M50 4 A46 46 0 0 1 50 96 Z" fill={wax} />
      </g>
      {!cracked && (
        <>
          <circle cx="50" cy="50" r="38" fill="none" stroke={ink} strokeWidth="1.2" opacity="0.55" />
          <text
            x="50"
            y="63"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontStyle="italic"
            fontWeight="600"
            fontSize="46"
            fill={ink}
          >
            D
          </text>
          <path
            d="M18 30 A40 40 0 0 1 45 8"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.18"
          />
        </>
      )}
    </svg>
  );
}
