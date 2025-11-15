import { NextRequest, NextResponse } from 'next/server'
import { createUser } from '@/lib/auth'

// This endpoint is for initial user creation
// In production, you might want to add additional security
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await createUser(email, password, name)
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }
    console.error('Failed to create user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

