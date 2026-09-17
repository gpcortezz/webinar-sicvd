'use client'

import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer)
}

const PIPELINE_STEPS = [
  { code: '01', title: 'Búsqueda de conocimiento', body: 'Localiza contexto y referencias útiles para el archivo.' },
  { code: '02', title: 'Generación de embeddings', body: 'Vectoriza el contenido para compararlo en el espacio semántico.' },
  { code: '03', title: 'Recuperación semántica', body: 'Empareja el archivo con el conocimiento más relevante.' },
  { code: '04', title: 'Completación de datos', body: 'Rellena y consolida los campos necesarios del pedimento.' },
  { code: '05', title: 'Subida a plataforma', body: 'Publica el resultado en la plataforma de pedimentos.' },
] as const

const BENCH_ROWS = [
  { from: 'Manual', fromTime: '1.5 días', to: 'Beta', toTime: '50 min', delta: 14 },
  { from: 'Beta', fromTime: '50 min', to: 'Agosto', toTime: '6 – 7 min', delta: 7 },
  { from: 'Agosto', fromTime: '6 – 7 min', to: 'Programático', toTime: '15 seg', delta: 28 },
] as const

const VOL_ROWS = [
  { label: 'Beta', period: 'dic – feb', v: 0.6 },
  { label: 'Marzo', period: 'entrega', v: 10 },
  { label: 'Abr–Jul', period: 'operativo', v: 79 },
  { label: 'Agosto', period: 'pico', v: 189 },
] as const

const SCENE_COLORS = ['#0c0a08', '#0f0d0a', '#110e09', '#140e08', '#180c06'] as const
const SCENE_IDS = ['hero', 'pipeline', 'benchmark', 'volume', 'closing'] as const
const SCENE_LABELS = ['Archivo', 'Pipeline', 'Medición', 'Volumen', 'Resultado'] as const

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)
  const current = useRef(0)
  const busy = useRef(false)
  const played = useRef(new Set<number>())

  const goTo = useCallback((index: number) => {
    if (busy.current) return
    const scenes = document.querySelectorAll<HTMLElement>('.scene')
    if (index < 0 || index >= scenes.length || index === current.current) return
    busy.current = true

    const from = current.current
    const to = index
    const direction = to > from ? 1 : -1
    const leaving = scenes[from]!
    const entering = scenes[to]!

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        current.current = to
        busy.current = false
      },
    })

    const leavingEls = leaving.querySelectorAll<HTMLElement>('.scene-el')
    const enteringEls = entering.querySelectorAll<HTMLElement>('.scene-el')

    gsap.set(entering, { visibility: 'visible', zIndex: 2 })
    gsap.set(leaving, { zIndex: 1 })
    gsap.set(enteringEls, { opacity: 0, y: direction * 60, scale: 0.97 })

    tl.to(leavingEls, {
      opacity: 0,
      y: direction * -50,
      scale: 0.97,
      duration: 0.55,
      stagger: 0.04,
    }, 0)

    tl.to('.cinema-bg', {
      backgroundColor: SCENE_COLORS[to],
      duration: 0.65,
    }, 0.15)

    tl.set(leaving, { visibility: 'hidden', zIndex: 0 }, 0.55)

    tl.to(enteringEls, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.65,
      stagger: 0.06,
    }, 0.35)

    tl.call(() => {
      document.querySelectorAll('.nav-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === to)
        d.classList.toggle('is-past', i < to)
      })
    }, [], 0.35)

    const prog = document.querySelector<HTMLElement>('.cinema-progress-fill')
    if (prog) {
      tl.to(prog, {
        scaleX: (to + 1) / scenes.length,
        duration: 0.5,
        ease: 'power2.out',
      }, 0.15)
    }

    if (!played.current.has(to)) {
      played.current.add(to)
      tl.call(() => playScene(to), [], 0.7)
    }
  }, [])

  useEffect(() => {
    if (!root.current) return

    const scenes = root.current.querySelectorAll<HTMLElement>('.scene')
    scenes.forEach((s, i) => {
      gsap.set(s, { visibility: i === 0 ? 'visible' : 'hidden', zIndex: i === 0 ? 2 : 0 })
    })

    const observer = Observer.create({
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 35,
      preventDefault: true,
      onUp: () => goTo(current.current + 1),
      onDown: () => goTo(current.current - 1),
    })

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        goTo(current.current + 1)
      }
      if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        goTo(current.current - 1)
      }
    }
    window.addEventListener('keydown', onKey)

    played.current.add(0)
    playScene(0)

    return () => {
      observer.kill()
      window.removeEventListener('keydown', onKey)
    }
  }, [goTo])

  return (
    <div ref={root} className="cinema-root">
      <div className="cinema-bg" style={{ backgroundColor: SCENE_COLORS[0] }} />
      <div className="cinema-grain" aria-hidden />

      {/* Progress bar */}
      <div className="cinema-progress">
        <div className="cinema-progress-fill" />
      </div>

      {/* Side nav dots */}
      <nav className="cinema-nav" aria-label="Escenas">
        {SCENE_IDS.map((id, i) => (
          <button
            key={id}
            className={`nav-dot${i === 0 ? ' is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={SCENE_LABELS[i]}
          >
            <span className="nav-dot-pip" />
            <span className="nav-dot-label">{SCENE_LABELS[i]}</span>
          </button>
        ))}
      </nav>

      {/* ═══ SCENE 0 — HERO ═══ */}
      <section className="scene scene-hero" data-scene="0">
        <div className="scene-layout scene-layout-hero">
          <p className="scene-el hero-tag">Informe de transformación · ~50 partidas</p>
          <h1 className="scene-el hero-headline">
            De días<br />
            <span className="hero-headline-em">a segundos</span>
          </h1>
          <div className="scene-el hero-numbers">
            <div className="hero-before">
              <span className="hero-num-label">Antes</span>
              <span className="hero-num-big">1.5 <span className="hero-num-unit">días</span></span>
              <span className="hero-strike-line" />
            </div>
            <span className="hero-arrow">→</span>
            <div className="hero-after">
              <span className="hero-num-label">Ahora</span>
              <span className="hero-num-big hero-num-accent"><span className="hero-counter">0</span> <span className="hero-num-unit">seg</span></span>
            </div>
          </div>
          <div className="scene-el hero-multiplier">
            <span className="hero-mult-num">0</span>
            <span className="hero-mult-x">×</span>
            <span className="hero-mult-label">más rápido</span>
          </div>
          <p className="scene-el hero-cue">
            <span className="hero-cue-arrow">↓</span>
            Usa scroll o flechas para avanzar
          </p>
        </div>
      </section>

      {/* ═══ SCENE 1 — PIPELINE ═══ */}
      <section className="scene scene-pipeline" data-scene="1">
        <div className="scene-layout">
          <p className="scene-el scene-kicker"><span className="kicker-num">01</span> Pipeline del archivo</p>
          <h2 className="scene-el scene-title">Cinco etapas, del conocimiento a la plataforma.</h2>
          <div className="scene-el pipe-timeline">
            <div className="pipe-line" aria-hidden>
              <div className="pipe-line-fill" />
              <div className="pipe-traveler" />
            </div>
            <ol className="pipe-stops">
              {PIPELINE_STEPS.map((step) => (
                <li key={step.code} className="pipe-stop">
                  <span className="pipe-stop-dot" />
                  <span className="pipe-stop-code">{step.code}</span>
                  <span className="pipe-stop-title">{step.title}</span>
                  <span className="pipe-stop-body">{step.body}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className="scene-el scene-footnote">Señal en tránsito · 5 etapas encadenadas</p>
        </div>
      </section>

      {/* ═══ SCENE 2 — BENCHMARK ═══ */}
      <section className="scene scene-benchmark" data-scene="2">
        <div className="scene-layout">
          <p className="scene-el scene-kicker"><span className="kicker-num">02</span> Benchmark constante</p>
          <h2 className="scene-el scene-title">El mismo archivo, medido en 4 momentos.</h2>
          <div className="scene-el bench-rows">
            {BENCH_ROWS.map((row, i) => (
              <div
                key={i}
                className={`bench-row${i === BENCH_ROWS.length - 1 ? ' is-final' : ''}`}
                data-delta={row.delta}
              >
                <div className="bench-from">
                  <span className="bench-stage">{row.from}</span>
                  <span className="bench-time">{row.fromTime}</span>
                </div>
                <span className="bench-arrow">→</span>
                <div className="bench-to">
                  <span className="bench-stage">{row.to}</span>
                  <span className="bench-time">{row.toTime}</span>
                </div>
                <span className="bench-delta">−<span className="bench-delta-num">0</span>×</span>
              </div>
            ))}
          </div>
          <div className="scene-el bench-total">
            <span className="bench-total-label">Aceleración acumulada</span>
            <span className="bench-total-value">~<span className="bench-total-num">0</span>×</span>
          </div>
        </div>
      </section>

      {/* ═══ SCENE 3 — VOLUME ═══ */}
      <section className="scene scene-volume" data-scene="3">
        <div className="scene-layout">
          <p className="scene-el scene-kicker"><span className="kicker-num">03</span> Volumen diario</p>
          <h2 className="scene-el scene-title">Más archivos por día en cada etapa.</h2>
          <div className="scene-el vol-rows">
            {VOL_ROWS.map((row, i) => {
              const pct = Math.max((row.v / 189) * 100, 3)
              return (
                <div key={i} className={`vol-row${i === VOL_ROWS.length - 1 ? ' is-peak' : ''}`}>
                  <span className="vol-label">{row.label}</span>
                  <div className="vol-track">
                    <div className="vol-fill" data-target={pct} />
                  </div>
                  <span className="vol-value">
                    <span className="vol-num" data-value={row.v}>0</span>
                    <span className="vol-unit">/día</span>
                  </span>
                </div>
              )
            })}
          </div>
          <p className="scene-el scene-footnote">
            <span className="text-accent">Nota:</span> ~189 archivos/día es un pico observado.
          </p>
        </div>
      </section>

      {/* ═══ SCENE 4 — CLOSING ═══ */}
      <section className="scene scene-closing" data-scene="4">
        <div className="scene-layout scene-layout-closing">
          <p className="scene-el scene-kicker"><span className="kicker-num">04</span> El resultado</p>
          <div className="scene-el closing-mega">
            <span className="closing-mega-num">0</span>
            <span className="closing-mega-x">×</span>
          </div>
          <p className="scene-el closing-tag">
            De <span className="closing-tag-old">días</span> a <span className="closing-tag-new">segundos</span>.
          </p>
          <div className="scene-el closing-cards">
            {[
              { k: 'Velocidad', t: 'De días a segundos', b: 'De ~1.5 días a ~15 seg: una aceleración de ~2.800×.' },
              { k: 'Escala', t: '315× más volumen', b: 'De 0.6 a 189 archivos por día mientras el tiempo se desplomaba.' },
              { k: 'Impacto', t: 'Capacidad liberada', b: 'El equipo queda libre del trabajo manual para tareas de mayor valor.' },
            ].map((c) => (
              <article key={c.k} className="closing-card">
                <span className="closing-card-k">{c.k}</span>
                <h3 className="closing-card-t">{c.t}</h3>
                <p className="closing-card-b">{c.b}</p>
              </article>
            ))}
          </div>
          <p className="scene-el closing-foot">Benchmark constante · archivo de ~50 partidas</p>
        </div>
      </section>
    </div>
  )
}

function playScene(index: number) {
  switch (index) {
    case 0: playHero(); break
    case 1: playPipeline(); break
    case 2: playBenchmark(); break
    case 3: playVolume(); break
    case 4: playClosing(); break
  }
}

function animateCounter(el: HTMLElement, target: number, duration = 1.2) {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      el.textContent = target < 10
        ? obj.val.toFixed(1)
        : Math.round(obj.val).toLocaleString('es-ES')
    },
  })
}

function playHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.fromTo('.hero-tag', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1)
  tl.fromTo('.hero-headline', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.85 }, 0.25)
  tl.fromTo('.hero-numbers', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 0.55)
  tl.fromTo('.hero-strike-line', { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'power2.inOut' }, 0.95)

  const counter = document.querySelector<HTMLElement>('.hero-counter')
  if (counter) {
    tl.call(() => animateCounter(counter, 15, 0.9), [], 1.0)
  }

  tl.fromTo('.hero-multiplier', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65 }, 1.2)
  const multEl = document.querySelector<HTMLElement>('.hero-mult-num')
  if (multEl) {
    tl.call(() => animateCounter(multEl, 2800, 1.4), [], 1.25)
  }

  tl.fromTo('.hero-cue', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 2.2)
  gsap.to('.hero-cue-arrow', { y: 5, duration: 0.85, ease: 'sine.inOut', yoyo: true, repeat: -1 })
}

function playPipeline() {
  const stops = gsap.utils.toArray<HTMLElement>('.pipe-stop')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  gsap.set('.pipe-line-fill', { scaleX: 0, transformOrigin: 'left center' })
  gsap.set('.pipe-traveler', { left: '0%', opacity: 0 })
  gsap.set(stops, { opacity: 0.2 })

  stops.forEach((stop, i) => {
    const pct = stops.length <= 1 ? 0 : i / (stops.length - 1)
    const t = 0.3 + i * 0.55

    tl.to('.pipe-line-fill', { scaleX: (i + 1) / stops.length, duration: 0.45 }, t)
    tl.to('.pipe-traveler', { left: `${pct * 100}%`, opacity: 1, duration: 0.4 }, t)
    tl.to(stop, { opacity: 1, duration: 0.35 }, t + 0.1)

    const dot = stop.querySelector('.pipe-stop-dot')
    if (dot) {
      tl.fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, t + 0.15)
    }
  })
}

function playBenchmark() {
  const rows = gsap.utils.toArray<HTMLElement>('.bench-row')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  rows.forEach((row, i) => {
    const deltaEl = row.querySelector<HTMLElement>('.bench-delta-num')
    const target = Number(row.getAttribute('data-delta') || '0')

    tl.fromTo(row, { opacity: 0, x: -28 }, { opacity: 1, x: 0, duration: 0.55 }, i * 0.35)
    if (deltaEl) tl.call(() => animateCounter(deltaEl, target, 0.7), [], i * 0.35 + 0.15)
  })

  const totalEl = document.querySelector<HTMLElement>('.bench-total-num')
  const totalWrap = document.querySelector<HTMLElement>('.bench-total')
  if (totalWrap && totalEl) {
    tl.fromTo(totalWrap, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 }, '-=0.1')
    tl.call(() => animateCounter(totalEl, 2800, 1.3), [], '-=0.05')
  }
}

function playVolume() {
  const rows = gsap.utils.toArray<HTMLElement>('.vol-row')
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  rows.forEach((row, i) => {
    const fill = row.querySelector<HTMLElement>('.vol-fill')
    const num = row.querySelector<HTMLElement>('.vol-num')
    const target = Number(fill?.getAttribute('data-target') || '0')
    const value = Number(num?.getAttribute('data-value') || '0')

    tl.fromTo(row, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, i * 0.18)
    if (fill) {
      tl.fromTo(fill, { scaleX: 0 }, {
        scaleX: target / 100,
        duration: 1.0,
        ease: 'power3.out',
        transformOrigin: 'left center',
      }, i * 0.18 + 0.1)
    }
    if (num) tl.call(() => animateCounter(num, value, 1.0), [], i * 0.18 + 0.12)
  })
}

function playClosing() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  const megaNum = document.querySelector<HTMLElement>('.closing-mega-num')
  tl.fromTo('.closing-mega', { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 }, 0.1)
  if (megaNum) tl.call(() => animateCounter(megaNum, 2800, 1.6), [], 0.2)

  tl.fromTo('.closing-tag', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.7)

  const cards = gsap.utils.toArray<HTMLElement>('.closing-card')
  tl.fromTo(cards, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.12 }, 1.0)

  tl.fromTo('.closing-foot', { opacity: 0 }, { opacity: 1, duration: 0.45 }, 1.5)
}
