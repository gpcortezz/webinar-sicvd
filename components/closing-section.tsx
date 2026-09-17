'use client'

import { closing } from '@/lib/data'
import { AnimatedCounter } from './animated-counter'
import { CornerFrame } from './corner-frame'
import { Reveal, SectionLabel } from './reveal'

const accentText: Record<string, string> = {
  orange: 'text-orange',
  turquoise: 'text-turquoise',
}

export function ClosingSection() {
  return (
    <section className="relative h-full overflow-hidden px-6 pb-24 pt-28 md:px-12 md:pb-28 md:pt-28">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
        <Reveal>
          <SectionLabel index="04">El resultado</SectionLabel>
        </Reveal>

        {/* headline stat */}
        <Reveal delay={0.05}>
          <div className="mb-8 flex flex-col items-start gap-3 md:mb-10 md:gap-4">
            <p className="font-display text-lg text-ink-muted md:text-2xl">Aceleración total</p>
            <div className="flex flex-wrap items-center gap-5 md:gap-8">
            <CornerFrame accent="orange" className="px-6 py-4">
              <span className="font-display text-6xl font-bold leading-none text-orange md:text-9xl">
                <AnimatedCounter value={2800} duration={2200} suffix="×" />
              </span>
            </CornerFrame>
            <p className="max-w-sm font-display text-4xl font-bold leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-7xl">
              De <span className="text-ink-muted line-through decoration-orange/60">días</span> a <span className="text-orange">segundos</span>.
            </p>
            </div>
            <p className="max-w-md text-sm text-ink-muted md:text-base">
              más rápido que el proceso manual, para el mismo archivo de ~50 partidas.
            </p>
          </div>
        </Reveal>

        {/* three key messages */}
        <div className="grid gap-4 md:grid-cols-3">
          {closing.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <CornerFrame accent={c.accent} className="h-full px-6 py-8">
                <div className="flex h-full flex-col gap-3">
                  <span
                    className={`font-display text-xs font-semibold uppercase tracking-[0.3em] ${accentText[c.accent]}`}
                  >
                    {c.kicker}
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight text-ink md:text-2xl">
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">{c.body}</p>
                </div>
              </CornerFrame>
            </Reveal>
          ))}
        </div>

        {/* footer line */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-col items-center gap-3 border-t-2 border-orange/60 pt-6 text-center md:mt-10 md:pt-8">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-muted">
              Benchmark constante · archivo de ~50 partidas
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
