import { IconLogo } from '@/components/ui/icons'
import UserForm from '@/components/user-form'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const metadata = {
  title: 'Sign in to your account',
  description: 'Sign in to get started.'
}

export default async function SignInPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/sign-in"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Sign up
      </Link>
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center items-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col items-center space-y-2 text-center">
            <IconLogo className="size-8" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link!
            </p>
          </div>
          <UserForm />
        </div>
      </div>
    </div>
  )
}
