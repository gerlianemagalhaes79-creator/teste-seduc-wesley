import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  BookOpen,
  HelpCircle,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { StudyTopic, Question, PDFMaterial, ConcursoStageDate } from "../types";
import { CONCURSO_DATES } from "../data/concursoDates";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: StudyTopic[];
  questions: Question[];
  materials: PDFMaterial[];
  onNavigateToTopic: (topic: StudyTopic) => void;
  onNavigateToQuestion: (question: Question) => void;
  onNavigateToMaterial: (material: PDFMaterial) => void;
  onNavigateToDates: () => void;
  isDarkMode: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  topics,
  questions,
  materials,
  onNavigateToTopic,
  onNavigateToQuestion,
  onNavigateToMaterial,
  onNavigateToDates,
  isDarkMode,
}) => {
  const [query, setQuery] = useState("");

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim() || query.trim().length < 2) {
      return { topics: [], questions: [], materials: [], dates: [] };
    }
    const q = query.toLowerCase().trim();

    const matchedTopics = topics.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.moduleName.toLowerCase().includes(q) ||
        (t.keyFormulasOrLaws && t.keyFormulasOrLaws.toLowerCase().includes(q))
    ).slice(0, 5);

    const matchedQuestions = questions.filter(
      (question) =>
        (question.statement && question.statement.toLowerCase().includes(q)) ||
        (question.topic && question.topic.toLowerCase().includes(q)) ||
        (question.discipline && question.discipline.toLowerCase().includes(q)) ||
        (question.explanation && question.explanation.toLowerCase().includes(q)) ||
        (question.funeceInsight && question.funeceInsight.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedMaterials = materials.filter(
      (m) =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.topic && m.topic.toLowerCase().includes(q)) ||
        (m.keyConcepts && m.keyConcepts.some((c) => c.toLowerCase().includes(q))) ||
        (m.funeceProfile && m.funeceProfile.toLowerCase().includes(q)) ||
        (m.summaryContent && m.summaryContent.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedDates = CONCURSO_DATES.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.formattedDate.toLowerCase().includes(q)
    ).slice(0, 3);

    return {
      topics: matchedTopics,
      questions: matchedQuestions,
      materials: matchedMaterials,
      dates: matchedDates,
    };
  }, [query, topics, questions, materials]);

  const totalResults =
    searchResults.topics.length +
    searchResults.questions.length +
    searchResults.materials.length +
    searchResults.dates.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Search Header */}
        <div
          className={`flex items-center px-4 py-3.5 border-b ${
            isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"
          }`}
        >
          <Search className="w-5 h-5 text-emerald-500 mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Pesquise por tópicos do edital, LDB, Didática, questões ou resumos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className={`w-full bg-transparent text-sm sm:text-base font-medium outline-none placeholder:text-slate-400 ${
              isDarkMode ? "text-white" : "text-slate-900"
            }`}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd
            className={`ml-2 px-2 py-0.5 text-[10px] font-mono rounded border uppercase ${
              isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-200 border-slate-300 text-slate-600"
            }`}
          >
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className={`text-sm font-bold ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                Busca Rápida e Inteligente no Edital SEDUC-CE
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Digite termos como <span className="font-semibold text-emerald-500">"LDB Artigo 24"</span>,{" "}
                <span className="font-semibold text-emerald-500">"Libâneo"</span>,{" "}
                <span className="font-semibold text-emerald-500">"Concordância"</span> ou{" "}
                <span className="font-semibold text-emerald-500">"Plano de Aula"</span>.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                {["Didática FUNECE", "LDB 9394/96", "DCRC Ceará", "Estatuto do Magistério", "Avaliação da Aprendizagem"].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                          : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <div className="text-sm font-semibold">Nenhum resultado encontrado para "{query}"</div>
              <div className="text-xs mt-1">Tente buscar por palavras-chave mais genéricas.</div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Topics Results */}
              {searchResults.topics.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Tópicos do Cronograma & Edital ({searchResults.topics.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.topics.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          onNavigateToTopic(t);
                          onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isDarkMode
                            ? "bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-emerald-500/50"
                            : "bg-slate-50 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
                        }`}
                      >
                        <div className="pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{t.title}</span>
                            {t.isCompleted && (
                              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-bold rounded">
                                Concluído
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {t.moduleName} • {t.description}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions Results */}
              {searchResults.questions.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Questões da Banca FUNECE ({searchResults.questions.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.questions.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => {
                          onNavigateToQuestion(q);
                          onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isDarkMode
                            ? "bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-amber-500/50"
                            : "bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300"
                        }`}
                      >
                        <div className="pr-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded">
                              {q.discipline}
                            </span>
                            <span className="text-xs font-bold line-clamp-1">{q.topic}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {q.statement}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Materials Results */}
              {searchResults.materials.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Resumos em PDF para Download & Impressão ({searchResults.materials.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.materials.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          onNavigateToMaterial(m);
                          onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isDarkMode
                            ? "bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-blue-500/50"
                            : "bg-slate-50 border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                        }`}
                      >
                        <div className="pr-3">
                          <div className="text-xs font-bold">{m.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {m.topic} • {m.pageCount || Math.max(1, Math.ceil((m.contentSections?.length || 2) * 1.5))} pág. • Foco FUNECE
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates and Events */}
              {searchResults.dates.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Prazos & Fases do Concurso ({searchResults.dates.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {searchResults.dates.map((d) => (
                      <button
                        key={d.id}
                        onClick={() => {
                          onNavigateToDates();
                          onClose();
                        }}
                        className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                          isDarkMode
                            ? "bg-slate-800/60 border-slate-750 hover:bg-slate-800 hover:border-rose-500/50"
                            : "bg-slate-50 border-slate-200 hover:bg-rose-50 hover:border-rose-300"
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-500/20 text-rose-400 rounded">
                              {d.formattedDate}
                            </span>
                            <span className="text-xs font-bold">{d.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{d.description}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-4 py-2.5 border-t text-[11px] flex items-center justify-between ${
            isDarkMode ? "border-slate-800 bg-slate-950/60 text-slate-400" : "border-slate-100 bg-slate-100/60 text-slate-500"
          }`}
        >
          <span>Dica: Use <strong>Tab</strong> ou clique para navegar instantaneamente</span>
          <button onClick={onClose} className="hover:text-emerald-500 font-semibold">
            Fechar (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
