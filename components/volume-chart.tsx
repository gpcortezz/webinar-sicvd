'use client'

import { motion } from 'framer-motion'
import { volume } from '@/lib/data'
import { AnimatedCounter } from './animated-counter'
import { Reveal, SectionLabel } from './reveal'

const max = Math.max(...volume.map((v) => v.perDay))

// A row of dots that stream left→right; higher throughput = faster & denser.
function FlowStream({ speed, active }: { speed: number; active: boolean }) {
  const dots = Math.min(Math.max(Math.round(speed / 12) + 2, 3), 16)
  const duration = 3.2 - Math.min(speed / max, 1) * 2.4 // faster for higher volume
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: dots }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute top-1/2 h-1 w-3 -translate-y-1/2 bg-navy-deep/70"
          initial={{ left: '-6%' }}
          animate={active ? { left: ['-6%', '106%'] } : {}}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'linear',
            delay: (i / dots) * duration,
          }}
        />
      ))}
    </div>
  )
}

export function VolumeChart() {
  return (
    <section className="relative px-6 py-28 md:px-12">
      <div className="mx-auto w-full max-w-5xl">
        <Reveal>
          <SectionLabel index="03">Volumen diario</SectionLabel>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mb-3 max-w-2xl text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            Más archivos por día en cada etapa
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mb-14 max-w-xl text-sm text-ink-muted md:text-base">
            Mientras el tiempo por archivo caía, la capacidad diaria se multiplicó
            por <span className="font-display font-semibold text-orange">~315×</span>.
          </p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {volume.map((v, i) => {
            const pct = Math.max((v.perDay / max) * 100, 1.5)
            const isPeak = i === volume.length - 1
            return (
              <Reveal key={v.label} delay={i * 0.08}>
                <div className="flex items-center gap-4">
                  <div className="w-24 flex-none text-right md:w-32">
                    <div className="font-display text-sm font-semibold text-ink md:text-base">
                      {v.label}
                    </div>
                    <div className="font-display text-[0.65rem] uppercase tracking-wider text-ink-muted">
                      {v.period}
                    </div>
                  </div>

                  <div className="relative h-11 flex-1 border border-turquoise/20 bg-navy-deep">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.1, delay: 0.15, ease: [0.7, 0, 0.2, 1] }}
                      className={`relative h-full overflow-hidden ${
                        isPeak
                          ? 'bg-gradient-to-r from-orange to-orange-soft'
                          : 'bg-gradient-to-r from-turquoise/70 to-turquoise'
                      }`}
                    >
                      <FlowStream speed={v.perDay} active />
                    </motion.div>
                  </div>

                  <div className="w-24 flex-none md:w-28">
                    <span
                      className={`font-display text-2xl font-bold md:text-3xl ${
                        isPeak ? 'text-orange' : 'text-turquoise'
                      }`}
                    >
                      <AnimatedCounter value={v.perDay} decimals={v.perDay < 1 ? 1 : 0} />
                    </span>
                    <span className="block font-display text-[0.6rem] uppercase tracking-wider text-ink-muted">
                      archivos/día
                    </span>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
