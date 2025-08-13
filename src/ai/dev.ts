import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { nextjs } from '@genkit-ai/next';

export default genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    nextjs({
      // Next.js plugin required for Genkit to work with Next.js
    }),
  ],
  enableTracingAndMetrics: true,
});
