import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/server/stripe'
import supabase from '@/server/supabase'

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

  switch (event.type) {
    case 'customer.subscription.created':
      const newSub = event.data.object

      const { data: user } = await supabase.from('users').select('id').eq('stripeId', newSub.customer).limit(1).single()

      if (!user) {
        break
      }

      await supabase.from('subscriptions').insert({
        id: newSub.id,
        status: newSub.status,
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await supabase.from('users').update({
        subscriptionId: newSub.id,
        updatedAt: new Date()
      }).eq(
        "stripeId",
        newSub.customer
      )

      break
    case 'customer.subscription.updated':
      const updatedSub = event.data.object
      console.log('updated sub: ' , updatedSub)

      await supabase.from('subscriptions').update({
        status: updatedSub.status,
        updatedAt: new Date()
      }).eq(
        "id",
        updatedSub.id
      )

      break
    case 'customer.subscription.deleted':
      const deletedSub = event.data.object

      await supabase.from('subscriptions').update({
        status: deletedSub.status
      }).eq(
        "id",
        deletedSub.id
      )

      break
    case 'invoice.paid':
      const invoice = event.data.object
      
      await supabase.from('subscriptions').update({
        status: 'active'
      }).eq(
        'id',
        invoice.subscription
      )

      break
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

      const result = await supabase
        .from('users')
        .update({
          subscriptionId: checkout.subscription
        })
        .eq('stripeId', checkout.customer)

      // Then define and call a function to handle the event checkout.session.completed
      break
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object
      // Then define and call a function to handle the event checkout.session.expired
      break
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json(null, { status: 200 })
}
