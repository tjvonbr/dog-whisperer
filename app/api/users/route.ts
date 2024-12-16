import { NextRequest, NextResponse } from "next/server";
import { formSchema } from "@/lib/validations/auth";
import { createUser } from "@/app/actions";
import { UserDto } from '@/lib/types'

export async function POST(req: NextRequest) {
  const json = await req.json();
  const body = formSchema.parse(json);

  try {
    // const stripeCustomer = await stripe.customers.create({
    //   name: body.firstName + " " + body.lastName,
    //   email: body.email,
    // })

    const user: UserDto = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    }

    const newUser = await createUser(user)

    if (!newUser) {
      return NextResponse.json("An error occured creating a user.", {
        status: 400,
      });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(null, { status: 500 });
  }
}
