// All figures below are real project data — do not invent additional numbers.

// Benchmark: time to complete ONE file of ~50 partidas, measured at 4 moments.
export const benchmark = [
  {
    id: 'manual',
    label: 'Manual',
    sub: 'pre-software',
    seconds: 12 * 3600, // ~1.5 días laborales (~12h efectivas)
    display: '~1.5 días',
    factor: 'línea base',
    accent: 'ink' as const,
  },
  {
    id: 'beta',
    label: 'Beta',
    sub: 'dic 2025 – feb 2026',
    seconds: 50 * 60, // ~50 min
    display: '~50 min',
    factor: '14× más rápido',
    accent: 'turquoise' as const,
  },
  {
    id: 'agosto',
    label: 'Agosto 2026',
    sub: 'pre-código',
    seconds: 6.5 * 60, // ~6–7 min
    display: '~6–7 min',
    factor: '100× más rápido',
    accent: 'turquoise' as const,
  },
  {
    id: 'programatico',
    label: 'Programático',
    sub: 'desde 28 ago 2026',
    seconds: 15, // ~15 segundos
    display: '~15 seg',
    factor: '2.800× más rápido',
    accent: 'orange' as const,
  },
]

// Full timeline — 5 stages.
export const timeline = [
  {
    n: '01',
    title: 'Manual',
    period: 'pre-software',
    headline: '~1.5 días laborales',
    per: '~14–15 min por partida',
    points: ['50 partidas por archivo', 'Todo el proceso a mano'],
    accent: 'ink' as const,
  },
  {
    n: '02',
    title: 'Beta',
    period: 'dic 2025 – feb 2026',
    headline: '~24 min de completado',
    per: '~0.6 archivos/día',
    points: ['46 archivos procesados', '1.036 partidas'],
    accent: 'turquoise' as const,
  },
  {
    n: '03',
    title: 'Entrega e inicio operativo',
    period: 'marzo – julio 2026',
    headline: '~6.6 min → ~4 min',
    per: '10/día → 79 archivos/día',
    points: [
      'Marzo: 308 archivos · 1.663 partidas',
      'Abr–jul: 9.579 archivos · 43.308 partidas',
    ],
    accent: 'turquoise' as const,
  },
  {
    n: '04',
    title: 'Pico operativo',
    period: 'agosto 2026',
    headline: '~50–60 seg (pre-código)',
    per: 'picos de ~189 archivos/día',
    points: [
      '3.432 archivos · 16.327 partidas (+27% vs julio)',
      'Pico diario máximo el 4 de agosto',
    ],
    accent: 'turquoise' as const,
  },
  {
    n: '05',
    title: 'Completado programático',
    period: 'desde 28 ago 2026',
    headline: '~3–4 seg (mediana 2 seg)',
    per: 'completado promedio',
    points: [
      'Mayor archivo: 70 partidas en ~14 seg',
      'Pipeline completo de ese archivo: ~44 seg',
    ],
    accent: 'orange' as const,
  },
]

// Daily volume growth by stage (files/day).
export const volume = [
  { label: 'Beta', period: 'dic–feb', perDay: 0.6 },
  { label: 'Marzo', period: 'entrega', perDay: 10 },
  { label: 'Abr–Jul', period: 'operativo', perDay: 79 },
  { label: 'Agosto', period: 'pico', perDay: 189 },
]

export const closing = [
  {
    kicker: 'Velocidad',
    title: 'De días a segundos',
    body: 'El mismo archivo de ~50 partidas pasó de ~1.5 días a ~15 segundos: una aceleración de ~2.800×.',
    accent: 'orange' as const,
  },
  {
    kicker: 'Escala',
    title: 'Más volumen, menos tiempo por archivo',
    body: 'De 0.6 a 189 archivos por día (~315×), mientras el tiempo por archivo se desplomaba.',
    accent: 'turquoise' as const,
  },
  {
    kicker: 'Impacto',
    title: 'Capacidad liberada para el equipo',
    body: 'El equipo de documentación queda libre del trabajo manual y puede enfocarse en tareas de mayor valor.',
    accent: 'turquoise' as const,
  },
]
