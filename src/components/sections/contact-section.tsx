
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
import { motion, AnimatePresence } from 'framer-motion'

const businessSchema = z.object({
  business: z.string().min(10, { message: ' ' }),
})

const finalDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
})

const placeholders = [
    "Need a new website from scratch?",
    "Looking to revamp an existing site?",
    "Building a fast e-commerce store?",
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
    "Need a hand with a front-end feature?",
    "Let's bring your creative vision to life."
];


function AnimatedPlaceholder() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 3000); // Change placeholder every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.span
                key={placeholders[index]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-y-0 left-3 flex items-center pointer-events-none"
            >
                {placeholders[index]}
            </motion.span>
        </AnimatePresence>
    );
}


function SubmitButton({ hasValue }: { hasValue: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      size="icon" 
      className={cn(
        "absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full transition-colors",
        hasValue 
          ? 'bg-black/80 hover:bg-black text-white' 
          : 'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-foreground'
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      <span className="sr-only">Send</span>
    </Button>
  )
}

export function ContactSection() {
  const { toast } = useToast()
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [businessDescription, setBusinessDescription] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const initialState: ContactFormState = { status: 'idle', message: '' }
  const [state, formAction] = useActionState(submitContactForm, initialState)

  const { register, handleSubmit, reset, watch, formState: {errors} } = useForm<{ business: string }>({
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
    } else if (state.status === 'error' && state.message && state.message !== 'Invalid form data.') {
       toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      })
    }
  }, [state, toast, reset, resetDetails])

  const handleInitialSubmit = (data: { business: string }) => {
    if(errors.business) {
      toast({
        variant: 'destructive',
        description: "Please describe your project a bit more.",
      })
      return;
    }
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
      <form onSubmit={handleSubmit(handleInitialSubmit)}>
        <div className={cn(
            'relative rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md transition-all duration-300 ring-1 ring-black/10',
            isFocused || businessValue
                ? 'shadow-lg shadow-primary/20 dark:shadow-primary/10 ring-primary/20'
                : 'shadow-md shadow-black/5'
        )}>
            <label htmlFor="business" className="sr-only">Describe your project</label>
            <Input
                {...register('business')}
                id="business"
                placeholder={businessValue ? '' : undefined}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="bg-transparent border-none pr-12 text-base resize-none focus-visible:ring-0 text-foreground h-12 rounded-full placeholder:text-muted-foreground"
            />
            {!businessValue && (
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none text-muted-foreground">
                    <AnimatedPlaceholder />
                </div>
            )}
            <SubmitButton hasValue={!!businessValue} />
        </div>
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
