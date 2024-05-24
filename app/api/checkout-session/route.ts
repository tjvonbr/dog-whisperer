import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/server/stripe'

export async function POST(req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PACKAGE_PRODUCT_ID as string,
          quantity: 1
        }
      ],
      success_url:
        'http://localhost:3000/order/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/canceled.html'
    })

    if (!session) {
      return NextResponse.json(null, { status: 400 })
    }

    return NextResponse.json({ sessionId: session.id }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500 })
  }
}
