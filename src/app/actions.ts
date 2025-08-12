
'use server'

import { sendEmail, type SendEmailInput } from '@/ai/flows/send-email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  business: z.string().min(10, 'Please describe your business in at least 10 characters.'),
})

export type ContactFormState = {
  status: 'idle' | 'success' | 'error' | 'loading'
  message: string
  errors?: {
    name?: string[]
    email?: string[]
    business?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    business: formData.get('business'),
  })

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, business } = validatedFields.data
  
  const developerEmail = 'your.email@example.com' 

  const aiInput: SendEmailInput = {
    clientName: name,
    clientEmail: email,
    businessDescription: business,
    developerEmail: developerEmail
  }

  try {
    await sendEmail(aiInput)
    return {
      status: 'success',
      message: "Got it! I'll be in touch soon.",
    }
  } catch (error) {
    console.error('AI Error:', error)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    }
  }
}
