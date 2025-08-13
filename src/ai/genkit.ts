
import { genkit, AIMiddleware } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { nextjs } from '@genkit-ai/next';

const logger: AIMiddleware = async (action, next) => {
  console.log('Action:', action.name, 'Input:', action.input);
  const result = await next(action);
  console.log('Action:', action.name, 'Output:', result.output);
  return result;
};

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    nextjs({
      // The Next.js plugin is required for Genkit to work with Next.js.
    }),
  ],
  enableTracingAndMetrics: true,
  middlewares: [logger],
});
