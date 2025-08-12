'use client'

import React, { useState, useEffect, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { submitContactForm, type ContactFormState } from '@/app/actions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Send, CheckCircle } from 'lucide-react'

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
})

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Generate Email Draft
    </Button>
  )
}

export function ContactSection() {
  const { toast } = useToast()
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const initialState: ContactFormState = { status: 'idle', message: '' }
  const [state, formAction] = useActionState(submitContactForm, initialState)

  const { register, formState: { errors }, trigger, reset } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (state.status === 'success' && state.data?.emailDraft) {
      setIsAlertOpen(true)
      reset()
    } else if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, reset])

  const handleSendEmail = () => {
    setIsAlertOpen(false)
    toast({
      title: 'Email Sent!',
      description: "Thank you for your message. I'll get back to you soon.",
      action: <CheckCircle className="text-green-500" />,
    })
  }

  return (
    <section id="contact" className="py-20 lg:py-32">
      <div className="container">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">Get In Touch</CardTitle>
            <CardDescription className="text-lg">
              Have a project in mind? Let's talk. My AI assistant will draft an email for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div>
                <Input
                  {...register('name')}
                  placeholder="Your Name"
                  className={errors.name ? 'border-destructive' : ''}
                  onBlur={() => trigger('name')}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                {state.errors?.name && <p className="text-destructive text-sm mt-1">{state.errors.name[0]}</p>}
              </div>
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="Your Email"
                  className={errors.email ? 'border-destructive' : ''}
                  onBlur={() => trigger('email')}
                />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                {state.errors?.email && <p className="text-destructive text-sm mt-1">{state.errors.email[0]}</p>}
              </div>
              <div>
                <Textarea
                  {...register('message')}
                  placeholder="Tell me about your project..."
                  rows={6}
                  className={errors.message ? 'border-destructive' : ''}
                  onBlur={() => trigger('message')}
                />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                {state.errors?.message && <p className="text-destructive text-sm mt-1">{state.errors.message[0]}</p>}
              </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Review Your Email</AlertDialogTitle>
            <AlertDialogDescription>
              My AI has prepared the following draft. Does this look correct?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 p-4 bg-muted rounded-md text-sm whitespace-pre-wrap font-code">
            {state.data?.emailDraft}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Make Changes</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendEmail}>Looks Good, Send It!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
