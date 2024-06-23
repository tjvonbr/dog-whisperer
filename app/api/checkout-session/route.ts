import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/server/stripe'
import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { getUser } from '@/app/actions'

const checkoutSchema = z.object({
  userEmail: z.string().optional(),
  returnPath: z.string(),
})

export async function POST(req: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 })
  }

  const json = await req.json()
  const body = checkoutSchema.parse(json)

  const user = await getUser(userId)
  const returnUrl = req.nextUrl.origin + body.returnPath

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: user.stripeId,
      line_items: [
        {
          price: process.env.STRIPE_BASIC_PACKAGE_PRODUCT_ID as string,
          quantity: 1
        }
      ],
      success_url: `${returnUrl}/?success=true`,
      cancel_url: `${returnUrl}/?canceled=true`,
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
