import AuthMenu from '@/components/auth-menu'
import { buttonVariants } from '@/components/ui/button'
import { IconLogo } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function IndexPage() {
  return (
    <div className="h-screen w-full bg-black">
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 shrink-0">
        <div className="flex items-center space-x-2">
          <IconLogo className="size-8 md:size-10 text-white" />
          <p className="text-lg text-white font-black">Dog Whisperer AI</p>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'text-white border-white bg-black'
            )}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'text-white border-white bg-black'
            )}
          >
            Sign up
          </Link>
        </div>
        <div className="md:hidden">
          <AuthMenu />
        </div>
      </header>
      <div className="container max-w-[850px] my-24 md:my-48 flex flex-col items-center space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl text-slate-100 font-black">
          World-class dog training advice for a fraction of the price
        </h1>
        <h2 className="md:text-xl text-slate-100 font-medium">
          Powered by AI, Dog Whisperer offers step-by-step advice to train your
          dog using a modern, force-free approach.
        </h2>
        <div className="my-12">
          <Link
            href="/sign-up"
            className={cn(buttonVariants({ variant: 'outline' }), 'px-8 py-6')}
          >
            Start training today!
          </Link>
        </div>
      </div>
    </div>
  )
}
