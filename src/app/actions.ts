
'use server'

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

  // AI functionality is temporarily disabled due to dependency issues.
  // We will simulate a successful submission.
  try {
    console.log('Simulating email send:');
    console.log({
      clientName: name,
      clientEmail: email,
      businessDescription: business,
      developerEmail: developerEmail
    });
    // In a real app, this would be where the email sending logic goes.
    // await sendEmail(aiInput) 
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
