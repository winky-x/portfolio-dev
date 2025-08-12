
'use server';
/**
 * @fileOverview An AI flow to summarize a potential client's business inquiry.
 *
 * - summarizeInquiry - A function that generates a concise summary of a business description.
 * - SummarizeInquiryInput - The input type for the summarizeInquiry function.
 * - SummarizeInquiryOutput - The return type for the summarizeInquiry function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SummarizeInquiryInputSchema = z.object({
  businessDescription: z
    .string()
    .describe('The detailed description of the business or project provided by a potential client.'),
});
export type SummarizeInquiryInput = z.infer<typeof SummarizeInquiryInputSchema>;

const SummarizeInquiryOutputSchema = z.string().describe("A concise, one-sentence summary of the business inquiry, highlighting the core need.");
export type SummarizeInquiryOutput = z.infer<typeof SummarizeInquiryOutputSchema>;

export async function summarizeInquiry(input: SummarizeInquiryInput): Promise<SummarizeInquiryOutput> {
  return summarizeInquiryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeInquiryPrompt',
  input: { schema: SummarizeInquiryInputSchema },
  output: { schema: SummarizeInquiryOutputSchema },
  prompt: `You are a helpful assistant for a freelance web developer. Your task is to summarize a new client inquiry into a single, concise sentence. Focus on the main goal or service the client is looking for.

Client's Description:
{{{businessDescription}}}

Generate a one-sentence summary:`,
});

const summarizeInquiryFlow = ai.defineFlow(
  {
    name: 'summarizeInquiryFlow',
    inputSchema: SummarizeInquiryInputSchema,
    outputSchema: SummarizeInquiryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
