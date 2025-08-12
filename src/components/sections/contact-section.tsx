
'use client'

import React, { useState, useEffect, useTransition } from 'react'
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
import { AnimatedPlaceholder } from '../animated-placeholder'

const businessSchema = z.object({
  business: z.string().min(10, { message: 'Please describe your project in at least 10 characters.' }),
})

const finalDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
})

export function ContactSection() {
  const { toast } = useToast()
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [businessDescription, setBusinessDescription] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const [isPending, startTransition] = useTransition();

  const [state, setState] = useState<ContactFormState>({ status: 'idle', message: '' });

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
        description: errors.business.message,
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
    
    startTransition(async () => {
        const result = await submitContactForm(state, formData);
        setState(result);
    });
  }

  return (
    <section id="contact" className="w-full">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-2">
            Describe your project
        </h3>
      <form onSubmit={handleSubmit(handleInitialSubmit)}>
        <div className={cn(
            'relative rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md transition-all duration-300 ring-1 ring-black/10 flex items-center',
            isFocused || businessValue
                ? 'shadow-lg shadow-primary/20 dark:shadow-primary/10 ring-primary/20'
                : 'shadow-md shadow-black/5'
        )}>
            <Label htmlFor="business" className="sr-only">Describe your project</Label>
            {!businessValue && (
               <AnimatedPlaceholder 
                placeholders={[
                    "A luxury tech store...",
                    "A brand new SaaS for designers...",
                    "An e-commerce site for artists...",
                    "A portfolio for a photographer..."
                ]} 
                className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            )}
            <Input
                {...register('business')}
                id="business"
                placeholder=""
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                autoComplete="off"
                className="bg-transparent border-none pr-12 text-base resize-none focus-visible:ring-0 h-12 rounded-full placeholder:text-muted-foreground"
            />
            <Button 
                type="submit" 
                size="icon" 
                className={cn(
                    "absolute right-2.5 bottom-2.5 h-8 w-8 rounded-full transition-colors",
                    businessValue 
                    ? 'bg-black/80 hover:bg-black text-white' 
                    : 'bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-foreground'
                )}
                >
                <ArrowUp className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
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
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin" /> : "Send Message"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
