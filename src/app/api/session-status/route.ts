import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email || ''
    })
  } catch (error) {
    console.error('Error retrieving session:', error)
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 })
  }
}
