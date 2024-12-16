import * as React from 'react'
import Link from 'next/link'
import { IconLogo, IconNextChat } from '@/components/ui/icons'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import UserMenu from './user-menu'
import { getUser } from '@/app/actions'
import { auth } from '@/app/auth'

async function UserOrLogin() {
  const session = await auth()

  let user = null
  if (session && session?.user?.id) {
    user = await getUser(session.user.id)
  }

  return (
    <div className="w-full flex justify-between items-center">
      {session ? (
        <>
          <SidebarMobile>
            <ChatHistory user={user} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconLogo className="size-6 mr-2 dark:hidden" />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      {session && <UserMenu />}
    </div>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="w-full flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
    </header>
  )
}
