import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '@/app/actions'
import { nanoid } from 'ai'
import { FreeChat } from '@/components/free-chat'
import { Header } from '@/components/header'

export default async function FreeDogNameGenerator() {
  const id = nanoid()

  const missingKeys = await getMissingKeys()

  return (
    <div>
      <Header />
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <FreeChat id={id} missingKeys={missingKeys} />
      </AI>
    </div>
  )
}
