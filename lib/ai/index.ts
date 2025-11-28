// lib/ai/index.ts

// Providers
export {
  getClaudeClient,
  askClaude,
  analyzeImageWithClaude
} from './providers/claude';
export {
  getOpenAIClient,
  askGPT4,
  analyzeImageWithGPT4
} from './providers/openai';
export {
  getGeminiClient,
  askGemini,
  analyzeImageWithGemini
} from './providers/gemini';

// Funciones principales
export { extraerDatosConIA } from './extractor';
export { generarDocumentoConIA, modificarDocumentoConChat } from './generador';
