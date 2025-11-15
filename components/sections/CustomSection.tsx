'use client'

import { Section } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CustomSectionProps {
  section: Section
}

export default function CustomSection({ section }: CustomSectionProps) {
  const config = section.config || {}
  const customStyle = section.style || {}

  const colSpan = config.columns || 1
  const colSpanClass = colSpan === 1 ? 'col-span-1' : colSpan === 2 ? 'col-span-2' : 'col-span-full'

  return (
    <Card
      className={`${colSpanClass} md:${colSpanClass}`}
      style={customStyle}
    >
      {config.title && (
        <CardHeader>
          <CardTitle>{config.title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {config.content && (
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: config.content }}
          />
        )}
        {config.html && (
          <div dangerouslySetInnerHTML={{ __html: config.html }} />
        )}
      </CardContent>
    </Card>
  )
}

