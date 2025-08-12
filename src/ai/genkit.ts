
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { next } from '@genkit-ai/next';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    next({
      // The Next.js plugin is required for Genkit to work with Next.js.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
