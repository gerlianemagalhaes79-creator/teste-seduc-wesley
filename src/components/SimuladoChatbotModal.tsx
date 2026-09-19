import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Sparkles,
  Zap,
  Brain,
  Trash2,
  AlertTriangle,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  GraduationCap,
  Target,
  Bot,
} from "lucide-react";
import { Question, SpecialtyConfig } from "../types";
import { FormattedMentorText } from "./FormattedMentorText";
import {
  askSimuladoChat,
  GeminiModelTier,
  QuestionContextPayload,
} from "../services/geminiService";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  time: string;
}

interface SimuladoChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question | null;
  userSelectedOption?: string | null;
  currentSpecialty: SpecialtyConfig;
  isDarkMode: boolean;
}

export const SimuladoChatbotModal: React.FC<SimuladoChatbotModalProps> = ({
  isOpen,
  onClose,
  question,
  userSelectedOption,
  currentSpecialty,
  isDarkMode,
}) => {
  const [modelTier, setModelTier] = useState<GeminiModelTier>("fast");
  const [tutorRole, setTutorRole] = useState<"trap_breaker" | "socratic" | "theoretical">("trap_breaker");
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting tailored to whether a specific question is in focus
  const getInitialMessage = (): ChatMessage => {
    if (question) {
      return {
        id: "msg-welcome-q",
        sender: "assistant",
        text: `Olá! Sou seu **Tutor Gemini de Simulados FUNECE**.\n\nEstou analisando a questão sobre **"${question.topic || question.discipline}"**${
          question.subtopic ? ` (Microassunto: *${question.subtopic}*)` : ""
        }.\n\nVocê pode me perguntar sobre a alternativa correta (**Letra ${question.correctOptionId}**), desconstruir as pegadinhas dos distratores ou pedir a fundamentação teórica/legal. Em que posso te ajudar?`,
        time: "Agora",
      };
    }
    return {
      id: "msg-welcome-g",
      sender: "assistant",
      text: `Olá! Sou o **Tutor Gemini de Questões e Simulados da FUNECE** para a disciplina de **${currentSpecialty.name}**.\n\nPosso te ajudar a analisar técnicas de prova, desmascarar os distratores clássicos da CEV/UECE, esclarecer critérios de desempate e estruturar estratégias de resolução rápida. Como posso orientar seu treino hoje?`,
      time: "Agora",
    };
  };

  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()]);

  // When question changes, reset to a fresh contextual greeting
  useEffect(() => {
    if (isOpen) {
      setMessages([getInitialMessage()]);
    }
  }, [question?.id, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isSending, isOpen]);

  if (!isOpen) return null;

  // Quick suggestion chips
  const questionSuggestions = question
    ? [
        userSelectedOption && userSelectedOption !== question.correctOptionId
          ? `Por que a letra ${userSelectedOption} está errada?`
          : null,
        `Qual é a principal pegadinha da FUNECE nesta questão?`,
        `Explique por que a Letra ${question.correctOptionId} é o gabarito oficial.`,
        `Qual artigo de lei ou autor fundamenta essa resposta?`,
        `Dê um mnemônico para nunca mais errar esse conceito.`,
      ].filter(Boolean) as string[]
    : [
        "Como a banca FUNECE formula os distratores mais difíceis?",
        "Qual a melhor estratégia de tempo para 80 questões de 4 alternativas?",
        "Como eliminar alternativas com termos restritivos?",
        "Quais tópicos de Didática mais geram recursos na CEV/UECE?",
      ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsSending(true);

    try {
      const qContext: QuestionContextPayload | null = question
        ? {
            id: question.id,
            discipline: question.discipline,
            topic: question.topic,
            subtopic: question.subtopic,
            statement: question.statement,
            options: question.options,
            correctOptionId: question.correctOptionId,
            explanation: question.explanation,
            funeceInsight: question.funeceInsight,
            legalOrAuthorReference: question.legalOrAuthorReference,
            userSelectedOption: userSelectedOption || null,
            eliteAnalysis: question.eliteAnalysis,
          }
        : null;

      const chatHistory = messages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const reply = await askSimuladoChat(
        text,
        qContext,
        chatHistory,
        modelTier,
        tutorRole
      );

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "assistant",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Erro no chat do simulado:", err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: "assistant",
        text: "Desculpe, ocorreu uma instabilidade na comunicação com a IA. Vamos continuar focados na análise técnica da questão!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialMessage()]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-3xl h-[90vh] max-h-[780px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-750 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? "bg-slate-850 border-slate-750" : "bg-slate-50 border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight">
                  Tutor Gemini de Simulados
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  FUNECE / SEDUC-CE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                {question
                  ? `Discutindo Questão: ${question.topic || question.discipline}`
                  : `Tira-Dúvidas Geral: ${currentSpecialty.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              title="Limpar conversa"
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                isDarkMode
                  ? "border-slate-700 hover:bg-slate-800 text-slate-300"
                  : "border-slate-300 hover:bg-slate-100 text-slate-600"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                isDarkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Context Preview Banner (if open from question) */}
        {question && (
          <div
            className={`px-4 py-2.5 border-b text-xs flex items-center justify-between gap-3 shrink-0 ${
              isDarkMode ? "bg-slate-800/60 border-slate-750" : "bg-amber-50/70 border-amber-200/60"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
                Gabarito: Letra {question.correctOptionId}
              </span>
              <span className="text-slate-400">•</span>
              <span className="truncate text-slate-600 dark:text-slate-300">
                {question.statement}
              </span>
            </div>
            {userSelectedOption && (
              <span
                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                  userSelectedOption === question.correctOptionId
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                Marcou: {userSelectedOption}
              </span>
            )}
          </div>
        )}

        {/* Controls Toolbar: Role Selector & Model Tier */}
        <div
          className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs ${
            isDarkMode ? "bg-slate-850/40 border-slate-800" : "bg-slate-100/60 border-slate-200"
          }`}
        >
          {/* Role selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Papel da IA:</span>
            <button
              onClick={() => setTutorRole("trap_breaker")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                tutorRole === "trap_breaker"
                  ? "bg-rose-600 text-white shadow-sm"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Desconstrutor de Pegadinhas</span>
            </button>
            <button
              onClick={() => setTutorRole("socratic")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                tutorRole === "socratic"
                  ? "bg-amber-600 text-white shadow-sm"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Tutor Socrático</span>
            </button>
            <button
              onClick={() => setTutorRole("theoretical")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                tutorRole === "theoretical"
                  ? "bg-purple-600 text-white shadow-sm"
                  : isDarkMode
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-750"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Doutrinário & Legal</span>
            </button>
          </div>

          {/* Model tier selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-semibold text-slate-400 shrink-0">Modelo:</span>
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
                    ? "bg-amber-500 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="gemini-3.5-flash: Equilíbrio geral"
              >
                <Sparkles className="w-3 h-3" />
                <span>Geral</span>
              </button>
              <button
                onClick={() => setModelTier("complex")}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1 ${
                  modelTier === "complex"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="gemini-3.1-pro-preview: Análise profunda e complexa"
              >
                <Brain className="w-3 h-3" />
                <span>Pro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Message Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm space-y-1.5 ${
                    isUser
                      ? "bg-amber-600 text-white rounded-tr-xs"
                      : isDarkMode
                      ? "bg-slate-800/90 border border-slate-750 text-slate-100 rounded-tl-xs"
                      : "bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                    <span className="font-bold">
                      {isUser ? "Você" : "Tutor Gemini FUNECE"}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <div className="text-xs sm:text-sm leading-relaxed">
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <FormattedMentorText content={msg.text} isMentor={true} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shrink-0 mt-1 animate-pulse shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div
                className={`rounded-2xl p-3.5 rounded-tl-xs border text-xs sm:text-sm flex items-center gap-2 ${
                  isDarkMode
                    ? "bg-slate-800/90 border-slate-750 text-slate-300"
                    : "bg-slate-50 border-slate-200 text-slate-600"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <span>
                  {modelTier === "complex"
                    ? "Gemini 3.1 Pro dissecando a questão com rigor extremo..."
                    : modelTier === "general"
                    ? "Gemini 3.5 Flash elaborando orientação didática..."
                    : "Gemini 3.1 Flash-Lite respondendo rapidamente..."}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div
          className={`px-4 py-2 border-t flex items-center gap-1.5 overflow-x-auto shrink-0 ${
            isDarkMode ? "bg-slate-850/60 border-slate-800" : "bg-slate-50/80 border-slate-200"
          }`}
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3" />
            Sugestões:
          </span>
          {questionSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              disabled={isSending}
              className={`px-2.5 py-1 rounded-full text-xs shrink-0 transition-all font-medium border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-amber-500/60 hover:text-white"
                  : "bg-white border-slate-200 text-slate-700 hover:border-amber-500/60 hover:bg-amber-50/50"
              }`}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div
          className={`p-3 sm:p-4 border-t shrink-0 ${
            isDarkMode ? "bg-slate-850 border-slate-750" : "bg-white border-slate-200"
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={
                question
                  ? "Tire sua dúvida sobre esta questão ou peça explicação de um distrator..."
                  : "Pergunte sobre técnicas de simulado, pegadinhas ou tempo de prova..."
              }
              disabled={isSending}
              className={`flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm border outline-none transition-all ${
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white focus:border-amber-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500"
              }`}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
