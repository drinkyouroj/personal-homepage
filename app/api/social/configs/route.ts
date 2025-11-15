import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const configs = await prisma.socialMediaConfig.findMany()
    return NextResponse.json(configs)
  } catch (error) {
    console.error('Failed to fetch configs:', error)
    return NextResponse.json({ error: 'Failed to fetch configs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const config = await prisma.socialMediaConfig.upsert({
      where: { platform: body.platform },
      update: {
        enabled: body.enabled ?? false,
        ...(body.apiKey && { apiKey: body.apiKey }),
        ...(body.apiSecret && { apiSecret: body.apiSecret }),
        ...(body.username && { username: body.username }),
        ...(body.userId && { userId: body.userId }),
      },
      create: {
        platform: body.platform,
        enabled: body.enabled ?? false,
        apiKey: body.apiKey,
        apiSecret: body.apiSecret,
        username: body.username,
        userId: body.userId,
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to create config:', error)
    return NextResponse.json({ error: 'Failed to create config' }, { status: 500 })
  }
}

