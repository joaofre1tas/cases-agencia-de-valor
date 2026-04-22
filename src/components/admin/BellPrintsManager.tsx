import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  createBellPrint,
  createBellPrints,
  listBellPrints,
  removeBellPrint,
  updateBellPrint,
} from '@/lib/bells'
import { uploadAsset } from '@/lib/cases'

type BellFormState = {
  imageUrl: string
  altText: string
  sortOrder: number
  published: boolean
}

const INITIAL_STATE: BellFormState = {
  imageUrl: '',
  altText: '',
  sortOrder: 0,
  published: true,
}

export default function BellPrintsManager() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<BellFormState>(INITIAL_STATE)
  const [uploading, setUploading] = useState(false)
  const [batchUploading, setBatchUploading] = useState(false)
  const [batchProgress, setBatchProgress] = useState({ done: 0, total: 0 })

  const bellsQuery = useQuery({
    queryKey: ['admin', 'bell-prints'],
    queryFn: () => listBellPrints(true),
  })

  const createMutation = useMutation({
    mutationFn: createBellPrint,
    onSuccess: async () => {
      toast.success('Sino criado.')
      setForm(INITIAL_STATE)
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bell-prints'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'bell-prints'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      updateBellPrint(id, { published }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bell-prints'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'bell-prints'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeBellPrint(id),
    onSuccess: async () => {
      toast.success('Sino removido.')
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bell-prints'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'bell-prints'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  async function handleUpload(file?: File) {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAsset(file, 'bells')
      setForm((prev) => ({ ...prev, imageUrl: url }))
      toast.success('Imagem enviada.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha no upload.'
      toast.error(message)
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate() {
    if (!form.imageUrl.trim()) {
      toast.error('Informe a URL da imagem do sino.')
      return
    }
    await createMutation.mutateAsync({
      image_url: form.imageUrl.trim(),
      alt_text: form.altText.trim() || null,
      sort_order: form.sortOrder,
      published: form.published,
    })
  }

  async function handleBatchUpload(filesList: FileList | File[]) {
    const files = Array.from(filesList).filter((file) => file.type.startsWith('image/'))
    if (files.length === 0) {
      toast.error('Selecione imagens válidas para upload em lote.')
      return
    }

    const ordered = [...(bellsQuery.data ?? [])]
      .map((item) => item.sort_order ?? 0)
      .sort((a, b) => b - a)
    let nextSortOrder = (ordered[0] ?? 0) + 1

    setBatchUploading(true)
    setBatchProgress({ done: 0, total: files.length })
    try {
      const uploadedPayloads: Array<{
        image_url: string
        alt_text: string | null
        sort_order: number
        published: boolean
      }> = []

      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]
        const url = await uploadAsset(file, 'bells')
        const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim()
        uploadedPayloads.push({
          image_url: url,
          alt_text: baseName || null,
          sort_order: nextSortOrder,
          published: true,
        })
        nextSortOrder += 1
        setBatchProgress({ done: index + 1, total: files.length })
      }

      const chunkSize = 100
      for (let index = 0; index < uploadedPayloads.length; index += chunkSize) {
        const chunk = uploadedPayloads.slice(index, index + chunkSize)
        await createBellPrints(chunk)
      }

      await queryClient.invalidateQueries({ queryKey: ['admin', 'bell-prints'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'bell-prints'] })
      toast.success(`${files.length} sinos enviados em lote.`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha no upload em lote.'
      toast.error(message)
    } finally {
      setBatchUploading(false)
      setBatchProgress({ done: 0, total: 0 })
    }
  }

  return (
    <section className="card-av p-4 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Sinos</h2>
        <p className="text-sm text-av-text-secondary">Suba os prints de comemorações para a aba Sinos.</p>
      </div>

      <div
        className="rounded-md border border-dashed border-av-border bg-av-bg/50 p-4"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          if (batchUploading) return
          void handleBatchUpload(event.dataTransfer.files)
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-av-text">Upload em lote</p>
            <p className="text-xs text-av-text-muted">
              Arraste vários prints aqui ou clique para selecionar múltiplos arquivos.
            </p>
            {batchUploading ? (
              <p className="text-xs text-av-text-secondary mt-1">
                Enviando {batchProgress.done} de {batchProgress.total}...
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="av-outline"
            className="relative overflow-hidden w-full md:w-auto"
            disabled={batchUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {batchUploading ? 'Enviando lote...' : 'Selecionar arquivos'}
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(event) => {
                void handleBatchUpload(event.target.files ?? [])
                event.currentTarget.value = ''
              }}
              disabled={batchUploading}
            />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2 md:col-span-2">
          <Label>Imagem (URL)</Label>
          <div className="flex gap-2">
            <Input
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              placeholder="https://..."
              className="bg-av-bg border-av-border"
            />
            <Button type="button" variant="av-outline" className="relative overflow-hidden">
              {uploading ? 'Enviando...' : 'Upload'}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(event) => {
                  void handleUpload(event.target.files?.[0])
                  event.currentTarget.value = ''
                }}
                disabled={uploading}
              />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Texto alternativo (opcional)</Label>
          <Input
            value={form.altText}
            onChange={(event) => setForm((prev) => ({ ...prev, altText: event.target.value }))}
            placeholder="Print de novo contrato..."
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

      <label className="inline-flex items-center gap-2 text-sm">
        <Checkbox
          checked={form.published}
          onCheckedChange={(checked) => setForm((prev) => ({ ...prev, published: checked === true }))}
        />
        Publicado
      </label>

      {form.imageUrl ? (
        <img
          src={form.imageUrl}
          alt={form.altText || 'Preview do sino'}
          className="h-28 w-auto rounded-md border border-av-border bg-av-surface p-1"
        />
      ) : null}

      <Button type="button" onClick={() => void handleCreate()} disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Salvando...' : 'Adicionar sino'}
      </Button>

      <div className="space-y-2 pt-3 border-t border-av-border">
        {bellsQuery.isLoading ? <p className="text-sm text-av-text-muted">Carregando sinos...</p> : null}
        {(bellsQuery.data ?? []).map((item) => (
          <div key={item.id} className="rounded-md border border-av-border p-3 flex items-center gap-3">
            <img
              src={item.image_url}
              alt={item.alt_text || 'Sino'}
              className="h-12 w-12 rounded object-cover border border-av-border"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-av-text truncate">{item.alt_text || 'Sem alt'}</p>
              <p className="text-xs text-av-text-muted">Ordem: {item.sort_order}</p>
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
