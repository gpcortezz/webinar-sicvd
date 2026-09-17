'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { Hero } from '@/components/hero'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const STORY_BEATS = [
  { id: 'hero', label: 'Archivo', meta: '~50 partidas', code: '00' },
  { id: 'pipeline', label: 'Pipeline', meta: '5 etapas', code: '01' },
  { id: 'benchmark', label: 'Medición', meta: '4 momentos', code: '02' },
  { id: 'volume', label: 'Volumen', meta: 'capacidad ×día', code: '03' },
  { id: 'closing', label: 'Resultado', meta: '~2.800×', code: '04' },
] as const

const ATM_COLORS: Array<[number, number, number]> = [
  [18, 16, 14],
  [22, 18, 14],
  [26, 20, 14],
  [28, 18, 12],
  [32, 16, 10],
]

const PIPELINE_STEPS = [
  {
    code: '01',
    title: 'Búsqueda de conocimiento',
    body: 'Localiza contexto y referencias útiles para el archivo.',
  },
  {
    code: '02',
    title: 'Generación de embeddings',
    body: 'Vectoriza el contenido para compararlo en el espacio semántico.',
  },
  {
    code: '03',
    title: 'Recuperación semántica',
    body: 'Empareja el archivo con el conocimiento más relevante.',
  },
  {
    code: '04',
    title: 'Completación de datos',
    body: 'Rellena y consolida los campos necesarios del pedimento.',
  },
  {
    code: '05',
    title: 'Subida a plataforma',
    body: 'Publica el resultado en la plataforma de pedimentos.',
  },
] as const

const BENCH_ROWS = [
  { from: 'Manual', fromTime: '1.5 días', to: 'Beta', toTime: '50 min', delta: 14 },
  { from: 'Beta', fromTime: '50 min', to: 'Agosto', toTime: '6 – 7 min', delta: 7 },
  { from: 'Agosto', fromTime: '6 – 7 min', to: 'Programático', toTime: '15 seg', delta: 28, accent: true },
] as const

const VOL_ROWS = [
  { label: 'Beta', period: 'dic – feb', v: 0.6 },
  { label: 'Marzo', period: 'entrega', v: 10 },
  { label: 'Abr–Jul', period: 'operativo', v: 79 },
  { label: 'Agosto', period: 'pico', v: 189, accent: true },
] as const

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!root.current) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const played = new Set<string>()

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section[data-section]')
      const progress = document.querySelector<HTMLElement>('.progress-bar')
      const atmosphere = document.querySelector<HTMLElement>('.atmosphere')
      const beatLinks = gsap.utils.toArray<HTMLAnchorElement>('.story-beat')

      const updateChrome = (index: number) => {
        const section = sections[index]
        if (!section) return
        const id = section.id
        const p = sections.length <= 1 ? 0 : index / (sections.length - 1)
        if (progress) gsap.to(progress, { scaleX: p, duration: 0.35, ease: 'power2.out' })
        const c = ATM_COLORS[index] ?? ATM_COLORS[0]!
        if (atmosphere) {
          gsap.to(atmosphere, {
            backgroundColor: `rgb(${c[0]},${c[1]},${c[2]})`,
            duration: 0.6,
            ease: 'power1.out',
          })
        }
        beatLinks.forEach((a) => {
          const beatIndex = Number(a.dataset.index ?? -1)
          a.classList.toggle('is-active', beatIndex === index)
          a.classList.toggle('is-past', beatIndex >= 0 && beatIndex < index)
          a.classList.toggle('is-closing', id === 'closing' && beatIndex === index)
        })
      }

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => updateChrome(index),
          onEnterBack: () => updateChrome(index),
        })
      })

      beatLinks.forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          const id = a.getAttribute('href')?.slice(1)
          const target = id ? document.getElementById(id) : null
          if (target) lenis.scrollTo(target, { offset: 0, duration: 1.2 })
        })
      })

      // ── Hero entrance ────────────────────────────────────
      gsap.set('.hero-old-num', { opacity: 0, y: 24 })
      gsap.set('.hero-new-wrap', { opacity: 0, y: 28 })
      gsap.set('.hero-piece', { opacity: 0, y: 18 })
      gsap.set('.hero-compress-track', { scaleX: 0.04, transformOrigin: 'left center' })

      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .to('.ed-hero-brand', { opacity: 1, y: 0, duration: 0.7 }, 0.15)
        .to('.ed-hero-title', { opacity: 1, y: 0, duration: 0.85 }, 0.28)
        .to('.ed-hero-lead', { opacity: 1, y: 0, duration: 0.7 }, 0.45)
        .to('.hero-old-num', { opacity: 1, y: 0, duration: 0.7 }, 0.7)
        .to('.hero-strike', { width: '100%', duration: 0.55, ease: 'power2.inOut' }, 1.15)
        .to('.hero-new-wrap', { opacity: 1, y: 0, duration: 0.75 }, 1.35)

      const heroNewEl = document.querySelector<HTMLElement>('.hero-new-num')
      if (heroNewEl) {
        const obj = { val: 0 }
        heroTl.to(obj, {
          val: 15,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            heroNewEl.textContent = String(Math.round(obj.val))
          },
        }, 1.4)
      }

      const heroMultEl = document.querySelector<HTMLElement>('.hero-mult')
      if (heroMultEl) {
        const heroMult = { val: 0 }
        heroTl.to(heroMult, {
          val: 2800,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => {
            heroMultEl.textContent = Math.round(heroMult.val).toLocaleString('es-ES')
          },
        }, 1.55)
      }

      heroTl
        .to('.ed-hero-bar', { opacity: 1, y: 0, duration: 0.6 }, 1.5)
        .to('.hero-compress-track', { scaleX: 1, duration: 1.6, ease: 'power3.inOut' }, 1.55)
        .to('.hero-scroll-cue', { opacity: 1, y: 0, duration: 0.6 }, 2.6)

      gsap.to('.hero-scroll-arrow', {
        y: 6,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // ── Section reveals ──────────────────────────────────
      gsap.utils.toArray<HTMLElement>('.ed-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          }
        )
      })

      // ── Pipeline step activation (CSS sticky head) ───────
      const pipeSteps = gsap.utils.toArray<HTMLElement>('.ed-pipe-step')
      const pipeProgress = document.querySelector<HTMLElement>('.ed-pipe-progress')

      if (pipeSteps.length) {
        gsap.set(pipeSteps, { opacity: 0.28 })
        gsap.set(pipeSteps[0]!, { opacity: 1 })
        pipeSteps[0]?.classList.add('is-active')

        pipeSteps.forEach((step, i) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter: () => activatePipe(i),
            onEnterBack: () => activatePipe(i),
          })
        })

        function activatePipe(i: number) {
          pipeSteps.forEach((s, j) => {
            s.classList.toggle('is-active', j === i)
            gsap.to(s, { opacity: j === i ? 1 : 0.28, duration: 0.35 })
          })
          if (pipeProgress) {
            gsap.to(pipeProgress, {
              scaleY: (i + 1) / pipeSteps.length,
              duration: 0.4,
              ease: 'power2.out',
            })
          }
        }
      }

      // ── Benchmark counters ───────────────────────────────
      ScrollTrigger.create({
        trigger: '#benchmark',
        start: 'top 60%',
        once: true,
        onEnter: () => {
          if (played.has('benchmark')) return
          played.add('benchmark')

          const rows = gsap.utils.toArray<HTMLElement>('.ed-bench-row')
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

          rows.forEach((row, i) => {
            const deltaEl = row.querySelector<HTMLElement>('.bench-delta-num')
            const target = Number(row.getAttribute('data-delta') || '0')
            const obj = { val: 0 }
            const at = i * 0.35

            tl.fromTo(
              row,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: 0.55 },
              at
            )

            if (deltaEl) {
              tl.to(
                obj,
                {
                  val: target,
                  duration: 0.85,
                  onUpdate: () => {
                    deltaEl.textContent = String(Math.round(obj.val))
                  },
                },
                at + 0.15
              )
            }
          })

          const totalEl = document.querySelector<HTMLElement>('.bench-total-num')
          const totalWrap = document.querySelector<HTMLElement>('.ed-bench-total')
          if (totalWrap && totalEl) {
            const totalObj = { val: 0 }
            tl.fromTo(
              totalWrap,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.6 },
              '-=0.2'
            )
            tl.to(
              totalObj,
              {
                val: 2800,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => {
                  totalEl.textContent = Math.round(totalObj.val).toLocaleString('es-ES')
                },
              },
              '-=0.4'
            )
          }
        },
      })

      // ── Volume bars ──────────────────────────────────────
      ScrollTrigger.create({
        trigger: '#volume',
        start: 'top 55%',
        once: true,
        onEnter: () => {
          if (played.has('volume')) return
          played.add('volume')

          gsap.utils.toArray<HTMLElement>('.ed-vol-row').forEach((row, i) => {
            const fill = row.querySelector<HTMLElement>('.ed-vol-fill')
            const counter = row.querySelector<HTMLElement>('.vol-counter')
            const target = Number(fill?.getAttribute('data-target') || '0')
            const value = Number(counter?.getAttribute('data-value') || '0')

            gsap.fromTo(
              row,
              { opacity: 0, x: -24 },
              {
                opacity: 1,
                x: 0,
                duration: 0.55,
                delay: i * 0.12,
                ease: 'power3.out',
              }
            )

            if (fill) {
              gsap.fromTo(
                fill,
                { scaleX: 0 },
                {
                  scaleX: target / 100,
                  duration: 1.2,
                  delay: i * 0.12 + 0.15,
                  ease: 'power3.out',
                  transformOrigin: 'left center',
                }
              )
            }

            if (counter) {
              const obj = { val: 0 }
              gsap.to(obj, {
                val: value,
                duration: 1.2,
                delay: i * 0.12 + 0.15,
                ease: 'power2.out',
                onUpdate: () => {
                  const n = obj.val
                  counter.textContent = n < 10 ? n.toFixed(1) : String(Math.round(n))
                },
              })
            }
          })
        },
      })

      // ── Closing counter ──────────────────────────────────
      ScrollTrigger.create({
        trigger: '#closing',
        start: 'top 55%',
        once: true,
        onEnter: () => {
          if (played.has('closing')) return
          played.add('closing')

          const counter = document.querySelector<HTMLElement>('.closing-counter')
          if (!counter) return
          const obj = { val: 0 }
          gsap.to(obj, {
            val: 2800,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = Math.round(obj.val).toLocaleString('es-ES')
            },
          })

          gsap.fromTo(
            '.ed-closing-num',
            { scale: 0.92, opacity: 0.4 },
            { scale: 1, opacity: 1, duration: 1.1, ease: 'power3.out' }
          )

          gsap.fromTo(
            '.ed-closing-card',
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.12,
              ease: 'power3.out',
              delay: 0.35,
            }
          )
        },
      })

      gsap.set(progress, { scaleX: 0 })
      updateChrome(0)
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, root)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={root} className="relative w-full bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div className="progress-bar h-full origin-left scale-x-0 bg-gradient-to-r from-turquoise via-orange to-orange" />
      </div>

      <div className="atmosphere fixed inset-0 z-0 bg-[rgb(18,16,14)]" aria-hidden />
      <div className="ed-grain fixed inset-0 z-0 pointer-events-none" aria-hidden />

      <aside className="ed-nav" aria-label="Capítulos">
        <ol className="ed-nav-list">
          {STORY_BEATS.map((beat, i) => (
            <li key={beat.id}>
              <a
                href={`#${beat.id}`}
                className={`story-beat ed-nav-link${i === 0 ? ' is-active' : ''}`}
                data-index={i}
              >
                <span className="ed-nav-code">{beat.code}</span>
                <span className="ed-nav-label">{beat.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <main className="relative z-10">
        {/* ── HERO ───────────────────────────────────────── */}
        <section id="hero" data-section className="ed-section ed-section-hero">
          <Hero />
        </section>

        {/* ── PIPELINE ──────────────────────────────────── */}
        <section id="pipeline" data-section className="ed-section ed-pipe-chapter">
          <div className="ed-pipe-sticky">
            <div className="ed-chapter-head ed-reveal">
              <p className="ed-kicker">
                <span className="text-orange">01</span>
                Pipeline del archivo
              </p>
              <h2 className="ed-title">Cinco etapas, del conocimiento a la plataforma.</h2>
              <p className="ed-lead">
                El flujo automatizado que transforma cada archivo en un pedimento listo para subir.
              </p>
            </div>
            <div className="ed-pipe-rail" aria-hidden>
              <div className="ed-pipe-progress" />
            </div>
          </div>

          <ol className="ed-pipe-steps">
            {PIPELINE_STEPS.map((step) => (
              <li key={step.code} className="ed-pipe-step">
                <span className="ed-pipe-code">{step.code}</span>
                <div className="ed-pipe-copy">
                  <h3 className="ed-pipe-title">{step.title}</h3>
                  <p className="ed-pipe-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── BENCHMARK ─────────────────────────────────── */}
        <section id="benchmark" data-section className="ed-section">
          <div className="ed-chapter-head ed-reveal">
            <p className="ed-kicker">
              <span className="text-orange">02</span>
              Benchmark constante
            </p>
            <h2 className="ed-title">El mismo archivo de ~50 partidas, medido en 4 momentos.</h2>
            <p className="ed-lead">
              Cada salto recorta el tiempo frente a la etapa anterior. Al final, el acumulado es ~2.800×.
            </p>
          </div>

          <div className="ed-bench">
            {BENCH_ROWS.map((row) => (
              <div
                key={`${row.from}-${row.to}`}
                className={`ed-bench-row${'accent' in row && row.accent ? ' is-accent' : ''}`}
                data-delta={row.delta}
                style={{ opacity: 0 }}
              >
                <div className="ed-bench-side">
                  <span className="ed-bench-stage">{row.from}</span>
                  <span className="ed-bench-time">{row.fromTime}</span>
                </div>
                <div className="ed-bench-delta">
                  −<span className="bench-delta-num tabular">0</span>×
                </div>
                <div className="ed-bench-side is-to">
                  <span className="ed-bench-stage">{row.to}</span>
                  <span className="ed-bench-time">{row.toTime}</span>
                </div>
              </div>
            ))}

            <div className="ed-bench-total" style={{ opacity: 0 }}>
              <div>
                <p className="ed-bench-total-label">Aceleración acumulada</p>
                <p className="ed-bench-total-sub">Manual → Programático · mismo archivo</p>
              </div>
              <p className="ed-bench-total-value">
                ~<span className="bench-total-num tabular">0</span>×
              </p>
            </div>
          </div>
        </section>

        {/* ── VOLUME ───────────────────────────────────── */}
        <section id="volume" data-section className="ed-section">
          <div className="ed-chapter-head ed-reveal">
            <p className="ed-kicker">
              <span className="text-orange">03</span>
              Volumen diario
            </p>
            <h2 className="ed-title">Más archivos por día en cada etapa.</h2>
            <p className="ed-lead">
              Mientras el tiempo por archivo caía, la capacidad diaria se multiplicó por{' '}
              <span className="text-orange font-semibold">~315×</span>.
            </p>
          </div>

          <div className="ed-vol">
            {VOL_ROWS.map((row) => {
              const pct = Math.max((row.v / 189) * 100, 3)
              return (
                <div
                  key={row.label}
                  className={`ed-vol-row${row.accent ? ' is-accent' : ''}`}
                  style={{ opacity: 0 }}
                >
                  <div className="ed-vol-meta">
                    <span className="ed-vol-label">{row.label}</span>
                    <span className="ed-vol-period">{row.period}</span>
                  </div>
                  <div className="ed-vol-track">
                    <div
                      className={`ed-vol-fill${row.accent ? ' is-accent' : ''}`}
                      data-target={pct}
                    />
                  </div>
                  <div className="ed-vol-value">
                    <span
                      data-value={row.v}
                      className={`vol-counter tabular${row.accent ? ' text-orange' : ''}`}
                    >
                      0
                    </span>
                    <span className="ed-vol-unit">/día</span>
                  </div>
                </div>
              )
            })}
            <p className="ed-vol-note ed-reveal">
              <span className="text-orange">Nota:</span> los ~189 archivos/día son un pico observado, no un promedio sostenido ni una capacidad garantizada.
            </p>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────── */}
        <section id="closing" data-section className="ed-section ed-section-closing">
          <div className="ed-chapter-head ed-reveal">
            <p className="ed-kicker">
              <span className="text-orange">04</span>
              El resultado
            </p>
            <h2 className="ed-title">De días a segundos: el salto completo.</h2>
            <p className="ed-lead">
              Misma referencia de ~50 partidas. El tiempo se colapsó y liberó capacidad del equipo.
            </p>
          </div>

          <div className="ed-closing-num ed-reveal">
            <p className="ed-closing-label">Aceleración total</p>
            <p className="ed-closing-value">
              <span className="closing-counter tabular">0</span>
              <span className="ed-closing-x">×</span>
            </p>
            <p className="ed-closing-tag">
              De <span className="line-through decoration-orange/50 text-ink-muted">días</span> a{' '}
              <span className="text-orange">segundos</span>.
            </p>
          </div>

          <div className="ed-closing-grid">
            {[
              {
                kicker: 'Velocidad',
                title: 'De días a segundos',
                body: 'El mismo archivo de ~50 partidas pasó de ~1.5 días a ~15 segundos: una aceleración de ~2.800×.',
              },
              {
                kicker: 'Escala',
                title: 'Más volumen, menos tiempo',
                body: 'De 0.6 a 189 archivos por día (~315×), mientras el tiempo por archivo se desplomaba.',
              },
              {
                kicker: 'Impacto',
                title: 'Capacidad liberada',
                body: 'El equipo de documentación queda libre del trabajo manual y puede enfocarse en tareas de mayor valor.',
              },
            ].map((c) => (
              <article key={c.kicker} className="ed-closing-card" style={{ opacity: 0 }}>
                <span className="ed-closing-card-kicker">{c.kicker}</span>
                <h3 className="ed-closing-card-title">{c.title}</h3>
                <p className="ed-closing-card-body">{c.body}</p>
              </article>
            ))}
          </div>

          <p className="ed-closing-foot ed-reveal">
            Benchmark constante · archivo de ~50 partidas
          </p>
        </section>
      </main>
    </div>
  )
}
