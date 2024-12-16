import { UIState } from '@/lib/chat/actions'
import Link from 'next/link'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Subscription } from '@/lib/types'

export interface ChatList {
  messages: UIState
  userId?: string
  isShared: boolean
}

export function ChatList({ messages, userId, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative flex flex-col mx-auto max-w-2xl px-4">
      {!isShared && !userId ? (
        <>
          <div className="group relative mb-4 flex items-start md:-ml-12">
            <div className="bg-background flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border shadow-sm">
              <ExclamationTriangleIcon />
            </div>
            <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
              <p className="text-muted-foreground leading-normal">
                Please{' '}
                <Link href="/sign-in" className="underline">
                  log in
                </Link>{' '}
                or{' '}
                <Link href="/signup" className="underline">
                  sign up
                </Link>{' '}
                to save and revisit your chat history!
              </p>
            </div>
          </div>
        </>
      ) : null}

      {messages.map(message => (
        <div
          key={message.id}
          className={cn(
            'my-4',
            message.role === 'user' ? 'self-end' : 'self-start'
          )}
        >
          {message.display}
        </div>
      ))}
    </div>
  )
}
