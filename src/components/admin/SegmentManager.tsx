import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createSegment, deleteSegmentWithReplacement, listSegments } from '@/lib/segments'

export default function SegmentManager() {
  const queryClient = useQueryClient()
  const [newSegment, setNewSegment] = useState('')

  const segmentsQuery = useQuery({
    queryKey: ['segments'],
    queryFn: listSegments,
  })

  const createMutation = useMutation({
    mutationFn: (name: string) => createSegment(name),
    onSuccess: async () => {
      setNewSegment('')
      toast.success('Segmento criado.')
      await queryClient.invalidateQueries({ queryKey: ['segments'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteMutation = useMutation({
    mutationFn: ({ name, replacement }: { name: string; replacement: string }) =>
      deleteSegmentWithReplacement(name, replacement),
    onSuccess: async () => {
      toast.success('Segmento removido.')
      await queryClient.invalidateQueries({ queryKey: ['segments'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
    },
    onError: (error: Error) => toast.error(error.message),
  })

  async function handleCreate() {
    if (!newSegment.trim()) {
      toast.error('Digite um nome de segmento.')
      return
    }
    await createMutation.mutateAsync(newSegment)
  }

  async function handleDelete(name: string) {
    const replacement = window.prompt(
      `Excluir segmento "${name}".\nDigite o segmento substituto para migrar os cases:`,
      '',
    )
    if (!replacement?.trim()) {
      return
    }
    await deleteMutation.mutateAsync({ name, replacement: replacement.trim() })
  }

  return (
    <div className="card-av p-4 space-y-4">
      <h2 className="text-lg font-semibold">Segmentos</h2>
      <div className="flex gap-2">
        <Input
          value={newSegment}
          onChange={(event) => setNewSegment(event.target.value)}
          placeholder="Novo segmento"
          className="bg-av-bg border-av-border"
        />
        <Button type="button" variant="av-outline" onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {segmentsQuery.isLoading ? (
        <p className="text-sm text-av-text-muted">Carregando segmentos...</p>
      ) : (
        <ul className="space-y-2">
          {(segmentsQuery.data ?? []).map((segment) => (
            <li
              key={segment.id}
              className="flex items-center justify-between rounded-md border border-av-border px-3 py-2"
            >
              <span className="text-sm text-av-text">{segment.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(segment.name)}
                disabled={segment.name === 'Sem segmento'}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
