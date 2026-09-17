'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

/**
 * Scroll-triggered reveal. Fades + slides content in as it enters the viewport.
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = '',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-8 flex items-center gap-3 font-display text-xs uppercase tracking-[0.35em] text-turquoise">
      <span className="text-orange">{index}</span>
      <span className="h-px w-8 bg-turquoise/40" />
      <span className="text-ink-muted">{children}</span>
    </div>
  )
}
