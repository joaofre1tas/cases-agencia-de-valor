import { useEffect, useState } from 'react'
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
  whatsapp: z.string().trim().min(8, 'Informe um WhatsApp válido'),
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

export function ApplicationFormModal() {
  const { open, setOpen, closeApplicationModal } = useApplicationModal()
  const [step, setStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const webhookUrl = import.meta.env.VITE_MAKE_APPLICATION_WEBHOOK_URL as string | undefined

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
    if (!webhookUrl) {
      toast({
        title: 'Webhook não configurado',
        description: 'Defina VITE_MAKE_APPLICATION_WEBHOOK_URL para enviar as aplicações.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const params = new URLSearchParams(window.location.search)
      const payload = {
        ...values,
        meta: {
          origem: 'cases-agencia-de-valor',
          page_url: window.location.href,
          submitted_at: new Date().toISOString(),
          fbclid: params.get('fbclid'),
          gclid: params.get('gclid'),
        },
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Falha ao enviar aplicação')
      }

      toast({
        title: 'Aplicação enviada',
        description: 'Recebemos seus dados e nosso time vai entrar em contato.',
      })
      closeApplicationModal()
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
      <DialogContent className="border-av-orange/80 bg-av-bg/95 p-0 text-av-text shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-sm max-w-[520px] overflow-hidden [&>button]:right-5 [&>button]:top-5 [&>button]:text-white [&>button]:opacity-90 [&>button:hover]:opacity-100">
        <DialogTitle className="sr-only">Formulário de aplicação</DialogTitle>
        <DialogDescription className="sr-only">
          Formulário em duas etapas para aplicação na mentoria.
        </DialogDescription>

        <div className="relative px-8 py-8 sm:px-10">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(5,10,18,0.86) 0%, rgba(5,10,18,0.95) 100%), url('/home/hero-bg.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,150,30,0.25),transparent_58%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(5,60,150,0.18),transparent_62%)]" />

          <div className="relative z-10">
            <div className="mb-5 flex justify-center">
              <Logo variant="full" className="h-20 w-auto sm:h-24" />
            </div>
            <p className="mx-auto max-w-[420px] text-center text-[17px] leading-snug text-av-text-secondary sm:text-[18px]">
              Envie sua aplicação e{' '}
              <span className="font-semibold text-av-orange">
                meu time entra em contato para agendar
              </span>{' '}
              sua apresentação da mentoria.
            </p>

          <div className="mt-6 h-5 w-full rounded-md bg-white/20">
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
                      placeholder="Primeiro Nome:"
                      className="h-12 border-av-border bg-[#1d1a2b] text-base text-white placeholder:text-white/60 focus-visible:ring-av-orange"
                    />
                    {form.formState.errors.primeiro_nome ? (
                      <p className="mt-1 text-xs text-red-300">{form.formState.errors.primeiro_nome.message}</p>
                    ) : null}
                  </div>
                  <div>
                    <Input
                      {...form.register('ultimo_nome')}
                      placeholder="Último Nome:"
                      className="h-12 border-av-border bg-[#1d1a2b] text-base text-white placeholder:text-white/60 focus-visible:ring-av-orange"
                    />
                    {form.formState.errors.ultimo_nome ? (
                      <p className="mt-1 text-xs text-red-300">{form.formState.errors.ultimo_nome.message}</p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Input
                    {...form.register('email')}
                    placeholder="Melhor E-mail:"
                    className="h-12 border-av-border bg-[#1d1a2b] text-base text-white placeholder:text-white/60 focus-visible:ring-av-orange"
                  />
                  {form.formState.errors.email ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.email.message}</p>
                  ) : null}
                </div>

                <div>
                  <Input
                    {...form.register('whatsapp')}
                    placeholder="WhatsApp com DDD:"
                    className="h-12 border-av-border bg-[#1d1a2b] text-base text-white placeholder:text-white/60 focus-visible:ring-av-orange"
                  />
                  {form.formState.errors.whatsapp ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.whatsapp.message}</p>
                  ) : null}
                </div>

                <div>
                  <Input
                    {...form.register('instagram')}
                    placeholder="Qual seu @ no Instagram?"
                    className="h-12 border-av-border bg-[#1d1a2b] text-base text-white placeholder:text-white/60 focus-visible:ring-av-orange"
                  />
                  {form.formState.errors.instagram ? (
                    <p className="mt-1 text-xs text-red-300">{form.formState.errors.instagram.message}</p>
                  ) : null}
                </div>

                <Button
                  type="button"
                  onClick={handleContinue}
                  className="h-12 w-full bg-gradient-to-r from-[#f5a20b] to-[#e87120] text-lg font-semibold tracking-wide text-white hover:opacity-95"
                >
                  CONTINUAR
                </Button>
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
                          <SelectTrigger className="h-12 border-av-border bg-[#1d1a2b] text-base text-white focus:ring-av-orange">
                            <SelectValue placeholder={field.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="border-av-border bg-[#1d1a2b] text-white">
                            {field.options.map((option) => (
                              <SelectItem
                                key={option}
                                value={option}
                                className="text-base focus:bg-[#9ebde0] focus:text-[#0a1726]"
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
