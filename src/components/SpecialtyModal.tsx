import React from "react";
import { X, Check, GraduationCap, Clock, Sparkles } from "lucide-react";
import { SpecialtyId } from "../types";
import { SPECIALTIES } from "../data/specialties";

interface SpecialtyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSpecialty: SpecialtyId;
  currentHoursPerDay: number;
  onSelectSpecialty: (specialtyId: SpecialtyId, hoursPerDay: number) => void;
  isDarkMode?: boolean;
}

export const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  isOpen,
  onClose,
  currentSpecialty,
  currentHoursPerDay,
  onSelectSpecialty,
  isDarkMode = false,
}) => {
  const [selectedSpec, setSelectedSpec] = React.useState<SpecialtyId>(currentSpecialty);
  const [hours, setHours] = React.useState<number>(currentHoursPerDay);

  if (!isOpen) return null;

  const handleSave = () => {
    onSelectSpecialty(selectedSpec, hours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div
        className={`rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div
          className={`p-5 border-b flex items-center justify-between ${
            isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Configurar Especialidade & Metas</h2>
              <p className="text-xs text-slate-400">Edital SEDUC-CE • Banca FUNECE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Study hours selection */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Quantas horas líquidas você pode estudar por dia?
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 6].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    hours === h
                      ? "bg-emerald-600 border-emerald-500 text-white shadow"
                      : isDarkMode
                      ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {h} horas/dia
                </button>
              ))}
            </div>
          </div>

          {/* Specialties grid */}
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-wider block ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
              Selecione sua Disciplina de Concurso:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SPECIALTIES.map((spec) => {
                const isSelected = selectedSpec === spec.id;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setSelectedSpec(spec.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-sm"
                        : isDarkMode
                        ? "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className={`text-xs sm:text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                        {spec.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {spec.description}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        {spec.estimatedVacancies} vagas estimadas • Peso {spec.weightInExam}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`p-4 border-t flex items-center justify-end gap-3 ${
            isDarkMode ? "border-slate-800 bg-slate-900" : "border-slate-100 bg-slate-50"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${
              isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
          >
            Salvar & Recalibrar Cronograma
          </button>
        </div>
      </div>
    </div>
  );
};
