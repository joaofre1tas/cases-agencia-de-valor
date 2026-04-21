export function extractYoutubeId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw

  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtu.be')) {
      const v = url.pathname.replace('/', '')
      return /^[a-zA-Z0-9_-]{11}$/.test(v) ? v : null
    }
    if (url.hostname.includes('youtube.com')) {
      const fromQuery = url.searchParams.get('v')
      if (fromQuery && /^[a-zA-Z0-9_-]{11}$/.test(fromQuery)) return fromQuery
      const pathParts = url.pathname.split('/')
      const last = pathParts[pathParts.length - 1]
      return /^[a-zA-Z0-9_-]{11}$/.test(last) ? last : null
    }
  } catch {
    // no-op: segue para fallback regex abaixo
  }
  const regexFallback = raw.match(/(?:v=|\/embed\/|\/shorts\/|\/live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (regexFallback?.[1]) return regexFallback[1]
  const anyId = raw.match(/\b[a-zA-Z0-9_-]{11}\b/)
  return anyId?.[0] ?? null
}

export function youtubeEmbedUrl(input: string): string | null {
  const id = extractYoutubeId(input)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}`
}

export function youtubeThumbUrl(input: string): string | null {
  const id = extractYoutubeId(input)
  if (!id) return null
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
