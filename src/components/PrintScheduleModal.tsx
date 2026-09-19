import React, { useState } from "react";
import {
  X,
  Printer,
  Calendar,
  BookOpen,
  CheckSquare,
  Award,
  Layers,
  Sparkles,
  Flame,
  Clock,
  Target,
  FileText,
  ListOrdered,
} from "lucide-react";
import { StudyTopic, UserProfile } from "../types";
import { SPECIALTIES } from "../data/specialties";
import { generateFullMasterSchedule, StructuredDayPlan } from "../data/dailyStructuredMasterSchedule";

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  topics: StudyTopic[];
  daysUntilExam: number;
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  topics,
  daysUntilExam,
}) => {
  if (!isOpen) return null;

  const currentSpecialty = SPECIALTIES.find((s) => s.id === userProfile.specialty) || SPECIALTIES[0];
  const completedCount = topics.filter((t) => t.isCompleted).length;
  const progressPercent = topics.length > 0 ? Math.round((completedCount / topics.length) * 100) : 0;

  // Master schedule containing all 98 days
  const [printScope, setPrintScope] = useState<"completo" | "resumo_semanal" | "edital_verticalizado">("completo");
  const fullMasterSchedule = React.useMemo(() => generateFullMasterSchedule(), []);

  // Filter specific module topics
  const specificTopics = topics.filter((t) => t.moduleId === "conhecimentos_especificos");
  const portuguesTopics = topics.filter((t) => t.moduleId === "lingua_portuguesa");
  const admPublicaTopics = topics.filter((t) => t.moduleId === "administracao_publica");
  const indicadoresTopics = topics.filter((t) => t.moduleId === "indicadores_educacionais");
  const didaticaTopics = topics.filter((t) => t.moduleId === "educacao_brasileira_didatica" || t.moduleId === "legislacao_educacional_ce");

  const handlePrint = () => {
    // Check if running inside an iframe or browser context
    try {
      window.print();
    } catch (e) {
      console.warn("Direct window.print failed, trying new window fallback", e);
      handlePrintInNewWindow();
    }
  };

  const handlePrintInNewWindow = () => {
    const printContent = document.getElementById("printable-schedule-content");
    if (!printContent) {
      window.print();
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      // If popup blocked, standard fallback
      window.print();
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Cronograma SEDUC-CE - Professor do Ensino Médio (${currentSpecialty.name})</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .print-avoid-break { page-break-inside: avoid; break-inside: avoid; }
            }
            body { font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
          </style>
        </head>
        <body class="p-6 bg-white text-slate-900">
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden my-auto border border-slate-300">
        {/* Modal Controls Bar (Hidden during window.print) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-sm shadow">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Visualização de Impressão & Exportação PDF
              </div>
              <div className="text-sm font-black text-white">
                Cronograma Mestre Reestruturado • {currentSpecialty.name} (~5 Subtópicos/Dia)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setPrintScope("completo")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  printScope === "completo" ? "bg-emerald-600 text-white shadow" : "text-slate-300 hover:text-white"
                }`}
              >
                Cronograma Completo (14 Semanas)
              </button>
              <button
                onClick={() => setPrintScope("resumo_semanal")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  printScope === "resumo_semanal" ? "bg-emerald-600 text-white shadow" : "text-slate-300 hover:text-white"
                }`}
              >
                Grade Semanal Tipo
              </button>
              <button
                onClick={() => setPrintScope("edital_verticalizado")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  printScope === "edital_verticalizado" ? "bg-emerald-600 text-white shadow" : "text-slate-300 hover:text-white"
                }`}
              >
                Edital Verticalizado
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              title="Abrir diálogo de impressão do navegador"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>
            <button
              onClick={handlePrintInNewWindow}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition-all active:scale-95"
              title="Abrir versão limpa em nova aba caso a impressão direta falhe no iframe"
            >
              <span>Abrir em Nova Aba</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Fechar visualização"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body (A4 Clean High-Contrast Layout) */}
        <div id="printable-schedule-content" className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-0 print:overflow-visible print:space-y-4 text-slate-900 bg-white">
          {/* Institutional Header */}
          <div className="border-b-2 border-slate-900 pb-4 space-y-1 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-600">
              <span>GOVERNO DO ESTADO DO CEARÁ</span>
              <span>•</span>
              <span>SECRETARIA DA EDUCAÇÃO (SEDUC-CE)</span>
              <span>•</span>
              <span>BANCA FUNECE / CEV-UECE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">
              Plano de Estudos Contínuo & Conteúdo Programático Oficial
            </h1>
            <div className="text-xs sm:text-sm font-bold text-emerald-800">
              Cargo: Professor do Ensino Médio • Especialidade: {currentSpecialty.name.toUpperCase()} • Ciclo de ~5 Subtópicos Diários
            </div>
          </div>

          {/* Candidate Profile & Strategic Plan Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-300 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Candidato(a):</span>
              <span className="font-bold text-slate-900 text-sm">{userProfile.name || "Professor(a) Concursando"}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Disciplina / Área:</span>
              <span className="font-bold text-emerald-800 text-sm">{currentSpecialty.name} (50 Questões Específicas)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Estrutura da Prova:</span>
              <span className="font-bold text-slate-900 text-sm">30 Básicas + 50 Específicas (80 Q)</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Data da Prova Oficial:</span>
              <span className="font-bold text-rose-800 text-sm">22 de Novembro de 2026 ({daysUntilExam} dias)</span>
            </div>
          </div>

          {/* Strategic Distribution Directive Box */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950 space-y-1">
            <div className="font-black flex items-center gap-1.5 uppercase text-[11px]">
              <Target className="w-3.5 h-3.5 text-emerald-700" />
              <span>ARQUITETURA DA PROVA E ROTINA DIÁRIA (80 QUESTÕES • 5 SUBTÓPICOS/DIA):</span>
            </div>
            <p className="leading-snug text-[11px] text-emerald-900">
              • <strong>Conhecimentos Específicos (50 Questões):</strong> 3 Subtópicos diários de Biologia / Especialidade com resolução intensiva de itens.<br />
              • <strong>Língua Portuguesa (08 Questões):</strong> Estudo diário contínuo de sintaxe, interpretação textual e crase (FUNECE).<br />
              • <strong>Administração Pública (08 Questões):</strong> CF/88, princípios, Lei 9.826/74 (Estatuto CE) e estrutura do Ceará.<br />
              • <strong>Dados e Indicadores Educacionais (06 Questões):</strong> SPAECE, SAEB, IDEB, análise de tabelas, gráficos e estatística.<br />
              • <strong>Educação Brasileira / Temas Pedagógicos (08 Questões):</strong> LDB 9.394/96, DCRC, BNCC, autores (Libâneo, Saviani, Vygotsky).<br />
              • <strong>Conclusão do Edital:</strong> 15 de Novembro de 2026, reservando a <strong>Semana 14 (16 a 22/11) para super revisão e fixação</strong>.
            </p>
          </div>

          {/* SECTION 1: MASTER DAY-BY-DAY CONTINUOUS SCHEDULE (14 WEEKS) */}
          {(printScope === "completo" || printScope === "resumo_semanal") && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                <h2 className="text-sm font-black uppercase text-slate-950 tracking-wide flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>1. Cronograma Contínuo Dia a Dia (17 de Agosto a 22 de Novembro de 2026)</span>
                </h2>
                <span className="text-[11px] text-slate-600 font-bold">
                  Legenda: [ T ☐ ] Teoria | [ Q ☐ ] Questões | [ R ☐ ] Revisão
                </span>
              </div>

              {/* Weeks Table / Grid */}
              <div className="space-y-4">
                {Array.from({ length: printScope === "resumo_semanal" ? 2 : 14 }).map((_, wIdx) => {
                  const weekNum = wIdx + 1;
                  const weekDays = fullMasterSchedule.filter((d) => d.weekNumber === weekNum);
                  if (weekDays.length === 0) return null;

                  const weekPhase = weekDays[0].phase;
                  const isFinalWeek = weekNum === 14;

                  return (
                    <div key={weekNum} className="border border-slate-300 rounded-xl overflow-hidden break-inside-avoid">
                      {/* Week Header */}
                      <div className={`px-3 py-1.5 text-xs font-black uppercase flex items-center justify-between ${
                        isFinalWeek ? "bg-rose-100 text-rose-950 border-b border-rose-300" : "bg-slate-100 text-slate-900 border-b border-slate-300"
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-white border font-mono text-[10px]">
                            SEMANA {weekNum} ({weekDays[0].shortDate} a {weekDays[weekDays.length - 1].shortDate})
                          </span>
                          <span>{weekPhase}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600">
                          {isFinalWeek ? "🎯 RETA FINAL & PROVA" : "~25 Subtópicos Programados + Simulado"}
                        </span>
                      </div>

                      {/* Days Grid */}
                      <div className="divide-y divide-slate-200">
                        {weekDays.map((day) => (
                          <div key={day.dateKey} className={`p-2 text-xs ${day.isExamDay ? "bg-amber-50" : day.isReviewDay ? "bg-slate-50/70" : "bg-white"}`}>
                            {/* Day Header */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded text-[10px]">
                                  {day.weekdayShort} • {day.formattedDate}
                                </span>
                                <span className="font-bold text-slate-900 text-[11px]">{day.dayThemeTitle}</span>
                              </div>
                              {day.milestoneTitle && (
                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                                  {day.milestoneTitle}
                                </span>
                              )}
                            </div>

                            {/* Subtopics List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 mt-1">
                              {day.subtopics.map((sub) => (
                                <div key={sub.id} className="p-1.5 rounded border border-slate-200 bg-white flex items-start justify-between gap-1.5 text-[10px]">
                                  <div className="space-y-0.5 pr-1">
                                    <div className="flex items-center gap-1">
                                      <span className={`px-1 rounded text-[8px] font-black uppercase ${
                                        sub.subject === "biologia"
                                          ? "bg-emerald-100 text-emerald-900"
                                          : sub.subject === "portugues"
                                          ? "bg-blue-100 text-blue-900"
                                          : "bg-purple-100 text-purple-900"
                                      }`}>
                                        {sub.subject === "biologia" ? "Bio" : sub.subject === "portugues" ? "Port" : "Leg/Did"}
                                      </span>
                                      <span className="font-bold text-slate-900 line-clamp-1">{sub.title}</span>
                                    </div>
                                    <p className="text-slate-600 line-clamp-1 text-[9px]">{sub.focusPoint}</p>
                                  </div>
                                  <div className="flex items-center gap-0.5 shrink-0 text-[8px] font-mono text-slate-500">
                                    <span className="border border-slate-300 px-1 py-0.5 rounded">T☐</span>
                                    <span className="border border-slate-300 px-1 py-0.5 rounded">Q☐</span>
                                    <span className="border border-slate-300 px-1 py-0.5 rounded">R☐</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: VERTICALIZED SYLLABUS BY MODULE */}
          {(printScope === "completo" || printScope === "edital_verticalizado") && (
            <div className="space-y-4 pt-4 border-t-2 border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-400 pb-1">
                <h2 className="text-sm font-black uppercase text-slate-950 tracking-wide flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>2. Matriz do Conteúdo Programático Verticalizado (17 Tópicos de Biologia + Gerais)</span>
                </h2>
                <span className="text-[11px] text-slate-600 font-bold">
                  Banca CEV-UECE / FUNECE
                </span>
              </div>

              {/* Módulo Específico: Biologia / Especialidade (50 Questões) */}
              <div className="space-y-2">
                <div className="bg-emerald-100/80 px-3 py-1.5 rounded-md font-black text-xs text-emerald-950 uppercase flex items-center justify-between border border-emerald-300">
                  <span>📘 Conhecimentos Específicos: {currentSpecialty.name} (50 Questões)</span>
                  <span className="text-[10px] font-bold">{specificTopics.length} Tópicos Oficiais</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-800">
                  {specificTopics.map((t, idx) => (
                    <div
                      key={t.id}
                      className="p-2 border border-slate-300 rounded flex items-start justify-between gap-2 bg-white break-inside-avoid"
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="font-bold text-slate-950 text-[11px]">
                          {idx + 1}. {t.title}
                        </div>
                        <div className="text-[10px] text-slate-600 leading-snug">{t.description}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-[10px] font-mono text-slate-500">
                        <span className="border border-slate-400 px-1 py-0.5 rounded">T ☐</span>
                        <span className="border border-slate-400 px-1 py-0.5 rounded">Q ☐</span>
                        <span className="border border-slate-400 px-1 py-0.5 rounded">R ☐</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Módulos Básicos: 30 Questões (Português 8, Adm. Pública 8, Indicadores 6, Educação Brasileira 8) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* Português */}
                <div className="space-y-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/70">
                  <div className="font-black text-xs text-slate-900 border-b pb-1 flex items-center justify-between">
                    <span>📗 Língua Portuguesa</span>
                    <span className="text-[10px] font-bold text-emerald-800">08 Questões</span>
                  </div>
                  <div className="space-y-1">
                    {portuguesTopics.map((t, idx) => (
                      <div key={t.id} className="text-[10px] font-medium text-slate-800 flex items-center justify-between">
                        <span className="line-clamp-1">{idx + 1}. {t.title}</span>
                        <span className="text-[8px] font-mono text-slate-400">☐</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Administração Pública */}
                <div className="space-y-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/70">
                  <div className="font-black text-xs text-slate-900 border-b pb-1 flex items-center justify-between">
                    <span>🏛️ Adm. Pública</span>
                    <span className="text-[10px] font-bold text-emerald-800">08 Questões</span>
                  </div>
                  <div className="space-y-1">
                    {admPublicaTopics.map((t, idx) => (
                      <div key={t.id} className="text-[10px] font-medium text-slate-800 flex items-center justify-between">
                        <span className="line-clamp-1">{idx + 1}. {t.title}</span>
                        <span className="text-[8px] font-mono text-slate-400">☐</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dados e Indicadores */}
                <div className="space-y-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/70">
                  <div className="font-black text-xs text-slate-900 border-b pb-1 flex items-center justify-between">
                    <span>📊 Dados & Indicadores</span>
                    <span className="text-[10px] font-bold text-emerald-800">06 Questões</span>
                  </div>
                  <div className="space-y-1">
                    {indicadoresTopics.map((t, idx) => (
                      <div key={t.id} className="text-[10px] font-medium text-slate-800 flex items-center justify-between">
                        <span className="line-clamp-1">{idx + 1}. {t.title}</span>
                        <span className="text-[8px] font-mono text-slate-400">☐</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Educação Brasileira & Didática */}
                <div className="space-y-1.5 p-2.5 rounded-lg border border-slate-300 bg-slate-50/70">
                  <div className="font-black text-xs text-slate-900 border-b pb-1 flex items-center justify-between">
                    <span>📙 Ed. Brasileira & Didática</span>
                    <span className="text-[10px] font-bold text-emerald-800">08 Questões</span>
                  </div>
                  <div className="space-y-1">
                    {didaticaTopics.map((t, idx) => (
                      <div key={t.id} className="text-[10px] font-medium text-slate-800 flex items-center justify-between">
                        <span className="line-clamp-1">{idx + 1}. {t.title}</span>
                        <span className="text-[8px] font-mono text-slate-400">☐</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Reta Final Checkpoints */}
          <div className="space-y-2 border-t border-slate-300 pt-3 text-[10px]">
            <h3 className="font-black uppercase text-slate-900">
              3. Marcos da Reta Final até 22 de Novembro de 2026:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded bg-slate-50 border border-slate-300 space-y-0.5">
                <span className="font-black text-emerald-800 block">15/11: FECHAMENTO DO EDITAL</span>
                <span className="text-slate-700">100% dos subtópicos concluídos com 1 semana de antecedência.</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-300 space-y-0.5">
                <span className="font-black text-blue-800 block">07/11 e 14/11: SIMULADOS OFICIAIS</span>
                <span className="text-slate-700">Simulados gerais de 80 questões FUNECE (P1 + P2).</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-300 space-y-0.5">
                <span className="font-black text-purple-800 block">16 a 21/11: SUPER REVISÃO</span>
                <span className="text-slate-700">Revisão de mnemônicos, leis do CE e caderno de erros.</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-300 space-y-0.5">
                <span className="font-black text-rose-800 block">22/11: DIA DA PROVA (08H ÀS 12H30)</span>
                <span className="text-slate-700">Aplicação oficial das provas objetiva e discursiva.</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-400 text-center text-[9px] text-slate-500 space-y-0.5">
            <div>Plataforma de Estudos SEDUC Ceará • Concurso Professor do Ensino Médio • Banca Examinadora FUNECE (CEV-UECE)</div>
            <div>Documento gerado em {new Date().toLocaleDateString("pt-BR")} para uso pessoal e controle diário de estudos.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
