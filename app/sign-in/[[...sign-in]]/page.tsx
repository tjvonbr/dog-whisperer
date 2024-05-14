import { IconLogo } from '@/components/ui/icons'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function LoginPage() {
  const { userId } = auth()

  if (userId) {
    redirect('/')
  }

  return (
    <div className="container flex size-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <IconLogo className="mx-auto size-6" />
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password to sign in to your account
          </p>
        </div>
        <SignIn path="/sign-in" />
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/signup"
            className="hover:text-brand underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
