import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  RefreshCw,
  User,
  Sparkles,
  Trash2,
  BookOpen,
  HelpCircle,
  Award,
  Zap,
  Brain,
  GraduationCap,
  Target,
  FileText,
} from "lucide-react";
import {
  UserProfile,
  StudyTopic,
  UserAnswerRecord,
} from "../types";
import { SPECIALTIES } from "../data/specialties";
import { askMentorChat, GeminiModelTier } from "../services/geminiService";
import { FormattedMentorText } from "./FormattedMentorText";

interface MentorViewProps {
  userProfile: UserProfile;
  topics: StudyTopic[];
  answers: UserAnswerRecord[];
  onRemanejarAtrasados: () => void;
  isDarkMode?: boolean;
}

export const MentorView: React.FC<MentorViewProps> = ({
  userProfile,
  topics,
  answers,
  isDarkMode = false,
}) => {
  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];

  const delayedTopics = topics.filter((t) => t.isDelayed && !t.isCompleted);
  const totalAnswers = answers.length;
  const correctAnswers = answers.filter((a) => a.isCorrect).length;
  const accuracyRate = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 75;

  // Model & Role State for Gemini Multi-turn Chat
  const [modelTier, setModelTier] = useState<GeminiModelTier>("general");
  const [mentorRole, setMentorRole] = useState<"general" | "discursiva" | "pegadinhas" | "banca_examinadora">("general");

  // Chat State
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: "user" | "mentor"; text: string; time: string }
  >([
    {
      id: "msg-welcome",
      sender: "mentor",
      text: `Olá, Professor(a) de ${currentSpecialty.name}! Eu sou o Prof. Crateús, seu Mentor especialista na banca FUNECE (CEV/UECE) para a SEDUC-CE.

Estou pronto para esclarecer dúvidas de conteúdo teórico, esquematizar autores pedagógicos (Libâneo, Saviani, Luckesi, Piaget, Vygotsky), leis federais e estaduais (LDB 9.394/96, CF/88, Lei 9.826/74, DCRC), indicadores educacionais (SPAECE, IDEB, SAEB) ou orientar a montagem do seu Plano de Aula para a Prova Prática Didática.

Como posso ajudar sua preparação hoje?`,
      time: "Agora",
    },
  ]);

  const [inputMessage, setInputMessage] = useState<string>("");
  const [isChatSending, setIsChatSending] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isChatSending]);

  const quickPrompts = [
    "📝 Iniciar modo Banca Examinadora: aplique a primeira questão inédita!",
    "📅 O que estudar no Dia 2 (Terça)?",
    "📅 O que estudar no Dia 4 (Quinta)?",
    `Como a FUNECE costuma cobrar ${currentSpecialty.name}?`,
    "Mnemônico para o Art. 13 da LDB",
    "Diferenças fundamentais entre Libâneo, Saviani e Luckesi",
    "Como montar o Plano de Aula para a Prova Didática FUNECE?",
    "Quais as principais pegadinhas da Lei Estadual nº 9.826/74 (Estatuto CE)?",
    "Quais indicadores educacionais do INEP e SPAECE mais caem na CEV-UECE?",
    "Como estruturar uma resposta discursiva de Estudo de Caso?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isChatSending) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      text: message.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsChatSending(true);

    try {
      const history = chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const now = new Date();
      const weekdayNames = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ];
      const currentDayOfWeekName = weekdayNames[now.getDay()];
      const currentDateFormatted = now.toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const dayLabels = [
        "",
        "Segunda-feira (Dia 1)",
        "Terça-feira (Dia 2)",
        "Quarta-feira (Dia 3)",
        "Quinta-feira (Dia 4)",
        "Sexta-feira (Dia 5)",
        "Sábado (Dia 6)",
      ];

      const scheduleByDay = [1, 2, 3, 4, 5, 6].map((dayNum) => {
        const dayTopics = topics.filter((t) => t.scheduledDayOfWeek === dayNum);
        return {
          dayNumber: dayNum,
          dayLabel: dayLabels[dayNum],
          topics: dayTopics.map((t) => ({
            title: t.title,
            moduleName: t.moduleName,
            description: t.description,
            keyFormulasOrLaws: t.keyFormulasOrLaws,
            subtopics: t.subtopics?.map((s) => s.title) || [],
          })),
        };
      });

      const responseText = await askMentorChat(
        message.trim(),
        userProfile.specialty,
        {
          hoursPerDay: userProfile.hoursPerDay,
          delayedTopics: delayedTopics.map((t) => t.title),
          accuracyRate: `${accuracyRate}%`,
          scheduleByDay,
          specialtyName: currentSpecialty.name,
          currentDateFormatted,
          currentDayOfWeekName,
          currentDayNumber: now.getDay() === 0 ? 7 : now.getDay(),
        },
        history,
        modelTier,
        mentorRole
      );

      const mentorMsg = {
        id: `mentor-${Date.now()}`,
        sender: "mentor" as const,
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatMessages((prev) => [...prev, mentorMsg]);
    } catch (e) {
      console.error("Erro no chat com mentor:", e);
      const errorMsg = {
        id: `mentor-err-${Date.now()}`,
        sender: "mentor" as const,
        text: "Desculpe, tive uma instabilidade momentânea na conexão. Vamos focar nos tópicos de maior peso da FUNECE enquanto restabeleço a análise completa!",
        time: "Agora",
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatSending(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        sender: "mentor",
        text: `Conversa reiniciada. Qual dúvida ou tópico do edital de ${currentSpecialty.name} ou de Conhecimentos Gerais você deseja analisar com a lógica da banca FUNECE?`,
        time: "Agora",
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-130px)] min-h-[580px] max-w-6xl mx-auto flex flex-col pb-4">
      {/* Direct Interactive Chat Window (Front & Center) */}
      <div
        className={`flex-1 rounded-2xl border flex flex-col overflow-hidden shadow-sm transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Compact Chat Header */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-900/20 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base">
                  Prof. Crateús • Mentor Especialista FUNECE / SEDUC-CE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {currentSpecialty.shortName}
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online • Pronto para tirar dúvidas do edital, didática, legislação e questões</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
              title="Limpar mensagens do chat"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Limpar Chat</span>
            </button>
          </div>
        </div>

        {/* Controls Toolbar: Mentor Role & Gemini Model Tier */}
        <div
          className={`px-4 sm:px-6 py-2.5 border-b flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 ${
            isDarkMode ? "bg-slate-850/60 border-slate-800" : "bg-slate-100/70 border-slate-200"
          }`}
        >
          {/* Role selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Especialidade:</span>
            <button
              onClick={() => setMentorRole("general")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                mentorRole === "general"
                  ? "bg-purple-600 text-white shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Mentor Geral</span>
            </button>
            <button
              onClick={() => setMentorRole("discursiva")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                mentorRole === "discursiva"
                  ? "bg-purple-600 text-white shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-3 h-3" />
              <span>Estudo de Caso & Discursiva</span>
            </button>
            <button
              onClick={() => setMentorRole("pegadinhas")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                mentorRole === "pegadinhas"
                  ? "bg-rose-600 text-white shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Target className="w-3 h-3" />
              <span>Pegadinhas CEV/UECE</span>
            </button>
            <button
              onClick={() => setMentorRole("banca_examinadora")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                mentorRole === "banca_examinadora"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
              title="Atuar estritamente como elaborador e aplicador de questões inéditas de concurso"
            >
              <Sparkles className="w-3 h-3" />
              <span>Banca Examinadora (Criar & Aplicar Questões)</span>
            </button>
          </div>

          {/* Model selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Modelo Gemini:</span>
            <div className="flex items-center p-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              <button
                onClick={() => setModelTier("fast")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  modelTier === "fast"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="gemini-3.1-flash-lite: Rápido e direto"
              >
                <Zap className="w-3 h-3" />
                <span>Rápido</span>
              </button>
              <button
                onClick={() => setModelTier("general")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  modelTier === "general"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="gemini-3.5-flash: Respostas gerais e estruturadas"
              >
                <Sparkles className="w-3 h-3" />
                <span>Geral</span>
              </button>
              <button
                onClick={() => setModelTier("complex")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  modelTier === "complex"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="gemini-3.1-pro-preview: Raciocínio profundo e redações complexas"
              >
                <Brain className="w-3 h-3" />
                <span>Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {chatMessages.map((msg) => {
            const isMentor = msg.sender === "mentor";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[92%] sm:max-w-[85%] ${
                  isMentor ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                    isMentor ? "bg-purple-600 text-white" : "bg-emerald-600 text-white"
                  }`}
                >
                  {isMentor ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMentor
                      ? isDarkMode
                        ? "bg-slate-800 text-slate-200 border border-slate-750"
                        : "bg-slate-100 text-slate-900 border border-slate-200"
                      : "bg-emerald-600 text-white whitespace-pre-wrap"
                  }`}
                >
                  {isMentor ? (
                    <FormattedMentorText content={msg.text} isMentor={true} />
                  ) : (
                    msg.text
                  )}
                  <div
                    className={`text-[10px] mt-2 font-mono text-right ${
                      isMentor ? "text-slate-400 dark:text-slate-400" : "text-emerald-100"
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>
              </div>
            );
          })}

          {isChatSending && (
            <div className="flex gap-3 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm flex items-center gap-2.5 ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-300 border border-slate-750"
                    : "bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <RefreshCw className="w-4 h-4 animate-spin text-purple-500" />
                <span>Prof. Crateús está consultando as diretrizes e jurisprudência da FUNECE...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div
          className={`px-4 py-2.5 border-t flex gap-2 overflow-x-auto scrollbar-none shrink-0 ${
            isDarkMode ? "bg-slate-850/80 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}
        >
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shrink-0 active:scale-95 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white hover:border-purple-500"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-900 shadow-2xs"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div
          className={`p-3.5 sm:p-4 border-t flex items-center gap-2 shrink-0 ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
          }`}
        >
          <input
            type="text"
            placeholder={`Pergunte ao Prof. Crateús sobre qualquer tópico de ${currentSpecialty.name}, Didática, LDB, DCRC ou FUNECE...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className={`flex-1 px-4 py-3 text-xs sm:text-sm rounded-xl border outline-none transition-all ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            }`}
          />
          <button
            disabled={!inputMessage.trim() || isChatSending}
            onClick={() => handleSendMessage()}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-950/20 shrink-0 active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
