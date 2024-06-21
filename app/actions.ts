'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { User, type Chat } from '@/lib/types'
import supabase from '@/server/supabase'

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const { data: chats } = await supabase
      .from('chats')
      .select()
      .eq('userId', userId)

    return chats as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, userId: string) {
  const { data: chat } = await supabase
    .from('chats')
    .select()
    .eq('id', id)
    .limit(1)
    .single()

  if (!chat || (userId && chat.userId !== userId)) {
    return null
  }

  return chat as Chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'Unauthorized'
    }
  }

  await supabase.from('chat').delete().eq('id', id)

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

  const chats = await getChats(userId)

  if (!chats.length) {
    return redirect('/chat')
  }

  const chatIds = chats.map(chat => chat.id)

  await supabase.from('chats').delete().in('id', chatIds)

  revalidatePath('/chat')
  return redirect('/chat')
}

export async function getSharedChat(id: string) {
  const { data: chat } = await supabase
    .from('chats')
    .select()
    .eq('id', id)
    .limit(1)
    .single()

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

  await supabase.from('chats').update({
    sharePath: payload.sharePath
  })

  return payload
}

export async function saveChat(chat: Chat) {
  const { userId } = auth()

  if (!userId) {
    return {
      error: 'You are not authorized to perform this action.'
    }
  }

  const result = await supabase
    .from('chats')
    .upsert({
      id: chat.id,
      title: chat.title,
      path: chat.path,
      messages: chat.messages,
      userId,
      updatedAt: new Date()
    })
    .select('id')

  return result
}

export async function saveUser(user: User) {
  await supabase.from('users').insert({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    stripeId: user.stripeId
  })
}

export async function getUser(id: string) {
  const { data: user } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .limit(1)
    .single()

  if (!user) {
    return null
  }

  console.log("user: ", user)

  return user
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
