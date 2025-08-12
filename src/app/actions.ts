
'use server'

import { z } from 'zod'
import { summarizeInquiry } from '@/ai/flows/summarize-inquiry-flow'
import { appendToGoogleDoc } from '@/services/google-docs-service'

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

  try {
    // 1. Generate AI summary
    const summary = await summarizeInquiry({
      businessDescription: validatedFields.data.business,
    })

    // 2. Append to Google Doc (or Sheet)
    await appendToGoogleDoc({
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      business: validatedFields.data.business,
      summary: summary,
    })
    
    return {
      status: 'success',
      message: "Got it! I'll be in touch soon.",
    }
  } catch (error) {
    console.error('Error in form submission:', error)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again.',
    }
  }
}
