import { cache } from 'react'
import { clearChats, getChats } from '@/app/actions'
import { ClearHistory } from '@/components/clear-history'
import { SidebarItems } from '@/components/sidebar-items'
import { ThemeToggle } from '@/components/theme-toggle'
import { User } from '@/lib/types'
import { getSubscription } from '@/supabase/functions/subscriptions'
import { CanceledAlert } from './canceled-alert'

interface SidebarListProps {
  user: User
  children?: React.ReactNode
}

const loadChats = cache(async (userId?: string) => {
  return await getChats(userId)
})

export async function SidebarList({ user }: SidebarListProps) {
  const chats = await loadChats(user?.id)
  const subscription = await getSubscription(user?.id)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-auto">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            <SidebarItems chats={chats} />
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </div>
      <div className="w-full flex flex-col">
        <div className="flex flex-col items-center justify-between p-4">
          {subscription && subscription.status === 'canceled' && (
            <CanceledAlert user={user} />
          )}
          <div className="w-full flex justify-between items-center">
            <ThemeToggle />
            <ClearHistory
              clearChats={clearChats}
              isEnabled={chats?.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
