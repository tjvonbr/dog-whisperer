'use client'

import Image from 'next/image'
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
import { User } from '@prisma/client'
import { signOut } from 'next-auth/react'

interface UserMenuProps {
  user: User
}

export default function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

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
          alt={user.email}
          src={user.email}
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
            {user.firstName
              ? user.firstName
              : user.email
            }
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-sm"
            onClick={() => console.log('profile')}
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
          onClick={() => signOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
