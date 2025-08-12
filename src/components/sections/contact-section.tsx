
'use client'

import React, { useState, useEffect, useActionState, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { submitContactForm, type ContactFormState } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Send, CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const contactFormSchema = z.object({
  business: z.string().min(10, { message: 'Please describe your business a bit more.' }),
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
})

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send
    </Button>
  )
}

export function ContactSection() {
  const { toast } = useToast()
  const [isVisible, setIsVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const heroSectionRef = useRef<HTMLElement | null>(null);

  const initialState: ContactFormState = { status: 'idle', message: '' }
  const [state, formAction] = useActionState(submitContactForm, initialState)

  const { register, formState: { errors }, trigger, reset } = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    // A bit of a hack to find the hero section from another component
    // In a real app, this might be handled by a global state or context
    heroSectionRef.current = document.querySelector('section');

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero section is NOT intersecting (i.e., scrolled past)
        setIsVisible(!entry.isIntersecting)
      },
      { threshold: 0.1 } // 10% of the hero is visible
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSection_current);
      }
    };
  }, []);


  useEffect(() => {
    if (state.status === 'success') {
      setIsSuccess(true)
      reset()
      setTimeout(() => {
        setShowForm(false)
        setIsSuccess(false)
      }, 3000)
    } else if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, reset])
  
  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4 md:bottom-10 md:right-10 z-50 transition-all duration-500",
       isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    )}>
       <div className="bg-card border shadow-2xl rounded-lg w-[350px]">
          <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold font-headline">Interested in working together?</h3>
                  <p className="text-sm text-muted-foreground">My AI will get your message to me.</p>
                </div>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowForm(false)} disabled={!showForm}>
                    <X className="h-4 w-4" />
                </Button>
              </div>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                  <p className="font-semibold">Message Sent!</p>
                  <p className="text-sm text-muted-foreground">Thanks for reaching out. I'll get back to you soon.</p>
              </div>
            ) : showForm ? (
              <form action={formAction} className="space-y-3 mt-4">
                <div>
                  <Textarea
                    {...register('business')}
                    placeholder="Tell me a bit about your business or project..."
                    rows={3}
                    className={errors.business || state.errors?.business ? 'border-destructive' : ''}
                    onBlur={() => trigger('business')}
                  />
                   {errors.business && <p className="text-destructive text-sm mt-1">{errors.business.message}</p>}
                   {state.errors?.business && <p className="text-destructive text-sm mt-1">{state.errors.business[0]}</p>}
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Input {...register('name')} placeholder="Your Name" className={errors.name || state.errors?.name ? 'border-destructive' : ''} onBlur={() => trigger('name')} />
                         {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                         {state.errors?.name && <p className="text-destructive text-sm mt-1">{state.errors.name[0]}</p>}
                    </div>
                     <div>
                        <Input {...register('email')} type="email" placeholder="Your Email" className={errors.email || state.errors?.email ? 'border-destructive' : ''} onBlur={() => trigger('email')} />
                         {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                         {state.errors?.email && <p className="text-destructive text-sm mt-1">{state.errors.email[0]}</p>}
                     </div>
                </div>
                <SubmitButton />
              </form>
            ) : (
                <div className="mt-4">
                    <Button className="w-full" onClick={() => setShowForm(true)}>Let's Talk</Button>
                </div>
            )}
          </div>
       </div>
    </div>
  )
}
