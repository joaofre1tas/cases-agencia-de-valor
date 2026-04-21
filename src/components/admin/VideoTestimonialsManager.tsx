import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import MetricsField from '@/components/admin/MetricsField'
import ImageField from '@/components/admin/ImageField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CaseMetric } from '@/lib/database.types'
import {
  createTestimonialVideo,
  listTestimonialVideos,
  removeTestimonialVideo,
  updateTestimonialVideo,
} from '@/lib/testimonial-videos'

type VideoFormState = {
  youtubeInput: string
  headline: string
  description: string
  agencyName: string
  founderName: string
  founderAvatarUrl: string
  segment: string
  sortOrder: number
  published: boolean
  metrics: CaseMetric[]
}

const INITIAL_STATE: VideoFormState = {
  youtubeInput: '',
  headline: '',
  description: '',
  agencyName: '',
  founderName: '',
  founderAvatarUrl: '',
  segment: '',
  sortOrder: 0,
  published: true,
  metrics: [],
}

function extractYoutubeId(input: string): string | null {
  const raw = input.trim()
  if (!raw) return null
  const idLike = /^[a-zA-Z0-9_-]{11}$/.test(raw)
  if (idLike) return raw

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
      const embed = pathParts[pathParts.length - 1]
      return /^[a-zA-Z0-9_-]{11}$/.test(embed) ? embed : null
    }
    return null
  } catch {
    return null
  }
}

export default function VideoTestimonialsManager() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<VideoFormState>(INITIAL_STATE)

  const videosQuery = useQuery({
    queryKey: ['admin', 'testimonial-videos'],
    queryFn: () => listTestimonialVideos(true),
  })

  const createMutation = useMutation({
    mutationFn: createTestimonialVideo,
    onSuccess: async () => {
      toast.success('Vídeo criado.')
      setForm(INITIAL_STATE)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'testimonial-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'testimonial-videos'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      updateTestimonialVideo(id, { published }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'testimonial-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'testimonial-videos'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeTestimonialVideo(id),
    onSuccess: async () => {
      toast.success('Vídeo removido.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'testimonial-videos'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'testimonial-videos'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const derivedId = useMemo(() => extractYoutubeId(form.youtubeInput), [form.youtubeInput])

  async function handleCreate() {
    if (!derivedId) {
      toast.error('Informe uma URL/ID de YouTube válida.')
      return
    }
    if (!form.headline.trim() || !form.agencyName.trim() || !form.founderName.trim() || !form.segment.trim()) {
      toast.error('Preencha os campos obrigatórios.')
      return
    }

    await createMutation.mutateAsync({
      youtube_video_id: derivedId,
      headline: form.headline.trim(),
      description: form.description.trim() || null,
      agency_name: form.agencyName.trim(),
      founder_name: form.founderName.trim(),
      founder_avatar_url: form.founderAvatarUrl.trim() || null,
      segment: form.segment.trim(),
      sort_order: form.sortOrder,
      published: form.published,
      metrics: form.metrics,
    })
  }

  return (
    <section className="card-av p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Vídeos</h2>
        <p className="text-sm text-av-text-secondary">Cadastre depoimentos em vídeo para a aba Vídeos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2 md:col-span-2">
          <Label>YouTube (URL ou ID) *</Label>
          <Input
            value={form.youtubeInput}
            onChange={(event) => setForm((prev) => ({ ...prev, youtubeInput: event.target.value }))}
            placeholder="https://www.youtube.com/watch?v=..."
            className="bg-av-bg border-av-border"
          />
          <p className="text-xs text-av-text-muted">
            ID detectado: <span className="font-mono">{derivedId ?? 'inválido'}</span>
          </p>
        </div>

        <div className="space-y-2">
          <Label>Headline *</Label>
          <Input
            value={form.headline}
            onChange={(event) => setForm((prev) => ({ ...prev, headline: event.target.value }))}
            className="bg-av-bg border-av-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Nicho *</Label>
          <Input
            value={form.segment}
            onChange={(event) => setForm((prev) => ({ ...prev, segment: event.target.value }))}
            className="bg-av-bg border-av-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Agência *</Label>
          <Input
            value={form.agencyName}
            onChange={(event) => setForm((prev) => ({ ...prev, agencyName: event.target.value }))}
            className="bg-av-bg border-av-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Fundador *</Label>
          <Input
            value={form.founderName}
            onChange={(event) => setForm((prev) => ({ ...prev, founderName: event.target.value }))}
            className="bg-av-bg border-av-border"
          />
        </div>

        <div className="space-y-2">
          <Label>Ordem</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: Number(event.target.value) || 0 }))}
            className="bg-av-bg border-av-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Descrição (opcional)</Label>
        <Input
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          className="bg-av-bg border-av-border"
        />
      </div>

      <ImageField
        label="Foto do fundador"
        value={form.founderAvatarUrl}
        onChange={(url) => setForm((prev) => ({ ...prev, founderAvatarUrl: url }))}
        folder="video-founders"
      />

      <MetricsField value={form.metrics} onChange={(metrics) => setForm((prev) => ({ ...prev, metrics }))} />

      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox
          checked={form.published}
          onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked === true }))}
        />
        Publicado
      </label>

      <Button type="button" onClick={() => void handleCreate()} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Salvando...' : 'Adicionar vídeo'}
      </Button>

      <div className="space-y-2 pt-3 border-t border-av-border">
        {videosQuery.isLoading ? <p className="text-sm text-av-text-muted">Carregando vídeos...</p> : null}
        {(videosQuery.data ?? []).map((item) => (
          <div key={item.id} className="rounded-md border border-av-border p-3 flex items-center gap-3">
            <div className="h-12 w-20 rounded overflow-hidden border border-av-border bg-av-surface shrink-0">
              <img
                src={`https://i.ytimg.com/vi/${item.youtube_video_id}/hqdefault.jpg`}
                alt={item.headline}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-av-text truncate">{item.headline}</p>
              <p className="text-xs text-av-text-muted truncate">
                {item.agency_name} · {item.founder_name}
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-av-text-secondary">
              <Checkbox
                checked={item.published}
                onCheckedChange={(checked) =>
                  void updateMutation.mutateAsync({ id: item.id, published: checked === true })
                }
              />
              Publicado
            </label>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => void deleteMutation.mutateAsync(item.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
