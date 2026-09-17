'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import Lenis from 'lenis'
import { Hero } from '@/components/hero'
import { HudBackdrop } from '@/components/hud-backdrop'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer)
}

const STORY_BEATS = [
  { id: 'hero', label: 'Archivo', meta: '~50 partidas', code: '00' },
  { id: 'pipeline', label: 'Pipeline', meta: '5 etapas', code: '01' },
  { id: 'benchmark', label: 'Medición', meta: '4 momentos', code: '02' },
  { id: 'volume', label: 'Volumen', meta: 'capacidad ×día', code: '03' },
  { id: 'closing', label: 'Resultado', meta: '~2.800×', code: '04' },
] as const

const ATM_COLORS: Array<[number, number, number]> = [
  [11, 30, 51],
  [13, 36, 54],
  [16, 32, 50],
  [18, 30, 46],
  [26, 28, 44],
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

const PIPELINE_ICONS = [
  // búsqueda
  <svg key="search" className="pipe-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="1.6" />
    <line x1="15" y1="15" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
  // embeddings
  <svg key="embed" className="pipe-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="6" cy="6" r="1.6" fill="currentColor" />
    <circle cx="12" cy="6" r="1.6" fill="currentColor" />
    <circle cx="18" cy="6" r="1.6" fill="currentColor" />
    <circle cx="6" cy="12" r="1.6" fill="currentColor" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <circle cx="18" cy="12" r="1.6" fill="currentColor" />
    <circle cx="6" cy="18" r="1.6" fill="currentColor" />
    <circle cx="12" cy="18" r="1.6" fill="currentColor" />
    <circle cx="18" cy="18" r="1.6" fill="currentColor" />
  </svg>,
  // recuperación
  <svg key="retrieve" className="pipe-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="5" cy="5" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="19" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="6" cy="19" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="18" cy="18" r="2.2" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    <line x1="6.5" y1="6.5" x2="10.5" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    <line x1="17.5" y1="7.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    <line x1="7.5" y1="17.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    <line x1="16.5" y1="16.5" x2="13.5" y2="13.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
  </svg>,
  // completación
  <svg key="complete" className="pipe-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
    <line x1="4" y1="7" x2="14" y2="7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="4" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="4" y1="17" x2="14" y2="17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M17 5.5L19.5 8L17 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 10.5L19.5 13L17 15.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 15.5L19.5 18L17 20.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // subida
  <svg key="upload" className="pipe-icon" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M12 16V4M6 10L12 4L18 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 18V20H20V18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
] as const

/** Iconos del paquete flotante: proceso real del archivo (distintos a los nodos) */
const PIPELINE_PROCESS_ICONS = [
  // 1 — Archivo + lupa sobre base de conocimiento
  <svg key="proc-search" className="pipe-process-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect x="3" y="4" width="12" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M6 9H12M6 12H11M6 15H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" />
    <rect x="14" y="8" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" opacity="0.85" />
    <path d="M16.5 12H21.5M16.5 15H20.5M16.5 18H19.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    <circle cx="22" cy="22" r="4.2" stroke="currentColor" strokeWidth="1.7" />
    <line x1="25.1" y1="25.1" x2="28.5" y2="28.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
  // 2 — Documento convirtiéndose en vectores/embeddings
  <svg key="proc-embed" className="pipe-process-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect x="3" y="5" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5.5 9H10.5M5.5 12H9.5M5.5 15H8.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.65" />
    <path d="M14 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M15.5 9.5L18 12L15.5 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="19" y="6" width="10" height="18" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M22 10V20M25 12V18M28 11V19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
  </svg>,
  // 3 — Emparejar archivo con conocimiento relevante
  <svg key="proc-match" className="pipe-process-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect x="2.5" y="6" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M5 10.5H10M5 13.5H9" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
    <rect x="19.5" y="6" width="10" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M22 10.5H27M22 13.5H26" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.7" />
    <path d="M13.5 12H18.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="12" r="2.2" fill="currentColor" />
    <path d="M11 23H21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    <path d="M14 21L16 24L18 21" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // 4 — Pedimento: campos rellenándose
  <svg key="proc-form" className="pipe-process-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect x="5" y="3" width="22" height="26" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M9 8H23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <rect x="9" y="11.5" width="14" height="3.2" rx="0.8" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9" y="16.5" width="14" height="3.2" rx="0.8" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9" y="21.5" width="9" height="3.2" rx="0.8" stroke="currentColor" strokeWidth="1.3" />
    <path d="M20.5 22.2L22 23.7L25 20.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // 5 — Archivo subiendo a plataforma de pedimentos
  <svg key="proc-upload" className="pipe-process-icon" viewBox="0 0 32 32" fill="none" aria-hidden>
    <rect x="4" y="18" width="24" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 22H13M7 25H11" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.65" />
    <rect x="17" y="20.5" width="8" height="5" rx="0.8" stroke="currentColor" strokeWidth="1.3" />
    <rect x="11" y="4" width="10" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M13.5 8H18.5M13.5 11H17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    <path d="M16 16.5V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13.5 19L16 21.5L18.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
] as const

export default function Page() {
  const root = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!root.current) return

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: false, // Observer owns wheel → slides
    })
    lenis.on('scroll', ScrollTrigger.update)
    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    let current = 0
    let busy = false
    const played = new Set<string>()

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>('section[data-section]')
      const progress = document.querySelector<HTMLElement>('.progress-bar')
      const railFill = document.querySelector<HTMLElement>('.story-rail-fill')
      const atmosphere = document.querySelector<HTMLElement>('.atmosphere')
      const beatLinks = gsap.utils.toArray<HTMLAnchorElement>('.story-beat')

      const updateChrome = (index: number) => {
        const section = sections[index]
        if (!section) return
        const id = section.id
        const p = sections.length <= 1 ? 0 : index / (sections.length - 1)
        if (progress) gsap.to(progress, { scaleX: p, duration: 0.45, ease: 'power2.out' })
        if (railFill) gsap.to(railFill, { scaleY: p, duration: 0.45, ease: 'power2.out' })
        const c = ATM_COLORS[index] ?? ATM_COLORS[0]!
        if (atmosphere) {
          gsap.to(atmosphere, {
            backgroundColor: `rgb(${c[0]},${c[1]},${c[2]})`,
            duration: 0.7,
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

      // ── Benchmark cascade of deltas ───────────────────────
      gsap.set('.bench-cascade-row', { opacity: 0, y: 28 })
      gsap.set('.bench-cascade-total', { opacity: 0, y: 20, scale: 0.96 })
      gsap.set('.pipe-rail-shell', { opacity: 0, y: 18 })
      gsap.set('.pipe-rail-fill', { scaleX: 0, transformOrigin: 'left center' })
      gsap.set('.pipe-packet', {
        left: '0%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
      })
      gsap.set('.pipe-node', { opacity: 0.28 })
      gsap.set('.pipe-detail-panel', { opacity: 0, y: 16 })

      const playBenchmark = () => {
        if (played.has('benchmark')) return

        const rows = gsap.utils.toArray<HTMLElement>('.bench-cascade-row')
        const total = document.querySelector<HTMLElement>('.bench-cascade-total')
        if (!rows.length) return
        played.add('benchmark')

        gsap.set('#benchmark', { clearProps: 'transform,filter,opacity' })

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        rows.forEach((row, i) => {
          const deltaEl = row.querySelector<HTMLElement>('.bench-delta-num')
          const target = Number(row.getAttribute('data-delta') || '0')
          const obj = { val: 0 }
          const at = i * 0.55

          tl.fromTo(
            row,
            { opacity: 0, y: 28, x: -12 },
            { opacity: 1, y: 0, x: 0, duration: 0.55 },
            at
          )

          if (deltaEl) {
            tl.to(
              obj,
              {
                val: target,
                duration: 0.7,
                ease: 'power2.out',
                onUpdate: () => {
                  deltaEl.textContent = Math.round(obj.val).toLocaleString('es-ES')
                },
              },
              at + 0.12
            )
          }

          tl.fromTo(
            row.querySelectorAll('.bench-cascade-arrow'),
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out' },
            at + 0.18
          )
        })

        if (total) {
          const totalNum = total.querySelector<HTMLElement>('.bench-total-num')
          const totalObj = { val: 0 }
          tl.fromTo(
            total,
            { opacity: 0, y: 24, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: 'back.out(1.3)' },
            '+=0.15'
          )
          if (totalNum) {
            tl.to(
              totalObj,
              {
                val: 2800,
                duration: 1.1,
                ease: 'power3.out',
                onUpdate: () => {
                  totalNum.textContent = Math.round(totalObj.val).toLocaleString('es-ES')
                },
              },
              '<-0.1'
            )
          }
        }
      }

      const playVolume = () => {
        if (played.has('volume')) return
        played.add('volume')
        const volRows = gsap.utils.toArray<HTMLElement>('.vol-row')
        const volNote = document.querySelector<HTMLElement>('.vol-note')
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        volRows.forEach((row) => {
          const bar = row.querySelector<HTMLElement>('.vol-fill')
          const counter = row.querySelector<HTMLElement>('.vol-counter')
          const target = bar?.getAttribute('data-target') || '0'
          const value = Number(counter?.getAttribute('data-value') || '0')

          tl.fromTo(
            row,
            { x: -36, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.5,
              onStart: () => {
                row.classList.add('is-flowing')
                row.querySelectorAll<HTMLElement>('.vol-flow-dot').forEach((dot) => {
                  const delay = dot.style.animationDelay
                  const duration = dot.style.animationDuration
                  dot.style.animation = 'none'
                  void dot.offsetWidth
                  dot.style.animation = ''
                  dot.style.animationDelay = delay
                  dot.style.animationDuration = duration
                })
              },
            },
            '+=0.1'
          )

          if (bar) {
            tl.fromTo(bar, { width: '0%' }, { width: `${target}%`, duration: 0.65 }, '<')
          }
          if (counter) {
            const obj = { val: 0 }
            tl.to(obj, {
              val: value,
              duration: 0.65,
              ease: 'power2.out',
              onUpdate: () => {
                counter.textContent = value < 1 ? obj.val.toFixed(1) : String(Math.round(obj.val))
              },
            }, '<')
          }
        })

        if (volNote) {
          tl.fromTo(volNote, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, '+=0.08')
        }
      }

      const playClosing = () => {
        if (played.has('closing')) return
        played.add('closing')
        const counterEl = document.querySelector<HTMLElement>('.closing-counter')
        const obj = { val: 0 }
        const impactTl = gsap.timeline()
        impactTl
          .fromTo(
            '.closing-frame',
            { scale: 0.88, rotateX: 16, opacity: 0.5 },
            { scale: 1, rotateX: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
            0
          )
          .to(obj, {
            val: 2800,
            duration: 2.0,
            ease: 'power3.out',
            onUpdate: () => {
              if (counterEl) counterEl.textContent = Math.round(obj.val).toLocaleString('es-ES')
            },
          }, 0.15)
          .fromTo('.closing-flash', { opacity: 0 }, { opacity: 0.9, duration: 0.4, ease: 'power1.out' }, 1.7)
          .to('.closing-flash', { opacity: 0, duration: 1.1, ease: 'power2.out' }, 2.15)
          .fromTo(
            '.closing-shock',
            { scale: 0.3, opacity: 0 },
            { scale: 1.1, opacity: 0.8, duration: 0.5, ease: 'power2.out' },
            1.75
          )
          .to('.closing-shock', { scale: 2.6, opacity: 0, duration: 1.3, ease: 'power1.out' }, 2.2)
          .to('.closing-frame', {
            boxShadow: '0 0 60px -8px rgba(255, 107, 53,0.65)',
            duration: 0.45,
            yoyo: true,
            repeat: 1,
            ease: 'sine.inOut',
          }, 1.75)
          .fromTo(
            '.closing-card',
            { y: 56, opacity: 0, rotateY: -14, z: -50 },
            {
              y: 0,
              opacity: 1,
              rotateY: 0,
              z: 0,
              duration: 0.85,
              stagger: 0.16,
              ease: 'back.out(1.4)',
            },
            2.55
          )
      }

      const playPipeline = () => {
        if (played.has('pipeline')) return
        const nodes = gsap.utils.toArray<HTMLElement>('.pipe-node')
        const panels = gsap.utils.toArray<HTMLElement>('.pipe-detail-panel')
        const shell = document.querySelector<HTMLElement>('.pipe-rail-shell')
        const fill = document.querySelector<HTMLElement>('.pipe-rail-fill')
        const packet = document.querySelector<HTMLElement>('.pipe-packet')
        const trail = document.querySelector<HTMLElement>('.pipe-packet-trail')
        const detail = document.querySelector<HTMLElement>('.pipe-detail')
        if (!nodes.length || !shell || !fill || !packet) return
        played.add('pipeline')

        gsap.set('#pipeline', { clearProps: 'transform,filter,opacity' })
        const n = nodes.length
        const pos = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * 100)
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.to(shell, { opacity: 1, y: 0, duration: 0.7 }, 0)
        tl.to(packet, { opacity: 1, duration: 0.45 }, 0.2)

        const travel = 1.35
        const dwell = 2.6
        const startAt = 0.6

        nodes.forEach((node, i) => {
          const at = startAt + i * (travel + dwell)
          const isLast = i === n - 1
          const moveDur = i === 0 ? 0.4 : travel
          // El documento adopta la forma de la etapa actual (1..5)
          const stageNum = i + 1

          // Encender la estela mientras el packet viaja hacia este nodo
          tl.add(() => packet.classList.add('is-moving'), at)
          if (trail) {
            const fromPos = i === 0 ? 0 : pos(i - 1)
            const toPos = pos(i)
            tl.fromTo(
              trail,
              { width: '0%' },
              { width: `${toPos - fromPos}%`, duration: moveDur, ease: 'power2.inOut' },
              at
            )
          }

          tl.to(
            packet,
            {
              left: `${pos(i)}%`,
              duration: moveDur,
              ease: i === 0 ? 'power2.out' : 'power2.inOut',
            },
            at
          )
          tl.to(
            fill,
            {
              scaleX: pos(i) / 100,
              duration: moveDur,
              ease: i === 0 ? 'power2.out' : 'power2.inOut',
            },
            at
          )
          // Apagar la estela al llegar al nodo
          tl.add(() => packet.classList.remove('is-moving'), at + moveDur)

          // Transformar el icono flotante al llegar a cada etapa.
          tl.add(() => {
            packet.setAttribute('data-stage', String(stageNum))
            packet.classList.toggle('is-final', isLast)
            const badge = packet.querySelector<HTMLElement>('.pipe-packet-badge')
            if (badge) {
              gsap.fromTo(
                badge,
                { scale: 0.82 },
                { scale: 1, duration: 0.45, ease: 'back.out(1.7)' }
              )
            }
          }, at + moveDur * 0.3)

          tl.to(
            node,
            {
              opacity: 1,
              duration: 0.5,
              onStart: () => {
                nodes.forEach((el, j) => {
                  el.classList.toggle('is-active', j === i)
                  el.classList.toggle('is-done', j < i)
                  el.classList.toggle('is-last', j === i && isLast)
                })
                detail?.classList.toggle('is-final', isLast)
              },
            },
            at + moveDur * 0.35
          )

          if (i > 0 && panels[i - 1]) {
            tl.to(panels[i - 1]!, {
              opacity: 0,
              y: -12,
              duration: 0.4,
              onStart: () => panels[i - 1]?.classList.remove('is-visible'),
            }, at)
          }
          if (panels[i]) {
            tl.fromTo(
              panels[i]!,
              { opacity: 0, y: 18 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                onStart: () => panels[i]?.classList.add('is-visible'),
              },
              at + moveDur * 0.4
            )
          }
        })
      }

      const playSection = (index: number) => {
        const id = sections[index]?.id
        if (id === 'pipeline') playPipeline()
        if (id === 'benchmark') playBenchmark()
        if (id === 'volume') playVolume()
        if (id === 'closing') playClosing()

        const section = sections[index]
        if (!section || id === 'hero') return
        const pieces = section.querySelectorAll<HTMLElement>('.reveal-piece')
        if (pieces.length && !section.dataset.revealed) {
          section.dataset.revealed = '1'
          gsap.fromTo(
            pieces,
            { opacity: 0, y: 36 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' }
          )
        }
      }

      let busyTimer: ReturnType<typeof setTimeout> | null = null
      let transitionTl: gsap.core.Timeline | null = null

      const goTo = (index: number, opts: { force?: boolean } = {}) => {
        const last = sections.length - 1
        if (index < 0 || index > last) return
        if (index === current && !opts.force) return
        if (busy && !opts.force) return

        if (busyTimer) {
          clearTimeout(busyTimer)
          busyTimer = null
        }
        transitionTl?.kill()

        const fromIndex = current
        const outgoing = sections[fromIndex]
        const incoming = sections[index]!
        const dir = index > fromIndex ? 1 : -1
        const fast = !!opts.force

        busy = true
        current = index
        updateChrome(index)

        const hardReset = (el: HTMLElement | undefined) => {
          if (!el) return
          gsap.set(el, { clearProps: 'transform,filter,opacity,visibility' })
        }

        const release = () => {
          busy = false
          if (busyTimer) {
            clearTimeout(busyTimer)
            busyTimer = null
          }
          hardReset(outgoing)
          hardReset(incoming)
        }

        const outDur = fast ? 0.28 : 0.42
        const inDur = fast ? 0.34 : 0.52
        const drift = fast ? 18 : 26

        busyTimer = setTimeout(release, (outDur + inDur) * 1000 + 300)

        // Parallax crossfade — no overlay, no blend modes, no 3D rotation.
        // The outgoing slide recedes (scale down + drift in the scroll
        // direction + fade) while the incoming one arrives from slightly
        // larger and the opposite drift, settling into place. The scale
        // delta alone sells the depth; nothing else is needed.
        transitionTl = gsap.timeline({ onComplete: release })

        if (outgoing && outgoing !== incoming) {
          transitionTl.to(
            outgoing,
            {
              scale: 0.96,
              y: dir * drift,
              autoAlpha: 0,
              duration: outDur,
              ease: 'power2.in',
              force3D: true,
            },
            0
          )
        }

        // Swap at ~85% of the outgoing exit so the two layers overlap
        // briefly — that overlap is what makes it read as a crossfade
        // instead of a hard cut.
        transitionTl
          .add(() => {
            const top = incoming.offsetTop
            lenis.scrollTo(top, { immediate: true, force: true })
            window.scrollTo(0, top)
            hardReset(outgoing)
            // Keep previous slides from painting into this viewport mid-swap
            if (outgoing && outgoing !== incoming) {
              gsap.set(outgoing, { autoAlpha: 0 })
            }
            playSection(index)
          }, outDur * 0.85)
          .fromTo(
            incoming,
            { scale: 1.05, y: dir * -drift, autoAlpha: 0, force3D: true },
            {
              scale: 1,
              y: 0,
              autoAlpha: 1,
              duration: inDur,
              ease: 'power3.out',
              force3D: true,
            },
            outDur * 0.85
          )
      }

      // Wheel / touch → next / previous slide (ignore past ends)
      const observer = Observer.create({
        target: window,
        type: 'wheel,touch',
        wheelSpeed: -1,
        tolerance: 50,
        preventDefault: true,
        onDown: () => {
          if (current <= 0) return
          goTo(current - 1)
        },
        onUp: () => {
          if (current >= sections.length - 1) return
          goTo(current + 1)
        },
      })

      // Sidebar phase clicks — force jump even mid-transition
      beatLinks.forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          const id = a.getAttribute('href')!.slice(1)
          const idx = sections.findIndex((s) => s.id === id)
          if (idx >= 0) goTo(idx, { force: true })
        })
      })

      // ── Hero cinematic intro ───────────────────────────────
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .fromTo('.hero-piece', { opacity: 0, y: 28 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.7 }, 0)
        .fromTo('.hero-old-num', { opacity: 0, y: 24, scale: 1.04 }, { opacity: 0.45, y: 0, scale: 1, duration: 0.75 }, 0.2)
        .to('.hero-strike', { width: '100%', duration: 0.55, ease: 'power2.inOut' }, 0.85)
        .fromTo('.hero-arrow', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.5 }, 1.0)
        .fromTo('.hero-new-wrap', { opacity: 0, y: 28, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.75 }, 1.15)

      const heroNew = { val: 0 }
      const heroNewEl = document.querySelector<HTMLElement>('.hero-new-num')
      if (heroNewEl) {
        heroTl.to(heroNew, {
          val: 15,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            heroNewEl.textContent = String(Math.round(heroNew.val))
          },
        }, 1.2)
      }

      const heroMult = { val: 0 }
      const heroMultEl = document.querySelector<HTMLElement>('.hero-mult')
      if (heroMultEl) {
        heroTl.to(heroMult, {
          val: 2800,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            heroMultEl.textContent = Math.round(heroMult.val).toLocaleString('es-ES')
          },
        }, 1.6)
      }

      gsap.set('.hero-compress-track', { scaleX: 0.02, transformOrigin: 'left center' })
      heroTl
        .to('.hero-compress-track', {
          scaleX: 1,
          duration: 1.8,
          ease: 'power3.inOut',
        }, 1.55)
        .fromTo('.hero-compress-pulse', { opacity: 0 }, { opacity: 0.9, duration: 0.35 }, 2.9)
        .to('.hero-compress-pulse', { opacity: 0.25, duration: 0.8 }, 3.2)
        .fromTo('.hero-scroll-cue', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6 }, 3.1)

      gsap.to('.hero-scroll-arrow', {
        y: 6,
        duration: 0.9,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      })

      // Keyboard support
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
          e.preventDefault()
          if (current < sections.length - 1) goTo(current + 1)
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault()
          if (current > 0) goTo(current - 1)
        }
      }
      window.addEventListener('keydown', onKey)

      // Initial state
      gsap.set(progress, { scaleX: 0 })
      updateChrome(0)
      lenis.scrollTo(0, { immediate: true, force: true })

      requestAnimationFrame(() => ScrollTrigger.refresh())

      ;(root.current as HTMLElement & { __slideKeyCleanup?: () => void }).__slideKeyCleanup = () => {
        window.removeEventListener('keydown', onKey)
        if (busyTimer) clearTimeout(busyTimer)
        transitionTl?.kill()
        observer.kill()
      }
    }, root)

    return () => {
      const el = root.current as (HTMLElement & { __slideKeyCleanup?: () => void }) | null
      el?.__slideKeyCleanup?.()
      ctx.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
      Observer.getAll().forEach((o) => o.kill())
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={root} className="relative w-full bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div className="progress-bar h-full origin-left scale-x-0 bg-gradient-to-r from-turquoise via-turquoise to-orange" />
      </div>

      <div className="atmosphere fixed inset-0 z-0 bg-[rgb(11, 30, 51)]" aria-hidden />
      <div className="blueprint-grid fixed inset-0 z-0 pointer-events-none" aria-hidden />

      <aside className="story-rail" aria-label="Fases de la presentación">
        <div className="story-rail-track">
          <div className="story-rail-fill" />
        </div>
        <ol className="story-beats">
          {STORY_BEATS.map((beat, i) => (
            <li key={beat.id} className="story-beats-item">
              <a
                href={`#${beat.id}`}
                className={`story-beat${i === 0 ? ' is-active' : ''}`}
                data-index={i}
              >
                <span className="story-beat-code">{beat.code}</span>
                <span className="story-beat-copy">
                  <span className="story-beat-label">{beat.label}</span>
                  <span className="story-beat-meta">{beat.meta}</span>
                </span>
              </a>
            </li>
          ))}
        </ol>
      </aside>

      <div className="fixed bottom-4 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-turquoise/40 md:flex" aria-hidden>
        <span className="h-8 w-px bg-turquoise/30" />
        <span className="font-mono text-[9px] [writing-mode:vertical-rl]">SLIDE</span>
        <span className="h-8 w-px bg-turquoise/30" />
      </div>

      <main className="relative z-10">
        {/* ── HERO ───────────────────────────────────────── */}
        <section id="hero" data-section className="hero-section relative flex flex-col justify-center overflow-hidden px-6 py-20 md:px-12">
          <div className="bg-layer absolute inset-0 bg-gradient-to-b from-transparent to-turquoise/[0.03]" aria-hidden />
          <Hero />
        </section>

        {/* ── PIPELINE ──────────────────────────────────── */}
        <section id="pipeline" data-section className="slide-shell relative">
          <div className="bg-layer absolute inset-0 bg-turquoise/[0.02]" aria-hidden />
          <HudBackdrop variant="pipeline" className="opacity-55 md:opacity-75" />
          <div className="slide-frame">
            <div className="reveal-piece slide-kicker">
              <span className="text-orange">01</span>
              <span className="h-px w-8 bg-turquoise/40" />
              <span className="text-ink-muted">Pipeline del proceso</span>
            </div>
            <h2 className="reveal-piece slide-title">
              Cinco etapas, del conocimiento a la plataforma.
            </h2>
            <p className="reveal-piece slide-lead">
              El flujo automatizado que transforma cada archivo en un pedimento listo para subir.
            </p>

            <div className="pipe-stage">
              <div className="pipe-rail-shell">
                <div className="pipe-rail-track" aria-hidden>
                  <div className="pipe-rail-fill" />
                  <div className="pipe-packet" data-stage="1">
                    <span className="pipe-packet-trail" />
                    <div className="pipe-packet-badge">
                      {PIPELINE_PROCESS_ICONS.map((icon, fi) => (
                        <span
                          key={PIPELINE_STEPS[fi].code}
                          className="pipe-packet-face"
                          data-face={fi + 1}
                        >
                          {icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ol className="pipe-nodes">
                  {PIPELINE_STEPS.map((step, i) => (
                    <li
                      key={step.code}
                      className={`pipe-node${i === PIPELINE_STEPS.length - 1 ? ' is-end' : ''}`}
                    >
                      <span className="pipe-node-dot">
                        {PIPELINE_ICONS[i]}
                      </span>
                      <span className="pipe-node-code">{step.code}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pipe-detail" aria-live="polite">
                {PIPELINE_STEPS.map((step, i) => (
                  <div
                    key={step.code}
                    className={`pipe-detail-panel${i === PIPELINE_STEPS.length - 1 ? ' is-accent' : ''}`}
                  >
                    <span className="pipe-detail-code">Etapa {step.code}</span>
                    <h3 className="pipe-detail-title">{step.title}</h3>
                    <p className="pipe-detail-body">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pipe-foot reveal-piece flex items-center gap-4 border-t border-turquoise/20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              <span>Señal en tránsito</span>
              <span className="h-px flex-1 bg-turquoise/20" />
              <span>5 etapas encadenadas</span>
            </div>
          </div>
        </section>

        {/* ── BENCHMARK ─────────────────────────────────── */}
        <section id="benchmark" data-section className="slide-shell relative">
          <div className="bg-layer absolute inset-0 bg-turquoise/[0.025]" aria-hidden />
          <HudBackdrop variant="benchmark" className="opacity-55 md:opacity-75" />
          <div className="slide-frame">
            <div className="reveal-piece slide-kicker">
              <span className="text-orange">02</span>
              <span className="h-px w-8 bg-turquoise/40" />
              <span className="text-ink-muted">Benchmark constante</span>
            </div>
            <h2 className="reveal-piece slide-title">
              El mismo archivo de ~50 partidas, medido en 4 momentos.
            </h2>
            <p className="reveal-piece slide-lead">
              Cada salto recorta el tiempo frente a la etapa anterior. Al final, el acumulado es ~2.800×.
            </p>

            <div className="bench-cascade">
              {[
                { from: 'Manual', fromTime: '1.5 días', to: 'Beta', toTime: '50 min', delta: 14 },
                { from: 'Beta', fromTime: '50 min', to: 'Agosto', toTime: '6 – 7 min', delta: 7 },
                { from: 'Agosto', fromTime: '6 – 7 min', to: 'Programático', toTime: '15 seg', delta: 28, accent: true },
              ].map((row) => (
                <div
                  key={`${row.from}-${row.to}`}
                  className={`bench-cascade-row${row.accent ? ' is-accent' : ''}`}
                  data-delta={row.delta}
                >
                  <div className="bench-cascade-from">
                    <span className="bench-cascade-stage">{row.from}</span>
                    <span className="bench-cascade-time">{row.fromTime}</span>
                  </div>
                  <div className="bench-cascade-mid">
                    <span className="bench-cascade-arrow" aria-hidden />
                    <span className="bench-cascade-delta">
                      −<span className="bench-delta-num tabular">0</span>×
                    </span>
                  </div>
                  <div className="bench-cascade-to">
                    <span className="bench-cascade-stage">{row.to}</span>
                    <span className="bench-cascade-time">{row.toTime}</span>
                  </div>
                </div>
              ))}

              <div className="bench-cascade-total">
                <div className="bench-cascade-total-copy">
                  <span className="bench-cascade-total-label">Aceleración acumulada</span>
                  <span className="bench-cascade-total-sub">Manual → Programático · mismo archivo</span>
                </div>
                <div className="bench-cascade-total-value">
                  ~<span className="bench-total-num tabular">0</span>×
                </div>
              </div>
            </div>

            <div className="bench-foot reveal-piece flex items-center gap-4 border-t border-turquoise/20 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted">
              <span>Mismo archivo · ~50 partidas</span>
              <span className="h-px flex-1 bg-turquoise/20" />
              <span>Recorte por etapa</span>
            </div>
          </div>
        </section>

        {/* ── VOLUME ───────────────────────────────────── */}
        <section id="volume" data-section className="slide-shell relative" style={{ perspective: '900px' }}>
          <div className="bg-layer absolute inset-0 bg-orange/[0.02]" aria-hidden />
          <HudBackdrop variant="volume" className="opacity-55 md:opacity-75" />
          <div className="slide-frame">
            <div className="reveal-piece slide-kicker">
              <span className="text-orange">03</span>
              <span className="h-px w-8 bg-turquoise/40" />
              <span className="text-ink-muted">Volumen diario</span>
            </div>
            <h2 className="reveal-piece slide-title">
              Más archivos por día en cada etapa.
            </h2>
            <p className="reveal-piece slide-lead">
              Mientras el tiempo por archivo caía, la capacidad diaria se multiplicó por <span className="font-display font-semibold text-orange">~315×</span>.
            </p>

            <div className="vol-board">
              <div className="vol-rows">
                {[
                  { label: 'Beta', period: 'dic – feb', v: 0.6, color: 'turquoise', dots: 4 },
                  { label: 'Marzo', period: 'entrega', v: 10, color: 'turquoise', dots: 7 },
                  { label: 'Abr–Jul', period: 'operativo', v: 79, color: 'turquoise', dots: 11 },
                  { label: 'Agosto', period: 'pico', v: 189, color: 'orange', dots: 16 },
                ].map((row, i) => {
                  const pct = Math.max((row.v / 189) * 100, 2)
                  const speed = Math.max(1.1, 3.2 - i * 0.55)
                  return (
                    <div
                      key={i}
                      className={`vol-row${row.color === 'orange' ? ' is-accent' : ''}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div className="vol-row-meta">
                        <div className="vol-row-label">{row.label}</div>
                        <div className="vol-row-period">{row.period}</div>
                      </div>
                      <div className="vol-row-track">
                        <div
                          data-target={pct}
                          className={'vol-fill ' + (row.color === 'orange' ? 'is-orange' : 'is-turquoise')}
                        >
                          <div className="vol-flow pointer-events-none absolute inset-0">
                            {Array.from({ length: row.dots }).map((_, d) => (
                              <span
                                key={d}
                                className={'vol-flow-dot h-1.5 w-2.5 ' + (row.color === 'orange' ? 'bg-navy-deep/75 text-orange' : 'bg-navy-deep/75 text-turquoise')}
                                style={{
                                  animationDelay: `${(d * (speed / row.dots)).toFixed(2)}s`,
                                  animationDuration: `${speed}s`,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="vol-row-value">
                        <span
                          data-value={row.v}
                          className={`vol-counter tabular ${row.color === 'orange' ? 'text-orange' : 'text-turquoise'}`}
                        >
                          0
                        </span>
                        <span className="vol-row-unit">archivos/día</span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="vol-note">
                <span className="text-orange">NOTA:</span> los ~189 archivos/día son un pico observado, no un promedio sostenido ni una capacidad garantizada.
              </p>
            </div>
          </div>
        </section>

        {/* ── CLOSING ─────────────────────────────────── */}
        <section id="closing" data-section className="slide-shell is-closing relative" style={{ perspective: '1000px' }}>
          <div className="bg-layer absolute inset-0 overflow-hidden bg-orange/[0.035]" aria-hidden />
          <HudBackdrop variant="closing" className="opacity-65 md:opacity-85" />
          <div className="slide-frame">
            <div className="reveal-piece slide-kicker">
              <span className="text-orange">04</span>
              <span className="h-px w-8 bg-turquoise/40" />
              <span className="text-ink-muted">El resultado</span>
            </div>
            <h2 className="reveal-piece slide-title">
              De días a segundos: el salto completo.
            </h2>
            <p className="reveal-piece slide-lead">
              Misma referencia de ~50 partidas. El tiempo se colapsó y liberó capacidad del equipo.
            </p>

            <div className="closing-body">
              <div className="closing-hero reveal-piece">
                <p className="closing-hero-label">Aceleración total</p>
                <div className="closing-impact-wrap">
                  <div className="closing-shock" aria-hidden />
                  <div className="closing-flash" aria-hidden />
                  <div className="closing-frame corner-frame inline-block border border-orange">
                    <span className="closing-counter tabular">0</span>
                    <span className="closing-x">×</span>
                  </div>
                </div>
                <p className="closing-tagline">
                  De <span className="text-ink-muted line-through decoration-orange/60">días</span> a <span className="text-orange">segundos</span>.
                </p>
              </div>

              <div className="closing-cards">
                {[
                  { kicker: 'Velocidad', title: 'De días a segundos', body: 'El mismo archivo de ~50 partidas pasó de ~1.5 días a ~15 segundos: una aceleración de ~2.800×.', color: 'orange' },
                  { kicker: 'Escala', title: 'Más volumen, menos tiempo por archivo', body: 'De 0.6 a 189 archivos por día (~315×), mientras el tiempo por archivo se desplomaba.', color: 'turquoise' },
                  { kicker: 'Impacto', title: 'Capacidad liberada para el equipo', body: 'El equipo de documentación queda libre del trabajo manual y puede enfocarse en tareas de mayor valor.', color: 'turquoise' },
                ].map((c, i) => (
                  <div key={i} className="closing-card corner-frame">
                    <span className={`closing-card-kicker is-${c.color}`}>{c.kicker}</span>
                    <h3 className="closing-card-title">{c.title}</h3>
                    <p className="closing-card-body">{c.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="closing-foot reveal-piece flex flex-col items-center gap-2 border-t-2 border-orange/60 text-center">
              <p className="font-display text-xs uppercase tracking-[0.3em] text-ink-muted">Benchmark constante · archivo de ~50 partidas</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
