import { OpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { experimental_streamText } from 'ai';
import { BasePrompt } from '@/lib/prompts/base-prompt';

export const dynamic = 'force-dynamic';

const groq = createOpenAI({
  apiKey: process.env.GROQ_API_KEY ?? '',
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  
  const prompt = BasePrompt(messages[messages.length - 1].content);

  // Call the language model
  const result = await streamText({
    model: groq.chat('llama3-70b-8192'),
    prompt
  });

  // Respond with the stream
  return result.toAIStreamResponse();
}
