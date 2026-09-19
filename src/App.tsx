import React, { useState, useEffect } from "react";
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
} from "./types";
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredTopics,
  saveStoredTopics,
  getStoredQuestions,
  saveStoredQuestions,
  getStoredAnswers,
  saveStoredAnswers,
  getStoredSimulados,
  saveStoredSimulados,
  getStoredMaterials,
  saveStoredMaterials,
  getStoredAchievements,
  saveStoredAchievements,
  getStoredMissions,
  saveStoredMissions,
  loadUserDataFromFirestore,
  subscribeToSyncState,
} from "./utils/storage";
import { ensureAuthenticatedUser } from "./lib/firebase";
import { Navbar } from "./components/Navbar";
import { DashboardView } from "./components/DashboardView";
import { ScheduleView } from "./components/ScheduleView";
import { SimuladosView } from "./components/SimuladosView";
import { MaterialsView } from "./components/MaterialsView";
import { MentorView } from "./components/MentorView";
import { DatesTimelineView } from "./components/DatesTimelineView";
import { GamificationView } from "./components/GamificationView";
import { SpecialtyModal } from "./components/SpecialtyModal";
import { PrintMaterialModal } from "./components/PrintMaterialModal";
import { PrintScheduleModal } from "./components/PrintScheduleModal";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { SyllabusExplorerModal } from "./components/SyllabusExplorerModal";
import confetti from "canvas-confetti";
import { Sparkles, CheckCircle2, Trophy, AlertTriangle, X } from "lucide-react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [tabExtraParam, setTabExtraParam] = useState<any>(null);

  // Cloud Sync & Auth State
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "offline">("synced");
  const [currentUserIdState, setCurrentUserIdState] = useState<string | null>(null);

  // Theme State (Dark / Light) - Default to Light Mode (Sistema Claro)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("seduc_ce_theme");
    return saved === "dark";
  });

  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("seduc_ce_theme", next ? "dark" : "light");
      return next;
    });
  };

  // Modals state
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isPrintScheduleModalOpen, setIsPrintScheduleModalOpen] = useState<boolean>(false);
  const [isSyllabusExplorerModalOpen, setIsSyllabusExplorerModalOpen] = useState<boolean>(false);
  const [activePrintMaterial, setActivePrintMaterial] = useState<PDFMaterial | null>(null);

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type?: "success" | "info" | "warning" } | null>(null);

  // Data State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getStoredProfile());
  const [topics, setTopics] = useState<StudyTopic[]>(() => getStoredTopics(userProfile.specialty));
  const [questions, setQuestions] = useState<Question[]>(() => getStoredQuestions());
  const [answers, setAnswers] = useState<UserAnswerRecord[]>(() => getStoredAnswers());
  const [simulados, setSimulados] = useState<SimuladoSession[]>(() => getStoredSimulados());
  const [materials, setMaterials] = useState<PDFMaterial[]>(() => getStoredMaterials());
  const [achievements, setAchievements] = useState<Achievement[]>(() => getStoredAchievements());
  const [missions, setMissions] = useState<DailyMission[]>(() => getStoredMissions());

  // Firebase Auth and Firestore Data Hydration
  useEffect(() => {
    subscribeToSyncState((status) => {
      setSyncStatus(status);
    });

    const unsubAuth = ensureAuthenticatedUser(async (user) => {
      setCurrentUserIdState(user.uid);
      try {
        const cloudData = await loadUserDataFromFirestore(user.uid);

        if (cloudData.profile) {
          setUserProfile(cloudData.profile);
        } else {
          saveStoredProfile(userProfile, user.uid);
        }

        if (cloudData.topics && cloudData.topics.length > 0) {
          setTopics(cloudData.topics);
        } else {
          saveStoredTopics(userProfile.specialty, topics, user.uid);
        }

        if (cloudData.answers && cloudData.answers.length > 0) {
          setAnswers(cloudData.answers);
        }

        if (cloudData.simulados && cloudData.simulados.length > 0) {
          setSimulados(cloudData.simulados);
        }

        if (cloudData.materials && cloudData.materials.length > 0) {
          setMaterials(cloudData.materials);
        }

        if (cloudData.questions && cloudData.questions.length > 0) {
          setQuestions((prev) => {
            const map = new Map<string, Question>();
            prev.forEach((q) => map.set(q.id, q));
            cloudData.questions!.forEach((q) => map.set(q.id, q));
            return Array.from(map.values());
          });
        }

        if (cloudData.achievements && cloudData.achievements.length > 0) {
          setAchievements(cloudData.achievements);
        }

        if (cloudData.missions && cloudData.missions.length > 0) {
          setMissions(cloudData.missions);
        }
      } catch (err) {
        console.error("Error hydrating data from Firestore:", err);
      }
    });

    return () => {
      if (unsubAuth) unsubAuth();
    };
  }, []);

  // Show toast helper
  const showToast = (title: string, desc: string, type: "success" | "info" | "warning" = "success") => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Days until SEDUC-CE exam: 22 de Novembro de 2026
  const examDate = new Date("2026-11-22T08:00:00");
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysUntilExam = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Add XP helper with level-up detection
  const addXP = (amount: number, reason: string) => {
    setUserProfile((prev) => {
      const newXp = prev.xp + amount;
      const updated = { ...prev, xp: newXp };
      saveStoredProfile(updated);
      showToast(`+${amount} XP Conquistados!`, reason, "success");
      return updated;
    });
  };

  // Handle topic completion toggle
  const handleToggleTopicComplete = (topicId: string) => {
    setTopics((prev) => {
      const nextTopics = prev.map((t) => {
        if (t.id === topicId) {
          const isNowCompleted = !t.isCompleted;
          if (isNowCompleted) {
            addXP(20, `Tópico concluído: ${t.title}`);
            confetti({ particleCount: 40, spread: 60 });
          }
          return {
            ...t,
            isCompleted: isNowCompleted,
            isDelayed: isNowCompleted ? false : t.isDelayed,
            completedDate: isNowCompleted ? "Hoje" : undefined,
          };
        }
        return t;
      });
      saveStoredTopics(userProfile.specialty, nextTopics);
      return nextTopics;
    });
  };

  // Handle topic delayed toggle
  const handleToggleTopicDelayed = (topicId: string) => {
    setTopics((prev) => {
      const nextTopics = prev.map((t) => {
        if (t.id === topicId) {
          return { ...t, isDelayed: !t.isDelayed };
        }
        return t;
      });
      saveStoredTopics(userProfile.specialty, nextTopics);
      return nextTopics;
    });
  };

  // Handle topic personal notes
  const handleUpdateTopicNotes = (topicId: string, notes: string) => {
    setTopics((prev) => {
      const nextTopics = prev.map((t) => {
        if (t.id === topicId) {
          return { ...t, notes };
        }
        return t;
      });
      saveStoredTopics(userProfile.specialty, nextTopics);
      showToast("Anotação salva com sucesso!", "Sua nota foi gravada no edital.", "info");
      return nextTopics;
    });
  };

  // Intelligent Remanejamento with Mentor
  const handleRemanejarAtrasados = () => {
    setTopics((prev) => {
      const delayed = prev.filter((t) => t.isDelayed && !t.isCompleted);
      if (delayed.length === 0) {
        showToast("Tudo em dia!", "Você não possui tópicos atrasados.", "info");
        return prev;
      }

      // Reallocate delayed topics into the upcoming days
      let targetDay = 5;
      const reallocated = prev.map((t) => {
        if (t.isDelayed && !t.isCompleted) {
          const assignedDay = targetDay;
          targetDay = targetDay === 5 ? 6 : targetDay === 6 ? 1 : 2;
          return {
            ...t,
            isDelayed: false,
            scheduledDayOfWeek: assignedDay,
          };
        }
        return t;
      });

      saveStoredTopics(userProfile.specialty, reallocated);
      showToast(
        "Cronograma Remanejado com Sucesso!",
        `O Prof. Crateús redistribuiu ${delayed.length} conteúdo(s) atrasado(s) nos dias de menor sobrecarga.`,
        "success"
      );
      confetti({ particleCount: 35, spread: 70 });
      return reallocated;
    });
  };

  // Handle adding custom topic to syllabus
  const handleAddNewCustomTopic = (newTopic: Omit<StudyTopic, "id" | "isCompleted" | "isDelayed">) => {
    const fullNewTopic: StudyTopic = {
      ...newTopic,
      id: `custom-${Date.now()}`,
      isCompleted: false,
      isDelayed: false,
    };
    setTopics((prev) => {
      const nextTopics = [...prev, fullNewTopic];
      saveStoredTopics(userProfile.specialty, nextTopics);
      showToast("Tópico Adicionado ao Edital!", fullNewTopic.title, "success");
      return nextTopics;
    });
  };

  // Handle toggling subtopic completion
  const handleToggleSubtopic = (topicId: string, subtopicId: string) => {
    setTopics((prev) => {
      const updated = prev.map((t) => {
        if (t.id === topicId && t.subtopics) {
          const updatedSubs = t.subtopics.map((sub) => {
            if (sub.id === subtopicId) {
              const nextState = !sub.isCompleted;
              return {
                ...sub,
                isCompleted: nextState,
                completedDate: nextState ? new Date().toISOString() : undefined,
              };
            }
            return sub;
          });

          // Check if all subtopics are completed
          const allCompleted = updatedSubs.length > 0 && updatedSubs.every((s) => s.isCompleted);
          const anyCompleted = updatedSubs.some((s) => s.isCompleted);

          return {
            ...t,
            subtopics: updatedSubs,
            isCompleted: allCompleted ? true : (t.isCompleted && !anyCompleted ? false : t.isCompleted),
          };
        }
        return t;
      });

      saveStoredTopics(userProfile.specialty, updated);
      addXP(10, "Subtópico do Edital FUNECE Concluído!");
      return updated;
    });
  };

  // Handle importing custom syllabus topics
  const handleImportSyllabusText = (parsedTopics: StudyTopic[]) => {
    setTopics((prev) => {
      const merged = [...prev, ...parsedTopics];
      saveStoredTopics(userProfile.specialty, merged);
      showToast(
        "Edital Importado com Sucesso!",
        `${parsedTopics.length} novo(s) tópico(s) e seus subtópicos integrados ao cronograma.`,
        "success"
      );
      confetti({ particleCount: 60, spread: 80 });
      return merged;
    });
  };

  // Handle answering question
  const handleAnswerQuestion = (questionId: string, optionId: string): boolean => {
    const q = questions.find((item) => item.id === questionId);
    if (!q) return false;

    const isCorrect = q.correctOptionId === optionId;
    const newRecord: UserAnswerRecord = {
      questionId,
      selectedOptionId: optionId,
      isCorrect,
      timestamp: new Date().toISOString(),
      timeSpentSeconds: 45,
      topic: q.topic,
      discipline: q.discipline,
    };

    const nextAnswers = [newRecord, ...answers];
    setAnswers(nextAnswers);
    saveStoredAnswers(nextAnswers);

    if (isCorrect) {
      addXP(10, "Questão FUNECE respondida corretamente!");
    }

    // Check achievement unlock
    setAchievements((prev) => {
      const updated = prev.map((ach) => {
        if (ach.id === "ach-first-question" && !ach.isUnlocked) {
          ach.isUnlocked = true;
          ach.currentProgress = 1;
          showToast("🏆 Conquista Desbloqueada!", "Primeiro Passo Rumo à Posse!", "success");
        }
        if (ach.id === "ach-ldb-master" || ach.id === "ach-didatica-sharp") {
          ach.currentProgress = Math.min(ach.maxProgress, nextAnswers.length);
          if (ach.currentProgress >= ach.maxProgress && !ach.isUnlocked) {
            ach.isUnlocked = true;
            showToast("🏆 Conquista Desbloqueada!", ach.title, "success");
          }
        }
        return ach;
      });
      saveStoredAchievements(updated);
      return updated;
    });

    return isCorrect;
  };

  // Claim Daily Mission Reward
  const handleClaimMissionReward = (missionId: string) => {
    setMissions((prev) => {
      const updated = prev.map((m) => {
        if (m.id === missionId && !m.isCompleted) {
          m.isCompleted = true;
          m.currentCount = m.targetCount;
          addXP(m.xpReward, `Missão Diária Concluída: ${m.title}`);
          confetti({ particleCount: 45, spread: 70 });
        }
        return m;
      });
      saveStoredMissions(updated);
      return updated;
    });
  };

  // Handle specialty switch
  const handleSelectSpecialty = (newSpecialtyId: SpecialtyId, hoursPerDay: number) => {
    const updatedProfile: UserProfile = {
      ...userProfile,
      specialty: newSpecialtyId,
      hoursPerDay,
    };
    setUserProfile(updatedProfile);
    saveStoredProfile(updatedProfile);

    // Refresh topics for new specialty
    const newTopics = getStoredTopics(newSpecialtyId);
    setTopics(newTopics);

    showToast(
      "Especialidade Atualizada!",
      `Cronograma recalibrado para ${newSpecialtyId.toUpperCase()} com ${hoursPerDay}h diárias.`,
      "success"
    );
  };

  // Save new AI questions
  const handleSaveNewQuestions = (newQuestions: Question[]) => {
    const combined = [...newQuestions, ...questions];
    setQuestions(combined);
    saveStoredQuestions(combined);
    showToast(
      "Questões Inéditas Adicionadas!",
      `${newQuestions.length} novas questões no padrão FUNECE prontas para treino.`,
      "success"
    );
  };

  // Save Simulado session
  const handleSaveSimuladoSession = (session: SimuladoSession) => {
    const combined = [session, ...simulados];
    setSimulados(combined);
    saveStoredSimulados(combined);
    addXP(session.correctCount * 15, `Simulado Finalizado: ${session.scorePercentage}% de aproveitamento`);
  };

  // Save new PDF material
  const handleSaveNewMaterial = (material: PDFMaterial) => {
    const combined = [material, ...materials];
    setMaterials(combined);
    saveStoredMaterials(combined);
    showToast("Resumo em PDF Gerado!", material.title, "success");
  };

  // Tab navigation with optional extra payload
  const handleNavigateTab = (tab: string, extra?: any) => {
    setActiveTab(tab);
    setTabExtraParam(extra);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white ${
        isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce max-w-sm w-full">
          <div
            className={`rounded-2xl p-4 shadow-2xl border flex items-start justify-between gap-3 text-white ${
              toastMessage.type === "warning"
                ? "bg-amber-950 border-amber-500"
                : toastMessage.type === "info"
                ? "bg-slate-900 border-slate-700"
                : "bg-emerald-950 border-emerald-500"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-1.5 rounded-lg mt-0.5 ${
                  toastMessage.type === "warning"
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black">{toastMessage.title}</div>
                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toastMessage.desc}</div>
              </div>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(t) => handleNavigateTab(t)}
        userProfile={userProfile}
        onOpenSpecialtyModal={() => setIsSpecialtyModalOpen(true)}
        daysUntilExam={daysUntilExam}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        cloudSyncStatus={syncStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "dashboard" && (
          <DashboardView
            userProfile={userProfile}
            topics={topics}
            questions={questions}
            missions={missions}
            simulados={simulados}
            onToggleTopicComplete={handleToggleTopicComplete}
            onNavigateTab={handleNavigateTab}
            onAnswerQuestion={handleAnswerQuestion}
            onClaimMissionReward={handleClaimMissionReward}
            onRemanejarAtrasados={handleRemanejarAtrasados}
            onOpenPrintScheduleModal={() => setIsPrintScheduleModalOpen(true)}
            daysUntilExam={daysUntilExam}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "cronograma" && (
          <ScheduleView
            topics={topics}
            userProfile={userProfile}
            onToggleTopicComplete={handleToggleTopicComplete}
            onToggleTopicDelayed={handleToggleTopicDelayed}
            onUpdateTopicNotes={handleUpdateTopicNotes}
            onRemanejarAtrasados={handleRemanejarAtrasados}
            onNavigateTab={handleNavigateTab}
            onOpenPrintScheduleModal={() => setIsPrintScheduleModalOpen(true)}
            onAddNewCustomTopic={handleAddNewCustomTopic}
            onToggleSubtopic={handleToggleSubtopic}
            onOpenSyllabusExplorerModal={() => setIsSyllabusExplorerModalOpen(true)}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "simulados" && (
          <SimuladosView
            questions={questions}
            topics={topics}
            userProfile={userProfile}
            answers={answers}
            simulados={simulados}
            onAnswerQuestion={handleAnswerQuestion}
            onSaveNewQuestions={handleSaveNewQuestions}
            onSaveSimuladoSession={handleSaveSimuladoSession}
            initialTopicFilter={tabExtraParam?.topic}
            initialSubtopicFilter={tabExtraParam?.subtopic}
            onNavigateTab={handleNavigateTab}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "materiais" && (
          <MaterialsView
            materials={materials}
            userProfile={userProfile}
            onSaveNewMaterial={handleSaveNewMaterial}
            onOpenPrintModal={(mat) => setActivePrintMaterial(mat)}
            initialTopicFilter={tabExtraParam?.topicTitle}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "mentor" && (
          <MentorView
            userProfile={userProfile}
            topics={topics}
            answers={answers}
            onRemanejarAtrasados={handleRemanejarAtrasados}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "datas" && (
          <DatesTimelineView
            daysUntilExam={daysUntilExam}
            isDarkMode={isDarkMode}
          />
        )}

        {activeTab === "gamificacao" && (
          <GamificationView
            userProfile={userProfile}
            achievements={achievements}
            missions={missions}
            onClaimMissionReward={handleClaimMissionReward}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-6 text-center text-xs transition-colors ${
          isDarkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-white border-slate-200 text-slate-500"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            SEDUC Ceará • Plataforma Preparatória para Professor Pleno • Foco FUNECE / CEV-UECE
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Prova: 22 de Novembro de 2026</span>
            <span>•</span>
            <span>Mentor Inteligente FUNECE Ativo</span>
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        topics={topics}
        questions={questions}
        materials={materials}
        onNavigateToTopic={(t) => handleNavigateTab("cronograma", { topic: t.title })}
        onNavigateToQuestion={(q) => handleNavigateTab("simulados", { topic: q.topic })}
        onNavigateToMaterial={(m) => handleNavigateTab("materiais", { topicTitle: m.title })}
        onNavigateToDates={() => handleNavigateTab("datas")}
        isDarkMode={isDarkMode}
      />

      {/* Specialty Configuration Modal */}
      <SpecialtyModal
        isOpen={isSpecialtyModalOpen}
        onClose={() => setIsSpecialtyModalOpen(false)}
        currentSpecialty={userProfile.specialty}
        currentHoursPerDay={userProfile.hoursPerDay}
        onSelectSpecialty={handleSelectSpecialty}
        isDarkMode={isDarkMode}
      />

      {/* PDF Print & Export Modal for Materials */}
      <PrintMaterialModal
        material={activePrintMaterial}
        onClose={() => setActivePrintMaterial(null)}
      />

      {/* PDF Print & Export Modal for Full Schedule & Syllabus */}
      <PrintScheduleModal
        isOpen={isPrintScheduleModalOpen}
        onClose={() => setIsPrintScheduleModalOpen(false)}
        userProfile={userProfile}
        topics={topics}
        daysUntilExam={daysUntilExam}
      />

      {/* Syllabus Explorer & Verticalized Edital Modal */}
      <SyllabusExplorerModal
        isOpen={isSyllabusExplorerModalOpen}
        onClose={() => setIsSyllabusExplorerModalOpen(false)}
        topics={topics}
        userProfile={userProfile}
        onToggleSubtopic={handleToggleSubtopic}
        onImportSyllabusText={handleImportSyllabusText}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
