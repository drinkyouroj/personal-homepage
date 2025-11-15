import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { syncSocialMedia } from '@/lib/social-media'

export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await syncSocialMedia(params.platform)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to sync:', error)
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 })
  }
}

