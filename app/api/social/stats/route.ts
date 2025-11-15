import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platforms = searchParams.get('platforms')?.split(',') || []

    const stats: Record<string, number> = {}

    if (platforms.includes('github')) {
      const githubPosts = await prisma.socialMediaPost.count({
        where: { platform: 'github' },
      })
      stats.github_posts = githubPosts
    }

    if (platforms.includes('twitter')) {
      const twitterPosts = await prisma.socialMediaPost.count({
        where: { platform: 'twitter' },
      })
      stats.twitter_posts = twitterPosts
    }

    if (platforms.includes('youtube')) {
      const youtubePosts = await prisma.socialMediaPost.count({
        where: { platform: 'youtube' },
      })
      stats.youtube_videos = youtubePosts
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

