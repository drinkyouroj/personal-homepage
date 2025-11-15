'use client'

import { useEffect, useState } from 'react'
import { Section } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SocialFeedSectionProps {
  section: Section
}

export default function StatsSection({ section }: SocialFeedSectionProps) {
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const platforms = section.config?.platforms || []
        const response = await fetch(
          `/api/social/stats?platforms=${platforms.join(',')}`
        )
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || {})
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, section.config?.refreshInterval || 300000)
    return () => clearInterval(interval)
  }, [section])

  const customStyle = section.style || {}
  const displayStats = section.config?.stats || Object.keys(stats)

  return (
    <Card className="col-span-full" style={customStyle}>
      <CardHeader>
        <CardTitle>{section.config?.title || 'Statistics'}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {displayStats.map((statKey: string) => (
              <div
                key={statKey}
                className="text-center p-4 bg-secondary/50 rounded-lg"
              >
                <div className="text-3xl font-bold mb-1">
                  {stats[statKey]?.toLocaleString() || '0'}
                </div>
                <div className="text-sm text-muted-foreground capitalize">
                  {statKey.replace(/_/g, ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

