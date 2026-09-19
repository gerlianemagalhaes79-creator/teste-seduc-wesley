import React, { useState, useMemo } from "react";
import {
  X,
  Search,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Layers,
  FileText,
  HelpCircle,
  Upload,
  Download,
  Flame,
  Award,
  ChevronDown,
  ChevronRight,
  Filter,
  CheckSquare,
  AlertCircle,
  Copy,
  Check,
  PlusCircle,
  FileCode,
} from "lucide-react";
import { StudyTopic, StudySubtopic, TopicModule, UserProfile, SpecialtyId } from "../types";
import { SPECIALTIES } from "../data/specialties";

interface SyllabusExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  topics: StudyTopic[];
  userProfile: UserProfile;
  onToggleSubtopic: (topicId: string, subtopicId: string) => void;
  onToggleTopicComplete: (topicId: string) => void;
  onNavigateTab: (tab: string, extra?: any) => void;
  onImportSyllabusText?: (parsedTopics: StudyTopic[]) => void;
  isDarkMode?: boolean;
}

export const SyllabusExplorerModal: React.FC<SyllabusExplorerModalProps> = ({
  isOpen,
  onClose,
  topics,
  userProfile,
  onToggleSubtopic,
  onToggleTopicComplete,
  onNavigateTab,
  onImportSyllabusText,
  isDarkMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<TopicModule | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendentes" | "concluidos">("todos");
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  
  // Custom Syllabus Importer Tab state
  const [isImporterOpen, setIsImporterOpen] = useState<boolean>(false);
  const [rawSyllabusText, setRawSyllabusText] = useState<string>("");
  const [importTargetModule, setImportTargetModule] = useState<TopicModule>("conhecimentos_especificos");
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];

  // Auto-expand all on first load or allow toggling all
  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: prev[topicId] === undefined ? false : !prev[topicId],
    }));
  };

  const expandAll = () => {
    const next: Record<string, boolean> = {};
    topics.forEach((t) => {
      next[t.id] = true;
    });
    setExpandedTopics(next);
  };

  const collapseAll = () => {
    const next: Record<string, boolean> = {};
    topics.forEach((t) => {
      next[t.id] = false;
    });
    setExpandedTopics(next);
  };

  // Subtopics statistics calculation
  const stats = useMemo(() => {
    let totalSubtopics = 0;
    let completedSubtopics = 0;

    topics.forEach((t) => {
      if (t.subtopics && t.subtopics.length > 0) {
        totalSubtopics += t.subtopics.length;
        completedSubtopics += t.subtopics.filter((s) => s.isCompleted).length;
      } else {
        totalSubtopics += 1;
        if (t.isCompleted) completedSubtopics += 1;
      }
    });

    const percent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    return { totalSubtopics, completedSubtopics, percent };
  }, [topics]);

  // Filtered Topics & Subtopics
  const filteredList = useMemo(() => {
    return topics.filter((topic) => {
      if (selectedModule !== "all" && topic.moduleId !== selectedModule) return false;

      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const matchTitle = topic.title.toLowerCase().includes(q);
        const matchDesc = topic.description.toLowerCase().includes(q);
        const matchLaw = topic.keyFormulasOrLaws && topic.keyFormulasOrLaws.toLowerCase().includes(q);
        const matchSub = topic.subtopics?.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.description?.toLowerCase().includes(q) ||
            s.keywordsOrAuthors?.some((k) => k.toLowerCase().includes(q))
        );
        if (!matchTitle && !matchDesc && !matchLaw && !matchSub) return false;
      }

      if (filterStatus === "concluidos") {
        if (topic.subtopics && topic.subtopics.length > 0) {
          const allCompleted = topic.subtopics.every((s) => s.isCompleted);
          if (!allCompleted && !topic.isCompleted) return false;
        } else if (!topic.isCompleted) {
          return false;
        }
      }

      if (filterStatus === "pendentes") {
        if (topic.subtopics && topic.subtopics.length > 0) {
          const hasPending = topic.subtopics.some((s) => !s.isCompleted);
          if (!hasPending && topic.isCompleted) return false;
        } else if (topic.isCompleted) {
          return false;
        }
      }

      return true;
    });
  }, [topics, selectedModule, searchQuery, filterStatus]);

  // Handle custom edital parser and import
  const handleParseAndImport = () => {
    if (!rawSyllabusText.trim()) return;

    const lines = rawSyllabusText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const parsed: StudyTopic[] = [];
    let currentTopic: StudyTopic | null = null;

    lines.forEach((line, index) => {
      // Check if line looks like a main topic (e.g. "1. Tópico", "I - Tópico", "Módulo", or capital line)
      const isHeader =
        /^(\d+[\.\-\)]|[A-Z\s]{4,}:|[IVXLCDM]+[\.\-\)])/i.test(line) ||
        line.startsWith("•") === false && line.startsWith("-") === false && line.length < 80;

      if (isHeader || !currentTopic) {
        if (currentTopic) {
          parsed.push(currentTopic);
        }
        currentTopic = {
          id: `custom-import-${Date.now()}-${index}`,
          moduleId: importTargetModule,
          moduleName:
            importTargetModule === "conhecimentos_especificos"
              ? `Específica: ${currentSpecialty.name}`
              : importTargetModule === "lingua_portuguesa"
              ? "Língua Portuguesa"
              : importTargetModule === "educacao_brasileira_didatica"
              ? "Didática & Pedagogia"
              : "Legislação SEDUC-CE",
          title: line.replace(/^[\d\.\-\)\•\*]+\s*/, ""),
          description: `Conteúdo personalizado importado do edital para estudo direcionado FUNECE.`,
          importanceInFunece: "Altíssima (Foco Máximo)",
          estimatedMinutes: 60,
          isCompleted: false,
          isDelayed: false,
          scheduledDayOfWeek: (index % 6) + 1,
          keyFormulasOrLaws: "Edital Importado Personalizado",
          subtopics: [],
        };
      } else if (currentTopic) {
        // Add as subtopic
        const subTitle = line.replace(/^[\d\.\-\)\•\*\–\—]+\s*/, "");
        if (subTitle.length > 2) {
          currentTopic.subtopics = currentTopic.subtopics || [];
          currentTopic.subtopics.push({
            id: `custom-sub-${Date.now()}-${index}`,
            title: subTitle,
            description: `Subtópico detalhado extraído do edital.`,
            isCompleted: false,
            funeceIncidence: "Item do Edital",
            keywordsOrAuthors: ["Edital FUNECE"],
            estimatedMinutes: 25,
          });
        }
      }
    });

    if (currentTopic) {
      parsed.push(currentTopic);
    }

    if (onImportSyllabusText && parsed.length > 0) {
      onImportSyllabusText(parsed);
      setIsImporterOpen(false);
      setRawSyllabusText("");
    }
  };

  const handleCopyVerticalizedSyllabus = () => {
    let fullText = `=== EDITAL VERTICALIZADO & SUBTÓPICOS FUNECE / SEDUC-CE ===\n`;
    fullText += `Cargo: Professor de Ensino Médio - ${currentSpecialty.name}\n`;
    fullText += `Data da Prova: 22/11/2026\n\n`;

    topics.forEach((t) => {
      fullText += `[${t.isCompleted ? "X" : " "}] ${t.syllabusCode || ""} ${t.title} (${t.moduleName})\n`;
      if (t.subtopics && t.subtopics.length > 0) {
        t.subtopics.forEach((s) => {
          fullText += `    └─ [${s.isCompleted ? "X" : " "}] ${s.title} (${s.funeceIncidence || "FUNECE"})\n`;
        });
      }
      fullText += `\n`;
    });

    navigator.clipboard.writeText(fullText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-5xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[92vh] ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-800"
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 sm:p-6 border-b flex flex-wrap items-center justify-between gap-4 ${
            isDarkMode ? "bg-slate-800/80 border-slate-700" : "bg-emerald-900 text-white border-emerald-800"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Edital Verticalizado FUNECE
                </span>
                <span className="text-xs text-slate-300">
                  Especialidade: <strong className="text-white">{currentSpecialty.name}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Explorador de Tópicos & Subtópicos Oficiais
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVerticalizedSyllabus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                copiedNotification
                  ? "bg-emerald-500 text-white"
                  : isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
              title="Copiar Edital Verticalizado em texto"
            >
              {copiedNotification ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedNotification ? "Copiado!" : "Copiar Texto"}</span>
            </button>

            <button
              onClick={() => setIsImporterOpen(!isImporterOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isImporterOpen
                  ? "bg-emerald-600 text-white"
                  : isDarkMode
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isImporterOpen ? "Voltar ao Explorador" : "Colar / Importar Edital"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subtopic Progress Bar Banner */}
        <div
          className={`px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 text-xs ${
            isDarkMode ? "bg-slate-950/60 border-slate-800" : "bg-emerald-50 border-emerald-100 text-emerald-950"
          }`}
        >
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-400">Progresso Geral de Subtópicos:</span>
              <span className="font-black text-emerald-400 text-sm">
                {stats.completedSubtopics} / {stats.totalSubtopics} ({stats.percent}%)
              </span>
            </div>
            <div className="w-36 sm:w-56 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 underline transition-colors"
            >
              Expandir Todos
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={collapseAll}
              className="text-[11px] font-bold text-slate-400 hover:text-emerald-400 underline transition-colors"
            >
              Recolher Todos
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isImporterOpen ? (
          /* Custom Syllabus Importer Screen */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Importador Inteligente de Edital & Conteúdo Programático</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Você pode colar abaixo o texto do seu edital ou conteúdo verticalizado (tópicos numerados, tópicos principais e subtópicos com marcadores, hífens ou pontos). O sistema converterá automaticamente em cartões de estudo com acompanhamento de progresso.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Selecione o Módulo de Destino:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "conhecimentos_especificos", label: `Específica (${currentSpecialty.shortName})` },
                  { id: "lingua_portuguesa", label: "Língua Portuguesa" },
                  { id: "educacao_brasileira_didatica", label: "Didática & Pedagogia" },
                  { id: "administracao_publica", label: "Administração Pública" },
                  { id: "indicadores_educacionais", label: "Indicadores Educacionais" },
                  { id: "legislacao_educacional_ce", label: "Legislação SEDUC-CE" },
                ].map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setImportTargetModule(mod.id as TopicModule)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                      importTargetModule === mod.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                        : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600"
                    }`}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">Cole aqui o Conteúdo do Edital:</label>
                <button
                  onClick={() => {
                    setRawSyllabusText(
                      `1. Estrutura Celular e Membrana Plasmática\n- Transporte ativo e passivo\n- Osmose e comportamento celular\n- Organelas e metabolismo energético\n\n2. Genética e Hereditariedade\n- 1ª e 2ª Leis de Mendel\n- Epistasia e Herança Poligênica\n- Linkage e Engenharia Genética\n\n3. Ecologia e Bioma Caatinga\n- Dinâmica populacional e cadeias tróficas\n- Ciclos do Carbono e Nitrogênio\n- Adaptações da fauna e flora cearense ao Semiárido`
                    );
                  }}
                  className="text-[11px] font-bold text-emerald-400 hover:underline"
                >
                  Inserir Exemplo de Teste
                </button>
              </div>
              <textarea
                value={rawSyllabusText}
                onChange={(e) => setRawSyllabusText(e.target.value)}
                placeholder="Exemplo:\n1. Tópico Principal\n- Subtópico 1\n- Subtópico 2\n\n2. Segundo Tópico..."
                rows={10}
                className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsImporterOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleParseAndImport}
                disabled={!rawSyllabusText.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-900/30 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Processar e Integrar ao Cronograma</span>
              </button>
            </div>
          </div>
        ) : (
          /* Main Explorer List Screen */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Filters Bar */}
            <div
              className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
                isDarkMode ? "bg-slate-900/90 border-slate-800" : "bg-slate-50 border-slate-200"
              }`}
            >
              {/* Search */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tópicos, subtópicos, autores (ex: Piaget, Libâneo, Crase, Mendel)..."
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border transition-all ${
                    isDarkMode
                      ? "bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500 focus:border-emerald-500"
                      : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-emerald-600"
                  } focus:outline-none`}
                />
              </div>

              {/* Module Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: "all", label: "Todos" },
                  { id: "conhecimentos_especificos", label: `Específica (${currentSpecialty.shortName})` },
                  { id: "lingua_portuguesa", label: "Português" },
                  { id: "educacao_brasileira_didatica", label: "Didática" },
                  { id: "administracao_publica", label: "Adm. Pública" },
                  { id: "indicadores_educacionais", label: "Indicadores" },
                  { id: "legislacao_educacional_ce", label: "Legislação CE" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedModule(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedModule === tab.id
                        ? "bg-emerald-600 text-white shadow-sm"
                        : isDarkMode
                        ? "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1">
                {(["todos", "pendentes", "concluidos"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all ${
                      filterStatus === st
                        ? isDarkMode
                          ? "bg-slate-700 text-white"
                          : "bg-emerald-100 text-emerald-900 font-black"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics & Subtopics List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
              {filteredList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold">Nenhum tópico ou subtópico encontrado para os filtros selecionados.</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedModule("all");
                      setFilterStatus("todos");
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 text-xs font-bold hover:bg-emerald-600/30"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                filteredList.map((topic, idx) => {
                  const isExpanded = expandedTopics[topic.id] ?? true;
                  const totalSub = topic.subtopics?.length || 0;
                  const completedSub = topic.subtopics?.filter((s) => s.isCompleted).length || 0;
                  const isAllSubCompleted = totalSub > 0 && completedSub === totalSub;

                  return (
                    <div
                      key={topic.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        topic.isCompleted || isAllSubCompleted
                          ? isDarkMode
                            ? "bg-slate-900/60 border-emerald-500/40"
                            : "bg-emerald-50/50 border-emerald-200"
                          : isDarkMode
                          ? "bg-slate-800/50 border-slate-700/80 hover:border-slate-600"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      {/* Topic Parent Header */}
                      <div className="p-3.5 sm:p-4 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => onToggleTopicComplete(topic.id)}
                            className="mt-0.5 p-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                            title={topic.isCompleted ? "Marcar como pendente" : "Marcar tópico completo"}
                          >
                            {topic.isCompleted || isAllSubCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-500 hover:text-emerald-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                  topic.moduleId === "conhecimentos_especificos"
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : topic.moduleId === "lingua_portuguesa"
                                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                    : topic.moduleId === "educacao_brasileira_didatica"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                }`}
                              >
                                {topic.syllabusCode || `Item ${idx + 1}`} • {topic.moduleName}
                              </span>

                              {topic.funeceIncidencePercent && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                                  <Flame className="w-3 h-3 text-rose-400" />
                                  Incidência FUNECE: {topic.funeceIncidencePercent}%
                                </span>
                              )}

                              {totalSub > 0 && (
                                <span className="text-[10px] font-bold text-slate-400">
                                  {completedSub} de {totalSub} subtópicos concluídos
                                </span>
                              )}
                            </div>

                            <h3
                              className={`text-sm sm:text-base font-bold leading-snug ${
                                topic.isCompleted || isAllSubCompleted
                                  ? "line-through text-slate-400"
                                  : isDarkMode
                                  ? "text-white"
                                  : "text-slate-900"
                              }`}
                            >
                              {topic.title}
                            </h3>

                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                              {topic.description}
                            </p>

                            {topic.keyFormulasOrLaws && (
                              <div className="mt-2 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20 inline-block">
                                ⚖️ {topic.keyFormulasOrLaws}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick action buttons & Accordion toggle */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateTab("simulados", { topicFilter: topic.title });
                            }}
                            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
                            title="Praticar questões deste tópico"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                            <span>Questões</span>
                          </button>

                          <button
                            onClick={() => toggleTopicExpand(topic.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
                            title={isExpanded ? "Recolher subtópicos" : "Ver subtópicos detalhados"}
                          >
                            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Subtopics Accordion Content */}
                      {isExpanded && topic.subtopics && topic.subtopics.length > 0 && (
                        <div
                          className={`p-3 sm:p-4 border-t space-y-2.5 ${
                            isDarkMode ? "bg-slate-950/50 border-slate-800" : "bg-slate-50/80 border-slate-100"
                          }`}
                        >
                          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                            <span>Subtópicos & Detalhamento do Edital:</span>
                            <span className="text-emerald-400 font-black">
                              {Math.round((completedSub / totalSub) * 100)}%
                            </span>
                          </div>

                          <div className="space-y-2">
                            {topic.subtopics.map((sub, sIdx) => (
                              <div
                                key={sub.id}
                                className={`p-2.5 sm:p-3 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                                  sub.isCompleted
                                    ? isDarkMode
                                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-300"
                                      : "bg-emerald-100/50 border-emerald-200 text-emerald-950"
                                    : isDarkMode
                                    ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70"
                                    : "bg-white border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                  <button
                                    onClick={() => onToggleSubtopic(topic.id, sub.id)}
                                    className="mt-0.5 p-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                                  >
                                    {sub.isCompleted ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-500 hover:text-emerald-400" />
                                    )}
                                  </button>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                      <span className={`text-xs font-bold ${isDarkMode ? "text-slate-200" : "text-slate-800"}`}>
                                        {sIdx + 1}. {sub.title}
                                      </span>
                                      {sub.funeceIncidence && (
                                        <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                                          isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-200 text-slate-700"
                                        }`}>
                                          {sub.funeceIncidence}
                                        </span>
                                      )}
                                    </div>

                                    {sub.description && (
                                      <p className={`text-[11px] leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
                                        {sub.description}
                                      </p>
                                    )}

                                    {sub.keywordsOrAuthors && sub.keywordsOrAuthors.length > 0 && (
                                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {sub.keywordsOrAuthors.map((kw, kwIdx) => (
                                          <span
                                            key={kwIdx}
                                            className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                                              isDarkMode
                                                ? "bg-slate-800 text-slate-300 border-slate-700"
                                                : "bg-slate-100 text-slate-700 border-slate-200"
                                            }`}
                                          >
                                            #{kw}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    onClose();
                                    onNavigateTab("mentor", { questionPrompt: `Explique detalhadamente o subtópico: ${sub.title} para o concurso SEDUC-CE / FUNECE.` });
                                  }}
                                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline flex-shrink-0 flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" />
                                  <span>Mentor IA</span>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div
          className={`p-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${
            isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200 text-slate-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-500">Total listado:</span>
            <strong className={isDarkMode ? "text-white" : "text-slate-900"}>{filteredList.length} tópicos principais</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                isDarkMode
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200"
                  : "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
              }`}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
