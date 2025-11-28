// lib/ai/providers/claude.ts

import Anthropic from '@anthropic-ai/sdk';

let clientInstance: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (!clientInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      throw new Error(
        'ANTHROPIC_API_KEY no está configurada en las variables de entorno'
      );
    }

    clientInstance = new Anthropic({
      apiKey
    });
  }

  return clientInstance;
}

// Función helper para llamadas simples
export async function askClaude(
  prompt: string,
  maxTokens: number = 4096
): Promise<string> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}

// Función para analizar imágenes con Claude
export async function analyzeImageWithClaude(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
  prompt: string
): Promise<string> {
  const client = getClaudeClient();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64
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

  const textContent = response.content.find((c) => c.type === 'text');
  return textContent?.text || '';
}
