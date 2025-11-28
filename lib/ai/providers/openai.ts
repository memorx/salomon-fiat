// lib/ai/providers/openai.ts

import OpenAI from 'openai';

let clientInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!clientInstance) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'OPENAI_API_KEY no está configurada en las variables de entorno'
      );
    }

    clientInstance = new OpenAI({
      apiKey
    });
  }

  return clientInstance;
}

// Función helper para llamadas simples
export async function askGPT4(
  prompt: string,
  maxTokens: number = 4096
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

// Función para analizar imágenes con GPT-4 Vision
export async function analyzeImageWithGPT4(
  imageUrl: string,
  prompt: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}

// Función para analizar imágenes en base64 con GPT-4 Vision
export async function analyzeImageBase64WithGPT4(
  imageBase64: string,
  mediaType: string,
  prompt: string
): Promise<string> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${mediaType};base64,${imageBase64}`
            }
          },
          {
            type: 'text',
            text: prompt
          }
        ]
      }
    ]
  });

  return response.choices[0]?.message?.content || '';
}
