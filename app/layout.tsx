import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat, Cairo } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Wing Kite Dakhla Academy | Wingfoil School & Kitesurf Lessons Dakhla Morocco',
    template: '%s | Wing Kite Dakhla Academy',
  },
  description: 'Wing foil Dakhla school - Learn wingfoil in Dakhla lagoon, Morocco. Wingfoil lessons, courses & coaching for beginners to advanced. Best wingfoil camp & kitesurf academy in Dakhla.',
  keywords: [
    'wing foil Dakhla',
    'wingfoil Dakhla school',
    'wingfoil lessons Dakhla',
    'wing foil course Dakhla',
    'learn wingfoil Dakhla',
    'wingfoil camp Morocco',
    'kitesurf wingfoil Dakhla',
    'wingfoil beginner Dakhla',
    'wingfoil rental Dakhla',
    'wingfoil coaching Dakhla',
    'wingfoil lagoon Dakhla',
    'water sports Dakhla',
    'wingfoil holiday Morocco',
    'wingfoil academy',
    'école wingfoil Dakhla',
    'cours wingfoil Dakhla',
    'kitesurf Dakhla Maroc'
  ],
  authors: [{ name: 'Wing Kite Dakhla Academy' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    alternateLocale: 'en_US',
    siteName: 'Wing Kite Dakhla Academy',
    title: 'Wing Kite Dakhla Academy | Wingfoil & Kitesurf School',
    description: 'Wing foil Dakhla school - Learn wingfoil and kitesurf in the famous Dakhla lagoon, Morocco. Professional coaching for all levels.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    languages: {
      'fr': '/fr',
      'en': '/en',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1E5AA8',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable} ${cairo.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
