'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/server/prisma'
import { Prisma } from '@prisma/client'
import { Chat } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return chats
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      id
    }
  })

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await getChat(id, userId)
  //Convert uid to string for consistent comparison with session.user.id

  if (chat?.userId !== userId) {
    return {
      error: 'Unauthorized'
    }
  }

  await prisma.chat.delete({
    where: {
      id: chat.id
    }
  })

  revalidatePath('/chat')
  return revalidatePath(path)
}

export async function clearChats() {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  await prisma.chat.deleteMany({
    where: {
      userId
    }
  })

  revalidatePath('/')
  return redirect('/')
}

export async function getSharedChat(id: string) {
  const chat = await prisma.chat.findFirst({
    where: {
      id
    }
  })

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string) {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await prisma.chat.findFirst({
    where: {
      id
    }
  })

  if (!chat || chat.userId !== userId) {
    return {
      error: 'Something went wrong'
    }
  }

  const payload = {
    ...chat,
    sharePath: `/share/${chat.id}`
  }

  await prisma.chat.update({
    where: {
      id: chat.id
    },
    data: {
      sharePath: `/share/${chat.id}`
    }
  })

  return payload
}

export async function saveChat(chat: Chat) {
  const { userId } = auth()

  if (userId) {
    await prisma.chat.upsert({
      where: {
        id: chat.id
      },
      update: {
        messages: chat.messages as unknown as Prisma.JsonArray
      },
      create: {
        id: chat.id,
        title: chat.title,
        messages: chat.messages as unknown as Prisma.JsonArray,
        path: chat.path,
        userId: userId
      }
    })
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}

export async function getMissingKeys() {
  const keysRequired = ['ANTHROPIC_API_KEY']
  return keysRequired
    .map(key => (process.env[key] ? '' : key))
    .filter(key => key !== '')
}
