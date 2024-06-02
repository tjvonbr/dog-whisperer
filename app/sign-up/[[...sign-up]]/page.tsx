import { SignUp } from '@clerk/nextjs'
import { IconLogo } from '@/components/ui/icons'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export const metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.'
}

export default async function SignupPage() {
  const { userId } = auth()

  if (userId) {
    redirect('/chat')
  }

  return (
    <div className="container grid size-full flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden h-full bg-muted lg:block" />
      <div className="h-[calc(100vh-64px)] flex flex-col justify-center items-center lg:p-8">
        <SignUp path="/sign-up" forceRedirectUrl="/chat" />
      </div>
    </div>
  )
}
