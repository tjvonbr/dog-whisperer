import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@clerk/nextjs/server'
import { getMissingKeys, getUser } from '@/app/actions'
import { getSubscription } from '@/supabase/functions/subscriptions'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const [user, subscription, missingKeys] = await Promise.all([
    await getUser(userId),
    await getSubscription(userId),
    await getMissingKeys()
  ])

  const id = nanoid()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat
        id={id}
        subscription={subscription}
        user={user}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
