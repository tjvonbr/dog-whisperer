import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getChat, getMissingKeys, getUser } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { getSubscription } from '@/supabase/functions/subscriptions'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const { userId } = await auth()

  if (!userId) {
    return {}
  }

  const chat = await getChat(params.id, userId)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { userId } = auth()

  const missingKeys = await getMissingKeys()

  if (!userId) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const user = await getUser(userId)

  if (!user) {
    redirect('/sign-up')
  }

  const chat = await getChat(params.id, userId)

  if (!chat) {
    redirect('/chat')
  }

  if (chat?.userId !== userId) {
    notFound()
  }

  const subscription = await getSubscription(userId)

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat
        id={chat.id}
        user={user}
        initialMessages={chat.messages}
        missingKeys={missingKeys}
        subscription={subscription}
      />
    </AI>
  )
}
