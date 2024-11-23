import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme/theme-provider'
import PlausibleProvider from 'next-plausible'
import { ReactQueryProvider } from '@/providers/react-query'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const TITLE = 'Flagright'
const DESCRIPTION = 'Flagright Transaction dashboard'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
  },
  openGraph: {
    type: 'website',
    title: TITLE,
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <PlausibleProvider domain="https://flagright.api.sohanbandary.com">
        <ReactQueryProvider>
          <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
            </ThemeProvider>
          </body>
        </ReactQueryProvider>
      </PlausibleProvider>
    </html>
  )
}
