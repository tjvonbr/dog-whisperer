import AuthMenu from '@/components/auth-menu'
import PricingCard from '@/components/pricing-card'
import { IconLogo } from '@/components/ui/icons'
import Link from 'next/link'

export default function IndexPage() {
  return (
    <div className="min-h-screen w-full bg-indigo-500">
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 shrink-0 bg-indigo-600">
        <div className="flex items-center space-x-2">
          <IconLogo className="size-8 md:size-10 text-white" />
          <p className="text-lg text-white font-black">Dog Whisperer AI</p>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/sign-in"
            className="px-4 py-2.5 bg-transparent rounded-md text-sm text-white font-semibold"
          >
            Sign in
          </Link>
        </div>
        <div className="md:hidden">
          <AuthMenu />
        </div>
      </header>
      <div className="flex flex-col lg:flex-row">
        <div className="container max-w-[650px] my-6 flex flex-col items-center">
          <div className="lg:hidden">
            <PricingCard />
          </div>
          <div className="my-24 flex flex-col space-y-4">
            <p className="text-3xl md:text-5xl text-indigo-50 font-black">
              Dog Whisperer AI
            </p>
            <h1 className="text-2xl md:text-3xl text-indigo-50 font-bold">
              World-class dog training for a fraction of the price
            </h1>
            <h2 className="text-lg md:text-md text-indigo-50">
              Skip the busy weekend classes at PetSmart and forget paying the
              private trainer. Train your dog from the comfort of your home with
              our AI-powered dog training assistant, Zoe.
            </h2>
          </div>
          <div className="grid gap-16">
            <div className="grid gap-2">
              <h3 className="text-2xl text-white font-bold">
                What is Dog Whisperer?
              </h3>
              <p className="text-lg text-indigo-50">
                Dog Whisperer is an AI-powered chatbot that is trained to
                provide modern, force-free training advice. You can ask for
                advice on a range of desired behaviors of varying complexities!
                Our chatbot is named Zoe, after the founder&apos;s
                chihuahua/pitbull puppy!
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-2xl text-white font-bold">
                Why not just take my dog to PetSmart?
              </h3>
              <p className="text-lg text-indigo-50">
                Your local pet store will offer classes, and those are fine.
                Prices very, but the cheaper classes are about $20 per class and
                meet 1x week. We think our $9.99/month is a better deal. You
                receive unlimited, 24/7 attention from Zoe, ur AI-powered dog
                training assistant, and you get to train your dog from the
                comfort of your own home!
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-2xl text-white font-bold">
                Why join your online communities?
              </h3>
              <p className="text-lg text-indigo-50">
                Dog owners are an active bunch and we want to provide a safe,
                engaging online community to ask for help, celebrate wins, and
                share updates with each other. We plan to hold many contests in
                the future once we&apos;ve built the community a bit more! So
                stay tuned!
              </p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-2xl text-white font-bold">
                We love Zoe, but...
              </h3>
              <p className="text-lg text-indigo-50">
                If you run into any behavioral issues or health concerns with
                your pup, please seek professional assistance in your area. Zoe
                is great at training, but she does not replace expert care of
                trained professionals!
              </p>
            </div>
          </div>
        </div>
        <div className="hidden w-[600px] lg:flex lg:flex-col items-center py-6">
          <PricingCard />
        </div>
      </div>

      <footer className="h-12 flex justify-center items-center border border-indigo-400 text-xs text-indigo-200">
        Copyright © Dog Whisperer AI. All rights reserved.
      </footer>
    </div>
  )
}
