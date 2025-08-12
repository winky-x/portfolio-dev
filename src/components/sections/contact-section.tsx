
'use client'

import React, { useActionState, useRef, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitContactForm, type ContactFormState } from '@/app/actions'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

const placeholders = [
    "Need a new website from scratch?",
    "Looking to revamp your existing site?",
    "Want to build a fast e-commerce store?",
    "Have an idea for a web application?",
    "Need a custom dashboard for your data?",
    "Let's create a stunning portfolio site.",
    "Want to improve your site's performance?",
    "Building a community with a forum?",
    "Thinking about a membership platform?",
    "Need a blog that stands out?",
    "Let's build an interactive learning tool.",
    "Got a cool API you want to visualize?",
    "Launching a new product or service?",
    "Need a hand with a tricky front-end feature?",
    "Let's bring your creative vision to life."
];

function AnimatedPlaceholder() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(placeholders[0]);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (isTyping) {
        if (text.length < placeholders[index].length) {
          setText(placeholders[index].slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsTyping(false), 2000); // Wait before deleting
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, text.length - 1));
        } else {
          setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
          setIsTyping(true);
        }
      }
    }, isTyping ? 50 : 30);

    return () => clearTimeout(typingTimeout);
  }, [text, isTyping, index]);
  
  return <>{text}<span className="animate-ping">|</span></>;
}


function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      size="icon" 
      className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/80 dark:bg-white/10 dark:hover:bg-white/20 text-white"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  )
}

export function ContactSection() {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [businessDescription, setBusinessDescription] = useState('')

  const initialState: ContactFormState = { status: 'idle', message: '' }
  const [state, formAction] = useActionState(submitContactForm, initialState)

  const { register, handleSubmit, reset, watch } = useForm<{ business: string }>({
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
      setShowDetailsModal(false)
      reset()
      resetDetails()
      toast({
        title: 'Message Sent!',
        description: "Thanks for reaching out. My AI has your message and I'll be in touch soon.",
      })
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
        <form 
            ref={formRef} 
            onSubmit={handleSubmit(handleInitialSubmit)} 
            className="relative flex items-center w-full h-12 border-b border-white/20"
        >
            <label htmlFor="business" className="sr-only">Describe your project</label>
            <Input
                {...register('business')}
                id="business"
                placeholder={businessValue ? '' : undefined}
                className="flex-1 h-full pl-0 bg-transparent border-none text-base focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
            />
             {!businessValue && (
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-muted-foreground">
                  <AnimatedPlaceholder />
              </div>
             )}
            <SubmitButton />
        </form>

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
