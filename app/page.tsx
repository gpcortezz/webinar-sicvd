'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * "Metamorfosis continua"
 * 
 * One pinned viewport. Scroll drives a single GSAP timeline (scrub).
 * Nothing enters or exits — elements morph in place.
 * 
 * The scroll height is 6× the viewport (6 "acts" of morphing).
 * A single progress scrub controls everything.
 */

const PIPELINE_STEPS = [
  { code: '01', title: 'Búsqueda de conocimiento' },
  { code: '02', title: 'Generación de embeddings' },
  { code: '03', title: 'Recuperación semántica' },
  { code: '04', title: 'Completación de datos' },
  { code: '05', title: 'Subida a plataforma' },
] as const

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!root.current) return

    const ctx = gsap.context(() => {
      const stage = document.querySelector<HTMLElement>('.morph-stage')!
      const bigNum = document.querySelector<HTMLElement>('.morph-bignum')!
      const bigUnit = document.querySelector<HTMLElement>('.morph-unit')!
      const context1 = document.querySelector<HTMLElement>('.morph-ctx1')!
      const context2 = document.querySelector<HTMLElement>('.morph-ctx2')!
      const pipeWrap = document.querySelector<HTMLElement>('.morph-pipe')!
      const pipeFill = document.querySelector<HTMLElement>('.morph-pipe-fill')!
      const pipeSteps = gsap.utils.toArray<HTMLElement>('.morph-pipe-step')
      const barRows = gsap.utils.toArray<HTMLElement>('.morph-bar')
      const barFills = gsap.utils.toArray<HTMLElement>('.morph-bar-fill')
      const barNums = gsap.utils.toArray<HTMLElement>('.morph-bar-num')
      const barLabels = gsap.utils.toArray<HTMLElement>('.morph-bar-label')
      const ring = document.querySelector<HTMLElement>('.morph-ring')!
      const ringLabel = document.querySelector<HTMLElement>('.morph-ring-label')!
      const scrubLine = document.querySelector<HTMLElement>('.morph-scrub-fill')!
      const phaseLabel = document.querySelector<HTMLElement>('.morph-phase')!
      const cardWrap = document.querySelector<HTMLElement>('.morph-cards')!
      const cards = gsap.utils.toArray<HTMLElement>('.morph-card')
      const footnote = document.querySelector<HTMLElement>('.morph-footnote')!

      // Numbers proxy for counter animation
      const nums = { big: 1.5, mult: 1 }

      // Helper: morph text instantly
      const setText = (el: HTMLElement, text: string) => { el.textContent = text }

      // Initial state
      gsap.set(pipeWrap, { opacity: 0, y: 20 })
      gsap.set(pipeSteps, { opacity: 0.15, scale: 0.9 })
      gsap.set(barRows, { opacity: 0 })
      gsap.set(cardWrap, { opacity: 0 })
      gsap.set(ring, { opacity: 0, scale: 0.8 })
      gsap.set(footnote, { opacity: 0 })

      // ── Master timeline (scrub-driven) ───────────────────
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: '.morph-scroll-space',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: stage,
          anticipatePin: 1,
        },
      })

      // Scrub progress bar
      master.to(scrubLine, { scaleX: 1, ease: 'none', duration: 10 }, 0)

      // ═══ ACT 0 → 1: INTRO (0–1.2) ═══════════════════════
      // Start: "1.5 días" / "El mismo trabajo que antes tardaba"
      // Morph to: "50 min" / phase label changes
      master.to(nums, {
        big: 50, duration: 1.2, ease: 'power2.in',
        onUpdate: () => {
          const v = nums.big
          if (v > 2) {
            bigNum.textContent = v < 60 ? Math.round(v).toString() : v.toFixed(1)
          } else {
            bigNum.textContent = v.toFixed(1)
          }
        },
      }, 0)
      master.to({}, {
        duration: 0.01,
        onComplete: () => {
          setText(bigUnit, 'min')
          setText(context1, 'Primer salto: de días a minutos')
          setText(context2, 'Beta · automatización inicial')
          setText(phaseLabel, 'Beta')
        },
      }, 1.0)

      // ═══ ACT 1 → 2: PIPELINE APPEARS (1.2–3.0) ══════════
      master.to(pipeWrap, { opacity: 1, y: 0, duration: 0.4 }, 1.2)

      pipeSteps.forEach((step, i) => {
        const t = 1.4 + i * 0.3
        master.to(step, { opacity: 1, scale: 1, duration: 0.25 }, t)
        master.to(pipeFill, {
          scaleX: (i + 1) / pipeSteps.length,
          duration: 0.25,
        }, t)
      })

      // Number morphs: 50 → 6.5
      master.to(nums, {
        big: 6.5, duration: 0.8, ease: 'power2.inOut',
        onUpdate: () => {
          bigNum.textContent = nums.big < 10 ? nums.big.toFixed(1) : Math.round(nums.big).toString()
        },
      }, 2.2)
      master.to({}, {
        duration: 0.01,
        onComplete: () => {
          setText(bigUnit, 'min')
          setText(context1, 'Segundo salto: el pipeline recorta 7×')
          setText(context2, 'Agosto · pipeline completo')
          setText(phaseLabel, 'Agosto')
        },
      }, 2.8)

      // ═══ ACT 2 → 3: PIPELINE FADES, BARS APPEAR (3.0–5.0)
      master.to(pipeWrap, { opacity: 0, y: -15, duration: 0.35 }, 3.0)

      // Number morphs: 6.5 → 15 seg
      master.to(nums, {
        big: 15, duration: 0.8, ease: 'power2.inOut',
        onUpdate: () => {
          bigNum.textContent = Math.round(nums.big).toString()
        },
      }, 3.2)
      master.to({}, {
        duration: 0.01,
        onComplete: () => {
          setText(bigUnit, 'seg')
          setText(context1, 'Tercer salto: de minutos a segundos')
          setText(context2, 'Programático · 28× sobre agosto')
          setText(phaseLabel, 'Programático')
        },
      }, 3.8)

      // Bars morph in — volume data
      const volData = [0.6, 10, 79, 189]
      const volLabels = ['Beta', 'Marzo', 'Abr–Jul', 'Agosto']

      barRows.forEach((row, i) => {
        master.to(row, { opacity: 1, duration: 0.25 }, 3.5 + i * 0.18)
      })
      barFills.forEach((fill, i) => {
        const pct = Math.max(volData[i]! / 189, 0.02)
        master.to(fill, { scaleX: pct, duration: 0.6, ease: 'power3.out' }, 3.6 + i * 0.18)
      })
      barNums.forEach((num, i) => {
        const target = volData[i]!
        const proxy = { v: 0 }
        master.to(proxy, {
          v: target,
          duration: 0.5,
          onUpdate: () => {
            num.textContent = proxy.v < 10 ? proxy.v.toFixed(1) : Math.round(proxy.v).toString()
          },
        }, 3.7 + i * 0.18)
      })
      barLabels.forEach((label, i) => {
        master.to({}, {
          duration: 0.01,
          onComplete: () => setText(label, volLabels[i]!),
        }, 3.5 + i * 0.18)
      })

      master.to({}, {
        duration: 0.01,
        onComplete: () => {
          setText(context1, 'Volumen: la capacidad diaria se multiplicó')
          setText(context2, '315× más archivos por día en el pico')
        },
      }, 4.5)

      // ═══ ACT 3 → 4: BARS FADE, RING GROWS (5.0–7.0) ═════
      barRows.forEach((row, i) => {
        master.to(row, { opacity: 0, duration: 0.3 }, 5.2 + i * 0.06)
      })

      // Number morphs to the grand total
      master.to(nums, {
        big: 2800, duration: 1.4, ease: 'power2.out',
        onUpdate: () => {
          bigNum.textContent = Math.round(nums.big).toLocaleString('es-ES')
        },
      }, 5.5)
      master.to({}, {
        duration: 0.01,
        onComplete: () => {
          setText(bigUnit, '×')
          setText(context1, 'De días a segundos')
          setText(context2, 'Mismo archivo · ~50 partidas')
          setText(phaseLabel, 'Resultado')
        },
      }, 6.2)

      // Ring grows around big number
      master.to(ring, { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }, 6.0)
      master.to(ringLabel, { opacity: 1, duration: 0.4 }, 6.4)

      // Cards appear
      master.to(cardWrap, { opacity: 1, duration: 0.5 }, 6.5)
      cards.forEach((card, i) => {
        master.fromTo(card, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 }, 6.6 + i * 0.15)
      })

      master.to(footnote, { opacity: 1, duration: 0.3 }, 7.2)

      // Background color shift through the whole timeline
      const bg = document.querySelector<HTMLElement>('.morph-bg')!
      master.to(bg, { backgroundColor: '#0e0c0a', duration: 2.5 }, 0)
      master.to(bg, { backgroundColor: '#100d08', duration: 2.5 }, 2.5)
      master.to(bg, { backgroundColor: '#120a04', duration: 2.5 }, 5.0)
      master.to(bg, { backgroundColor: '#160c02', duration: 2.5 }, 7.5)

    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div ref={root}>
      {/* Scroll space — this is what you actually scroll through */}
      <div className="morph-scroll-space" />

      {/* The single pinned stage */}
      <div className="morph-stage">
        <div className="morph-bg" />
        <div className="morph-grain" aria-hidden />

        {/* Scrub progress */}
        <div className="morph-scrub">
          <div className="morph-scrub-fill" />
        </div>

        {/* Phase label — top right */}
        <div className="morph-phase-wrap">
          <span className="morph-phase">Inicio</span>
        </div>

        {/* ── THE CANVAS ─────────────────────────── */}
        <div className="morph-canvas">
          {/* Context text — top */}
          <div className="morph-context">
            <p className="morph-ctx1">El mismo trabajo que antes tardaba</p>
            <p className="morph-ctx2">Benchmark · archivo de ~50 partidas</p>
          </div>

          {/* Big number — center */}
          <div className="morph-center">
            <div className="morph-ring" aria-hidden>
              <span className="morph-ring-label">aceleración total</span>
            </div>
            <div className="morph-number">
              <span className="morph-bignum">1.5</span>
              <span className="morph-unit">días</span>
            </div>
          </div>

          {/* Pipeline — appears/disappears */}
          <div className="morph-pipe">
            <div className="morph-pipe-track">
              <div className="morph-pipe-fill" />
            </div>
            <div className="morph-pipe-steps">
              {PIPELINE_STEPS.map((step) => (
                <div key={step.code} className="morph-pipe-step">
                  <span className="morph-pipe-code">{step.code}</span>
                  <span className="morph-pipe-title">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Volume bars — appear/disappear */}
          <div className="morph-bars">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="morph-bar">
                <span className="morph-bar-label">—</span>
                <div className="morph-bar-track">
                  <div className="morph-bar-fill" />
                </div>
                <span className="morph-bar-num">0</span>
                <span className="morph-bar-unit">/día</span>
              </div>
            ))}
          </div>

          {/* Closing cards */}
          <div className="morph-cards">
            {[
              { k: 'Velocidad', t: 'De días a segundos', b: 'De ~1.5 días a ~15 seg: ~2.800×.' },
              { k: 'Escala', t: '315× más volumen', b: 'De 0.6 a 189 archivos/día.' },
              { k: 'Impacto', t: 'Equipo liberado', b: 'Sin trabajo manual repetitivo.' },
            ].map((c) => (
              <article key={c.k} className="morph-card">
                <span className="morph-card-k">{c.k}</span>
                <h3 className="morph-card-t">{c.t}</h3>
                <p className="morph-card-b">{c.b}</p>
              </article>
            ))}
          </div>

          <p className="morph-footnote">Benchmark constante · archivo de ~50 partidas</p>
        </div>

        {/* Scroll cue */}
        <div className="morph-cue">
          <span className="morph-cue-arrow">↓</span>
          <span>Scrollea para avanzar la historia</span>
        </div>
      </div>
    </div>
  )
}
