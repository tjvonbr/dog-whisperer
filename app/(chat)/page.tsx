import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions'
import { auth } from '@clerk/nextjs/server'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
  const id = nanoid()
  const { userId } = auth()

  if (!userId) {
    redirect('/login')
  }

  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} userId={userId} missingKeys={missingKeys} />
    </AI>
  )
}
