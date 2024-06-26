'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Subscription, User } from '@/lib/types'
import getStripe from '@/lib/hooks/use-stripe'

export function PromptForm({
  input,
  setInput,
  setUser,
  subscription,
  user
}: {
  input: string
  setInput: (value: string) => void
  setUser: (value: User) => void
  subscription: Subscription | null
  user: User
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { submitUserMessage } = useActions()
  const [_, setMessages] = useUIState<typeof AI>()
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    const success = searchParams.get('success')
    if (success === 'true') {
      toast('Order placed!  Welcome to Dog Whisperer AI!')
    }

    if (success === 'false') {
      toast.error('Order canceled.')
    }
  })

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        if (!user.stripeId && user.credits === 0) {
          const response = await fetch('/api/checkout-session', {
            method: 'POST',
            body: JSON.stringify({
              userEmail: user.email,
              returnPath: pathname
            })
          })

          if (!response.ok) {
            toast.error("We couldn't connect to Stripe at this time.")
          }

          const data = await response.json()

          const stripe = await getStripe()

          return stripe?.redirectToCheckout({
            sessionId: data.sessionId
          })
        }

        if (
          !subscription ||
          (subscription.status !== 'active' && user.credits > 0)
        ) {
          const response = await fetch('/api/users/' + user.id, {
            method: 'PUT',
            body: JSON.stringify({
              ...user,
              credits: user.credits - 1
            })
          })

          if (!response.ok) {
            toast.error("We couldn't spend a credit for you at this time.")
          }

          const data = await response.json()
          setUser(data)
        }

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            role: 'user',
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      {!subscription && (
        <p className="mb-2 w-full text-center text-red-500 text-sm mx-auto">
          You have <span className="font-bold">{user.credits}</span> credits
          left. Purchase your subscription{' '}
          <span
            className="text-red-500 underline hover:cursor-pointer"
            onClick={async () => {
              const response = await fetch('/api/checkout-session', {
                method: 'POST',
                body: JSON.stringify({
                  userEmail: user.email,
                  returnPath: pathname
                })
              })

              if (!response.ok) {
                toast.error("We couldn't connect to Stripe at this time.")
              }

              const data = await response.json()

              const stripe = await getStripe()

              return stripe?.redirectToCheckout({
                sessionId: data.sessionId
              })
            }}
          >
            here
          </span>
          .
        </p>
      )}
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/chat')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={input === '' || user.credits === 0}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
