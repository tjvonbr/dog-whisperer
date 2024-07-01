'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'
import { useActions, useUIState } from 'ai/rsc'
import { UserMessage } from './stocks/message'
import { type AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconAttachment } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'

export function FreePromptForm({
  file,
  input,
  setInput,
  setFile
}: {
  file: File | null
  input: string
  setInput: (value: string) => void
  setFile: (file: File) => void
}) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const { generateDogNames } = useActions()
  const [messages, setMessages] = useUIState<typeof AI>()
  const [data, setData] = useState<{
    image: string | null
  }>({
    image: null
  })

  const hiddenFileInput = React.useRef<HTMLInputElement | null>(null)

  function handleClick(e: React.MouseEvent<HTMLInputElement>) {
    e.preventDefault()
    hiddenFileInput.current && hiddenFileInput.current.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files && e.currentTarget.files[0]
    setFile(file as File)

    const reader = new FileReader()
    reader.onload = e => {
      setData(prev => ({ ...prev, image: e.target?.result as string }))
    }
    reader.readAsDataURL(file as File)
    toast.success('Successfully selected an image.  Go ahead and submit!')
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            role: 'user',
            display: (
              <UserMessage>
                <Image
                  src={data.image as string}
                  alt="Loading"
                  width={300}
                  height={400}
                  className="rounded-md"
                />
              </UserMessage>
            )
          }
        ])

        const formData = new FormData()
        formData.append('file', data.image as string)

        const responseMessage = await generateDogNames(formData)
        setMessages(currentMessages => [...currentMessages, responseMessage])
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background pr-8 sm:rounded-md sm:border sm:pr-24">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Select an image from your computer and press the submit button!"
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled
        />
        <div className="absolute flex space-x-2 right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <>
                <Button variant="outline" size="icon" onClick={handleClick}>
                  <IconAttachment />
                  <span className="sr-only">Upload photo</span>
                </Button>
                <input
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  type="file"
                  style={{ display: 'none' }}
                />
              </>
            </TooltipTrigger>
            <TooltipContent>Upload photo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={!file || messages.length > 0}
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
