import { Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt?: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
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
