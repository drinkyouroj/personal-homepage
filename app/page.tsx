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

    return <HomePage sections={page.sections} />
  } catch (error) {
    // If database is not set up yet, show empty page
    console.error('Error fetching page:', error)
    return <HomePage sections={[]} />
  }
}

