'use client'

import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import getStripe from '@/lib/hooks/use-stripe'
import { toast } from 'sonner'
import { User } from '@/lib/types'
import { usePathname } from 'next/navigation'

interface CanceledAlertProps {
  user: User
}

export function CanceledAlert({ user }: CanceledAlertProps) {
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
      <AlertTitle>Looks like you canceled!</AlertTitle>
      <AlertDescription>
        If you want to start getting again, please click{' '}
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
