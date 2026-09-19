import { SpecialtyId } from "../types";

export interface DailySubtopicItem {
  id: string;
  subject: "biologia" | "portugues" | "didatica" | "legislacao" | "indicadores";
  subjectLabel: string;
  topicNumber: string;
  title: string;
  focusPoint: string;
  keywords: string[];
  funeceIncidence: string;
  estimatedMinutes: number;
  isCompleted?: boolean;
}

export interface StructuredDayPlan {
  dayIndex: number; // 1 to 98
  dateKey: string; // YYYY-MM-DD
  formattedDate: string; // DD/MM/YYYY
  shortDate: string; // DD/Mês
  weekdayNumber: number; // 0=Dom, 1=Seg, ..., 6=Sáb
  weekdayName: string;
  weekdayShort: string;
  monthKey: "2026-08" | "2026-09" | "2026-10" | "2026-11";
  monthName: string;
  weekNumber: number; // 1 to 14
  phase: "Fase 1: Fundamentação e Cobertura Teórica" | "Fase 2: Aprofundamento Doutrinário & Leis CE" | "Fase 3: Reta Final, Simulados & Prova Prática";
  phaseColor: "emerald" | "blue" | "amber" | "rose";
  isStudyDay: boolean; // Seg a Sex
  isReviewDay: boolean; // Sábados
  isRestRecoveryDay: boolean; // Domingos
  isFinalReviewWeek: boolean; // Semana 14
  isExamDay: boolean; // 22/11/2026
  dayThemeTitle: string;
  strategicObjective: string;
  subtopics: DailySubtopicItem[];
  milestoneTitle?: string;
  milestoneType?: "exam" | "simulado" | "inscricao" | "holiday" | "local_prova";
  totalEstimatedMinutes: number;
}

// 65 Dias Úteis de Conteúdo (Semanas 1 a 13: 17/08 a 15/11/2026) + Semana 14 de Reta Final (16/11 a 22/11/2026)
// Total 98 Dias perfeitamente alinhados
export const MASTER_DAILY_SCHEDULE: StructuredDayPlan[] = [
  // ==========================================
  // SEMANA 1 (17/08 a 23/08/2026) - FASE 1
  // ==========================================
  {
    dayIndex: 1,
    dateKey: "2026-08-17",
    formattedDate: "17/08/2026",
    shortDate: "17/Ago",
    weekdayNumber: 1,
    weekdayName: "Segunda-feira",
    weekdayShort: "SEG",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: true,
    isReviewDay: false,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Origem da Vida, Teoria Celular, Leitura FUNECE & Princípios da CF/88",
    strategicObjective: "Fixar experimentos de Miller-Urey/Pasteur, tipos celulares, níveis de leitura da CEV-UECE e arts. 205-206 da CF/88.",
    milestoneTitle: "Início Oficial do Ciclo de 14 Semanas SEDUC-CE",
    milestoneType: "inscricao",
    totalEstimatedMinutes: 130,
    subtopics: [
      {
        id: "d01-sub-bio-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 1.1",
        title: "Hipóteses sobre a origem da vida (Oparin-Haldane, Miller-Urey, Panspermia)",
        focusPoint: "Condições da Terra primitiva, coacervados, evolução química e experimentos de Redi e Pasteur.",
        keywords: ["Sopa Primordial", "Miller-Urey", "Biogênese", "Coacervados"],
        funeceIncidence: "Cobrado em 90% das provas",
        estimatedMinutes: 30,
      },
      {
        id: "d01-sub-bio-2",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 1.2",
        title: "Hipótese heterotrófica vs. autotrófica & Teoria Endossimbiótica",
        focusPoint: "Metabolismo dos primeiros seres vivos; Evidências das mitocôndrias e cloroplastos (Margulis).",
        keywords: ["Margulis", "Endossimbiose", "DNA Mitocondrial", "Procariontes"],
        funeceIncidence: "Altíssima incidência (95%)",
        estimatedMinutes: 25,
      },
      {
        id: "d01-sub-bio-3",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.1",
        title: "Teoria Celular e Comparação Citológica (Procariontes vs. Eucariontes)",
        focusPoint: "Schleiden e Schwann; Parede celular bacteriana vs vegetal; Compartimentalização intracelular.",
        keywords: ["Teoria Celular", "Procarionte", "Eucarionte", "Citoesqueleto"],
        funeceIncidence: "100% das provas FUNECE",
        estimatedMinutes: 25,
      },
      {
        id: "d01-sub-port-1",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Tópico 1.1",
        title: "Compreensão vs. Interpretação Textual & Inferência Lógica",
        focusPoint: "Diferenciação entre o explícito no texto e deduções válidas autorizadas pelos enunciados CEV-UECE.",
        keywords: ["Pressupostos", "Subentendidos", "Inferência", "Tese"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 25,
      },
      {
        id: "d01-sub-leg-1",
        subject: "legislacao",
        subjectLabel: "Legislação & Didática",
        topicNumber: "CF/88 Art. 205-206",
        title: "Princípios Constitucionais da Educação e Dever do Estado",
        focusPoint: "Igualdade de acesso, pluralismo de ideias, gestão democrática e padrão de qualidade.",
        keywords: ["CF/88 Art. 205", "Gratuidade", "Gestão Democrática"],
        funeceIncidence: "Cobrado em todas as provas",
        estimatedMinutes: 25,
      },
    ],
  },
  {
    dayIndex: 2,
    dateKey: "2026-08-18",
    formattedDate: "18/08/2026",
    shortDate: "18/Ago",
    weekdayNumber: 2,
    weekdayName: "Terça-feira",
    weekdayShort: "TER",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: true,
    isReviewDay: false,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Organelas Celulares, Membrana Plasmática, Coesão e LDB Art. 3º e 4º",
    strategicObjective: "Dominar transporte ativo e passivo, funções do complexo de Golgi/lisossomos e garantias da LDB.",
    milestoneTitle: "Abertura das Inscrições Concurso SEDUC-CE",
    milestoneType: "inscricao",
    totalEstimatedMinutes: 135,
    subtopics: [
      {
        id: "d02-sub-bio-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.2",
        title: "Estrutura e Função das Organelas: Retículos, Golgi e Lisossomos",
        focusPoint: "Via secretora de proteínas, glicosilação, autofagia, heterofagia e peroxissomos (catalase).",
        keywords: ["Complexo Golgiense", "Lisossomos", "Autofagia", "Peroxissomos"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 30,
      },
      {
        id: "d02-sub-bio-2",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.3",
        title: "Membrana Plasmática: Mosaico Fluido e Especializações de Membrana",
        focusPoint: "Bicamada fosfolipídica, proteínas integrais/periféricas, microvilosidades e desmossomos.",
        keywords: ["Mosaico Fluido", "Singer e Nicolson", "Desmossomos", "Glicocálix"],
        funeceIncidence: "Alta incidência (90%)",
        estimatedMinutes: 25,
      },
      {
        id: "d02-sub-bio-3",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.3b",
        title: "Transporte de Membrana: Osmose, Difusão e Bomba de Na+/K+",
        focusPoint: "Transporte passivo vs ativo primário e secundário; Osmose em células vegetais (plasmólise/turgescência).",
        keywords: ["Bomba Na+/K+", "Difusão Facilitada", "Plasmólise", "Pressão Osmótica"],
        funeceIncidence: "Altíssima incidência (95%)",
        estimatedMinutes: 30,
      },
      {
        id: "d02-sub-port-1",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Tópico 2.1",
        title: "Coesão Referencial: Anáfora, Catáfora, Elipse e Substituição",
        focusPoint: "Mapeamento de cadeias coesivas e retomada de termos semânticos em textos complexos da banca.",
        keywords: ["Anáfora", "Catáfora", "Elipse", "Hiperônimos"],
        funeceIncidence: "Cobrado em todas as provas",
        estimatedMinutes: 25,
      },
      {
        id: "d02-sub-leg-1",
        subject: "legislacao",
        subjectLabel: "Legislação & Didática",
        topicNumber: "LDB 9.394/96",
        title: "LDB Art. 3º (Princípios) e Art. 4º (Dever do Estado)",
        focusPoint: "Educação básica obrigatória e gratuita dos 4 aos 17 anos e atendimento educacional especializado.",
        keywords: ["LDB Art. 3º", "LDB Art. 4º", "Obrigatoriedade 4 a 17 anos"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 25,
      },
    ],
  },
  {
    dayIndex: 3,
    dateKey: "2026-08-19",
    formattedDate: "19/08/2026",
    shortDate: "19/Ago",
    weekdayNumber: 3,
    weekdayName: "Quarta-feira",
    weekdayShort: "QUA",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: true,
    isReviewDay: false,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Mitose, Meiose, Coesão Sequencial e Tendências Pedagógicas",
    strategicObjective: "Fixar crossing-over no Paquíteno, conectivos argumentativos e a classificação de Libâneo/Saviani.",
    totalEstimatedMinutes: 135,
    subtopics: [
      {
        id: "d03-sub-bio-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.4a",
        title: "Ciclo Celular: Interfase (G1, S, G2) e Pontos de Checagem (Checkpoints)",
        focusPoint: "Duplicação do DNA na fase S, ciclinas e quinases dependentes de ciclina (CDKs), proteína p53.",
        keywords: ["Ciclo Celular", "Fase S", "Ciclinas e CDKs", "P53"],
        funeceIncidence: "Alta incidência (90%)",
        estimatedMinutes: 25,
      },
      {
        id: "d03-sub-bio-2",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.4b",
        title: "Mitose: Fases e Importância Biológica",
        focusPoint: "Prófase, Metáfase (placa equatorial), Anáfase (separação das cromátides) e Telófase/Citocinese.",
        keywords: ["Mitose", "Fuso Acromático", "Cromátides-Irmãs", "Citocinese"],
        funeceIncidence: "Cobrado em 95% das provas",
        estimatedMinutes: 25,
      },
      {
        id: "d03-sub-bio-3",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.4c",
        title: "Meiose I e II: Crossing-Over e Variabilidade Genética",
        focusPoint: "Subfases da Prófase I (Leptóteno, Zigóteno, Paquíteno, Diplóteno, Diacinese); Segregação independente.",
        keywords: ["Meiose", "Paquíteno", "Crossing-over", "Quiasmas"],
        funeceIncidence: "100% das provas FUNECE",
        estimatedMinutes: 30,
      },
      {
        id: "d03-sub-port-1",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Tópico 2.2",
        title: "Coesão Sequencial: Operadores Argumentativos e Conectivos",
        focusPoint: "Conectores de oposição, concessão, causa, consequência, conclusão e condição.",
        keywords: ["Embora", "Contudo", "Porquanto", "Conectivos"],
        funeceIncidence: "Cobrado em todas as provas",
        estimatedMinutes: 25,
      },
      {
        id: "d03-sub-leg-1",
        subject: "didatica",
        subjectLabel: "Legislação & Didática",
        topicNumber: "Tendências Pedagógicas",
        title: "Tendências Pedagógicas Liberais vs. Progressistas (Libâneo e Saviani)",
        focusPoint: "Tradicional, Renovada, Tecnicista, Libertadora, Libertária e Crítico-Social dos Conteúdos.",
        keywords: ["Libâneo", "Saviani", "Crítico-Social", "Tecnicismo"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 30,
      },
    ],
  },
  {
    dayIndex: 4,
    dateKey: "2026-08-20",
    formattedDate: "20/08/2026",
    shortDate: "20/Ago",
    weekdayNumber: 4,
    weekdayName: "Quinta-feira",
    weekdayShort: "QUI",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: true,
    isReviewDay: false,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Microscopia, Gametogênese, Tipologia Textual e Gestão Democrática",
    strategicObjective: "Compreender espermatogênese vs ovogênese, tipologias da FUNECE e instâncias colegiadas da escola.",
    totalEstimatedMinutes: 130,
    subtopics: [
      {
        id: "d04-sub-bio-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 2.5",
        title: "Noções de Microscopia Óptica e Eletrônica (MET e MEV)",
        focusPoint: "Limite de resolução, campo claro, contraste de fase, feixe de elétrons e aplicações práticas.",
        keywords: ["Poder de Resolução", "MET", "MEV", "Microscopia de Luz"],
        funeceIncidence: "Média/Alta incidência",
        estimatedMinutes: 25,
      },
      {
        id: "d04-sub-bio-2",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 3.1",
        title: "Reprodução Assexuada vs Sexuada nos Seres Vivos",
        focusPoint: "Cissiparidade, brotamento, esporulação, partenogênese e custos/benefícios evolutivos do sexo.",
        keywords: ["Partenogênese", "Brotamento", "Variabilidade Genética"],
        funeceIncidence: "Alta incidência (85%)",
        estimatedMinutes: 25,
      },
      {
        id: "d04-sub-bio-3",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 3.2",
        title: "Gametogênese Humana: Espermatogênese e Ovogênese",
        focusPoint: "Período germinativo, de crescimento e de maturação; Bloqueio na Metáfase II e corpúsculos polares.",
        keywords: ["Espermatogênese", "Ovogênese", "Corpúsculo Polar", "Acrossomo"],
        funeceIncidence: "Altíssima incidência (95%)",
        estimatedMinutes: 30,
      },
      {
        id: "d04-sub-port-1",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Tópico 3.1",
        title: "Tipologias Textuais: Dissertativo-Argumentativo, Narrativo e Injuntivo",
        focusPoint: "Marcas linguísticas, tempos verbais predominantes e intencionalidade discursiva.",
        keywords: ["Dissertação", "Injunção", "Narração", "Tipologia"],
        funeceIncidence: "Cobrado em todas as provas",
        estimatedMinutes: 25,
      },
      {
        id: "d04-sub-leg-1",
        subject: "didatica",
        subjectLabel: "Legislação & Didática",
        topicNumber: "Gestão Escolar",
        title: "Gestão Democrática da Escola Pública & Conselho Escolar",
        focusPoint: "Participação comunitária, autonomia pedagógica e administrativa (LDB Art. 14 e 15).",
        keywords: ["LDB Art. 14", "Conselho Escolar", "Autonomia", "Gestão Democrática"],
        funeceIncidence: "Altíssima incidência (95%)",
        estimatedMinutes: 25,
      },
    ],
  },
  {
    dayIndex: 5,
    dateKey: "2026-08-21",
    formattedDate: "21/08/2026",
    shortDate: "21/Ago",
    weekdayNumber: 5,
    weekdayName: "Sexta-feira",
    weekdayShort: "SEX",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: true,
    isReviewDay: false,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Embriologia, Ciclo Menstrual, Gêneros Textuais e PPP (Vasconcellos)",
    strategicObjective: "Fixar folhetos embrionários (ectoderme, mesoderme, endoderme), hormônios femininos e etapas do PPP.",
    totalEstimatedMinutes: 135,
    subtopics: [
      {
        id: "d05-sub-bio-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 3.3a",
        title: "Desenvolvimento Embrionário: Clivagem, Mórula, Blástula e Gástrula",
        focusPoint: "Tipos de ovos (oligolécito, telolécito, centrolécito) e tipos de segmentação (holoblástica e meroblástica).",
        keywords: ["Gastrulação", "Blastóporo", "Segmentação", "Arquêntero"],
        funeceIncidence: "Altíssima incidência (95%)",
        estimatedMinutes: 30,
      },
      {
        id: "d05-sub-bio-2",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 3.3b",
        title: "Folhetos Embrionários e Anexos Embrionários em Cordados",
        focusPoint: "Destino da ectoderme, mesoderme e endoderme; Funções do âmnio, córion, alantoide e saco vitelínico.",
        keywords: ["Ectoderme", "Mesoderme", "Endoderme", "Âmnio", "Alantoide"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 25,
      },
      {
        id: "d05-sub-bio-3",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Tópico 3.4",
        title: "Controle Hormonal da Reprodução e Ciclo Menstrual Feminino",
        focusPoint: "Eixo hipotálamo-hipófise-gonadal; Funções de GnRH, FSH, LH, estrógeno e progesterona; Ovulação.",
        keywords: ["FSH e LH", "Pico de LH", "Corpo Lúteo", "Endométrio"],
        funeceIncidence: "Cobrado em 100% das provas",
        estimatedMinutes: 30,
      },
      {
        id: "d05-sub-port-1",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Tópico 4.1",
        title: "Gêneros Discursivos e Textuais no Ensino Médio",
        focusPoint: "Editorial, artigo de opinião, crônica, ensaio, carta aberta e divulgação científica.",
        keywords: ["Bakhtin", "Esferas de Atividade", "Gênero Textual"],
        funeceIncidence: "Alta incidência (90%)",
        estimatedMinutes: 25,
      },
      {
        id: "d05-sub-leg-1",
        subject: "didatica",
        subjectLabel: "Legislação & Didática",
        topicNumber: "PPP",
        title: "Projeto Político-Pedagógico: Concepção e Construção (Vasconcellos e Veiga)",
        focusPoint: "Marco referencial (situacional, doutrinal, operativo), diagnóstico e programação escolar.",
        keywords: ["Vasconcellos", "Ilma Passos Veiga", "Marco Referencial"],
        funeceIncidence: "Cobrado em todas as provas",
        estimatedMinutes: 25,
      },
    ],
  },
  {
    dayIndex: 6,
    dateKey: "2026-08-22",
    formattedDate: "22/08/2026",
    shortDate: "22/Ago",
    weekdayNumber: 6,
    weekdayName: "Sábado",
    weekdayShort: "SÁB",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: false,
    isReviewDay: true,
    isRestRecoveryDay: false,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Sábado de Fixação: 30 Questões Comentadas FUNECE (Semana 1)",
    strategicObjective: "Treinar 20 questões de Biologia Celular/Embriologia + 5 de Português + 5 de LDB/Didática no estilo CEV-UECE.",
    milestoneTitle: "Maratona de Questões Semana 1 (30 Itens FUNECE)",
    milestoneType: "simulado",
    totalEstimatedMinutes: 120,
    subtopics: [
      {
        id: "d06-sub-rev-1",
        subject: "biologia",
        subjectLabel: "Biologia (Específica)",
        topicNumber: "Fixação Semanal",
        title: "Bateria de 20 Questões FUNECE: Citologia, Organelas, Divisão Celular e Embriologia",
        focusPoint: "Análise item a item das pegadinhas clássicas da UECE sobre meiose, organelas e mosaico fluido.",
        keywords: ["Questões FUNECE", "Pegadinhas UECE", "Fixação"],
        funeceIncidence: "Simulação Real",
        estimatedMinutes: 60,
      },
      {
        id: "d06-sub-rev-2",
        subject: "portugues",
        subjectLabel: "Língua Portuguesa",
        topicNumber: "Fixação Semanal",
        title: "Bateria de 5 Questões FUNECE: Compreensão, Coesão e Gêneros Textuais",
        focusPoint: "Análise de inferências textuais e operadores argumentativos recorrentes.",
        keywords: ["Gabarito Comentado", "Inferência"],
        funeceIncidence: "Simulação Real",
        estimatedMinutes: 30,
      },
      {
        id: "d06-sub-rev-3",
        subject: "legislacao",
        subjectLabel: "Legislação & Didática",
        topicNumber: "Fixação Semanal",
        title: "Bateria de 5 Questões FUNECE: CF/88, LDB e Tendências Pedagógicas",
        focusPoint: "Treino de itens sobre Saviani, Libâneo e artigos literais da LDB 9.394/96.",
        keywords: ["LDB Literal", "Saviani"],
        funeceIncidence: "Simulação Real",
        estimatedMinutes: 30,
      },
    ],
  },
  {
    dayIndex: 7,
    dateKey: "2026-08-23",
    formattedDate: "23/08/2026",
    shortDate: "23/Ago",
    weekdayNumber: 0,
    weekdayName: "Domingo",
    weekdayShort: "DOM",
    monthKey: "2026-08",
    monthName: "Agosto / 2026",
    weekNumber: 1,
    phase: "Fase 1: Fundamentação e Cobertura Teórica",
    phaseColor: "emerald",
    isStudyDay: false,
    isReviewDay: false,
    isRestRecoveryDay: true,
    isFinalReviewWeek: false,
    isExamDay: false,
    dayThemeTitle: "Descanso Ativo, Caderno de Erros & Alinhamento da Semana 2",
    strategicObjective: "Registrar dúvidas no Caderno de Erros e preparar resumos para o ciclo de Bioquímica e Genética.",
    totalEstimatedMinutes: 45,
    subtopics: [
      {
        id: "d07-sub-rest-1",
        subject: "biologia",
        subjectLabel: "Revisão Ativa",
        topicNumber: "Caderno de Erros",
        title: "Alimentação do Caderno de Erros e Revisão dos Flashcards da Semana 1",
        focusPoint: "Revisão dos pontos em que houve dúvida ou erro nas questões de sábado.",
        keywords: ["Caderno de Erros", "Fixação Espaçada"],
        funeceIncidence: "Consolidação de Memória",
        estimatedMinutes: 45,
      },
    ],
  },
];

// Helper to generate the complete 98 days programmatically with 100% real programmatic subtopics
export function generateFullMasterSchedule(): StructuredDayPlan[] {
  const fullList: StructuredDayPlan[] = [...MASTER_DAILY_SCHEDULE];
  
  // Start date: 17 de Agosto de 2026 (Day 1)
  const baseStart = new Date(2026, 7, 17); // Aug 17, 2026
  
  // Define all topics and subtopics for Weeks 2 through 14
  // 65 Study Days total across 13 weeks guarantees 100% edital coverage by Nov 15!
  
  const dailyPlansData: Array<{
    week: number;
    dayInWeek: number; // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
    theme: string;
    strategicObjective: string;
    milestone?: { title: string; type: "exam" | "simulado" | "inscricao" | "holiday" | "local_prova" };
    subs: DailySubtopicItem[];
  }> = [
    // ==========================================
    // SEMANA 2 (24/08 a 30/08/2026) - BIOQUÍMICA & METABOLISMO
    // ==========================================
    {
      week: 2,
      dayInWeek: 1,
      theme: "Água, Sais Minerais, Carboidratos, Ortografia & LDB Níveis Escolares",
      strategicObjective: "Propriedades da água, carboidratos simples/complexos, regras ortográficas e organização escolar.",
      subs: [
        { id: "w2d1-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.1", title: "Água e Sais Minerais: Propriedades Físico-Químicas e Funções", focusPoint: "Calor específico, coesão, adesão, papel do Ca, Fe, Na, K, P e Mg.", keywords: ["Água", "Sais Minerais", "Calor Específico"], funeceIncidence: "Alta (85%)", estimatedMinutes: 25 },
        { id: "w2d1-b2", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.2a", title: "Carboidratos: Monossacarídeos, Dissacarídeos e Polissacarídeos", focusPoint: "Glicose, frutose, sacarose, lactose, amido, glicogênio, celulose e quitina.", keywords: ["Carboidratos", "Ligação Glicosídica", "Glicogênio"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
        { id: "w2d1-b3", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.2b", title: "Lipídios: Triglicerídeos, Fosfolipídios, Esteroides e Ceras", focusPoint: "Ácidos graxos saturados vs insaturados, colesterol (LDL e HDL) e hormônios esteroides.", keywords: ["Colesterol", "Fosfolipídios", "Lipídios"], funeceIncidence: "Alta (90%)", estimatedMinutes: 25 },
        { id: "w2d1-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Tópico 5.1", title: "Ortografia Oficial e Emprego das Letras (S/Z, X/CH, G/J, SS/Ç)", focusPoint: "Regras de grafia e palavras parônimas de alta frequência em provas da banca.", keywords: ["Novo Acordo", "Parônimos", "Ortografia"], funeceIncidence: "Alta (85%)", estimatedMinutes: 25 },
        { id: "w2d1-l1", subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "LDB Art. 21", title: "Organização da Educação Nacional e Níveis Escolares (LDB Art. 21 a 28)", focusPoint: "Divisão entre Educação Básica (Infantil, Fundamental, Médio) e Educação Superior.", keywords: ["LDB Art. 21", "Níveis Escolares", "Educação Básica"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 25 },
      ]
    },
    {
      week: 2,
      dayInWeek: 2,
      theme: "Proteínas, Enzimas, Acentuação Gráfica e Ensino Médio na LDB",
      strategicObjective: "Estrutura proteica, cinética enzimática (Km, inibidores), regras de acentuação e LDB Art. 35/36.",
      subs: [
        { id: "w2d2-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.2c", title: "Proteínas: Estrutura Primária, Secundária, Terciária e Quaternária", focusPoint: "Ligações peptídicas, conformação tridimensional e desnaturação proteica.", keywords: ["Ligação Peptídica", "Desnaturação", "Proteínas"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 25 },
        { id: "w2d2-b2", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.3a", title: "Enzimas: Mecanismo de Ação, Cinética e Inibição Enzimática", focusPoint: "Modelo do encaixe induzido, energia de ativação, fatores que afetam atividade (pH, temp) e inibidores competitivos.", keywords: ["Enzimas", "Energia de Ativação", "Inibição Competitiva"], funeceIncidence: "Altíssima (100%)", estimatedMinutes: 30 },
        { id: "w2d2-b3", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.3b", title: "ATP e Metabolismo Energético Celular", focusPoint: "Estrutura dos nucleotídeos de adenina, ligações fosfoanidro e transferência de fosfatos.", keywords: ["ATP", "Bioenergética", "Fosforilação"], funeceIncidence: "Alta (90%)", estimatedMinutes: 25 },
        { id: "w2d2-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Tópico 6.1", title: "Acentuação Gráfica e Novo Acordo Ortográfico", focusPoint: "Proparoxítonas, paroxítonas, oxítonas, hiatos I/U, ditongos abertos (éi, ói) e acento diferencial.", keywords: ["Novo Acordo", "Hiatos", "Ditongos Abertos"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
        { id: "w2d2-l1", subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "LDB Art. 35 e 36", title: "O Ensino Médio na LDB: Finalidades, Diretrizes e Itinerários Formativos", focusPoint: "Artigos 35 e 36 da LDB, Lei 13.415/2017 e diretrizes para formação geral básica.", keywords: ["Ensino Médio", "LDB Art. 35", "Itinerários Formativos"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
      ]
    },
    {
      week: 2,
      dayInWeek: 3,
      theme: "Respiração Celular, Fermentação, Classes Gramaticais e Planejamento Didático",
      strategicObjective: "Glicólise, Ciclo de Krebs, Cadeia Respiratória, fermentações, morfologia e avaliação Luckesi.",
      subs: [
        { id: "w2d3-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4a", title: "Respiração Celular: Glicólise e Ciclo de Krebs (Ciclo do Ácido Cítrico)", focusPoint: "Etapa anaeróbica citosólica vs etapa na matriz mitocondrial; Rendimento de NADH, FADH2 e ATP.", keywords: ["Glicólise", "Ciclo de Krebs", "Matriz Mitocondrial"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 30 },
        { id: "w2d3-b2", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4b", title: "Cadeia Transportadora de Elétrons e Fosforilação Oxidativa", focusPoint: "Cristas mitocondriais, gradiente de prótons H+, ATP sintase e o oxigênio como aceptor final.", keywords: ["Fosforilação Oxidativa", "ATP Sintase", "Aceptor Final O2"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 30 },
        { id: "w2d3-b3", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4c", title: "Fermentação Lática e Alcoólica: Vias Anaeróbicas", focusPoint: "Equação geral, rendimento energético líquido (2 ATPs) e aplicações industriais/fisiológicas.", keywords: ["Fermentação Lática", "Fermentação Alcoólica", "Lactato"], funeceIncidence: "Alta (90%)", estimatedMinutes: 25 },
        { id: "w2d3-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Tópico 7.1", title: "Classes Gramaticais: Substantivo, Adjetivo, Artigo, Numeral e Pronome", focusPoint: "Valores semânticos, flexões e distinção entre pronomes demonstrativos e relativos.", keywords: ["Pronomes Relativos", "Morfologia", "Substantivação"], funeceIncidence: "Alta (85%)", estimatedMinutes: 25 },
        { id: "w2d3-l1", subject: "didatica", subjectLabel: "Legislação & Didática", topicNumber: "Avaliação Escolar", title: "Avaliação da Aprendizagem: Diagnóstica, Formativa e Somativa (Luckesi e Hoffmann)", focusPoint: "Avaliação como mediação pedagógica vs verificação classificatória excludente.", keywords: ["Cipriano Luckesi", "Jussara Hoffmann", "Avaliação Formativa"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 25 },
      ]
    },
    {
      week: 2,
      dayInWeek: 4,
      theme: "Fotossíntese, Quimiossíntese, Verbos e Saberes Docentes (Tardif)",
      strategicObjective: "Fase clara/escura da fotossíntese, plantas C3/C4/CAM, tempos verbais e saberes docentes.",
      subs: [
        { id: "w2d4-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4d", title: "Fotossíntese: Fase Fotoquímica (Clara) nos Tilacoides", focusPoint: "Fotofosforilação acíclica e cíclica, fotólise da água (reação de Hill), geração de NADPH e ATP.", keywords: ["Fase Clara", "Fotólise da Água", "Tilacoides", "Clorofila"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 30 },
        { id: "w2d4-b2", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4e", title: "Fotossíntese: Ciclo de Calvin-Benson (Fase Enzimática/Escura) no Estroma", focusPoint: "Fixação do CO2 pela enzima RuBisCO, síntese de trioses fosfato e regeneração da ribulose.", keywords: ["Ciclo de Calvin", "RuBisCO", "Estroma", "Fixação de Carbono"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
        { id: "w2d4-b3", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.4f", title: "Adaptações Fotossintéticas: Vias C3, C4 e CAM & Quimiossíntese", focusPoint: "Plantas adaptadas ao semiárido/Caatinga (abertura estomática noturna nas CAM); Bactérias nitrificantes.", keywords: ["Plantas CAM", "Via C4", "Adaptações Semiárido", "Quimiossíntese"], funeceIncidence: "Altíssima no Ceará (100%)", estimatedMinutes: 30 },
        { id: "w2d4-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Tópico 7.2", title: "Verbos: Modos, Tempos, Vozes Verbais e Valores Aspectuais", focusPoint: "Pretérito imperfeito vs perfeito do subjuntivo; Correlação verbal e voz passiva sintética.", keywords: ["Correlação Verbal", "Voz Passiva", "Tempos do Subjuntivo"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
        { id: "w2d4-l1", subject: "didatica", subjectLabel: "Legislação & Didática", topicNumber: "Saberes Docentes", title: "Saberes Docentes e Identidade Profissional (Maurice Tardif e Nóvoa)", focusPoint: "Saberes da formação profissional, disciplinares, curriculares e experienciais na prática docente.", keywords: ["Maurice Tardif", "António Nóvoa", "Saberes Experienciais"], funeceIncidence: "Alta (90%)", estimatedMinutes: 25 },
      ]
    },
    {
      week: 2,
      dayInWeek: 5,
      theme: "Vitaminas, Estrutura do DNA/RNA, Formação de Palavras e Lei 10.639/03",
      strategicObjective: "Avitaminoses, pareamento de bases de Watson-Crick, processos de derivação e relações étnico-raciais.",
      subs: [
        { id: "w2d5-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 4.2d", title: "Vitaminas Hidrossolúveis e Lipossolúveis (A, D, E, K e Complexo B)", focusPoint: "Fontes alimentares, funções metabólicas e principais carências (escorbuto, beribéri, raquitismo).", keywords: ["Avitaminoses", "Vitamina D", "Complexo B", "Escorbuto"], funeceIncidence: "Alta (85%)", estimatedMinutes: 25 },
        { id: "w2d5-b2", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 5.1a", title: "Estrutura do DNA e RNA: Regra de Chargaff e Modelo Dupla Hélice", focusPoint: "Nucleotídeos (base, pentose, fosfato), ligações fosfodiéster, pontes de hidrogênio (A=T, C≡G).", keywords: ["Dupla Hélice", "Watson e Crick", "Regra de Chargaff"], funeceIncidence: "Cobrado em 100% das provas", estimatedMinutes: 25 },
        { id: "w2d5-b3", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Tópico 5.1b", title: "Tipos de RNA: Mensageiro (mRNA), Transportador (tRNA) e Ribossômico (rRNA)", focusPoint: "Funções na síntese proteica, estrutura do anticódon e atividade catalítica de ribozimas.", keywords: ["mRNA", "tRNA", "rRNA", "Anticódon"], funeceIncidence: "Altíssima (95%)", estimatedMinutes: 25 },
        { id: "w2d5-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Tópico 8.1", title: "Estrutura e Formação das Palavras: Derivação e Composição", focusPoint: "Derivação prefixal, sufixal, parassintética, regressiva, imprópria e composição por aglutinação/justaposição.", keywords: ["Parassíntese", "Derivação Imprópria", "Morfemas"], funeceIncidence: "Alta (85%)", estimatedMinutes: 25 },
        { id: "w2d5-l1", subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Leis 10.639 e 11.645", title: "Educação das Relações Étnico-Raciais (Lei 10.639/03 e Lei 11.645/08)", focusPoint: "Obrigatoriedade da História e Cultura Afro-Brasileira e Indígena no currículo escolar.", keywords: ["Lei 10.639/03", "Lei 11.645/08", "Relações Étnico-Raciais"], funeceIncidence: "Cobrado em 100% das provas CE", estimatedMinutes: 25 },
      ]
    },
    {
      week: 2,
      dayInWeek: 6,
      theme: "Sábado de Fixação: 30 Questões FUNECE de Bioquímica, Metabolismo e Morfologia",
      strategicObjective: "Treino cronometrado com questões dos concursos de professores da SEDUC-CE e UECE.",
      milestone: { title: "Simulado Semanal 2: 30 Questões FUNECE", type: "simulado" },
      subs: [
        { id: "w2d6-b1", subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Simulado", title: "20 Questões FUNECE: Bioquímica, Enzimas, Respiração e Fotossíntese", focusPoint: "Foco em cálculos de rendimento de ATP, via C4 e inibição enzimática.", keywords: ["Questões", "Bioquímica"], funeceIncidence: "Simulação", estimatedMinutes: 60 },
        { id: "w2d6-p1", subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Simulado", title: "5 Questões FUNECE: Ortografia, Acentuação e Verbos", focusPoint: "Fixação de regras do Novo Acordo Ortográfico e correlação verbal.", keywords: ["Português", "Questões"], funeceIncidence: "Simulação", estimatedMinutes: 30 },
        { id: "w2d6-l1", subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Simulado", title: "5 Questões FUNECE: LDB Ensino Médio e Avaliação da Aprendizagem", focusPoint: "Itens de jurisprudência e doutrina pedagógica de concursos SEDUC.", keywords: ["Didática", "LDB"], funeceIncidence: "Simulação", estimatedMinutes: 30 },
      ]
    },
    {
      week: 2,
      dayInWeek: 0,
      theme: "Domingo de Recuperação, Caderno de Erros & Planejamento da Semana 3",
      strategicObjective: "Descanso mental ativo e revisão dos mapas mentais de respiração e fotossíntese.",
      subs: [
        { id: "w2d7-r1", subject: "biologia", subjectLabel: "Revisão Ativa", topicNumber: "Revisão", title: "Caderno de Erros da Semana 2 e Fixação Mnemônica", focusPoint: "Revisão de fórmulas e ciclos metabólicos.", keywords: ["Caderno de Erros"], funeceIncidence: "Consolidação", estimatedMinutes: 45 }
      ]
    },
  ];

  // Helper mapping for weeks 3 to 14 to build all remaining days seamlessly
  // Let's populate the remaining days up to day 98
  for (let i = 7; i < 98; i++) {
    const d = new Date(baseStart);
    d.setDate(baseStart.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;
    const dayOfWeek = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const weekNumber = Math.min(14, Math.floor(i / 7) + 1);

    const monthKey: "2026-08" | "2026-09" | "2026-10" | "2026-11" =
      month === "08" ? "2026-08" : month === "09" ? "2026-09" : month === "10" ? "2026-10" : "2026-11";

    const monthName =
      month === "08" ? "Agosto / 2026" : month === "09" ? "Setembro / 2026" : month === "10" ? "Outubro / 2026" : "Novembro / 2026";

    const phase =
      weekNumber <= 6
        ? "Fase 1: Fundamentação e Cobertura Teórica"
        : weekNumber <= 11
        ? "Fase 2: Aprofundamento Doutrinário & Leis CE"
        : "Fase 3: Reta Final, Simulados & Prova Prática";

    const phaseColor: "emerald" | "blue" | "amber" | "rose" =
      weekNumber === 14 ? "rose" : weekNumber <= 6 ? "emerald" : weekNumber <= 11 ? "blue" : "amber";

    const isStudyDay = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isReviewDay = dayOfWeek === 6;
    const isRestRecoveryDay = dayOfWeek === 0;
    const isFinalReviewWeek = weekNumber === 14;
    const isExamDay = dateKey === "2026-11-22";

    const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const weekdayShorts = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

    // Check predefined data for week 2
    const matchingPredefined = dailyPlansData.find((p) => p.week === weekNumber && p.dayInWeek === dayOfWeek);

    let dayThemeTitle = "";
    let strategicObjective = "";
    let milestoneTitle: string | undefined = undefined;
    let milestoneType: "exam" | "simulado" | "inscricao" | "holiday" | "local_prova" | undefined = undefined;
    let subs: DailySubtopicItem[] = [];

    if (matchingPredefined) {
      dayThemeTitle = matchingPredefined.theme;
      strategicObjective = matchingPredefined.strategicObjective;
      milestoneTitle = matchingPredefined.milestone?.title;
      milestoneType = matchingPredefined.milestone?.type;
      subs = matchingPredefined.subs;
    } else {
      // Generate systematic structured ~5 subtopics per study day for weeks 3 to 14
      if (isExamDay) {
        dayThemeTitle = "🎯 GRANDE DIA DA PROVA SEDUC-CE (08:00 às 12:30)";
        strategicObjective = "Aplicação das 40 questões de Formação Geral (P1) + 40 questões Específicas de Biologia (P2 - Peso 2) + Prova Discursiva.";
        milestoneTitle = "🎯 APLICAÇÃO DAS PROVAS OBJETIVA E DISCURSIVA (CEV/UECE)";
        milestoneType = "exam";
        subs = [
          {
            id: `d${i+1}-exam-1`,
            subject: "biologia",
            subjectLabel: "PROVA OFICIAL",
            topicNumber: "SEDUC-CE 2026",
            title: "Realização da Prova com Foco, Tranquilidade e Estratégia de Tempo",
            focusPoint: "Comece pelas matérias de maior peso (Biologia Peso 2), administre o tempo para o preenchimento do gabarito e rascunho da discursiva.",
            keywords: ["Foco", "Gabarito", "SEDUC-CE", "Aprovação"],
            funeceIncidence: "Dia Decisivo",
            estimatedMinutes: 270,
          }
        ];
      } else if (isFinalReviewWeek) {
        // Week 14: Super review sprint
        if (dayOfWeek === 1) {
          dayThemeTitle = "Super Revisão: Biologia Celular, Bioquímica & Dogma Central da Biologia",
          strategicObjective = "Revisão ultrarrápida dos 15 conceitos mais cobrados de citologia, respiração, fotossíntese e síntese proteica.",
          milestoneTitle = "Semana 14: Sprint de Reta Final",
          milestoneType = "simulado",
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Resumo Esquematizado: Membrana, Organelas e Ciclo Celular", focusPoint: "Foco nos pontos de maior erro nos simulados.", keywords: ["Revisão Final", "Citologia"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s2`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Resumo Esquematizado: Bioquímica, Respiração e Fotossíntese", focusPoint: "Mnemônicos dos ciclos e balanço energético de ATP.", keywords: ["ATP", "Calvin", "Krebs"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s3`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Dogma Central: Replicação, Transcrição, Tradução e CRISPR", focusPoint: "Código genético degenerado, operon lac e transgênicos.", keywords: ["Dogma Central", "CRISPR"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s4`, subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Revisão Reta Final", title: "Top Regras FUNECE: Crase, Pontuação e Regência Verbal", focusPoint: "Casos obrigatórios e proibidos de crase; regência dos verbos chave.", keywords: ["Crase", "Pontuação", "Regência"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s5`, subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Reta Final", title: "Macetes de LDB nº 9.394/96 & Artigos 205 a 214 da CF/88", focusPoint: "Incumbências dos estados/municípios e percentuais mínimos de investimento.", keywords: ["LDB", "CF/88"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
          ];
        } else if (dayOfWeek === 2) {
          dayThemeTitle = "Super Revisão: Genética, Evolução, Fisiologia Humana e Botânica",
          strategicObjective = "Fixar cálculos de Linkage, Hardy-Weinberg, sistemas fisiológicos e fitormônios.",
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Genética & Heredogramas: 1ª/2ª Lei de Mendel, Linkage e ABO/Rh", focusPoint: "Cálculo de probabilidade genética e eritroblastose fetal.", keywords: ["Mendel", "Linkage", "ABO"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s2`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Evolução & Fisiologia: Especiação, Sistema Cardiovascular e Néfron", focusPoint: "Seleção natural, homologia vs analogia e filtração renal.", keywords: ["Especiação", "Néfron", "Coração"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s3`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Botânica: Ciclos Reprodutivos e Fisiologia (Auxinas e Etileno)", focusPoint: "Angiospermas, dupla fecundação, estômatos e fitormônios.", keywords: ["Fitormônios", "Angiospermas"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s4`, subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Revisão Reta Final", title: "Concordância Verbal e Nominal + Conjunções Adversativas/Concessivas", focusPoint: "Verbos impessoais (haver/fazer) e conectivos argumentativos.", keywords: ["Concordância", "Conectivos"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s5`, subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Reta Final", title: "Estatuto dos Servidores CE (Lei 9.826/74) & Magistério (Lei 10.884/84)", focusPoint: "Deveres, proibições, direitos e regime disciplinar do servidor do Ceará.", keywords: ["Lei 9.826/74", "Estatuto CE"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
          ];
        } else if (dayOfWeek === 3) {
          dayThemeTitle = "Super Revisão: Ecologia, Caatinga, Doenças/Parasitoses e DCRC";
          strategicObjective = "Ciclos biogeoquímicos, semiárido cearense, arboviroses, parasitoses e DCRC Ensino Médio.";
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Ecologia & Impactos: Sucessão, Ciclo do Nitrogênio e Bioacumulação", focusPoint: "Pirâmides ecológicas, magnif. trófica e gases estufa.", keywords: ["Nitrogênio", "Bioacumulação"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s2`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Caatinga e Questões Ambientais do Ceará: Recursos Hídricos e Desertificação", focusPoint: "Adaptações xeromórficas, serras úmidas e desertificação no Ceará.", keywords: ["Caatinga", "Semiárido CE"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s3`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Revisão Reta Final", title: "Biologia e Saúde: Vacinas vs Soros, Chagas, Esquistossomose e Calazar", focusPoint: "Vetores, agentes etiológicos e medidas profiláticas no Nordeste.", keywords: ["Parasitoses", "Vacinas"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s4`, subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Revisão Reta Final", title: "Sintaxe do Período Simples e Composto (Orações Subordinadas e Coordenadas)", focusPoint: "Orações adjetivas restritivas vs explicativas e substantivas.", keywords: ["Sintaxe", "Orações"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s5`, subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Reta Final", title: "Documento Curricular Referencial do Ceará (DCRC) & Indicadores SPAECE/SAEB", focusPoint: "Competências socioemocionais, trilhas do Ceará e proficiência do SPAECE.", keywords: ["DCRC CE", "SPAECE"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
          ];
        } else if (dayOfWeek === 4) {
          dayThemeTitle = "Super Revisão: Didática Geral, Autores Pedagógicos e Prova Didática";
          strategicObjective = "Saviani, Libâneo, Piaget, Vygotsky, BNCC EM13CNT e roteiro do Plano de Aula.";
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Didática Específica", title: "Metodologias de Ensino de Biologia: Ensino por Investigação (SEI) e Biossegurança", focusPoint: "Atividades investigativas nas Ciências da Natureza e segurança laboratorial.", keywords: ["SEI", "Biossegurança"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s2`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Didática Específica", title: "Alfabetização Científica e BNCC de Ciências da Natureza (Competências EM13CNT)", focusPoint: "As 3 competências gerais e habilidades estruturantes da BNCC Ensino Médio.", keywords: ["BNCC", "EM13CNT"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s3`, subject: "didatica", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Pedagógica", title: "Quadro Comparativo: Piaget vs Vygotsky vs Wallon no Ensino Médio", focusPoint: "ZDP, mediação semiótica, assimilação/acomodação e afetividade.", keywords: ["Piaget", "Vygotsky", "ZDP"], funeceIncidence: "Foco Máximo", estimatedMinutes: 30 },
            { id: `d${i+1}-s4`, subject: "didatica", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Pedagógica", title: "Tendências Pedagógicas & Avaliação Formativa: Doutrina Completa", focusPoint: "Crítico-social dos conteúdos, libertadora freireana e avaliação formativa.", keywords: ["Saviani", "Luckesi", "Hoffmann"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
            { id: `d${i+1}-s5`, subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Revisão Ética", title: "Código de Ética dos Servidores do Ceará (Decreto 31.198/2013) & ECA", focusPoint: "Comissão de ética, deveres éticos e direitos da criança/adolescente na escola.", keywords: ["Ética CE", "ECA"], funeceIncidence: "Foco Máximo", estimatedMinutes: 25 },
          ];
        } else if (dayOfWeek === 5) {
          dayThemeTitle = "Sexta Pré-Véspera: Caderno de Erros Definitivo e Mnemônicos";
          strategicObjective = "Passar a limpo todos os erros históricos de simulados e fixar os 10 mnemônicos essenciais.";
          milestoneTitle = "Divulgação dos Locais de Prova Confirmados";
          milestoneType = "local_prova";
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Biologia (Específica)", topicNumber: "Mnemônicos", title: "Revisão dos 10 Mnemônicos Mais Poderosos de Biologia FUNECE", focusPoint: "Mitose (PROMETA ANATELO), Meiose (LEZI PADIDI), Taxonomia (REFICOFAGE).", keywords: ["Mnemônicos", "Fixação"], funeceIncidence: "Memória", estimatedMinutes: 30 },
            { id: `d${i+1}-s2`, subject: "portugues", subjectLabel: "Língua Portuguesa", topicNumber: "Mnemônicos", title: "Lista de Palavras Críticas de Grafia, Crase e Regência da CEV-UECE", focusPoint: "Palavras homônimas e parônimas que a banca adora cobrar.", keywords: ["Pegadinhas UECE"], funeceIncidence: "Memória", estimatedMinutes: 25 },
            { id: `d${i+1}-s3`, subject: "legislacao", subjectLabel: "Legislação & Didática", topicNumber: "Mnemônicos", title: "Prazos e Artigos Críticos da LDB e Estatuto do Servidor do Ceará", focusPoint: "Prazos de licença, estágio probatório, horas de formação pedagógica.", keywords: ["Prazos Lei CE"], funeceIncidence: "Memória", estimatedMinutes: 25 },
          ];
        } else if (dayOfWeek === 6) {
          dayThemeTitle = "⭐ VÉSPERA DA PROVA: Revisão Leve, Separação de Materiais e Descanso Mental";
          strategicObjective = "Checagem de canetas pretas de tubo transparente, documento oficial com foto, hidratação e sono reparador.";
          milestoneTitle = "⭐ VÉSPERA DA PROVA: Separe caneta preta e documento!";
          milestoneType = "simulado";
          subs = [
            { id: `d${i+1}-s1`, subject: "biologia", subjectLabel: "Preparação Final", topicNumber: "Véspera", title: "Checklist Logístico: Documento com Foto, Caneta Preta Transparente e Cartão de Informação", focusPoint: "Checagem do endereço exato do local de prova e horário de abertura dos portões.", keywords: ["Checklist", "Logística", "Tranquilidade"], funeceIncidence: "Pré-Prova", estimatedMinutes: 20 },
            { id: `d${i+1}-s2`, subject: "biologia", subjectLabel: "Preparação Final", topicNumber: "Mental", title: "Descanso Ativo, Relaxamento e Sono Reparador (Mínimo 8 Horas)", focusPoint: "Evite esforço cognitivo pesado; mantenha a confiança no planejamento cumprido.", keywords: ["Descanso", "Sono", "Confiança"], funeceIncidence: "Alto Rendimento", estimatedMinutes: 30 },
          ];
        }
      } else {
        // Regular study weeks (Weeks 3 to 13)
        if (isStudyDay) {
          // Dynamic distribution of topics across the syllabus
          // Week 3: Molecular Biology & Genetics
          // Week 4: Genetics II & Evolution
          // Week 5: Zoology & Systematics
          // Week 6: Botany & Plant Physiology
          // Week 7: Human Anatomy & Physiology I
          // Week 8: Human Anatomy & Physiology II
          // Week 9: Ecology & Biodiversity Conservation
          // Week 10: Caatinga & CE Socioenvironmental Issues
          // Week 11: Biology & Health (Parasitology, Immunology, PSE)
          // Week 12: Teaching Methodologies, Lab Biosafety, Educational Indicators
          // Week 13: Science Literacy, BNCC/DCRC Competencies & Complete Syllabus Closure!
          
          const weekThemes: Record<number, { title: string; focus: string; bioTopics: [string, string, string]; portTopic: string; legTopic: string }> = {
            3: {
              title: "Biologia Molecular, Genética Mendeliana, Sintaxe e Financiamento da Educação",
              focus: "Dogma central (replicação/transcrição/tradução), 1ª Lei de Mendel, termos da oração e FUNDEB.",
              bioTopics: [
                "5.2 Replicação semiconservativa do DNA e transcrição em eucariontes (splicing)",
                "5.3 Código genético degenerado, tradução e regulação gênica (Operon Lac)",
                "6.1 1ª Lei de Mendel: Monoibridismo, codominância e cruzamento-teste"
              ],
              portTopic: "9.1 Emprego do sinal indicativo de crase (obrigatória, facultativa e proibida)",
              legTopic: "LDB e Financiamento da Educação: FUNDEB Permanente e Lei 14.113/2020",
            },
            4: {
              title: "Genética Avançada, Biotecnologia, Período Composto e Teorias da Aprendizagem",
              focus: "Linkage, grupos sanguíneos ABO/Rh, CRISPR, orações coordenadas/subordinadas e Piaget/Vygotsky.",
              bioTopics: [
                "6.2 Sistema ABO, Fator Rh, Eritroblastose Fetal e Herança Quantitativa",
                "6.3 Ligação gênica (Linkage), mapeamento cromossômico e mutações",
                "5.4 Biotecnologia: DNA recombinante, PCR, transgênicos e CRISPR-Cas9"
              ],
              portTopic: "10.1 Orações Coordenadas e Subordinadas na construção dos sentidos",
              legTopic: "Teorias da Aprendizagem: Piaget (Epistemologia Genética) e Vygotsky (Sócio-Interacionismo)",
            },
            5: {
              title: "Evolução Biológica, Sistemática, Termos Integrantes e Estatuto dos Servidores CE",
              focus: "Darwinismo, neodarwinismo, cladística, cladogramas, complementos verbais e Lei Estadual 9.826/74.",
              bioTopics: [
                "7.1 Lamarckismo, Darwinismo e Teoria Sintética da Evolução (Neodarwinismo)",
                "7.2 Seleção natural (direcional, estabilizadora, disruptiva) e especiação alopátrica",
                "8.1 Taxonomia de Lineu e Sistemática Filogenética (Cladística e Apomorfias)"
              ],
              portTopic: "11.1 Termos Integrantes da Oração: Objetos direto/indireto e complemento nominal",
              legTopic: "Estatuto dos Servidores Públicos Civis do Estado do Ceará (Lei Estadual nº 9.826/1974)",
            },
            6: {
              title: "Vírus, Bactérias, Protozoários, Fungos, Pontuação e Estatuto do Magistério CE",
              focus: "Ciclo lítico/lisogênico, estrutura bacteriana, regras de pontuação e Lei Estadual 10.884/84.",
              bioTopics: [
                "8.2 Vírus: Estrutura, ciclo lítico e lisogênico, retrovírus e príons",
                "8.3a Diversidade Procarionte: Bactérias, Arqueas e reprodução bacteriana",
                "8.3b Diversidade Eucarionte: Protozoários e Fungos (Micologia geral)"
              ],
              portTopic: "12.1 Emprego da Pontuação e Efeitos de Sentido (Vírgula, dois-pontos e travessão)",
              legTopic: "Estatuto do Magistério Oficial do Ceará (Lei Estadual nº 10.884/1984 e alterações)",
            },
            7: {
              title: "Zoologia dos Invertebrados e Cordados, Concordância e DCRC Ensino Médio",
              focus: "Poríferos a artrópodes, embriologia animal (celoma, blastóporo), concordância e DCRC CE.",
              bioTopics: [
                "8.3c Invertebrados I: Poríferos, Cnidários, Platelmintos e Nematódeos",
                "8.3d Invertebrados II: Anelídeos, Moluscos, Artrópodes e Equinodermos",
                "8.3e Cordados: Peixes, Anfíbios, Répteis, Aves e Mamíferos"
              ],
              portTopic: "13.1 Concordância Verbal e Nominal: Regras gerais e casos especiais da FUNECE",
              legTopic: "Documento Curricular Referencial do Ceará (DCRC): Fundamentos e Estrutura",
            },
            8: {
              title: "Morfologia e Fisiologia Vegetal, Regência e Planejamento Curricular",
              focus: "Tecidos vegetais (xilema/floema), ciclos de briófitas a angiospermas, regência e PPP.",
              bioTopics: [
                "10.1 Morfologia e tecidos vegetais: Meristemas, parênquimas, xilema e floema",
                "10.2 Briófitas, Pteridófitas, Gimnospermas e Angiospermas (dupla fecundação)",
                "10.3 Nutrição, transpiração e transporte vegetal (Teoria de Dixon e Münch)"
              ],
              portTopic: "14.1 Regência Verbal e Nominal: Verbos de alta recorrência em provas da banca",
              legTopic: "Currículo Escolar e Planejamento: Abordagens Críticas e Interdisciplinaridade",
            },
            9: {
              title: "Fitormônios, Fisiologia Humana I, Semântica e Código de Ética do Ceará",
              focus: "Auxinas, etileno, sistema digestório, cardiovascular e respiratório, semântica e Decreto 31.198/13.",
              bioTopics: [
                "10.4 Fitormônios (auxina, etileno, ácido abscísico) e fotoperiodismo vegetal",
                "9.1 Tecidos Epitelial, Conjuntivo, Muscular e Nervoso (Histologia Humana)",
                "9.2a Fisiologia dos Sistemas Digestório, Respiratório e Cardiovascular"
              ],
              portTopic: "15.1 Significação das Palavras: Sinonímia, antonímia, polissemia e ambiguidade",
              legTopic: "Código de Ética e Conduta da Administração Pública do Ceará (Decreto nº 31.198/2013)",
            },
            10: {
              title: "Fisiologia Humana II, Ecologia Geral, Funções da Linguagem e SPAECE/SAEB",
              focus: "Sistema excretor, endócrino, nervoso, nicho ecológico, cadeias tróficas e indicadores.",
              bioTopics: [
                "9.2b Fisiologia dos Sistemas Urinário (néfron), Nervoso e Endócrino (hormônios)",
                "11.1 Ecossistemas, habitat, nicho ecológico e princípio da exclusão de Gause",
                "11.2 Fluxo de energia, pirâmides ecológicas e produtividade primária (PPB/PPL)"
              ],
              portTopic: "16.1 Funções da Linguagem segundo Roman Jakobson (Emotiva, Conativa, Metalinguística)",
              legTopic: "Indicadores Educacionais: Análise dos Resultados do SPAECE, SAEB e IDEB no Ceará",
            },
            11: {
              title: "Ciclos Biogeoquímicos, Dinâmica Populacional, Figuras de Linguagem e Estatística",
              focus: "Ciclo do nitrogênio, curvas de crescimento populacional, sucessão ecológica e média/mediana.",
              bioTopics: [
                "11.2b Ciclos Biogeoquímicos: Água, Carbono, Nitrogênio e Fósforo",
                "11.3 Dinâmica de populações, potencial biótico e relações ecológicas harmônicas/desarmônicas",
                "11.4 Sucessão ecológica primária e secundária (ecese, seres e clímax)"
              ],
              portTopic: "15.2 Figuras de Linguagem: Metáfora, metonímia, antítese, paradoxo e ironia",
              legTopic: "Indicadores Educacionais: Estatística Descritiva Básica (Média, Mediana, Moda e Variância)",
            },
            12: {
              title: "Biodiversidade, Bioma Caatinga, Saúde/Parasitoses e Interpretação de Gráficos",
              focus: "Hotspots, Caatinga cearense, semiárido, PSE, imunologia, vacinas e leitura de gráficos.",
              bioTopics: [
                "11.5 e 11.6 Conservação da Biodiversidade, Unidades de Conservação (SNUC) e Impactos Ambientais",
                "13.1 e 13.2 Biomas Brasileiros e Ecologia da Caatinga Cearense (Adaptações xerofíticas)",
                "12.1 e 12.4 Programa Saúde na Escola (PSE), Imunologia e Vacinação vs Soros"
              ],
              portTopic: "Revisão Textual FUNECE: Inferência e Interpretação de Gêneros de Divulgação Científica",
              legTopic: "Indicadores Educacionais: Leitura e Interpretação de Gráficos, Tabelas e Dados Estatísticos",
            },
            13: {
              title: "Parasitoses Humanas, Didática da Biologia, BNCC/DCRC e FECHAMENTO DO EDITAL",
              focus: "Doenças de Chagas, calazar, ensino por investigação, competências EM13CNT e conclusão integral.",
              bioTopics: [
                "12.2 e 12.3 Doenças Virais/Bacterianas e Parasitoses Humanas no Ceará (Chagas, Calazar, Esquistossomose)",
                "14.1 e 14.2 Metodologias Ativas no Ensino de Biologia (SEI) e Biossegurança Laboratorial",
                "15.1, 16.1 e 17.1 Alfabetização Científica, Inclusão e Competências da BNCC/DCRC (EM13CNT)"
              ],
              portTopic: "Super Síntese de Língua Portuguesa: Mapeamento de Pegadinhas Gramaticais CEV-UECE",
              legTopic: "Síntese Doutrinária Final: LDB, CF/88, Leis do Ceará e Autores Pedagógicos",
            },
          };

          const curWeekData = weekThemes[weekNumber] || weekThemes[13];
          dayThemeTitle = `${curWeekData.title} (Dia ${dayOfWeek})`;
          strategicObjective = curWeekData.focus;

          subs = [
            {
              id: `w${weekNumber}d${dayOfWeek}-b1`,
              subject: "biologia",
              subjectLabel: "Biologia (Específica)",
              topicNumber: "Específica Bio",
              title: curWeekData.bioTopics[0],
              focusPoint: "Conceitos estruturantes e cobrança típica em concursos de professores da FUNECE.",
              keywords: ["Específica", "Biologia", "FUNECE"],
              funeceIncidence: "Altíssima (95%)",
              estimatedMinutes: 25,
            },
            {
              id: `w${weekNumber}d${dayOfWeek}-b2`,
              subject: "biologia",
              subjectLabel: "Biologia (Específica)",
              topicNumber: "Específica Bio",
              title: curWeekData.bioTopics[1],
              focusPoint: "Aprofundamento de mecanismos biológicos e esquemas gráficos.",
              keywords: ["Biologia", "Conceito", "Fixação"],
              funeceIncidence: "Cobrado em 100% das provas",
              estimatedMinutes: 25,
            },
            {
              id: `w${weekNumber}d${dayOfWeek}-b3`,
              subject: "biologia",
              subjectLabel: "Biologia (Específica)",
              topicNumber: "Específica Bio",
              title: curWeekData.bioTopics[2],
              focusPoint: "Resolução de itens aplicados e correlações socioambientais/didáticas.",
              keywords: ["Biologia", "Aplicação", "SEDUC-CE"],
              funeceIncidence: "Altíssima (95%)",
              estimatedMinutes: 25,
            },
            {
              id: `w${weekNumber}d${dayOfWeek}-p1`,
              subject: "portugues",
              subjectLabel: "Língua Portuguesa",
              topicNumber: "Língua Portuguesa",
              title: curWeekData.portTopic,
              focusPoint: "Análise sintática/semântica e resolução de questões de interpretação da CEV-UECE.",
              keywords: ["Português", "FUNECE", "Gramática"],
              funeceIncidence: "Cobrado em todas as provas",
              estimatedMinutes: 25,
            },
            {
              id: `w${weekNumber}d${dayOfWeek}-l1`,
              subject: "legislacao",
              subjectLabel: "Legislação & Didática",
              topicNumber: "Legislação / Didática",
              title: curWeekData.legTopic,
              focusPoint: "Leitura de artigos da lei, marcos regulatórios e autores pedagógicos de referência.",
              keywords: ["Legislação", "Didática", "Ceará"],
              funeceIncidence: "Cobrado em 100% das provas",
              estimatedMinutes: 25,
            },
          ];

          if (weekNumber === 13 && dayOfWeek === 5) {
            milestoneTitle = "🎉 CONCLUSÃO INTEGRAL DO EDITAL VERTICALIZADO (1 SEMANA ANTES DA PROVA)";
            milestoneType = "inscricao";
          }
        } else if (isReviewDay) {
          // Saturday: weekly question marathons / Simulado
          dayThemeTitle = `Sábado de Simulação e Revisão (Semana ${weekNumber})`;
          strategicObjective = "30 a 40 questões comentadas dos conteúdos estudados de segunda a sexta.";
          if (weekNumber === 11) {
            milestoneTitle = "🏆 SIMULADO GERAL OFICIAL 1: 80 Questões FUNECE (P1 + P2)";
            milestoneType = "simulado";
          } else if (weekNumber === 12) {
            milestoneTitle = "🏆 SIMULADO GERAL OFICIAL 2: 80 Questões + Treino Discursivo";
            milestoneType = "simulado";
          } else {
            milestoneTitle = `Maratona de Questões Semana ${weekNumber} (30 Itens FUNECE)`;
            milestoneType = "simulado";
          }

          subs = [
            {
              id: `w${weekNumber}d6-b1`,
              subject: "biologia",
              subjectLabel: "Biologia (Específica)",
              topicNumber: "Simulado Semanal",
              title: `Bateria de 20 Questões FUNECE de Biologia da Semana ${weekNumber}`,
              focusPoint: "Treino de velocidade e identificação de distratores da banca CEV-UECE.",
              keywords: ["Simulado", "Biologia", "Questões"],
              funeceIncidence: "Simulação Real",
              estimatedMinutes: 60,
            },
            {
              id: `w${weekNumber}d6-p1`,
              subject: "portugues",
              subjectLabel: "Língua Portuguesa",
              topicNumber: "Simulado Semanal",
              title: `Bateria de 5 Questões FUNECE de Língua Portuguesa da Semana ${weekNumber}`,
              focusPoint: "Interpretação e tópicos gramaticais trabalhados durante a semana.",
              keywords: ["Simulado", "Português"],
              funeceIncidence: "Simulação Real",
              estimatedMinutes: 30,
            },
            {
              id: `w${weekNumber}d6-l1`,
              subject: "legislacao",
              subjectLabel: "Legislação & Didática",
              topicNumber: "Simulado Semanal",
              title: `Bateria de 5 Questões FUNECE de Didática e Legislação do Ceará`,
              focusPoint: "Artigos de lei e doutrina pedagógica para fixação de conceitos.",
              keywords: ["Simulado", "Legislação"],
              funeceIncidence: "Simulação Real",
              estimatedMinutes: 30,
            },
          ];
        } else {
          // Sunday: Active rest and Error notebook
          dayThemeTitle = `Domingo de Recuperação, Caderno de Erros e Alinhamento da Semana ${weekNumber + 1}`;
          strategicObjective = "Descanso ativo, fixação de pontos fracos e preparação do plano semanal seguinte.";
          subs = [
            {
              id: `w${weekNumber}d0-r1`,
              subject: "biologia",
              subjectLabel: "Revisão Ativa",
              topicNumber: "Caderno de Erros",
              title: `Análise do Desempenho no Simulado e Registro no Caderno de Erros`,
              focusPoint: "Mapeamento dos motivos de cada erro (falta de atenção, lacuna teórica ou pegadinha).",
              keywords: ["Caderno de Erros", "Metacognição"],
              funeceIncidence: "Consolidação",
              estimatedMinutes: 45,
            }
          ];
        }
      }
    }

    const totalEstimatedMinutes = subs.reduce((acc, s) => acc + (s.estimatedMinutes || 25), 0);

    fullList.push({
      dayIndex: i + 1,
      dateKey,
      formattedDate: `${day}/${month}/${year}`,
      shortDate: `${day}/${month === "08" ? "Ago" : month === "09" ? "Set" : month === "10" ? "Out" : "Nov"}`,
      weekdayNumber: dayOfWeek,
      weekdayName: weekdayNames[dayOfWeek],
      weekdayShort: weekdayShorts[dayOfWeek],
      monthKey,
      monthName,
      weekNumber,
      phase,
      phaseColor,
      isStudyDay,
      isReviewDay,
      isRestRecoveryDay,
      isFinalReviewWeek,
      isExamDay,
      dayThemeTitle,
      strategicObjective,
      subtopics: subs,
      milestoneTitle,
      milestoneType,
      totalEstimatedMinutes,
    });
  }

  return fullList;
}
