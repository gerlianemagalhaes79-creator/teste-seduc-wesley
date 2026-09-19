import React from "react";
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  BookOpen,
  MapPin,
  Sparkles,
  ChevronRight,
  ExternalLink,
  DollarSign,
  GraduationCap,
  Building2,
  Users,
} from "lucide-react";
import { CONCURSO_DATES, CONCURSO_STAGES, CONCURSO_GENERAL_INFO } from "../data/concursoDates";

interface DatesTimelineViewProps {
  daysUntilExam: number;
  isDarkMode?: boolean;
}

export const DatesTimelineView: React.FC<DatesTimelineViewProps> = ({
  daysUntilExam,
  isDarkMode = false,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-all ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 text-xs font-bold mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Cronograma Oficial SEDUC Ceará</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">
              Aviso de Prazos & Fases do Concurso
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Acompanhe cada etapa do certame organizado pela banca FUNECE (CEV/UECE) para não perder nenhum prazo.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border text-center min-w-[160px] ${
              isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="text-3xl font-black text-amber-500 font-mono">
              {daysUntilExam > 0 ? daysUntilExam : "0"}
            </div>
            <div className={`text-xs font-semibold mt-0.5 ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Dias até a Prova Objetiva
            </div>
            <div className="text-[11px] text-slate-400">22 de Novembro de 2026</div>
          </div>
        </div>
      </div>

      {/* Official Summary Cards (Inscrições, Taxa, Banca, Vagas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Inscrições */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Inscrições</span>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">Período Oficial</div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            16/09 a 15/10/2026
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Portal oficial da banca CEV/UECE
          </p>
        </div>

        {/* Card 2: Taxa */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Taxa</span>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Investimento</div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-mono">
            R$ 150,00
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pagamento via boleto bancário oficial
          </p>
        </div>

        {/* Card 3: Banca */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Banca</span>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">Organizadora</div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            FUNECE / CEV-UECE
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Comissão Executiva do Vestibular UECE
          </p>
        </div>

        {/* Card 4: Vagas */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDarkMode
              ? "bg-slate-900 border-slate-800 text-white"
              : "bg-white border-slate-200 text-slate-900 shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Oportunidades</span>
              <div className="text-xs font-bold text-purple-600 dark:text-purple-400">Quadro de Vagas</div>
            </div>
          </div>
          <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white">
            2.000 + 1.000 CR
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total de 3.000 vagas p/ Professor Estadual
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div
        className={`rounded-2xl border p-6 space-y-6 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-500" />
          Linha do Tempo Oficial de Eventos
        </h2>

        <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700/50">
          {CONCURSO_DATES.map((item, idx) => {
            const isCompleted = item.status === "concluido";
            const isCurrent = item.status === "em_andamento" || item.status === "proximo";

            return (
              <div key={item.id} className="relative group">
                {/* Node Bullet */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-400 text-white"
                      : isCurrent
                      ? "bg-amber-500 border-amber-400 text-slate-950 animate-pulse font-bold"
                      : isDarkMode
                      ? "bg-slate-900 border-slate-700 text-slate-500"
                      : "bg-white border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <span className="text-[10px] font-black">{idx + 1}</span>
                  )}
                </div>

                {/* Content Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCurrent
                      ? isDarkMode
                        ? "bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-950/20"
                        : "bg-amber-50/70 border-amber-300 shadow-sm"
                      : isCompleted
                      ? isDarkMode
                        ? "bg-slate-950/40 border-slate-800/80 opacity-70"
                        : "bg-slate-50 border-slate-200 opacity-70"
                      : isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-500 px-2 py-0.5 bg-amber-500/10 rounded">
                        {item.formattedDate}
                      </span>
                      {item.isImportantMilestone && (
                        <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-500 rounded border border-rose-500/30">
                          Data Crítica
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 capitalize">{item.status.replace("_", " ")}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold mt-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 Stages of the Concurso */}
      <div
        className={`rounded-2xl border p-6 space-y-4 ${
          isDarkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900 shadow-sm"
        }`}
      >
        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Fases e Etapas de Avaliação da FUNECE
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CONCURSO_STAGES.map((stage) => (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border space-y-2 ${
                isDarkMode ? "bg-slate-800/60 border-slate-750" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {stage.type}
                </span>
                <span className="text-xs font-semibold text-slate-400">Peso: {stage.weight}</span>
              </div>
              <h3 className="text-sm font-bold">{stage.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
