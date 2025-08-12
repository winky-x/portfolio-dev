'use server';

/**
 * @fileOverview AI agent that generates and sends an email to the portfolio owner.
 *
 * - sendEmail - A function that prepares and sends the email.
 * - SendEmailInput - The input type for the sendEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SendEmailInputSchema = z.object({
  clientName: z.string().describe("The name of the potential client."),
  clientEmail: z.string().email().describe("The email of the potential client."),
  businessDescription: z.string().describe("A description of the client's business or project."),
  developerEmail: z.string().email().describe("The portfolio owner's email address to send the notification to."),
});
export type SendEmailInput = z.infer<typeof SendEmailInputSchema>;

const EmailContentSchema = z.object({
    subject: z.string().describe("A concise and relevant subject for the email."),
    body: z.string().describe("The full body content of the email, formatted professionally."),
});

// This is a placeholder for a real email sending service.
// In a real application, you would use a service like Nodemailer, SendGrid, etc.
const sendEmailTool = ai.defineTool(
    {
      name: 'sendEmail',
      description: 'Sends an email to the portfolio owner with the client\'s inquiry.',
      inputSchema: z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
      }),
      outputSchema: z.object({
        success: z.boolean(),
      }),
    },
    async (input) => {
      console.log('------- SENDING EMAIL (SIMULATION) -------');
      console.log(`To: ${input.to}`);
      console.log(`Subject: ${input.subject}`);
      console.log(`Body:\n${input.body}`);
      console.log('------------------------------------------');
      // In a real app, this would return true on success from the email service
      return { success: true };
    }
);


const emailPrompt = ai.definePrompt({
    name: 'generateInquiryEmail',
    input: { schema: SendEmailInputSchema },
    output: { schema: EmailContentSchema },
    tools: [sendEmailTool],
    prompt: `You are an expert assistant for a web developer.
A potential client has submitted an inquiry through a portfolio website.
Your task is to do two things:
1.  Generate a professional email summarizing the client's request.
2.  Use the sendEmail tool to send this summary to the developer.

Client Name: {{{clientName}}}
Client Email: {{{clientEmail}}}
Business/Project Description: {{{businessDescription}}}

The email should be sent to the developer at: {{{developerEmail}}}

First, create a subject and body for the email. The tone should be professional and informative.
Then, immediately call the sendEmail tool with the generated subject, body, and the developer's email address.
`,
});


export async function sendEmail(input: SendEmailInput): Promise<void> {
    await emailPrompt(input);
}
