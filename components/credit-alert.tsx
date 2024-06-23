'use client'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import getStripe from '@/lib/hooks/use-stripe'
import { toast } from 'sonner'
import { User } from '@/lib/types'
import { usePathname } from 'next/navigation'

interface CreditAlertProps {
  user: User
}

export function CreditAlert({ user }: CreditAlertProps) {
  const pathname = usePathname()

  async function handleCheckout() {
    const response = await fetch('/api/checkout-session', {
      method: 'POST',
      body: JSON.stringify({
        userEmail: user.email,
        returnPath: pathname
      })
    })

    if (!response.ok) {
      toast.error("We couldn't connect to Stripe at this time.")
    }

    const data = await response.json()

    const stripe = await getStripe()

    return stripe?.redirectToCheckout({
      sessionId: data.sessionId
    })
  }

  return (
    <Alert className="mb-4" variant="destructive">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You only have <span className="font-bold">{user.credits}</span> credits
        remaining. Purchase your subscription{' '}
        <span
          className="underline hover:cursor-pointer"
          onClick={handleCheckout}
        >
          here
        </span>
        .
      </AlertDescription>
    </Alert>
  )
}
