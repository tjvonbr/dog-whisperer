'use client'

import getStripe from '@/lib/hooks/use-stripe'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function HeaderCheckoutButton() {
  async function handleCheckout() {
    const stripe = await getStripe()

    const response = await fetch('/api/checkout-session', {
      method: 'POST'
    })

    if (!response.ok) {
      toast.error("We couldn't connect to Stripe at this time.")
    }

    const data = await response.json()

    return stripe?.redirectToCheckout({
      sessionId: data.sessionId
    })
  }

  return (
    <Button variant="default" onClick={handleCheckout}>
      Get full access!
    </Button>
  )
}
