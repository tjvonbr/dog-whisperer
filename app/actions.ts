'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/server/prisma'
import { Chat, User } from '@prisma/client'
import { UserDto } from '@/lib/types'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId
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

export async function removeChat({ id, path, userId }: { id: string; path: string, userId: string}) {
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

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  await prisma.chat.delete({
    where: {
      id
    }
  })

  revalidatePath('/chat')
  return revalidatePath(path)
}

export async function clearChats(userId: string) {
  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats = await getChats(userId)

  if (!chats.length) {
    return redirect('/chat')
  }

  const chatIds = chats.map(chat => chat.id)

  await prisma.chat.deleteMany({
    where: {
      id: {
        in: chatIds
      }
    }
  })

  revalidatePath('/chat')
  return redirect('/chat')
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

export async function shareChat(id: string, userId: string) {
  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await getChat(id, userId)

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
      sharePath: payload.sharePath
    }
  })

  return payload
}

// export async function saveChat(chat: Chat) {
//   const { userId } = auth()

//   if (!userId) {
//     return {
//       error: 'You are not authorized to perform this action.'
//     }
//   }

//   const result = await supabase
//     .from('chats')
//     .upsert({
//       id: chat.id,
//       title: chat.title,
//       path: chat.path,
//       messages: chat.messages,
//       userId,
//       updatedAt: new Date()
//     })
//     .select('id')

//   return result
// }

export async function createUser(user: UserDto) {
  const newUser = await prisma.user.create({
    data: {
      firstName: user.firstName,
      lastName: user.email,
      email: user.email
    }
  })

  return newUser
}

export async function getUser(id: string) {
  const user = await prisma.user.findFirst({
    where: {
      id
    }
  })

  return user
}

export async function updateUser(user: User) {
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      ...user
    }
  })

  return updatedUser
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
