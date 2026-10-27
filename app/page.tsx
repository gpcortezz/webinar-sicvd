'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer)
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
  { label: 'Beta', period: 'dic – feb', v: 0.6, pct: 0.3, dots: 4 },
  { label: 'Marzo', period: 'entrega', v: 10, pct: 5.3, dots: 7 },
  { label: 'Abr–Jul', period: 'operativo', v: 79, pct: 41.8, dots: 12 },
  { label: 'Agosto', period: 'pico', v: 189, pct: 100, dots: 18 },
] as const

const PANEL_COUNT = 5

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!root.current) return

    const track = root.current.querySelector<HTMLElement>('.h-track')!
    const panels = gsap.utils.toArray<HTMLElement>('.h-panel')
    const timelineFill = root.current.querySelector<HTMLElement>('.tl-fill')!
    const tlDots = gsap.utils.toArray<HTMLElement>('.tl-dot')

    let current = 0
    let busy = false
    const played = new Set<number>()

    function setCounter(el: HTMLElement, target: number) {
      el.textContent = target < 10
        ? target.toFixed(1)
        : Math.round(target).toLocaleString('es-ES')
    }

    function counterUp(el: HTMLElement, target: number, duration = 1.0, delay = 0) {
      const o = { v: 0 }
      gsap.to(o, {
        v: target,
        duration,
        delay,
        ease: 'power2.out',
        onUpdate: () => setCounter(el, o.v),
        onComplete: () => setCounter(el, target),
      })
    }

    function playHero(animate = true) {
      const el = document.querySelector<HTMLElement>('.hero-sec-counter')
      const before = document.querySelector<HTMLElement>('.pan-hero-before')
      const after = document.querySelector<HTMLElement>('.pan-hero-after')
      const arrow = document.querySelector<HTMLElement>('.pan-hero-arrow')

      if (!animate) {
        if (el) setCounter(el, 15)
        gsap.set('.hero-strike', { scaleX: 1, transformOrigin: 'left' })
        gsap.set(before, { scale: 0.85, opacity: 0.7, transformOrigin: 'left top' })
        gsap.set(after, { scale: 1.55, opacity: 1, transformOrigin: 'left top' })
        gsap.set(arrow, { opacity: 1 })
        return
      }

      if (el) el.textContent = '0'
      gsap.set('.hero-strike', { scaleX: 0, transformOrigin: 'left' })
      gsap.set(before, { scale: 1.45, opacity: 1, transformOrigin: 'left top' })
      gsap.set(after, { scale: 0.72, opacity: 0.35, transformOrigin: 'left top' })
      gsap.set(arrow, { opacity: 0.2 })

      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } })

      // Hold "Antes" large — breathe before morph
      tl.to({}, { duration: 1.4 })

      // Soft strike, then crossfade scales (no bounce — clean ease)
      tl.to('.hero-strike', { scaleX: 1, duration: 0.7, ease: 'power2.out' }, 'morph')
      tl.to(before, { scale: 0.85, opacity: 0.7, duration: 1.55 }, 'morph+=0.08')
      tl.to(after, { scale: 1.55, opacity: 1, duration: 1.65 }, 'morph+=0.18')
      tl.to(arrow, { opacity: 1, duration: 0.9, ease: 'power1.out' }, 'morph+=0.35')

      if (el) {
        tl.call(() => counterUp(el, 15, 1.35), [], 'morph+=0.45')
      }
    }

    function playPipe(animate = true) {
      const steps = gsap.utils.toArray<HTMLElement>('.pipe-step')
      const fill = document.querySelector<HTMLElement>('.pipe-fill')
      const n = steps.length || 1

      if (animate) {
        steps.forEach((step, i) => {
          if (i === 0) step.classList.add('is-lit')
          else step.classList.remove('is-lit')
        })
        // First already on; rest dimmed
        gsap.set(steps[0], { opacity: 1, y: 0, scale: 1, overwrite: true })
        gsap.set(steps.slice(1), { opacity: 0.2, y: 0, scale: 1, overwrite: true })
        if (fill) gsap.set(fill, { scaleX: n > 0 ? 1 / n : 0 })

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
        // Hold with only first lit, then light 02→05 every 3s
        const hold = 3
        const gap = 3
        tl.to({}, { duration: hold })

        steps.slice(1).forEach((step, i) => {
          const at = hold + i * gap
          tl.to(
            step,
            {
              opacity: 1,
              duration: 0.65,
              onStart: () => step.classList.add('is-lit'),
            },
            at
          )
          if (fill) {
            tl.to(fill, { scaleX: (i + 2) / n, duration: 0.65 }, at)
          }
        })
      } else {
        steps.forEach((step) => step.classList.add('is-lit'))
        gsap.set(steps, { opacity: 1, y: 0, scale: 1 })
        if (fill) gsap.set(fill, { scaleX: 1 })
      }
    }

    function playBench(animate = true) {
      gsap.utils.toArray<HTMLElement>('.bench-row').forEach((row, i) => {
        const numEl = row.querySelector<HTMLElement>('.bench-num')
        const target = Number(numEl?.dataset.target || '0')
        if (animate) {
          gsap.fromTo(row,
            { opacity: 0, x: -24, scale: 0.95 },
            { opacity: 1, x: 0, scale: 1, duration: 0.55, delay: i * 0.18, ease: 'back.out(1.4)' }
          )
          if (numEl) counterUp(numEl, target, 0.8, i * 0.18 + 0.12)
        } else {
          gsap.set(row, { opacity: 1, x: 0, scale: 1 })
          if (numEl) setCounter(numEl, target)
        }
      })
    }

    function playVol(animate = true) {
      gsap.utils.toArray<HTMLElement>('.vol-row').forEach((row, i) => {
        const fill = row.querySelector<HTMLElement>('.vol-fill')
        const numEl = row.querySelector<HTMLElement>('.vol-num')
        const target = Number(fill?.dataset.pct || '0')
        const value = Number(numEl?.dataset.val || '0')
        if (animate) {
          gsap.fromTo(row,
            { opacity: 0, x: -18, scale: 0.96 },
            { opacity: 1, x: 0, scale: 1, duration: 0.5, delay: i * 0.1, ease: 'back.out(1.4)' }
          )
          if (fill) gsap.to(fill, { scaleX: target / 100, duration: 1.0, delay: i * 0.1 + 0.08, ease: 'power3.out' })
          if (numEl) counterUp(numEl, value, 1.0, i * 0.1 + 0.1)
        } else {
          gsap.set(row, { opacity: 1, x: 0, scale: 1 })
          if (fill) gsap.set(fill, { scaleX: target / 100 })
          if (numEl) setCounter(numEl, value)
        }
      })
    }

    function playClose(animate = true) {
      const el = document.querySelector<HTMLElement>('.close-counter')
      if (el) {
        if (animate) counterUp(el, 2800, 1.6)
        else setCounter(el, 2800)
      }
      gsap.utils.toArray<HTMLElement>('.close-card').forEach((c, i) => {
        if (animate) {
          gsap.fromTo(c,
            { opacity: 0, y: 24, scale: 0.94 },
            { opacity: 1, y: 0, scale: 1, duration: 0.55, delay: 0.35 + i * 0.12, ease: 'back.out(1.5)' }
          )
        } else {
          gsap.set(c, { opacity: 1, y: 0, scale: 1 })
        }
      })
    }

    const playFns = [playHero, playPipe, playBench, playVol, playClose]

    function animatePanelIn(index: number) {
      const panel = panels[index]
      if (!panel) return
      const els = panel.querySelectorAll<HTMLElement>('.pan-anim')
      const firstVisit = !played.has(index)
      played.add(index)

      gsap.fromTo(els,
        { opacity: 0, y: 40, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          overwrite: true,
        }
      )
      playFns[index]?.(firstVisit)
    }

    function animatePanelOut(index: number, direction: 1 | -1) {
      const panel = panels[index]
      if (!panel) return
      const els = panel.querySelectorAll<HTMLElement>('.pan-anim')
      // Solo fade visual — no resetear valores a 0
      gsap.to(els, {
        opacity: 0,
        y: direction > 0 ? -28 : 36,
        scale: 0.96,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power2.in',
        overwrite: true,
      })
    }

    function updateChrome(index: number) {
      gsap.to(timelineFill, {
        scaleX: (index + 1) / PANEL_COUNT,
        duration: 0.55,
        ease: 'power2.out',
      })
      tlDots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index)
        dot.classList.toggle('is-past', i < index)
      })
    }

    function goTo(index: number) {
      if (busy || index < 0 || index >= PANEL_COUNT || index === current) return
      busy = true

      const from = current
      const direction: 1 | -1 = index > from ? 1 : -1

      animatePanelOut(from, direction)

      gsap.to(track, {
        x: `${-index * 100}vw`,
        duration: 0.85,
        ease: 'power3.inOut',
        onComplete: () => {
          current = index
          animatePanelIn(index)
          busy = false
        },
      })

      updateChrome(index)
    }

    // Initial state: panel 0 visible
    panels.forEach((panel, i) => {
      const els = panel.querySelectorAll<HTMLElement>('.pan-anim')
      if (i === 0) {
        gsap.set(els, { opacity: 1, y: 0, scale: 1 })
      } else {
        gsap.set(els, { opacity: 0, y: 40, scale: 0.94 })
      }
    })
    gsap.set(track, { x: 0 })
    gsap.set(timelineFill, { scaleX: 1 / PANEL_COUNT, transformOrigin: 'left center' })
    played.add(0)
    playHero(true)

    const observer = Observer.create({
      target: window,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 40,
      preventDefault: true,
      onUp: () => goTo(current + 1),
      onDown: () => goTo(current - 1),
    })

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowRight', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        goTo(current + 1)
      }
      if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault()
        goTo(current - 1)
      }
    }
    window.addEventListener('keydown', onKey)

    const onDotClick = (e: Event) => {
      const btn = (e.currentTarget as HTMLElement)
      const idx = tlDots.indexOf(btn)
      if (idx >= 0) goTo(idx)
    }
    tlDots.forEach((dot) => {
      dot.style.cursor = 'pointer'
      dot.addEventListener('click', onDotClick)
    })

    return () => {
      observer.kill()
      window.removeEventListener('keydown', onKey)
      tlDots.forEach((dot) => dot.removeEventListener('click', onDotClick))
      gsap.killTweensOf(track)
    }
  }, [])

  return (
    <div ref={root}>
      <div className="h-wrapper">
        {/* Ambient field — fills empty space without competing */}
        <div className="h-ambient" aria-hidden>
          <div className="h-ambient-glow h-ambient-glow-a" />
          <div className="h-ambient-glow h-ambient-glow-b" />
          <div className="h-ambient-grid" />
          <svg className="h-ambient-rings" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <circle cx="980" cy="420" r="280" />
            <circle cx="980" cy="420" r="420" />
            <circle cx="160" cy="180" r="200" />
            <line x1="60" y1="640" x2="320" y2="640" />
          </svg>
        </div>

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
                  <div className="pan-hero-value">
                    <span className="pan-hero-big pan-hero-big-before">
                      1.5
                      <span className="hero-strike" />
                    </span>
                    <span className="pan-hero-unit">días</span>
                  </div>
                </div>
                <span className="pan-hero-arrow">→</span>
                <div className="pan-hero-after">
                  <span className="pan-hero-label">Ahora</span>
                  <div className="pan-hero-value">
                    <span className="pan-hero-big pan-hero-accent pan-hero-big-after">
                      <span className="hero-sec-counter">0</span>
                    </span>
                    <span className="pan-hero-unit pan-hero-unit-accent">segundos</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pan-scroll-hint pan-anim">
              <span className="pan-scroll-arrow">→</span> Un scroll = siguiente sección
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
                  {PIPELINE_STEPS.map((s, i) => (
                    <div
                      key={s.code}
                      className={`pipe-step${i === 0 ? ' is-lit' : ''}`}
                      style={{ opacity: i === 0 ? 1 : 0.2 }}
                    >
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
              <p className="pan-anim pan-lead">Cada salto recorta el tiempo frente a la etapa anterior.</p>
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
                <p className="bench-foot pan-anim">Mismo archivo · ~50 partidas · 4 mediciones</p>
              </div>
            </div>
          </section>

          {/* ═══ PANEL 4 — VOLUME ═══ */}
          <section className="h-panel h-panel-vol">
            <div className="pan-inner pan-inner-vol">
              <p className="pan-anim pan-kicker"><span className="pan-kicker-num">03</span> Volumen diario</p>
              <h2 className="pan-anim pan-title pan-title-vol">Más archivos por día en cada etapa.</h2>
              <p className="pan-anim pan-lead pan-lead-vol">
                La capacidad se multiplicó <span className="text-accent">~315×</span> en el pico.
              </p>
              <div className="pan-anim vol-wrap">
                {VOL_ROWS.map((r, i) => {
                  const speed = Math.max(1.0, 2.8 - i * 0.4)
                  return (
                    <div key={i} className={`vol-row${i === VOL_ROWS.length - 1 ? ' is-peak' : ''}`} style={{ opacity: 0 }}>
                      <div className="vol-meta">
                        <span className="vol-label">{r.label}</span>
                        <span className="vol-period">{r.period}</span>
                      </div>
                      <div className="vol-bar">
                        <div className="vol-fill" data-pct={r.pct}>
                          <div className="vol-flow" aria-hidden>
                            {Array.from({ length: r.dots }).map((_, d) => (
                              <span
                                key={d}
                                className="vol-flow-dot"
                                style={{
                                  animationDelay: `${(d * (speed / r.dots)).toFixed(2)}s`,
                                  animationDuration: `${speed}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="vol-val">
                        <span className="vol-num" data-val={r.v}>0</span>
                        <span className="vol-unit">archivos/día</span>
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="pan-anim pan-note">
                <span className="text-accent">Nota:</span> ~189 archivos/día es un pico observado, no un promedio sostenido.
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
                  { k: 'Velocidad', t: 'De días a segundos', b: 'El mismo archivo de ~50 partidas pasó de ~1.5 días a ~15 segundos.' },
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

        <div className="tl-bar">
          <div className="tl-track"><div className="tl-fill" /></div>
          <div className="tl-dots">
            {['Archivo', 'Pipeline', 'Medición', 'Volumen', 'Resultado'].map((l, i) => (
              <button key={l} type="button" className={`tl-dot${i === 0 ? ' is-active' : ''}`}>
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
