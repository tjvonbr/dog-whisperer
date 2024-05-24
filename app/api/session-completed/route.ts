import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/server/stripe'

export async function POST(req: NextRequest) {
  const webhookSecret = '{{STRIPE_WEBHOOK_SECRET}}'

  if (!webhookSecret) {
    return NextResponse.json(
      { message: 'Stripe webhook secret is not configured.' },
      { status: 400 }
    )
  }

  const headerPayload = headers()
  const signature = headerPayload.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No Stripe signature header provided.' },
      { status: 400 }
    )
  }

  let event
  const body = await req.json()

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`)
    return NextResponse.json(null, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed':
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      break
    case 'invoice.paid':
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      break
    case 'invoice.payment_failed':
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      break
    default:
    // Unhandled event type
  }

  return NextResponse.json(null, { status: 200 })
}
