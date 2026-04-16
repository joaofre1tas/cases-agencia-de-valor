import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button, ButtonAV } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { CaseMetric } from '@/lib/database.types'
import type { CaseInsert, CaseRow } from '@/lib/cases'
import {
  listSegments,
  createSegment,
  renameSegment,
  deleteSegmentWithReplacement,
} from '@/lib/segments'
import ImageField from '@/components/admin/ImageField'
import MetricsField from '@/components/admin/MetricsField'
import RichTextField from '@/components/admin/RichTextField'
import SegmentCombobox from '@/components/admin/SegmentCombobox'

const caseSchema = z.object({
  slug: z.string().min(1, 'Slug é obrigatório'),
  agency_name: z.string().min(1, 'Nome da agência é obrigatório'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  segment: z.string().min(1, 'Segmento é obrigatório'),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  logo_url: z.string().optional(),
  avatar_url: z.string().optional(),
  cover_url: z.string().optional(),
  subtitle: z.string().optional(),
  badge_label: z.string().optional(),
  challenge_eyebrow: z.string().optional(),
  challenge_heading: z.string().optional(),
  challenge_content: z.string().optional(),
  solution_eyebrow: z.string().optional(),
  solution_heading: z.string().optional(),
  solution_content: z.string().optional(),
  results_eyebrow: z.string().optional(),
  results_heading: z.string().optional(),
  results_content: z.string().optional(),
  quote_text: z.string().optional(),
  quote_author_name: z.string().optional(),
  quote_author_role: z.string().optional(),
  quote_author_avatar_url: z.string().optional(),
  quote_cta_label: z.string().optional(),
  quote_cta_url: z.string().optional(),
  final_cta_heading: z.string().optional(),
  final_cta_body: z.string().optional(),
  final_cta_label: z.string().optional(),
  final_cta_url: z.string().optional(),
  metrics: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),
})

export type CaseFormValues = z.infer<typeof caseSchema>

const defaultValues: CaseFormValues = {
  slug: '',
  agency_name: '',
  title: '',
  description: '',
  segment: '',
  published: false,
  sort_order: 0,
  logo_url: '',
  avatar_url: '',
  cover_url: '',
  subtitle: '',
  badge_label: 'Consultoria',
  challenge_eyebrow: 'O desafio',
  challenge_heading: '',
  challenge_content: '',
  solution_eyebrow: 'A solução',
  solution_heading: '',
  solution_content: '',
  results_eyebrow: 'Os resultados',
  results_heading: '',
  results_content: '',
  quote_text: '',
  quote_author_name: '',
  quote_author_role: '',
  quote_author_avatar_url: '',
  quote_cta_label: '',
  quote_cta_url: '',
  final_cta_heading: 'Sua agência vai ser o próximo case?',
  final_cta_body: 'Aplique para a Mentoria Agência de Valor e estruture sua agência para os R$100k todo mês.',
  final_cta_label: 'Aplicar agora',
  final_cta_url: '#',
  metrics: [],
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

function extractErrorMessage(error: unknown) {
  if (!error) return 'Não foi possível salvar o case.'
  if (typeof error === 'string') return error
  if (error instanceof Error && error.message) return error.message
  if (typeof error === 'object') {
    const err = error as {
      message?: string
      error_description?: string
      details?: string
      hint?: string
      code?: string
    }
    return (
      err.message ||
      err.error_description ||
      err.details ||
      err.hint ||
      err.code ||
      'Não foi possível salvar o case.'
    )
  }
  return 'Não foi possível salvar o case.'
}

interface CaseEditorProps {
  initialValues?: Partial<CaseRow>
  onSubmit: (values: CaseInsert) => Promise<void>
  onDelete?: () => Promise<void>
}

export default function CaseEditor({ initialValues, onSubmit, onDelete }: CaseEditorProps) {
  const [submitIntent, setSubmitIntent] = useState<'draft' | 'publish' | null>(null)
  const queryClient = useQueryClient()
  const segmentsQuery = useQuery({
    queryKey: ['segments'],
    queryFn: listSegments,
  })

  const createSegmentMutation = useMutation({
    mutationFn: (name: string) => createSegment(name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['segments'] })
      toast.success('Segmento criado.')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const renameSegmentMutation = useMutation({
    mutationFn: ({ currentName, nextName }: { currentName: string; nextName: string }) =>
      renameSegment(currentName, nextName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['segments'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
      toast.success('Segmento atualizado e cases migrados.')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const deleteSegmentMutation = useMutation({
    mutationFn: ({ name, replacement }: { name: string; replacement: string }) =>
      deleteSegmentWithReplacement(name, replacement),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['segments'] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'cases'] })
      await queryClient.invalidateQueries({ queryKey: ['public', 'cases'] })
      toast.success('Segmento excluído e cases migrados em lote.')
    },
    onError: (error: Error) => toast.error(error.message),
  })

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      metrics: (initialValues?.metrics as CaseMetric[]) ?? [],
    },
  })

  const titleValue = form.watch('title')
  const currentSlug = form.watch('slug')
  const isDirty = form.formState.isDirty
  const isSubmitting = submitIntent !== null

  useEffect(() => {
    if (!initialValues?.slug && titleValue && !currentSlug) {
      form.setValue('slug', slugify(titleValue))
    }
  }, [titleValue, currentSlug, initialValues?.slug, form])

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) {
        return
      }
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  async function submitWithIntent(values: CaseFormValues, intent: 'draft' | 'publish') {
    const payload: CaseInsert = {
      ...values,
      published: intent === 'publish' ? true : values.published,
      metrics: values.metrics,
    }

    try {
      setSubmitIntent(intent)
      await onSubmit(payload)
      form.reset(payload as CaseFormValues)
      toast.success(intent === 'publish' ? 'Case publicado com sucesso.' : 'Rascunho salvo com sucesso.')
    } catch (error) {
      console.error('[CaseEditor] submit error:', error)
      toast.error(extractErrorMessage(error))
    } finally {
      setSubmitIntent(null)
    }
  }

  function handleInvalidSubmit() {
    const firstError = Object.values(form.formState.errors)[0]
    const message =
      typeof firstError?.message === 'string'
        ? firstError.message
        : 'Preencha os campos obrigatórios para continuar.'
    toast.error(message)
    setSubmitIntent(null)
  }

  function handleSaveDraftClick() {
    void form.handleSubmit(
      (values) => submitWithIntent(values, 'draft'),
      handleInvalidSubmit,
    )()
  }

  function handlePublishClick() {
    void form.handleSubmit(
      (values) => submitWithIntent(values, 'publish'),
      handleInvalidSubmit,
    )()
  }

  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
      <div className="sticky top-2 z-20 card-av px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-av-text-secondary">
          {isDirty ? 'Você tem alterações não salvas.' : 'Tudo salvo.'}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="av-outline"
            onClick={handleSaveDraftClick}
            disabled={isSubmitting}
          >
            {submitIntent === 'draft' ? 'Salvando...' : 'Salvar rascunho'}
          </Button>
          <ButtonAV
            type="button"
            onClick={handlePublishClick}
            disabled={isSubmitting}
          >
            {submitIntent === 'publish' ? 'Publicando...' : 'Publicar'}
          </ButtonAV>
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              className="text-red-400 hover:text-red-300"
              onClick={onDelete}
            >
              Excluir
            </Button>
          ) : null}
        </div>
      </div>

      <Tabs defaultValue="identificacao">
        <TabsList className="bg-av-surface border border-av-border">
          <TabsTrigger value="identificacao">Identificação</TabsTrigger>
          <TabsTrigger value="midias">Mídias</TabsTrigger>
          <TabsTrigger value="secoes">Seções</TabsTrigger>
          <TabsTrigger value="metricas">Métricas</TabsTrigger>
          <TabsTrigger value="depoimento">Depoimento</TabsTrigger>
          <TabsTrigger value="cta">CTA</TabsTrigger>
        </TabsList>

        <TabsContent value="identificacao" className="card-av p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Slug</label>
              <Input
                {...form.register('slug')}
                placeholder="roi-lab"
                className="bg-av-bg border-av-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Segmento</label>
              <Controller
                control={form.control}
                name="segment"
                render={({ field }) => (
                  <SegmentCombobox
                    value={field.value}
                    options={segmentsQuery.data ?? []}
                    onChange={field.onChange}
                    onCreate={(name) => createSegmentMutation.mutateAsync(name).then(() => undefined)}
                    onRename={(currentName, nextName) =>
                      renameSegmentMutation
                        .mutateAsync({ currentName, nextName })
                        .then(() => undefined)
                    }
                    onDeleteWithReplacement={(name, replacement) =>
                      deleteSegmentMutation
                        .mutateAsync({ name, replacement })
                        .then(() => undefined)
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-av-text-secondary">Nome da agência</label>
            <Input
              {...form.register('agency_name')}
              placeholder="Ex.: ROI Lab"
              className="bg-av-bg border-av-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-av-text-secondary">Título</label>
            <Input {...form.register('title')} className="bg-av-bg border-av-border" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-av-text-secondary">Descrição (card)</label>
            <Textarea {...form.register('description')} className="bg-av-bg border-av-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Badge</label>
              <Input {...form.register('badge_label')} className="bg-av-bg border-av-border" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Subtítulo</label>
              <Input {...form.register('subtitle')} className="bg-av-bg border-av-border" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Ordem</label>
              <Input
                type="number"
                {...form.register('sort_order', { valueAsNumber: true })}
                className="bg-av-bg border-av-border"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Publicado</label>
              <Controller
                control={form.control}
                name="published"
                render={({ field }) => (
                  <div className="h-10 flex items-center">
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="midias" className="card-av p-6 space-y-6">
          <Controller
            name="logo_url"
            control={form.control}
            render={({ field }) => (
              <ImageField label="Logo do case" value={field.value || ''} onChange={field.onChange} />
            )}
          />
          <Controller
            name="avatar_url"
            control={form.control}
            render={({ field }) => (
              <ImageField
                label="Avatar do cliente"
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
          <Controller
            name="cover_url"
            control={form.control}
            render={({ field }) => (
              <ImageField
                label="Imagem de capa (hero)"
                value={field.value || ''}
                onChange={field.onChange}
              />
            )}
          />
        </TabsContent>

        <TabsContent value="secoes" className="space-y-6">
          <div className="card-av p-6 space-y-4">
            <h3 className="font-semibold text-lg">Desafio</h3>
            <Input {...form.register('challenge_eyebrow')} className="bg-av-bg border-av-border" />
            <Input {...form.register('challenge_heading')} className="bg-av-bg border-av-border" />
            <Controller
              control={form.control}
              name="challenge_content"
              render={({ field }) => (
                <RichTextField label="Conteúdo" value={field.value || ''} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="card-av p-6 space-y-4">
            <h3 className="font-semibold text-lg">Solução</h3>
            <Input {...form.register('solution_eyebrow')} className="bg-av-bg border-av-border" />
            <Input {...form.register('solution_heading')} className="bg-av-bg border-av-border" />
            <Controller
              control={form.control}
              name="solution_content"
              render={({ field }) => (
                <RichTextField label="Conteúdo" value={field.value || ''} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="card-av p-6 space-y-4">
            <h3 className="font-semibold text-lg">Resultados</h3>
            <Input {...form.register('results_eyebrow')} className="bg-av-bg border-av-border" />
            <Input {...form.register('results_heading')} className="bg-av-bg border-av-border" />
            <Controller
              control={form.control}
              name="results_content"
              render={({ field }) => (
                <RichTextField label="Conteúdo" value={field.value || ''} onChange={field.onChange} />
              )}
            />
          </div>
        </TabsContent>

        <TabsContent value="metricas" className="card-av p-6">
          <Controller
            name="metrics"
            control={form.control}
            render={({ field }) => (
              <MetricsField value={(field.value as CaseMetric[]) ?? []} onChange={field.onChange} />
            )}
          />
        </TabsContent>

        <TabsContent value="depoimento" className="card-av p-6 space-y-4">
          <Textarea
            {...form.register('quote_text')}
            placeholder="Texto do depoimento"
            className="bg-av-bg border-av-border"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...form.register('quote_author_name')}
              placeholder="Nome do autor"
              className="bg-av-bg border-av-border"
            />
            <Input
              {...form.register('quote_author_role')}
              placeholder="Cargo"
              className="bg-av-bg border-av-border"
            />
          </div>
          <Controller
            name="quote_author_avatar_url"
            control={form.control}
            render={({ field }) => (
              <ImageField
                label="Avatar do autor"
                value={field.value || ''}
                onChange={field.onChange}
                folder="avatars"
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...form.register('quote_cta_label')}
              placeholder="Label do botão do depoimento"
              className="bg-av-bg border-av-border"
            />
            <Input
              {...form.register('quote_cta_url')}
              placeholder="URL do botão do depoimento"
              className="bg-av-bg border-av-border"
            />
          </div>
        </TabsContent>

        <TabsContent value="cta" className="card-av p-6 space-y-4">
          <Input
            {...form.register('final_cta_heading')}
            placeholder="Título da CTA final"
            className="bg-av-bg border-av-border"
          />
          <Textarea
            {...form.register('final_cta_body')}
            placeholder="Texto da CTA final"
            className="bg-av-bg border-av-border"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              {...form.register('final_cta_label')}
              placeholder="Texto do botão"
              className="bg-av-bg border-av-border"
            />
            <Input
              {...form.register('final_cta_url')}
              placeholder="URL do botão"
              className="bg-av-bg border-av-border"
            />
          </div>
        </TabsContent>
      </Tabs>
    </form>
  )
}
