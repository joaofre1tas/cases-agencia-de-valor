/**
 * Quando o vídeo estiver pronto, defina a URL de embed (YouTube/Vimeo) aqui
 * ou via `VITE_CONFIRMA_VIDEO_EMBED_URL` no .env (tem prioridade).
 */
function embedFromEnv(): string | null {
  const v = import.meta.env.VITE_CONFIRMA_VIDEO_EMBED_URL as string | undefined
  return v && v.trim() !== '' ? v.trim() : null
}

/** Ex.: URL completa do iframe src do YouTube "Compartilhar → Incorporar" */
export const HARDCODED_CONFIRMA_VIDEO_EMBED_URL: string | null = null

export function getConfirmaVideoEmbedUrl(): string | null {
  return embedFromEnv() ?? HARDCODED_CONFIRMA_VIDEO_EMBED_URL
}
