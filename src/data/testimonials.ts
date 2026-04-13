export interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatarUrl: string
}

const rawQuotes = [
  {
    name: 'Lucas Ferreira',
    role: 'CEO',
    company: 'TechNova',
    content:
      'A Viver de IA nos ajudou a reestruturar nosso atendimento. Hoje, 80% dos chamados são resolvidos por agentes de IA com uma precisão incrível.',
    gender: 'male',
  },
  {
    name: 'Mariana Souza',
    role: 'Diretora de Marketing',
    company: 'Agência Criativa',
    content:
      'A formação me deu a base técnica que eu precisava para começar a construir soluções reais com IA. Dobramos nossa capacidade de entrega de campanhas.',
    gender: 'female',
  },
  {
    name: 'Roberto Almeida',
    role: 'Fundador',
    company: 'GrowthStart',
    content:
      'Implementar as estratégias aprendidas mudou completamente o jogo para nossa equipe. Reduzimos tarefas manuais em 70% na primeira semana.',
    gender: 'male',
  },
  {
    name: 'Camila Santos',
    role: 'Product Manager',
    company: 'InovaTech',
    content:
      'O conteúdo sobre automação com IA é de altíssimo nível. Conseguimos integrar IA diretamente no nosso produto principal em tempo recorde.',
    gender: 'female',
  },
  {
    name: 'Fernando Costa',
    role: 'Analista de Dados',
    company: 'DataSolutions',
    content:
      'A comunidade do Viver de IA é fantástica. As trocas de experiências me ajudaram a resolver problemas complexos de análise de dados com ChatGPT.',
    gender: 'male',
  },
  {
    name: 'Juliana Lima',
    role: 'Copywriter',
    company: 'Freelancer',
    content:
      'Minha produtividade explodiu. O que eu levava dias para escrever, hoje estruturo em horas usando os prompts avançados que aprendi.',
    gender: 'female',
  },
  {
    name: 'Tiago Ribeiro',
    role: 'CTO',
    company: 'FintechX',
    content:
      'Os módulos de construção de agentes autônomos são ouro puro. Reduzimos nosso custo de operação em 35% nos últimos três meses.',
    gender: 'male',
  },
  {
    name: 'Amanda Oliveira',
    role: 'Especialista em RH',
    company: 'TalentHub',
    content:
      'Automatizamos nosso processo de triagem de currículos usando IA. A precisão na seleção dos melhores candidatos aumentou drasticamente.',
    gender: 'female',
  },
  {
    name: 'Pedro Henrique',
    role: 'Desenvolvedor Full Stack',
    company: 'DevSoft',
    content:
      'Eu era cético sobre o uso de IA para programação, mas as mentorias me mostraram como usar copilot e agentes para acelerar meu código em 5x.',
    gender: 'male',
  },
  {
    name: 'Beatriz Martins',
    role: 'E-commerce Manager',
    company: 'ShopOnline',
    content:
      'Criamos descrições de produtos e campanhas de e-mail automatizadas. O ROI das nossas campanhas aumentou 120% desde a implementação.',
    gender: 'female',
  },
  {
    name: 'Gabriel Gomes',
    role: 'Consultor de Inovação',
    company: 'FutureConsult',
    content:
      'A visão estratégica que o curso proporciona sobre o mercado de IA não tem igual no Brasil. Essencial para qualquer consultor moderno.',
    gender: 'male',
  },
  {
    name: 'Larissa Alves',
    role: 'Designer Gráfico',
    company: 'Estúdio Lari',
    content:
      'Integrar Midjourney e outras ferramentas de geração de imagem no meu fluxo de trabalho me permitiu pegar o dobro de clientes.',
    gender: 'female',
  },
  {
    name: 'Ricardo Nogueira',
    role: 'COO',
    company: 'LogísticaBR',
    content:
      'A otimização de rotas e o atendimento ao cliente via IA transformaram nossa operação logística. Recomendo para todos os gestores.',
    gender: 'male',
  },
  {
    name: 'Sofia Mendes',
    role: 'Produtora de Conteúdo',
    company: 'Sofia Digital',
    content:
      'O curso de IA para criadores de conteúdo é simplesmente perfeito. Meus vídeos ganharam muito mais qualidade e alcance com os roteiros gerados.',
    gender: 'female',
  },
  {
    name: 'Matheus Carvalho',
    role: 'Sócio',
    company: 'Escritório Carvalho Adv',
    content:
      'Automatizamos a análise de contratos e jurisprudências. Nossos advogados agora têm tempo para focar na estratégia, não na papelada.',
    gender: 'male',
  },
  {
    name: 'Vitória Rocha',
    role: 'Analista Financeiro',
    company: 'Capital Invest',
    content:
      'Usar IA para prever tendências e analisar relatórios financeiros tem sido um divisor de águas na minha carreira e nos resultados do time.',
    gender: 'female',
  },
  {
    name: 'Lucas Mendes',
    role: 'Engenheiro de Machine Learning',
    company: 'AI Builders',
    content:
      'Mesmo já trabalhando com IA, os insights sobre a aplicação comercial e a criação de produtos baseados em LLMs foram valiosíssimos.',
    gender: 'male',
  },
  {
    name: 'Isabella Castro',
    role: 'Gerente de Vendas',
    company: 'Varejo Pro',
    content:
      'Treinamos um agente de IA com os conhecimentos da nossa melhor vendedora. As conversões no site fora do horário comercial cresceram 40%.',
    gender: 'female',
  },
  {
    name: 'Daniel Batista',
    role: 'Professor',
    company: 'EducaTech',
    content:
      'A personalização do ensino usando IA me permitiu criar planos de estudo individuais para cada um dos meus 200 alunos simultaneamente.',
    gender: 'male',
  },
  {
    name: 'Carolina Dias',
    role: 'Arquiteta',
    company: 'Dias Arquitetura',
    content:
      'A geração de conceitos arquitetônicos e renders iniciais com IA encurtou a fase de ideação de semanas para poucos dias.',
    gender: 'female',
  },
  {
    name: 'Marcelo Pinto',
    role: 'Especialista em SEO',
    company: 'RankMax',
    content:
      'Os frameworks de criação de conteúdo em escala usando IA mantendo a qualidade e originalidade me colocaram anos à frente da concorrência.',
    gender: 'male',
  },
  {
    name: 'Laura Teixeira',
    role: 'Coordenadora de Eventos',
    company: 'Eventos Prime',
    content:
      'Planejamento, cronogramas e comunicação com fornecedores: tudo isso agora é gerenciado com ajuda de agentes de IA configurados após o curso.',
    gender: 'female',
  },
  {
    name: 'André Silva',
    role: 'Especialista em Tráfego',
    company: 'AdsRocket',
    content:
      'A criação de variações de anúncios e a análise de métricas via ChatGPT Plus transformaram a forma como gerencio orçamentos milionários.',
    gender: 'male',
  },
  {
    name: 'Paula Fernandes',
    role: 'Médica Empreendedora',
    company: 'Clínica Saúde+',
    content:
      'Implementamos um assistente virtual para pré-triagem e agendamento que reduziu o tempo de espera dos pacientes em 60%.',
    gender: 'female',
  },
  {
    name: 'Rodrigo Moraes',
    role: 'Analista de Sistemas',
    company: 'GovTech Solutions',
    content:
      'A clareza com que o conteúdo técnico é passado permite que até pessoas não programadoras consigam implementar soluções robustas.',
    gender: 'male',
  },
  {
    name: 'Fernanda Lima',
    role: 'Diretora de Arte',
    company: 'Design & Co',
    content:
      'O fluxo de trabalho unindo criatividade humana e velocidade da IA trouxe resultados que nossos clientes estão considerando "mágicos".',
    gender: 'female',
  },
]

export const testimonials: Testimonial[] = rawQuotes.map((q, index) => ({
  id: index + 1,
  name: q.name,
  role: q.role,
  company: q.company,
  content: q.content,
  avatarUrl: `https://img.usecurling.com/ppl/thumbnail?gender=${q.gender}&seed=${index + 1}`,
}))
