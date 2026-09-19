import React, { useState, useEffect, useMemo } from "react";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Filter,
  RefreshCw,
  BookOpen,
  Trophy,
  Layers,
  Zap,
  Bookmark,
  Send,
  BarChart2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  X,
  Target,
  ListFilter,
  Flame,
  FileText,
  Bot,
  MessageSquare,
} from "lucide-react";
import {
  Question,
  UserAnswerRecord,
  SimuladoSession,
  SpecialtyId,
  UserProfile,
  StudyTopic,
  StudySubtopic,
  TopicModule,
} from "../types";
import { SPECIALTIES } from "../data/specialties";
import { generateFuneceQuestions } from "../services/geminiService";
import confetti from "canvas-confetti";
import { FormattedMentorText } from "./FormattedMentorText";
import { SimuladoChatbotModal } from "./SimuladoChatbotModal";

interface SimuladosViewProps {
  questions: Question[];
  topics?: StudyTopic[];
  userProfile: UserProfile;
  answers: UserAnswerRecord[];
  simulados: SimuladoSession[];
  onAnswerQuestion: (questionId: string, optionId: string) => boolean;
  onSaveNewQuestions: (newQuestions: Question[]) => void;
  onSaveSimuladoSession: (session: SimuladoSession) => void;
  initialTopicFilter?: string;
  initialSubtopicFilter?: string;
  onNavigateTab?: (tab: string, extra?: any) => void;
  isDarkMode?: boolean;
}

export const SimuladosView: React.FC<SimuladosViewProps> = ({
  questions,
  topics = [],
  userProfile,
  answers,
  simulados,
  onAnswerQuestion,
  onSaveNewQuestions,
  onSaveSimuladoSession,
  initialTopicFilter,
  initialSubtopicFilter,
  onNavigateTab,
  isDarkMode = false,
}) => {
  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];

  const [activeMode, setActiveMode] = useState<"treino" | "simulado_oficial" | "caderno_erros" | "historico">("treino");
  
  // Discipline / Assunto / Microassunto selection states
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>(initialTopicFilter || "all");
  const [selectedSubtopic, setSelectedSubtopic] = useState<string>(initialSubtopicFilter || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchFilter, setSearchFilter] = useState<string>("");
  
  // Subject & Microsubject Explorer Modal state
  const [isExplorerModalOpen, setIsExplorerModalOpen] = useState<boolean>(false);
  const [explorerSearch, setExplorerSearch] = useState<string>("");

  // AI Generator states
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiTopicInput, setAiTopicInput] = useState<string>(initialTopicFilter || "");

  // Timed Simulation State
  const [isSimRunning, setIsSimRunning] = useState<boolean>(false);
  const [simDurationMinutes, setSimDurationMinutes] = useState<number>(20);
  const [simQuestionCount, setSimQuestionCount] = useState<number>(10);
  const [simScope, setSimScope] = useState<"geral" | "topico_selecionado">("geral");
  const [simTimeRemaining, setSimTimeRemaining] = useState<number>(1200); // 20 mins
  const [simAnswers, setSimAnswers] = useState<Record<string, string>>({});
  const [simFinishedResult, setSimFinishedResult] = useState<SimuladoSession | null>(null);

  // Answer tracking for Treino mode
  const [userSelectedOptions, setUserSelectedOptions] = useState<Record<string, string>>({});

  // Gemini Multi-turn Chatbot Modal State
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);
  const [chatbotQuestion, setChatbotQuestion] = useState<Question | null>(null);
  const [chatbotUserOption, setChatbotUserOption] = useState<string | null>(null);

  const handleOpenChatbot = (question?: Question | null, userOption?: string | null) => {
    setChatbotQuestion(question || null);
    setChatbotUserOption(userOption || null);
    setIsChatbotOpen(true);
  };

  // Dedicated Elite AI Generator Modal State
  const [isEliteModalOpen, setIsEliteModalOpen] = useState<boolean>(false);
  const [eliteAssunto, setEliteAssunto] = useState<string>("");
  const [eliteSubassunto, setEliteSubassunto] = useState<string>("");
  const [newlyGeneratedQuestionId, setNewlyGeneratedQuestionId] = useState<string | null>(null);

  // Sync initial filters if prop changes
  useEffect(() => {
    if (initialTopicFilter) {
      setSelectedTopic(initialTopicFilter);
    }
    if (initialSubtopicFilter) {
      setSelectedSubtopic(initialSubtopicFilter);
    }
  }, [initialTopicFilter, initialSubtopicFilter]);

  // Discipline options mapped from official syllabus
  const disciplines = [
    { id: "all", name: "Todas as Matérias", module: null },
    { id: "conhecimentos_especificos", name: `Específica: ${currentSpecialty.name}`, module: "conhecimentos_especificos" as TopicModule },
    { id: "lingua_portuguesa", name: "Língua Portuguesa", module: "lingua_portuguesa" as TopicModule },
    { id: "educacao_brasileira_didatica", name: "Didática & Pedagogia", module: "educacao_brasileira_didatica" as TopicModule },
    { id: "administracao_publica", name: "Administração Pública", module: "administracao_publica" as TopicModule },
    { id: "indicadores_educacionais", name: "Indicadores (SPAECE/SAEB)", module: "indicadores_educacionais" as TopicModule },
    { id: "legislacao_educacional_ce", name: "Legislação SEDUC-CE", module: "legislacao_educacional_ce" as TopicModule },
  ];

  // Filter available topics based on selected discipline
  const availableTopics = useMemo(() => {
    if (selectedDiscipline === "all") {
      return topics;
    }
    return topics.filter((t) => t.moduleId === selectedDiscipline);
  }, [topics, selectedDiscipline]);

  // Find currently active topic object if one is selected
  const activeTopicObj = useMemo(() => {
    if (selectedTopic === "all") return null;
    return topics.find((t) => t.title === selectedTopic || t.id === selectedTopic);
  }, [topics, selectedTopic]);

  // Available subtopics for the active topic (or all subtopics if discipline selected)
  const availableSubtopics = useMemo(() => {
    if (activeTopicObj && activeTopicObj.subtopics) {
      return activeTopicObj.subtopics;
    }
    if (selectedDiscipline !== "all") {
      const allSubs: StudySubtopic[] = [];
      availableTopics.forEach((t) => {
        if (t.subtopics) {
          allSubs.push(...t.subtopics);
        }
      });
      return allSubs;
    }
    return [];
  }, [activeTopicObj, selectedDiscipline, availableTopics]);

  // Timer loop for timed simulation
  useEffect(() => {
    let interval: any = null;
    if (isSimRunning && simTimeRemaining > 0) {
      interval = setInterval(() => {
        setSimTimeRemaining((prev) => {
          if (prev <= 1) {
            handleFinishTimedSim();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSimRunning, simTimeRemaining]);

  // Set of wrongly answered questions
  const wrongQuestionIds = useMemo(() => {
    return new Set(answers.filter((a) => !a.isCorrect).map((a) => a.questionId));
  }, [answers]);

  // Comprehensive Smart Filter for Questions List
  const filteredQuestions = useMemo(() => {
    const matched = questions.filter((q) => {
      // 1. Caderno de Erros mode filter
      if (activeMode === "caderno_erros") {
        if (!wrongQuestionIds.has(q.id)) return false;
      }

      // 2. Discipline filter
      if (selectedDiscipline !== "all") {
        const discObj = disciplines.find((d) => d.id === selectedDiscipline);
        const discName = discObj?.name || "";
        const modId = discObj?.module || "";

        const matchDiscipline =
          q.discipline?.toLowerCase().includes(discName.toLowerCase()) ||
          q.discipline?.toLowerCase().includes(modId.toLowerCase()) ||
          (selectedDiscipline === "conhecimentos_especificos" &&
            (q.specialty === userProfile.specialty ||
              q.discipline?.toLowerCase().includes("específic") ||
              q.discipline?.toLowerCase().includes(currentSpecialty.name.toLowerCase()))) ||
          (selectedDiscipline === "lingua_portuguesa" && q.discipline?.toLowerCase().includes("portugu")) ||
          (selectedDiscipline === "educacao_brasileira_didatica" &&
            (q.discipline?.toLowerCase().includes("didát") || q.discipline?.toLowerCase().includes("educa"))) ||
          (selectedDiscipline === "administracao_publica" && q.discipline?.toLowerCase().includes("administra")) ||
          (selectedDiscipline === "indicadores_educacionais" &&
            (q.discipline?.toLowerCase().includes("indicador") || q.discipline?.toLowerCase().includes("spaece"))) ||
          (selectedDiscipline === "legislacao_educacional_ce" &&
            (q.discipline?.toLowerCase().includes("legisla") || q.discipline?.toLowerCase().includes("cear")));

        if (!matchDiscipline) return false;
      }

      // 3. Subject (Tópico) filter
      if (selectedTopic !== "all") {
        const topicNorm = selectedTopic.toLowerCase();
        const qTopicNorm = (q.topic || "").toLowerCase();
        const matchTopic =
          qTopicNorm.includes(topicNorm) ||
          topicNorm.includes(qTopicNorm) ||
          (q.subtopic && q.subtopic.toLowerCase().includes(topicNorm));

        if (!matchTopic) return false;
      }

      // 4. Microassunto (Subtópico) filter
      if (selectedSubtopic !== "all") {
        const subNorm = selectedSubtopic.toLowerCase();
        const qSubNorm = (q.subtopic || "").toLowerCase();
        const qStatementNorm = q.statement.toLowerCase();
        const qExplanationNorm = q.explanation.toLowerCase();
        const qInsightNorm = (q.funeceInsight || "").toLowerCase();

        // Extract key words from subtopic for fuzzy match
        const subKeywords = subNorm
          .replace(/[0-9.]/g, "")
          .split(/[\s,()/-]+/)
          .filter((w) => w.length > 4);

        const matchSubDirect = qSubNorm.includes(subNorm) || subNorm.includes(qSubNorm);
        const matchSubContent = subKeywords.some(
          (k) => qStatementNorm.includes(k) || qExplanationNorm.includes(k) || qInsightNorm.includes(k)
        );

        if (!matchSubDirect && !matchSubContent) return false;
      }

      // 5. Difficulty filter
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) {
        return false;
      }

      // 6. Free text search filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const matchText =
          q.statement.toLowerCase().includes(query) ||
          (q.topic || "").toLowerCase().includes(query) ||
          (q.subtopic || "").toLowerCase().includes(query) ||
          q.explanation.toLowerCase().includes(query) ||
          (q.funeceInsight || "").toLowerCase().includes(query) ||
          (q.legalOrAuthorReference || "").toLowerCase().includes(query);

        if (!matchText) return false;
      }

      return true;
    });

    // Ensure newly generated elite question is always presented at the top of the stream
    if (newlyGeneratedQuestionId) {
      const newQ = (questions || []).find((q) => q.id === newlyGeneratedQuestionId);
      if (newQ) {
        return [newQ, ...matched.filter((q) => q.id !== newlyGeneratedQuestionId)];
      }
    }

    return matched;
  }, [
    questions,
    activeMode,
    wrongQuestionIds,
    selectedDiscipline,
    selectedTopic,
    selectedSubtopic,
    selectedDifficulty,
    searchFilter,
    userProfile.specialty,
    currentSpecialty.name,
    disciplines,
    newlyGeneratedQuestionId,
  ]);

  // Handle single question answer in Treino mode
  const handleAnswerTreino = (questionId: string, optionId: string) => {
    if (userSelectedOptions[questionId]) return;
    setUserSelectedOptions((prev) => ({ ...prev, [questionId]: optionId }));
    const isCorrect = onAnswerQuestion(questionId, optionId);
    if (isCorrect) {
      confetti({ particleCount: 30, spread: 50 });
    }
  };

  // Start Official Timed Simulado
  const handleStartTimedSim = (durationMinutes = 20, questionCount = 10) => {
    setSimDurationMinutes(durationMinutes);
    setSimQuestionCount(questionCount);
    setSimTimeRemaining(durationMinutes * 60);
    setSimAnswers({});
    setSimFinishedResult(null);
    setIsSimRunning(true);
  };

  // Questions for the active simulation session
  const simTargetQuestions = useMemo(() => {
    if (simScope === "topico_selecionado" && selectedTopic !== "all") {
      return filteredQuestions.slice(0, simQuestionCount);
    }
    // Random or top mixed questions from whole database
    const pool = questions.filter((q) => !q.specialty || q.specialty === userProfile.specialty);
    return pool.slice(0, simQuestionCount);
  }, [simScope, selectedTopic, filteredQuestions, questions, simQuestionCount, userProfile.specialty]);

  // Finish Timed Simulado
  const handleFinishTimedSim = () => {
    setIsSimRunning(false);
    let correct = 0;

    const answersList = simTargetQuestions.map((q) => {
      const selected = simAnswers[q.id] || "";
      const isCorrect = selected === q.correctOptionId;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        selected,
        correct: q.correctOptionId,
        isCorrect,
      };
    });

    const scorePercentage = Math.round((correct / Math.max(1, simTargetQuestions.length)) * 100);
    const timeSpentSecs = simDurationMinutes * 60 - simTimeRemaining;

    const session: SimuladoSession = {
      id: `sim-${Date.now()}`,
      title:
        simScope === "topico_selecionado" && selectedTopic !== "all"
          ? `Simulado Temático: ${selectedTopic}`
          : `Simulado Geral FUNECE • ${currentSpecialty.name}`,
      date: new Date().toLocaleDateString("pt-BR"),
      specialty: userProfile.specialty,
      totalQuestions: simTargetQuestions.length,
      correctCount: correct,
      wrongCount: simTargetQuestions.length - correct,
      timeSpentSeconds: timeSpentSecs,
      scorePercentage,
      mode: "cronometrado",
      answers: answersList,
    };

    setSimFinishedResult(session);
    onSaveSimuladoSession(session);
    confetti({ particleCount: 60, spread: 80 });
  };

  // State for generation success toast
  const [generationNotice, setGenerationNotice] = useState<string | null>(null);

  // AI Question Generation Handler for currently active topic or microtopic
  const handleGenerateAiForTopic = async (topicToUse?: string, subtopicToUse?: string) => {
    let targetTopic = (topicToUse || eliteAssunto || aiTopicInput).trim();
    let targetSub = (subtopicToUse || eliteSubassunto).trim();

    if (!targetTopic) {
      if (selectedTopic !== "all") {
        targetTopic = selectedTopic;
      } else if (selectedDiscipline !== "all") {
        const dObj = disciplines.find(d => d.id === selectedDiscipline);
        targetTopic = dObj?.name || currentSpecialty.name;
      } else {
        targetTopic = currentSpecialty.name;
      }
    }
    if (!targetSub && selectedSubtopic !== "all") {
      targetSub = selectedSubtopic;
    }

    // Collect statements of existing questions for this topic/subtopic to prevent repetitions
    const existingRelated = (questions || []).filter((q) => {
      const matchTopic = targetTopic && q.topic?.toLowerCase().includes(targetTopic.toLowerCase());
      const matchSub = targetSub && q.subtopic?.toLowerCase().includes(targetSub.toLowerCase());
      return matchTopic || matchSub;
    });
    const avoidStatements = existingRelated.map((q) => q.statement.slice(0, 130));

    setIsGeneratingAi(true);
    setGenerationNotice(null);
    try {
      const newGenerated = await generateFuneceQuestions(
        userProfile.specialty,
        targetTopic,
        1,
        targetSub || undefined,
        avoidStatements
      );

      if (newGenerated && newGenerated.length > 0) {
        // Tag with current topic/subtopic and proper discipline
        const targetDiscName = selectedDiscipline !== "all" 
          ? (disciplines.find(d => d.id === selectedDiscipline)?.name || "Conhecimentos Específicos")
          : (targetTopic.toLowerCase().includes("ldb") || targetTopic.toLowerCase().includes("didát") || targetTopic.toLowerCase().includes("pedagog")
              ? "Didática & Pedagogia"
              : targetTopic.toLowerCase().includes("portugu")
              ? "Língua Portuguesa"
              : targetTopic.toLowerCase().includes("administra")
              ? "Administração Pública"
              : targetTopic.toLowerCase().includes("indicador") || targetTopic.toLowerCase().includes("spaece")
              ? "Indicadores (SPAECE/SAEB)"
              : `Específica: ${currentSpecialty.name}`);

        const formatted = newGenerated.map((g) => ({
          ...g,
          discipline: g.discipline || targetDiscName,
          topic: targetTopic || g.topic || "Conhecimentos Específicos",
          subtopic: targetSub || g.subtopic || undefined,
          specialty: userProfile.specialty,
        }));

        onSaveNewQuestions(formatted);
        setAiTopicInput("");
        setEliteAssunto("");
        setEliteSubassunto("");
        setIsEliteModalOpen(false);
        setActiveMode("treino");
        setNewlyGeneratedQuestionId(formatted[0].id);

        // Clear search and filter locks so the user immediately sees the generated questions in their list!
        setSelectedDiscipline("all");
        setSelectedTopic("all");
        setSelectedSubtopic("all");
        setSearchFilter("");

        confetti({ particleCount: 50, spread: 70 });
        const subDisplay = targetSub ? ` (${targetSub})` : "";
        setGenerationNotice(`🎉 1 nova questão inédita de altíssimo nível sobre "${targetTopic}${subDisplay}" foi adicionada com sucesso ao seu banco de questões!`);
        setTimeout(() => setGenerationNotice(null), 10000);
      } else {
        setGenerationNotice("Não foi possível gerar a questão neste momento. Tente novamente.");
        setTimeout(() => setGenerationNotice(null), 6000);
      }
    } catch (e) {
      console.error("Erro gerando questões:", e);
      setGenerationNotice("Ocorreu um erro ao conectar com o gerador de questões. Tente novamente.");
      setTimeout(() => setGenerationNotice(null), 6000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Clear all filters helper
  const handleClearFilters = () => {
    setSelectedDiscipline("all");
    setSelectedTopic("all");
    setSelectedSubtopic("all");
    setSelectedDifficulty("all");
    setSearchFilter("");
  };

  // Format seconds to mm:ss
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Filter topics and subtopics inside the Explorer Modal
  const explorerFilteredTree = useMemo(() => {
    if (!explorerSearch.trim()) return topics;
    const query = explorerSearch.toLowerCase();
    return topics.filter((t) => {
      const topicMatch = t.title.toLowerCase().includes(query) || t.moduleName.toLowerCase().includes(query);
      const subMatch = t.subtopics?.some((s) => s.title.toLowerCase().includes(query) || (s.description || "").toLowerCase().includes(query));
      return topicMatch || subMatch;
    });
  }, [topics, explorerSearch]);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner & Instant AI Generator */}
      <div
        className={`rounded-2xl border p-6 sm:p-7 transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Simulados & Treino por Assunto e Microassunto • FUNECE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Banco de Questões • {currentSpecialty.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Filtre questões por <strong className="text-slate-700 dark:text-slate-300">disciplina, assunto ou microassunto do edital</strong>, treine no modo imediato ou gere questões inéditas com IA.
            </p>
          </div>

          {/* Quick AI Generator Box & Elite Generator Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg w-full">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={selectedSubtopic !== "all" ? `Gerar sobre: ${selectedSubtopic}` : selectedTopic !== "all" ? `Gerar sobre: ${selectedTopic}` : `Gerar rápido (ex: LDB Art. 14, Citologia...)`}
                value={aiTopicInput}
                onChange={(e) => setAiTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateAiForTopic()}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none pr-8 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                }`}
              />
              {aiTopicInput && (
                <button
                  onClick={() => setAiTopicInput("")}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                disabled={isGeneratingAi}
                onClick={() => handleGenerateAiForTopic()}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm active:scale-95"
                title={aiTopicInput.trim() ? `Gerar 1 questão sobre "${aiTopicInput.trim()}"` : selectedTopic !== "all" ? `Gerar 1 questão sobre "${selectedTopic}"` : `Gerar 1 questão de ${currentSpecialty.name}`}
              >
                {isGeneratingAi ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isGeneratingAi ? "Criando..." : "Gerar Rápido"}</span>
              </button>

              <button
                onClick={() => {
                  if (selectedTopic !== "all") setEliteAssunto(selectedTopic);
                  if (selectedSubtopic !== "all") setEliteSubassunto(selectedSubtopic);
                  setIsEliteModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 hover:from-amber-500/25 hover:to-rose-500/25 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Elaborador Especializado com Assunto e Subassunto de Rigor Extremo"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>IA de Elite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          className={`mt-5 pt-4 border-t flex flex-wrap items-center gap-2 ${
            isDarkMode ? "border-slate-800" : "border-slate-100"
          }`}
        >
          <button
            onClick={() => setActiveMode("treino")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === "treino"
                ? "bg-amber-600 text-white shadow-sm"
                : isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Modo Treino (Gabarito Imediato)</span>
          </button>

          <button
            onClick={() => setActiveMode("simulado_oficial")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === "simulado_oficial"
                ? "bg-amber-600 text-white shadow-sm"
                : isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Simulado Oficial Cronometrado</span>
          </button>

          <button
            onClick={() => setActiveMode("caderno_erros")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === "caderno_erros"
                ? "bg-rose-600 text-white shadow-sm"
                : isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Caderno de Erros ({wrongQuestionIds.size})</span>
          </button>

          <button
            onClick={() => setActiveMode("historico")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === "historico"
                ? "bg-slate-700 text-white shadow-sm"
                : isDarkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Histórico ({simulados.length})</span>
          </button>

          <button
            onClick={() => handleOpenChatbot(null, null)}
            className="sm:ml-auto flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-sm hover:from-amber-600 hover:to-rose-700 active:scale-95"
            title="Abrir Chatbot Tutor Gemini de Simulados FUNECE"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chatbot Tutor Gemini</span>
          </button>
        </div>
      </div>

      {/* Generation Notice Toast */}
      {generationNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 animate-fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{generationNotice}</span>
          </div>
          <button
            onClick={() => setGenerationNotice(null)}
            className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. SELETOR DE ASSUNTO & MICROASSUNTO (Filtro Hierárquico Completo) */}
      {(activeMode === "treino" || activeMode === "caderno_erros" || activeMode === "simulado_oficial") && (
        <div
          className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm">Escolher Assunto & Microassunto do Edital</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExplorerModalOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 hover:bg-slate-750 text-slate-200"
                    : "bg-slate-50 border-slate-300 hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Search className="w-3.5 h-3.5 text-amber-500" />
                <span>Explorar Árvore do Edital</span>
              </button>

              {(selectedDiscipline !== "all" ||
                selectedTopic !== "all" ||
                selectedSubtopic !== "all" ||
                searchFilter) && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 px-2 py-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Limpar</span>
                </button>
              )}
            </div>
          </div>

          {/* 3-Level Cascading Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Level 1: Disciplina / Módulo */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                1. Disciplina / Módulo
              </label>
              <select
                value={selectedDiscipline}
                onChange={(e) => {
                  setSelectedDiscipline(e.target.value);
                  setSelectedTopic("all");
                  setSelectedSubtopic("all");
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                }`}
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level 2: Assunto (Tópico) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Assunto (Tópico)
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  setSelectedTopic(e.target.value);
                  setSelectedSubtopic("all");
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                }`}
              >
                <option value="all">Todos os Assuntos ({availableTopics.length} disponíveis)</option>
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Level 3: Microassunto (Subtópico) */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Microassunto (Subtópico)
              </label>
              <select
                value={selectedSubtopic}
                onChange={(e) => setSelectedSubtopic(e.target.value)}
                disabled={availableSubtopics.length === 0}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium border outline-none cursor-pointer disabled:opacity-50 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                }`}
              >
                <option value="all">
                  {availableSubtopics.length === 0
                    ? "Selecione um Assunto primeiro"
                    : `Todos os Microassuntos (${availableSubtopics.length})`}
                </option>
                {availableSubtopics.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Search inside statements & difficulty filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filtrar por palavra no enunciado (ex: 'Libâneo', 'Art. 14', 'cloroplasto')..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border outline-none ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                    : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
                }`}
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                {filteredQuestions.length} questões encontradas
              </span>

              {/* 1-Click Generate AI for chosen Microassunto/Topic */}
              {(selectedTopic !== "all" || selectedSubtopic !== "all") && (
                <button
                  disabled={isGeneratingAi}
                  onClick={() => handleGenerateAiForTopic(selectedTopic !== "all" ? selectedTopic : undefined, selectedSubtopic !== "all" ? selectedSubtopic : undefined)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 shrink-0"
                  title="Gera 1 questão inédita explorando uma faceta diferente deste microassunto/assunto"
                >
                  {isGeneratingAi ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>+1 Questão Inédita {selectedSubtopic !== "all" ? "deste Microassunto" : "deste Assunto"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Pill Badge */}
          {(selectedDiscipline !== "all" || selectedTopic !== "all" || selectedSubtopic !== "all") && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                Filtro Ativo:
              </span>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                <span>
                  {disciplines.find((d) => d.id === selectedDiscipline)?.name}
                  {selectedTopic !== "all" && ` › ${selectedTopic}`}
                  {selectedSubtopic !== "all" && ` › ${selectedSubtopic}`}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="ml-1 hover:text-amber-800 dark:hover:text-white"
                  title="Remover filtro"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Timed Simulation Active View */}
      {activeMode === "simulado_oficial" && (
        <div
          className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          {!isSimRunning && !simFinishedResult ? (
            <div className="text-center py-6 space-y-5 max-w-md mx-auto">
              <Clock className="w-12 h-12 text-amber-500 mx-auto animate-pulse" />
              <div>
                <h2 className="text-xl font-black">Iniciar Simulado Cronometrado FUNECE</h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Teste seus conhecimentos sob pressão de tempo no padrão da CEV-UECE sem ver o gabarito durante a prova.
                </p>
              </div>

              {/* Simulation Scope Options */}
              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-850 dark:border-slate-800 text-left space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Configuração da Prova
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSimScope("geral")}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      simScope === "geral"
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div>Simulado Geral</div>
                    <div className="text-[10px] font-normal opacity-80 mt-0.5">Todas as disciplinas</div>
                  </button>

                  <button
                    onClick={() => setSimScope("topico_selecionado")}
                    disabled={selectedTopic === "all"}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all disabled:opacity-40 ${
                      simScope === "topico_selecionado"
                        ? "bg-amber-600 text-white border-amber-500 shadow-sm"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div>Simulado do Assunto</div>
                    <div className="text-[10px] font-normal opacity-80 mt-0.5 truncate">
                      {selectedTopic !== "all" ? selectedTopic : "Selecione um assunto acima"}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tempo:</span>
                    <select
                      value={simDurationMinutes}
                      onChange={(e) => setSimDurationMinutes(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg border text-xs bg-white dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value={10}>10 min</option>
                      <option value={20}>20 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Questões:</span>
                    <select
                      value={simQuestionCount}
                      onChange={(e) => setSimQuestionCount(Number(e.target.value))}
                      className="px-2 py-1 rounded-lg border text-xs bg-white dark:bg-slate-800 dark:border-slate-700"
                    >
                      <option value={5}>5 questões</option>
                      <option value={10}>10 questões</option>
                      <option value={15}>15 questões</option>
                      <option value={20}>20 questões</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartTimedSim(simDurationMinutes, simQuestionCount)}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Começar Simulado ({simQuestionCount} questões • {simDurationMinutes} min)</span>
              </button>
            </div>
          ) : isSimRunning ? (
            <div className="space-y-6">
              {/* Simulation Header with Countdown Timer */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between sticky top-20 z-20 backdrop-blur-md ${
                  isDarkMode ? "bg-slate-850/95 border-slate-700" : "bg-slate-50/95 border-slate-300 shadow-md"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Tempo Restante:
                  </div>
                  <div className="text-xl sm:text-2xl font-mono font-black text-amber-500">
                    {formatTimer(simTimeRemaining)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    Respondidas: {Object.keys(simAnswers).length} / {simTargetQuestions.length}
                  </span>
                  <button
                    onClick={handleFinishTimedSim}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs active:scale-95 transition-all shadow-sm"
                  >
                    Finalizar e Entregar
                  </button>
                </div>
              </div>

              {/* Questions List for the Sim */}
              <div className="space-y-6">
                {simTargetQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDarkMode ? "bg-slate-850 border-slate-750" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-bold uppercase text-amber-500">
                        Questão {idx + 1} de {simTargetQuestions.length}
                      </span>
                      <span>{q.topic || q.discipline}</span>
                    </div>

                    <p className="text-sm font-medium leading-relaxed">{q.statement}</p>

                    <div className="space-y-2 pt-2">
                      {q.options.map((opt) => {
                        const isSelected = simAnswers[q.id] === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setSimAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                            className={`w-full text-left p-3 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                              isSelected
                                ? "bg-amber-600/20 border-amber-500 text-amber-300 font-bold"
                                : isDarkMode
                                ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
                                : "bg-white border-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-md bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                              {opt.id.toUpperCase()}
                            </span>
                            <span className="leading-snug">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : simFinishedResult ? (
            /* Simulation Report */
            <div className="text-center py-6 space-y-6 max-w-lg mx-auto">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
              <div>
                <h2 className="text-2xl font-black">Resultado do Simulado</h2>
                <p className="text-xs text-slate-400 mt-1">{simFinishedResult.title}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {simFinishedResult.scorePercentage}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Aproveitamento</div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {simFinishedResult.correctCount} / {simFinishedResult.totalQuestions}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Acertos</div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"
                  }`}
                >
                  <div className="text-2xl font-black text-blue-400 font-mono">
                    {Math.round(simFinishedResult.timeSpentSeconds / 60)} min
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Tempo Gasto</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setSimFinishedResult(null)}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-sm active:scale-95"
                >
                  Fazer Novo Simulado
                </button>
                <button
                  onClick={() => handleOpenChatbot(null, null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Bot className="w-4 h-4" />
                  <span>Analisar com Tutor Gemini</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 4. Treino Mode & Caderno de Erros Question Stream */}
      {(activeMode === "treino" || activeMode === "caderno_erros") && (
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500"
              }`}
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <div className="text-base font-bold">Nenhuma questão encontrada para este filtro.</div>
              <p className="text-xs mt-1 max-w-md mx-auto">
                {activeMode === "caderno_erros"
                  ? "Parabéns! Seu Caderno de Erros está zerado para este assunto."
                  : `Você pode gerar 1 nova questão inédita da banca FUNECE sobre ${selectedSubtopic !== "all" ? selectedSubtopic : selectedTopic !== "all" ? selectedTopic : "este tema"} agora mesmo.`}
              </p>

              {activeMode !== "caderno_erros" && (
                <button
                  disabled={isGeneratingAi}
                  onClick={() => handleGenerateAiForTopic(selectedTopic !== "all" ? selectedTopic : undefined, selectedSubtopic !== "all" ? selectedSubtopic : undefined)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {isGeneratingAi ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isGeneratingAi
                      ? "Gerando questão inédita..."
                      : `Gerar 1 Questão Inédita deste ${selectedSubtopic !== "all" ? "Microassunto" : "Assunto"}`}
                  </span>
                </button>
              )}
            </div>
          ) : (
            filteredQuestions.map((q, qIndex) => {
              const selectedOption = userSelectedOptions[q.id];
              const hasAnswered = !!selectedOption;
              const isCorrectAnswer = selectedOption === q.correctOptionId;

              // Check if statement contains classic FUNECE trap words
              const statementUpper = q.statement.toUpperCase();
              const hasTrapWord =
                statementUpper.includes("EXCETO") ||
                statementUpper.includes("INCORRETA") ||
                statementUpper.includes("NÃO") ||
                statementUpper.includes("FALSA");

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition-all ${
                    q.id === newlyGeneratedQuestionId
                      ? "ring-2 ring-amber-500 border-amber-500/60 shadow-lg shadow-amber-500/10"
                      : isDarkMode
                      ? "bg-slate-900 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-slate-900 shadow-sm"
                  } ${isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}
                >
                  {/* Question Header with Topic & Microassunto Tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        {q.discipline}
                      </span>
                      {q.topic && (
                        <button
                          onClick={() => {
                            setSelectedTopic(q.topic);
                            setSelectedSubtopic("all");
                          }}
                          className="text-xs text-slate-500 dark:text-slate-300 font-semibold hover:underline"
                          title="Filtrar por este assunto"
                        >
                          {q.topic}
                        </button>
                      )}
                      {q.subtopic && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                          Micro: {q.subtopic}
                        </span>
                      )}
                      {q.id === newlyGeneratedQuestionId && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm flex items-center gap-1 animate-pulse">
                          <Sparkles className="w-3 h-3" />
                          <span>Inédita Recém-Gerada</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasTrapWord && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-500 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Pegadinha FUNECE</span>
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-semibold">{q.difficulty}</span>
                    </div>
                  </div>

                  {/* Statement */}
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    <strong className="text-amber-500 mr-1.5">{qIndex + 1}.</strong>
                    {q.statement}
                  </p>

                  {/* Options (A, B, C, D) */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isOptionSelected = selectedOption === opt.id;
                      const isOptionCorrect = opt.id === q.correctOptionId;

                      let btnStyle = isDarkMode
                        ? "bg-slate-800/80 border-slate-750 hover:bg-slate-800 text-slate-200"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";

                      if (hasAnswered) {
                        if (isOptionCorrect) {
                          btnStyle = "bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold shadow-sm";
                        } else if (isOptionSelected && !isOptionCorrect) {
                          btnStyle = "bg-rose-950/60 border-rose-500 text-rose-300";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          disabled={hasAnswered}
                          onClick={() => handleAnswerTreino(q.id, opt.id)}
                          className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${btnStyle}`}
                        >
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                              hasAnswered && isOptionCorrect
                                ? "bg-emerald-500 text-white"
                                : hasAnswered && isOptionSelected
                                ? "bg-rose-500 text-white"
                                : isDarkMode
                                ? "bg-slate-700 text-slate-300"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {opt.id.toUpperCase()}
                          </span>
                          <span className="leading-snug pt-0.5">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Commentary & Theoretical Foundation */}
                  {hasAnswered && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-2 animate-fadeIn ${
                        isCorrectAnswer
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                          : "bg-amber-950/40 border-amber-500/40 text-amber-200"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <div className="flex items-center gap-1.5">
                          {isCorrectAnswer ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Resposta Correta! (+10 XP)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-400" />
                              <span>Gabarito Oficial: Letra {q.correctOptionId.toUpperCase()}</span>
                            </>
                          )}
                        </div>
                        {q.legalOrAuthorReference && (
                          <span className="text-[10px] text-slate-300 font-mono">
                            Fundamentação: {q.legalOrAuthorReference}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 leading-relaxed">
                        <FormattedMentorText content={q.explanation} />
                      </div>

                      {q.funeceInsight && (
                        <div className="pt-2 text-[11px] text-amber-300 font-semibold border-t border-amber-500/20">
                          <FormattedMentorText content={`### 🎯 Radar de Pegadinha FUNECE\n${q.funeceInsight}`} />
                        </div>
                      )}

                      {q.eliteAnalysis && (
                        <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/40 space-y-2 text-xs">
                          <div className="font-bold text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                            <span>Análise Técnica de Rigor Extremo (Banca Examinadora)</span>
                          </div>
                          {q.eliteAnalysis.mainTrap && (
                            <div className="pt-1">
                              <span className="font-bold text-amber-300">🍌 Casca de Banana Principal: </span>
                              <span className="text-slate-200">{q.eliteAnalysis.mainTrap}</span>
                            </div>
                          )}
                          {q.eliteAnalysis.technicalException && (
                            <div>
                              <span className="font-bold text-rose-300">⚖️ Exceção Técnica / Detalhe Obscuro Testado: </span>
                              <span className="text-slate-200">{q.eliteAnalysis.technicalException}</span>
                            </div>
                          )}
                          {q.eliteAnalysis.distractorsTrapAnalysis && (
                            <div>
                              <span className="font-bold text-sky-300">🎯 Por que as alternativas incorretas parecem corretas: </span>
                              <span className="text-slate-200">{q.eliteAnalysis.distractorsTrapAnalysis}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chatbot Gemini Integration Button */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/50 dark:border-slate-800">
                    <button
                      onClick={() => handleOpenChatbot(q, selectedOption)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Tirar Dúvida com Tutor Gemini</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {hasAnswered
                        ? "Discuta o raciocínio, distratores e fundamentação com a IA"
                        : "Peça pistas socráticas ou análise do tema antes de responder"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. Simulation History View */}
      {activeMode === "historico" && (
        <div
          className={`rounded-2xl border p-6 space-y-4 ${
            isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <h2 className="text-base font-bold flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            Histórico de Simulados Realizados
          </h2>

          {simulados.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Você ainda não finalizou nenhum simulado completo. Inicie um simulado oficial para gerar seu histórico!
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {simulados.map((s) => (
                <div key={s.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{s.title}</div>
                    <div className="text-xs text-slate-400">
                      {s.date} • {Math.round(s.timeSpentSeconds / 60)} minutos de prova
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-amber-400 font-mono">
                      {s.scorePercentage}%
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {s.correctCount}/{s.totalQuestions} acertos
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. MODAL EXPLORADOR DE ASSUNTOS E MICROASSUNTOS */}
      {isExplorerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`max-w-2xl w-full max-h-[85vh] rounded-2xl border flex flex-col shadow-2xl overflow-hidden ${
              isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-base">Explorador de Assuntos & Microassuntos</h3>
              </div>
              <button
                onClick={() => setIsExplorerModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Search Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por assunto ou microassunto (ex: 'LDB', 'Genética', 'Crase', 'SPAECE')..."
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  autoFocus
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white focus:border-amber-500"
                      : "bg-white border-slate-300 text-slate-900 focus:border-amber-500"
                  }`}
                />
              </div>
            </div>

            {/* Modal Content - Syllabus Tree */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {explorerFilteredTree.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Nenhum assunto ou microassunto encontrado para "{explorerSearch}".
                </div>
              ) : (
                explorerFilteredTree.map((topic) => (
                  <div key={topic.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                          {topic.moduleName}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {topic.title}
                        </h4>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedDiscipline(topic.moduleId);
                          setSelectedTopic(topic.title);
                          setSelectedSubtopic("all");
                          setIsExplorerModalOpen(false);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-colors shrink-0"
                      >
                        Filtrar Assunto
                      </button>
                    </div>

                    {/* Microassuntos (Subtopics) List */}
                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="pl-3 space-y-1.5 border-l-2 border-slate-200 dark:border-slate-800">
                        {topic.subtopics.map((sub) => (
                          <div
                            key={sub.id}
                            className={`p-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                              isDarkMode
                                ? "bg-slate-800/40 border-slate-750 hover:border-slate-700"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {sub.title}
                              </div>
                              {sub.description && (
                                <div className="text-[10px] text-slate-400 line-clamp-1">
                                  {sub.description}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                setSelectedDiscipline(topic.moduleId);
                                setSelectedTopic(topic.title);
                                setSelectedSubtopic(sub.title);
                                setIsExplorerModalOpen(false);
                              }}
                              className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 shrink-0"
                            >
                              Filtrar Microassunto
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-850">
              <button
                onClick={() => setIsExplorerModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Elite AI Question Generator Modal (Assunto & Subassunto) */}
      {isEliteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all ${
              isDarkMode ? "bg-slate-900 border-slate-750 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-250 dark:border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>IA de Elite • Rigor Extremo FUNECE</span>
                </div>
                <h3 className="text-base sm:text-lg font-black">
                  Elaborador Especializado de Questões
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Informe o <strong className="text-slate-700 dark:text-slate-300">Assunto</strong> e o <strong className="text-slate-700 dark:text-slate-300">Subassunto</strong> para a IA gerar uma questão inédita e de altíssimo nível.
                </p>
              </div>

              <button
                onClick={() => setIsEliteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* 4 Strict Rules Banner */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5 text-xs">
                <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <span>⚖️ Regras Rígidas e Inegociáveis da Banca</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">1.</span>
                    <span><strong>Sem superficialidade:</strong> zero clichês ou conceitos genéricos de apostilas comuns.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">2.</span>
                    <span><strong>Exploração profunda:</strong> foco em exceções, cantos obscuros e jurisprudências.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">3.</span>
                    <span><strong>Variabilidade radical:</strong> ângulo, cenário e foco completamente novos a cada chamada.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">4.</span>
                    <span><strong>Análise prévia:</strong> casca de banana principal mapeada e distratores sofisticados.</span>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    Assunto / Tema Central <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={eliteAssunto}
                    onChange={(e) => setEliteAssunto(e.target.value)}
                    placeholder="Ex: Legislação Educacional (LDB 9.394/96), Didática Geral, Citologia..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium transition-all ${
                      isDarkMode
                        ? "bg-slate-800/80 border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-200">
                    Subassunto / Microtópico Específico <span className="text-amber-500">(Foco Principal)</span>
                  </label>
                  <input
                    type="text"
                    value={eliteSubassunto}
                    onChange={(e) => setEliteSubassunto(e.target.value)}
                    placeholder="Ex: Gestão Democrática e Colegiados (Arts. 12-14), Tendência Crítico-Social dos Conteúdos..."
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border outline-none font-medium transition-all ${
                      isDarkMode
                        ? "bg-slate-800/80 border-slate-700 text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                        : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    }`}
                  />
                </div>

                {/* Fast-pick suggested topics from user's syllabus */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                    Sugestões Rápidas do Edital FUNECE:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { topic: "Didática e Prática Docente", sub: "Tendências Pedagógicas e Saviani" },
                      { topic: "Legislação Educacional (LDB)", sub: "Arts. 12, 13 e 14 (Gestão e Incumbências)" },
                      { topic: "Avaliação da Aprendizagem", sub: "Formativa vs Somativa e Cipriano Luckesi" },
                      { topic: "DCRC - Ensino Médio Ceará", sub: "Itinerários Formativos e Interdisciplinaridade" },
                      { topic: "Administração Pública", sub: "Princípios do Art. 37 (LIMPE) e Atos Administrativos" },
                      { topic: `Conhecimentos Específicos: ${currentSpecialty.name}`, sub: "Tópico Avançado da Especialidade" },
                    ].map((sugg, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setEliteAssunto(sugg.topic);
                          setEliteSubassunto(sugg.sub);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-colors ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white"
                            : "bg-slate-100 border-slate-200 hover:border-amber-500 text-slate-700 hover:text-slate-900"
                        }`}
                      >
                        {sugg.sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <button
                type="button"
                onClick={() => setIsEliteModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isGeneratingAi || (!eliteAssunto.trim() && !eliteSubassunto.trim())}
                onClick={() => handleGenerateAiForTopic(eliteAssunto, eliteSubassunto)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                {isGeneratingAi ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Elaborando questão de alto nível...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Elaborar Questão Inédita de Rigor Extremo</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Gemini Multi-turn Chatbot Modal */}
      <SimuladoChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        question={chatbotQuestion}
        userSelectedOption={chatbotUserOption}
        currentSpecialty={currentSpecialty}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
