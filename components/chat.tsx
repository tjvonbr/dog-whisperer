'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useRef, useState } from 'react'
import { useUIState, useAIState } from 'ai/rsc'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Message } from '@/lib/chat/actions'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { Subscription, User } from '@/lib/types'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  subscription: Subscription | null
  user: User
  missingKeys: string[]
}

export function Chat({
  id,
  className,
  user,
  missingKeys,
  subscription
}: ChatProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  const toastShownRef = useRef({ success: false, canceled: false })

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success && !toastShownRef.current.success) {
      toast('Success!', {
        description: 'You can now start chatting with your AI assistant.',
        dismissible: true
      })
      toastShownRef.current.success = true
      // Create a new URLSearchParams without the 'success' parameter
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('success')
      router.replace(`${pathname}?${newSearchParams.toString()}`)
    }

    if (canceled && !toastShownRef.current.canceled) {
      toast('Canceled', {
        description: `That's alright!  You still have ${user.credits} credits left.`,
        dismissible: true
      })
      toastShownRef.current.canceled = true
      // Create a new URLSearchParams without the 'canceled' parameter
      const newSearchParams = new URLSearchParams(searchParams)
      newSearchParams.delete('canceled')
      router.replace(`${pathname}?${newSearchParams.toString()}`)
    }
  }, [searchParams, router, pathname, user.credits])

  useEffect(() => {
    if (user) {
      if (pathname.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, pathname, user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 2) {
      router.refresh()
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  })

  useEffect(() => {
    missingKeys.map(key => {
      toast.error(`Missing ${key} environment variable!`)
    })
  }, [missingKeys])

  const { messagesRef, scrollRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  return (
    <div
      className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]"
      ref={scrollRef}
    >
      <div
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
        ref={messagesRef}
      >
        <ChatList messages={messages} isShared={false} userId={user?.id} />
        <div className="h-px w-full" ref={visibilityRef} />
      </div>
      <ChatPanel
        id={id}
        input={input}
        setInput={setInput}
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
        subscription={subscription}
        user={user}
      />
    </div>
  )
}
