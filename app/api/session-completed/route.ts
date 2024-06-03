import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/server/stripe'
import supabase from '@/server/supabase'
import { User } from '@/lib/types'

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string

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
  const body = await req.text()

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`)
    return NextResponse.json(null, { status: 400 })
  }

  let subscription
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break
    case 'checkout.session.completed':
      const checkout = event.data.object

      // Then define and call a function to handle the event checkout.session.completed
      break
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object
      // Then define and call a function to handle the event checkout.session.expired
      break
    case 'customer.subscription.created':
      const sub = event.data.object

      console.log("sub: ", sub)

      const { data: user } = await supabase
      .from('users')
      .select()
      .eq('stripeId', sub.customer)
      .limit(1)
      .single()
      
      console.log("USER: ", user)

      if (!user) {
        return NextResponse.json(null, { status: 400})
      }

      const newSub = await supabase.from("subscriptions").insert({
        id: sub.id,
        status: sub.status,
        userId: user.id,
      })

      break
    // ... handle other event types
    case 'customer.subscription.deleted':
      subscription = event.data.object
      console.log(subscription)
      
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json(null, { status: 200 })
}
