import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const page = await prisma.page.findFirst({
      where: { slug: 'home' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!page) {
      return NextResponse.json([])
    }

    return NextResponse.json(page.sections)
  } catch (error) {
    console.error('Failed to fetch sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Ensure home page exists
    let page = await prisma.page.findFirst({
      where: { slug: 'home' },
    })

    if (!page) {
      page = await prisma.page.create({
        data: {
          slug: 'home',
          title: 'Home',
          published: true,
        },
      })
    }

    const section = await prisma.section.create({
      data: {
        pageId: page.id,
        type: body.type,
        config: body.config || {},
        style: body.style || {},
        order: body.order ?? 0,
        visible: body.visible ?? true,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Failed to create section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

