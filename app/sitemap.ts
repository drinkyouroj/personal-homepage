import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  
  try {
    const pages = await prisma.page.findMany({
      where: { published: true },
    })

    const routes = pages.map((page) => ({
      url: `${baseUrl}/${page.slug === 'home' ? '' : page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'daily' as const,
      priority: page.slug === 'home' ? 1 : 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...routes,
    ]
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}

