'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { IconMenu } from './ui/icons'
import { useRouter } from 'next/navigation'

export default function AuthMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconMenu className="size-6 text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-sm"
            onClick={() => router.push('/sign-in')}
          >
            Sign-in
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/sign-in')}>
            Sign-up
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
