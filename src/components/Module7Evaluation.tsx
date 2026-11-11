import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  Award,
  CheckCircle,
  HelpCircle,
  Printer,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  FolderOpen,
  Calendar,
  User,
  Info,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  PenTool,
} from 'lucide-react';
import { AuditorEvaluationItem } from '../types/audit';
import { SignatureModal } from './SignatureModal';

export const Module7Evaluation: React.FC = () => {
  const {
    auditorEvaluation,
    setAuditorEvaluation,
    updateAuditorEvaluationAspect,
    isEditMode,
    triggerSaveNotification,
    program,
    plan,
    opening,
    checklist,
    closing,
    finalReport,
  } = useAudit();

  const [activeSubTab, setActiveSubTab] = useState<'evaluation' | 'all_formats'>('evaluation');
  const [selectedFormatCode, setSelectedFormatCode] = useState<string>('FO-MCO-23');

  const [signatureModalConfig, setSignatureModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialName: string;
    currentSignature?: string;
    target: 'evaluator' | 'evaluated';
  }>({
    isOpen: false,
    title: '',
    initialName: '',
    target: 'evaluator',
  });

  const handleSaveEvaluationSignature = (signatureDataUrl: string, newSignerName?: string) => {
    if (signatureModalConfig.target === 'evaluator') {
      setAuditorEvaluation((prev) => ({
        ...prev,
        leadAuditorEvaluator: newSignerName?.trim() || prev.leadAuditorEvaluator,
        evaluatorSignature: signatureDataUrl,
        evaluatorSignatureDate: prev.evaluatorSignatureDate || new Date().toLocaleString('es-CO'),
      }));
      triggerSaveNotification('Firma y nombre de Auditor Evaluador actualizados');
    } else {
      setAuditorEvaluation((prev) => ({
        ...prev,
        internalAuditorEvaluated: newSignerName?.trim() || prev.internalAuditorEvaluated,
        evaluatedSignature: signatureDataUrl,
        evaluatedSignatureDate: new Date().toLocaleString('es-CO'),
      }));
      triggerSaveNotification('Firma y nombre de Auditor Evaluado actualizados');
    }
  };

  // Calculate score in real time
  const totalScore = auditorEvaluation.aspects.reduce((acc, curr) => acc + curr.score, 0);
  const maxScore = auditorEvaluation.aspects.length * 5; // 50 points
  const percentage = Math.round((totalScore / maxScore) * 100);

  // Performance category
  const getPerformanceBadge = () => {
    if (percentage >= 90) {
      return {
        label: 'Excelente - Auditor Líder / Autónomo',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        textColor: 'text-emerald-700',
        desc: 'Cumple con creces el perfil de competencias ISO 19011. Apto para liderar equipos de auditoría.',
      };
    } else if (percentage >= 80) {
      return {
        label: 'Bueno - Auditor Interno Competente',
        color: 'bg-cyan-100 text-cyan-800 border-cyan-300',
        textColor: 'text-cyan-700',
        desc: 'Demuestra sólida destreza y rigor metrológico. Apto para auditar procesos técnicos.',
      };
    } else if (percentage >= 70) {
      return {
        label: 'Aceptable - Requiere Acompañamiento',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        textColor: 'text-amber-700',
        desc: 'Conocimientos adecuados pero requiere acompañamiento en la estructuración de No Conformidades.',
      };
    } else {
      return {
        label: 'No Apto - Requiere Reentrenamiento',
        color: 'bg-rose-100 text-rose-800 border-rose-300',
        textColor: 'text-rose-700',
        desc: 'Puntaje inferior al estándar mínimo. Requiere curso de actualización en ISO 19011 y muestreo gráfico.',
      };
    }
  };

  const badge = getPerformanceBadge();

  // Export FO-MCO-23 to Excel (CSV)
  const exportEvaluationToExcel = () => {
    let csv = '\uFEFF';
    csv += `EVALUACIÓN DE AUDITORES INTERNOS DE CALIDAD - ${auditorEvaluation.metadata.code}\n`;
    csv += `Empresa: Impresos El Día S.A.S.\n`;
    csv += `Fecha: ${auditorEvaluation.date}, Auditoría(s): ${auditorEvaluation.auditNumbers}\n`;
    csv += `Evaluador: ${auditorEvaluation.leadAuditorEvaluator}\n`;
    csv += `Evaluado: ${auditorEvaluation.internalAuditorEvaluated}\n\n`;
    csv += `#,Aspecto a Evaluar,Calificación (1-5),Comentarios / Evidencias\n`;

    auditorEvaluation.aspects.forEach((item) => {
      csv += `"${item.id}","${item.aspect.replace(/"/g, '""')}","${item.score}","${(item.comments || '').replace(/"/g, '""')}"\n`;
    });

    csv += `\nPuntaje Total Obtenido,${totalScore} / ${maxScore},${percentage}%,${badge.label}\n`;
    csv += `Observaciones,"${auditorEvaluation.observations.replace(/"/g, '""')}"\n`;
    csv += `Análisis del Resultado,"${auditorEvaluation.resultAnalysis.replace(/"/g, '""')}"\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FO-MCO-23_Evaluacion_Auditores_Impresos_El_Dia.csv`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSaveNotification('Evaluación FO-MCO-23 exportada a Excel');
  };

  // Export FO-MCO-23 to Word (.doc)
  const exportEvaluationToWord = () => {
    let html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>FO-MCO-23 Evaluación Auditores</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 7px 10px; font-size: 10pt; }
        th { background-color: #f1f5f9; text-align: left; }
        .score-box { background: #f8fafc; border: 1px solid #0284c7; padding: 12px; margin: 15px 0; font-weight: bold; }
      </style>
    </head><body>
      <h2>IMPRESOS EL DÍA S.A.S. — SISTEMA DE GESTIÓN DE LA CALIDAD</h2>
      <h3>${auditorEvaluation.metadata.code} — EVALUACIÓN DE AUDITORES INTERNOS DE CALIDAD (Versión ${auditorEvaluation.metadata.version})</h3>
      <p><strong>Fecha:</strong> ${auditorEvaluation.date} | <strong>Auditorías:</strong> ${auditorEvaluation.auditNumbers}</p>
      <p><strong>Evaluador:</strong> ${auditorEvaluation.leadAuditorEvaluator}</p>
      <p><strong>Evaluado:</strong> ${auditorEvaluation.internalAuditorEvaluated}</p>
      <p><strong>Objetivo:</strong> ${auditorEvaluation.objective}</p>
      <p><strong>Instrucciones:</strong> ${auditorEvaluation.instructions}</p>
      
      <table>
        <thead>
          <tr>
            <th style="width: 40px;">#</th>
            <th>Aspecto a Evaluar</th>
            <th style="width: 80px; text-align: center;">Calificación (1-5)</th>
            <th>Comentarios y Evidencias</th>
          </tr>
        </thead>
        <tbody>
          ${auditorEvaluation.aspects
            .map(
              (item) => `<tr>
                <td>${item.id}</td>
                <td>${item.aspect}</td>
                <td style="text-align: center; font-weight: bold;">${item.score}</td>
                <td>${item.comments || ''}</td>
              </tr>`
            )
            .join('')}
        </tbody>
      </table>

      <div class="score-box">
        Puntaje Total: ${totalScore} / ${maxScore} puntos (${percentage}%) — Clasificación: ${badge.label}
      </div>

      <p><strong>Observaciones Generales:</strong><br>${auditorEvaluation.observations}</p>
      <p><strong>Análisis del Resultado:</strong><br>${auditorEvaluation.resultAnalysis}</p>
      
      <br><br>
      <table style="border: none;">
        <tr>
          <td style="border: none; width: 50%;">
            ________________________________________<br>
            <strong>${auditorEvaluation.evaluatorSignature || 'Firma Evaluador'}</strong><br>
            Auditor Líder Evaluador
          </td>
          <td style="border: none; width: 50%;">
            ________________________________________<br>
            <strong>Firma Auditor Evaluado</strong><br>
            Aceptación y Socialización
          </td>
        </tr>
      </table>
    </body></html>`;

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FO-MCO-23_Evaluacion_Auditores_Impresos_El_Dia.doc`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSaveNotification('Evaluación FO-MCO-23 exportada a Word');
  };

  const allCorporateFormats = [
    { code: 'FO-MCO-17', title: 'Programa de Auditoría', version: '02', date: 'Feb 14 de 2024', page: 'Página 1', targetTab: 'module1_program' },
    { code: 'FO-MCO-18', title: 'Plan de Auditoría', version: '01', date: 'Feb 14 de 2024', page: 'Página 2', targetTab: 'module2_plan' },
    { code: 'FO-MCO-19', title: 'Lista de Verificación (Chequeo)', version: '01', date: 'Feb 14 de 2024', page: 'Página 4', targetTab: 'module4_checklist' },
    { code: 'FO-MCO-20', title: 'Acta de Apertura de Auditoría', version: '01', date: 'Feb 14 de 2024', page: 'Página 3', targetTab: 'module3_opening' },
    { code: 'FO-MCO-21', title: 'Acta de Cierre de Auditoría', version: '01', date: 'Feb 14 de 2024', page: 'Página 5', targetTab: 'module5_closing_report' },
    { code: 'FO-MCO-22', title: 'Informe Final de Auditoría', version: '01', date: 'Feb 14 de 2024', page: 'Página 5', targetTab: 'module5_closing_report' },
    { code: 'FO-MCO-23', title: 'Evaluación de Auditores Internos', version: '01', date: 'Feb 14 de 2024', page: 'Página 7', targetTab: 'module7_evaluation' },
  ];

  return (
    <div className="space-y-6">
      {/* Official SGC Header with Parameterization Drawer */}
      <FormatHeader
        metadata={auditorEvaluation.metadata}
        formatKey="FO-MCO-23"
        pageNumber="Página 1 de 1"
        showWorkflowFooter={false}
        title="FORMATO: EVALUACIÓN DE AUDITORES INTERNOS DE CALIDAD"
      />

      {/* View Switcher / Quick Action Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('evaluation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'evaluation'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Matriz de Evaluación FO-MCO-23</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('all_formats')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'all_formats'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-600" />
            <span>Repositorio Completo de Formatos FO-MCO</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={exportEvaluationToWord}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Exportar Word</span>
          </button>

          <button
            type="button"
            onClick={exportEvaluationToExcel}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar Excel</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-medium transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / PDF</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'evaluation' ? (
        <>
          {/* General Metadata Box */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-amber-500/10 text-amber-600 rounded">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Datos Generales de la Evaluación
                  </h3>
                  <p className="text-xs text-slate-500">
                    Conforme a las directrices de competencia y evaluación de auditores ISO 19011:2018.
                  </p>
                </div>
              </div>

              {/* Real-time score indicator pill */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-500 font-medium">Calificación Global:</div>
                  <div className="text-lg font-mono font-extrabold text-slate-900">
                    {totalScore} / {maxScore} <span className="text-xs font-semibold text-slate-600">({percentage}%)</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-md border text-xs font-bold ${badge.color}`}>
                  {badge.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Fecha de Evaluación:</label>
                {isEditMode ? (
                  <input
                    type="date"
                    value={auditorEvaluation.date}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                    {auditorEvaluation.date}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Auditoría(s) Evaluada(s):</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={auditorEvaluation.auditNumbers}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, auditNumbers: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-100">
                    {auditorEvaluation.auditNumbers}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Auditor Líder Evaluador:</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={auditorEvaluation.leadAuditorEvaluator}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, leadAuditorEvaluator: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-100 truncate">
                    {auditorEvaluation.leadAuditorEvaluator}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Auditor Interno Evaluado:</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={auditorEvaluation.internalAuditorEvaluated}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, internalAuditorEvaluated: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <div className="font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-100 truncate">
                    {auditorEvaluation.internalAuditorEvaluated}
                  </div>
                )}
              </div>
            </div>

            {/* Objective and Instructions */}
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Objetivo de la Evaluación:</label>
                {isEditMode ? (
                  <textarea
                    rows={2}
                    value={auditorEvaluation.objective}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, objective: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
                    {auditorEvaluation.objective}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Instrucciones de Calificación:</label>
                {isEditMode ? (
                  <textarea
                    rows={2}
                    value={auditorEvaluation.instructions}
                    onChange={(e) =>
                      setAuditorEvaluation((prev) => ({ ...prev, instructions: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                  />
                ) : (
                  <p className="text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 leading-relaxed">
                    {auditorEvaluation.instructions}
                  </p>
                )}
              </div>
            </div>

            {/* Score scale legend bar */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-md flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700">Escala de Calificación Oficial:</span>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-bold">1: Malo</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold">2: Regular</span>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">3: Aceptable</span>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">4: Bueno</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">5: Excelente</span>
              </div>
            </div>
          </div>

          {/* 10 Criteria Evaluation Matrix Table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Matriz de Desempeño: 10 Aspectos de Competencia (ISO 19011)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Califique cada ítem de 1 a 5 y registre evidencias u observaciones específicas.
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-slate-600">
                Total: <span className="text-cyan-700 font-extrabold">{totalScore}</span> / {maxScore} pts
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    <th className="py-2.5 px-4 min-w-[320px]">Aspecto a Evaluar</th>
                    <th className="py-2.5 px-4 w-64 text-center">Calificación (1 - 5)</th>
                    <th className="py-2.5 px-4 min-w-[280px]">Comentarios / Evidencia Observada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditorEvaluation.aspects.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 text-center font-bold text-slate-500 font-mono">
                        {item.id}
                      </td>

                      {/* Aspect description */}
                      <td className="py-3 px-4 text-slate-800">
                        {isEditMode ? (
                          <textarea
                            rows={2}
                            value={item.aspect}
                            onChange={(e) => {
                              const newAspect = e.target.value;
                              setAuditorEvaluation((prev) => ({
                                ...prev,
                                aspects: prev.aspects.map((a) =>
                                  a.id === item.id ? { ...a, aspect: newAspect } : a
                                ),
                              }));
                            }}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                          />
                        ) : (
                          <div className="leading-relaxed font-medium">{item.aspect}</div>
                        )}
                      </td>

                      {/* Interactive 1 to 5 Score selector */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center justify-center p-1 bg-slate-100 rounded-lg border border-slate-200 gap-1">
                          {[1, 2, 3, 4, 5].map((val) => {
                            const isSelected = item.score === val;
                            return (
                              <button
                                key={val}
                                type="button"
                                onClick={() => updateAuditorEvaluationAspect(item.id, val as 1 | 2 | 3 | 4 | 5)}
                                className={`w-8 h-7 text-xs font-bold rounded transition cursor-pointer flex items-center justify-center ${
                                  isSelected
                                    ? val >= 4
                                      ? 'bg-emerald-600 text-white shadow-xs scale-105'
                                      : val === 3
                                      ? 'bg-amber-500 text-white shadow-xs scale-105'
                                      : 'bg-rose-600 text-white shadow-xs scale-105'
                                    : 'text-slate-600 hover:bg-slate-200'
                                }`}
                                title={`Asignar ${val} puntos`}
                              >
                                {val}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Comments / Evidence */}
                      <td className="py-3 px-4 text-slate-700">
                        {isEditMode ? (
                          <input
                            type="text"
                            value={item.comments || ''}
                            onChange={(e) => updateAuditorEvaluationAspect(item.id, item.score, e.target.value)}
                            placeholder="Anotar soporte o justificación..."
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-cyan-600"
                          />
                        ) : (
                          <div className="text-slate-600 italic">
                            {item.comments || 'Sin comentarios registrados'}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer with Summary */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-cyan-600" />
                <span>La ponderación final se calcula sumando los 10 aspectos sobre un total de 50 puntos.</span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="font-bold text-slate-700">Puntaje Total:</span>
                <span className="text-lg font-black text-cyan-700">
                  {totalScore} / {maxScore}
                </span>
                <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 font-bold rounded">
                  {percentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Observations and Result Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Observaciones Generales */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                Observaciones Generales del Evaluador:
              </label>
              {isEditMode ? (
                <textarea
                  rows={4}
                  value={auditorEvaluation.observations}
                  onChange={(e) =>
                    setAuditorEvaluation((prev) => ({ ...prev, observations: e.target.value }))
                  }
                  className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed focus:outline-cyan-600"
                  placeholder="Detalle aspectos destacados de la actitud, pericia técnica y cumplimiento..."
                />
              ) : (
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed whitespace-pre-line">
                  {auditorEvaluation.observations}
                </p>
              )}
            </div>

            {/* Análisis del Resultado y Conclusiones */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                Análisis del Resultado y Conclusiones de Competencia:
              </label>
              {isEditMode ? (
                <textarea
                  rows={4}
                  value={auditorEvaluation.resultAnalysis}
                  onChange={(e) =>
                    setAuditorEvaluation((prev) => ({ ...prev, resultAnalysis: e.target.value }))
                  }
                  className="w-full p-2.5 border border-slate-300 rounded text-xs leading-relaxed focus:outline-cyan-600"
                  placeholder="Concepto final sobre idoneidad, asignación a futuros ciclos y necesidades de capacitación..."
                />
              ) : (
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded border border-slate-100 leading-relaxed whitespace-pre-line">
                  {auditorEvaluation.resultAnalysis}
                </p>
              )}
            </div>
          </div>

          {/* Formal Signatures Block con Soporte PNG / Digital */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4 flex items-center justify-between">
              <span>Cierre y Firmas de Validación de la Evaluación (FO-MCO-23)</span>
              {isEditMode && (
                <span className="text-[11px] text-slate-500 font-normal">
                  Puedes subir firmas en formato PNG o trazarlas digitalmente en pantalla
                </span>
              )}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
              {/* Evaluador */}
              <div className="border border-slate-200 rounded-xl p-4 text-center space-y-3 bg-slate-50/70 shadow-2xs">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Auditor Líder Evaluador / Dirección de Calidad
                </div>

                <div className="min-h-16 flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  {auditorEvaluation.evaluatorSignature ? (
                    auditorEvaluation.evaluatorSignature.startsWith('data:image/') ||
                    auditorEvaluation.evaluatorSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={auditorEvaluation.evaluatorSignature}
                          alt="Firma Evaluador"
                          className="max-h-14 max-w-[220px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="font-serif italic text-cyan-900 text-lg font-bold">
                          {auditorEvaluation.evaluatorSignature}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono block">Firma Digital Caligráfica</span>
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma registrada</span>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-2 space-y-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={auditorEvaluation.leadAuditorEvaluator}
                      onChange={(e) =>
                        setAuditorEvaluation((prev) => ({
                          ...prev,
                          leadAuditorEvaluator: e.target.value,
                        }))
                      }
                      className="w-full text-center text-xs font-bold text-slate-800 border border-slate-300 rounded px-1.5 py-1 bg-white focus:outline-cyan-600"
                      placeholder="Nombre del Auditor Evaluador / Revisor"
                    />
                  ) : (
                    <div className="font-bold text-slate-900">{auditorEvaluation.leadAuditorEvaluator}</div>
                  )}
                  <div className="text-slate-500 text-[11px]">Auditor Líder Evaluador / Dirección de Calidad</div>
                  <div className="text-slate-400 text-[10px] font-mono mt-1">
                    Fecha: {auditorEvaluation.evaluatorSignatureDate || auditorEvaluation.date}
                  </div>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Auditor Evaluador (PNG / Digital)',
                        initialName: auditorEvaluation.leadAuditorEvaluator,
                        currentSignature: auditorEvaluation.evaluatorSignature,
                        target: 'evaluator',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{auditorEvaluation.evaluatorSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG o Dibujar'}</span>
                  </button>
                  {auditorEvaluation.evaluatorSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuditorEvaluation((prev) => ({ ...prev, evaluatorSignature: '' }));
                        triggerSaveNotification('Firma de evaluador eliminada');
                      }}
                      className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>

              {/* Evaluado */}
              <div className="border border-slate-200 rounded-xl p-4 text-center space-y-3 bg-slate-50/70 shadow-2xs">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Auditor Interno Evaluado (Constancia de Socialización)
                </div>

                <div className="min-h-16 flex items-center justify-center p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  {auditorEvaluation.evaluatedSignature ? (
                    auditorEvaluation.evaluatedSignature.startsWith('data:image/') ||
                    auditorEvaluation.evaluatedSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={auditorEvaluation.evaluatedSignature}
                          alt="Firma Evaluado"
                          className="max-h-14 max-w-[220px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="font-serif italic text-slate-800 text-lg font-bold">
                          {auditorEvaluation.evaluatedSignature}
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono block">Firma Digital Caligráfica</span>
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma registrada</span>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-2 space-y-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={auditorEvaluation.internalAuditorEvaluated}
                      onChange={(e) =>
                        setAuditorEvaluation((prev) => ({
                          ...prev,
                          internalAuditorEvaluated: e.target.value,
                        }))
                      }
                      className="w-full text-center text-xs font-bold text-slate-800 border border-slate-300 rounded px-1.5 py-1 bg-white focus:outline-cyan-600"
                      placeholder="Nombre del Auditor Evaluado"
                    />
                  ) : (
                    <div className="font-bold text-slate-900">{auditorEvaluation.internalAuditorEvaluated}</div>
                  )}
                  <div className="text-slate-500 text-[11px]">Auditor Interno Evaluado</div>
                  <div className="text-slate-400 text-[10px] font-mono mt-1">
                    Fecha: {auditorEvaluation.evaluatedSignatureDate || auditorEvaluation.date}
                  </div>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Auditor Evaluado (PNG / Digital)',
                        initialName: auditorEvaluation.internalAuditorEvaluated.split('(')[0].trim(),
                        currentSignature: auditorEvaluation.evaluatedSignature,
                        target: 'evaluated',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{auditorEvaluation.evaluatedSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG o Dibujar'}</span>
                  </button>
                  {auditorEvaluation.evaluatedSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuditorEvaluation((prev) => ({ ...prev, evaluatedSignature: '' }));
                        triggerSaveNotification('Firma de evaluado eliminada');
                      }}
                      className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Official Document Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
          <FormatApprovalFooter
            workflow={auditorEvaluation.metadata.approvalWorkflow}
            onUpdate={(newWf) => {
              setAuditorEvaluation((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, approvalWorkflow: newWf },
              }));
              triggerSaveNotification('Firmas de la Evaluación (Elaboró, Revisó, Aprobó) actualizadas');
            }}
          />
        </>
      ) : (
        /* SGC Corporate Formats Repository Directory */
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <FolderOpen className="w-5 h-5 text-cyan-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Directorio Oficial de Formatos FO-MCO (Sistema de Gestión de la Calidad)
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Todos los formatos del ciclo de auditoría interna de Impresos El Día codificados bajo la estructura oficial FO-MCO con control de copias.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allCorporateFormats.map((fmt) => (
                <div
                  key={fmt.code}
                  className={`border rounded-lg p-4 transition text-xs flex flex-col justify-between ${
                    selectedFormatCode === fmt.code
                      ? 'border-cyan-500 bg-cyan-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-cyan-700 bg-cyan-100/70 px-2 py-0.5 rounded text-[11px]">
                        {fmt.code}
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">Ver {fmt.version}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">{fmt.title}</h4>
                    <p className="text-slate-500 text-[11px] mb-2">
                      Aprobación: {fmt.date} · {fmt.page}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">COPIA CONTROLADA</span>
                    <button
                      type="button"
                      onClick={() => setSelectedFormatCode(fmt.code)}
                      className="text-cyan-700 font-semibold hover:text-cyan-900 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Ficha</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Inspector of Selected Format */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-600" />
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  Ficha Técnica del Formato: {selectedFormatCode}
                </h4>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const target = allCorporateFormats.find((f) => f.code === selectedFormatCode);
                    if (target) {
                      triggerSaveNotification(`Navegando a ${target.page}`);
                    }
                  }}
                  className="px-3 py-1 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ir a la Pantalla Oficial</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded border border-slate-200 font-mono text-xs text-slate-700 whitespace-pre-wrap">
              {selectedFormatCode === 'FO-MCO-17' &&
                `CÓDIGO: FO-MCO-17 | PROGRAMA DE AUDITORÍA (Ciclo ${program.cycle} - ${program.year})\n` +
                `Alcance: ${program.scope}\n` +
                `Procesos Programados: ${program.processes.length}\n` +
                `Riesgos Evaluados: ${program.risks.length}`}
              {selectedFormatCode === 'FO-MCO-18' &&
                `CÓDIGO: FO-MCO-18 | PLAN DE AUDITORÍA\n` +
                `Proceso: ${plan.process}\n` +
                `Auditor Líder: ${plan.leadAuditor}\n` +
                `Itinerario: ${plan.itinerary.length} actividades planificadas`}
              {selectedFormatCode === 'FO-MCO-19' &&
                `CÓDIGO: FO-MCO-19 | LISTA DE VERIFICACIÓN (CHEQUEO)\n` +
                `Total Preguntas: ${checklist.length}\n` +
                `Criterios Obligatorios: Normas Legales, Normas Técnicas, Caracterización de Proceso, Formatos`}
              {selectedFormatCode === 'FO-MCO-20' &&
                `CÓDIGO: FO-MCO-20 | ACTA DE APERTURA DE AUDITORÍA\n` +
                `Asistentes Registrados: ${opening.attendees.length}\n` +
                `Orden del Día: 4 puntos interactivos`}
              {selectedFormatCode === 'FO-MCO-21' &&
                `CÓDIGO: FO-MCO-21 | ACTA DE CIERRE DE AUDITORÍA\n` +
                `Área Auditada: ${closing.auditedArea}\n` +
                `Asistentes al Cierre: ${closing.attendees.length}`}
              {selectedFormatCode === 'FO-MCO-22' &&
                `CÓDIGO: FO-MCO-22 | INFORME FINAL DE AUDITORÍA\n` +
                `Fortalezas: ${finalReport.strengths.length}\n` +
                `Oportunidades de Mejora: ${finalReport.opportunitiesForImprovement.length}\n` +
                `No Conformidades Estructuradas (5 partes): ${finalReport.nonConformities.length}`}
              {selectedFormatCode === 'FO-MCO-23' &&
                `CÓDIGO: FO-MCO-23 | EVALUACIÓN DE AUDITORES INTERNOS\n` +
                `Aspectos Evaluados: 10\n` +
                `Puntaje Actual: ${totalScore} / 50 (${percentage}% - ${badge.label})`}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Firma Digital / Subir PNG */}
      {signatureModalConfig.isOpen && (
        <SignatureModal
          isOpen={signatureModalConfig.isOpen}
          onClose={() => setSignatureModalConfig((prev) => ({ ...prev, isOpen: false }))}
          title={signatureModalConfig.title}
          initialSignerName={signatureModalConfig.initialName}
          currentSignature={signatureModalConfig.currentSignature}
          onSaveSignature={handleSaveEvaluationSignature}
        />
      )}
    </div>
  );
};
