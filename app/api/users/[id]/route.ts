import { getUser, updateUser } from '@/app/actions';
import { User } from '@/lib/types';
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string(),
  stripeId: z.string().optional(),
  credits: z.number().optional(),
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  subscriptionId: z.string().nullable()
})

type UpdateUserInput = z.infer<typeof updateUserSchema>;

export async function PUT(req: NextRequest) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json("User is not authenticated.", { status: 401})
  }

  const json = await req.json()
  const body = updateUserSchema.parse(json)

  if (userId !== body.id) {
    return NextResponse.json("User is not authorized to perform this action.", { status: 403})
  }

  try {
    const currentUser = await getUser(body.id)

    if (!currentUser) {
      return NextResponse.json("User not found.", { status: 404 })
    }

    const updatedFields: Partial<User> = {};

    (Object.keys(body) as Array<keyof UpdateUserInput>).forEach(key => {
      if (key !== 'id' && body[key] !== undefined) {
        (updatedFields as any)[key] = body[key];
      }
    });

    const updatedUser: User = {
      ...currentUser,
      ...updatedFields
    }

    const user = await updateUser(updatedUser)
    return NextResponse.json(user, { status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500})
  }
}