import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@clerk/nextjs/server'
import { getMissingKeys } from '@/app/actions'
import { redirect } from 'next/navigation'
import { getUserById } from '@/lib/helpers/users'

export default async function IndexPage() {
  const id = nanoid()
  const { userId } = auth()

  let user = null
  if (userId) {
    user = await getUserById(userId)
  }

  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} user={user} missingKeys={missingKeys} />
    </AI>
  )
}
