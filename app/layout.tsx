import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter_Tight, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Menos prompts, más lógica: saber cuándo usar IA',
  description:
    'Historia del procesamiento de un archivo de ~50 partidas: de 1.5 días en manual a 50 minutos y 6–7 minutos con IA, y a 15 segundos con optimización programática.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${interTight.variable} ${jetbrains.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
