'use client'

import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconSeparator, IconShare } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { toast } from 'sonner'
import getStripe from '@/lib/hooks/use-stripe'
import { Subscription, User } from '@/lib/types'
import HeaderCheckoutButton from './checkout-button'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  subscription: Subscription | null
  user: User
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  subscription,
  user: propsUser
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [user, setUser] = React.useState<User>(propsUser)

  const popularQueries = [
    {
      heading: 'Potty training',
      subheading: 'How can I potty train my dog?',
      message: `How can I potty train my dog?`
    },
    {
      heading: 'Leash training',
      subheading: 'How can I stop my dog from pulling on the leash?',
      message: 'How can I stop my dog from pulling on the leash?'
    },
    {
      heading: 'Crate training',
      subheading: 'How do I get my puppy to like its kennel?',
      message: 'How do I get my puppy to like its kennel?'
    },
    {
      heading: 'Barking',
      subheading: 'My dog barks at everything!  What can I do?',
      message: `My dog barks at everything!  What can I do?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="mb-4 grid grid-cols-2 gap-2 px-4 sm:px-0">
          {messages.length === 0 &&
            popularQueries.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 && 'hidden md:block'
                }`}
                onClick={async () => {
                  if (!user?.stripeId) {
                    const response = await fetch('/api/checkout-session', {
                      method: 'POST'
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

                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      role: 'user',
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  const responseMessage = await submitUserMessage(
                    example.message
                  )

                  console.log(responseMessage)

                  setMessages(currentMessages => [
                    ...currentMessages,
                    responseMessage
                  ])

                  return
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
        </div>

        {messages?.length >= 2 ? (
          <div className="flex h-12 items-center justify-center">
            <div className="flex space-x-2">
              {id && title ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setShareDialogOpen(true)}
                  >
                    <IconShare className="mr-2" />
                    Share
                  </Button>
                  <ChatShareDialog
                    open={shareDialogOpen}
                    onOpenChange={setShareDialogOpen}
                    onCopy={() => setShareDialogOpen(false)}
                    shareChat={shareChat}
                    chat={{
                      id,
                      title,
                      messages: aiState.messages
                    }}
                  />
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            setUser={setUser}
            subscription={subscription}
            user={user}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
