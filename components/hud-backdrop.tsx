/**
 * Technical frame HUD — corner brackets, rules, guides.
 * Same language as the closing slide; no arcs / gauge circles.
 */
type HudSlide = 'hero' | 'pipeline' | 'benchmark' | 'volume' | 'closing'

const ink = {
  strong: 'rgba(78, 205, 196,0.28)',
  mid: 'rgba(78, 205, 196,0.16)',
  soft: 'rgba(78, 205, 196,0.1)',
  orange: 'rgba(255, 107, 53,0.22)',
  orangeSoft: 'rgba(255, 107, 53,0.12)',
}

function Corner({
  x,
  y,
  dir,
  size = 72,
  stroke = ink.strong,
}: {
  x: number
  y: number
  dir: 'tl' | 'tr' | 'bl' | 'br'
  size?: number
  stroke?: string
}) {
  const h = dir === 'tl' || dir === 'bl' ? size : -size
  const v = dir === 'tl' || dir === 'tr' ? size : -size
  return (
    <path
      d={`M${x + h} ${y} H${x} V${y + v}`}
      stroke={stroke}
      strokeWidth="1.25"
      fill="none"
    />
  )
}

export function HudBackdrop({
  variant = 'closing',
  className = '',
}: {
  variant?: HudSlide
  className?: string
}) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        {variant === 'hero' && (
          <>
            <Corner x={80} y={120} dir="tl" size={80} />
            <Corner x={1120} y={120} dir="tr" size={80} />
            <Corner x={80} y={680} dir="bl" size={80} />
            <Corner x={1120} y={680} dir="br" size={80} />

            {/* top title rule */}
            <line x1="180" y1="168" x2="1020" y2="168" stroke={ink.mid} strokeWidth="1" />
            {Array.from({ length: 17 }).map((_, i) => (
              <line
                key={`t-${i}`}
                x1={180 + i * 52.5}
                y1={168}
                x2={180 + i * 52.5}
                y2={i % 4 === 0 ? 158 : 163}
                stroke={ink.mid}
                strokeWidth="1"
              />
            ))}

            {/* mid content band */}
            <line x1="180" y1="280" x2="720" y2="280" stroke={ink.soft} strokeWidth="1" />
            <line x1="180" y1="520" x2="900" y2="520" stroke={ink.mid} strokeWidth="1" />

            {/* vertical accent at left of hero numbers */}
            <line x1="160" y1="200" x2="160" y2="500" stroke={ink.soft} strokeWidth="1" />
            <line x1="152" y1="220" x2="168" y2="220" stroke={ink.strong} strokeWidth="1" />
            <line x1="152" y1="360" x2="168" y2="360" stroke={ink.orange} strokeWidth="1" />
            <line x1="152" y1="480" x2="168" y2="480" stroke={ink.strong} strokeWidth="1" />

            {/* bottom baseline + 3 columns like reference layout */}
            <line x1="180" y1="620" x2="1020" y2="620" stroke={ink.mid} strokeWidth="1" />
            <line x1="460" y1="620" x2="460" y2="680" stroke={ink.mid} strokeWidth="1" />
            <line x1="740" y1="620" x2="740" y2="680" stroke={ink.mid} strokeWidth="1" />
          </>
        )}

        {variant === 'pipeline' && (
          <>
            <Corner x={80} y={120} dir="tl" size={80} />
            <Corner x={1120} y={120} dir="tr" size={80} />
            <Corner x={80} y={680} dir="bl" size={80} />
            <Corner x={1120} y={680} dir="br" size={80} stroke={ink.orange} />

            <line x1="160" y1="200" x2="1040" y2="200" stroke={ink.mid} strokeWidth="1" />
            <line x1="160" y1="560" x2="1040" y2="560" stroke={ink.soft} strokeWidth="1" />

            {/* Soft rail only — no tick crosses that flash behind node icons */}
            <line x1="180" y1="380" x2="1020" y2="380" stroke={ink.mid} strokeWidth="1" />
            {[220, 400, 580, 760, 940].map((x, i) => (
              <circle
                key={x}
                cx={x}
                cy={380}
                r={3}
                fill="none"
                stroke={i === 4 ? ink.orange : ink.strong}
                strokeWidth="1"
                opacity="0.55"
              />
            ))}
          </>
        )}

        {variant === 'benchmark' && (
          <>
            <Corner x={80} y={120} dir="tl" size={80} />
            <Corner x={1120} y={120} dir="tr" size={80} />
            <Corner x={80} y={680} dir="bl" size={80} />
            <Corner x={1120} y={680} dir="br" size={80} />

            <line x1="160" y1="150" x2="1040" y2="150" stroke={ink.mid} strokeWidth="1" />
            <line x1="160" y1="230" x2="880" y2="230" stroke={ink.soft} strokeWidth="1" />

            {/* 4 column guides for the 4 bars */}
            {[240, 460, 680, 900].map((x) => (
              <g key={x}>
                <line x1={x} y1="260" x2={x} y2="620" stroke={ink.soft} strokeWidth="1" />
                <line x1={x - 18} y1="260" x2={x + 18} y2="260" stroke={ink.mid} strokeWidth="1" />
                <line x1={x - 10} y1="620" x2={x + 10} y2="620" stroke={ink.strong} strokeWidth="1" />
              </g>
            ))}

            <line x1="160" y1="640" x2="1040" y2="640" stroke={ink.mid} strokeWidth="1" />
            {Array.from({ length: 21 }).map((_, i) => (
              <line
                key={`b-${i}`}
                x1={160 + i * 44}
                y1={640}
                x2={160 + i * 44}
                y2={i % 5 === 0 ? 652 : 646}
                stroke={ink.mid}
                strokeWidth="1"
              />
            ))}
          </>
        )}

        {variant === 'volume' && (
          <>
            <Corner x={80} y={120} dir="tl" size={80} stroke={ink.strong} />
            <Corner x={1120} y={120} dir="tr" size={80} />
            <Corner x={80} y={680} dir="bl" size={80} />
            <Corner x={1120} y={680} dir="br" size={80} stroke={ink.orange} />

            <line x1="140" y1="150" x2="1060" y2="150" stroke={ink.mid} strokeWidth="1" />
            <line x1="140" y1="230" x2="820" y2="230" stroke={ink.soft} strokeWidth="1" />

            {/* horizontal lanes suggesting volume rows */}
            {[300, 370, 440, 510, 580].map((y, i) => (
              <g key={y}>
                <line
                  x1="200"
                  y1={y}
                  x2="1000"
                  y2={y}
                  stroke={i === 4 ? ink.orangeSoft : ink.soft}
                  strokeWidth="1"
                />
                <line
                  x1="200"
                  y1={y}
                  x2="212"
                  y2={y}
                  stroke={i === 4 ? ink.orange : ink.strong}
                  strokeWidth="1.5"
                />
              </g>
            ))}

            {/* left scale ticks */}
            <line x1="170" y1="280" x2="170" y2="600" stroke={ink.mid} strokeWidth="1" />
            {[300, 370, 440, 510, 580].map((y) => (
              <line key={`v-${y}`} x1="162" y1={y} x2="178" y2={y} stroke={ink.strong} strokeWidth="1" />
            ))}

            <line x1="140" y1="660" x2="1060" y2="660" stroke={ink.mid} strokeWidth="1" />
          </>
        )}

        {variant === 'closing' && (
          <>
            <Corner x={80} y={120} dir="tl" size={80} stroke={ink.strong} />
            <Corner x={1120} y={120} dir="tr" size={80} stroke={ink.orange} />
            <Corner x={80} y={680} dir="bl" size={80} stroke={ink.strong} />
            <Corner x={1120} y={680} dir="br" size={80} stroke={ink.orange} />

            <line x1="200" y1="200" x2="1000" y2="200" stroke={ink.mid} strokeWidth="1" />
            <line x1="200" y1="600" x2="1000" y2="600" stroke={ink.orangeSoft} strokeWidth="1" />

            <line x1="400" y1="220" x2="400" y2="580" stroke={ink.soft} strokeWidth="1" />
            <line x1="800" y1="220" x2="800" y2="580" stroke={ink.soft} strokeWidth="1" />

            {/* crosshair marks (not full circles) at guide intersections */}
            <line x1="392" y1="400" x2="408" y2="400" stroke={ink.mid} strokeWidth="1" />
            <line x1="400" y1="392" x2="400" y2="408" stroke={ink.mid} strokeWidth="1" />
            <line x1="792" y1="400" x2="808" y2="400" stroke={ink.mid} strokeWidth="1" />
            <line x1="800" y1="392" x2="800" y2="408" stroke={ink.mid} strokeWidth="1" />

            {/* center focus brackets around result */}
            <path d="M520 340 H560 M540 320 V360" stroke={ink.orange} strokeWidth="1.1" />
            <path d="M680 340 H640 M660 320 V360" stroke={ink.orange} strokeWidth="1.1" />
            <path d="M520 460 H560 M540 480 V440" stroke={ink.orange} strokeWidth="1.1" />
            <path d="M680 460 H640 M660 480 V440" stroke={ink.orange} strokeWidth="1.1" />
          </>
        )}
      </svg>
    </div>
  )
}
