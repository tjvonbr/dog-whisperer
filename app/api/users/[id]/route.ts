import { getUser, updateUser } from '@/app/actions';
import { User } from '@/lib/types';
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateUserSchema = z.object({
  userId: z.string()
})

export async function PUT(req: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json("User is not authenticated.", { status: 401})
  }

  const json = await req.json()
  const body = updateUserSchema.parse(json)

  if (userId !== body.userId  ) {
    return NextResponse.json("User is not authorized to perform this action.", { status: 403})
  }

  const user = await getUser(userId)

  if (!user) {
    return NextResponse.json("User could not be found.", { status: 404})
  }


  const updatedUser: User = {
    ...user,
    credits: user.credits - 1
  }

  try {
    const user = await updateUser(updatedUser)
    return NextResponse.json(user, { status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500})
  }
}