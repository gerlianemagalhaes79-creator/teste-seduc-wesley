import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Bookmark,
  Layers,
  ChevronRight,
} from "lucide-react";
import { PDFMaterial, SpecialtyId, UserProfile } from "../types";
import { SPECIALTIES } from "../data/specialties";
import { generateTopicSummaryPDF } from "../services/geminiService";
import confetti from "canvas-confetti";
import { FormattedMentorText } from "./FormattedMentorText";

interface MaterialsViewProps {
  materials: PDFMaterial[];
  userProfile: UserProfile;
  onSaveNewMaterial: (material: PDFMaterial) => void;
  onOpenPrintModal: (material: PDFMaterial) => void;
  initialTopicFilter?: string;
  isDarkMode?: boolean;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({
  materials,
  userProfile,
  onSaveNewMaterial,
  onOpenPrintModal,
  initialTopicFilter,
  isDarkMode = false,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<PDFMaterial | null>(
    materials.find((m) => initialTopicFilter && m.title && m.title.toLowerCase().includes(initialTopicFilter.toLowerCase())) ||
      materials[0] ||
      null
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [customTopicInput, setCustomTopicInput] = useState<string>("");

  const getCategoryLabel = (mat: PDFMaterial): string => {
    if (mat.category) return mat.category;
    if (mat.moduleId === "legislacao_educacional_ce") return "Legislação";
    if (mat.moduleId === "educacao_brasileira_didatica") return "Didática";
    if (mat.moduleId === "lingua_portuguesa") return "Português";
    if (mat.moduleId === "administracao_publica") return "Administração";
    return "Específica";
  };

  const getSnippet = (mat: PDFMaterial): string => {
    if (mat.summaryContent) {
      return mat.summaryContent.slice(0, 100);
    }
    if (mat.contentSections && mat.contentSections.length > 0) {
      return mat.contentSections.map((s) => `${s.heading}: ${s.body}`).join(" ").slice(0, 100);
    }
    if (mat.funeceProfile) {
      return mat.funeceProfile.slice(0, 100);
    }
    if (mat.keyConcepts && mat.keyConcepts.length > 0) {
      return mat.keyConcepts.join(" • ").slice(0, 100);
    }
    return "Resumo preparatório com foco nas pegadinhas da banca FUNECE.";
  };

  const getReadTime = (mat: PDFMaterial): number => {
    return mat.readTimeMinutes || mat.estimatedReadTimeMinutes || 10;
  };

  const getPageCount = (mat: PDFMaterial): number => {
    return mat.pageCount || Math.max(1, Math.ceil((mat.contentSections?.length || 2) * 1.5));
  };

  const filteredMaterials = materials.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(term)) ||
      (m.topic && m.topic.toLowerCase().includes(term)) ||
      (m.keyConcepts && m.keyConcepts.some((c) => c.toLowerCase().includes(term))) ||
      (m.funeceProfile && m.funeceProfile.toLowerCase().includes(term)) ||
      (m.summaryContent && m.summaryContent.toLowerCase().includes(term))
    );
  });

  const handleGenerateAiSummary = async () => {
    if (!customTopicInput.trim()) return;
    setIsGeneratingAi(true);
    try {
      const generated = await generateTopicSummaryPDF(userProfile.specialty, customTopicInput.trim());
      if (generated) {
        onSaveNewMaterial(generated);
        setSelectedMaterial(generated);
        setCustomTopicInput("");
        confetti({ particleCount: 35, spread: 60 });
      }
    } catch (e) {
      console.error("AI Material Error:", e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Materiais em PDF Otimizados & Guias de Estudo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Resumos Esquematizados para a FUNECE
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Material denso, direto ao ponto, com quadros comparativos, mnemônicos e foco nos artigos mais cobrados na SEDUC-CE.
            </p>
          </div>

          {/* AI Generator on demand */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md w-full">
            <input
              type="text"
              value={customTopicInput}
              onChange={(e) => setCustomTopicInput(e.target.value)}
              placeholder="Gerar resumo IA (ex: DCRC, PPP, Saviani)..."
              className={`flex-1 px-3 py-2 text-xs rounded-xl border outline-none ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                  : "bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-500"
              }`}
            />
            <button
              disabled={isGeneratingAi || !customTopicInput.trim()}
              onClick={handleGenerateAiSummary}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shrink-0"
            >
              {isGeneratingAi ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingAi ? "Sintetizando..." : "Gerar Resumo IA"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Material List & Material Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Material Selector */}
        <div className="lg:col-span-4 space-y-3">
          {/* Search bar inside materials */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar resumos e apostilas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-white focus:border-blue-500"
                  : "bg-white border-slate-300 text-slate-900 focus:border-blue-500 shadow-sm"
              }`}
            />
          </div>

          <div className="space-y-2">
            {filteredMaterials.map((mat) => {
              const isSelected = selectedMaterial?.id === mat.id;
              const category = getCategoryLabel(mat);
              const readTime = getReadTime(mat);
              const pageCount = getPageCount(mat);
              const snippet = getSnippet(mat);

              return (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-blue-600 border-blue-500 text-white shadow-md"
                      : isDarkMode
                      ? "bg-slate-900 border-slate-800 hover:bg-slate-850 text-slate-200"
                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : isDarkMode
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {category}
                    </span>
                    <span
                      className={`text-[11px] font-mono ${
                        isSelected ? "text-blue-100" : "text-slate-400"
                      }`}
                    >
                      {pageCount} pág. • {readTime} min
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mt-2 leading-snug">{mat.title}</h3>
                  <p
                    className={`text-xs mt-1 line-clamp-2 ${
                      isSelected ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {snippet}...
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Material Detailed Reader */}
        <div className="lg:col-span-8">
          {selectedMaterial ? (
            <div
              className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${
                isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
              }`}
            >
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      {getCategoryLabel(selectedMaterial)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Atualizado para o Edital 2026
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black">{selectedMaterial.title}</h2>
                  <div className="text-xs text-slate-400 mt-1">
                    Tópico do Edital: {selectedMaterial.topic}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenPrintModal(selectedMaterial)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir / Salvar PDF</span>
                  </button>
                </div>
              </div>

              {/* FUNECE Profile Box */}
              {selectedMaterial.funeceProfile && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1 ${
                    isDarkMode
                      ? "bg-purple-950/30 border-purple-500/40 text-purple-200"
                      : "bg-purple-50 border-purple-300 text-purple-950"
                  }`}
                >
                  <div className="font-black flex items-center gap-1.5 text-purple-600 dark:text-purple-300">
                    <Sparkles className="w-4 h-4" />
                    <span>🎯 Raio-X & Perfil de Cobrança da Banca FUNECE:</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">{selectedMaterial.funeceProfile}</p>
                </div>
              )}

              {/* Key Concepts Pills */}
              {selectedMaterial.keyConcepts && selectedMaterial.keyConcepts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Conceitos-Chave Cobrados pela FUNECE:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMaterial.keyConcepts.map((concept, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        ✓ {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mnemonics */}
              {selectedMaterial.mnemonics && selectedMaterial.mnemonics.length > 0 && (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Mnemônicos & Macetes de Memorização:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedMaterial.mnemonics.map((mn, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                          isDarkMode
                            ? "bg-emerald-950/25 border-emerald-500/30 text-emerald-200"
                            : "bg-emerald-50 border-emerald-300 text-emerald-950"
                        }`}
                      >
                        <div className="font-black text-emerald-600 dark:text-emerald-300">{mn.name}</div>
                        <div className="leading-relaxed">{mn.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Structured Content Sections */}
              {selectedMaterial.contentSections && selectedMaterial.contentSections.length > 0 && (
                <div className="space-y-5 pt-2">
                  {selectedMaterial.contentSections.map((sec, i) => (
                    <div
                      key={i}
                      className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 ${
                        isDarkMode ? "bg-slate-850 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <h3 className="text-sm font-black text-blue-600 dark:text-blue-300">
                        {sec.heading}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {sec.body}
                      </p>
                      {sec.highlight && (
                        <div
                          className={`p-3 rounded-xl border text-xs font-medium ${
                            isDarkMode
                              ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                              : "bg-amber-50 border-amber-300 text-amber-950"
                          }`}
                        >
                          <span className="font-bold text-amber-600 dark:text-amber-400">⚠️ Atenção FUNECE: </span>
                          {sec.highlight}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Raw / Generated Summary Content if available */}
              {selectedMaterial.summaryContent && (
                <div
                  className={`p-6 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                    isDarkMode
                      ? "bg-slate-850 border-slate-750 text-slate-200 font-sans"
                      : "bg-slate-50 border-slate-200 text-slate-800 font-sans"
                  }`}
                >
                  <FormattedMentorText content={selectedMaterial.summaryContent} />
                </div>
              )}

              {/* Summary Table if present */}
              {selectedMaterial.summaryTable && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Quadro Sintético Comparativo:
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border border-slate-700 divide-y divide-slate-700">
                      <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[10px]">
                        <tr>
                          {selectedMaterial.summaryTable.headers.map((h, i) => (
                            <th key={i} className="p-2.5 border-r border-slate-700">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {selectedMaterial.summaryTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-slate-900/50" : ""}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="p-2.5 border-r border-slate-800 text-slate-300">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Checklist */}
              {selectedMaterial.quickChecklist && selectedMaterial.quickChecklist.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Checklist de Fixação Rápida:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMaterial.quickChecklist.map((chk, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-300"
                            : "bg-slate-100 border-slate-200 text-slate-700"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{chk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FUNECE Trap Warning Box */}
              {selectedMaterial.funeceTrapAlert && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1 ${
                    isDarkMode
                      ? "bg-amber-950/30 border-amber-500/40 text-amber-200"
                      : "bg-amber-50 border-amber-300 text-amber-900"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5 text-amber-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Atenção à Pegadinha da Banca FUNECE:</span>
                  </div>
                  <p className="text-xs leading-relaxed">{selectedMaterial.funeceTrapAlert}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              Selecione um resumo ao lado para ler.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

