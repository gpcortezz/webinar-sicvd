'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const PIPELINE_STEPS = [
  { code: '01', title: 'Búsqueda de conocimiento', body: 'Localiza contexto y referencias útiles para el archivo.' },
  { code: '02', title: 'Generación de embeddings', body: 'Vectoriza el contenido en el espacio semántico.' },
  { code: '03', title: 'Recuperación semántica', body: 'Empareja el archivo con el conocimiento más relevante.' },
  { code: '04', title: 'Completación de datos', body: 'Rellena y consolida los campos del pedimento.' },
  { code: '05', title: 'Subida a plataforma', body: 'Publica el resultado en la plataforma.' },
] as const

const BENCH_ROWS = [
  { from: 'Manual', fromTime: '1.5 días', to: 'Beta', toTime: '50 min', delta: '14' },
  { from: 'Beta', fromTime: '50 min', to: 'Agosto', toTime: '6 – 7 min', delta: '7' },
  { from: 'Agosto', fromTime: '6 – 7 min', to: 'Programático', toTime: '15 seg', delta: '28' },
] as const

const VOL_ROWS = [
  { label: 'Beta', period: 'dic – feb', v: 0.6, pct: 0.3 },
  { label: 'Marzo', period: 'entrega', v: 10, pct: 5.3 },
  { label: 'Abr–Jul', period: 'operativo', v: 79, pct: 41.8 },
  { label: 'Agosto', period: 'pico', v: 189, pct: 100 },
] as const

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!root.current) return

    const ctx = gsap.context(() => {
      const track = document.querySelector<HTMLElement>('.h-track')!
      const panels = gsap.utils.toArray<HTMLElement>('.h-panel')
      const timelineFill = document.querySelector<HTMLElement>('.tl-fill')!
      const tlDots = gsap.utils.toArray<HTMLElement>('.tl-dot')

      // Horizontal scroll: vertical scroll → horizontal translate
      const totalWidth = track.scrollWidth - window.innerWidth

      const hScroll = gsap.to(track, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: '.h-wrapper',
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Timeline progress
            gsap.set(timelineFill, { scaleX: self.progress })

            // Activate dots
            const activeIndex = Math.min(
              panels.length - 1,
              Math.floor(self.progress * panels.length + 0.3)
            )
            tlDots.forEach((dot, i) => {
              dot.classList.toggle('is-active', i === activeIndex)
              dot.classList.toggle('is-past', i < activeIndex)
            })
          },
        },
      })

      // Per-panel entrance animations
      panels.forEach((panel) => {
        const els = panel.querySelectorAll<HTMLElement>('.pan-anim')
        gsap.set(els, { opacity: 0, y: 28 })

        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: hScroll,
          start: 'left 80%',
          onEnter: () => {
            gsap.to(els, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.08,
              ease: 'power3.out',
            })
          },
          once: true,
        })
      })

      // Hero counter
      ScrollTrigger.create({
        trigger: '.h-panel-hero',
        containerAnimation: hScroll,
        start: 'left 90%',
        once: true,
        onEnter: () => {
          const el = document.querySelector<HTMLElement>('.hero-sec-counter')
          if (!el) return
          const obj = { v: 0 }
          gsap.to(obj, {
            v: 15,
            duration: 1.0,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.v).toString() },
          })
          const multEl = document.querySelector<HTMLElement>('.hero-mult-counter')
          if (multEl) {
            const m = { v: 0 }
            gsap.to(m, {
              v: 2800,
              duration: 1.4,
              delay: 0.3,
              ease: 'power2.out',
              onUpdate: () => { multEl.textContent = Math.round(m.v).toLocaleString('es-ES') },
            })
          }
          gsap.fromTo('.hero-strike', { scaleX: 0 }, { scaleX: 1, duration: 0.5, delay: 0.6, ease: 'power2.inOut', transformOrigin: 'left' })
        },
      })

      // Pipeline fill
      ScrollTrigger.create({
        trigger: '.h-panel-pipe',
        containerAnimation: hScroll,
        start: 'left 70%',
        once: true,
        onEnter: () => {
          const steps = gsap.utils.toArray<HTMLElement>('.pipe-step')
          const fill = document.querySelector<HTMLElement>('.pipe-fill')
          steps.forEach((step, i) => {
            gsap.to(step, { opacity: 1, y: 0, duration: 0.45, delay: i * 0.15, ease: 'power3.out' })
          })
          if (fill) {
            gsap.to(fill, { scaleX: 1, duration: 1.8, delay: 0.2, ease: 'power3.out' })
          }
        },
      })

      // Benchmark counters
      ScrollTrigger.create({
        trigger: '.h-panel-bench',
        containerAnimation: hScroll,
        start: 'left 65%',
        once: true,
        onEnter: () => {
          gsap.utils.toArray<HTMLElement>('.bench-row').forEach((row, i) => {
            const numEl = row.querySelector<HTMLElement>('.bench-num')
            const target = Number(numEl?.dataset.target || '0')
            gsap.fromTo(row, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, delay: i * 0.2 })
            if (numEl) {
              const o = { v: 0 }
              gsap.to(o, {
                v: target,
                duration: 0.8,
                delay: i * 0.2 + 0.15,
                onUpdate: () => { numEl.textContent = Math.round(o.v).toString() },
              })
            }
          })
          const totalEl = document.querySelector<HTMLElement>('.bench-total-counter')
          if (totalEl) {
            const o = { v: 0 }
            gsap.to(o, {
              v: 2800,
              duration: 1.3,
              delay: 0.8,
              ease: 'power2.out',
              onUpdate: () => { totalEl.textContent = Math.round(o.v).toLocaleString('es-ES') },
            })
          }
        },
      })

      // Volume bars
      ScrollTrigger.create({
        trigger: '.h-panel-vol',
        containerAnimation: hScroll,
        start: 'left 65%',
        once: true,
        onEnter: () => {
          gsap.utils.toArray<HTMLElement>('.vol-row').forEach((row, i) => {
            const fill = row.querySelector<HTMLElement>('.vol-fill')
            const numEl = row.querySelector<HTMLElement>('.vol-num')
            const target = Number(fill?.dataset.pct || '0')
            const value = Number(numEl?.dataset.val || '0')
            gsap.fromTo(row, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.45, delay: i * 0.12 })
            if (fill) gsap.to(fill, { scaleX: target / 100, duration: 1.0, delay: i * 0.12 + 0.1, ease: 'power3.out' })
            if (numEl) {
              const o = { v: 0 }
              gsap.to(o, {
                v: value,
                duration: 1.0,
                delay: i * 0.12 + 0.12,
                ease: 'power2.out',
                onUpdate: () => { numEl.textContent = o.v < 10 ? o.v.toFixed(1) : Math.round(o.v).toString() },
              })
            }
          })
        },
      })

      // Closing counter
      ScrollTrigger.create({
        trigger: '.h-panel-close',
        containerAnimation: hScroll,
        start: 'left 65%',
        once: true,
        onEnter: () => {
          const el = document.querySelector<HTMLElement>('.close-counter')
          if (!el) return
          const o = { v: 0 }
          gsap.to(o, {
            v: 2800,
            duration: 1.6,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString('es-ES') },
          })
          gsap.utils.toArray<HTMLElement>('.close-card').forEach((c, i) => {
            gsap.fromTo(c, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.4 + i * 0.12 })
          })
        },
      })

    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <div ref={root}>
      <div className="h-wrapper">
        <div className="h-track">

          {/* ═══ PANEL 1 — HERO ═══ */}
          <section className="h-panel h-panel-hero">
            <div className="pan-inner">
              <p className="pan-anim pan-tag">Informe de transformación</p>
              <h1 className="pan-anim pan-hero-title">
                De días<br /><span className="pan-hero-em">a segundos</span>
              </h1>
              <p className="pan-anim pan-hero-sub">
                El mismo archivo de ~50 partidas: de 1.5 días laborales a un parpadeo.
              </p>
              <div className="pan-anim pan-hero-nums">
                <div className="pan-hero-before">
                  <span className="pan-hero-label">Antes</span>
                  <span className="pan-hero-big">
                    1.5 <span className="pan-hero-unit">días</span>
                    <span className="hero-strike" />
                  </span>
                </div>
                <span className="pan-hero-arrow">→</span>
                <div className="pan-hero-after">
                  <span className="pan-hero-label">Ahora</span>
                  <span className="pan-hero-big pan-hero-accent">
                    <span className="hero-sec-counter">0</span> <span className="pan-hero-unit">seg</span>
                  </span>
                </div>
              </div>
              <p className="pan-anim pan-hero-mult">
                <span className="hero-mult-counter">0</span><span className="pan-hero-mult-x">×</span>
                <span className="pan-hero-mult-label">más rápido</span>
              </p>
            </div>
            <div className="pan-scroll-hint pan-anim">
              <span className="pan-scroll-arrow">→</span> Scrollea para recorrer la historia
            </div>
          </section>

          {/* ═══ PANEL 2 — PIPELINE ═══ */}
          <section className="h-panel h-panel-pipe">
            <div className="pan-inner">
              <p className="pan-anim pan-kicker"><span className="pan-kicker-num">01</span> Pipeline del archivo</p>
              <h2 className="pan-anim pan-title">Cinco etapas, del conocimiento a la plataforma.</h2>
              <p className="pan-anim pan-lead">El flujo que transforma cada archivo en un pedimento listo.</p>
              <div className="pan-anim pipe-wrap">
                <div className="pipe-track"><div className="pipe-fill" /></div>
                <div className="pipe-steps">
                  {PIPELINE_STEPS.map((s) => (
                    <div key={s.code} className="pipe-step" style={{ opacity: 0, transform: 'translateY(12px)' }}>
                      <span className="pipe-code">{s.code}</span>
                      <span className="pipe-name">{s.title}</span>
                      <span className="pipe-desc">{s.body}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══ PANEL 3 — BENCHMARK ═══ */}
          <section className="h-panel h-panel-bench">
            <div className="pan-inner">
              <p className="pan-anim pan-kicker"><span className="pan-kicker-num">02</span> Benchmark</p>
              <h2 className="pan-anim pan-title">Mismo archivo, 4 momentos de medición.</h2>
              <p className="pan-anim pan-lead">Cada salto recorta el tiempo. El acumulado: ~2.800×.</p>
              <div className="pan-anim bench-wrap">
                {BENCH_ROWS.map((r, i) => (
                  <div key={i} className={`bench-row${i === BENCH_ROWS.length - 1 ? ' is-final' : ''}`} style={{ opacity: 0 }}>
                    <div className="bench-from">
                      <span className="bench-stage">{r.from}</span>
                      <span className="bench-time">{r.fromTime}</span>
                    </div>
                    <span className="bench-arrow">→</span>
                    <div className="bench-to">
                      <span className="bench-stage">{r.to}</span>
                      <span className="bench-time">{r.toTime}</span>
                    </div>
                    <span className="bench-delta">
                      −<span className="bench-num" data-target={r.delta}>0</span>×
                    </span>
                  </div>
                ))}
                <div className="bench-total pan-anim">
                  <span className="bench-total-label">Aceleración acumulada</span>
                  <span className="bench-total-val">~<span className="bench-total-counter">0</span>×</span>
                </div>
              </div>
            </div>
          </section>

          {/* ═══ PANEL 4 — VOLUME ═══ */}
          <section className="h-panel h-panel-vol">
            <div className="pan-inner">
              <p className="pan-anim pan-kicker"><span className="pan-kicker-num">03</span> Volumen diario</p>
              <h2 className="pan-anim pan-title">Más archivos por día en cada etapa.</h2>
              <p className="pan-anim pan-lead">
                La capacidad se multiplicó <span className="text-accent">~315×</span> en el pico.
              </p>
              <div className="pan-anim vol-wrap">
                {VOL_ROWS.map((r, i) => (
                  <div key={i} className={`vol-row${i === VOL_ROWS.length - 1 ? ' is-peak' : ''}`} style={{ opacity: 0 }}>
                    <span className="vol-label">{r.label}</span>
                    <div className="vol-bar">
                      <div className="vol-fill" data-pct={r.pct} />
                    </div>
                    <span className="vol-val">
                      <span className="vol-num" data-val={r.v}>0</span><span className="vol-unit">/día</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="pan-anim pan-note">
                <span className="text-accent">Nota:</span> ~189 archivos/día es un pico observado.
              </p>
            </div>
          </section>

          {/* ═══ PANEL 5 — CLOSING ═══ */}
          <section className="h-panel h-panel-close">
            <div className="pan-inner pan-inner-center">
              <p className="pan-anim pan-kicker"><span className="pan-kicker-num">04</span> El resultado</p>
              <div className="pan-anim close-hero">
                <span className="close-counter">0</span><span className="close-x">×</span>
              </div>
              <p className="pan-anim close-tag">
                De <span className="close-old">días</span> a <span className="text-accent">segundos</span>.
              </p>
              <div className="pan-anim close-cards">
                {[
                  { k: 'Velocidad', t: 'De días a segundos', b: 'De ~1.5 días a ~15 seg: ~2.800×.' },
                  { k: 'Escala', t: '315× más volumen', b: 'De 0.6 a 189 archivos por día.' },
                  { k: 'Impacto', t: 'Equipo liberado', b: 'Sin trabajo manual repetitivo.' },
                ].map((c) => (
                  <article key={c.k} className="close-card" style={{ opacity: 0 }}>
                    <span className="close-card-k">{c.k}</span>
                    <h3 className="close-card-t">{c.t}</h3>
                    <p className="close-card-b">{c.b}</p>
                  </article>
                ))}
              </div>
              <p className="pan-anim pan-foot">Benchmark constante · archivo de ~50 partidas</p>
            </div>
          </section>

        </div>

        {/* ── Timeline bar ─────────────────────── */}
        <div className="tl-bar">
          <div className="tl-track"><div className="tl-fill" /></div>
          <div className="tl-dots">
            {['Archivo', 'Pipeline', 'Medición', 'Volumen', 'Resultado'].map((l, i) => (
              <button key={l} className={`tl-dot${i === 0 ? ' is-active' : ''}`}>
                <span className="tl-pip" />
                <span className="tl-label">{l}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
