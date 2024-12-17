import { type Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getChat, getMissingKeys, getUser } from '@/app/actions'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/app/auth'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({
  params
}: ChatPageProps): Promise<Metadata> {
  const session = await auth()

  if (!session) {
    return {}
  }

  const chat = await getChat(params.id, session.user?.id!)
  return {
    title: chat?.title.toString().slice(0, 50) ?? 'Chat'
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = auth()

  const missingKeys = await getMissingKeys()

  if (!session) {
    redirect(`/sign-in?next=/chat/${params.id}`)
  }

  const user = await getUser(session.user?.id!)

  if (!user) {
    redirect('/sign-up')
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    redirect('/chat')
  }

  if (chat?.userId !== user.id) {
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
