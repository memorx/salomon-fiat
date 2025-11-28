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
  analyzeImageWithGPT4,
  analyzeImageBase64WithGPT4
} from './providers/openai';

export {
  getGeminiClient,
  askGemini,
  analyzeImageWithGemini,
  analyzeMultipleImagesWithGemini
} from './providers/gemini';

// Funciones principales
export { extraerDatosConIA } from './extractor';
export {
  generarDocumentoConIA,
  modificarDocumentoConChat,
  numeroATexto,
  formatearPrecioLegal
} from './generador';
