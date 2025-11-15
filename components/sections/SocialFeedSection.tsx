'use client'

import { useEffect, useState } from 'react'
import { Section, SocialMediaPost } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

interface SocialFeedSectionProps {
  section: Section
}

export default function SocialFeedSection({ section }: SocialFeedSectionProps) {
  const [posts, setPosts] = useState<SocialMediaPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const platforms = section.config?.platforms || []
        const limit = section.config?.limit || 6

        const response = await fetch(
          `/api/social/posts?platforms=${platforms.join(',')}&limit=${limit}`
        )
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
    const interval = setInterval(fetchPosts, section.config?.refreshInterval || 60000)
    return () => clearInterval(interval)
  }, [section])

  const customStyle = section.style || {}

  if (loading) {
    return (
      <Card className="col-span-full" style={customStyle}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const colSpan = section.config?.columns || 1
  const colSpanClass = colSpan === 1 ? 'col-span-1' : colSpan === 2 ? 'col-span-2' : 'col-span-full'

  return (
    <Card
      className={`${colSpanClass} md:${colSpanClass}`}
      style={customStyle}
    >
      <CardHeader>
        <CardTitle>{section.config?.title || 'Latest Activity'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-b border-border pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-3">
                {post.authorAvatar && (
                  <Image
                    src={post.authorAvatar}
                    alt={post.authorName || 'Author'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      {post.authorName || post.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm mb-2 line-clamp-3">{post.content}</p>
                  {post.imageUrl && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                      <Image
                        src={post.imageUrl}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    View on {post.platform} →
                  </a>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No posts available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

