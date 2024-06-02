import { redirect } from 'next/navigation'
import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function LoginPage() {
  const { userId } = auth()

  if (userId) {
    redirect('/chat')
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col justify-center items-center">
      <SignIn path="/sign-in" forceRedirectUrl="/chat" />
    </div>
  )
}
