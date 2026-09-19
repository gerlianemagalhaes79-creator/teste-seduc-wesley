export type SpecialtyId =
  | "biologia"
  | "portugues"
  | "matematica"
  | "historia"
  | "geografia"
  | "fisica"
  | "quimica"
  | "pedagogia"
  | "educacao_fisica"
  | "sociologia"
  | "filosofia"
  | "artes"
  | "ingles"
  | "espanhol";

export interface SpecialtyConfig {
  id: SpecialtyId;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  weightInExam: string;
  estimatedVacancies: number;
  coreSpecificTopics: string[];
  funeceFocusSummary?: string;
}

export type TopicModule =
  | "lingua_portuguesa"
  | "educacao_brasileira_didatica"
  | "administracao_publica"
  | "indicadores_educacionais"
  | "legislacao_educacional_ce"
  | "conhecimentos_especificos";

export interface StudySubtopic {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  funeceIncidence?: string; // e.g. "Alta incidência na FUNECE (90%)"
  keywordsOrAuthors?: string[];
  estimatedMinutes?: number;
  completedDate?: string;
  notes?: string;
}

export interface StudyTopic {
  id: string;
  moduleId: TopicModule;
  moduleName: string;
  title: string;
  description: string;
  specialtyId?: SpecialtyId; // if undefined, applies to all
  importanceInFunece: "Média" | "Alta" | "Altíssima (Foco Máximo)";
  estimatedMinutes: number;
  isCompleted: boolean;
  isDelayed: boolean;
  scheduledDayOfWeek: number; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
  completedDate?: string;
  keyFormulasOrLaws?: string;
  notes?: string;
  subtopics?: StudySubtopic[];
  funeceIncidencePercent?: number; // e.g. 95%
  syllabusCode?: string; // e.g. "1.1", "2.3"
  theoreticalFramework?: string; // e.g. "Piaget / Vygotsky / Wallon"
}

export interface UserProfile {
  name: string;
  email: string;
  specialty: SpecialtyId;
  hoursPerDay: number;
  studyDaysPerWeek: number;
  examDate: string; // ISO string e.g. "2026-11-22"
  targetScore: number;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  streakFreezeAvailable: number;
  totalStudyMinutes: number;
  customNotesCount: number;
}

export interface QuestionOption {
  id: string; // "A" | "B" | "C" | "D" | "E"
  text: string;
}

export interface Question {
  id: string;
  discipline: string;
  topic: string;
  subtopic?: string;
  subtopicId?: string;
  specialty?: SpecialtyId;
  statement: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  funeceInsight: string;
  legalOrAuthorReference: string;
  difficulty: "Fácil" | "Média" | "Difícil" | "Pegadinha Clássica FUNECE";
  year?: string;
  banca: "FUNECE" | "CEV-UECE" | "FUNECE Inédita IA";
  eliteAnalysis?: {
    mainTrap?: string;
    technicalException?: string;
    distractorsTrapAnalysis?: string;
  };
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timestamp: string;
  timeSpentSeconds: number;
  topic: string;
  discipline: string;
}

export interface SimuladoSession {
  id: string;
  title: string;
  specialty: SpecialtyId;
  date: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  mode: "cronometrado" | "treino_comentado";
  answers: {
    questionId: string;
    selected: string;
    correct: string;
    isCorrect: boolean;
  }[];
}

export interface PDFMaterial {
  id: string;
  title: string;
  specialty?: SpecialtyId;
  moduleId: TopicModule;
  topic: string;
  estimatedReadTimeMinutes: number;
  readTimeMinutes?: number;
  pageCount?: number;
  category?: string;
  summaryContent?: string;
  funeceTrapAlert?: string;
  keyConcepts: string[];
  funeceProfile: string;
  mnemonics: {
    name: string;
    description: string;
  }[];
  contentSections: {
    heading: string;
    body: string;
    highlight?: string;
  }[];
  summaryTable?: {
    headers: string[];
    rows: string[][];
  };
  quickChecklist: string[];
}

export interface MentorChatMessage {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  isStreaming?: boolean;
  quickReplies?: string[];
}

export interface MentorWeeklyDiagnosis {
  diagnosticSummary: string;
  scoreRating: "Excelente" | "Bom ritmo" | "Atenção necessária" | "Alerta de atraso";
  priorityActions: string[];
  funeceTrapsToWatch: string[];
  recommendedHoursWeekly: number;
  mentorMotivation: string;
  scheduleAdjustmentAdvice: string;
  generatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  maxProgress: number;
  category: "questoes" | "cronograma" | "ofensiva" | "simulados" | "especialista";
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  type: "questions" | "topic" | "simulado" | "delayed" | "mentor";
  currentCount: number;
  targetCount: number;
}

export interface ConcursoStageDate {
  id: string;
  title: string;
  date: string;
  formattedDate: string;
  description: string;
  status: "concluido" | "em_andamento" | "proximo" | "futuro";
  tipsForCandidate: string;
  funeceSpecifics: string;
  isImportantMilestone: boolean;
}
