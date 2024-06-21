import Link from 'next/link'
import { buttonVariants } from './ui/button'
import {
  IconChain,
  IconChat,
  IconCommunity,
  IconHouse,
  IconLogo,
  IconTrophy
} from './ui/icons'
import { cn } from '@/lib/utils'

export default function PricingCard() {
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
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({ variant: 'default' }),
            'mt-6 bg-green-500 hover:bg-green-500/90'
          )}
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
