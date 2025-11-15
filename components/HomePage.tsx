'use client'

import { useEffect, useState } from 'react'
import { Section } from '@/types'
import SocialFeedSection from './sections/SocialFeedSection'
import AboutSection from './sections/AboutSection'
import StatsSection from './sections/StatsSection'
import CustomSection from './sections/CustomSection'

interface HomePageProps {
  sections: Section[]
}

export default function HomePage({ sections: initialSections }: HomePageProps) {
  const [sections, setSections] = useState(initialSections)

  // Real-time updates via polling or WebSocket
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/sections')
        if (response.ok) {
          const data = await response.json()
          setSections(data)
        }
      } catch (error) {
        console.error('Failed to fetch sections:', error)
      }
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'social-feed':
        return <SocialFeedSection key={section.id} section={section} />
      case 'about':
        return <AboutSection key={section.id} section={section} />
      case 'stats':
        return <StatsSection key={section.id} section={section} />
      case 'custom':
        return <CustomSection key={section.id} section={section} />
      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map(renderSection)}
        </div>
        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Homepage</h1>
            <p className="text-muted-foreground mb-8">
              Get started by logging into the admin panel to configure your sections.
            </p>
            <a
              href="/admin"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Admin Panel
            </a>
          </div>
        )}
      </div>
    </main>
  )
}

