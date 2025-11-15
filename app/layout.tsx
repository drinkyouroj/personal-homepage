import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { prisma } from '@/lib/prisma'
import Analytics from '@/components/Analytics'

const inter = Inter({ subsets: ['latin'] })

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findMany()
    const settingsMap: Record<string, any> = {}
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })
    return settingsMap
  } catch {
    return {}
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  
  return {
    title: (settings.siteTitle as string) || 'Personal Homepage',
    description: (settings.siteDescription as string) || 'A customizable personal homepage with social media integration',
    openGraph: {
      title: (settings.siteTitle as string) || 'Personal Homepage',
      description: (settings.siteDescription as string) || 'A customizable personal homepage with social media integration',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: (settings.siteTitle as string) || 'Personal Homepage',
      description: (settings.siteDescription as string) || 'A customizable personal homepage with social media integration',
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Analytics 
            googleAnalyticsId={settings.googleAnalyticsId as string}
            plausibleDomain={settings.plausibleDomain as string}
            enabled={settings.analyticsEnabled as boolean}
          />
          {children}
        </Providers>
      </body>
    </html>
  )
}
