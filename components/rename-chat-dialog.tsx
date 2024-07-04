'use client'

import * as React from 'react'
import { type DialogProps } from '@radix-ui/react-dialog'
import { toast } from 'sonner'

import { type Chat } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { IconSpinner } from '@/components/ui/icons'
import { Input } from './ui/input'
import { saveChat } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface RenameChatDialogProps extends DialogProps {
  chat: Chat
  open: boolean
  setRenameDialogOpen: (open: boolean) => void
}

export function RenameChatDialog({
  chat,
  setRenameDialogOpen,
  ...props
}: RenameChatDialogProps) {
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSharePending, startShareTransition] = React.useTransition()

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setIsLoading(true)

    // @ts-ignore
    startShareTransition(async () => {
      const result = await saveChat({
        ...chat,
        title: input
      })

      setIsLoading(false)

      if (result && result.error !== null) {
        toast.error('Something went wrong')
        return
      }
    })

    setRenameDialogOpen(false)
    router.refresh()
    router.push('/chat')
    toast.success('Chat title updated')
  }

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            {`Instead of '${chat.title}', your chat will be named ${input ? `'${input}'` : '<new title>'}`}
          </DialogDescription>
        </DialogHeader>
        <form>
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="New title"
          />
        </form>
        <DialogFooter className="items-center">
          <Button disabled={isSharePending} onClick={handleSubmit}>
            {isLoading ? (
              <>
                <IconSpinner className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>I&apos;m done</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
