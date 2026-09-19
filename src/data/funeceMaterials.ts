import { PDFMaterial } from "../types";

export const INITIAL_PDF_MATERIALS: PDFMaterial[] = [
  {
    id: "mat-ldb-esquematizada",
    title: "LDB 9.394/1996 Esquematizada & Raio-X FUNECE",
    moduleId: "legislacao_educacional_ce",
    topic: "Legislação Educacional - Artigos Chave",
    estimatedReadTimeMinutes: 12,
    keyConcepts: [
      "Art. 3º: Princípios do ensino (pluralismo de ideias, gratuidade, valorização do profissional)",
      "Art. 12 x Art. 13: Incumbências da Escola (proposta pedagógica, articular com famílias) vs Incumbências do Professor (participar da elaboração, ministrar aulas, zelar pela aprendizagem)",
      "Art. 14: Gestão Democrática (Conselho Escolar e Projeto Pedagógico)",
      "Art. 24: 800 horas / 200 dias de efetivo trabalho escolar; Frequência mínima de 75%; Recuperação obrigatória",
      "Arts. 35 a 36-D: Finalidades do Ensino Médio e Formação Geral Básica (BNCC)",
    ],
    funeceProfile: "A FUNECE frequentemente troca os verbos entre o Art. 12 (estabelecimento) e o Art. 13 (docente). A escola 'administra seu pessoal e seus recursos materiais e financeiros', enquanto o professor 'elabora e cumpre plano de trabalho'. A banca adora enunciados com 'NÃO constitui incumbência docente'.",
    mnemonics: [
      {
        name: "Incumbências do Professor (Art. 13): P-E-M-E-Z-C",
        description: "Participar do PPP | Elaborar plano de trabalho | Ministrar dias letivos | Estabelecer estratégias de recuperação | Zelar pela aprendizagem | Colaborar com a comunidade.",
      },
      {
        name: "Regras da Educação Básica (Art. 24): 800/200/75",
        description: "800 horas mínimas anuais | 200 dias de efetivo trabalho escolar | 75% de frequência mínima exigida para aprovação.",
      },
    ],
    contentSections: [
      {
        heading: "1. Princípios Constitucionais e da LDB (Art. 3º)",
        body: "O ensino será ministrado com base em princípios como liberdade de aprender e ensinar; pluralismo de ideias e de concepções pedagógicas; coexistência de instituições públicas e privadas; gratuidade do ensino público em estabelecimentos oficiais; e garantia do direito à educação e à aprendizagem ao longo da vida.",
        highlight: "Atenção: A FUNECE costuma tentar incluir 'ensino religioso obrigatório e confessional', o que viola a laicidade do Estado e a matrícula facultativa do Art. 33.",
      },
      {
        heading: "2. Gestão Democrática na Rede Pública (Art. 14)",
        body: "A gestão democrática abrange obrigatoriamente duas dimensões: a participação dos profissionais da educação na elaboração do Projeto Político-Pedagógico (PPP) e a participação das comunidades escolar e local em conselhos escolares ou órgãos equivalentes.",
        highlight: "Dica de Ouro FUNECE: Conselho Escolar é instância consultiva e deliberativa, nunca meramente homologatória.",
      },
      {
        heading: "3. Ensino Médio e a BNCC (Arts. 35 e 36)",
        body: "O Ensino Médio é a etapa final da Educação Básica. Seus objetivos incluem o aprofundamento dos conhecimentos do EF, a preparação básica para o trabalho e a cidadania, o aprimoramento como pessoa humana (ética, autonomia intelectual) e a compreensão dos fundamentos científicos e tecnológicos.",
      },
    ],
    summaryTable: {
      headers: ["Artigo LDB", "Tema Central", "Pegadinha Típica da FUNECE"],
      rows: [
        ["Art. 12", "Incumbências da Escola", "Atribuir ao professor a administração de recursos financeiros da unidade."],
        ["Art. 13", "Incumbências do Professor", "Dizer que o professor pode recusar participação no projeto pedagógico."],
        ["Art. 24, V", "Verificação do Rendimento", "Afirmar que aspectos quantitativos prevalecem sobre os qualitativos (na verdade o qualitativo prevalece)."],
        ["Art. 3º", "Princípios", "Trocar 'gratuidade do ensino público' por 'cobrança de taxa de matrícula simbólica'."],
      ],
    },
    quickChecklist: [
      "Memorizar os 6 verbos do Art. 13 do docente",
      "Diferenciar carga horária (800h) e dias letivos (200)",
      "Revisar o percentual de frequência mínima (75%)",
      "Conferir as diretrizes de Educação Especial inclusiva (Art. 58 a 60)",
    ],
  },
  {
    id: "mat-didatica-funece",
    title: "Didática, Avaliação & Tendências Pedagógicas (Foco FUNECE)",
    moduleId: "educacao_brasileira_didatica",
    topic: "Teorias Pedagógicas e Avaliação Escolar",
    estimatedReadTimeMinutes: 15,
    keyConcepts: [
      "Quadro de Libâneo: Tendências Liberais (Tradicional, Renovada Progressivista, Renovada Não-Diretiva, Tecnicista)",
      "Tendências Progressistas: Libertadora (Paulo Freire), Libertária (autogestão) e Crítico-Social dos Conteúdos (Libâneo) / Histórico-Crítica (Saviani)",
      "Cipriano Luckesi: Avaliação diagnóstica, formativa e inclusiva vs Pedagogia do Exame",
      "Vygotsky: Mediação, Instrumentos/Signos, Zona de Desenvolvimento Proximal (ZDP) e Nível de Desenvolvimento Real vs Potencial",
      "Piaget: Assimilação, Acomodação, Equilibração e Estágios de Desenvolvimento (Sensório-motor, Pré-operatório, Operatório Concreto, Operatório Formal)",
    ],
    funeceProfile: "A CEV/UECE formula itens que descrevem a dinâmica de uma sala de aula e pedem para o candidato identificar qual a tendência pedagógica predominante. Autores cobrados com frequência: José Carlos Libâneo, Dermeval Saviani, Cipriano Luckesi e Celso Vasconcellos.",
    mnemonics: [
      {
        name: "Tendências Liberais vs Progressistas",
        description: "LIBERAIS (Adaptam o aluno à sociedade capitalista): Tradicional | Renovada Progressivista (Dewey) | Não-Diretiva (Rogers) | Tecnicista (Skinner). PROGRESSISTAS (Transformam a sociedade): Libertadora (Freire) | Libertária (Ferrer/Tragtenberg) | Crítico-Social (Libâneo) / Histórico-Crítica (Saviani).",
      },
      {
        name: "Tríade de Avaliação de Luckesi",
        description: "Diagnóstica (início/sondagem) -> Formativa (durante o processo/processual) -> Somativa (ao final/síntese). O foco da FUNECE é valorizar a diagnóstica e formativa.",
      },
    ],
    contentSections: [
      {
        heading: "1. As Tendências Pedagógicas no Brasil segundo Libâneo",
        body: "Na Pedagogia Tradicional, o professor é o centro do processo transmissor de conhecimentos imutáveis. Na Renovada, o aluno é o centro ativo da investigação. Na Crítico-Social dos Conteúdos, o saber sistematizado é apropriado criticamente pelo aluno para intervir na realidade social.",
        highlight: "Atenção: Na FUNECE, a tendência Crítico-Social NÃO nega os conteúdos científicos, ela os valoriza como instrumento de luta das classes populares!",
      },
      {
        heading: "2. Psicologia do Desenvolvimento: Vygotsky x Piaget",
        body: "Para Piaget, o desenvolvimento biológico e maturacional antecede e possibilita a aprendizagem. Para Vygotsky, o aprendizado impulsiona o desenvolvimento através das interações sociais e da mediação cultural no seio da ZDP (distância entre o que a criança faz sozinha e o que faz com ajuda).",
      },
      {
        heading: "3. Avaliação da Aprendizagem Escolar (Cipriano Luckesi)",
        body: "A avaliação não é um ato de julgar ou punir, mas um ato de diagnosticar para acolher e reorientar a rota de ensino. O erro não deve ser fonte de castigo, mas pista cognitiva de investigação para o professor planejar intervenções didáticas.",
      },
    ],
    summaryTable: {
      headers: ["Tendência Pedagógica", "Papel do Professor", "Papel dos Conteúdos", "Papel da Avaliação"],
      rows: [
        ["Tradicional", "Autoridade transmissora absoluta", "Verdades consagradas e imutáveis", "Classificatória, exames e notas"],
        ["Renovada Progressivista", "Facilitador do autoaprendizado", "Experiências e problemas práticos", "Autoavaliação e participação"],
        ["Tecnicista", "Administrador de módulos e técnicas", "Informações técnicas operacionais", "Mensuração de desempenho final"],
        ["Crítico-Social dos Conteúdos", "Mediador do saber crítico", "Culturais universais confrontados com a realidade", "Diagnóstica, formativa e inclusiva"],
      ],
    },
    quickChecklist: [
      "Distinguir Crítico-Social (Libâneo) de Libertadora (Paulo Freire)",
      "Revisar o conceito exato de ZDP em Vygotsky",
      "Relembrar a crítica de Luckesi à 'Pedagogia do Exame'",
      "Entender o PPP como processo coletivo (Veiga e Vasconcellos)",
    ],
  },
  {
    id: "mat-legislacao-ceara",
    title: "Estatuto do Magistério do Ceará & Estrutura da SEDUC-CE",
    moduleId: "legislacao_educacional_ce",
    topic: "Legislação Específica do Estado do Ceará",
    estimatedReadTimeMinutes: 10,
    keyConcepts: [
      "Lei Estadual nº 10.884/1984: Estatuto do Magistério Público Estadual do Ceará",
      "Regime de Trabalho: 20 horas ou 40 horas semanais, com reserva de 1/3 para atividades de planejamento e correção",
      "Estrutura Organizacional: SEDUC Sede (Fortaleza), 20 CREDEs (Coordenadorias Regionais de Desenvolvimento da Educação) no interior e SEFOR (Superintendência das Escolas Estaduais de Fortaleza)",
      "Modelo Pedagógico Cearense: EEMTIs (Escolas de Ensino Médio em Tempo Integral) e EEEPs (Escolas Estaduais de Educação Profissional)",
      "Plano Estadual de Educação do Ceará (PEE-CE) e DCRC",
    ],
    funeceProfile: "A banca CEV/UECE conhece profundamente a rede cearense. Ela costuma cobrar questões sobre a descentralização administrativa através das CREDEs/SEFOR e os direitos do professor (licença para capacitação, gratificações e estágio probatório).",
    mnemonics: [
      {
        name: "Estrutura Territorial SEDUC-CE: 20 CREDEs + SEFOR",
        description: "O interior do Estado é dividido em 20 CREDEs regionais (ex: Maracanaú, Itapipoca, Sobral, Tianguá, Juazeiro do Norte, Iguatu, Crateús, Russas, etc.) e a Capital conta com os polos da SEFOR.",
      },
    ],
    contentSections: [
      {
        heading: "1. Provimento e Carreira do Professor Estadual do Ceará",
        body: "O provimento no cargo efetivo de Professor da Educação Básica ocorre exclusivamente por concurso público de provas e títulos. O estágio probatório é de 3 anos de efetivo exercício, com avaliações periódicas de desempenho.",
        highlight: "Atenção: A progressão na carreira dar-se-á por qualificação profissional (titulação de Especialização, Mestrado e Doutorado) e por avaliação de desempenho.",
      },
      {
        heading: "2. Escolas de Tempo Integral e Ensino Profissionalizante no Ceará",
        body: "O Ceará é referência nacional na expansão do Ensino Médio em Tempo Integral. As EEMTIs e EEEPs trabalham com o conceito de Projeto de Vida, Tutoria Pedagógica, Clubes de Protagonismo Juvenil e Formação Cidadã e Técnica.",
      },
    ],
    quickChecklist: [
      "Fixar a composição da jornada (com 1/3 de hora-atividade)",
      "Lembrar a divisão territorial em 20 CREDEs e SEFOR",
      "Revisar os princípios do Plano Estadual de Educação do CE",
    ],
  },
  {
    id: "mat-bio-caatinga-genetica",
    title: "Biologia FUNECE: Ecologia da Caatinga, Fisiologia CAM & Genética",
    specialty: "biologia",
    moduleId: "conhecimentos_especificos",
    topic: "Biologia Específica para SEDUC Ceará",
    estimatedReadTimeMinutes: 14,
    keyConcepts: [
      "Adaptações Xerofíticas da Caatinga: Caducifólia, parênquima aquífero, folhas modificadas em espinhos, cutícula cerosa espessa, estômatos em criptas",
      "Metabolismo CAM (Crassulacean Acid Metabolism): Fixação noturna de CO2 pela PEP-carboxilase em malato nos vacúolos; descarboxilação diurna para RuBisCO com estômatos fechados",
      "Genética Mendeliana: 1ª Lei (Segregação dos Fatores 3:1), 2ª Lei (Segregação Independente 9:3:3:1)",
      "Interações Gênicas: Epistasia Dominante (12:3:1), Epistasia Recessiva (9:3:4), Herança Quantitativa/Poligênica (Curva de Gauss)",
      "Citologia: Fotossíntese (Fase Clara nos tilacoides e Fase Escura no estroma) vs Respiração Celular (Glicólise, Ciclo de Krebs e Cadeia Respiratória)",
    ],
    funeceProfile: "A FUNECE é extremamente detalhista em Bioquímica, Citologia e Fisiologia Vegetal voltada ao bioma Caatinga. Cobra enzimas específicas (PEP-carboxilase, RuBisCO, ATP-sintase) e proporções genéticas complexas.",
    mnemonics: [
      {
        name: "Plantas CAM da Caatinga: NOITE vs DIA",
        description: "NOITE (Estômatos ABERTOS): $CO_2$ + PEP -> Malato (PEP-carboxilase) -> Vacúolo. DIA (Estômatos FECHADOS): Malato -> $CO_2$ + RuBisCO (Ciclo de Calvin com Luz).",
      },
    ],
    contentSections: [
      {
        heading: "1. Adaptações ao Semiárido Cearense",
        body: "A Caatinga é um mosaico de florestas tropicais secas. Suas espécies vegetais (Mandacaru, Xique-xique, Juazeiro, Catingueira) exibem estratégias de resistência ao déficit hídrico: estivação foliar, raízes profundas ou em xilopódios subterrâneos de reserva nutritiva e hídrica.",
      },
      {
        heading: "2. Epistasia e Herança Não-Mendeliana",
        body: "Na epistasia, um gene inibe ou mascara a expressão de outro gene em loco distinto. Na epistasia dominante (ex: cor da plumagem em galinhas), a presença de um único alelo epistático 'I' anula a cor gerando a proporção 12:3:1.",
      },
    ],
    quickChecklist: [
      "Saber o papel exato do Malato no metabolismo CAM",
      "Revisar proporções fenotípicas de Di-hibridismo e Epistasia",
      "Revisar o ciclo do nitrogênio e bactérias fixadoras (Rhizobium)",
    ],
  },
];
