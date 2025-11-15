import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import HomePage from '@/components/HomePage'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
  })

  if (!page) {
    return {}
  }

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || page.description || undefined,
    openGraph: {
      title: page.seoTitle || page.title,
      description: page.seoDescription || page.description || undefined,
      images: page.seoImage ? [page.seoImage] : undefined,
    },
  }
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string }
}) {
  const page = await prisma.page.findUnique({
    where: { slug: params.slug },
    include: {
      sections: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!page || !page.published) {
    notFound()
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
}

