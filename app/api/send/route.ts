import { SignUpEmailTemplate } from '@/components/email/signup-email';
import resend from '@/server/resend';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const emailSchema = z.object({
  to: z.string(),
  subject: z.string(),
  emailTemplate: z.any()
})

export async function POST(req: NextRequest) {
  const json = await req.json()
  const body = emailSchema.parse(json);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: body.to,
      subject: body.subject,
      react: SignUpEmailTemplate({ firstName: 'Trevor' }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}