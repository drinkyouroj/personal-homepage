'use client'

import { Section } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface AboutSectionProps {
  section: Section
}

export default function AboutSection({ section }: AboutSectionProps) {
  const config = section.config || {}
  const customStyle = section.style || {}

  return (
    <Card className="col-span-full md:col-span-2" style={customStyle}>
      <CardHeader>
        <CardTitle>{config.title || 'About'}</CardTitle>
      </CardHeader>
      <CardContent>
        {config.avatar && (
          <div className="flex justify-center mb-6">
            <Image
              src={config.avatar}
              alt={config.name || 'Avatar'}
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
        )}
        {config.name && (
          <h2 className="text-2xl font-bold text-center mb-4">{config.name}</h2>
        )}
        {config.bio && (
          <p className="text-muted-foreground text-center mb-6">{config.bio}</p>
        )}
        {config.links && config.links.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {config.links.map((link: any, index: number) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

