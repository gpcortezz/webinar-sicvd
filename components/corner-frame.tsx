import type { ReactNode } from 'react'

type Accent = 'orange' | 'turquoise' | 'ink'

const accentMap: Record<Accent, string> = {
  orange: 'text-orange',
  turquoise: 'text-turquoise',
  ink: 'text-ink-muted',
}

/**
 * Technical "corner bracket" frame — like the annotation marks on an
 * engineering drawing. Used to highlight the most important figures
 * instead of generic drop-shadow cards.
 */
export function CornerFrame({
  children,
  accent = 'turquoise',
  className = '',
}: {
  children: ReactNode
  accent?: Accent
  className?: string
}) {
  const color = accentMap[accent]
  return (
    <div className={`relative ${className}`}>
      {/* corners */}
      <span aria-hidden className={`pointer-events-none absolute left-0 top-0 h-5 w-5 border-l-2 border-t-2 ${color} [border-color:currentColor]`} />
      <span aria-hidden className={`pointer-events-none absolute right-0 top-0 h-5 w-5 border-r-2 border-t-2 ${color} [border-color:currentColor]`} />
      <span aria-hidden className={`pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b-2 border-l-2 ${color} [border-color:currentColor]`} />
      <span aria-hidden className={`pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b-2 border-r-2 ${color} [border-color:currentColor]`} />
      {children}
    </div>
  )
}
