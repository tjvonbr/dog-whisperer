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
import { IconSignOut } from './ui/icons'

export default function UserMenu() {
  const router = useRouter()
  const { isLoaded, user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  if (!isLoaded) return null
  // Make sure there is valid user data
  if (!user?.id) return null

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
          <DropdownMenuItem>Billing</DropdownMenuItem>
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
