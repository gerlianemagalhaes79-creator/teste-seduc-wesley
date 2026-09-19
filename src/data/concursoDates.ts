import { ConcursoStageDate } from "../types";

export interface ConcursoGeneralInfo {
  orgao: string;
  cargo: string;
  banca: string;
  vagasImediatas: number;
  vagasCR: number;
  vagasTotal: number;
  taxaInscricao: string;
  periodoInscricoes: string;
  periodoInscricoesCurto: string;
  dataProva: string;
  dataProvaCurto: string;
  escolaridade: string;
  remuneracaoBase: string;
}

export const CONCURSO_GENERAL_INFO: ConcursoGeneralInfo = {
  orgao: "SEDUC-CE (Secretaria da Educação do Estado do Ceará)",
  cargo: "Professor da Educação Básica - Ensino Médio",
  banca: "FUNECE / CEV-UECE",
  vagasImediatas: 2000,
  vagasCR: 1000,
  vagasTotal: 3000,
  taxaInscricao: "R$ 150,00",
  periodoInscricoes: "16 de setembro a 15 de outubro de 2026",
  periodoInscricoesCurto: "16/09 a 15/10/2026",
  dataProva: "22 de novembro de 2026",
  dataProvaCurto: "22/11/2026",
  escolaridade: "Nível Superior (Licenciatura Plena na Disciplina)",
  remuneracaoBase: "Piso Estadual do Magistério + Gratificação de Atividade Docente",
};

export interface ConcursoStageInfo {
  id: string;
  title: string;
  type: string;
  weight: string;
  description: string;
  requirements: string[];
  funeceTips: string;
}

export const SEDUC_CONCURSO_DATES: ConcursoStageDate[] = [
  {
    id: "stage-1",
    title: "Publicação do Edital de Abertura (2.000 Vagas + 1.000 CR)",
    date: "2026-08-01",
    formattedDate: "01/08/2026",
    description: "Divulgação do edital oficial pela banca FUNECE/CEV-UECE com a distribuição das 2.000 vagas imediatas e 1.000 para cadastro de reserva por CREDE/SEFOR.",
    status: "concluido",
    tipsForCandidate: "Faça o download do edital completo e imprima a tabela de conteúdos programáticos da sua disciplina.",
    funeceSpecifics: "A FUNECE/CEV-UECE adota bibliografia pedagógica clássica (Libâneo, Luckesi, Saviani e legislação estadual).",
    isImportantMilestone: true,
  },
  {
    id: "stage-2",
    title: "Período de Solicitação de Isenção da Taxa de R$ 150,00",
    date: "2026-08-10",
    formattedDate: "10/08 a 15/08/2026",
    description: "Prazo para candidatos doadores de sangue, estudantes de escola pública e hipossuficientes inscritos no CadÚnico solicitarem isenção do pagamento dos R$ 150,00.",
    status: "concluido",
    tipsForCandidate: "Envie toda a documentação comprobatória digitalizada sem rasuras.",
    funeceSpecifics: "A análise de isenção pela CEV-UECE é rigorosa com comprovantes de inscrição no CadÚnico.",
    isImportantMilestone: false,
  },
  {
    id: "stage-3",
    title: "Período Oficial de Inscrições Online",
    date: "2026-09-16",
    formattedDate: "16/09 a 15/10/2026",
    description: "Inscrições abertas no portal oficial da FUNECE (CEV/UECE). Taxa de inscrição: R$ 150,00. Seleção do cargo/disciplina e polo regional de prova.",
    status: "em_andamento",
    tipsForCandidate: "Efetue o pagamento da taxa de R$ 150,00 até a data de vencimento bancário e guarde o comprovante de pagamento e de confirmação de inscrição.",
    funeceSpecifics: "Atenção na escolha do polo de prova: não é permitida a alteração após a homologação das inscrições.",
    isImportantMilestone: true,
  },
  {
    id: "stage-4",
    title: "Divulgação do Cartão de Informação e Locais de Prova",
    date: "2026-11-10",
    formattedDate: "10/11/2026",
    description: "Disponibilização do local exato, sala e horário de abertura e fechamento dos portões pelo site da CEV/UECE.",
    status: "proximo",
    tipsForCandidate: "Visite o local de prova previamente para planejar tempo de deslocamento e estacionamento.",
    funeceSpecifics: "A CEV-UECE fecha os portões pontualmente às 08:00 no turno da manhã e 14:00 no turno da tarde.",
    isImportantMilestone: false,
  },
  {
    id: "stage-5",
    title: "Aplicação das Provas Objetiva e Discursiva",
    date: "2026-11-22",
    formattedDate: "22/11/2026 (DOMINGO)",
    description: "80 Questões de múltipla escolha (A, B, C, D) + Estudo de Caso Pedagógico / Discursiva. 30 Básicas (Português 8, Adm. Pública 8, Indicadores 6, Ed. Brasileira 8) + 50 Específicas.",
    status: "proximo",
    tipsForCandidate: "Leve caneta esferográfica de corpo transparente e tinta preta, documento oficial com foto e lanche leve.",
    funeceSpecifics: "Tempo total de prova: 4 horas e 30 minutos. Reserve 35 minutos finais exclusivamente para o cartão-resposta.",
    isImportantMilestone: true,
  },
  {
    id: "stage-6",
    title: "Divulgação do Gabarito Preliminar e Caderno de Provas",
    date: "2026-11-23",
    formattedDate: "23/11/2026 (a partir das 17h)",
    description: "Publicação do gabarito oficial preliminar e abertura da janela de recursos administrativos no portal da CEV-UECE.",
    status: "futuro",
    tipsForCandidate: "Confira seu rascunho de respostas e analise possíveis divergências de redação nas questões de Didática e Legislação.",
    funeceSpecifics: "O prazo recursal na FUNECE geralmente é de 48 horas úteis através de formulário online restrito.",
    isImportantMilestone: false,
  },
  {
    id: "stage-7",
    title: "Convocação para a Prova Prática / Didática (Plano de Aula)",
    date: "2026-12-15",
    formattedDate: "15/12/2026",
    description: "Sorteio de ponto com 24h de antecedência e apresentação de aula de 20 minutos perante banca examinadora da FUNECE.",
    status: "futuro",
    tipsForCandidate: "Prepare previamente modelos de planos de aula alinhados às competências do DCRC e BNCC.",
    funeceSpecifics: "A banca avalia clareza na exposição, domínio do conteúdo, uso do tempo e adequação metodológica.",
    isImportantMilestone: true,
  },
  {
    id: "stage-8",
    title: "Avaliação de Títulos e Experiência Docente",
    date: "2027-01-10",
    formattedDate: "10/01 a 15/01/2027",
    description: "Envio digital dos diplomas de Pós-graduação (Especialização, Mestrado, Doutorado) e certidões de tempo de serviço.",
    status: "futuro",
    tipsForCandidate: "Organize previamente os diplomas autenticados e o histórico escolar com a ata de defesa.",
    funeceSpecifics: "A pontuação de títulos tem caráter classificatório (não elimina o candidato).",
    isImportantMilestone: false,
  },
  {
    id: "stage-9",
    title: "Resultado Final e Homologação do Concurso SEDUC-CE",
    date: "2027-02-15",
    formattedDate: "15/02/2027",
    description: "Publicação da lista final de aprovados no Diário Oficial do Estado do Ceará (DOE) e início das convocações para posse das 2.000 vagas imediatas + 1.000 CR.",
    status: "futuro",
    tipsForCandidate: "Acompanhe as publicações no DOE e prepare os exames admissionais e documentação para posse.",
    funeceSpecifics: "A posse e lotação inicial respeitam a ordem de classificação por CREDE e disciplina.",
    isImportantMilestone: true,
  },
];

export const CONCURSO_DATES = SEDUC_CONCURSO_DATES;

export const CONCURSO_STAGES: ConcursoStageInfo[] = [
  {
    id: "stage-obj",
    title: "1ª Fase: Prova Objetiva de Múltipla Escolha",
    type: "Eliminatória e Classificatória",
    weight: "80 Questões (A, B, C, D) - 30 Básicas + 50 Específicas",
    description: "Composta por 30 questões de Conhecimentos Básicos (Português 8, Administração Pública 8, Dados e Indicadores Educacionais 6, Educação Brasileira/Pedagógicos 8) e 50 questões de Conhecimentos Específicos.",
    requirements: [
      "Pontuação mínima exigida nos módulos de Conhecimentos Básicos e Específicos",
      "Não zerar nenhuma das disciplinas básicas",
      "Duração máxima de 4h30min em conjunto com a prova discursiva",
    ],
    funeceTips: "A FUNECE pune o candidato desatento com enunciados que pedem 'a alternativa INCORRETA' ou 'EXCETO'. Atenção redobrada na leitura do comando!",
  },
  {
    id: "stage-disc",
    title: "2ª Fase: Prova Discursiva / Estudo de Caso",
    type: "Eliminatória e Classificatória",
    weight: "Estudo de Caso Pedagógico - 20 Pontos",
    description: "Elaboração de texto dissertativo-argumentativo ou resolução de uma situação-problema no ambiente escolar cearense.",
    requirements: [
      "Extensão de 20 a 30 linhas",
      "Fundamentação teórica em autores como Libâneo, Paulo Freire, Saviani ou Luckesi",
      "Respeito às diretrizes do DCRC e da Educação Inclusiva",
    ],
    funeceTips: "Cite expressamente a base legal (LDB, Estatuto do Magistério do CE) e conecte o problema à prática docente em sala de aula.",
  },
  {
    id: "stage-didat",
    title: "3ª Fase: Prova Prática de Didática (Aula)",
    type: "Eliminatória e Classificatória",
    weight: "Aula Presencial Gravada - 30 Pontos",
    description: "Apresentação de uma aula de 20 minutos sobre tema sorteado com 24 horas de antecedência, perante banca de 3 examinadores da FUNECE.",
    requirements: [
      "Entrega de 3 vias impressas do Plano de Aula detalhado",
      "Uso adequado do tempo (mínimo de 15 min e máximo de 20 min)",
      "Domínio conceitual, clareza didática e metodologia participativa",
    ],
    funeceTips: "Comece com a contextualização do tema e os objetivos de aprendizagem, desenvolva com clareza e reserve 3 minutos finais para a síntese e avaliação.",
  },
  {
    id: "stage-tit",
    title: "4ª Fase: Avaliação de Títulos",
    type: "Apenas Classificatória",
    weight: "Até 10 Pontos Adicionais",
    description: "Validação de certificados e diplomas de Pós-graduação Lato Sensu (Especialização) e Stricto Sensu (Mestrado e Doutorado), além de tempo de magistério.",
    requirements: [
      "Doutorado reconhecido pelo MEC/CAPES (4,0 pts)",
      "Mestrado reconhecido pelo MEC/CAPES (2,5 pts)",
      "Especialização com carga horária mínima de 360h (1,0 pt)",
      "Tempo de serviço comprovado em docência na educação básica (até 2,5 pts)",
    ],
    funeceTips: "Mesmo sem pós-graduação, um bom desempenho nas provas objetiva e prática garante as primeiras colocações.",
  },
];
