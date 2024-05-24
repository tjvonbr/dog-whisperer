import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import stripe from '@/server/stripe'

export async function POST(req: NextResponse) {
  try {
    const { userId } = auth()

    if (!userId) {
      return NextResponse.json('User is not authenticated.', { status: 401 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PRICE_ID as string,
          quantity: 1
        }
      ],
      success_url: '',
      cancel_url: '',
      metadata: {
        externalId: userId
      }
    })
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500 })
  }
}
