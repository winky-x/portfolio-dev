
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

async function sendEmail({ name, email, business }: { name: string; email: string; business: string }) {
  // This is where you would integrate your email sending service (e.g., Resend, SendGrid).
  // The following is a simulation. You'll need an API key and the service's SDK.

  const developerEmail = 'your.email@example.com' // Your email address
  const subject = `New Portfolio Inquiry from ${name}`
  const body = `
    You've received a new message from your portfolio contact form:

    Name: ${name}
    Email: ${email}
    Business/Project Description:
    ${business}
  `

  console.log("--- SIMULATING EMAIL SEND ---")
  console.log(`To: ${developerEmail}`)
  console.log(`From: noreply@yourdomain.com`)
  console.log(`Subject: ${subject}`)
  console.log(`Body:\n${body}`)
  console.log("--- END SIMULATION ---")

  // Example with a real service like Resend (you would need to `npm install resend`):
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'onboarding@resend.dev', // A domain you have verified with Resend
    to: developerEmail,
    subject: subject,
    text: body,
  });
  */

  // For this simulation, we'll just resolve successfully.
  return Promise.resolve()
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
    await sendEmail(validatedFields.data)
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
