import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bara_CV',
  description:
    'CV_gratuit à votre disposition',
  generator: 'v0.app',
  
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#5CAFA7',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${fontVariables} bg-background`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
