import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";
import { db } from "../lib/firebase";
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

function isOfflineError(e: any): boolean {
  if (!e) return false;
  const msg = typeof e.message === "string" ? e.message.toLowerCase() : "";
  const code = typeof e.code === "string" ? e.code.toLowerCase() : "";
  return (
    msg.includes("client is offline") ||
    msg.includes("backend didn't respond") ||
    msg.includes("could not reach") ||
    code.includes("unavailable") ||
    code.includes("failed-precondition")
  );
}

/**
 * 1. User Profile Sync
 */
export async function syncUserProfileToFirestore(userId: string, profile: UserProfile): Promise<void> {
  if (!db || !userId) return;
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...profile, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Profile saved to local storage.");
    } else {
      console.warn("Error saving user profile to Firestore:", e?.message || e);
    }
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  if (!db || !userId) return null;
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Falling back to locally cached profile.");
    } else {
      console.warn("Could not fetch user profile from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 2. Study Topics Sync
 */
export async function syncTopicsToFirestore(
  userId: string,
  specialty: SpecialtyId,
  topics: StudyTopic[]
): Promise<void> {
  if (!db || !userId) return;
  try {
    const topicsDocRef = doc(db, "users", userId, "studyProgress", specialty);
    await setDoc(
      topicsDocRef,
      {
        specialty,
        topics,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Topics saved to local cache.");
    } else {
      console.warn("Error saving topics to Firestore:", e?.message || e);
    }
  }
}

export async function fetchTopicsFromFirestore(
  userId: string,
  specialty: SpecialtyId
): Promise<StudyTopic[] | null> {
  if (!db || !userId) return null;
  try {
    const topicsDocRef = doc(db, "users", userId, "studyProgress", specialty);
    const snap = await getDoc(topicsDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (Array.isArray(data.topics) && data.topics.length > 0) {
        return data.topics as StudyTopic[];
      }
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Using local topics.");
    } else {
      console.warn("Could not fetch topics from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 3. Answers History Sync
 */
export async function syncAnswerToFirestore(userId: string, answer: UserAnswerRecord): Promise<void> {
  if (!db || !userId) return;
  try {
    const answerId = `ans_${answer.questionId}_${Date.now()}`;
    const answerRef = doc(db, "users", userId, "answers", answerId);
    await setDoc(answerRef, answer);
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Answer recorded locally.");
    } else {
      console.warn("Error saving answer record to Firestore:", e?.message || e);
    }
  }
}

export async function fetchAnswersFromFirestore(userId: string): Promise<UserAnswerRecord[] | null> {
  if (!db || !userId) return null;
  try {
    const answersCol = collection(db, "users", userId, "answers");
    const q = query(answersCol, orderBy("timestamp", "desc"), limit(500));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const answers: UserAnswerRecord[] = [];
      snap.forEach((docSnap) => {
        answers.push(docSnap.data() as UserAnswerRecord);
      });
      return answers;
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Using local answers.");
    } else {
      console.warn("Could not fetch answers from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 4. Simulado Sessions Sync
 */
export async function syncSimuladoToFirestore(userId: string, session: SimuladoSession): Promise<void> {
  if (!db || !userId) return;
  try {
    const simRef = doc(db, "users", userId, "simulados", session.id);
    await setDoc(simRef, session);
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Simulado saved locally.");
    } else {
      console.warn("Error saving simulado session to Firestore:", e?.message || e);
    }
  }
}

export async function fetchSimuladosFromFirestore(userId: string): Promise<SimuladoSession[] | null> {
  if (!db || !userId) return null;
  try {
    const simsCol = collection(db, "users", userId, "simulados");
    const q = query(simsCol, orderBy("date", "desc"), limit(100));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const sessions: SimuladoSession[] = [];
      snap.forEach((docSnap) => {
        sessions.push(docSnap.data() as SimuladoSession);
      });
      return sessions;
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Using local simulados history.");
    } else {
      console.warn("Could not fetch simulados from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 5. Materials (PDFs & Summaries) Sync
 */
export async function syncMaterialToFirestore(userId: string, material: PDFMaterial): Promise<void> {
  if (!db || !userId) return;
  try {
    const matRef = doc(db, "users", userId, "materials", material.id);
    await setDoc(matRef, material);
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Material stored locally.");
    } else {
      console.warn("Error saving material to Firestore:", e?.message || e);
    }
  }
}

export async function fetchMaterialsFromFirestore(userId: string): Promise<PDFMaterial[] | null> {
  if (!db || !userId) return null;
  try {
    const matsCol = collection(db, "users", userId, "materials");
    const snap = await getDocs(matsCol);
    if (!snap.empty) {
      const mats: PDFMaterial[] = [];
      snap.forEach((docSnap) => {
        mats.push(docSnap.data() as PDFMaterial);
      });
      return mats;
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Using local materials.");
    } else {
      console.warn("Could not fetch materials from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 6. Questions Bank Sync (Shared & Inéditas)
 */
export async function syncQuestionToFirestore(question: Question): Promise<void> {
  if (!db) return;
  try {
    const qRef = doc(db, "questions", question.id);
    await setDoc(qRef, question, { merge: true });
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Question stored locally.");
    } else {
      console.warn("Error saving question to Firestore:", e?.message || e);
    }
  }
}

export async function syncMultipleQuestionsToFirestore(questions: Question[]): Promise<void> {
  if (!db || questions.length === 0) return;
  try {
    const batch = writeBatch(db);
    questions.forEach((q) => {
      const qRef = doc(db, "questions", q.id);
      batch.set(qRef, q, { merge: true });
    });
    await batch.commit();
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Questions stored in local storage.");
    } else {
      console.warn("Error batch saving questions to Firestore:", e?.message || e);
    }
  }
}

export async function fetchQuestionsFromFirestore(): Promise<Question[] | null> {
  if (!db) return null;
  try {
    const questionsCol = collection(db, "questions");
    const snap = await getDocs(questionsCol);
    if (!snap.empty) {
      const questions: Question[] = [];
      snap.forEach((docSnap) => {
        questions.push(docSnap.data() as Question);
      });
      return questions;
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Using local questions base.");
    } else {
      console.warn("Could not fetch questions from Firestore:", e?.message || e);
    }
  }
  return null;
}

/**
 * 7. Gamification (Achievements & Missions) Sync
 */
export async function syncGamificationToFirestore(
  userId: string,
  achievements: Achievement[],
  missions: DailyMission[]
): Promise<void> {
  if (!db || !userId) return;
  try {
    const gamificationRef = doc(db, "users", userId, "gamification", "state");
    await setDoc(
      gamificationRef,
      {
        achievements,
        missions,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Gamification progress stored locally.");
    } else {
      console.warn("Error saving gamification to Firestore:", e?.message || e);
    }
  }
}

export async function fetchGamificationFromFirestore(
  userId: string
): Promise<{ achievements: Achievement[]; missions: DailyMission[] } | null> {
  if (!db || !userId) return null;
  try {
    const gamificationRef = doc(db, "users", userId, "gamification", "state");
    const snap = await getDoc(gamificationRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        achievements: (data.achievements as Achievement[]) || [],
        missions: (data.missions as DailyMission[]) || [],
      };
    }
  } catch (e: any) {
    if (isOfflineError(e)) {
      console.warn("Firestore offline: Falling back to local gamification progress.");
    } else {
      console.warn("Could not fetch gamification from Firestore:", e?.message || e);
    }
  }
  return null;
}
