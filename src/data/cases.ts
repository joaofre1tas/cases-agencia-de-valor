export interface CaseData {
  id: string
  logo: string
  avatar: string
  title: string
  description: string
  metrics: { value: string; label: string }[]
  segment: string
}

export const cases: CaseData[] = [
  {
    id: 'roi-lab',
    logo: 'https://img.usecurling.com/i?q=roi+lab&shape=outline&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
    title: 'ROI Lab Digital: R$ 236.000 de Economia Anual com IA',
    description:
      'Como o ROI Lab Digital utilizou Inteligência Artificial para escalar operações e otimizar rotinas que antes consumiam horas da equipe.',
    metrics: [
      { value: 'R$ 236.000', label: 'Economia Gerada' },
      { value: '3', label: 'Contratações Evitadas' },
    ],
    segment: 'Marketing',
  },
  {
    id: 'orion',
    logo: 'https://img.usecurling.com/i?q=orion&shape=outline&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    title: 'ORION: R$ 1 Milhão/Ano em Economia com Internalizaçã...',
    description:
      'Como a ORION utilizou o desenvolvimento interno para consolidar processos e ferramentas, garantindo autonomia e economia.',
    metrics: [
      { value: 'R$ 1 Milhão/Ano', label: 'Economia Gerada' },
      { value: '100%', label: 'Operacional' },
    ],
    segment: 'Tecnologia',
  },
  {
    id: 'vize',
    logo: '', // We will show the placeholder
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
    title: 'Vize Imagem Masculina: Inovação com IA para...',
    description:
      'Como Vize Imagem Masculina inteligência artificial usada para automatizar processos e melhorar o faturamento mensal.',
    metrics: [
      { value: 'Economia de Custos', label: 'Potencial apenas' },
      { value: 'Maior Faturamento', label: 'Aumento previsto' },
    ],
    segment: 'Varejo',
  },
  {
    id: 'map',
    logo: 'https://img.usecurling.com/i?q=map&shape=fill&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
    title: 'MAP: Autonomia tecnológica e custos reduzidos com IA',
    description:
      'Como a MAP inteligência investida artificial para otimizar processos operacionais e eliminar custos recorrentes com software.',
    metrics: [
      { value: 'Autonomia Total', label: 'Operacional' },
      { value: 'Redução', label: 'Custos com Ferramentas' },
    ],
    segment: 'Tecnologia',
  },
  {
    id: 'cpto',
    logo: 'https://img.usecurling.com/i?q=connect&shape=fill&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5',
    title: 'CPTO Connect: R$ 2.500 de economia mensal com IA no...',
    description:
      'Como a CPTO Connect utilizou Inteligência Artificial para otimizar o setor de RH e ganhar agilidade nas contratações.',
    metrics: [
      { value: 'R$ 2.500', label: 'Economia Gerada' },
      { value: '31 dias', label: 'Tempo para 1º Resultado' },
    ],
    segment: 'RH',
  },
  {
    id: 'lacqua',
    logo: 'https://img.usecurling.com/i?q=lacqua&shape=outline&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=6',
    title: "Agência L'Acqua: Automação de Atendimento e Gestão...",
    description:
      'Como uma agência com 12 anos de mercado transformou gargalos operacionais em processos fluídos e automáticos.',
    metrics: [
      { value: '+60%', label: 'Eficiência Operacional' },
      { value: '100%', label: 'Demandas Automatizadas' },
    ],
    segment: 'Marketing',
  },
  {
    id: 'casa-em-7',
    logo: 'https://img.usecurling.com/i?q=casa&shape=fill&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=7',
    title: 'Casa em 7: Plataforma criada em 3,5 meses e 90% de...',
    description:
      'De 20 meses de frustração com desenvolvedores a uma plataforma robusta criada em tempo recorde com redução de custos.',
    metrics: [
      { value: '90%', label: 'Economia Gerada' },
      { value: '10x menor investimento', label: 'Redução de Custo' },
    ],
    segment: 'Imobiliário',
  },
  {
    id: 'dexi',
    logo: 'https://img.usecurling.com/i?q=dexi&shape=outline&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=8',
    title: 'Dexi Digital: R$ 1,7 milhão em pipeline mapeado com IA',
    description:
      'Como a Dexi Digital utilizou a inteligência artificial do Viver de IA para escalar sua geração de leads B2B rapidamente.',
    metrics: [
      { value: 'R$ 1,7 milhão', label: 'Gasoduto Gerado' },
      { value: '1.230', label: 'Leads Processados' },
    ],
    segment: 'Marketing',
  },
  {
    id: 'amsf',
    logo: 'https://img.usecurling.com/i?q=advocacia&shape=outline&color=solid-black',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=9',
    title: 'AMSF Advocacia: Desenvolve CRM personalizado em tem...',
    description:
      'Como a AMSF Advocacia utilizou a mentoria Viver de IA para otimizar suas pré-vendas e customizar seu CRM jurídico.',
    metrics: [
      { value: 'Tempo Otimizado', label: 'Pré-vendas' },
      { value: '100%', label: 'CRM Personalizado' },
    ],
    segment: 'Jurídico',
  },
]
