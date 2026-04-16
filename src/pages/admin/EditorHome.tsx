import { useEffect, useRef, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button, ButtonAV } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import RichTextMini from '@/components/admin/RichTextMini'
import { ResponsiveAlignGroup, ResponsiveSizeGroup } from '@/components/admin/ResponsiveSiteFields'
import {
  defaultSiteContentFormValues,
  flatRecordToFormValues,
  formValuesToFlatRecord,
  updateSiteSettings,
  useSiteSettings,
  type SiteContentFormValues,
} from '@/lib/site-settings'

const platformEnum = z.enum(['instagram', 'linkedin', 'youtube'])
const sizeEnum = z.enum(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'])
const alignEnum = z.enum(['left', 'center', 'right', 'justify'])

const responsiveSizeSchema = z.object({
  mobile: sizeEnum,
  tablet: sizeEnum,
  desktop: sizeEnum,
})

const responsiveAlignSchema = z.object({
  mobile: alignEnum,
  tablet: alignEnum,
  desktop: alignEnum,
})

const editorHomeSchema = z.object({
  home: z.object({
    hero: z.object({
      eyebrow: z.string().min(1, 'Eyebrow é obrigatório'),
      title_html: z.string().min(1, 'Título é obrigatório'),
      subtitle_html: z.string().min(1, 'Subtítulo é obrigatório'),
      badges: z.array(
        z.object({
          label: z.string().min(1, 'Cada badge precisa de texto'),
          enabled: z.boolean(),
        }),
      ),
      align: responsiveAlignSchema,
    }),
    cases: z.object({
      eyebrow: z.string().min(1, 'Eyebrow da seção é obrigatório'),
      title_html: z.string().min(1, 'Título da seção é obrigatório'),
      align: responsiveAlignSchema,
      typography: z.object({
        eyebrow: responsiveSizeSchema,
        title: responsiveSizeSchema,
      }),
    }),
  }),
  header: z.object({
    cta_label: z.string().min(1, 'Texto do CTA é obrigatório'),
    cta_url: z.string().min(1, 'URL do CTA é obrigatória'),
  }),
  footer: z.object({
    slogan_html: z.string().min(1, 'Slogan é obrigatório'),
    badges: z.array(
      z.object({
        label: z.string().min(1, 'Texto do badge é obrigatório'),
        enabled: z.boolean(),
      }),
    ),
    show_menu_section: z.boolean(),
    show_contact_section: z.boolean(),
    show_social_section: z.boolean(),
    slogan_typography: responsiveSizeSchema,
    badges_typography: responsiveSizeSchema,
    section_alignments: z.object({
      slogan: responsiveAlignSchema,
      badges: responsiveAlignSchema,
      menu: responsiveAlignSchema,
      contact: responsiveAlignSchema,
      social: responsiveAlignSchema,
      bottom: responsiveAlignSchema,
    }),
    menu_links: z.array(
      z.object({
        label: z.string().min(1, 'Label do menu é obrigatório'),
        href: z.string().min(1, 'Link é obrigatório'),
        enabled: z.boolean(),
        openInNewTab: z.boolean(),
      }),
    ),
    contact_email: z.string().min(1, 'E-mail é obrigatório'),
    location: z.string().min(1, 'Local é obrigatório'),
    social: z.array(
      z.object({
        platform: platformEnum,
        label: z.string().min(1, 'Label é obrigatório'),
        url: z.string().min(1, 'URL é obrigatória'),
        enabled: z.boolean(),
        openInNewTab: z.boolean(),
      }),
    ),
    copyright: z.string().min(1, 'Copyright é obrigatório'),
    legal_links: z.array(
      z.object({
        label: z.string().min(1, 'Label é obrigatório'),
        href: z.string().min(1, 'Link é obrigatório'),
        enabled: z.boolean(),
        openInNewTab: z.boolean(),
      }),
    ),
  }),
})

type EditorHomeFormValues = z.infer<typeof editorHomeSchema>

function extractErrorMessage(error: unknown) {
  if (!error) return 'Não foi possível salvar.'
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
      'Não foi possível salvar.'
    )
  }
  return 'Não foi possível salvar.'
}

export default function EditorHome() {
  const queryClient = useQueryClient()
  const siteSettingsQuery = useSiteSettings()
  const [richEpoch, setRichEpoch] = useState(0)
  const loadErrorToastShown = useRef(false)

  const form = useForm<EditorHomeFormValues>({
    resolver: zodResolver(editorHomeSchema),
    defaultValues: defaultSiteContentFormValues as EditorHomeFormValues,
  })

  useEffect(() => {
    if (!siteSettingsQuery.data) return
    form.reset(flatRecordToFormValues(siteSettingsQuery.data) as EditorHomeFormValues)
    setRichEpoch((e) => e + 1)
  }, [siteSettingsQuery.data, form])

  useEffect(() => {
    if (!siteSettingsQuery.isError || loadErrorToastShown.current) return
    loadErrorToastShown.current = true
    toast.error('Não foi possível carregar as configurações. Você ainda pode editar e tentar salvar.')
  }, [siteSettingsQuery.isError])

  const badgesFA = useFieldArray({ control: form.control, name: 'home.hero.badges' })
  const footerBadgesFA = useFieldArray({ control: form.control, name: 'footer.badges' })
  const menuFA = useFieldArray({ control: form.control, name: 'footer.menu_links' })
  const socialFA = useFieldArray({ control: form.control, name: 'footer.social' })
  const legalFA = useFieldArray({ control: form.control, name: 'footer.legal_links' })

  const isDirty = form.formState.isDirty
  const isSubmitting = form.formState.isSubmitting

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const saveMutation = useMutation({
    mutationFn: async (values: SiteContentFormValues) => {
      await updateSiteSettings(formValuesToFlatRecord(values))
    },
    onSuccess: async (_, values) => {
      await queryClient.invalidateQueries({ queryKey: ['site-settings'] })
      form.reset(values as EditorHomeFormValues)
      setRichEpoch((e) => e + 1)
      toast.success('Conteúdo da home salvo com sucesso.')
    },
    onError: (error: unknown) => {
      toast.error(extractErrorMessage(error))
    },
  })

  async function onValidSubmit(values: EditorHomeFormValues) {
    await saveMutation.mutateAsync(values as SiteContentFormValues)
  }

  function onInvalidSubmit() {
    const first = Object.values(form.formState.errors)[0] as { message?: string } | undefined
    const message =
      typeof first?.message === 'string'
        ? first.message
        : 'Revise os campos obrigatórios em cada aba antes de salvar.'
    toast.error(message)
  }

  if (siteSettingsQuery.isLoading) {
    return (
      <div className="rounded-lg border border-av-border bg-av-surface p-8 text-center text-av-text-muted text-sm">
        Carregando configurações do site...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-av-text tracking-tight">Editor da home</h1>
        <p className="text-sm text-av-text-muted mt-1">
          Hero, seção de cases, CTA do header e rodapé. Alterações não salvas geram aviso ao fechar a aba.
        </p>
      </div>

      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 border-b border-av-border bg-av-bg/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-av-text-secondary">
          {isDirty ? (
            <span className="text-av-orange font-medium">Alterações não salvas</span>
          ) : (
            <span>Tudo salvo</span>
          )}
        </p>
        <ButtonAV
          type="button"
          disabled={!isDirty || isSubmitting || saveMutation.isPending}
          onClick={() => void form.handleSubmit(onValidSubmit, onInvalidSubmit)()}
        >
          {isSubmitting || saveMutation.isPending ? 'Salvando...' : 'Salvar alterações'}
        </ButtonAV>
      </div>

      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)}
        noValidate
      >
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-2 sm:grid-cols-4 bg-av-surface border border-av-border h-auto flex-wrap gap-1 p-1">
            <TabsTrigger value="hero" className="text-xs sm:text-sm">
              Hero
            </TabsTrigger>
            <TabsTrigger value="cases" className="text-xs sm:text-sm">
              Seção cases
            </TabsTrigger>
            <TabsTrigger value="header" className="text-xs sm:text-sm">
              Header
            </TabsTrigger>
            <TabsTrigger value="footer" className="text-xs sm:text-sm">
              Footer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hero" className="space-y-6 mt-6">
            <div className="space-y-2 max-w-xl">
              <Label htmlFor="eyebrow">Eyebrow</Label>
              <Input id="eyebrow" {...form.register('home.hero.eyebrow')} />
              {form.formState.errors.home?.hero?.eyebrow ? (
                <p className="text-xs text-destructive">{form.formState.errors.home.hero.eyebrow.message}</p>
              ) : null}
            </div>

            <Controller
              control={form.control}
              name="home.hero.title_html"
              render={({ field }) => (
                <RichTextMini
                  key={`title-${richEpoch}`}
                  label="Título (HTML)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              control={form.control}
              name="home.hero.subtitle_html"
              render={({ field }) => (
                <RichTextMini
                  key={`subtitle-${richEpoch}`}
                  label="Subtítulo (HTML)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Badges</Label>
                <Button
                  type="button"
                  variant="av-outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => badgesFA.append({ label: 'Novo badge', enabled: true })}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-3">
                {badgesFA.fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-av-border bg-av-surface p-3"
                  >
                    <Input
                      className="flex-1"
                      {...form.register(`home.hero.badges.${index}.label` as const)}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <Switch
                        checked={form.watch(`home.hero.badges.${index}.enabled`)}
                        onCheckedChange={(checked) =>
                          form.setValue(`home.hero.badges.${index}.enabled`, checked, {
                            shouldDirty: true,
                          })
                        }
                      />
                      <span className="text-xs text-av-text-muted w-14">Ativo</span>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="av-outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === 0}
                          aria-label="Mover para cima"
                          onClick={() => badgesFA.move(index, index - 1)}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="av-outline"
                          size="icon"
                          className="h-8 w-8"
                          disabled={index === badgesFA.fields.length - 1}
                          aria-label="Mover para baixo"
                          onClick={() => badgesFA.move(index, index + 1)}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="av-outline"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          aria-label="Remover badge"
                          onClick={() => badgesFA.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ResponsiveAlignGroup
              control={form.control}
              title="Alinhamento do bloco de texto do hero (mobile / tablet / desktop)"
              paths={{
                mobile: 'home.hero.align.mobile',
                tablet: 'home.hero.align.tablet',
                desktop: 'home.hero.align.desktop',
              }}
            />
          </TabsContent>

          <TabsContent value="cases" className="space-y-6 mt-6">
            <div className="space-y-2 max-w-xl">
              <Label htmlFor="cases_eyebrow">Eyebrow (texto plano)</Label>
              <Input id="cases_eyebrow" {...form.register('home.cases.eyebrow')} />
            </div>

            <Controller
              control={form.control}
              name="home.cases.title_html"
              render={({ field }) => (
                <RichTextMini
                  key={`cases-title-${richEpoch}`}
                  label="Título (HTML)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <ResponsiveAlignGroup
              control={form.control}
              title="Alinhamento do bloco (mobile / tablet / desktop)"
              paths={{
                mobile: 'home.cases.align.mobile',
                tablet: 'home.cases.align.tablet',
                desktop: 'home.cases.align.desktop',
              }}
            />

            <ResponsiveSizeGroup
              control={form.control}
              title="Tamanho do eyebrow"
              paths={{
                mobile: 'home.cases.typography.eyebrow.mobile',
                tablet: 'home.cases.typography.eyebrow.tablet',
                desktop: 'home.cases.typography.eyebrow.desktop',
              }}
            />

            <ResponsiveSizeGroup
              control={form.control}
              title="Tamanho do título"
              paths={{
                mobile: 'home.cases.typography.title.mobile',
                tablet: 'home.cases.typography.title.tablet',
                desktop: 'home.cases.typography.title.desktop',
              }}
            />
          </TabsContent>

          <TabsContent value="header" className="space-y-4 mt-6 max-w-xl">
            <div className="space-y-2">
              <Label htmlFor="cta_label">Texto do botão (CTA)</Label>
              <Input id="cta_label" {...form.register('header.cta_label')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta_url">URL do CTA</Label>
              <Input id="cta_url" {...form.register('header.cta_url')} placeholder="#" />
            </div>
          </TabsContent>

          <TabsContent value="footer" className="space-y-8 mt-6">
            <div className="flex flex-col gap-4 rounded-lg border border-av-border bg-av-surface p-4 max-w-xl">
              <p className="text-sm font-medium text-av-text">Colunas do rodapé</p>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="show_menu">Mostrar coluna Menu</Label>
                <Switch
                  id="show_menu"
                  checked={form.watch('footer.show_menu_section')}
                  onCheckedChange={(c) => form.setValue('footer.show_menu_section', c, { shouldDirty: true })}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="show_contact">Mostrar coluna Contato</Label>
                <Switch
                  id="show_contact"
                  checked={form.watch('footer.show_contact_section')}
                  onCheckedChange={(c) => form.setValue('footer.show_contact_section', c, { shouldDirty: true })}
                />
              </div>
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="show_social">Mostrar coluna Redes</Label>
                <Switch
                  id="show_social"
                  checked={form.watch('footer.show_social_section')}
                  onCheckedChange={(c) => form.setValue('footer.show_social_section', c, { shouldDirty: true })}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border border-av-border bg-av-bg/50 p-4">
              <p className="text-sm font-medium text-av-text">Alinhamento no rodapé</p>
              <p className="text-xs text-av-text-muted">
                Cada bloco tem alinhamento próprio (logo + slogan, badges, colunas e barra inferior).
              </p>
              <ResponsiveAlignGroup
                control={form.control}
                title="Logo + slogan"
                paths={{
                  mobile: 'footer.section_alignments.slogan.mobile',
                  tablet: 'footer.section_alignments.slogan.tablet',
                  desktop: 'footer.section_alignments.slogan.desktop',
                }}
              />
              <ResponsiveAlignGroup
                control={form.control}
                title="Faixa de badges"
                paths={{
                  mobile: 'footer.section_alignments.badges.mobile',
                  tablet: 'footer.section_alignments.badges.tablet',
                  desktop: 'footer.section_alignments.badges.desktop',
                }}
              />
              <ResponsiveAlignGroup
                control={form.control}
                title="Coluna Menu"
                paths={{
                  mobile: 'footer.section_alignments.menu.mobile',
                  tablet: 'footer.section_alignments.menu.tablet',
                  desktop: 'footer.section_alignments.menu.desktop',
                }}
              />
              <ResponsiveAlignGroup
                control={form.control}
                title="Coluna Contato"
                paths={{
                  mobile: 'footer.section_alignments.contact.mobile',
                  tablet: 'footer.section_alignments.contact.tablet',
                  desktop: 'footer.section_alignments.contact.desktop',
                }}
              />
              <ResponsiveAlignGroup
                control={form.control}
                title="Coluna Redes"
                paths={{
                  mobile: 'footer.section_alignments.social.mobile',
                  tablet: 'footer.section_alignments.social.tablet',
                  desktop: 'footer.section_alignments.social.desktop',
                }}
              />
              <ResponsiveAlignGroup
                control={form.control}
                title="Barra inferior (copyright + links legais)"
                paths={{
                  mobile: 'footer.section_alignments.bottom.mobile',
                  tablet: 'footer.section_alignments.bottom.tablet',
                  desktop: 'footer.section_alignments.bottom.desktop',
                }}
              />
            </div>

            <Controller
              control={form.control}
              name="footer.slogan_html"
              render={({ field }) => (
                <RichTextMini
                  key={`slogan-${richEpoch}`}
                  label="Slogan (HTML)"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <ResponsiveSizeGroup
              control={form.control}
              title="Tamanho do texto do slogan"
              paths={{
                mobile: 'footer.slogan_typography.mobile',
                tablet: 'footer.slogan_typography.tablet',
                desktop: 'footer.slogan_typography.desktop',
              }}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Badges do rodapé</Label>
                <Button
                  type="button"
                  variant="av-outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => footerBadgesFA.append({ label: 'Novo badge', enabled: true })}
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              {footerBadgesFA.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-av-border bg-av-surface p-3"
                >
                  <Input
                    className="flex-1"
                    {...form.register(`footer.badges.${index}.label` as const)}
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={form.watch(`footer.badges.${index}.enabled`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.badges.${index}.enabled`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <span className="text-xs text-av-text-muted w-14">Ativo</span>
                    <Button
                      type="button"
                      variant="av-outline"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      aria-label="Remover badge"
                      onClick={() => footerBadgesFA.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <ResponsiveSizeGroup
              control={form.control}
              title="Tamanho do texto das badges do rodapé"
              paths={{
                mobile: 'footer.badges_typography.mobile',
                tablet: 'footer.badges_typography.tablet',
                desktop: 'footer.badges_typography.desktop',
              }}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Links do menu</Label>
                <Button
                  type="button"
                  variant="av-outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    menuFA.append({ label: 'Novo', href: '#', enabled: true, openInNewTab: false })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              {menuFA.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto] items-end rounded-lg border border-av-border bg-av-surface p-3"
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input {...form.register(`footer.menu_links.${index}.label` as const)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Href</Label>
                    <Input {...form.register(`footer.menu_links.${index}.href` as const)} />
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <span className="text-xs text-av-text-muted">Nova guia</span>
                    <Switch
                      checked={form.watch(`footer.menu_links.${index}.openInNewTab`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.menu_links.${index}.openInNewTab`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <Switch
                      checked={form.watch(`footer.menu_links.${index}.enabled`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.menu_links.${index}.enabled`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="av-outline"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => menuFA.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="contact_email">E-mail de contato</Label>
                <Input id="contact_email" type="email" {...form.register('footer.contact_email')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Input id="location" {...form.register('footer.location')} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Redes sociais</Label>
                <Button
                  type="button"
                  variant="av-outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    socialFA.append({
                      platform: 'instagram',
                      label: 'Instagram',
                      url: '#',
                      enabled: true,
                      openInNewTab: false,
                    })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              {socialFA.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 md:grid-cols-[minmax(0,120px)_1fr_1fr_auto_auto_auto] items-end rounded-lg border border-av-border bg-av-surface p-3"
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Plataforma</Label>
                    <Controller
                      control={form.control}
                      name={`footer.social.${index}.platform`}
                      render={({ field: f }) => (
                        <Select value={f.value} onValueChange={f.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input {...form.register(`footer.social.${index}.label` as const)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input {...form.register(`footer.social.${index}.url` as const)} />
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <span className="text-xs text-av-text-muted">Nova guia</span>
                    <Switch
                      checked={form.watch(`footer.social.${index}.openInNewTab`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.social.${index}.openInNewTab`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <Switch
                      checked={form.watch(`footer.social.${index}.enabled`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.social.${index}.enabled`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="av-outline"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => socialFA.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 max-w-xl">
              <Label htmlFor="copyright">Copyright (texto)</Label>
              <Input id="copyright" {...form.register('footer.copyright')} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Label>Links legais</Label>
                <Button
                  type="button"
                  variant="av-outline"
                  size="sm"
                  className="gap-1"
                  onClick={() =>
                    legalFA.append({ label: 'Novo', href: '#', enabled: true, openInNewTab: false })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              {legalFA.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 md:grid-cols-[1fr_1fr_auto_auto_auto] items-end rounded-lg border border-av-border bg-av-surface p-3"
                >
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input {...form.register(`footer.legal_links.${index}.label` as const)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Href</Label>
                    <Input {...form.register(`footer.legal_links.${index}.href` as const)} />
                  </div>
                  <div className="flex flex-col gap-1 pb-1">
                    <span className="text-xs text-av-text-muted">Nova guia</span>
                    <Switch
                      checked={form.watch(`footer.legal_links.${index}.openInNewTab`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.legal_links.${index}.openInNewTab`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <Switch
                      checked={form.watch(`footer.legal_links.${index}.enabled`)}
                      onCheckedChange={(checked) =>
                        form.setValue(`footer.legal_links.${index}.enabled`, checked, {
                          shouldDirty: true,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="av-outline"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => legalFA.remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
