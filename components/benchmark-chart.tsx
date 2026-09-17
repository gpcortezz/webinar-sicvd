'use client'

import { motion } from 'framer-motion'
import { benchmark } from '@/lib/data'
import { Reveal, SectionLabel } from './reveal'

const accentBar: Record<string, string> = {
  orange: 'from-orange to-orange-soft',
  turquoise: 'from-turquoise to-turquoise-soft',
  ink: 'from-ink-muted to-ink-muted',
}
const accentText: Record<string, string> = {
  orange: 'text-orange',
  turquoise: 'text-turquoise',
  ink: 'text-ink',
}

const maxLog = Math.log10(benchmark[0].seconds)

export function BenchmarkChart() {
  return (
    <section className="relative px-6 py-28 md:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <SectionLabel index="02">Benchmark constante</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-3 max-w-2xl text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            El mismo archivo de ~50 partidas, medido en 4 momentos
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-14 max-w-xl text-sm text-ink-muted md:text-base">
            Escala logarítmica: cada barra representa el tiempo total para
            completar un archivo. Aun comprimida por el logaritmo, la caída es
            imposible de ignorar.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative border-l border-turquoise/25 pl-4 md:pl-6">
            {/* baseline */}
            <div className="absolute bottom-[136px] left-0 right-0 border-t border-dashed border-turquoise/15" />

            <div className="grid grid-cols-4 items-end gap-3 md:gap-6" style={{ height: 360 }}>
              {benchmark.map((b, i) => {
                const pct = (Math.log10(b.seconds) / maxLog) * 100
                return (
                  <div key={b.id} className="flex h-full flex-col items-center justify-end gap-3">
                    <span className={`font-display text-sm font-bold md:text-xl ${accentText[b.accent]}`}>
                      {b.display}
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 1.1, delay: 0.15 * i, ease: [0.7, 0, 0.2, 1] }}
                      className={`w-full max-w-[110px] bg-gradient-to-t ${accentBar[b.accent]} ${
                        b.accent === 'orange' ? 'shadow-[0_0_40px_-8px_var(--color-orange)]' : ''
                      }`}
                    />
                  </div>
                )
              })}
            </div>

            {/* labels */}
            <div className="mt-4 grid grid-cols-4 gap-3 border-t border-turquoise/25 pt-4 md:gap-6">
              {benchmark.map((b) => (
                <div key={b.id} className="flex flex-col items-center gap-1 text-center">
                  <span className="font-display text-xs font-semibold text-ink md:text-sm">
                    {b.label}
                  </span>
                  <span className="font-display text-[0.65rem] uppercase tracking-wider text-ink-muted">
                    {b.sub}
                  </span>
                  <span className={`mt-1 font-display text-[0.7rem] font-semibold ${accentText[b.accent]}`}>
                    {b.factor}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
