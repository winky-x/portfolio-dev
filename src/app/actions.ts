
'use server'

import { prepareEmail, type PrepareEmailInput, type PrepareEmailOutput } from '@/ai/flows/prepare-email'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
})

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message: string
  data?: PrepareEmailOutput | null
  errors?: {
    name?: string[]
    email?: string[]
    message?: string[]
  }
}

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  })

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, message } = validatedFields.data
  
  const clientDetails = `Client Name: ${name}\nClient Email: ${email}\nMessage: ${message}`
  const developerEmail = 'your.email@example.com' // This should be the portfolio owner's email

  const aiInput: PrepareEmailInput = {
    clientDetails,
    userEmail: developerEmail,
  }

  try {
    const result = await prepareEmail(aiInput)
    return {
      status: 'success',
      message: 'Draft prepared successfully.',
      data: result,
    }
  } catch (error) {
    console.error('AI Error:', error)
    return {
      status: 'error',
      message: 'Failed to prepare email draft. Please try again.',
    }
  }
}
