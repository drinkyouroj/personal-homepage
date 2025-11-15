import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany()
    const settingsMap: Record<string, any> = {}

    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value
    })

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    const updates = [
      { key: 'siteTitle', value: body.siteTitle },
      { key: 'siteDescription', value: body.siteDescription },
      { key: 'googleAnalyticsId', value: body.googleAnalyticsId },
      { key: 'plausibleDomain', value: body.plausibleDomain },
      { key: 'analyticsEnabled', value: body.analyticsEnabled },
    ]

    await Promise.all(
      updates.map((update) =>
        prisma.siteSettings.upsert({
          where: { key: update.key },
          update: { value: update.value },
          create: { key: update.key, value: update.value },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

