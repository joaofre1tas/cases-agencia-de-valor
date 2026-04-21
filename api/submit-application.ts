import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Encaminha o JSON do formulário para o webhook do Make (server-side, sem CORS no browser).
 * Configure MAKE_APPLICATION_WEBHOOK_URL na Vercel (recomendado; não vá para o bundle do Vite).
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  res.setHeader('Content-Type', 'application/json')

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const webhookUrl = process.env.MAKE_APPLICATION_WEBHOOK_URL?.trim()
  if (!webhookUrl) {
    res.status(500).json({ error: 'MAKE_APPLICATION_WEBHOOK_URL não configurada no servidor' })
    return
  }

  const bodyString =
    typeof req.body === 'string'
      ? req.body
      : req.body !== undefined && req.body !== null
        ? JSON.stringify(req.body)
        : '{}'

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: bodyString,
    })

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => '')
      console.error('[submit-application] Make respondeu', upstream.status, text.slice(0, 500))
      res.status(502).json({ error: 'Webhook rejeitou o envio' })
      return
    }

    res.status(200).json({ ok: true })
  } catch (e) {
    console.error('[submit-application]', e)
    res.status(502).json({ error: 'Falha ao contatar o webhook' })
  }
}
