import 'server-only'

import {
  createAI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'
import { BotMessage } from '@/components/stocks'
import { nanoid } from '@/lib/utils'
import { getUser, saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import os from 'os'

async function generateDogNames(formData: FormData) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file uploaded')
  }

  // Create a temporary file
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Save to temp file
  const tempDir = os.tmpdir()
  const tempFilePath = path.join(
    tempDir,
    `upload-${nanoid()}.${file.name.split('.').pop()}`
  )
  await writeFile(tempFilePath, buffer)

  // Read the file and convert to base64
  const fileBuffer = await readFile(tempFilePath)
  const base64Data = fileBuffer.toString('base64')

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content: [
          {
            type: 'image',
            image: base64Data
          }
        ]
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: anthropic('claude-3-sonnet-20240229'),
    initial: <SpinnerMessage />,
    system:
      'Come up with a list of dog names for the dog featured in the photo.  Offer some names for both males and females so the owner can decide.',
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    }
  })

  console.log('RESULT: ', result)

  return {
    id: nanoid(),
    display: result.value
  }
}

async function submitUserMessage(content: string) {
  'use server'

  const { userId } = auth()

  if (!userId) {
    return {
      error: 'User is not authenticated.'
    }
  }

  const user = await getUser(userId)

  if (!user) {
    return {
      error: 'User not found.'
    }
  }

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: anthropic('claude-2.0'),
    initial: <SpinnerMessage />,
    system:
      'You are a world-class dog training conversation bot named Zoe and you can help users train their dogs and solve undesired behaviors, step by step.  Your responses should be overly positive and encouraging.',
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream.update(delta)
      }

      return textNode
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: any
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    generateDogNames,
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const { userId } = auth()

    if (userId) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state }) => {
    'use server'

    const { userId } = auth()

    if (userId) {
      const { chatId, messages } = state

      const path = `/chat/${chatId}`
      const title = messages[0].content.substring(0, 100)

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        messages,
        path
      }

      await saveChat(chat)
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      role: message.role,
      display:
        message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
