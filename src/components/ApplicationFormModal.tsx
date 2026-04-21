import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useApplicationModal } from '@/contexts/ApplicationModalContext'

const applicationSchema = z.object({
  primeiro_nome: z.string().trim().min(1, 'Informe o primeiro nome'),
  ultimo_nome: z.string().trim().min(1, 'Informe o último nome'),
  email: z.string().trim().email('Informe um e-mail válido'),
  whatsapp: z
    .string()
    .min(1, 'Informe o WhatsApp')
    .refine((val) => val.replace(/\D/g, '').length === 11, 'Informe DDD + 9 dígitos'),
  instagram: z.string().trim().min(1, 'Informe seu @ no Instagram'),
  faturamento: z.string().min(1, 'Selecione uma opção'),
  socios: z.string().min(1, 'Selecione uma opção'),
  tamanho_time: z.string().min(1, 'Selecione uma opção'),
  maior_desafio: z.string().min(1, 'Selecione uma opção'),
  quando_resolver: z.string().min(1, 'Selecione uma opção'),
})

type ApplicationFormValues = z.infer<typeof applicationSchema>

const INITIAL_VALUES: ApplicationFormValues = {
  primeiro_nome: '',
  ultimo_nome: '',
  email: '',
  whatsapp: '',
  instagram: '',
  faturamento: '',
  socios: '',
  tamanho_time: '',
  maior_desafio: '',
  quando_resolver: '',
}

const FATURAMENTO_OPTIONS = [
  'Não tenho faturamento/renda',
  'De R$ 1.000 a R$5.000 por mês',
  'De R$ 5.001 a R$10.000 por mês',
  'De R$ 10.001 a R$15.000 por mês',
  'De R$ 15.001 a R$50.000 por mês',
  'De R$ 50.001 a R$100.000 por mês',
  'Mais de R$100.000 por mês',
]

const SOCIOS_OPTIONS = ['Sou somente eu', 'Sou eu e 1 sócio', 'Mais de 1 sócio']

const TAMANHO_TIME_OPTIONS = [
  'Sou somente eu',
  '1 a 4 pessoas no time',
  '5 a 10 pessoas no time',
  '11 a 20 pessoas no time',
  '+ de 20 pessoas no time',
]

const MAIOR_DESAFIO_OPTIONS = [
  'Prospectar meus clientes',
  'Cobrar um valor justo',
  'Manter os clientes que tenho',
  'Ter receita recorrente',
  'Escalar meu faturamento',
  'Criar meu time e sair da operação',
  'Todos os itens acima',
]

const QUANDO_RESOLVER_OPTIONS = [
  'Imediatamente, preciso de ajuda',
  'Em semanas, estou avaliando',
  'No próximo mês, sem pressa',
]

type Step = 1 | 2

function formatWhatsAppBR(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function ApplicationFormModal() {
  const navigate = useNavigate()
  const { open, setOpen, closeApplicationModal } = useApplicationModal()
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: INITIAL_VALUES,
  })

  const progressLabel = step === 1 ? '50%' : '100%'
  const progressWidth = step === 1 ? '50%' : '100%'

  const selectFields = [
    { name: 'faturamento' as const, placeholder: 'Qual seu faturamento?', options: FATURAMENTO_OPTIONS },
    { name: 'socios' as const, placeholder: 'Tem sócios na agência?', options: SOCIOS_OPTIONS },
    { name: 'tamanho_time' as const, placeholder: 'Qual tamanho do time?', options: TAMANHO_TIME_OPTIONS },
    { name: 'maior_desafio' as const, placeholder: 'Qual seu maior desafio?', options: MAIOR_DESAFIO_OPTIONS },
    { name: 'quando_resolver' as const, placeholder: 'Quando quer resolver?', options: QUANDO_RESOLVER_OPTIONS },
  ]

  useEffect(() => {
    if (!open) {
      setStep(1)
      setIsSubmitting(false)
      form.reset(INITIAL_VALUES)
    }
  }, [open, form])

  const handleContinue = async () => {
    const valid = await form.trigger(['primeiro_nome', 'ultimo_nome', 'email', 'whatsapp', 'instagram'])
    if (valid) setStep(2)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const payload = {
        ...values,
        whatsapp: values.whatsapp.replace(/\D/g, ''),
        meta: {
          origem: 'cases-agencia-de-valor',
          page_url: window.location.href,
          submitted_at: new Date().toISOString(),
          fbclid: params.get('fbclid'),
          gclid: params.get('gclid'),
        },
      }

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let description = 'Tente novamente em instantes.'
        try {
          const data = (await response.json()) as { error?: string }
          if (data.error) description = data.error
        } catch {
          /* ignore */
        }
        toast({
          title: 'Não foi possível enviar',
          description,
          variant: 'destructive',
        })
        return
      }

      closeApplicationModal()
      navigate('/confirma', { replace: true })
    } catch {
      toast({
        title: 'Não foi possível enviar',
        description: 'Tente novamente em instantes.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-av-border bg-av-bg p-0 text-av-text shadow-[0_30px_80px_rgba(0,0,0,0.65)] max-w-[520px] overflow-hidden [&>button]:right-5 [&>button]:top-5 [&>button]:text-av-text-secondary [&>button]:opacity-90 [&>button:hover]:opacity-100">
        <DialogTitle className="sr-only">Formulário de aplicação</DialogTitle>
        <DialogDescription className="sr-only">
          Formulário em duas etapas para aplicação na mentoria.
        </DialogDescription>

        <div className="relative bg-gradient-to-b from-av-surface to-av-bg px-8 py-8 sm:px-10">
          <div className="relative z-10">
            <div className="mb-4 flex justify-center">
              <Logo variant="full" className="h-12 w-auto sm:h-14" />
            </div>
            <p className="mx-auto max-w-[420px] text-center text-[17px] leading-snug text-av-text-secondary sm:text-[18px]">
              Envie sua aplicação e{' '}
              <span className="text-gradient-av font-semibold">meu time entra em contato para agendar</span>{' '}
              sua apresentação da mentoria.
            </p>

          <div className="mt-6 h-5 w-full rounded-md bg-av-surface-2">
            <div
              className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-[#f5a20b] to-[#e87120] pr-3 text-sm font-bold text-black"
              style={{ width: progressWidth }}
            >
              {progressLabel}
            </div>
          </div>

          <form className="mt-5 space-y-3" onSubmit={handleSubmit} noValidate>
            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      {...form.register('primeiro_nome')}
                      required
                      placeholder="Primeiro Nome:"
                      className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text placeholder:text-av-text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {form.formState.errors.primeiro_nome ? (
                      <p className="mt-1 text-xs text-red-300">{form.formState.errors.primeiro_nome.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <Input
                      {...form.register('ultimo_nome')}
                      required
                      placeholder="Último Nome:"
                      className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text placeholder:text-av-text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {form.formState.errors.ultimo_nome ? (
                      <p className="mt-1 text-xs text-red-300">{form.formState.errors.ultimo_nome.message}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Input
                    {...form.register('email')}
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Melhor E-mail:"
                    className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text placeholder:text-av-text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {form.formState.errors.email ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>

                <div>
                  <Controller
                    name="whatsapp"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        required
                        inputMode="numeric"
                        autoComplete="tel-national"
                        placeholder="WhatsApp com DDD:"
                        onChange={(e) => field.onChange(formatWhatsAppBR(e.target.value))}
                        className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text placeholder:text-av-text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    )}
                  />
                  {form.formState.errors.whatsapp ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.whatsapp.message}</p>
                  ) : null}
                </div>

                <div>
                  <Input
                    {...form.register('instagram')}
                    required
                    autoComplete="username"
                    placeholder="Qual seu @ no Instagram?"
                    className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text placeholder:text-av-text-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {form.formState.errors.instagram ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.instagram.message}</p>
                  ) : null}
                </div>

                <div className="flex justify-center pt-1">
                  <Button
                    type="button"
                    variant="av"
                    onClick={handleContinue}
                    className="btn-av--lift h-12 px-6 text-base font-semibold uppercase tracking-wide"
                  >
                    CONTINUAR
                  </Button>
                </div>
              </>
            ) : (
              <>
                {selectFields.map((field) => (
                  <div key={field.name}>
                    <Controller
                      name={field.name}
                      control={form.control}
                      render={({ field: controllerField }) => (
                        <Select value={controllerField.value} onValueChange={controllerField.onChange}>
                          <SelectTrigger
                            className="application-form-control h-12 rounded-md border border-av-border bg-av-surface text-base text-av-text focus:ring-0 focus:ring-offset-0"
                            aria-required
                          >
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="border-av-border bg-av-surface text-av-text">
                            {field.options.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="text-base focus:bg-av-surface-2 focus:text-av-text"
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors[field.name] ? (
                      <p className="mt-1 text-xs text-red-300">{form.formState.errors[field.name]?.message}</p>
                    ) : null}
                  </div>
                ))}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep(1)}
                    className="h-12 bg-gradient-to-r from-[#b85f22] to-[#df7327] text-lg font-semibold text-white hover:opacity-95"
                    disabled={isSubmitting}
                  >
                    VOLTAR
                  </Button>
                  <Button
                    type="submit"
                    className="h-12 gap-2 bg-gradient-to-r from-[#f5a20b] to-[#e87120] text-lg font-semibold text-white hover:opacity-95"
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {isSubmitting ? 'ENVIANDO...' : 'APLICAR'}
                  </Button>
                </div>
              </>
            )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
