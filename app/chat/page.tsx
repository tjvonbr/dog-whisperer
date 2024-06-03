import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@clerk/nextjs/server'
import { getMissingKeys, getUser } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const id = nanoid()
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await getUser(userId)
  console.log(user)

  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} user={user} missingKeys={missingKeys} />
    </AI>
  )
}
