
import { genkit, Middleware } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const logger: Middleware = async (action: any, next: any) => {
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
  ],
});
