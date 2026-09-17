'use client'

import { CornerFrame } from './corner-frame'
import { HudBackdrop } from './hud-backdrop'

export function Hero() {
  return (
    <div className="relative w-full">
      <HudBackdrop variant="hero" className="opacity-70 md:opacity-90" />
      <div className="relative z-[1] mx-auto w-full max-w-6xl">
        <div className="hero-piece mb-10 flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-xs uppercase tracking-[0.3em] text-ink-muted md:text-sm">
          <span className="text-turquoise">Informe de transformación</span>
          <span className="h-px w-10 bg-turquoise/40" />
          <span>Benchmark · archivo de ~50 partidas</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="hero-piece font-display text-lg text-ink-muted md:text-2xl">
            El mismo trabajo que antes tardaba
          </p>

          <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:gap-8">
            <span className="hero-old-num relative inline-block font-display text-5xl font-bold leading-none text-ink opacity-0 sm:text-6xl md:text-8xl">
              1.5 días
              <span
                className="hero-strike absolute left-0 top-1/2 h-[4px] w-0 origin-left bg-orange/80"
                aria-hidden
              />
            </span>

            <svg
              width="72"
              height="28"
              viewBox="0 0 72 28"
              fill="none"
              aria-hidden
              className="hero-arrow mb-3 text-turquoise opacity-0"
            >
              <path d="M0 14H64" stroke="currentColor" strokeWidth="2" />
              <path d="M54 4L66 14L54 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="hero-new-wrap opacity-0">
            <CornerFrame accent="orange" className="inline-block px-4 py-4 sm:px-6">
              <span className="font-display text-[3.25rem] font-bold leading-[0.95] text-orange sm:text-7xl md:text-[10rem]">
                <span className="hero-new-num tabular">0</span>
                <span> segundos</span>
              </span>
            </CornerFrame>
          </div>
        </div>

        <div className="hero-piece mt-12 w-full opacity-0 md:mt-14">
          <div className="mb-2 flex justify-between font-display text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted">
            <span>Tiempo por archivo</span>
            <span className="text-orange">
              ~<span className="hero-mult tabular">0</span>× más rápido
            </span>
          </div>
          <div className="relative h-4 w-full overflow-hidden rounded-none border border-turquoise/25 bg-navy-deep">
            <div className="hero-compress-track absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-turquoise via-turquoise to-orange" />
            <div className="hero-compress-pulse pointer-events-none absolute inset-y-0 right-0 w-8 bg-orange/40 opacity-0 blur-sm" />
          </div>
          <div className="mt-2 flex justify-between font-display text-xs text-ink-muted">
            <span>día laboral completo</span>
            <span className="text-turquoise">un parpadeo</span>
          </div>
        </div>

        <div className="hero-scroll-cue mt-10 flex items-center gap-3 font-display text-xs uppercase tracking-[0.3em] text-ink-muted opacity-0 md:mt-12">
          <span className="hero-scroll-arrow inline-block">↓</span>
          Desplázate para ver la historia
        </div>
      </div>
    </div>
  )
}
