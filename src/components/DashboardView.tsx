import React, { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  HelpCircle,
  Bot,
  Zap,
  Flame,
  ArrowRight,
  Sparkles,
  Trophy,
  RefreshCw,
  FileText,
  ChevronRight,
  Target,
  BarChart3,
  Lightbulb,
  Printer,
  DollarSign,
  Users,
  Building2,
} from "lucide-react";
import {
  UserProfile,
  StudyTopic,
  Question,
  DailyMission,
  SimuladoSession,
  SpecialtyId,
} from "../types";
import { SPECIALTIES } from "../data/specialties";
import confetti from "canvas-confetti";

interface DashboardViewProps {
  userProfile: UserProfile;
  topics: StudyTopic[];
  questions: Question[];
  missions: DailyMission[];
  simulados: SimuladoSession[];
  onToggleTopicComplete: (topicId: string) => void;
  onNavigateTab: (tab: string, extra?: any) => void;
  onAnswerQuestion: (questionId: string, optionId: string) => boolean;
  onClaimMissionReward: (missionId: string) => void;
  onRemanejarAtrasados: () => void;
  onOpenPrintScheduleModal?: () => void;
  daysUntilExam: number;
  isDarkMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  topics,
  questions,
  missions,
  simulados,
  onToggleTopicComplete,
  onNavigateTab,
  onAnswerQuestion,
  onClaimMissionReward,
  onRemanejarAtrasados,
  onOpenPrintScheduleModal,
  daysUntilExam,
  isDarkMode = false,
}) => {
  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];

  // Current day of week: 0=Sun, 1=Mon, ..., 6=Sat
  const currentDayOfWeek = new Date().getDay();
  // Target day for today (if Sunday, show Saturday or Day 1)
  const todayTargetDay = currentDayOfWeek === 0 ? 1 : currentDayOfWeek;
  const todayTopics = topics.filter((t) => t.scheduledDayOfWeek === todayTargetDay);
  const delayedTopics = topics.filter((t) => t.isDelayed && !t.isCompleted);
  const completedTopics = topics.filter((t) => t.isCompleted);

  // Edital progress stats
  const totalTopics = topics.length;
  const completedPercentage = totalTopics > 0 ? Math.round((completedTopics.length / totalTopics) * 100) : 0;

  // Daily featured question state
  const [selectedQuestionOption, setSelectedQuestionOption] = useState<string | null>(null);
  const [hasAnsweredDailyQ, setHasAnsweredDailyQ] = useState<boolean>(false);
  const [isCorrectDailyQ, setIsCorrectDailyQ] = useState<boolean | null>(null);

  const featuredQuestion = questions[0] || null;

  const handleSelectDailyOption = (optId: string) => {
    if (hasAnsweredDailyQ || !featuredQuestion) return;
    setSelectedQuestionOption(optId);
    const correct = onAnswerQuestion(featuredQuestion.id, optId);
    setIsCorrectDailyQ(correct);
    setHasAnsweredDailyQ(true);

    if (correct) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Hero Institutional Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl border p-6 sm:p-7 transition-all ${
          isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-850 to-emerald-950 border-slate-800 text-white shadow-xl"
            : "bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 border-emerald-700 text-white shadow-md"
        }`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Professor(a) de {currentSpecialty.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Meta diária: <strong className="text-white">{userProfile.hoursPerDay}h</strong> de estudo • SEDUC Ceará / FUNECE
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={() => onNavigateTab("cronograma")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-black shadow-sm transition-all active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cronograma</span>
              </button>
              {onOpenPrintScheduleModal && (
                <button
                  onClick={onOpenPrintScheduleModal}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700/60 hover:bg-emerald-700/80 border border-emerald-400/30 text-white text-xs font-bold transition-all active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-2xl font-black text-amber-400 font-mono">
                {daysUntilExam > 0 ? daysUntilExam : 0}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Dias p/ Prova</div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {completedPercentage}%
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Concluído</div>
            </div>

            <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center min-w-[90px]">
              <div className="text-2xl font-black text-orange-400 font-mono flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-400" />
                <span>{userProfile.streak}d</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Ofensiva</div>
            </div>
          </div>
        </div>
      </div>

      {/* Official Notice Strip: Inscrições, Taxa, Banca e Vagas */}
      <div
        className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isDarkMode
            ? "bg-slate-900/90 border-amber-500/30 text-slate-200"
            : "bg-amber-500/10 border-amber-300/80 text-slate-800"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-xs leading-snug">
            <div className="font-bold flex flex-wrap items-center gap-1.5">
              <span className="text-amber-700 dark:text-amber-300">📅 Inscrições: 16 de setembro a 15 de outubro de 2026</span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className="text-emerald-700 dark:text-emerald-300">💰 Taxa: R$ 150,00</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span>🏫 Banca: <strong>FUNECE / CEV-UECE</strong></span>
              <span>•</span>
              <span>🎓 <strong>2.000 Vagas imediatas + 1.000 CR</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab("datas")}
          className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <span>Ver Edital & Prazos</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Quick Action Hub (Mais Intuitivo: Acesso Direto com 1 Clique) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
            Ações Rápidas de Estudo
          </h2>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {dayNames[currentDayOfWeek]}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Cronograma */}
          <button
            onClick={() => onNavigateTab("cronograma")}
            className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850"
                : "bg-white border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 shadow-sm"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Metas de Hoje
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {todayTopics.length} tópico(s) programado(s)
              </p>
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                <span>Abrir Cronograma</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Action 2: Simulados */}
          <button
            onClick={() => onNavigateTab("simulados")}
            className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850"
                : "bg-white border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 shadow-sm"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Simulados FUNECE
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Questões comentadas A-B-C-D
              </p>
              <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-2">
                <span>Praticar Questões</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Action 3: Mentor IA */}
          <button
            onClick={() => onNavigateTab("mentor")}
            className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 hover:border-purple-500/50 hover:bg-slate-850"
                : "bg-white border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 shadow-sm"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Mentor FUNECE IA
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Prof. Crateús • Dicas & Leis
              </p>
              <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-2">
                <span>Tirar Dúvida</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Action 4: Resumos PDF */}
          <button
            onClick={() => onNavigateTab("materiais")}
            className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.01] flex items-start gap-3.5 group ${
              isDarkMode
                ? "bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-850"
                : "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 shadow-sm"
            }`}
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Resumos em PDF
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Otimizados para Impressão
              </p>
              <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-2">
                <span>Acessar Resumos</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Delayed Content Alert (if any) */}
      {delayedTopics.length > 0 && (
        <div
          className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
            isDarkMode
              ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
              : "bg-amber-50 border-amber-300 text-amber-900"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold">
                Você possui {delayedTopics.length} tópico(s) atrasado(s) no cronograma
              </div>
              <div className={`text-xs mt-0.5 ${isDarkMode ? "text-amber-300/80" : "text-amber-800"}`}>
                O Prof. Crateús pode redistribuir esses temas automaticamente para dias com menor carga horária.
              </div>
            </div>
          </div>
          <button
            onClick={onRemanejarAtrasados}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Remanejar com Mentor IA</span>
          </button>
        </div>
      )}

      {/* 4. Main Two-Column Section: Today's Tasks & Question of the Day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Study List */}
        <div
          className={`lg:col-span-2 rounded-2xl border p-5 sm:p-6 space-y-4 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Metas do Dia • {dayNames[currentDayOfWeek]}
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab("cronograma")}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Ver Edital Completo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayTopics.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Tudo concluído por hoje!
              </div>
              <p className="text-xs text-slate-500">
                Aproveite para fazer um simulado rápido ou revisar o Caderno de Erros.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    topic.isCompleted
                      ? isDarkMode
                        ? "bg-slate-950/40 border-slate-800 opacity-60"
                        : "bg-slate-50 border-slate-200 opacity-70"
                      : isDarkMode
                      ? "bg-slate-800/60 border-slate-750 hover:border-slate-700"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleTopicComplete(topic.id)}
                      className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        topic.isCompleted
                          ? "bg-emerald-500 border-emerald-400 text-white"
                          : isDarkMode
                          ? "border-slate-600 hover:border-emerald-400 text-transparent"
                          : "border-slate-400 hover:border-emerald-500 text-transparent"
                      }`}
                      title={topic.isCompleted ? "Desmarcar conclusão" : "Marcar como estudado"}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            topic.isCompleted
                              ? "line-through text-slate-500"
                              : isDarkMode
                              ? "text-white"
                              : "text-slate-900"
                          }`}
                        >
                          {topic.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {topic.moduleName}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {topic.description}
                      </p>
                      {topic.keyFormulasOrLaws && (
                        <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 pt-0.5">
                          📌 Base Legal/Conceito: {topic.keyFormulasOrLaws}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {topic.estimatedMinutes} min
                    </span>
                    <button
                      onClick={() => onNavigateTab("simulados", { topic: topic.title })}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      title="Praticar questões deste tópico"
                    >
                      Treinar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Question of the Day (FUNECE Pattern) */}
        <div
          className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Questão do Dia FUNECE
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
              +10 XP
            </span>
          </div>

          {featuredQuestion ? (
            <div className="space-y-3.5">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {featuredQuestion.discipline} • {featuredQuestion.topic}
                </div>
                <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed font-medium ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                  {featuredQuestion.statement}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2">
                {featuredQuestion.options.map((opt) => {
                  const isSelected = selectedQuestionOption === opt.id;
                  const isCorrect = opt.id === featuredQuestion.correctOptionId;

                  let btnStyle = isDarkMode
                    ? "bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-200"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";

                  if (hasAnsweredDailyQ) {
                    if (isCorrect) {
                      btnStyle = "bg-emerald-900/40 border-emerald-500 text-emerald-300 font-bold";
                    } else if (isSelected && !isCorrect) {
                      btnStyle = "bg-rose-900/40 border-rose-500 text-rose-300";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      disabled={hasAnsweredDailyQ}
                      onClick={() => handleSelectDailyOption(opt.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${btnStyle}`}
                    >
                      <span className="font-bold w-5 h-5 rounded-md bg-slate-700/50 flex items-center justify-center text-[11px] shrink-0">
                        {opt.id.toUpperCase()}
                      </span>
                      <span className="leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Commentary upon answer */}
              {hasAnsweredDailyQ && (
                <div
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
                    isCorrectDailyQ
                      ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                      : "bg-amber-950/40 border-amber-500/50 text-amber-200"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {isCorrectDailyQ ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Parabéns, você acertou no padrão FUNECE!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span>Atenção à pegadinha da banca!</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {featuredQuestion.commentary}
                  </p>
                  {featuredQuestion.funeceTip && (
                    <div className="text-[10px] text-amber-300 pt-1 font-semibold">
                      🎯 Dica FUNECE: {featuredQuestion.funeceTip}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-4">
              Nenhuma questão pendente hoje.
            </div>
          )}
        </div>
      </div>

      {/* 5. Daily Missions & Achievements Bar */}
      <div
        className={`rounded-2xl border p-5 sm:p-6 space-y-4 ${
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
              Missões Diárias de Alto Rendimento
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab("gamificacao")}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Ranking & Conquistas</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {missions.map((m) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border flex flex-col justify-between gap-3 ${
                m.isCompleted
                  ? isDarkMode
                    ? "bg-slate-950/40 border-slate-800 opacity-70"
                    : "bg-slate-50 border-slate-200 opacity-80"
                  : isDarkMode
                  ? "bg-slate-800/60 border-slate-750"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    {m.title}
                  </span>
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                    +{m.xpReward} XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {m.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-semibold">
                  <span>Progresso</span>
                  <span>
                    {m.currentCount} / {m.targetCount}
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (m.currentCount / m.targetCount) * 100)}%` }}
                  />
                </div>
                {m.currentCount >= m.targetCount && !m.isCompleted && (
                  <button
                    onClick={() => onClaimMissionReward(m.id)}
                    className="mt-2.5 w-full py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors shadow-sm"
                  >
                    Resgatar +{m.xpReward} XP!
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
