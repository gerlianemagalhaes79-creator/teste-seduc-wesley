import { Achievement, DailyMission } from "../types";

export interface LevelInfo {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeColor: string;
  perks: string;
}

export const LEVELS: LevelInfo[] = [
  {
    level: 1,
    title: "Professor Aspirante",
    minXp: 0,
    maxXp: 250,
    badgeColor: "from-amber-600 to-amber-800",
    perks: "Acesso a simulados básicos e cronograma personalizado",
  },
  {
    level: 2,
    title: "Desbravador do Edital FUNECE",
    minXp: 251,
    maxXp: 650,
    badgeColor: "from-blue-600 to-indigo-700",
    perks: "Desbloqueio de Caderno de Erros inteligente",
  },
  {
    level: 3,
    title: "Especialista em Legislação & Didática",
    minXp: 651,
    maxXp: 1400,
    badgeColor: "from-emerald-600 to-teal-800",
    perks: "Diagnóstico semanal aprofundado com a IA",
  },
  {
    level: 4,
    title: "Mestre da Banca FUNECE",
    minXp: 1401,
    maxXp: 2600,
    badgeColor: "from-purple-600 to-purple-900",
    perks: "Geração ilimitada de questões inéditas por IA",
  },
  {
    level: 5,
    title: "Top 10 Concurso SEDUC-CE",
    minXp: 2601,
    maxXp: 4500,
    badgeColor: "from-rose-600 to-amber-600",
    perks: "Modo Prova Real com cronometragem estrita",
  },
  {
    level: 6,
    title: "Futuro Efetivo do Estado do Ceará 🏆",
    minXp: 4501,
    maxXp: 10000,
    badgeColor: "from-yellow-500 via-amber-500 to-emerald-600",
    perks: "Preparação de elite para Prova Prática e Títulos",
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-first-question",
    title: "Primeiro Passo Rumo à Posse",
    description: "Responda à sua primeira questão comentada no estilo FUNECE.",
    iconName: "Target",
    xpReward: 30,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 1,
    category: "questoes",
  },
  {
    id: "ach-ldb-master",
    title: "Mestre da LDB 9.394/96",
    description: "Acerte 10 questões sobre legislação educacional e LDB.",
    iconName: "Scale",
    xpReward: 80,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 10,
    category: "questoes",
  },
  {
    id: "ach-didatica-sharp",
    title: "Didática Implacável",
    description: "Acerte 10 questões sobre teorias pedagógicas (Libâneo, Luckesi, Piaget).",
    iconName: "GraduationCap",
    xpReward: 80,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 10,
    category: "questoes",
  },
  {
    id: "ach-streak-7",
    title: "Ofensiva de Aço 🔥",
    description: "Mantenha uma sequência de 7 dias ininterruptos de estudo.",
    iconName: "Flame",
    xpReward: 150,
    isUnlocked: false,
    currentProgress: 1,
    maxProgress: 7,
    category: "ofensiva",
  },
  {
    id: "ach-simulado-80",
    title: "Gabaritou a FUNECE",
    description: "Atinja aproveitamento superior a 80% em um simulado completo.",
    iconName: "Trophy",
    xpReward: 120,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 1,
    category: "simulados",
  },
  {
    id: "ach-schedule-complete",
    title: "Edital em Dia",
    description: "Conclua 5 tópicos do seu cronograma semanal de estudos.",
    iconName: "CheckCircle",
    xpReward: 100,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 5,
    category: "cronograma",
  },
  {
    id: "ach-mentor-consult",
    title: "Diálogo com o Examinador",
    description: "Converse com o Mentor FUNECE e tire dúvidas conceituais.",
    iconName: "Bot",
    xpReward: 40,
    isUnlocked: false,
    currentProgress: 0,
    maxProgress: 1,
    category: "especialista",
  },
];

export const INITIAL_DAILY_MISSIONS: DailyMission[] = [
  {
    id: "mis-1",
    title: "Bateria FUNECE",
    description: "Resolva 10 questões de concurso hoje",
    xpReward: 50,
    isCompleted: false,
    type: "questions",
    currentCount: 0,
    targetCount: 10,
  },
  {
    id: "mis-2",
    title: "Meta do Cronograma",
    description: "Marque como concluído 1 tópico programado para hoje",
    xpReward: 40,
    isCompleted: false,
    type: "topic",
    currentCount: 0,
    targetCount: 1,
  },
  {
    id: "mis-3",
    title: "Alinhar com o Mentor",
    description: "Tire uma dúvida ou peça um diagnóstico com o Mentor IA",
    xpReward: 30,
    isCompleted: false,
    type: "mentor",
    currentCount: 0,
    targetCount: 1,
  },
  {
    id: "mis-4",
    title: "Recuperação de Conteúdo",
    description: "Revise 1 tópico atrasado ou faça leitura de um PDF Otimizado",
    xpReward: 35,
    isCompleted: false,
    type: "delayed",
    currentCount: 0,
    targetCount: 1,
  },
];

export const SIMULATED_RANKING = [
  { rank: 1, name: "Profª. Gabriela Santos (Biologia - CREDE 01)", xp: 3420, accuracy: "92%", streak: 21, specialty: "Biologia", city: "Fortaleza" },
  { rank: 2, name: "Prof. Marcos Vinícius (Matemática - SEFOR)", xp: 3150, accuracy: "89%", streak: 18, specialty: "Matemática", city: "Caucaia" },
  { rank: 3, name: "Profª. Larissa Cordeiro (Português - CREDE 06)", xp: 2890, accuracy: "88%", streak: 15, specialty: "Língua Portuguesa", city: "Sobral" },
  { rank: 4, name: "Você (Professor Focado SEDUC-CE)", xp: 420, accuracy: "78%", streak: 4, isCurrentUser: true, specialty: "Especialidade Atual", city: "Ceará" },
  { rank: 5, name: "Prof. Tiago Medeiros (História - CREDE 19)", xp: 2450, accuracy: "84%", streak: 12, specialty: "História", city: "Juazeiro do Norte" },
  { rank: 6, name: "Profª. Fernanda Lima (Química - CREDE 02)", xp: 2100, accuracy: "82%", streak: 9, specialty: "Química", city: "Itapipoca" },
  { rank: 7, name: "Prof. Rafael Holanda (Física - SEFOR)", xp: 1980, accuracy: "80%", streak: 7, specialty: "Física", city: "Maracanaú" },
  { rank: 8, name: "Profª. Beatriz Albuquerque (Pedagogia - CREDE 10)", xp: 1850, accuracy: "79%", streak: 6, specialty: "Pedagogia", city: "Russas" },
];

export const SAMPLE_RANKING = SIMULATED_RANKING;
