import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  Filter,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Edit3,
  Save,
  Layers,
  Search,
  CheckSquare,
  ListTodo,
  Columns,
  Printer,
  PlusCircle,
  CalendarDays,
  Target,
  ArrowRight,
  Flame,
  Award,
  Check,
  Circle,
  X,
  Compass,
  BookmarkCheck,
  Milestone,
} from "lucide-react";
import { StudyTopic, TopicModule, SpecialtyId, UserProfile } from "../types";
import { SPECIALTIES } from "../data/specialties";
import { generateFullMasterSchedule, StructuredDayPlan, DailySubtopicItem } from "../data/dailyStructuredMasterSchedule";

interface ScheduleViewProps {
  topics: StudyTopic[];
  userProfile: UserProfile;
  onToggleTopicComplete: (topicId: string) => void;
  onToggleTopicDelayed: (topicId: string) => void;
  onUpdateTopicNotes: (topicId: string, notes: string) => void;
  onRemanejarAtrasados: () => void;
  onNavigateTab: (tab: string, extra?: any) => void;
  onOpenPrintScheduleModal: () => void;
  onAddNewCustomTopic?: (newTopic: Omit<StudyTopic, "id" | "isCompleted" | "isDelayed">) => void;
  onToggleSubtopic?: (topicId: string, subtopicId: string) => void;
  onOpenSyllabusExplorerModal?: () => void;
  isDarkMode?: boolean;
}

export interface RoadmapWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  formattedRange: string;
  phase: "Fase 1: Fundamentação e Cobertura Teórica" | "Fase 2: Aprofundamento Doutrinário & Leis CE" | "Fase 3: Reta Final, Simulados & Prova Prática";
  phaseColor: string;
  themeTitle: string;
  strategicFocus: string;
  topicsCovered: string[];
  recommendedHours: number;
  isExamWeek?: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  topics,
  userProfile,
  onToggleTopicComplete,
  onToggleTopicDelayed,
  onUpdateTopicNotes,
  onRemanejarAtrasados,
  onNavigateTab,
  onOpenPrintScheduleModal,
  onAddNewCustomTopic,
  onToggleSubtopic,
  onOpenSyllabusExplorerModal,
  isDarkMode = false,
}) => {
  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];

  // Sub-tabs: "dia_a_dia" | "jornada_ate_prova" | "conteudo_programatico" | "semanal"
  const [activeSubTab, setActiveSubTab] = useState<"dia_a_dia" | "jornada_ate_prova" | "conteudo_programatico" | "semanal">("dia_a_dia");
  const [selectedWeek, setSelectedWeek] = useState<number | "all">("all");
  const [selectedDay, setSelectedDay] = useState<number | "all">("all");
  const [selectedModule, setSelectedModule] = useState<TopicModule | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"todos" | "pendentes" | "concluidos" | "atrasados">("todos");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>("");
  const [expandedSubtopicsMap, setExpandedSubtopicsMap] = useState<Record<string, boolean>>({});

  // Daily Schedule Views & Month Navigation State (17/08/2026 to 22/11/2026)
  const [dailyMonthFilter, setDailyMonthFilter] = useState<"all" | "2026-08" | "2026-09" | "2026-10" | "2026-11">("all");
  const [dailyViewMode, setDailyViewMode] = useState<"timeline" | "calendar">("timeline");
  const [dailyStatusFilter, setDailyStatusFilter] = useState<"todos" | "pendentes" | "concluidos" | "simulados_marcos">("todos");
  const [selectedCalendarDayId, setSelectedCalendarDayId] = useState<string | null>(null);

  const toggleSubtopicsExpand = (topicId: string) => {
    setExpandedSubtopicsMap((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  // Add custom topic modal/form state
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);
  const [newTopicTitle, setNewTopicTitle] = useState<string>("");
  const [newTopicDesc, setNewTopicDesc] = useState<string>("");
  const [newTopicModule, setNewTopicModule] = useState<TopicModule>("conhecimentos_especificos");
  const [newTopicDay, setNewTopicDay] = useState<number>(1);
  const [newTopicMinutes, setNewTopicMinutes] = useState<number>(60);
  const [newTopicLaw, setNewTopicLaw] = useState<string>("");

  // Exam calculation: 22 de Novembro de 2026
  const examDate = new Date("2026-11-22T08:00:00");
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Current day of week: 0=Sun, 1=Mon, ..., 6=Sat
  const currentDayOfWeek = today.getDay();
  const todayScheduledDay = currentDayOfWeek === 0 ? 1 : currentDayOfWeek;
  const todayTopics = topics.filter((t) => t.scheduledDayOfWeek === todayScheduledDay);

  const daysOfWeek = [
    { day: 1, name: "Segunda", label: "Segunda-feira", short: "SEG" },
    { day: 2, name: "Terça", label: "Terça-feira", short: "TER" },
    { day: 3, name: "Quarta", label: "Quarta-feira", short: "QUA" },
    { day: 4, name: "Quinta", label: "Quinta-feira", short: "QUI" },
    { day: 5, name: "Sexta", label: "Sexta-feira", short: "SEX" },
    { day: 6, name: "Sábado", label: "Sábado (Revisão & Simulado)", short: "SÁB" },
  ];

  const modulesList: { id: TopicModule | "all"; name: string; badge: string; color: string }[] = [
    { id: "all", name: "Todos os Módulos", badge: "Geral", color: "emerald" },
    { id: "conhecimentos_especificos", name: `Específica: ${currentSpecialty.name}`, badge: "17 Tópicos • Peso 2", color: "emerald" },
    { id: "lingua_portuguesa", name: "Língua Portuguesa", badge: "16 Tópicos", color: "blue" },
    { id: "educacao_brasileira_didatica", name: "Educação Brasileira & Didática", badge: "10 Tópicos", color: "amber" },
    { id: "administracao_publica", name: "Administração Pública", badge: "11 Tópicos", color: "purple" },
    { id: "indicadores_educacionais", name: "Indicadores Educacionais", badge: "4 Tópicos", color: "cyan" },
    { id: "legislacao_educacional_ce", name: "Legislação SEDUC-CE", badge: "Leis & DCRC", color: "rose" },
  ];

  // 14 Weeks Complete Roadmap until 22 de Novembro de 2026
  const roadmapWeeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      startDate: "17/08/2026",
      endDate: "23/08/2026",
      formattedRange: "17/08 a 23/08/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Origem da Vida, Biologia Celular I & Fundamentos da Educação",
      strategicFocus: "Mapeamento dos conceitos de Miller-Urey, teoria celular, tipos de transporte de membrana, compreensão de texto FUNECE e Princípios da CF/88.",
      topicsCovered: [
        "1. Origem da Vida e Organização dos Seres Vivos (1.1 a 1.4)",
        "2. Biologia Celular: Organelas e Membrana Plasmática (2.1 a 2.3)",
        "Língua Portuguesa: Compreensão de Textos e Coesão/Coerência (Tópicos 1 e 2)",
        "Educação Brasileira: História da Educação e LDB 9.394/96 (Tópico 1)",
        "Administração Pública: Princípios Constitucionais LIMPE (Art. 37 CF/88)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 2,
      startDate: "24/08/2026",
      endDate: "30/08/2026",
      formattedRange: "24/08 a 30/08/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Ciclo Celular, Gametogênese & Tendências Pedagógicas",
      strategicFocus: "Mitose, Meiose, Gametogênese humana/animal, Tipologias textuais, Saviani (Histórico-Crítica) vs Libâneo (Crítico-Social) e CF/88 Arts. 37-41.",
      topicsCovered: [
        "2. Biologia Celular: Ciclo Celular, Mitose e Meiose (2.4 e 2.5)",
        "3. Reprodução e Desenvolvimento dos Seres Vivos (3.1 a 3.4)",
        "Língua Portuguesa: Tipologias e Gêneros Textuais (Tópicos 3 e 4)",
        "Educação Brasileira: Tendências Pedagógicas, Gestão Democrática e PPP (Tópico 2)",
        "Administração Pública: Reformas e Regime Constitucional dos Servidores (Tópicos 2 e 3)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 3,
      startDate: "31/08/2026",
      endDate: "06/09/2026",
      formattedRange: "31/08 a 06/09/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Bioquímica, Metabolismo Energético & Organização Didática",
      strategicFocus: "Glicólise, Ciclo de Krebs, Cadeia Respiratória, Fotossíntese (C3/C4/CAM), Morfossintaxe de Português, Didática e Processo Administrativo Federal.",
      topicsCovered: [
        "4. Bioquímica e Metabolismo Celular (4.1 a 4.4)",
        "Língua Portuguesa: Ortografia, Acentuação e Classes Gramaticais (Tópicos 5 a 7)",
        "Educação Brasileira: Organização do Processo Didático e Planejamento (Tópico 3)",
        "Administração Pública: Processo Administrativo Federal (Lei Federal nº 9.784/1999)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 4,
      startDate: "07/09/2026",
      endDate: "13/09/2026",
      formattedRange: "07/09 a 13/09/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Biologia Molecular, CRISPR & Psicologia do Desenvolvimento",
      strategicFocus: "Dogma Central da Biologia Molecular, Splicing, Engenharia Genética, Crase na FUNECE, Piaget vs Vygotsky vs Wallon e Adm Direta/Indireta.",
      topicsCovered: [
        "5. Biologia Molecular e Biotecnologia (5.1 a 5.4)",
        "Língua Portuguesa: Estrutura das Palavras e Emprego do Sinal de Crase (Tópicos 8 e 9)",
        "Educação Brasileira: Teorias da Aprendizagem e Desenvolvimento Infantil/Juvenil (Tópico 4)",
        "Administração Pública: Organização da Administração Direta e Indireta (Tópico 5)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 5,
      startDate: "14/09/2026",
      endDate: "20/09/2026",
      formattedRange: "14/09 a 20/09/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Genética Mendeliana, Linkage & BNCC no Ensino Médio",
      strategicFocus: "Leis de Mendel, Epistasia, Grupos ABO/Rh, Mapeamento cromossômico, Sintaxe do Período, Competências da BNCC e Controle da Adm Pública.",
      topicsCovered: [
        "6. Genética: Leis de Mendel, Interações Gênicas e Linkage (6.1 a 6.3)",
        "Língua Portuguesa: Relações de Coordenação, Subordinação e Sintaxe (Tópicos 10 e 11)",
        "Educação Brasileira: BNCC no Ensino Médio (Tópico 5)",
        "Administração Pública: Controle da Administração Pública e TCE-CE (Tópico 6)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 6,
      startDate: "21/09/2026",
      endDate: "27/09/2026",
      formattedRange: "21/09 a 27/09/2026",
      phase: "Fase 1: Fundamentação e Cobertura Teórica",
      phaseColor: "emerald",
      themeTitle: "Evolução Biológica, Hardy-Weinberg & Formação Docente",
      strategicFocus: "Teoria Sintética, Especiação, Genética de Populações, Pontuação e Concordância FUNECE, Professor Reflexivo (Donald Schön) e Poderes Administrativos.",
      topicsCovered: [
        "7. Evolução Biológica: Teorias, Especiação e Evolução Humana (7.1 a 7.4)",
        "Língua Portuguesa: Pontuação e Concordância Nominal/Verbal (Tópicos 12 e 13)",
        "Educação Brasileira: Formação Docente, Prática Reflexiva e Ética (Tópico 6)",
        "Administração Pública: Poderes da Administração Pública (Tópico 7)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 7,
      startDate: "28/09/2026",
      endDate: "04/10/2026",
      formattedRange: "28/09 a 04/10/2026",
      phase: "Fase 2: Aprofundamento Doutrinário & Leis CE",
      phaseColor: "blue",
      themeTitle: "Sistemática, Vírus, Zoologia & Tempo Integral no Ceará",
      strategicFocus: "Cladística, Reino Animal, Arboviroses, Regência e Semântica, Escolas em Tempo Integral (EEMTIs e EEEPs) no Ceará e Novo PNE (Lei 15.388/2026).",
      topicsCovered: [
        "8. Sistemática e Diversidade dos Seres Vivos (8.1 a 8.3)",
        "Língua Portuguesa: Regência Nominal/Verbal e Semântica (Tópicos 14 e 15)",
        "Educação Brasileira: Tempo Integral no Ceará e Itinerários Formativos (Tópico 7)",
        "Administração Pública: Plano Nacional de Educação (Lei Federal nº 15.388/2026)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 8,
      startDate: "05/10/2026",
      endDate: "11/10/2026",
      formattedRange: "05/10 a 11/10/2026",
      phase: "Fase 2: Aprofundamento Doutrinário & Leis CE",
      phaseColor: "blue",
      themeTitle: "Fisiologia Humana, SPAECE, SAEB & Estrutura do Ceará",
      strategicFocus: "Sistemas humanos integrados (cardiovascular, nervoso, endócrino), Funções da Linguagem, Avaliações em Larga Escala e Organização do Governo do CE.",
      topicsCovered: [
        "9. Anatomia e Fisiologia Humana: Histologia e Sistemas Biológicos (9.1 e 9.2)",
        "Língua Portuguesa: Funções da Linguagem e Gêneros Discursivos (Tópico 16)",
        "Educação Brasileira: Avaliações Externas: SPAECE, SAEB/IDEB e PISA (Tópico 8)",
        "Administração Pública: Modelo de Gestão e Estrutura do Estado do Ceará (Tópico 9)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 9,
      startDate: "12/10/2026",
      endDate: "18/10/2026",
      formattedRange: "12/10 a 18/10/2026",
      phase: "Fase 2: Aprofundamento Doutrinário & Leis CE",
      phaseColor: "blue",
      themeTitle: "Botânica, Fisiologia Vegetal & Indicadores do INEP",
      strategicFocus: "Xilema, Floema (Münch), Fitormônios, Fotoperiodismo, Indicadores do INEP (Distorção Idade-Série, Rendimento), Equidade no PNE e Código de Ética do CE.",
      topicsCovered: [
        "10. Botânica e Fisiologia Vegetal (10.1 a 10.4)",
        "Indicadores Educacionais: Conceitos e Indicadores do INEP (Tópico 1)",
        "Educação Brasileira: Políticas de Equidade no PNE 2026–2036 (Tópico 9)",
        "Administração Pública: Código de Ética e Conduta do Ceará (Tópico 10)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 10,
      startDate: "19/10/2026",
      endDate: "25/10/2026",
      formattedRange: "19/10 a 25/10/2026",
      phase: "Fase 2: Aprofundamento Doutrinário & Leis CE",
      phaseColor: "blue",
      themeTitle: "Ecologia, DCRC Ceará & Estatuto dos Servidores CE (Lei 9.826/74)",
      strategicFocus: "Ciclos Biogeoquímicos, Sucessão, Desempenho SPAECE/SAEB/ENEM, DCRC Ensino Médio e Leitura completa do Estatuto dos Servidores do Ceará.",
      topicsCovered: [
        "11. Ecologia, Conservação da Biodiversidade e Sustentabilidade (11.1 a 11.6)",
        "Indicadores Educacionais: Desempenho dos Estudantes SPAECE, SAEB, ENEM (Tópico 2)",
        "Educação Brasileira: Documento Curricular Referencial do Ceará - DCRC (Tópico 10)",
        "Administração Pública: Estatuto dos Servidores do Estado do Ceará (Lei Estadual nº 9.826/1974)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 11,
      startDate: "26/10/2026",
      endDate: "01/11/2026",
      formattedRange: "26/10 a 01/11/2026",
      phase: "Fase 2: Aprofundamento Doutrinário & Leis CE",
      phaseColor: "blue",
      themeTitle: "Saúde, Parasitoses & Interpretação de Gráficos e Estatística",
      strategicFocus: "PSE, Vacinas/Soros, Parasitoses (Chagas, Esquistossomose, Calazar), Resolução de Gráficos, Tabelas e Estatística Descritiva (Média, Mediana, Moda).",
      topicsCovered: [
        "12. Biologia e Saúde: PSE, Doenças, Parasitoses e Imunologia (12.1 a 12.5)",
        "Indicadores Educacionais: Leitura e Interpretação de Dados e Gráficos (Tópico 3)",
        "Indicadores Educacionais: Estatística Descritiva Aplicada à Educação (Tópico 4)",
        "Legislação Complementar SEDUC-CE e Resoluções CEE-CE",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 12,
      startDate: "02/11/2026",
      endDate: "08/11/2026",
      formattedRange: "02/11 a 08/11/2026",
      phase: "Fase 3: Reta Final, Simulados & Prova Prática",
      phaseColor: "amber",
      themeTitle: "Caatinga, Didática da Biologia & SIMULADO GERAL 1",
      strategicFocus: "Caatinga, Recursos Hídricos do Ceará, Metodologias de Ensino de Biologia, Laboratório e Biossegurança + SIMULADO 1 DE 80 QUESTÕES FUNECE.",
      topicsCovered: [
        "13. Biomas Brasileiros e Questões Socioambientais do Ceará (13.1 a 13.5)",
        "14. Abordagens Metodológicas e Recursos Didáticos em Biologia (14.1 e 14.2)",
        "SIMULADO GERAL 1: 40 Questões Gerais (P1) + 40 Questões Específicas (P2)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 13,
      startDate: "09/11/2026",
      endDate: "15/11/2026",
      formattedRange: "09/11 a 15/11/2026",
      phase: "Fase 3: Reta Final, Simulados & Prova Prática",
      phaseColor: "amber",
      themeTitle: "Natureza da Ciência, BNCC/DCRC & Plano de Aula da Prova Prática",
      strategicFocus: "Alfabetização Científica, Tecnologias e Inclusão, Competências EM13CNT, Montagem de Planos de Aula para a Prova Prática FUNECE + SIMULADO GERAL 2.",
      topicsCovered: [
        "15. Alfabetização Científica, Letramento e Natureza da Ciência (15.1 e 15.2)",
        "16. Currículo, Avaliação, Tecnologias Educacionais e Inclusão (16.1 e 16.2)",
        "17. Competências e Habilidades na BNCC e no DCRC de Biologia (17.1 e 17.2)",
        "SIMULADO GERAL 2 + Treino de Estruturação de Plano de Aula (Prova Didática)",
      ],
      recommendedHours: userProfile.hoursPerDay * 6,
    },
    {
      weekNumber: 14,
      startDate: "16/11/2026",
      endDate: "22/11/2026",
      formattedRange: "16/11 a 22/11/2026",
      phase: "Fase 3: Reta Final, Simulados & Prova Prática",
      phaseColor: "rose",
      themeTitle: "RETA FINAL & VÉSPERA DA PROVA (DOMINGO 22/11)",
      strategicFocus: "Revisão ultrarrápida dos 17 Tópicos de Específica, Macetes de Legislação CE, Caderno de Erros FUNECE e Preparação para o Domingo da Prova.",
      topicsCovered: [
        "Super Revisão dos 17 Tópicos de Específica de Biologia",
        "Macetes e Artigos Críticos da LDB, CF/88 e Estatuto do Ceará",
        "Caderno de Erros dos Simulados FUNECE",
        "22/11/2026 (DOMINGO): APLICAÇÃO DAS PROVAS OBJETIVAS E DISCURSIVA",
      ],
      recommendedHours: userProfile.hoursPerDay * 4,
      isExamWeek: true,
    },
  ];

  // Filtering topics
  const filteredTopics = useMemo(() => {
    return topics.filter((t) => {
      if (activeSubTab === "semanal" && selectedDay !== "all" && t.scheduledDayOfWeek !== selectedDay) {
        return false;
      }
      if (selectedModule !== "all" && t.moduleId !== selectedModule) {
        return false;
      }
      if (statusFilter === "pendentes" && t.isCompleted) return false;
      if (statusFilter === "concluidos" && !t.isCompleted) return false;
      if (statusFilter === "atrasados" && (!t.isDelayed || t.isCompleted)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesLaw = t.keyFormulasOrLaws && t.keyFormulasOrLaws.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesLaw) return false;
      }

      return true;
    });
  }, [topics, activeSubTab, selectedDay, selectedModule, statusFilter, searchQuery]);

  const totalCount = topics.length;
  const completedCount = topics.filter((t) => t.isCompleted).length;
  const delayedCount = topics.filter((t) => t.isDelayed && !t.isCompleted).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Grouped by module for the "Campo de Conteúdo Programático" view
  const groupedByModule = useMemo(() => {
    const modules: { id: TopicModule; name: string; weight: string; topics: StudyTopic[] }[] = [
      {
        id: "conhecimentos_especificos",
        name: `Conhecimentos Específicos: ${currentSpecialty.name}`,
        weight: "50 Questões • Específica",
        topics: filteredTopics.filter((t) => t.moduleId === "conhecimentos_especificos"),
      },
      {
        id: "lingua_portuguesa",
        name: "Língua Portuguesa",
        weight: "8 Questões • 16 Tópicos",
        topics: filteredTopics.filter((t) => t.moduleId === "lingua_portuguesa"),
      },
      {
        id: "administracao_publica",
        name: "Administração Pública",
        weight: "8 Questões • 11 Tópicos",
        topics: filteredTopics.filter((t) => t.moduleId === "administracao_publica"),
      },
      {
        id: "indicadores_educacionais",
        name: "Dados e Indicadores Educacionais",
        weight: "6 Questões • 4 Tópicos",
        topics: filteredTopics.filter((t) => t.moduleId === "indicadores_educacionais"),
      },
      {
        id: "educacao_brasileira_didatica",
        name: "Educação Brasileira & Temas Pedagógicos",
        weight: "8 Questões • 10 Tópicos",
        topics: filteredTopics.filter((t) => t.moduleId === "educacao_brasileira_didatica"),
      },
      {
        id: "legislacao_educacional_ce",
        name: "Legislação Complementar SEDUC-CE & DCRC",
        weight: "SEDUC-CE",
        topics: filteredTopics.filter((t) => t.moduleId === "legislacao_educacional_ce"),
      },
    ];
    return modules.filter((m) => m.topics.length > 0);
  }, [filteredTopics, currentSpecialty]);

  // Handle personal notes save
  const handleStartEditNotes = (topic: StudyTopic) => {
    setEditingNotesId(topic.id);
    setTempNotes(topic.notes || "");
  };

  const handleSaveNotes = (topicId: string) => {
    onUpdateTopicNotes(topicId, tempNotes);
    setEditingNotesId(null);
  };

  // Handle adding custom topic
  const handleCreateCustomTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    if (onAddNewCustomTopic) {
      onAddNewCustomTopic({
        moduleId: newTopicModule,
        moduleName:
          newTopicModule === "conhecimentos_especificos"
            ? `Específica: ${currentSpecialty.name}`
            : newTopicModule === "lingua_portuguesa"
            ? "Língua Portuguesa"
            : newTopicModule === "educacao_brasileira_didatica"
            ? "Educação Brasileira & Didática"
            : newTopicModule === "administracao_publica"
            ? "Administração Pública"
            : newTopicModule === "indicadores_educacionais"
            ? "Indicadores Educacionais"
            : "Legislação SEDUC-CE",
        title: newTopicTitle.trim(),
        description: newTopicDesc.trim() || "Tópico personalizado adicionado pelo professor para o edital FUNECE.",
        specialtyId: newTopicModule === "conhecimentos_especificos" ? userProfile.specialty : undefined,
        importanceInFunece: "Alta",
        estimatedMinutes: newTopicMinutes,
        scheduledDayOfWeek: newTopicDay,
        keyFormulasOrLaws: newTopicLaw.trim() || undefined,
      });
    }

    setNewTopicTitle("");
    setNewTopicDesc("");
    setNewTopicLaw("");
    setIsAddingTopic(false);
  };

  // Master Daily Schedule with structured ~5 subtopics per day (3 Bio + 1 Port + 1 Leg)
  const masterDayPlans = useMemo(() => generateFullMasterSchedule(), []);

  // Track checked state of individual daily subtopics with local storage persistence
  const [checkedSubtopicIds, setCheckedSubtopicIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("seduc_master_subtopics_checked");
      return stored ? new Set(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const handleToggleMasterSubtopic = (subtopicId: string) => {
    setCheckedSubtopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(subtopicId)) {
        next.delete(subtopicId);
      } else {
        next.add(subtopicId);
      }
      try {
        localStorage.setItem("seduc_master_subtopics_checked", JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Generate Complete Daily Schedule from 17/08/2026 (Week 1 Monday) to 22/11/2026 (Exam Day Sunday) - 98 Days Total
  const fullDailySchedule = useMemo(() => {
    const todayDateKey = today.toISOString().split("T")[0];

    return masterDayPlans.map((plan, i) => {
      const isToday = plan.dateKey === todayDateKey;
      const d = new Date(2026, 7, 17);
      d.setDate(d.getDate() + i);

      const diffFromToday = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const isPast = diffFromToday < 0;
      const isTomorrow = diffFromToday === 1;
      const isSimuladoDay = plan.weekdayNumber === 6 && !plan.isExamDay;

      // Map corresponding syllabus topics for this day of week
      const assignedTopics = topics.filter((t) => t.scheduledDayOfWeek === plan.weekdayNumber);

      // Check subtopic completion for this day
      const daySubtopics = plan.subtopics.map((s) => ({
        ...s,
        isCompleted: checkedSubtopicIds.has(s.id),
      }));

      const completedSubCount = daySubtopics.filter((s) => s.isCompleted).length;
      const totalSubCount = daySubtopics.length;
      const isAllSubtopicsCompleted = totalSubCount > 0 && completedSubCount === totalSubCount;

      return {
        id: `day-${plan.dateKey}`,
        date: d,
        dateKey: plan.dateKey,
        formattedDate: plan.formattedDate,
        shortDate: plan.shortDate,
        dayOfWeek: plan.weekdayNumber,
        dayOfWeekName: plan.weekdayName,
        dayOfWeekShort: plan.weekdayShort,
        dayOfMonth: d.getDate(),
        monthKey: plan.monthKey,
        monthName: plan.monthName,
        dayNumber: plan.dayIndex,
        weekNumber: plan.weekNumber,
        phase: plan.phase,
        phaseColor: plan.phaseColor,
        isToday,
        isTomorrow,
        isPast,
        isExamDay: plan.isExamDay,
        isSimuladoDay,
        milestoneTitle: plan.milestoneTitle,
        milestoneType: plan.milestoneType,
        dayThemeTitle: plan.dayThemeTitle,
        strategicObjective: plan.strategicObjective,
        structuredSubtopics: daySubtopics,
        completedSubCount,
        totalSubCount,
        isAllSubtopicsCompleted,
        topics: assignedTopics,
        focusDescription: plan.strategicObjective,
        estimatedMinutes: plan.totalEstimatedMinutes,
      };
    });
  }, [masterDayPlans, checkedSubtopicIds, topics, today]);

  // Filtered daily schedule list based on month, status, and search query
  const filteredDailyList = useMemo(() => {
    return fullDailySchedule.filter((item) => {
      // Month filter
      if (dailyMonthFilter !== "all" && item.monthKey !== dailyMonthFilter) {
        return false;
      }

      // Status filter
      if (dailyStatusFilter === "pendentes") {
        const hasPending = item.topics.some((t) => !t.isCompleted);
        if (!hasPending && item.topics.length > 0) return false;
      } else if (dailyStatusFilter === "concluidos") {
        const allCompleted = item.topics.length > 0 && item.topics.every((t) => t.isCompleted);
        if (!allCompleted) return false;
      } else if (dailyStatusFilter === "simulados_marcos") {
        if (!item.milestoneTitle && !item.isSimuladoDay && !item.isExamDay) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesDate = item.formattedDate.includes(q) || item.dayOfWeekName.toLowerCase().includes(q);
        const matchesMilestone = item.milestoneTitle && item.milestoneTitle.toLowerCase().includes(q);
        const matchesTopics = item.topics.some((t) => t.title.toLowerCase().includes(q) || t.moduleName.toLowerCase().includes(q));
        if (!matchesDate && !matchesMilestone && !matchesTopics) return false;
      }

      return true;
    });
  }, [fullDailySchedule, dailyMonthFilter, dailyStatusFilter, searchQuery]);

  // Completed days count (days where all scheduled topics are completed)
  const completedDaysCount = useMemo(() => {
    return fullDailySchedule.filter(
      (d) => d.topics.length > 0 && d.topics.every((t) => t.isCompleted)
    ).length;
  }, [fullDailySchedule]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Main Header Card */}
      <div
        className={`rounded-2xl border p-6 transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white shadow-xl"
            : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2.5">
              <span>Cronograma de Estudos</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                {currentSpecialty.name}
              </span>
            </h1>
          </div>

          {/* Action Buttons & Progress */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenSyllabusExplorerModal && (
              <button
                onClick={onOpenSyllabusExplorerModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-400 font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 group"
                title="Explorar subtópicos e detalhes do edital"
              >
                <Layers className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Explorar Subtópicos</span>
              </button>
            )}

            <button
              onClick={onOpenPrintScheduleModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir PDF</span>
            </button>

            {delayedCount > 0 && (
              <button
                onClick={onRemanejarAtrasados}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Remanejar ({delayedCount})</span>
              </button>
            )}

            {/* Quick Progress */}
            <div
              className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Progresso</div>
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {completedCount}/{totalCount} ({progressPercent}%)
                </div>
              </div>
              <div className="w-16 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div
          className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
            isDarkMode ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab("dia_a_dia")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === "dia_a_dia"
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Cronograma Diário (Hoje até 22/11)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("jornada_ate_prova")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === "jornada_ate_prova"
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Jornada (14 Semanas)</span>
            </button>

            <button
              onClick={() => setActiveSubTab("conteudo_programatico")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === "conteudo_programatico"
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edital Verticalizado</span>
            </button>

            <button
              onClick={() => setActiveSubTab("semanal")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === "semanal"
                  ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Grade Semanal</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar no edital ou dias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none transition-colors ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-emerald-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500"
              }`}
            />
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: JORNADA ATÉ A PROVA (14 SEMANAS DE PLANEJAMENTO COMPLETO ATÉ 22/11/2026) */}
      {activeSubTab === "jornada_ate_prova" && (
        <div className="space-y-6">
          {/* Phase Summary Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <div className="font-bold text-xs">Fase 1 • Fundamentação</div>
                <div className="text-[11px] text-slate-400">Semanas 1 a 6 • Teoria & Autores</div>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
              <div>
                <div className="font-bold text-xs">Fase 2 • Aprofundamento</div>
                <div className="text-[11px] text-slate-400">Semanas 7 a 11 • Legislação CE & Indicadores</div>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <div>
                <div className="font-bold text-xs">Fase 3 • Reta Final</div>
                <div className="text-[11px] text-slate-400">Semanas 12 a 14 • Simulados Gerais</div>
              </div>
            </div>
          </div>

          {/* 14 Weeks Sequence Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Milestone className="w-5 h-5 text-emerald-500" />
                <span>Roteiro Semana a Semana até o Dia da Prova (22/11/2026)</span>
              </h2>
              <span className="text-xs font-bold text-slate-400">14 Semanas Estratégicas</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {roadmapWeeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                    week.isExamWeek
                      ? isDarkMode
                        ? "bg-gradient-to-r from-rose-950/40 to-slate-900 border-rose-500/50 shadow-md"
                        : "bg-gradient-to-r from-rose-50 to-white border-rose-300 shadow-sm"
                      : isDarkMode
                      ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                      : "bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 mb-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                          week.isExamWeek
                            ? "bg-rose-600 text-white shadow-lg shadow-rose-950/30"
                            : week.weekNumber <= 6
                            ? "bg-emerald-600 text-white"
                            : week.weekNumber <= 11
                            ? "bg-blue-600 text-white"
                            : "bg-amber-600 text-white"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider leading-none">SEM</span>
                        <span className="text-lg font-black leading-tight">{week.weekNumber}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              week.isExamWeek
                                ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                                : week.weekNumber <= 6
                                ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                                : week.weekNumber <= 11
                                ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                                : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {week.phase}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            📅 {week.formattedRange}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black">
                          {week.themeTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Meta Semanal</div>
                        <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                          {week.recommendedHours} Horas
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Focus */}
                  <div
                    className={`p-3 rounded-xl border text-xs leading-relaxed mb-4 ${
                      isDarkMode ? "bg-slate-850/80 border-slate-750 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <strong className="text-emerald-600 dark:text-emerald-400">Foco Estratégico da Semana: </strong>
                    {week.strategicFocus}
                  </div>

                  {/* Topics Covered Checklist */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Conteúdos & Tópicos a Cobrir:
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {week.topicsCovered.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border flex items-start gap-2 text-xs ${
                            isDarkMode ? "bg-slate-950/40 border-slate-800/80" : "bg-white border-slate-200"
                          }`}
                        >
                          <BookmarkCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Actions on week card */}
                  <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-slate-400">
                      Progresso estimado: {week.weekNumber <= 2 ? "Em andamento" : "Planejado"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab("simulados")}
                        className="px-3 py-1.5 rounded-lg font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Treinar Questões FUNECE</span>
                      </button>

                      <button
                        onClick={() => onNavigateTab("materiais")}
                        className="px-3 py-1.5 rounded-lg font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Resumos & Leis em PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: METAS DIÁRIAS (DIA A DIA COMPLETO DE HOJE ATÉ 22/11/2026) */}
      {activeSubTab === "dia_a_dia" && (
        <div className="space-y-6">
          {/* Main Daily Overview & Countdown Card */}
          <div
            className={`rounded-2xl border p-6 sm:p-7 relative overflow-hidden transition-all ${
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/40 border-slate-800 text-white shadow-xl"
                : "bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 border-emerald-700 text-white shadow-md"
            }`}
          >
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-400/30">
                    Cronograma Diário Completo
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-400/30">
                    Prova: 22 de Novembro de 2026
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                  Planejamento Diário de Estudos • {currentSpecialty.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Roteiro estruturado de <strong>17/08/2026 até 22/11/2026 (98 dias)</strong> cobrindo todo o edital FUNECE / SEDUC-CE, com metas diárias de {userProfile.hoursPerDay}h, simulados aos sábados e revisões ativas.
                </p>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    onClick={() => {
                      setDailyMonthFilter("all");
                      setDailyStatusFilter("todos");
                      // Scroll to today element
                      const el = document.getElementById(`day-${today.toISOString().split("T")[0]}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black shadow-sm transition-all active:scale-95"
                  >
                    <Target className="w-3.5 h-3.5 text-emerald-700" />
                    <span>📍 Ir para Hoje ({new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })})</span>
                  </button>

                  <button
                    onClick={() => setDailyMonthFilter("2026-11")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/30 hover:bg-amber-500/40 border border-amber-400/40 text-amber-200 text-xs font-bold transition-all active:scale-95"
                  >
                    <span>🎯 Ver Reta Final (Novembro)</span>
                  </button>

                  <button
                    onClick={onOpenPrintScheduleModal}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 text-xs font-black shadow-sm transition-all active:scale-95"
                    title="Imprimir ou Salvar em PDF o cronograma diário"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-950" />
                    <span>🖨️ Imprimir / Salvar PDF</span>
                  </button>

                  <button
                    onClick={() => setDailyStatusFilter("simulados_marcos")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-200 text-xs font-bold transition-all active:scale-95"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>🏆 Simulados & Marcos</span>
                  </button>
                </div>
              </div>

              {/* Progress Counters */}
              <div className="grid grid-cols-3 gap-3 shrink-0">
                <div className="bg-black/35 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[85px]">
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {daysUntilExam}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-300">Dias Restantes</div>
                </div>

                <div className="bg-black/35 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[85px]">
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    98
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-300">Dias Totais</div>
                </div>

                <div className="bg-black/35 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[85px]">
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    {completedDaysCount}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-300">Dias Concluídos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Official Exam Breakdown Architecture Card */}
          <div
            className={`rounded-2xl border p-4 transition-all ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-800 text-white"
                : "bg-slate-50 border-slate-200 text-slate-900 shadow-sm"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Estrutura Oficial da Prova SEDUC-CE (80 Questões)
                  </div>
                  <div className="text-sm font-bold">
                    30 Questões Básicas + 50 Questões Específicas
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono font-bold">
                  Banca CEV-UECE / FUNECE
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-700 dark:text-rose-300 font-mono font-bold">
                  22/11/2026
                </span>
              </div>
            </div>

            {/* Disciplines Question Count Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-3">
              {/* Específica */}
              <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-400">
                  Específica ({currentSpecialty.shortName})
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                  50 <span className="text-[10px] font-bold text-slate-500 uppercase">questões</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  17 Tópicos Aprofundados
                </div>
              </div>

              {/* Português */}
              <div className="p-2.5 rounded-xl border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="text-[10px] font-black uppercase text-blue-800 dark:text-blue-400">
                  Língua Portuguesa
                </div>
                <div className="text-xl font-black text-blue-700 dark:text-blue-300 font-mono">
                  08 <span className="text-[10px] font-bold text-slate-500 uppercase">questões</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Gramática & Texto UECE
                </div>
              </div>

              {/* Adm Pública */}
              <div className="p-2.5 rounded-xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20">
                <div className="text-[10px] font-black uppercase text-purple-800 dark:text-purple-400">
                  Administração Pública
                </div>
                <div className="text-xl font-black text-purple-700 dark:text-purple-300 font-mono">
                  08 <span className="text-[10px] font-bold text-slate-500 uppercase">questões</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  CF/88 & Leis Estaduais CE
                </div>
              </div>

              {/* Dados e Indicadores */}
              <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-50/50 dark:bg-cyan-950/20">
                <div className="text-[10px] font-black uppercase text-cyan-800 dark:text-cyan-400">
                  Dados e Indicadores
                </div>
                <div className="text-xl font-black text-cyan-700 dark:text-cyan-300 font-mono">
                  06 <span className="text-[10px] font-bold text-slate-500 uppercase">questões</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  SPAECE, SAEB, Gráficos
                </div>
              </div>

              {/* Educação Brasileira */}
              <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400">
                  Educação & Didática
                </div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-300 font-mono">
                  08 <span className="text-[10px] font-bold text-slate-500 uppercase">questões</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  LDB, DCRC & Autores
                </div>
              </div>
            </div>
          </div>

          {/* Month Navigator Pills */}
          <div
            className={`rounded-2xl border p-4 transition-all ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Month Tabs */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filtrar Mês:</span>
                </span>

                <button
                  onClick={() => setDailyMonthFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyMonthFilter === "all"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  🌟 Todos (98 Dias)
                </button>

                <button
                  onClick={() => setDailyMonthFilter("2026-08")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyMonthFilter === "2026-08"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Agosto (17 a 31/08)
                </button>

                <button
                  onClick={() => setDailyMonthFilter("2026-09")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyMonthFilter === "2026-09"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Setembro (01 a 30/09)
                </button>

                <button
                  onClick={() => setDailyMonthFilter("2026-10")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyMonthFilter === "2026-10"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Outubro (01 a 31/10)
                </button>

                <button
                  onClick={() => setDailyMonthFilter("2026-11")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    dailyMonthFilter === "2026-11"
                      ? "bg-rose-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  🎯 Novembro (Reta Final & Prova)
                </button>
              </div>

              {/* View Mode Switcher (Timeline vs Calendar Grid) & Status Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status selector */}
                <select
                  value={dailyStatusFilter}
                  onChange={(e) => setDailyStatusFilter(e.target.value as any)}
                  className={`text-xs px-2.5 py-1.5 rounded-xl border font-bold outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-200 text-slate-800"
                  }`}
                >
                  <option value="todos">Todos os Dias</option>
                  <option value="pendentes">Apenas Pendentes</option>
                  <option value="concluidos">Apenas Concluídos</option>
                  <option value="simulados_marcos">Simulados & Marcos</option>
                </select>

                {/* View Mode toggle */}
                <div
                  className={`p-1 rounded-xl border flex items-center gap-1 ${
                    isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <button
                    onClick={() => setDailyViewMode("timeline")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      dailyViewMode === "timeline"
                        ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                    title="Exibir em lista corrida detalhada"
                  >
                    <ListTodo className="w-3.5 h-3.5" />
                    <span>Lista</span>
                  </button>

                  <button
                    onClick={() => setDailyViewMode("calendar")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      dailyViewMode === "calendar"
                        ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                    title="Exibir em grade de calendário mensal"
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>Calendário</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card: META DE HOJE (DESTAQUE PRIORITÁRIO COM ~5 SUBTÓPICOS) */}
          {(() => {
            const todayKey = today.toISOString().split("T")[0];
            const currentDayPlan = fullDailySchedule.find((d) => d.dateKey === todayKey) || fullDailySchedule[0];
            const currentDaySubtopics = currentDayPlan?.structuredSubtopics || [];

            return (
              <div
                id={`day-${todayKey}`}
                className={`rounded-2xl border p-6 sm:p-7 relative overflow-hidden transition-all ${
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950/50 border-emerald-500/40 text-white shadow-lg ring-1 ring-emerald-500/20"
                    : "bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white border-emerald-300 text-slate-900 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider">
                          HOJE • DIA {currentDayPlan?.dayNumber || 1}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                          {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black mt-0.5">
                        Meta do Dia: {currentDayPlan?.dayThemeTitle || "Estudo Diário Estruturado"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Progresso de Hoje:
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-black text-xs font-mono">
                      {currentDayPlan?.completedSubCount || 0} / {currentDayPlan?.totalSubCount || 5} Subtópicos
                    </span>
                  </div>
                </div>

                {currentDaySubtopics.length === 0 ? (
                  <div className="text-center py-6 text-slate-400">
                    <CheckCircle2 className="w-9 h-9 mx-auto text-emerald-500 mb-2" />
                    <div className="text-sm font-bold text-slate-200">Dia de Revisão Ativa ou Simulado FUNECE!</div>
                    <p className="text-xs mt-1">Aproveite para revisar seu caderno de erros e treinar questões comentadas da banca CEV/UECE.</p>
                    <button
                      onClick={() => onNavigateTab("simulados")}
                      className="mt-3 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
                    >
                      Fazer Simulado FUNECE Agora
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Rotina Diária (~5 Subtópicos: 3 Biologia + 1 Português + 1 Legislação/Didática):</span>
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                        {currentDayPlan?.strategicObjective}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {currentDaySubtopics.map((sub) => {
                        const isDone = sub.isCompleted;
                        const isBio = sub.subject === "biologia";
                        const isPort = sub.subject === "portugues";

                        return (
                          <div
                            key={sub.id}
                            className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                              isDone
                                ? isDarkMode
                                  ? "bg-slate-950/60 border-slate-800 opacity-70"
                                  : "bg-slate-100 border-slate-200 opacity-70"
                                : isDarkMode
                                ? "bg-slate-850/90 border-slate-750 hover:border-emerald-500/50"
                                : "bg-white border-slate-200 hover:border-emerald-400 shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <button
                                onClick={() => handleToggleMasterSubtopic(sub.id)}
                                className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                  isDone
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow"
                                    : isDarkMode
                                    ? "border-slate-600 hover:border-emerald-400 text-transparent"
                                    : "border-slate-400 hover:border-emerald-500 text-transparent"
                                }`}
                                title={isDone ? "Desmarcar subtópico" : "Marcar como estudado hoje"}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                      isBio
                                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                        : isPort
                                        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                        : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                    }`}
                                  >
                                    {sub.subjectLabel}
                                  </span>
                                  <span className="text-[9px] font-mono text-slate-400">{sub.topicNumber}</span>
                                  <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                    {sub.funeceIncidence}
                                  </span>
                                </div>

                                <h4
                                  className={`text-xs sm:text-sm font-bold leading-snug cursor-pointer ${
                                    isDone ? "line-through text-slate-500" : ""
                                  }`}
                                  onClick={() => handleToggleMasterSubtopic(sub.id)}
                                >
                                  {sub.title}
                                </h4>

                                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                  {sub.focusPoint}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-1.5 shrink-0">
                              <button
                                onClick={() => onNavigateTab("simulados", { topic: sub.title })}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                              >
                                Questões
                              </button>
                              <button
                                onClick={() => onNavigateTab("materiais", { topicTitle: sub.title })}
                                className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                              >
                                Resumo
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* VIEW MODE 1: TIMELINE LIST OF ALL DAYS (17/08 to 22/11/2026) */}
          {dailyViewMode === "timeline" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-emerald-500" />
                  <span>
                    {dailyMonthFilter === "all"
                      ? "Cronograma Diário Completo (98 Dias • 17 de Agosto a 22 de Novembro de 2026)"
                      : `Cronograma Diário de ${
                          dailyMonthFilter === "2026-08"
                            ? "Agosto / 2026"
                            : dailyMonthFilter === "2026-09"
                            ? "Setembro / 2026"
                            : dailyMonthFilter === "2026-10"
                            ? "Outubro / 2026"
                            : "Novembro / 2026 (Reta Final & Prova)"
                        }`}
                  </span>
                </h3>
                <span className="text-xs text-slate-400 font-mono font-bold">
                  {filteredDailyList.length} dias exibidos
                </span>
              </div>

              {filteredDailyList.length === 0 ? (
                <div
                  className={`p-10 rounded-2xl border text-center ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  <Search className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <div className="text-sm font-bold">Nenhum dia encontrado para os filtros selecionados.</div>
                  <button
                    onClick={() => {
                      setDailyMonthFilter("all");
                      setDailyStatusFilter("todos");
                      setSearchQuery("");
                    }}
                    className="mt-3 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredDailyList.map((dayItem) => {
                    const isCompleted = dayItem.topics.length > 0 && dayItem.topics.every((t) => t.isCompleted);

                    return (
                      <div
                        key={dayItem.id}
                        id={dayItem.id}
                        className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                          dayItem.isExamDay
                            ? isDarkMode
                              ? "bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/40 border-rose-500/70 shadow-xl ring-1 ring-rose-500/40"
                              : "bg-gradient-to-r from-rose-50 via-amber-50 to-white border-rose-400 shadow-md ring-1 ring-rose-300"
                            : dayItem.isToday
                            ? isDarkMode
                              ? "bg-slate-900 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/30"
                              : "bg-emerald-50/70 border-emerald-400 shadow-md ring-1 ring-emerald-300"
                            : isDarkMode
                            ? "bg-slate-900 border-slate-800 text-white hover:border-slate-700"
                            : "bg-white border-slate-200 text-slate-900 shadow-sm hover:border-slate-300"
                        }`}
                      >
                        {/* Day Card Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mb-4">
                          <div className="flex items-center gap-3">
                            {/* Day Number Badge */}
                            <div
                              className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                                dayItem.isExamDay
                                  ? "bg-rose-600 text-white shadow-md animate-pulse"
                                  : dayItem.isToday
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : dayItem.isSimuladoDay
                                  ? "bg-amber-600 text-white"
                                  : isDarkMode
                                  ? "bg-slate-800 text-slate-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span className="text-[9px] uppercase font-bold tracking-wider leading-none">DIA</span>
                              <span className="text-base font-black leading-tight">{dayItem.dayNumber}</span>
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-base font-black">
                                  {dayItem.dayOfWeekName}, {dayItem.formattedDate}
                                </h4>

                                {dayItem.isToday && (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase">
                                    Hoje
                                  </span>
                                )}

                                {dayItem.isTomorrow && (
                                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 text-[9px] font-black uppercase">
                                    Amanhã
                                  </span>
                                )}

                                {dayItem.isPast && !dayItem.isToday && (
                                  <span className="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 text-[9px] font-bold uppercase">
                                    Anterior
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                                <span>Semana {dayItem.weekNumber}</span>
                                <span>•</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                  {dayItem.phase}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Day Status & Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {dayItem.topics.length > 0 && (
                              <span
                                className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                                  isCompleted
                                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                                    : "bg-slate-500/15 text-slate-400"
                                }`}
                              >
                                {isCompleted ? "✅ Concluído" : "⏳ Planejado"}
                              </span>
                            )}

                            <span className="text-xs font-mono font-bold text-slate-400">
                              ~{dayItem.estimatedMinutes} min
                            </span>
                          </div>
                        </div>

                        {/* Milestone Tag / Alert (If any) */}
                        {dayItem.milestoneTitle && (
                          <div
                            className={`p-3 rounded-xl border mb-3.5 flex items-start gap-2.5 text-xs font-bold ${
                              dayItem.milestoneType === "exam"
                                ? "bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400"
                                : dayItem.milestoneType === "simulado"
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400"
                                : dayItem.milestoneType === "local_prova"
                                ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400"
                                : "bg-purple-500/15 border-purple-500/30 text-purple-600 dark:text-purple-400"
                            }`}
                          >
                            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <span>{dayItem.milestoneTitle}</span>
                            </div>
                          </div>
                        )}

                        {/* Day Theme and Strategic Focus */}
                        <div
                          className={`p-3 rounded-xl border mb-3.5 text-xs leading-relaxed ${
                            isDarkMode ? "bg-slate-850/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                            <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5 text-emerald-500" />
                              <span>{dayItem.dayThemeTitle}</span>
                            </span>
                            {dayItem.structuredSubtopics && dayItem.structuredSubtopics.length > 0 && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono">
                                {dayItem.completedSubCount} de {dayItem.totalSubCount} Subtópicos Concluídos ({Math.round((dayItem.completedSubCount / Math.max(1, dayItem.totalSubCount)) * 100)}%)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            <strong>Objetivo Estratégico:</strong> {dayItem.strategicObjective || dayItem.focusDescription}
                          </p>
                        </div>

                        {/* Structured Subtopics List (~5 Subtópicos Diários: 3 Bio + 1 Port + 1 Leg) */}
                        {dayItem.structuredSubtopics && dayItem.structuredSubtopics.length > 0 ? (
                          <div className="space-y-2">
                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
                              <span className="flex items-center gap-1">
                                <Layers className="w-3 h-3 text-emerald-500" />
                                <span>Subtópicos da Rotina Diária (~5 Itens FUNECE):</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Clique para marcar como concluído
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {dayItem.structuredSubtopics.map((sub) => {
                                const isSubDone = sub.isCompleted;
                                const isBio = sub.subject === "biologia";
                                const isPort = sub.subject === "portugues";

                                return (
                                  <div
                                    key={sub.id}
                                    className={`p-3 rounded-xl border flex items-start justify-between gap-3 text-xs transition-all ${
                                      isSubDone
                                        ? isDarkMode
                                          ? "bg-slate-950/40 border-slate-800/80 opacity-75"
                                          : "bg-slate-100/90 border-slate-200 opacity-75"
                                        : isDarkMode
                                        ? "bg-slate-850/80 border-slate-750 hover:border-emerald-500/40"
                                        : "bg-white border-slate-200 hover:border-emerald-300 shadow-sm"
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <button
                                        onClick={() => handleToggleMasterSubtopic(sub.id)}
                                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                          isSubDone
                                            ? "bg-emerald-500 border-emerald-400 text-white shadow"
                                            : isDarkMode
                                            ? "border-slate-600 hover:border-emerald-400 text-transparent"
                                            : "border-slate-400 hover:border-emerald-500 text-transparent"
                                        }`}
                                        title={isSubDone ? "Desmarcar subtópico" : "Marcar subtópico como concluído"}
                                      >
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      </button>

                                      <div className="space-y-1 flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span
                                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                              isBio
                                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                                : isPort
                                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                                                : "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                            }`}
                                          >
                                            {sub.subjectLabel}
                                          </span>
                                          <span className="text-[9px] font-mono text-slate-400">
                                            {sub.topicNumber}
                                          </span>
                                          <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                            {sub.funeceIncidence}
                                          </span>
                                        </div>

                                        <div
                                          className={`font-bold text-xs sm:text-sm leading-snug cursor-pointer ${
                                            isSubDone ? "line-through text-slate-500" : ""
                                          }`}
                                          onClick={() => handleToggleMasterSubtopic(sub.id)}
                                        >
                                          {sub.title}
                                        </div>

                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                          {sub.focusPoint}
                                        </p>

                                        {sub.keywords && sub.keywords.length > 0 && (
                                          <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                            {sub.keywords.map((kw) => (
                                              <span
                                                key={kw}
                                                className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                                              >
                                                #{kw}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                                      <button
                                        onClick={() => onNavigateTab("simulados", { topic: sub.title })}
                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-600/90 hover:bg-amber-500 text-white transition-colors"
                                        title="Treinar questões deste subtópico"
                                      >
                                        Questões
                                      </button>
                                      <button
                                        onClick={() => onNavigateTab("materiais", { topicTitle: sub.title })}
                                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-blue-600/90 hover:bg-blue-500 text-white transition-colors"
                                        title="Estudar material resumido"
                                      >
                                        Resumo
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`p-4 rounded-xl border text-xs leading-relaxed ${
                              isDarkMode ? "bg-slate-850/60 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"
                            }`}
                          >
                            <strong className="text-emerald-600 dark:text-emerald-400">Foco do Dia: </strong>
                            {dayItem.focusDescription}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: MONTHLY INTERACTIVE CALENDAR GRID */}
          {dailyViewMode === "calendar" && (
            <div className="space-y-6">
              {["2026-08", "2026-09", "2026-10", "2026-11"]
                .filter((mKey) => dailyMonthFilter === "all" || dailyMonthFilter === mKey)
                .map((mKey) => {
                  const monthDays = fullDailySchedule.filter((d) => d.monthKey === mKey);
                  const monthTitle =
                    mKey === "2026-08"
                      ? "Agosto / 2026 (Início da Preparação)"
                      : mKey === "2026-09"
                      ? "Setembro / 2026 (Fundamentação & Inscrições até 20/09)"
                      : mKey === "2026-10"
                      ? "Outubro / 2026 (Aprofundamento Doutrinário & Didática)"
                      : "Novembro / 2026 (Reta Final, Simulados & GRANDE PROVA 22/11)";

                  return (
                    <div
                      key={mKey}
                      className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
                        isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 shadow-sm text-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-3">
                        <h4 className="text-base font-black flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-emerald-500" />
                          <span>{monthTitle}</span>
                        </h4>
                        <span className="text-xs font-bold text-slate-400 font-mono">
                          {monthDays.length} Dias
                        </span>
                      </div>

                      {/* Weekday Labels */}
                      <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-black uppercase text-slate-400 tracking-wider">
                        <div>DOM</div>
                        <div>SEG</div>
                        <div>TER</div>
                        <div>QUA</div>
                        <div>QUI</div>
                        <div>SEX</div>
                        <div>SÁB</div>
                      </div>

                      {/* Calendar Matrix */}
                      <div className="grid grid-cols-7 gap-2">
                        {/* Empty padding cells before first day of month if needed */}
                        {Array.from({ length: monthDays[0]?.dayOfWeek || 0 }).map((_, idx) => (
                          <div
                            key={`empty-${idx}`}
                            className={`min-h-[90px] rounded-xl border border-dashed opacity-30 ${
                              isDarkMode ? "border-slate-800 bg-slate-950/20" : "border-slate-200 bg-slate-50"
                            }`}
                          />
                        ))}

                        {/* Month Days */}
                        {monthDays.map((dayItem) => {
                          const isCompleted = dayItem.topics.length > 0 && dayItem.topics.every((t) => t.isCompleted);
                          const isSelected = selectedCalendarDayId === dayItem.id;

                          return (
                            <div
                              key={dayItem.id}
                              onClick={() => setSelectedCalendarDayId(isSelected ? null : dayItem.id)}
                              className={`min-h-[95px] p-2 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-500/10"
                                  : dayItem.isExamDay
                                  ? "bg-rose-500/20 border-rose-500 text-rose-300 hover:bg-rose-500/30"
                                  : dayItem.isToday
                                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 hover:bg-emerald-500/30"
                                  : isDarkMode
                                  ? "bg-slate-850 border-slate-750 hover:border-slate-600"
                                  : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-xs font-black w-6 h-6 rounded-lg flex items-center justify-center ${
                                    dayItem.isExamDay
                                      ? "bg-rose-600 text-white"
                                      : dayItem.isToday
                                      ? "bg-emerald-600 text-white"
                                      : "text-slate-300"
                                  }`}
                                >
                                  {dayItem.dayOfMonth}
                                </span>

                                {isCompleted && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                              </div>

                              <div className="space-y-1 my-1">
                                {dayItem.milestoneTitle ? (
                                  <div className="text-[9px] font-black leading-tight text-amber-400 line-clamp-2">
                                    ⭐ {dayItem.milestoneTitle}
                                  </div>
                                ) : dayItem.topics.length > 0 ? (
                                  <div className="text-[9px] text-slate-400 line-clamp-2 font-medium">
                                    {dayItem.topics.map((t) => t.title).join(", ")}
                                  </div>
                                ) : (
                                  <div className="text-[9px] text-slate-500 italic">
                                    {dayItem.dayOfWeek === 6 ? "Simulado" : "Revisão"}
                                  </div>
                                )}
                              </div>

                              <div className="text-[8px] font-mono text-slate-400 flex items-center justify-between">
                                <span>D{dayItem.dayNumber}</span>
                                <span>S{dayItem.weekNumber}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Selected Day Expanded Drawer (If Clicked) */}
                      {selectedCalendarDayId && monthDays.some((d) => d.id === selectedCalendarDayId) && (
                        (() => {
                          const focusedDay = monthDays.find((d) => d.id === selectedCalendarDayId);
                          if (!focusedDay) return null;

                          return (
                            <div
                              className={`p-4 rounded-xl border mt-3 animate-fadeIn ${
                                isDarkMode ? "bg-slate-850 border-emerald-500/40 text-white" : "bg-emerald-50 border-emerald-300 text-slate-900"
                              }`}
                            >
                              <div className="flex items-center justify-between border-b pb-2 mb-3">
                                <div>
                                  <span className="text-[10px] uppercase font-black text-emerald-600 dark:text-emerald-400">
                                    Detalhes do Dia {focusedDay.dayNumber} de 98 • Semana {focusedDay.weekNumber}
                                  </span>
                                  <h5 className="text-sm font-black">
                                    {focusedDay.dayOfWeekName}, {focusedDay.formattedDate}
                                  </h5>
                                </div>

                                <button
                                  onClick={() => setSelectedCalendarDayId(null)}
                                  className="text-xs font-bold text-slate-400 hover:text-white"
                                >
                                  ✕ Fechar
                                </button>
                              </div>

                              {focusedDay.milestoneTitle && (
                                <div className="text-xs font-bold text-amber-500 mb-2">
                                  ⭐ Marco: {focusedDay.milestoneTitle}
                                </div>
                              )}

                              {focusedDay.topics.length === 0 ? (
                                <p className="text-xs text-slate-300">{focusedDay.focusDescription}</p>
                              ) : (
                                <div className="space-y-2">
                                  {focusedDay.topics.map((t) => (
                                    <div
                                      key={t.id}
                                      className="p-2.5 rounded-lg bg-black/20 flex items-center justify-between gap-2 text-xs"
                                    >
                                      <div>
                                        <div className="font-bold">{t.title}</div>
                                        <div className="text-[10px] text-emerald-400 uppercase">{t.moduleName}</div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => onNavigateTab("simulados", { topic: t.title })}
                                          className="px-2 py-1 rounded bg-amber-600 text-white text-[10px] font-bold"
                                        >
                                          Questões
                                        </button>
                                        <button
                                          onClick={() => onToggleTopicComplete(t.id)}
                                          className={`w-6 h-6 rounded border flex items-center justify-center ${
                                            t.isCompleted ? "bg-emerald-500 border-emerald-400 text-white" : "border-slate-500"
                                          }`}
                                        >
                                          <Check className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: EDITAL VERTICALIZADO COMPLETO (17 TÓPICOS DE BIOLOGIA + 4 MATÉRIAS P1) */}
      {activeSubTab === "conteudo_programatico" && (
        <div className="space-y-6">
          {/* Information & Specialty Syllabus Banner */}
          <div
            className={`rounded-2xl border p-6 space-y-4 ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-black">
                  Edital Verticalizado • {currentSpecialty.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingTopic(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Adicionar Tópico</span>
                </button>

                <button
                  onClick={onOpenPrintScheduleModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-750 bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir PDF</span>
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                Filtrar Módulos:
              </span>
              {modulesList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedModule(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedModule === m.id
                      ? "bg-emerald-600 text-white shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800/80 text-slate-400 hover:text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Topic Form */}
          {isAddingTopic && (
            <div
              className={`rounded-2xl border p-6 space-y-4 animate-fadeIn ${
                isDarkMode ? "bg-slate-850 border-emerald-500/40 text-white" : "bg-emerald-50/50 border-emerald-300 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-black uppercase flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <PlusCircle className="w-4 h-4" />
                  <span>Novo Tópico no Conteúdo Programático</span>
                </h3>
                <button onClick={() => setIsAddingTopic(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCustomTopic} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Título do Conteúdo / Tópico *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Citologia Avançada ou LDB Art. 35"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Módulo do Edital</label>
                    <select
                      value={newTopicModule}
                      onChange={(e) => setNewTopicModule(e.target.value as TopicModule)}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="conhecimentos_especificos">Conhecimentos Específicos ({currentSpecialty.name})</option>
                      <option value="lingua_portuguesa">Língua Portuguesa</option>
                      <option value="educacao_brasileira_didatica">Educação Brasileira & Didática</option>
                      <option value="administracao_publica">Administração Pública</option>
                      <option value="indicadores_educacionais">Indicadores Educacionais</option>
                      <option value="legislacao_educacional_ce">Legislação SEDUC-CE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold block mb-1">Dia da Semana</label>
                    <select
                      value={newTopicDay}
                      onChange={(e) => setNewTopicDay(Number(e.target.value))}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value={1}>Segunda-feira</option>
                      <option value={2}>Terça-feira</option>
                      <option value={3}>Quarta-feira</option>
                      <option value={4}>Quinta-feira</option>
                      <option value={5}>Sexta-feira</option>
                      <option value={6}>Sábado</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Tempo Estimado (min)</label>
                    <input
                      type="number"
                      min={15}
                      max={300}
                      value={newTopicMinutes}
                      onChange={(e) => setNewTopicMinutes(Number(e.target.value))}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">Base Legal / Autor (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Lei 10.884/84 ou Saviani"
                      value={newTopicLaw}
                      onChange={(e) => setNewTopicLaw(e.target.value)}
                      className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                        isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1">Descrição / Detalhes de Cobrança da FUNECE</label>
                  <textarea
                    rows={2}
                    placeholder="Descreva pontos chaves que costumam cair nas provas da UECE..."
                    value={newTopicDesc}
                    onChange={(e) => setNewTopicDesc(e.target.value)}
                    className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                      isDarkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingTopic(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
                  >
                    Salvar Tópico no Edital
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Grouped Modules Accordion / Cards */}
          <div className="space-y-6">
            {groupedByModule.map((moduleGroup) => {
              if (selectedModule !== "all" && moduleGroup.id !== selectedModule) return null;
              if (moduleGroup.topics.length === 0) return null;

              const modCompleted = moduleGroup.topics.filter((t) => t.isCompleted).length;
              const modTotal = moduleGroup.topics.length;
              const modPercent = Math.round((modCompleted / modTotal) * 100);

              return (
                <div
                  key={moduleGroup.id}
                  className={`rounded-2xl border overflow-hidden transition-all ${
                    isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                  }`}
                >
                  {/* Module Header */}
                  <div
                    className={`p-5 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      moduleGroup.id === "conhecimentos_especificos"
                        ? isDarkMode
                          ? "bg-emerald-950/30 border-emerald-500/20"
                          : "bg-emerald-50/70 border-emerald-200"
                        : isDarkMode
                        ? "bg-slate-850/60 border-slate-800"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          {moduleGroup.weight}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {modCompleted} de {modTotal} concluídos ({modPercent}%)
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                        {moduleGroup.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {moduleGroup.description}
                      </p>
                    </div>

                    <div className="w-full sm:w-36">
                      <div className="flex justify-between text-[11px] font-bold mb-1 text-slate-400">
                        <span>Progresso</span>
                        <span>{modPercent}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700/40 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${modPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Module Topics List */}
                  <div className="p-4 sm:p-6 space-y-3">
                    {moduleGroup.topics.map((topic, idx) => {
                      const isEditingNotes = editingNotesId === topic.id;

                      return (
                        <div
                          key={topic.id}
                          className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                            topic.isCompleted
                              ? isDarkMode
                                ? "bg-slate-950/40 border-slate-800/80 opacity-70"
                                : "bg-slate-50 border-slate-200 opacity-70"
                              : topic.isDelayed
                              ? isDarkMode
                                ? "bg-amber-950/20 border-amber-500/40"
                                : "bg-amber-50/70 border-amber-300"
                              : isDarkMode
                              ? "bg-slate-800/50 border-slate-750 hover:border-slate-700"
                              : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => onToggleTopicComplete(topic.id)}
                                className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                                  topic.isCompleted
                                    ? "bg-emerald-500 border-emerald-400 text-white shadow-sm"
                                    : isDarkMode
                                    ? "border-slate-600 hover:border-emerald-400 text-transparent"
                                    : "border-slate-400 hover:border-emerald-500 text-transparent"
                                }`}
                                title={topic.isCompleted ? "Marcar como não estudado" : "Marcar como estudado"}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>

                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-mono text-slate-400 font-bold">
                                    #{idx + 1}
                                  </span>
                                  <span
                                    className={`text-sm sm:text-base font-bold ${
                                      topic.isCompleted
                                        ? "line-through text-slate-500"
                                        : isDarkMode
                                        ? "text-white"
                                        : "text-slate-900"
                                    }`}
                                  >
                                    {topic.title}
                                  </span>

                                  {topic.isDelayed && !topic.isCompleted && (
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                                      Atrasado
                                    </span>
                                  )}

                                  <span className="text-[10px] text-slate-400 font-semibold">
                                    {topic.importanceInFunece}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {topic.description}
                                </p>

                                {topic.keyFormulasOrLaws && (
                                  <div className="text-xs font-mono text-amber-600 dark:text-amber-400 pt-0.5">
                                    📌 Base Legal/Conceito: {topic.keyFormulasOrLaws}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions on right */}
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                              <button
                                onClick={() => onNavigateTab("simulados", { topic: topic.title })}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors"
                              >
                                Questões
                              </button>

                              <button
                                onClick={() => onNavigateTab("materiais", { topicTitle: topic.title })}
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                              >
                                Resumo PDF
                              </button>

                              <button
                                onClick={() => (isEditingNotes ? handleSaveNotes(topic.id) : handleStartEditNotes(topic))}
                                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                  isDarkMode
                                    ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                                    : "bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900"
                                }`}
                                title="Anotações pessoais"
                              >
                                {isEditingNotes ? <Save className="w-4 h-4 text-emerald-500" /> : <Edit3 className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Subtopics Accordion & Progress */}
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="pt-2 border-t border-slate-750/50 space-y-2">
                              <div className="flex items-center justify-between">
                                <button
                                  onClick={() => toggleSubtopicsExpand(topic.id)}
                                  className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                  <span>
                                    {topic.subtopics.length} Subtópicos ({topic.subtopics.filter((s) => s.isCompleted).length} concluídos)
                                  </span>
                                  {expandedSubtopicsMap[topic.id] ? (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <span className="text-[11px] font-mono text-slate-400">
                                  {Math.round(
                                    (topic.subtopics.filter((s) => s.isCompleted).length /
                                      topic.subtopics.length) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>

                              {/* Expanded subtopic list */}
                              {expandedSubtopicsMap[topic.id] && (
                                <div className="space-y-1.5 pl-2 pt-1">
                                  {topic.subtopics.map((sub, sIdx) => (
                                    <div
                                      key={sub.id}
                                      className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-xs transition-all ${
                                        sub.isCompleted
                                          ? isDarkMode
                                            ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                                            : "bg-emerald-100/50 border-emerald-200 text-emerald-950"
                                          : isDarkMode
                                          ? "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                                          : "bg-white border-slate-200 text-slate-700"
                                      }`}
                                    >
                                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                        <button
                                          onClick={() => onToggleSubtopic && onToggleSubtopic(topic.id, sub.id)}
                                          className="mt-0.5 p-0.5 text-slate-400 hover:text-emerald-400 flex-shrink-0"
                                        >
                                          {sub.isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                          ) : (
                                            <Circle className="w-4 h-4 text-slate-500" />
                                          )}
                                        </button>
                                        <div className="flex-1 min-w-0 space-y-1">
                                          <div className="font-bold leading-tight text-slate-900 dark:text-slate-100">
                                            {sIdx + 1}. {sub.title}
                                          </div>
                                          {sub.description && (
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                              {sub.description}
                                            </p>
                                          )}
                                          {sub.funeceIncidence && (
                                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                                              🎯 <strong>Foco FUNECE:</strong> {sub.funeceIncidence}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-1.5 flex-shrink-0">
                                        <button
                                          onClick={() =>
                                            onNavigateTab("simulados", {
                                              topic: topic.title,
                                              subtopic: sub.title,
                                            })
                                          }
                                          className="text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:underline px-2 py-1 rounded bg-amber-500/10"
                                        >
                                          Treinar Questões
                                        </button>
                                        <button
                                          onClick={() =>
                                            onNavigateTab("mentor", {
                                              questionPrompt: `Professor Crateús, me explique o subtópico: "${sub.title}" (${topic.moduleName}) focado nas pegadinhas da FUNECE/CEV-UECE.`,
                                            })
                                          }
                                          className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline px-2 py-1 rounded bg-emerald-500/10"
                                        >
                                          Tirar Dúvida
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Notes Editor */}
                          {isEditingNotes ? (
                            <div className="pt-2 border-t border-slate-750 space-y-2">
                              <textarea
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Insira suas anotações sobre pegadinhas da FUNECE neste tópico..."
                                rows={2}
                                className={`w-full p-2.5 text-xs rounded-xl border outline-none ${
                                  isDarkMode
                                    ? "bg-slate-900 border-slate-700 text-white focus:border-emerald-500"
                                    : "bg-white border-slate-300 text-slate-900 focus:border-emerald-500"
                                }`}
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                                >
                                  Cancelar
                                </button>
                                <button
                                  onClick={() => handleSaveNotes(topic.id)}
                                  className="px-3 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg"
                                >
                                  Salvar Anotação
                                </button>
                              </div>
                            </div>
                          ) : topic.notes ? (
                            <div
                              onClick={() => handleStartEditNotes(topic)}
                              className={`p-2 rounded-lg border text-xs cursor-pointer ${
                                isDarkMode
                                  ? "bg-slate-950/60 border-slate-800 text-emerald-300 hover:border-emerald-500/40"
                                  : "bg-emerald-50/60 border-emerald-200 text-emerald-900 hover:border-emerald-300"
                              }`}
                            >
                              <span className="font-bold">📝 Anotação:</span> {topic.notes}
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: VISÃO SEMANAL (GRADE DE SEGUNDA A SÁBADO) */}
      {activeSubTab === "semanal" && (
        <div className="space-y-6">
          {/* Day selector buttons */}
          <div
            className={`rounded-2xl border p-4 flex flex-wrap items-center gap-2 ${
              isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
              Selecione o Dia:
            </span>
            <button
              onClick={() => setSelectedDay("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedDay === "all"
                  ? "bg-emerald-600 text-white"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900"
              }`}
            >
              Todos os Dias
            </button>
            {daysOfWeek.map((d) => {
              const count = topics.filter((t) => t.scheduledDayOfWeek === d.day).length;
              return (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedDay === d.day
                      ? "bg-emerald-600 text-white font-bold shadow-sm"
                      : isDarkMode
                      ? "bg-slate-800/80 text-slate-400 hover:text-white"
                      : "bg-slate-100 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {d.name} ({count})
                </button>
              );
            })}
          </div>

          {/* Weekly Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeek.map((d) => {
              if (selectedDay !== "all" && selectedDay !== d.day) return null;
              const dayTopics = topics.filter((t) => t.scheduledDayOfWeek === d.day);

              return (
                <div
                  key={d.day}
                  className={`rounded-2xl border p-5 space-y-3 ${
                    isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-3">
                    <h3 className="font-black text-base flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>{d.label}</span>
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {dayTopics.length} tópicos
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dayTopics.map((top) => (
                      <div
                        key={top.id}
                        className={`p-3 rounded-xl border space-y-2 text-xs ${
                          top.isCompleted
                            ? isDarkMode
                              ? "bg-slate-950/40 border-slate-800 opacity-70"
                              : "bg-slate-100 border-slate-200 opacity-70"
                            : isDarkMode
                            ? "bg-slate-850 border-slate-750"
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                              {top.moduleName}
                            </span>
                            <span className={`font-bold ${top.isCompleted ? "line-through text-slate-500" : ""}`}>
                              {top.title}
                            </span>
                          </div>

                          <button
                            onClick={() => onToggleTopicComplete(top.id)}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                              top.isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : "border-slate-500 text-transparent"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-750">
                          <span>~{top.estimatedMinutes} min</span>
                          <button
                            onClick={() => onNavigateTab("simulados", { topic: top.title })}
                            className="text-amber-500 font-bold hover:underline"
                          >
                            Treinar Questões →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
