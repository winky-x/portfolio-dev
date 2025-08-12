
'use client'

import React, { useActionState, useRef, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitContactForm, type ContactFormState } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Mail, ArrowUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'

const businessSchema = z.object({
  business: z.string().min(1, { message: ' ' }),
})

const finalDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
})

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending || disabled} 
      size="icon" 
      className={cn(
        "absolute right-1.5 bottom-1.5 h-8 w-8 rounded-full transition-colors",
        disabled 
          ? 'bg-transparent text-muted-foreground' 
          : 'bg-black hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80'
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  )
}

export function ContactSection() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [businessDescription, setBusinessDescription] = useState('')
  const [isFocused, setIsFocused] = useState(false)


  const initialState: ContactFormState = { status: 'idle', message: '' }
  const [state, formAction] = useActionState(submitContactForm, initialState)

  const { register, handleSubmit, formState: { errors, isValid }, trigger, reset, watch } = useForm<{ business: string }>({
    resolver: zodResolver(businessSchema),
    mode: 'onChange',
  })
  const businessValue = watch('business')

  const { register: registerDetails, handleSubmit: handleSubmitDetails, formState: { errors: detailsErrors }, trigger: triggerDetails, reset: resetDetails } = useForm<z.infer<typeof finalDetailsSchema>>({
    resolver: zodResolver(finalDetailsSchema),
    mode: 'onChange',
  })

  useEffect(() => {
    if (state.status === 'success') {
      setIsSuccess(true)
      setShowDetailsModal(false)
      reset()
      resetDetails()
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. My AI has your message and I'll be in touch soon.",
      })
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } else if (state.status === 'error' && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, reset, resetDetails])

  const handleInitialSubmit = (data: { business: string }) => {
    setBusinessDescription(data.business)
    setShowDetailsModal(true)
  }
  
  const handleFinalSubmit = (data: z.infer<typeof finalDetailsSchema>) => {
    const formData = new FormData();
    formData.append('business', businessDescription);
    formData.append('name', data.name);
    formData.append('email', data.email);
    formAction(formData);
  }

  return (
    <section id="contact" className="w-full">
        <div className={cn(
            'relative rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-md transition-all duration-300 ring-1 ring-black/10',
            isFocused || businessValue
              ? 'shadow-2xl shadow-primary/20 ring-primary/50'
              : 'shadow-md shadow-black/10 '
        )}>
            <form ref={formRef} onSubmit={handleSubmit(handleInitialSubmit)}>
              <label htmlFor="business" className="sr-only">Describe your project</label>
              <Textarea
                {...register('business')}
                id="business"
                placeholder="Have a project in mind? Describe it here and my AI assistant will get things started..."
                rows={1}
                className="bg-transparent border-none pr-12 text-base resize-none focus-visible:ring-0 text-foreground py-2 h-10 rounded-3xl"
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  trigger('business');
                }}
              />
              <SubmitButton disabled={!isValid}/>
            </form>
          </div>
          {errors.business && <p className="text-destructive text-sm mt-2 px-3">{errors.business.message}</p>}

        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Mail/> Almost there!</DialogTitle>
              <DialogDescription>
                Just need a couple more details to send your message.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitDetails(handleFinalSubmit)} className="space-y-4">
               <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    {...registerDetails('name')}
                    id="name" 
                    placeholder="Ada Lovelace" 
                    onBlur={() => triggerDetails('name')}
                    className="mt-1" 
                  />
                  {detailsErrors.name && <p className="text-destructive text-sm mt-1">{detailsErrors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    {...registerDetails('email')}
                    id="email" 
                    type="email" 
                    placeholder="ada@example.com"
                    onBlur={() => triggerDetails('email')}
                    className="mt-1"
                  />
                   {detailsErrors.email && <p className="text-destructive text-sm mt-1">{detailsErrors.email.message}</p>}
                </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit">Send Message</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </section>
  )
}
