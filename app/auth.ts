import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import EmailProvider from 'next-auth/providers/email';
import prisma from "../server/prisma"
import Resend from "next-auth/providers/resend"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user}) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session({ session, user }) {
      session.user.id = user.id

      return session
    }
  },
  providers: [
    EmailProvider({
      server: {
        host: "smtp.resend.com",
        port: 2587,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY
        }
      },
      from: "tjvonbr@gmail.com"
    }),
    Resend
  ]
})