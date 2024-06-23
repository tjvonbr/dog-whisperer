'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { IconSpinner } from './ui/icons'
import { formSchema } from '@/lib/validations/auth'
import { useRouter } from 'next/navigation'

export default function UserForm() {
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email
      })
    })

    setIsLoading(false)

    if (!response.ok) {
      return toast.error(
        'An error occured creating an account for you at this time.  Please try again soon.'
      )
    }

    toast('Success!', {
      description: 'Welcome to Dog Whisperer AI!'
    })

    router.replace('/sign-in')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button variant="default" type="submit" className="w-full">
          {isLoading ? <IconSpinner color="white" /> : 'Sign up'}
        </Button>
      </form>
    </Form>
  )
}
