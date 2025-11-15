import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncSocialMedia } from '@/lib/social-media'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platforms = searchParams.get('platforms')?.split(',') || []
    const limit = parseInt(searchParams.get('limit') || '10')

    const posts = await prisma.socialMediaPost.findMany({
      where: {
        platform: platforms.length > 0 ? { in: platforms } : undefined,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        config: true,
      },
    })

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        platform: post.platform,
        platformId: post.platformId,
        content: post.content,
        url: post.url,
        imageUrl: post.imageUrl,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        publishedAt: post.publishedAt.toISOString(),
        metadata: post.metadata,
      })),
    })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

