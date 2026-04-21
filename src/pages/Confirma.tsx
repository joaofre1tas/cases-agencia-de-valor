import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CONFIRMA_MENTORADO_PRINTS } from '@/data/confirma-mentorados'
import { getConfirmaVideoEmbedUrl } from '@/data/confirma-video'
import { cn } from '@/lib/utils'

export default function Confirma() {
  const videoEmbedUrl = getConfirmaVideoEmbedUrl()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="w-full flex flex-col bg-av-bg">
      <section className="relative overflow-hidden border-b border-av-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full blur-3xl opacity-15"
          style={{
            background: 'radial-gradient(circle at center, rgba(252,131,56,0.5) 0%, transparent 70%)',
          }}
        />

        <div className="container mx-auto px-4 max-w-[1350px] relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow-av">Recebemos sua aplicação</span>
            <h1 className="mt-4 text-[32px] md:text-[44px] font-semibold tracking-tight text-av-text leading-tight">
              Próximos passos
            </h1>
            <p className="mt-3 text-av-text-secondary text-lg leading-relaxed">
              Obrigado por enviar seus dados. Enquanto nosso time analisa sua aplicação, assista ao vídeo
              abaixo: o <span className="text-gradient-av font-semibold">Robson</span> explica em poucos
              minutos o que acontece daqui pra frente.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="flex flex-col gap-6">
              <div className="card-av p-6 md:p-8 border border-av-border">
                <p className="text-av-text-secondary leading-[1.75] text-[17px] md:text-[18px]">
                  Nesse vídeo rápido você entende como funciona o contato, o que esperar da mentoria e como
                  se preparar para aproveitar ao máximo a conversa com o time — mesmo que ainda esteja
                  avaliando se é o momento certo pra você.
                </p>
                <p className="mt-6 text-sm text-av-text-muted">
                  O player ao lado atualiza automaticamente quando a URL do vídeo for configurada no projeto.
                </p>
                <div className="mt-8">
                  <Button variant="av-outline" className="rounded-md" asChild>
                    <Link to="/">Voltar para a home</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div
                className={cn(
                  'relative aspect-video w-full overflow-hidden rounded-xl border border-av-border',
                  'bg-av-surface shadow-elevation',
                )}
              >
                {videoEmbedUrl ? (
                  <iframe
                    title="Próximos passos — Robson"
                    src={videoEmbedUrl}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-av-surface-2 to-av-bg" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-av-border bg-av-surface-2 text-av-orange">
                        <Play className="h-8 w-8 fill-current opacity-90" />
                      </div>
                      <div>
                        <p className="font-semibold text-av-text text-lg">Vídeo em breve</p>
                        <p className="mt-2 text-sm text-av-text-muted max-w-xs mx-auto">
                          Quando o Robson gravar o vídeo dos próximos passos, configure{' '}
                          <code className="text-xs bg-av-surface-2 px-1.5 py-0.5 rounded border border-av-border">
                            VITE_CONFIRMA_VIDEO_EMBED_URL
                          </code>{' '}
                          ou edite <code className="text-xs bg-av-surface-2 px-1.5 py-0.5 rounded border border-av-border">confirma-video.ts</code>.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 border-b border-av-border">
        <div className="container mx-auto px-4 max-w-[1350px]">
          <div className="max-w-2xl mb-10">
            <span className="eyebrow-av">Comunidade</span>
            <h2 className="mt-3 text-[26px] md:text-[32px] font-semibold text-av-text tracking-tight leading-tight">
              Quem aplica, celebra junto
            </h2>
            <p className="mt-3 text-av-text-secondary leading-relaxed">
              No grupo de networking da mentoria, mentorados compartilham vitórias reais — novos contratos,
              fechamentos e marcos. Alguns prints desses momentos aparecem abaixo.
            </p>
          </div>

          {CONFIRMA_MENTORADO_PRINTS.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {CONFIRMA_MENTORADO_PRINTS.map((item, i) => (
                <figure
                  key={`${item.src}-${i}`}
                  className="group overflow-hidden rounded-xl border border-av-border bg-av-surface shadow-elevation"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </figure>
              ))}
            </div>
          ) : (
            <div className="card-av p-10 text-center border border-dashed border-av-border">
              <p className="text-av-text-secondary">
                As imagens serão exibidas aqui assim que você adicionar os arquivos em{' '}
                <code className="text-sm text-av-text bg-av-surface-2 px-2 py-0.5 rounded border border-av-border">
                  public/confirma/mentorados/
                </code>{' '}
                e registrar os caminhos em{' '}
                <code className="text-sm text-av-text bg-av-surface-2 px-2 py-0.5 rounded border border-av-border">
                  src/data/confirma-mentorados.ts
                </code>
                .
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
