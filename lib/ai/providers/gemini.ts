// lib/ai/providers/gemini.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

let clientInstance: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!clientInstance) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      throw new Error(
        'GOOGLE_AI_API_KEY no está configurada en las variables de entorno'
      );
    }

    clientInstance = new GoogleGenerativeAI(apiKey);
  }

  return clientInstance;
}

// Función helper para llamadas simples
export async function askGemini(prompt: string): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
}

// Función para analizar imágenes con Gemini
export async function analyzeImageWithGemini(
  imageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType
    }
  };

  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;

  return response.text();
}

// Función para analizar múltiples imágenes
export async function analyzeMultipleImagesWithGemini(
  images: Array<{ base64: string; mimeType: string }>,
  prompt: string
): Promise<string> {
  const client = getGeminiClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const parts = [
    prompt,
    ...images.map((img) => ({
      inlineData: {
        data: img.base64,
        mimeType: img.mimeType
      }
    }))
  ];

  const result = await model.generateContent(parts);
  const response = await result.response;

  return response.text();
}
