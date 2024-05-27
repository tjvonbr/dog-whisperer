import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@clerk/nextjs/server'
import { getMissingKeys, getUser } from '@/app/actions'

export default async function ChatPage() {
  const id = nanoid()
  const { userId } = auth()

  let user = null
  if (userId) {
    user = await getUser(userId)
  }

  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} user={user} missingKeys={missingKeys} />
    </AI>
  )
}
