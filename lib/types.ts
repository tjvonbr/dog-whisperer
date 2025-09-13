import { Chat, Message } from '@prisma/client'

export interface ChatWithMessages extends Chat {
  messages: Message[]
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface UserDto {
  firstName: string
  lastName: string
  email: string
}

export interface Subscription extends Record<string, any> {
  id: string
  userId: string
  stripeId: string
  status: string
}
