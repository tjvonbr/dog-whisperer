import { Button } from './ui/button'
import {
  IconChain,
  IconChat,
  IconCommunity,
  IconHouse,
  IconLogo,
  IconTrophy
} from './ui/icons'

export default function PricingCard() {
  return (
    <div className="flex flex-col bg-indigo-50 w-full max-w-[400px] rounded-md shadow-lg">
      <div className="px-2 flex-none h-12 w-full flex justify-between items-center bg-white rounded-t-md border-b">
        <div className="flex items-center space-x-1">
          <IconLogo className="size-6 md:size-10 text-black" />
          <p className="text-sm text-black font-black">Dog Whisperer AI</p>
        </div>
        <p className="text-sm text-black font-bold">$9.99/mo</p>
      </div>
      <div className="container grow flex flex-col justify-between py-3.5">
        <div>
          <p className="text-sm text-black font-bold">What&apos;s included?</p>
          <div className="my-1.5 flex items-center text-xs text-black">
            <IconChat className="mr-2 text-black size-4" />
            Unlimited conversations with Zoe, our AI chatbot
          </div>
          <div className="my-1.5 flex items-center text-xs text-black">
            <IconCommunity className="mr-2 text-black font-bold size-4" />
            Access to our invite-only member communities
          </div>
          <div className="my-1.5 flex items-center text-xs text-black">
            <IconTrophy className="mr-2 text-black font-bold size-4" />
            Entry into our member-only training contests
          </div>
          <p className="mt-4 text-sm text-black font-bold">What do you need?</p>
          <div className="my-1.5 flex items-center text-xs text-black">
            <IconHouse className="mr-2 text-black font-bold size-4" />A safe
            place to practice with your pup
          </div>
          <div className="my-1.5 flex items-center text-xs text-black">
            <IconChain className="mr-2 text-black font-bold size-4" />
            Time to consistently work on your training
          </div>
        </div>
        <Button className="mt-6 bg-green-500 hover:bg-green-500/90">
          Checkout
        </Button>
      </div>
    </div>
  )
}
