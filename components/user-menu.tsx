'use client'

import Image from 'next/image'
import { useClerk, useUser } from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function UserMenu() {
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded || !user?.id) {
    return null
  }

  async function createBillingSession() {
    const response = await fetch('/api/stripe/billing-session', {
      method: 'POST'
    })

    if (!response.ok) return toast.error('Whoops')

    const data = await response.json()

    router.replace(data.sessionUrl)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center">
        <Image
          className="rounded-full mr-2"
          alt={user?.primaryEmailAddress?.emailAddress!}
          src={user?.imageUrl}
          width={30}
          height={30}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4">
        <DropdownMenuLabel className="flex flex-col">
          <p className="text-xs text-black">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs font-light text-muted-foreground">
            {user?.username
              ? user.username
              : user?.primaryEmailAddress?.emailAddress!}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-sm"
            onClick={() => openUserProfile()}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => createBillingSession()}>
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={() => signOut(() => router.push('/sign-in'))}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
