import React from "react";
import { X, Printer, Download, CheckCircle2, Bookmark } from "lucide-react";
import { PDFMaterial } from "../types";

interface PrintMaterialModalProps {
  material: PDFMaterial | null;
  onClose: () => void;
}

export const PrintMaterialModal: React.FC<PrintMaterialModalProps> = ({ material, onClose }) => {
  if (!material) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Controls Bar (Hidden during window.print via css) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase">
              Visualização de Impressão PDF
            </span>
            <span className="text-xs text-slate-300">SEDUC Ceará • FUNECE</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar em PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-0 print:overflow-visible">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
            <div className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              SECRETARIA DA EDUCAÇÃO DO ESTADO DO CEARÁ • CONCURSO PÚBLICO PROFESSOR PLENO
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {material.title}
            </h1>
            <p className="text-sm font-semibold text-emerald-800">
              Guia Otimizado de Estudos • Banca Examinadora FUNECE (CEV/UECE)
            </p>
          </div>

          {/* Profile of FUNECE */}
          <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
            <div className="text-xs font-black uppercase text-slate-700">
              🎯 Raio-X & Perfil de Cobrança da Banca FUNECE:
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {material.funeceProfile}
            </p>
          </div>

          {/* Key Concepts */}
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              1. Conceitos Fundamentais
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
              {material.keyConcepts.map((c, i) => (
                <li key={i} className="flex items-start gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                  <span className="font-bold text-emerald-700 mt-0.5">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mnemonics */}
          {material.mnemonics && material.mnemonics.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                2. Mnemônicos & Macetes de Memorização
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {material.mnemonics.map((mn, i) => (
                  <div key={i} className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs space-y-1">
                    <div className="font-black text-emerald-950">{mn.name}</div>
                    <div className="text-emerald-900 leading-relaxed">{mn.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Sections */}
          <div className="space-y-6">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
              3. Desenvolvimento Esquematizado
            </h2>
            {material.contentSections.map((sec, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-sm font-black text-slate-900">{sec.heading}</h3>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">{sec.body}</p>
                {sec.highlight && (
                  <div className="p-2.5 bg-amber-50 border-l-4 border-amber-500 text-xs text-amber-950 font-medium">
                    <span className="font-bold">Atenção FUNECE:</span> {sec.highlight}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Table */}
          {material.summaryTable && (
            <div className="space-y-2">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                4. Quadro Sintético Comparativo
              </h2>
              <table className="w-full text-left text-xs border border-slate-300 divide-y divide-slate-300">
                <thead className="bg-slate-100 font-bold uppercase text-[10px]">
                  <tr>
                    {material.summaryTable.headers.map((h, i) => (
                      <th key={i} className="p-2.5 border-r border-slate-300">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {material.summaryTable.rows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 border-r border-slate-300 text-slate-800">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Checklist */}
          {material.quickChecklist && material.quickChecklist.length > 0 && (
            <div className="space-y-2">
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                5. Checklist de Fixação para o Dia da Prova
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-800">
                {material.quickChecklist.map((chk, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 border border-slate-200 rounded">
                    <div className="w-4 h-4 border border-slate-400 rounded shrink-0" />
                    <span>{chk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer watermark */}
          <div className="pt-8 border-t border-slate-300 text-center text-[10px] text-slate-500">
            Plataforma SEDUC Ceará • Sistema de Preparação Especializado FUNECE • Todos os direitos reservados.
          </div>
        </div>
      </div>
    </div>
  );
};
