import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { formSchema } from "@/lib/validations/auth";
import stripe from "@/server/stripe";
import { saveUser } from "@/app/actions";
import { User } from "@/lib/types";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const body = formSchema.parse(json);

  try {
    const clerkUser = await clerkClient.users.createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      emailAddress: [body.email],
    });

    if (!clerkUser) {
      return NextResponse.json("An error occured creating a Clerk user.", {
        status: 400,
      });
    }

    const stripeCustomer = await stripe.customers.create({
      name: body.firstName + " " + body.lastName,
      email: body.email,
    })

    const user: User = {
      id: clerkUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      stripeId: stripeCustomer.id,
      credits: 5
    }

    const newUser = await saveUser(user)

    if (!newUser) {
      return NextResponse.json("An error occured creating a user.", {
        status: 400,
      });
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}
