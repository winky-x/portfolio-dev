'use server';

/**
 * @fileOverview AI agent that prepares an email draft based on client's needs.
 *
 * - prepareEmail - A function that prepares the email draft.
 * - PrepareEmailInput - The input type for the prepareEmail function.
 * - PrepareEmailOutput - The return type for the prepareEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrepareEmailInputSchema = z.object({
  clientDetails: z
    .string()
    .describe('Details about the client and their specific request.'),
  userEmail: z.string().email().describe('The user email to send the email from'),
});
export type PrepareEmailInput = z.infer<typeof PrepareEmailInputSchema>;

const PrepareEmailOutputSchema = z.object({
  emailDraft: z.string().describe('The prepared email draft for user review.'),
});
export type PrepareEmailOutput = z.infer<typeof PrepareEmailOutputSchema>;

export async function prepareEmail(input: PrepareEmailInput): Promise<PrepareEmailOutput> {
  return prepareEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prepareEmailPrompt',
  input: {schema: PrepareEmailInputSchema},
  output: {schema: PrepareEmailOutputSchema},
  prompt: `You are an AI email agent specializing in drafting emails to potential clients based on their requests.

You will receive the client's details and their request. Based on this information, you will prepare an email draft for the user to review.

Client Details and Request: {{{clientDetails}}}

User Email: {{{userEmail}}}

Draft the email.`,
});

const prepareEmailFlow = ai.defineFlow(
  {
    name: 'prepareEmailFlow',
    inputSchema: PrepareEmailInputSchema,
    outputSchema: PrepareEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
