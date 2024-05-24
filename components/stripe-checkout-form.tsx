'use client'

import { Button } from './ui/button'

export default function StripeCheckoutForm() {
  async function handleSubmit(e: React.FormEvent<HTMLButtonElement>) {
    e.preventDefault()

    const checkoutSession = await fetch('/api/checkout-session', {
      method: 'POST'
    })
  }

  return <Button>hello</Button>
}
