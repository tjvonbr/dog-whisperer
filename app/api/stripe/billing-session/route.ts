import stripe from '@/server/stripe'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: 'cus_QARFo5XogrvnDm',
      return_url: req.nextUrl.origin
    })

    if (!session) {
      return NextResponse.json(null, { status: 400 })
    }

    return NextResponse.json({ sessionUrl: session.url }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(error, { status: 500 })
  }
}
