import {
  UserProfile,
  StudyTopic,
  Question,
  UserAnswerRecord,
  SimuladoSession,
  PDFMaterial,
  Achievement,
  DailyMission,
  SpecialtyId,
} from "../types";
import { generateTopicsForSpecialty } from "../data/specialties";
import { INITIAL_FUNECE_QUESTIONS } from "../data/funeceQuestions";
import { INITIAL_PDF_MATERIALS } from "../data/funeceMaterials";
import { INITIAL_ACHIEVEMENTS, INITIAL_DAILY_MISSIONS, LEVELS } from "../data/gamificationData";
import {
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  syncTopicsToFirestore,
  fetchTopicsFromFirestore,
  syncAnswerToFirestore,
  fetchAnswersFromFirestore,
  syncSimuladoToFirestore,
  fetchSimuladosFromFirestore,
  syncMaterialToFirestore,
  fetchMaterialsFromFirestore,
  syncMultipleQuestionsToFirestore,
  syncQuestionToFirestore,
  fetchQuestionsFromFirestore,
  syncGamificationToFirestore,
  fetchGamificationFromFirestore,
} from "../services/firestoreSync";

const STORAGE_KEYS = {
  PROFILE: "seduc_funece_user_profile_v1",
  TOPICS: "seduc_funece_topics_v1",
  QUESTIONS: "seduc_funece_questions_v1",
  ANSWERS: "seduc_funece_answers_v1",
  SIMULADOS: "seduc_funece_simulados_v1",
  MATERIALS: "seduc_funece_materials_v1",
  ACHIEVEMENTS: "seduc_funece_achievements_v1",
  MISSIONS: "seduc_funece_missions_v1",
};

let currentUserId: string | null = null;
let onSyncStateChange: ((status: "synced" | "syncing" | "offline", lastSyncedAt?: Date) => void) | null = null;

export function setCurrentUserId(userId: string | null): void {
  currentUserId = userId;
}

export function getCurrentUserId(): string | null {
  return currentUserId;
}

export function subscribeToSyncState(callback: (status: "synced" | "syncing" | "offline", lastSyncedAt?: Date) => void): void {
  onSyncStateChange = callback;
}

function notifySync(status: "synced" | "syncing" | "offline"): void {
  if (onSyncStateChange) {
    onSyncStateChange(status, status === "synced" ? new Date() : undefined);
  }
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Professor(a) Concurseiro(a)",
  email: "professor@seduc.ce.gov.br",
  specialty: "biologia",
  hoursPerDay: 3,
  studyDaysPerWeek: 6,
  examDate: "2026-11-22",
  targetScore: 85,
  xp: 420,
  level: 2,
  streak: 4,
  lastActiveDate: new Date().toISOString().split("T")[0],
  streakFreezeAvailable: 1,
  totalStudyMinutes: 340,
  customNotesCount: 3,
};

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load profile:", e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveStoredProfile(profile: UserProfile, userId?: string): void {
  try {
    // Check level progression based on XP
    const currentLevel = LEVELS.slice().reverse().find((l) => profile.xp >= l.minXp) || LEVELS[0];
    profile.level = currentLevel.level;
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));

    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      syncUserProfileToFirestore(targetUid, profile).then(() => notifySync("synced"));
    }
  } catch (e) {
    console.error("Failed to save profile:", e);
  }
}

export function getStoredTopics(specialty: SpecialtyId): StudyTopic[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.TOPICS}_${specialty}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load topics:", e);
  }
  const initial = generateTopicsForSpecialty(specialty);
  if (initial.length > 3) {
    initial[0].isCompleted = true;
    initial[0].completedDate = "Ontem";
    initial[1].isCompleted = true;
    initial[1].completedDate = "Hoje";
    initial[3].isDelayed = true;
  }
  saveStoredTopics(specialty, initial);
  return initial;
}

export function saveStoredTopics(specialty: SpecialtyId, topics: StudyTopic[], userId?: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEYS.TOPICS}_${specialty}`, JSON.stringify(topics));

    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      syncTopicsToFirestore(targetUid, specialty, topics).then(() => notifySync("synced"));
    }
  } catch (e) {
    console.error("Failed to save topics:", e);
  }
}

export function getStoredQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to load questions:", e);
  }
  saveStoredQuestions(INITIAL_FUNECE_QUESTIONS);
  return INITIAL_FUNECE_QUESTIONS;
}

export function saveStoredQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    notifySync("syncing");
    syncMultipleQuestionsToFirestore(questions).then(() => notifySync("synced"));
  } catch (e) {
    console.error("Failed to save questions:", e);
  }
}

export function getStoredAnswers(): UserAnswerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ANSWERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load answers:", e);
  }
  const seedAnswers: UserAnswerRecord[] = [
    {
      questionId: "q-funece-did-01",
      selectedOptionId: "B",
      isCorrect: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      timeSpentSeconds: 65,
      topic: "Tendências Pedagógicas",
      discipline: "Didática",
    },
    {
      questionId: "q-funece-leg-01",
      selectedOptionId: "A",
      isCorrect: true,
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      timeSpentSeconds: 45,
      topic: "LDB 9.394/1996 - Gestão Democrática",
      discipline: "Legislação Educacional",
    },
    {
      questionId: "q-funece-bio-01",
      selectedOptionId: "A",
      isCorrect: false,
      timestamp: new Date(Date.now() - 20000000).toISOString(),
      timeSpentSeconds: 110,
      topic: "Citologia e Metabolismo Energético",
      discipline: "Biologia",
    },
  ];
  saveStoredAnswers(seedAnswers);
  return seedAnswers;
}

export function saveStoredAnswers(answers: UserAnswerRecord[], latestAnswer?: UserAnswerRecord, userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ANSWERS, JSON.stringify(answers));

    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      if (latestAnswer) {
        syncAnswerToFirestore(targetUid, latestAnswer).then(() => notifySync("synced"));
      } else if (answers.length > 0) {
        syncAnswerToFirestore(targetUid, answers[0]).then(() => notifySync("synced"));
      }
    }
  } catch (e) {
    console.error("Failed to save answers:", e);
  }
}

export function getStoredSimulados(): SimuladoSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SIMULADOS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load simulados:", e);
  }
  const initialSim: SimuladoSession[] = [
    {
      id: "sim-seed-1",
      title: "Simulado Diagnóstico FUNECE Geral 01",
      specialty: "biologia",
      date: new Date(Date.now() - 172800000).toISOString(),
      totalQuestions: 10,
      correctCount: 8,
      wrongCount: 2,
      scorePercentage: 80,
      timeSpentSeconds: 1240,
      mode: "cronometrado",
      answers: [],
    },
  ];
  saveStoredSimulados(initialSim);
  return initialSim;
}

export function saveStoredSimulados(simulados: SimuladoSession[], latestSession?: SimuladoSession, userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SIMULADOS, JSON.stringify(simulados));

    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      if (latestSession) {
        syncSimuladoToFirestore(targetUid, latestSession).then(() => notifySync("synced"));
      } else if (simulados.length > 0) {
        syncSimuladoToFirestore(targetUid, simulados[0]).then(() => notifySync("synced"));
      }
    }
  } catch (e) {
    console.error("Failed to save simulados:", e);
  }
}

export function getStoredMaterials(): PDFMaterial[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATERIALS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load materials:", e);
  }
  saveStoredMaterials(INITIAL_PDF_MATERIALS);
  return INITIAL_PDF_MATERIALS;
}

export function saveStoredMaterials(materials: PDFMaterial[], latestMaterial?: PDFMaterial, userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATERIALS, JSON.stringify(materials));

    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      if (latestMaterial) {
        syncMaterialToFirestore(targetUid, latestMaterial).then(() => notifySync("synced"));
      } else if (materials.length > 0) {
        syncMaterialToFirestore(targetUid, materials[0]).then(() => notifySync("synced"));
      }
    }
  } catch (e) {
    console.error("Failed to save materials:", e);
  }
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load achievements:", e);
  }
  saveStoredAchievements(INITIAL_ACHIEVEMENTS);
  return INITIAL_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[], userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      syncGamificationToFirestore(targetUid, achievements, getStoredMissions()).then(() => notifySync("synced"));
    }
  } catch (e) {
    console.error("Failed to save achievements:", e);
  }
}

export function getStoredMissions(): DailyMission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MISSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to load missions:", e);
  }
  saveStoredMissions(INITIAL_DAILY_MISSIONS);
  return INITIAL_DAILY_MISSIONS;
}

export function saveStoredMissions(missions: DailyMission[], userId?: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
    const targetUid = userId || currentUserId;
    if (targetUid) {
      notifySync("syncing");
      syncGamificationToFirestore(targetUid, getStoredAchievements(), missions).then(() => notifySync("synced"));
    }
  } catch (e) {
    console.error("Failed to save missions:", e);
  }
}

/**
 * Loads and merges all data from Firestore for the given user ID.
 */
export async function loadUserDataFromFirestore(userId: string): Promise<{
  profile: UserProfile | null;
  topics: StudyTopic[] | null;
  answers: UserAnswerRecord[] | null;
  simulados: SimuladoSession[] | null;
  materials: PDFMaterial[] | null;
  questions: Question[] | null;
  achievements: Achievement[] | null;
  missions: DailyMission[] | null;
}> {
  setCurrentUserId(userId);
  notifySync("syncing");

  // Timeout guard so the app never hangs if Firestore is offline or unreachable
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Firestore sync timeout")), 4000)
  );

  try {
    const fetchAll = async () => {
      const [
        profile,
        cloudAnswers,
        cloudSimulados,
        cloudMaterials,
        cloudQuestions,
        cloudGamification,
      ] = await Promise.all([
        fetchUserProfileFromFirestore(userId),
        fetchAnswersFromFirestore(userId),
        fetchSimuladosFromFirestore(userId),
        fetchMaterialsFromFirestore(userId),
        fetchQuestionsFromFirestore(),
        fetchGamificationFromFirestore(userId),
      ]);

      let cloudTopics: StudyTopic[] | null = null;
      if (profile?.specialty) {
        cloudTopics = await fetchTopicsFromFirestore(userId, profile.specialty);
      }

      return {
        profile,
        topics: cloudTopics,
        answers: cloudAnswers,
        simulados: cloudSimulados,
        materials: cloudMaterials,
        questions: cloudQuestions,
        achievements: cloudGamification?.achievements || null,
        missions: cloudGamification?.missions || null,
      };
    };

    const result = await Promise.race([fetchAll(), timeoutPromise]);
    notifySync("synced");
    return result;
  } catch (err: any) {
    console.warn("Using local cache: Firestore initial sync completed in offline mode:", err?.message || err);
    notifySync("offline");
    return {
      profile: null,
      topics: null,
      answers: null,
      simulados: null,
      materials: null,
      questions: null,
      achievements: null,
      missions: null,
    };
  }
}

