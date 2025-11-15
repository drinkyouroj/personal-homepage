import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const config = await prisma.socialMediaConfig.update({
      where: { platform: params.platform },
      data: {
        ...(body.enabled !== undefined && { enabled: body.enabled }),
        ...(body.apiKey !== undefined && { apiKey: body.apiKey }),
        ...(body.apiSecret !== undefined && { apiSecret: body.apiSecret }),
        ...(body.username !== undefined && { username: body.username }),
        ...(body.userId !== undefined && { userId: body.userId }),
        ...(body.accessToken !== undefined && { accessToken: body.accessToken }),
        ...(body.refreshToken !== undefined && { refreshToken: body.refreshToken }),
      },
    })

    return NextResponse.json(config)
  } catch (error) {
    console.error('Failed to update config:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}

