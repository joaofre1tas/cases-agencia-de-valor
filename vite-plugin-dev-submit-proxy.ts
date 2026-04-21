import type { IncomingMessage } from 'node:http'
import type { Plugin } from 'vite'

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (c: Buffer) => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/**
 * Em `npm run dev`, espelha o POST /api/submit-application para o mesmo comportamento da Vercel.
 */
export function devSubmitProxy(): Plugin {
  return {
    name: 'dev-submit-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0] ?? ''
        if (path !== '/api/submit-application' || req.method !== 'POST') {
          next()
          return
        }

        const makeUrl = process.env.MAKE_APPLICATION_WEBHOOK_URL || process.env.VITE_MAKE_APPLICATION_WEBHOOK_URL
        if (!makeUrl?.trim()) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error:
                'Defina MAKE_APPLICATION_WEBHOOK_URL ou VITE_MAKE_APPLICATION_WEBHOOK_URL no .env.local',
            }),
          )
          return
        }

        try {
          const body = await readBody(req)
          const upstream = await fetch(makeUrl.trim(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })
          res.statusCode = upstream.ok ? 200 : 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(upstream.ok ? { ok: true } : { error: 'Webhook rejeitou' }))
        } catch {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Falha ao encaminhar' }))
        }
      })
    },
  }
}
