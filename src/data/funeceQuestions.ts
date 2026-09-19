import { Question } from "../types";

export const INITIAL_FUNECE_QUESTIONS: Question[] = [
  // 1. Didática - Libâneo / Tendências Pedagógicas (FUNECE SEDUC-CE)
  {
    id: "q-funece-did-01",
    discipline: "Didática e Educação Brasileira",
    topic: "Tendências Pedagógicas e Pensamento Educacional Brasileiro",
    subtopic: "1.2 Pedagogia Crítico-Social dos Conteúdos e Histórico-Crítica (Libâneo e Saviani)",
    statement: "No que concerne às tendências pedagógicas na prática escolar formuladas por José Carlos Libâneo, assinale a opção que descreve CORRETAMENTE a Tendência Progressista Crítico-Social dos Conteúdos:",
    options: [
      {
        id: "A",
        text: "Enfatiza a igualdade formal entre os alunos e prioriza a memorização de conteúdos prontos transmitidos pela autoridade do docente como verdade absoluta.",
      },
      {
        id: "B",
        text: "Sustenta que os conteúdos escolares devem ser confrontados criticamente com a realidade social dos educandos, servindo como instrumento de superação das contradições e de emancipação cultural.",
      },
      {
        id: "C",
        text: "Centra-se exclusivamente no aprender a aprender, valorizando o processo psicológico e as relações interpessoais em detrimento do domínio dos conteúdos sistematizados.",
      },
      {
        id: "D",
        text: "Organiza o processo de ensino com base na modelagem comportamental e na racionalidade técnica, visando à eficiência e à preparação direta para o mercado fabril.",
      },
    ],
    correctOptionId: "B",
    explanation: "Na tendência progressista crítico-social dos conteúdos (Libâneo), a escola pública cumpre sua função social quando garante a apropriação dos conteúdos científicos e culturais sistematizados articulados à prática social dos educandos. O saber universal é resignificado pela realidade concreta para promover a emancipação.",
    funeceInsight: "A banca FUNECE ama diferenciar as correntes Liberais (Tradicional = A; Renovada Não-Diretiva = C; Tecnicista = D) das Progressistas (B). Fique atento à palavra 'confronto com a realidade' e 'apropriação crítica do saber'.",
    legalOrAuthorReference: "LIBÂNEO, José Carlos. Democratização da Escola Pública: a pedagogia crítico-social dos conteúdos. São Paulo: Loyola.",
    difficulty: "Média",
    year: "2023",
    banca: "FUNECE",
  },

  // 2. Legislação - LDB / Gestão Democrática (FUNECE SEDUC-CE)
  {
    id: "q-funece-leg-01",
    discipline: "Didática e Educação Brasileira",
    topic: "LDBEN (Lei nº 9.394/1996) e Marcos Regulatórios",
    subtopic: "3.2 Gestão Democrática e Participação Comunitária (Arts. 14 e 15)",
    statement: "De acordo com o Art. 14 da Lei de Diretrizes e Bases da Educação Nacional (Lei nº 9.394/1996), os sistemas de ensino definirão as normas da gestão democrática do ensino público na educação básica, de acordo com as suas peculiaridades e conforme os seguintes princípios:",
    options: [
      {
        id: "A",
        text: "I - Participação dos profissionais da educação na elaboração do projeto pedagógico da escola; II - Participação das comunidades escolar e local em conselhos escolares ou equivalentes.",
      },
      {
        id: "B",
        text: "I - Indicação exclusiva e discricionária dos diretores pelo poder executivo municipal e estadual; II - Padronização curricular sem interferência de órgãos colegiados.",
      },
      {
        id: "C",
        text: "I - Centralização administrativa na figura do gestor financeiro; II - Restrição da presença de pais e responsáveis nas deliberações pedagógicas.",
      },
      {
        id: "D",
        text: "I - Elaboração do regimento escolar sob sigilo técnico; II - Avaliação somativa com objetivo de exclusão dos discentes com baixo rendimento.",
      },
    ],
    correctOptionId: "A",
    explanation: "O Art. 14 da LDB é literal: 'I - participação dos profissionais da educação na elaboração do projeto pedagógico da escola; II - participação das comunidades escolar e local em conselhos escolares ou equivalentes'.",
    funeceInsight: "A CEV-UECE / FUNECE adora cobrar a literalidade dos Arts. 12, 13 e 14 da LDB. Se a alternativa mencionar qualquer forma de centralização, sigilo ou exclusão de pais e comunidade, elimine imediatamente!",
    legalOrAuthorReference: "Lei nº 9.394/1996 (LDB), Art. 14, incisos I e II.",
    difficulty: "Fácil",
    year: "2022",
    banca: "FUNECE",
  },

  // 3. Avaliação da Aprendizagem - Cipriano Luckesi (FUNECE SEDUC-CE)
  {
    id: "q-funece-did-02",
    discipline: "Didática e Educação Brasileira",
    topic: "Avaliação da Aprendizagem Escolar",
    subtopic: "6.1 Avaliação Diagnóstica, Formativa e Somativa",
    statement: "Segundo Cipriano Carlos Luckesi, a prática avaliativa predominante na escola brasileira historicamente tem se configurado como uma 'pedagogia do exame'. Em contraposição a essa visão seletiva e excludente, a avaliação autêntica da aprendizagem deve ser compreendida como:",
    options: [
      {
        id: "A",
        text: "Um instrumento meramente classificatório e hierarquizador que premia os alunos com melhores notas e descarta os demais.",
      },
      {
        id: "B",
        text: "Um ato diagnóstico, acolhedor e inclusivo que busca identificar a situação atual da aprendizagem para reorientar a ação pedagógica em direção ao sucesso de todos.",
      },
      {
        id: "C",
        text: "Uma testagem quantitativa padronizada aplicada unicamente ao final do período letivo com fins punitivos.",
      },
      {
        id: "D",
        text: "Uma atividade burocrática destinada a preencher os registros oficiais da secretaria de educação sem reflexão do corpo docente.",
      },
    ],
    correctOptionId: "B",
    explanation: "Luckesi define a avaliação da aprendizagem como um 'ato amoroso e acolhedor'. Ela é essencialmente diagnóstica e tem a função de inclusão e dinamização da aprendizagem, diferenciando-se radicalmente dos exames que são classificatórios e pontuais.",
    funeceInsight: "Memorize a tríade de Luckesi: Avaliação é Diagnóstica, Inclusiva e Dinâmica (para a decisão de intervenção). Se tiver 'classificação', 'punição' ou 'exame', é a visão que Luckesi critica.",
    legalOrAuthorReference: "LUCKESI, Cipriano Carlos. Avaliação da Aprendizagem Escolar. São Paulo: Cortez.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 4. Legislação do Ceará - Estatuto dos Funcionários Públicos (Lei nº 9.826/74 e 10.884/84)
  {
    id: "q-funece-leg-02",
    discipline: "Legislação Educacional do CE",
    topic: "Estatuto dos Servidores Públicos Civis do Estado do Ceará (Lei nº 9.826/74)",
    subtopic: "1.1 Formas de Provimento e Vacância no Ceará",
    statement: "No que tange à carreira do Magistério Público Estadual do Ceará e às disposições do Estatuto dos Servidores Públicos do Ceará (Lei Estadual nº 9.826/1974) e normas de magistério, assinale a afirmação CORRETA:",
    options: [
      {
        id: "A",
        text: "A progressão horizontal e vertical no plano de carreira dos professores da SEDUC-CE é concedida exclusivamente por critério de idade, sendo vedada a contagem de cursos de especialização, mestrado ou doutorado.",
      },
      {
        id: "B",
        text: "O provimento originário no cargo efetivo de Professor da Educação Básica depende impreterivelmente de aprovação prévia em concurso público de provas e títulos.",
      },
      {
        id: "C",
        text: "Os professores efetivos da rede estadual do Ceará não possuem direito a afastamento remunerado para aperfeiçoamento acadêmico em nível de pós-graduação stricto sensu sob nenhuma hipótese.",
      },
      {
        id: "D",
        text: "A jornada de trabalho docente estadual é composta integralmente por horas em sala de aula com alunos, sendo proibida a reserva de percentual para horas de atividade extraclasse.",
      },
    ],
    correctOptionId: "B",
    explanation: "O ingresso no magistério público do Ceará ocorre por concurso de provas e títulos (CF/88 Art. 206, V e Estatuto Estadual). Além disso, a Lei do Piso e normas estaduais garantem 1/3 de hora-atividade, e há progressões por qualificação (titulação) e desempenho.",
    funeceInsight: "A FUNECE costuma inventar vedações inexistentes (como proibir pós-graduação ou negar hora-atividade). Lembre-se: o concurso SEDUC-CE é obrigatoriamente de PROVAS e TÍTULOS.",
    legalOrAuthorReference: "Lei Estadual nº 9.826/1974 e Lei Estadual nº 10.884/1984; Constituição Federal de 1988, Art. 206.",
    difficulty: "Média",
    year: "2022",
    banca: "CEV-UECE",
  },

  // 5. Língua Portuguesa - Regência e Crase (FUNECE)
  {
    id: "q-funece-port-01",
    discipline: "Língua Portuguesa",
    topic: "Crase e Regência Verbal e Nominal",
    subtopic: "10.1 Casos Proibidos, Obrigatórios e Facultativos de Crase",
    statement: "Assinale a opção em que o uso do acento grave indicativo da crase está EMPREGADO CORRETAMENTE segundo a norma culta da língua portuguesa:",
    options: [
      {
        id: "A",
        text: "O corpo docente da escola estadual dirigiu-se à secretaria de educação para protocolar o novo projeto de tutoria.",
      },
      {
        id: "B",
        text: "Os candidatos começaram à resolver as questões mais complexas da prova de concurso da SEDUC-CE.",
      },
      {
        id: "C",
        text: "O professor comunicou à todos os alunos que a feira de ciências da CREDE ocorreria no próximo mês.",
      },
      {
        id: "D",
        text: "O palestrante fez menção à uma obra clássica de Paulo Freire durante o seminário pedagógico.",
      },
    ],
    correctOptionId: "A",
    explanation: "Em 'A', 'dirigiu-se a' (rege preposição 'a') + 'a secretaria' (artigo feminino) = crase obrigatória ('à secretaria'). Nas outras opções a crase é proibida: antes de verbo ('resolver' em B), antes de pronome indefinido masculino/plural ('todos' em C) e antes de artigo indefinido ('uma' em D).",
    funeceInsight: "Clássico da FUNECE: colocar crase antes de verbo, antes de palavras masculinas ou antes de pronomes indefinidos/uma para tentar enganar o candidato distraído.",
    legalOrAuthorReference: "Gramática Normativa da Língua Portuguesa (Cegalla / Bechara).",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 6. Biologia Específica - Citologia & Fotossíntese (FUNECE SEDUC-CE)
  {
    id: "q-funece-bio-01",
    discipline: "Conhecimentos Específicos",
    topic: "Citologia e Biologia Celular",
    subtopic: "1.3 Bioenergética: Fotossíntese, Respiração Celular e Fermentação",
    specialty: "biologia",
    statement: "Na fotossíntese das plantas da Caatinga cearense com metabolismo ácido das crassuláceas (CAM), a fixação primária do dióxido de carbono ($CO_2$) ocorre durante a noite. Sobre os processos fotossintéticos e o ciclo de Calvin-Benson, assinale a opção CORRETA:",
    options: [
      {
        id: "A",
        text: "A enzima RuBisCO catalisa a fixação noturna do $CO_2$ nas plantas CAM diretamente no estroma mitocondrial com liberação de metano.",
      },
      {
        id: "B",
        text: "Durante a noite, os estômatos abrem-se e o $CO_2$ é fixado pela enzima Fosfoenolpiruvato Carboxilase (PEP-carboxilase), sendo armazenado nos vacúolos na forma de ácido málico (malato).",
      },
      {
        id: "C",
        text: "A fase fotoquímica (fase clara) ocorre no escuro total, dispensando a fotofosforilação acíclica e a quebra da molécula de água nos tilacoides.",
      },
      {
        id: "D",
        text: "As plantas CAM mantêm seus estômatos abertos durante o pico de insolação diurna para maximizar a absorção de luz solar e evitar a perda de vapor de água.",
      },
    ],
    correctOptionId: "B",
    explanation: "As plantas de metabolismo CAM (muito frequentes na vegetação semiárida da Caatinga cearense, como cactáceas e bromeliáceas) abrem os estômatos à noite para evitar perda hídrica. O $CO_2$ é fixado pela PEP-carboxilase em malato e estocado no vacúolo. De dia, os estômatos fecham e o malato é descarboxilado, liberando $CO_2$ para a RuBisCO realizar o ciclo de Calvin sob a luz solar.",
    funeceInsight: "A FUNECE frequentemente contextualiza a biologia vegetal com o bioma Caatinga e clima semiárido cearense. Lembre-se: PEP-carboxilase à noite -> ácido málico no vacúolo -> RuBisCO e luz de dia.",
    legalOrAuthorReference: "TAIZ, L.; ZEIGER, E. Fisiologia e Desenvolvimento Vegetal. 6. ed.",
    difficulty: "Pegadinha Clássica FUNECE",
    year: "2022",
    banca: "FUNECE",
  },

  // 7. Biologia Específica - Citologia & Membrana Plasmática
  {
    id: "q-funece-bio-01b",
    discipline: "Conhecimentos Específicos",
    topic: "Citologia e Biologia Celular",
    subtopic: "1.1 Membrana Plasmática e Mecanismos de Transporte Celular",
    specialty: "biologia",
    statement: "O modelo do mosaico fluido (Singer e Nicolson) descreve a membrana plasmática como uma bicamada fosfolipídica fluida com proteínas inseridas. A respeito dos transportes transmembranares, assinale a afirmação CORRETA:",
    options: [
      {
        id: "A",
        text: "A bomba de sódio-potássio ($Na^+/K^+$ ATPase) transporta 3 íons $Na^+$ para o meio extracelular e 2 íons $K^+$ para o meio intracelular contra seus gradientes eletroquímicos, com consumo direto de ATP.",
      },
      {
        id: "B",
        text: "A difusão facilitada ocorre contra o gradiente de concentração e requer hidrólise direta de moléculas de trifosfato de adenosina (ATP).",
      },
      {
        id: "C",
        text: "A osmose consiste no fluxo de solutos através de canais iônicos do meio hipertônico para o meio hipotônico sem movimentação de água.",
      },
      {
        id: "D",
        text: "O colesterol presente na membrana plasmática de células vegetais e bacterianas confere rigidez térmica e impermeabilidade absoluta à glicose.",
      },
    ],
    correctOptionId: "A",
    explanation: "A bomba de $Na^+/K^+$ é um transporte ativo primário fundamental: bombeia 3 $Na^+$ para fora e 2 $K^+$ para dentro com hidrólise de 1 ATP, gerando o potencial de repouso da membrana.",
    funeceInsight: "Mnemônico FUNECE: '3 Sai de Sódio (Na) e 2 Entra de Potássio (K)' -> 3 Na+ saem, 2 K+ entram.",
    legalOrAuthorReference: "ALBERTS, B. et al. Biologia Molecular da Célula. 6. ed.",
    difficulty: "Média",
    year: "2023",
    banca: "FUNECE",
  },

  // 8. Biologia Específica - Genética & Mendel (FUNECE)
  {
    id: "q-funece-bio-02",
    discipline: "Conhecimentos Específicos",
    topic: "Genética Clássica e Molecular",
    subtopic: "4.1 Leis de Mendel, Cruzamentos e Heredogramas",
    specialty: "biologia",
    statement: "Em um cruzamento entre dois indivíduos heterozigotos para dois pares de alelos com segregação independente ($AaBb \\times AaBb$), na ausência de epistasia ou ligação gênica, a proporção fenotípica esperada na descendência é:",
    options: [
      {
        id: "A",
        text: "9 : 3 : 3 : 1",
      },
      {
        id: "B",
        text: "1 : 2 : 1",
      },
      {
        id: "C",
        text: "12 : 3 : 1",
      },
      {
        id: "D",
        text: "9 : 7",
      },
    ],
    correctOptionId: "A",
    explanation: "Pela Segunda Lei de Mendel (Princípio da Segregação Independente), o di-hibridismo ($AaBb \\times AaBb$) gera a proporção fenotípica clássica de 9 duplamente dominantes (A_B_), 3 dominantes para o primeiro e recessivos para o segundo (A_bb), 3 recessivos para o primeiro e dominantes para o segundo (aaB_) e 1 duplamente recessivo (aabb).",
    funeceInsight: "Questão clássica de cálculo rápido de probabilidade genética. Não confunda com proporções modificadas por epistasia dominante (12:3:1) ou epistasia recessiva duplicada (9:7).",
    legalOrAuthorReference: "GRIFFITHS, A. J. F. et al. Introdução à Genética. Guanabara Koogan.",
    difficulty: "Fácil",
    year: "2023",
    banca: "CEV-UECE",
  },

  // 9. Biologia Específica - Ecologia da Caatinga (FUNECE)
  {
    id: "q-funece-bio-03",
    discipline: "Conhecimentos Específicos",
    topic: "Ecologia Geral e Biomas Brasileiros (com foco na Caatinga)",
    subtopic: "6.2 Bioma Caatinga: Adaptações Xerofíticas e Conservação",
    specialty: "biologia",
    statement: "A Caatinga é o único bioma exclusivamente brasileiro, cobrindo a quase totalidade do território cearense. Entre as adaptações morfológicas e fisiológicas típicas das plantas xerófitas da Caatinga para suportar o estresse hídrico, destaca-se:",
    options: [
      {
        id: "A",
        text: "Folhas largas e delgadas (latifoliadas) com cutícula extremamente fina para acelerar a taxa de evapotranspiração.",
      },
      {
        id: "B",
        text: "Presença de raízes tabulares superficiais sem tecidos de reserva e ausência total de espinhos ou acúleos.",
      },
      {
        id: "C",
        text: "Caducifólia (perda das folhas na estação seca), presença de cutícula espessa, estômatos em criptas e caules suculentos acumuladores de água (parênquima aquífero).",
      },
      {
        id: "D",
        text: "Abertura contínua dos estômatos durante as horas mais quentes do dia sem qualquer mecanismo regulatório.",
      },
    ],
    correctOptionId: "C",
    explanation: "A vegetação da Caatinga é adaptada à aridez (xerofitismo): caducifólia (queda de folhas para evitar transpiração excessiva), suculência (parênquima aquífero em cactos como mandacaru e xique-xique), folhas reduzidas em espinhos e cutícula cerosa espessa.",
    funeceInsight: "A banca FUNECE frequentemente valoriza o termo 'Caducifólia' e 'Parênquima Aquífero' nas provas de Biologia e Geografia do Ceará.",
    legalOrAuthorReference: "ODUM, Eugene P. Fundamentos de Ecologia.",
    difficulty: "Fácil",
    year: "2022",
    banca: "FUNECE",
  },

  // 10. Administração Pública - Princípios Constitucionais LIMPE
  {
    id: "q-funece-adm-01",
    discipline: "Administração Pública",
    topic: "Princípios Constitucionais da Administração Pública (Art. 37 da CF/88)",
    subtopic: "1.1 Princípios Expressos (LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência)",
    statement: "O artigo 37, caput, da Constituição Federal de 1988 estabelece os princípios expressos que regem a Administração Pública direta e indireta de qualquer dos Poderes da União, dos Estados, do Distrito Federal e dos Municípios. Em relação ao princípio da IMPESSOALIDADE, assinale a afirmativa CORRETA:",
    options: [
      {
        id: "A",
        text: "Veda que agentes públicos utilizem a publicidade oficial de obras, programas e serviços para promoção pessoal com nomes, símbolos ou imagens.",
      },
      {
        id: "B",
        text: "Autoriza o administrador público a conceder tratamento privilegiado a correligionários políticos em editais de licitação e concursos públicos.",
      },
      {
        id: "C",
        text: "Determina que os atos administrativos sejam praticados em segredo para resguardar a intimidade dos servidores envolvidos.",
      },
      {
        id: "D",
        text: "Exige que o servidor público atue exclusivamente de acordo com a sua moral subjetiva e convicções religiosas particulares.",
      },
    ],
    correctOptionId: "A",
    explanation: "O princípio da Impessoalidade (Art. 37, § 1º da CF/88) proíbe a promoção pessoal de autoridades em propaganda oficial e impõe a neutralidade e isonomia no tratamento dos administrados.",
    funeceInsight: "FUNECE adora cobrar a vedação à promoção pessoal prevista no § 1º do art. 37 como aplicação direta da Impessoalidade.",
    legalOrAuthorReference: "Constituição Federal de 1988, Art. 37, caput e § 1º.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 11. Indicadores Educacionais - SPAECE e SAEB
  {
    id: "q-funece-ind-01",
    discipline: "Indicadores Educacionais",
    topic: "Sistema de Avaliação da Educação Básica (SAEB) e SPAECE",
    subtopic: "2.1 Matrizes de Referência e Escala de Proficiência do SPAECE",
    statement: "O Sistema Permanente de Avaliação da Educação Básica do Ceará (SPAECE), desenvolvido pela SEDUC-CE com apoio técnico do CAEd/UFJF, organiza os resultados dos estudantes nas escalas de proficiência em Língua Portuguesa e Matemática. Sobre o SPAECE, assinale a opção CORRETA:",
    options: [
      {
        id: "A",
        text: "É uma avaliação censitária externa em larga escala que subsidia a premiação 'Escola Nota Dez' e o cálculo da cota-parte do ICMS Educacional no Ceará.",
      },
      {
        id: "B",
        text: "Trata-se de uma avaliação puramente amostral sem repercussão nas políticas públicas estaduais ou nos repasses financeiros municipais.",
      },
      {
        id: "C",
        text: "Avalia exclusivamente os alunos concluintes do Ensino Superior nas universidades estaduais cearenses (UECE, UVA e URCA).",
      },
      {
        id: "D",
        text: "Foi extinto em 2020 e substituído integralmente pelo modelo tradicional de notas bimestrais escolares.",
      },
    ],
    correctOptionId: "A",
    explanation: "O SPAECE é uma das marcas registradas da educação do Ceará: avaliação censitária diagnóstica anual que embasa o Prêmio Escola Nota Dez e a distribuição da cota-parte do ICMS entre os municípios com base na aprendizagem.",
    funeceInsight: "Item obrigatório para concursos da SEDUC Ceará! Lembre-se da articulação entre SPAECE, Prêmio Escola Nota Dez e ICMS Educacional.",
    legalOrAuthorReference: "Lei Estadual nº 14.025/2007 (ICMS Educação) e Portarias da SEDUC-CE.",
    difficulty: "Média",
    year: "2023",
    banca: "FUNECE",
  },

  // 12. Língua Portuguesa - Sintaxe do Período Composto
  {
    id: "q-funece-port-02",
    discipline: "Língua Portuguesa",
    topic: "Sintaxe do Período Composto por Coordenação e Subordinação",
    subtopic: "9.2 Orações Subordinadas Adverbiais e Conjunções Subordinativas",
    statement: "No período: 'Embora as diretrizes curriculares tenham sido atualizadas, os professores ainda enfrentam desafios na implementação do planejamento integrado', a oração destacada expressa relação sintático-semântica de:",
    options: [
      {
        id: "A",
        text: "Causa (Oração Subordinada Adverbial Causal)",
      },
      {
        id: "B",
        text: "Concessão (Oração Subordinada Adverbial Concessiva)",
      },
      {
        id: "C",
        text: "Condição (Oração Subordinada Adverbial Condicional)",
      },
      {
        id: "D",
        text: "Finalidade (Oração Subordinada Adverbial Final)",
      },
    ],
    correctOptionId: "B",
    explanation: "A conjunção subordinativa 'Embora' introduz uma oração subordinada adverbial concessiva, que expressa uma ressalva ou quebra de expectativa que não anula o fato principal.",
    funeceInsight: "A FUNECE adora orações concessivas ('embora', 'conquanto', 'ainda que', 'posto que', 'mesmo que'). Memorize o valor concessivo!",
    legalOrAuthorReference: "CUNHA, Celso; CINTRA, Lindley. Nova Gramática do Português Contemporâneo.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 13. Matemática Específica - Análise Combinatória (FUNECE)
  {
    id: "q-funece-mat-01",
    discipline: "Conhecimentos Específicos",
    topic: "Análise Combinatória e Probabilidade",
    subtopic: "1.1 Princípio Fundamental da Contagem, Permutação e Combinação",
    specialty: "matematica",
    statement: "Uma comissão de professores de uma Escola Estadual de Educação Profissional (EEEP) no Ceará será formada por 3 professores da área de Linguagens e 2 da área de Ciências da Natureza. Se estão disponíveis 6 professores de Linguagens e 5 de Ciências da Natureza, o número total de comissões distintas que podem ser formadas é:",
    options: [
      {
        id: "A",
        text: "200",
      },
      {
        id: "B",
        text: "150",
      },
      {
        id: "C",
        text: "120",
      },
      {
        id: "D",
        text: "60",
      },
    ],
    correctOptionId: "A",
    explanation: "Calculamos as combinações simples: $C(6, 3) = \\frac{6 \\times 5 \\times 4}{3 \\times 2 \\times 1} = 20$. Para Ciências da Natureza: $C(5, 2) = \\frac{5 \\times 4}{2 \\times 1} = 10$. Pelo Princípio Fundamental da Contagem: $20 \\times 10 = 200$.",
    funeceInsight: "A FUNECE costuma trazer problemas de contagem contextualizados com escolas estaduais, EEEPs ou CREDEs.",
    legalOrAuthorReference: "IEZZI, Gelson. Fundamentos de Matemática Elementar: Combinatória e Probabilidade.",
    difficulty: "Média",
    year: "2023",
    banca: "FUNECE",
  },

  // 15. Geografia Específica - Geografia do Ceará e Domínio Morfoclimático das Caatingas (FUNECE)
  {
    id: "q-funece-geo-01",
    discipline: "Conhecimentos Específicos",
    topic: "Geografia Física, Climatologia e Domínios Morfoclimáticos",
    subtopic: "1.1 Domínio das Caatingas e Semiárido Brasileiro",
    specialty: "geografia",
    statement: "Segundo Aziz Ab'Sáber, o Domínio Morfoclimático das Caatingas e Depressões Intermontanas é marcado por feições geomorfológicas e climáticas específicas. No território cearense, a dinâmica hídrica e os solos caracterizam-se por:",
    options: [
      {
        id: "A",
        text: "Solos rasos (litólicos e neossolos) sobre embasamento cristalino, drenagem temporária (rios intermitentes) e presença marcante de inselbergs nas depressões sertanejas.",
      },
      {
        id: "B",
        text: "Predomínio absoluto de latossolos profundos e lixiviados com rios perenes e volumosos em todo o Sertão Central.",
      },
      {
        id: "C",
        text: "Clima temperado úmido de altitude com chuvas orográficas distribuídas uniformemente ao longo dos doze meses do ano.",
      },
      {
        id: "D",
        text: "Ausência de processos de intemperismo físico e estabilidade térmica provocada pela corrente marinha fria das Malvinas.",
      },
    ],
    correctOptionId: "A",
    explanation: "O Ceará assenta-se majoritariamente sobre o embasamento cristalino pré-cambriano, o que condiciona solos rasos, rápida saturação e escoamento superficial (gerando rios intermitentes), intercalados por relevos residuais (inselbergs) nas superfícies aplainadas da depressão sertaneja.",
    funeceInsight: "A CEV-UECE / FUNECE cobra com muito rigor a geomorfologia do Ceará: embasamento cristalino, inselbergs, bacias sedimentares (Araripe e Apodi) e rios intermitentes.",
    legalOrAuthorReference: "AB'SÁBER, Aziz Nacib. Os Domínios de Natureza no Brasil. São Paulo: Ateliê Editorial.",
    difficulty: "Média",
    year: "2023",
    banca: "FUNECE",
  },

  // 16. Química Específica - Estequiometria e Termoquímica (FUNECE)
  {
    id: "q-funece-qui-01",
    discipline: "Conhecimentos Específicos",
    topic: "Estequiometria, Cinética e Termoquímica",
    subtopic: "2.1 Cálculos Estequiométricos e Leis Ponderais",
    specialty: "quimica",
    statement: "Na combustão completa do gás metano ($CH_4(g) + 2 O_2(g) \\rightarrow CO_2(g) + 2 H_2O(l)$), considerando massas molares em $g/mol$ (C = 12, H = 1, O = 16), a massa de gás carbônico ($CO_2$) produzida pela queima total de 32 g de metano com excesso de oxigênio é:",
    options: [
      {
        id: "A",
        text: "88 g",
      },
      {
        id: "B",
        text: "44 g",
      },
      {
        id: "C",
        text: "64 g",
      },
      {
        id: "D",
        text: "132 g",
      },
    ],
    correctOptionId: "A",
    explanation: "Massa molar do $CH_4 = 16\\text{ g/mol}$. Portanto, $32\\text{ g} = 2\\text{ mols}$ de $CH_4$. Pela estequiometria $1 : 1$, 2 mols de $CH_4$ produzem 2 mols de $CO_2$. Como $M(CO_2) = 44\\text{ g/mol}$, $2 \\times 44\\text{ g} = 88\\text{ g}$.",
    funeceInsight: "Cálculo direto e clássico da FUNECE. Atenção às massas molares e à proporção molar balanceada.",
    legalOrAuthorReference: "ATKINS, P.; JONES, L. Princípios de Química. Bookman.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 17. Física Específica - Mecânica e Leis de Newton (FUNECE)
  {
    id: "q-funece-fis-01",
    discipline: "Conhecimentos Específicos",
    topic: "Mecânica Clássica: Cinemática e Dinâmica Newtoniana",
    subtopic: "1.1 Leis de Newton e Conservação da Quantidade de Movimento",
    specialty: "fisica",
    statement: "Um bloco de massa $m = 4\\text{ kg}$ repousa sobre uma superfície horizontal sem atrito. Uma força horizontal constante de intensidade $F = 20\\text{ N}$ é aplicada sobre o bloco durante $t = 6\\text{ s}$. Desprezando a resistência do ar, a velocidade final do bloco e a distância percorrida ao final desse intervalo são, respectivamente:",
    options: [
      {
        id: "A",
        text: "$v = 30\\text{ m/s}$ e $d = 90\\text{ m}$",
      },
      {
        id: "B",
        text: "$v = 20\\text{ m/s}$ e $d = 60\\text{ m}$",
      },
      {
        id: "C",
        text: "$v = 5\\text{ m/s}$ e $d = 30\\text{ m}$",
      },
      {
        id: "D",
        text: "$v = 15\\text{ m/s}$ e $d = 45\\text{ m}$",
      },
    ],
    correctOptionId: "A",
    explanation: "Pela 2ª Lei de Newton: $a = \\frac{F}{m} = \\frac{20}{4} = 5\\text{ m/s}^2$. Partindo do repouso ($v_0 = 0$): $v = a \\times t = 5 \\times 6 = 30\\text{ m/s}$. Distância: $d = \\frac{1}{2} a t^2 = \\frac{1}{2} \\times 5 \\times 36 = 90\\text{ m}$.",
    funeceInsight: "A CEV/UECE cobra mecânica básica com enunciados limpos e aplicação direta das equações horárias do MUV.",
    legalOrAuthorReference: "HALLIDAY, D.; RESNICK, R.; WALKER, J. Fundamentos de Física: Mecânica.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },

  // 18. Sociologia Específica - Teoria Social Clássica (FUNECE)
  {
    id: "q-funece-soc-01",
    discipline: "Conhecimentos Específicos",
    topic: "Teoria Sociológica Clássica e Contemporânea",
    subtopic: "1.1 Fato Social, Ação Social e Materialismo Histórico",
    specialty: "sociologia",
    statement: "Em 'As Regras do Método Sociológico', Émile Durkheim define os 'fatos sociais' como o objeto precípuo da sociologia. Segundo o autor francês, os fatos sociais caracterizam-se fundamentalmente por três propriedades:",
    options: [
      {
        id: "A",
        text: "Coercitividade, exterioridade e generalidade.",
      },
      {
        id: "B",
        text: "Individualidade, voluntarismo e subjetividade.",
      },
      {
        id: "C",
        text: "Lucro, mais-valia e alienação do trabalho.",
      },
      {
        id: "D",
        text: "Racionalidade instrumental, carisma e dominação burocrática.",
      },
    ],
    correctOptionId: "A",
    explanation: "Para Durkheim, os fatos sociais existem fora das consciências individuais (exterioridade), exercem pressão imperativa sobre os indivíduos (coercitividade) e são comuns a todos os membros de uma sociedade (generalidade).",
    funeceInsight: "Questão clássica de memorização conceitual da FUNECE/UECE. Não confunda conceitos de Durkheim (fatos sociais) com Weber (ação social) ou Marx (luta de classes).",
    legalOrAuthorReference: "DURKHEIM, Émile. As Regras do Método Sociológico.",
    difficulty: "Fácil",
    year: "2022",
    banca: "FUNECE",
  },

  // 19. Filosofia Específica - Ética e Política (FUNECE)
  {
    id: "q-funece-fil-01",
    discipline: "Conhecimentos Específicos",
    topic: "História da Filosofia: Ética, Política e Teoria do Conhecimento",
    subtopic: "1.2 Filosofia Antiga: Sócrates, Platão e Aristóteles",
    specialty: "filosofia",
    statement: "Na obra 'Ética a Nicômaco', Aristóteles investiga a natureza do sumo bem humano e o conceito de *eudaimonia* (felicidade). Para o filósofo estagirita, a virtude ética (*areté*) define-se como:",
    options: [
      {
        id: "A",
        text: "Uma justa medida (meio-termo ou *mesótes*) entre dois vícios, um por excesso e outro por falta, adquirida pelo hábito e guiada pela reta razão (*phrónesis*).",
      },
      {
        id: "B",
        text: "Uma renúncia ascética absoluta a todos os prazeres sensíveis e materiais em prol da contemplação mística pura.",
      },
      {
        id: "C",
        text: "Uma obediência cega a imperativos categóricos incondicionais desvinculados de qualquer finalidade prática.",
      },
      {
        id: "D",
        text: "A busca desenfreada pelo acúmulo de poder político e bens econômicos a qualquer custo moral.",
      },
    ],
    correctOptionId: "A",
    explanation: "Na ética aristotélica, a virtude é a justa mediania (*mesótes*) entre a carência e o excesso (por exemplo, a coragem é o meio-termo entre a covardia e a temeridade), construída pelo hábito prático da deliberação prudente.",
    funeceInsight: "A banca FUNECE preza pela precisão dos conceitos filosóficos clássicos (Virtude como Meio-Termo em Aristóteles).",
    legalOrAuthorReference: "ARISTÓTELES. Ética a Nicômaco.",
    difficulty: "Média",
    year: "2023",
    banca: "CEV-UECE",
  },

  // 20. Língua Inglesa Específica - Leitura e Gêneros Textuais (FUNECE)
  {
    id: "q-funece-ing-01",
    discipline: "Conhecimentos Específicos",
    topic: "Língua Inglesa: Compreensão Textual e Pragmática",
    subtopic: "1.1 Estratégias de Leitura: Skimming, Scanning e Inferência",
    specialty: "ingles",
    statement: "In academic and standardized reading comprehension tasks (such as those prepared by CEV-UECE), the reading strategy of 'skimming' is best defined as:",
    options: [
      {
        id: "A",
        text: "Quickly reading through a text to get the general idea, gist, or overall layout without focusing on every specific detail.",
      },
      {
        id: "B",
        text: "Translating every single word word-for-word with a bilingual dictionary from Portuguese into English.",
      },
      {
        id: "C",
        text: "Looking exclusively for specific numbers, names, or dates while ignoring all paragraph topic sentences.",
      },
      {
        id: "D",
        text: "Memorizing all irregular verbs and phonological vowel shifts in Middle English texts.",
      },
    ],
    correctOptionId: "A",
    explanation: "Skimming involves fast surface reading to grasp the main idea (gist), whereas scanning is the rapid search for specific pieces of information (like a phone number or date).",
    funeceInsight: "A FUNECE costuma contrapor 'Skimming' (ideia geral) a 'Scanning' (dado específico).",
    legalOrAuthorReference: "NUTTALL, Christine. Teaching Reading Skills in a Foreign Language.",
    difficulty: "Fácil",
    year: "2023",
    banca: "FUNECE",
  },
];

