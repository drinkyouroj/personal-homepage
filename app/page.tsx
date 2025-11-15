import HomePage from '@/components/HomePage'
import { prisma } from '@/lib/prisma'

export default async function Page() {
  try {
    const page = await prisma.page.findFirst({
      where: { slug: 'home', published: true },
      include: {
        sections: {
          where: { visible: true },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      // Create default home page if it doesn't exist
      return <HomePage sections={[]} />
    }

    // Transform Prisma sections to match Section type
    const sections = page.sections.map((section) => ({
      id: section.id,
      pageId: section.pageId,
      type: section.type as 'social-feed' | 'about' | 'stats' | 'custom',
      order: section.order,
      config: section.config as Record<string, any>,
      style: section.style as Record<string, any> | undefined,
      visible: section.visible,
      createdAt: section.createdAt.toISOString(),
      updatedAt: section.updatedAt.toISOString(),
    }))

    return <HomePage sections={sections} />
  } catch (error) {
    // If database is not set up yet, show empty page
    console.error('Error fetching page:', error)
    return <HomePage sections={[]} />
  }
}

