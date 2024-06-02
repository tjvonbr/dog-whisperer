'use client'

import { toast } from 'sonner'
import { Button } from './ui/button'
import {
  IconChain,
  IconChat,
  IconCommunity,
  IconHouse,
  IconLogo,
  IconTrophy
} from './ui/icons'
import getStripe from '@/lib/hooks/use-stripe'

export default function PricingCard() {
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
    <div className="lg:sticky lg:top-32 lg:h-[400px] flex flex-col bg-indigo-50 w-full max-w-[400px] rounded-md shadow-lg">
      <div className="px-2 flex-none h-12 lg:h-14 w-full flex justify-between items-center bg-white rounded-t-md border-b">
        <div className="flex items-center space-x-1">
          <IconLogo className="size-6 md:size-10 text-black" />
          <p className="text-sm lg:text-lg text-black font-black">
            Dog Whisperer AI
          </p>
        </div>
        <p className="text-sm lg:text-lg text-black font-bold">$9.99/mo</p>
      </div>
      <div className="container grow flex flex-col justify-between py-3.5">
        <div>
          <p className="text-sm lg:text-lg text-black font-bold">
            What&apos;s included?
          </p>
          <div className="my-1.5 flex items-center text-xs lg:text-sm text-black">
            <IconChat className="mr-2 text-black size-4 lg:size-6" />
            Unlimited conversations with Zoe, our AI chatbot
          </div>
          <div className="my-1.5 flex items-center text-xs lg:text-sm text-black">
            <IconCommunity className="mr-2 text-black font-bold size-4 lg:size-6" />
            Access to our invite-only member communities
          </div>
          <div className="my-1.5 flex items-center text-xs lg:text-sm text-black">
            <IconTrophy className="mr-2 text-black font-bold size-4 lg:size-6" />
            Entry into our member-only training contests
          </div>
          <p className="mt-4 text-sm lg:text-lg text-black font-bold">
            What do you need?
          </p>
          <div className="my-1.5 flex items-center text-xs lg:text-sm text-black">
            <IconHouse className="mr-2 text-black font-bold size-4 lg:size-6" />
            A safe place to practice with your pup
          </div>
          <div className="my-1.5 flex items-center text-xs lg:text-sm text-black">
            <IconChain className="mr-2 text-black font-bold size-4 lg:size-6" />
            Time to consistently work on your training
          </div>
        </div>
        <Button
          className="mt-6 bg-green-500 hover:bg-green-500/90"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  )
}
