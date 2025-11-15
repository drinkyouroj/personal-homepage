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

  return <HomePage sections={page.sections} />
}

