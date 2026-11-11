import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  FileCheck2,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldAlert,
  Edit3,
  Lightbulb,
  ThumbsUp,
  FileSpreadsheet,
  FileText,
  UserPlus,
  PenTool,
} from 'lucide-react';
import { NonConformityStrict } from '../types/audit';
import { SignatureModal } from './SignatureModal';

export const Module5ClosingReport: React.FC = () => {
  const {
    closing,
    setClosing,
    finalReport,
    setFinalReport,
    isEditMode,
    addNonConformity,
    deleteNonConformity,
    updateNonConformity,
    addStrength,
    deleteStrength,
    addOpportunity,
    deleteOpportunity,
    addClosingAttendee,
    deleteClosingAttendee,
    toggleClosingAttendeeSignature,
    exportToExcel,
    exportToWord,
    triggerSaveNotification,
  } = useAudit();

  const [activeSubTab, setActiveSubTab] = useState<'final_report' | 'closing_minute'>(
    'final_report'
  );
  const [showNCModal, setShowNCModal] = useState(false);
  const [showStrengthModal, setShowStrengthModal] = useState(false);
  const [showOppModal, setShowOppModal] = useState(false);
  const [showClosingAttendeeModal, setShowClosingAttendeeModal] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [signatureModalConfig, setSignatureModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialName: string;
    currentSignature?: string;
    target: 'finalLead' | 'finalProcessLeader' | 'closingLead' | 'closingProcessLeader' | 'closingAttendee';
    attendeeId?: string;
  }>({
    isOpen: false,
    title: '',
    initialName: '',
    target: 'finalLead',
  });

  const handleSaveSignature = (signatureDataUrl: string, newSignerName?: string) => {
    if (signatureModalConfig.target === 'finalLead') {
      setFinalReport((prev) => {
        const nextAuditors = [...prev.auditors];
        if (newSignerName?.trim()) {
          nextAuditors[0] = newSignerName.trim();
        }
        return {
          ...prev,
          auditors: nextAuditors,
          leadAuditorSignature: signatureDataUrl,
        };
      });
      triggerSaveNotification('Firma de Auditor Líder en Informe Final actualizada');
    } else if (signatureModalConfig.target === 'finalProcessLeader') {
      setFinalReport((prev) => ({
        ...prev,
        processLeaderSignature: signatureDataUrl,
      }));
      triggerSaveNotification('Firma de Líder Auditado en Informe Final actualizada');
    } else if (signatureModalConfig.target === 'closingLead') {
      setClosing((prev) => ({
        ...prev,
        leadAuditorName: newSignerName?.trim() || prev.leadAuditorName || 'Auditor Líder SGC',
        leadAuditorSignature: signatureDataUrl,
      }));
      triggerSaveNotification('Firma de Auditor Líder en Acta de Cierre actualizada');
    } else if (signatureModalConfig.target === 'closingProcessLeader') {
      setClosing((prev) => ({
        ...prev,
        processLeaderSignature: signatureDataUrl,
      }));
      triggerSaveNotification('Firma de Líder Auditado en Acta de Cierre actualizada');
    } else if (signatureModalConfig.target === 'closingAttendee' && signatureModalConfig.attendeeId) {
      setClosing((prev) => ({
        ...prev,
        attendees: prev.attendees.map((att) =>
          att.id === signatureModalConfig.attendeeId
            ? { ...att, signatureImage: signatureDataUrl, signature: true }
            : att
        ),
      }));
      triggerSaveNotification('Firma digital de asistente al cierre actualizada');
    }
  };

  // New NC Form State
  const [ncForm, setNcForm] = useState<{
    process: string;
    whatWasFound: string;
    standardClause: string;
    howItViolates: string;
    consequences: string;
    correctiveActionPlan: string;
    deadlineDays: number;
    responsible: string;
    severity: 'CRÍTICA' | 'MAYOR' | 'MENOR';
  }>({
    process: 'Impresión Offset Litográfica',
    whatWasFound: '',
    standardClause: '',
    howItViolates: '',
    consequences: '',
    correctiveActionPlan: '',
    deadlineDays: 15,
    responsible: 'Coordinador de Impresión Offset',
    severity: 'MAYOR',
  });

  // Strength / Opportunity form states
  const [newStrength, setNewStrength] = useState({ text: '', justification: '' });
  const [newOpp, setNewOpp] = useState({ text: '', affectedRequirement: '' });
  const [newClosingAttendee, setNewClosingAttendee] = useState({ name: '', position: '' });

  // AI Assistant for structuring NC following the 5-point rule
  const handleAiAssistNC = async () => {
    if (!ncForm.whatWasFound.trim()) {
      alert('Por favor ingrese primero qué fue lo que se encontró (el hallazgo) para que la IA estructure los 5 puntos normativos.');
      return;
    }

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/nc-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          finding: ncForm.whatWasFound,
          processName: ncForm.process,
          standard: ncForm.standardClause,
        }),
      });

      const data = await res.json();
      if (data.structuredNC) {
        setNcForm((prev) => ({
          ...prev,
          standardClause: data.structuredNC.standardClause || prev.standardClause,
          howItViolates: data.structuredNC.howItViolates || prev.howItViolates,
          consequences: data.structuredNC.consequences || prev.consequences,
          correctiveActionPlan: data.structuredNC.correctiveActionPlan || prev.correctiveActionPlan,
          deadlineDays: data.structuredNC.deadlineDays || prev.deadlineDays,
          responsible: data.structuredNC.responsible || prev.responsible,
        }));
      }
    } catch (e) {
      console.error('Error generating AI NC assistance', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveNC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncForm.whatWasFound.trim() || !ncForm.standardClause.trim()) return;

    addNonConformity({
      process: ncForm.process,
      whatWasFound: ncForm.whatWasFound.trim(),
      standardClause: ncForm.standardClause.trim(),
      howItViolates: ncForm.howItViolates.trim(),
      consequences: ncForm.consequences.trim(),
      correctiveActionPlan: ncForm.correctiveActionPlan.trim(),
      deadlineDays: Number(ncForm.deadlineDays),
      responsible: ncForm.responsible.trim(),
      severity: ncForm.severity,
      isApproved: true,
    });

    setNcForm({
      process: 'Impresión Offset Litográfica',
      whatWasFound: '',
      standardClause: '',
      howItViolates: '',
      consequences: '',
      correctiveActionPlan: '',
      deadlineDays: 15,
      responsible: 'Coordinador de Impresión Offset',
      severity: 'MAYOR',
    });
    setShowNCModal(false);
  };

  const getSeverityBadge = (severity: 'CRÍTICA' | 'MAYOR' | 'MENOR') => {
    switch (severity) {
      case 'CRÍTICA':
        return (
          <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Crítica / Riesgo Alto
          </span>
        );
      case 'MAYOR':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Mayor / Desviación Grave
          </span>
        );
      case 'MENOR':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2 py-0.5 rounded text-[10px]">
            Menor / Aislado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Subtab switcher between FO-MCO-22 and FO-MCO-21 */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('final_report')}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-md transition cursor-pointer ${
              activeSubTab === 'final_report'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Informe Final de Auditoría (FO-MCO-22)
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('closing_minute')}
            className={`py-1.5 px-3.5 text-xs font-bold rounded-md transition cursor-pointer ${
              activeSubTab === 'closing_minute'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Acta de Cierre de Auditoría (FO-MCO-21)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => exportToWord(activeSubTab === 'final_report' ? 'FO-MCO-22' : 'FO-MCO-21')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium transition cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Exportar a Word</span>
          </button>
          <button
            onClick={() => exportToExcel(activeSubTab === 'final_report' ? 'FO-MCO-22' : 'FO-MCO-21')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar a Excel</span>
          </button>
        </div>
      </div>

      {/* ===================== VIEW: INFORME FINAL (FO-MCO-22) ===================== */}
      {activeSubTab === 'final_report' && (
        <div className="space-y-6">
          <FormatHeader
            metadata={finalReport.metadata}
            title="INFORME FINAL DE AUDITORÍA INTERNA DE CALIDAD"
            formatKey="FO-MCO-22"
            pageNumber="Página 1 de 3"
          />

          {/* General Report Header Information */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-slate-600 font-bold block mb-1">FECHA Y HORA:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={finalReport.date}
                    onChange={(e) => setFinalReport((r) => ({ ...r, date: e.target.value }))}
                    className="w-full p-1.5 border border-slate-300 rounded text-slate-900 font-bold"
                  />
                ) : (
                  <span className="font-bold text-slate-900">{finalReport.date} ({finalReport.time})</span>
                )}
              </div>

              <div>
                <span className="text-slate-600 font-bold block mb-1">PROCESO AUDITADO:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={finalReport.auditedProcess}
                    onChange={(e) => setFinalReport((r) => ({ ...r, auditedProcess: e.target.value }))}
                    className="w-full p-1.5 border border-slate-300 rounded text-slate-900 font-bold"
                  />
                ) : (
                  <span className="font-bold text-slate-900">{finalReport.auditedProcess}</span>
                )}
              </div>

              <div className="lg:col-span-2">
                <span className="text-slate-600 font-bold block mb-1">CRITERIOS NORMATIVOS:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={finalReport.criteria}
                    onChange={(e) => setFinalReport((r) => ({ ...r, criteria: e.target.value }))}
                    className="w-full p-1.5 border border-slate-300 rounded text-slate-800"
                  />
                ) : (
                  <span className="text-slate-700">{finalReport.criteria}</span>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-600 font-bold block mb-1">EQUIPO AUDITOR:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={finalReport.auditors.join(', ')}
                    onChange={(e) =>
                      setFinalReport((r) => ({
                        ...r,
                        auditors: e.target.value.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
                      }))
                    }
                    className="w-full p-1.5 border border-slate-300 rounded text-slate-800"
                    placeholder="Separados por coma..."
                  />
                ) : (
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {finalReport.auditors.map((aud, i) => (
                      <li key={i}>{aud}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <span className="text-slate-600 font-bold block mb-1">PERSONAL ENTREVISTADO Y RESPONSABLES:</span>
                {isEditMode ? (
                  <input
                    type="text"
                    value={finalReport.auditees.join(', ')}
                    onChange={(e) =>
                      setFinalReport((r) => ({
                        ...r,
                        auditees: e.target.value.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
                      }))
                    }
                    className="w-full p-1.5 border border-slate-300 rounded text-slate-800"
                    placeholder="Separados por coma..."
                  />
                ) : (
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {finalReport.auditees.map((aud, i) => (
                      <li key={i}>{aud}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Consolidated Findings Table (Hallazgos OBS vs NC) */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Tabla Consolidada de Hallazgos
                </h3>
                <p className="text-xs text-slate-500">
                  Clasificación formal entre Observaciones (OBS) y No Conformidades (NC).
                </p>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowNCModal(true)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Nueva No Conformidad</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4 w-1/2">HALLAZGO IDENTIFICADO</th>
                    <th className="py-2.5 px-2 text-center w-16">OBS</th>
                    <th className="py-2.5 px-2 text-center w-16">NC</th>
                    <th className="py-2.5 px-4">REQUISITO INCUMPLIDO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {finalReport.findings.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-medium text-slate-900">{f.finding}</td>
                      <td className="py-3 px-2 text-center font-bold font-mono">
                        {f.classification === 'OBS' ? (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                            X
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-bold font-mono">
                        {f.classification === 'NC' ? (
                          <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                            X
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {f.requirementBreached}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Fortalezas (Aspectos Favorables) & Oportunidades de Mejora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fortalezas */}
            <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Aspectos Favorables (Fortalezas)
                  </h3>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setShowStrengthModal(true)}
                    className="p-1 text-slate-600 hover:text-slate-900 bg-slate-100 rounded"
                    title="Agregar fortaleza"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="space-y-3 text-xs">
                {finalReport.strengths.map((str) => (
                  <div key={str.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg relative">
                    <div className="font-bold text-emerald-950 text-xs mb-1">{str.text}</div>
                    <div className="text-slate-600 text-[11px] leading-relaxed">
                      <span className="font-semibold text-emerald-800">Justificación del Auditor: </span>
                      {str.justification}
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => deleteStrength(str.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Oportunidades de Mejora */}
            <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Oportunidades de Mejora
                  </h3>
                </div>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setShowOppModal(true)}
                    className="p-1 text-slate-600 hover:text-slate-900 bg-slate-100 rounded"
                    title="Agregar oportunidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="space-y-3 text-xs">
                {finalReport.opportunitiesForImprovement.map((opp) => (
                  <div key={opp.id} className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg relative">
                    <div className="font-bold text-amber-950 text-xs mb-1">{opp.text}</div>
                    <div className="text-slate-600 text-[11px]">
                      <span className="font-semibold text-amber-800">Requisito que Afecta: </span>
                      <span className="font-mono">{opp.affectedRequirement}</span>
                    </div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => deleteOpportunity(opp.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generador y Editor Estructurado de No Conformidades (5 Campos Clave) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                  <span>Estructura Estricta de No Conformidades (5 Campos Clave SGC)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Hallazgo objetivo, norma recaída, análisis de desviación, riesgo potencial y plan de acción de solución.
                </p>
              </div>

              {isEditMode && (
                <button
                  onClick={() => setShowNCModal(true)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar No Conformidad</span>
                </button>
              )}
            </div>

            {finalReport.nonConformities.map((nc) => (
              <div
                key={nc.id}
                className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden text-xs"
              >
                {/* Header of NC card */}
                <div className="bg-slate-900 text-white p-3 px-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-sm text-cyan-300">{nc.codeNC}</span>
                    <span className="font-bold text-slate-100">{nc.process}</span>
                    <div>{getSeverityBadge(nc.severity)}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-300">
                      Plazo: <strong className="text-amber-300">{nc.deadlineDays} días hábiles</strong>
                    </span>
                    {isEditMode && (
                      <button
                        onClick={() => deleteNonConformity(nc.id)}
                        type="button"
                        className="text-slate-400 hover:text-rose-400 transition cursor-pointer p-1"
                        title="Eliminar esta NC"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 5 Required Pillars in Grid */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {/* Left Column: Finding, Standard, and Deviation */}
                  <div className="space-y-3 pr-0 md:pr-4">
                    {/* 1. What was found */}
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-mono">
                          1
                        </span>
                        <span>1. Descripción del Hallazgo (¿Qué se encontró?)</span>
                      </div>
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={nc.whatWasFound}
                          onChange={(e) => updateNonConformity(nc.id, { whatWasFound: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded text-slate-800 leading-relaxed text-xs"
                        />
                      ) : (
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                          {nc.whatWasFound}
                        </p>
                      )}
                    </div>

                    {/* 2. Standard Clause */}
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-mono">
                          2
                        </span>
                        <span>2. Requisito / Norma Incumplida (¿Qué norma recae?)</span>
                      </div>
                      {isEditMode ? (
                        <input
                          type="text"
                          value={nc.standardClause}
                          onChange={(e) => updateNonConformity(nc.id, { standardClause: e.target.value })}
                          className="w-full p-1.5 border border-slate-300 rounded font-mono font-semibold text-cyan-900 text-xs"
                        />
                      ) : (
                        <div className="text-cyan-900 bg-cyan-50/70 p-2 rounded border border-cyan-200 font-mono font-semibold">
                          {nc.standardClause}
                        </div>
                      )}
                    </div>

                    {/* 3. How it violates */}
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[10px] flex items-center justify-center font-mono">
                          3
                        </span>
                        <span>3. Análisis de Desviación (¿Cómo se viola dicha norma?)</span>
                      </div>
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={nc.howItViolates}
                          onChange={(e) => updateNonConformity(nc.id, { howItViolates: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded text-slate-800 leading-relaxed text-xs"
                        />
                      ) : (
                        <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                          {nc.howItViolates}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Consequences and Action Plan */}
                  <div className="space-y-3 pt-3 md:pt-0 md:pl-4">
                    {/* 4. Consequences and Risks */}
                    <div>
                      <div className="font-bold text-rose-900 flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-rose-700 text-white text-[10px] flex items-center justify-center font-mono">
                          4
                        </span>
                        <span>4. Evaluación del Riesgo / Consecuencias Potenciales</span>
                      </div>
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={nc.consequences}
                          onChange={(e) => updateNonConformity(nc.id, { consequences: e.target.value })}
                          className="w-full p-2 border border-rose-300 rounded text-rose-900 leading-relaxed text-xs"
                        />
                      ) : (
                        <p className="text-rose-900 bg-rose-50/70 p-2.5 rounded border border-rose-200 leading-relaxed">
                          {nc.consequences}
                        </p>
                      )}
                    </div>

                    {/* 5. Corrective Action Plan, Deadlines & Responsible */}
                    <div>
                      <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                        <span className="w-4 h-4 rounded-full bg-emerald-700 text-white text-[10px] flex items-center justify-center font-mono">
                          5
                        </span>
                        <span>5. Plan de Acción Inicial / Compromisos (Solución, Plazos y Responsables)</span>
                      </div>
                      <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-200 space-y-2">
                        {isEditMode ? (
                          <textarea
                            rows={3}
                            value={nc.correctiveActionPlan}
                            onChange={(e) => updateNonConformity(nc.id, { correctiveActionPlan: e.target.value })}
                            className="w-full p-2 border border-emerald-300 rounded text-slate-800 leading-relaxed text-xs bg-white"
                          />
                        ) : (
                          <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                            {nc.correctiveActionPlan}
                          </p>
                        )}
                        <div className="pt-2 border-t border-emerald-200 flex flex-wrap justify-between items-center text-[11px]">
                          <span className="text-slate-600">
                            Responsable: <strong className="text-slate-900">{nc.responsible}</strong>
                          </span>
                          <span className="font-bold text-emerald-800">
                            Plazo: {nc.deadlineDays} días hábiles
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conclusiones del Equipo Auditor */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-2">
              Conclusiones Finales del Equipo Auditor
            </h4>
            {isEditMode ? (
              <textarea
                rows={3}
                value={finalReport.conclusions.join('\n')}
                onChange={(e) =>
                  setFinalReport((r) => ({
                    ...r,
                    conclusions: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  }))
                }
                className="w-full p-2 border border-slate-300 rounded text-slate-800 leading-relaxed text-xs"
                placeholder="Una conclusión por línea..."
              />
            ) : (
              <ul className="list-disc pl-5 space-y-1 text-slate-700 leading-relaxed">
                {finalReport.conclusions.map((conc, i) => (
                  <li key={i}>{conc}</li>
                ))}
              </ul>
            )}

            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Líder Auditor */}
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Líder del Equipo Auditor
                </div>

                <div className="min-h-14 flex items-center justify-center p-2 bg-white rounded border border-slate-200">
                  {finalReport.leadAuditorSignature ? (
                    finalReport.leadAuditorSignature.startsWith('data:image/') ||
                    finalReport.leadAuditorSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={finalReport.leadAuditorSignature}
                          alt="Firma Auditor Líder"
                          className="max-h-12 max-w-[200px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="font-serif italic font-bold text-slate-900 text-base">
                        {finalReport.leadAuditorSignature}
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma</span>
                  )}
                </div>

                <div className="space-y-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={finalReport.auditors[0] || 'Auditor Líder SGC'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFinalReport((prev) => {
                          const nextAuditors = [...prev.auditors];
                          nextAuditors[0] = val;
                          return { ...prev, auditors: nextAuditors };
                        });
                      }}
                      className="w-full text-center text-xs font-bold text-slate-800 border border-slate-300 rounded px-1.5 py-1 bg-white focus:outline-cyan-600"
                      placeholder="Nombre del Auditor Líder / Revisor"
                    />
                  ) : (
                    <div className="text-[11px] font-bold text-slate-800">
                      {finalReport.auditors[0] || 'Auditor Líder SGC'}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500">Auditor Líder Certificado SGC</div>
                </div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Auditor Líder - Informe Final (FO-MCO-22)',
                        initialName: finalReport.auditors[0] || 'Auditor Líder SGC',
                        currentSignature: finalReport.leadAuditorSignature,
                        target: 'finalLead',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3 h-3 text-cyan-400" />
                    <span>{finalReport.leadAuditorSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG'}</span>
                  </button>
                  {finalReport.leadAuditorSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setFinalReport((prev) => ({ ...prev, leadAuditorSignature: '' }));
                        triggerSaveNotification('Firma de Auditor Líder eliminada');
                      }}
                      className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>

              {/* Líder Auditado */}
              <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Líder del Proceso Auditado
                </div>

                <div className="min-h-14 flex items-center justify-center p-2 bg-white rounded border border-slate-200">
                  {finalReport.processLeaderSignature ? (
                    finalReport.processLeaderSignature.startsWith('data:image/') ||
                    finalReport.processLeaderSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={finalReport.processLeaderSignature}
                          alt="Firma Líder Auditado"
                          className="max-h-12 max-w-[200px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="font-serif italic font-bold text-slate-900 text-base">
                        {finalReport.processLeaderSignature}
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma</span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-800">Jorge E. Ramírez</div>
                <div className="text-[10px] text-slate-500">Coordinador de Impresión Offset</div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Líder Auditado - Informe Final (FO-MCO-22)',
                        initialName: 'Jorge E. Ramírez',
                        currentSignature: finalReport.processLeaderSignature,
                        target: 'finalProcessLeader',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3 h-3 text-cyan-400" />
                    <span>{finalReport.processLeaderSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG'}</span>
                  </button>
                  {finalReport.processLeaderSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setFinalReport((prev) => ({ ...prev, processLeaderSignature: '' }));
                        triggerSaveNotification('Firma de Líder Auditado eliminada');
                      }}
                      className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Official Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
          <FormatApprovalFooter
            workflow={finalReport.metadata.approvalWorkflow}
            onUpdate={(newWf) => {
              setFinalReport((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, approvalWorkflow: newWf },
              }));
              triggerSaveNotification('Firmas del Informe Final (Elaboró, Revisó, Aprobó) actualizadas');
            }}
          />
        </div>
      )}

      {/* ===================== VIEW: ACTA DE CIERRE (FO-MCO-21) ===================== */}
      {activeSubTab === 'closing_minute' && (
        <div className="space-y-6">
          <FormatHeader
            metadata={closing.metadata}
            title="ACTA DE CIERRE DE AUDITORÍA INTERNA DE CALIDAD"
            formatKey="FO-MCO-21"
            pageNumber="Página 1 de 2"
          />

          {/* Identificación de la Reunión */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1">FECHA</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={closing.date}
                    onChange={(e) => setClosing((c) => ({ ...c, date: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{closing.date}</div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">HORA DE CIERRE</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={closing.time}
                    onChange={(e) => setClosing((c) => ({ ...c, time: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{closing.time}</div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">LUGAR</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={closing.location}
                    onChange={(e) => setClosing((c) => ({ ...c, location: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800">{closing.location}</div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">ÁREA / PROCESO AUDITADO</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={closing.auditedArea}
                    onChange={(e) => setClosing((c) => ({ ...c, auditedArea: e.target.value }))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{closing.auditedArea}</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-slate-800 uppercase block mb-1">Objetivo del Cierre</span>
                {isEditMode ? (
                  <textarea
                    rows={2}
                    value={closing.objective}
                    onChange={(e) => setClosing((c) => ({ ...c, objective: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{closing.objective}</p>
                )}
              </div>
              <div>
                <span className="font-bold text-slate-800 uppercase block mb-1">Alcance Concluido</span>
                {isEditMode ? (
                  <textarea
                    rows={2}
                    value={closing.scope}
                    onChange={(e) => setClosing((c) => ({ ...c, scope: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded text-slate-800"
                  />
                ) : (
                  <p className="text-slate-700 leading-relaxed">{closing.scope}</p>
                )}
              </div>
            </div>
          </div>

          {/* Orden del Día de Cierre (FO-MCO-21) */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5 text-xs space-y-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wide text-sm">
              Orden del Día de la Reunión de Cierre (FO-MCO-21)
            </h3>

            {/* Point 1 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs mb-1">
                1. Presentación de Hallazgos y Conclusiones de la Auditoría
              </div>
              <p className="text-slate-600 leading-relaxed">
                Socialización completa de las 3 fortalezas operacionales y las 3 No Conformidades identificadas en visto bueno, densitometría y almacenamiento de residuos peligrosos.
              </p>
            </div>

            {/* Point 2 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs mb-1">
                2. Determinar el Tiempo para que el Auditado Presente el Plan de Acciones Correctivas
              </div>
              {isEditMode ? (
                <div className="flex items-center gap-2 mt-1">
                  <span>Plazo acordado en días hábiles:</span>
                  <input
                    type="number"
                    value={closing.orderOfDay.agreementTimeframeDays}
                    onChange={(e) =>
                      setClosing((c) => ({
                        ...c,
                        orderOfDay: { ...c.orderOfDay, agreementTimeframeDays: Number(e.target.value) },
                      }))
                    }
                    className="w-20 px-2 py-1 border border-slate-300 rounded font-bold"
                  />
                  <span>días hábiles.</span>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed">
                  Se establece un plazo formal de{' '}
                  <strong className="text-slate-900 font-bold">
                    {closing.orderOfDay.agreementTimeframeDays} días hábiles
                  </strong>{' '}
                  para la entrega del Plan de Acción Correctivo (PAC) con causas raíz.
                </p>
              )}
            </div>

            {/* Point 3 */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="font-bold text-slate-900 text-xs mb-1">
                3. Responsable del Plan de Acciones Preventivas y Correctivas
              </div>
              {isEditMode ? (
                <div className="mt-1">
                  <input
                    type="text"
                    value={closing.orderOfDay.planResponsibleName}
                    onChange={(e) =>
                      setClosing((c) => ({
                        ...c,
                        orderOfDay: { ...c.orderOfDay, planResponsibleName: e.target.value },
                      }))
                    }
                    className="w-full px-2 py-1 border border-slate-300 rounded font-bold"
                  />
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed">
                  Responsable designado:{' '}
                  <strong className="text-slate-900 font-bold">
                    {closing.orderOfDay.planResponsibleName}
                  </strong>.
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Observaciones Finales de Cierre</label>
              {isEditMode ? (
                <textarea
                  rows={2}
                  value={closing.observations}
                  onChange={(e) => setClosing((c) => ({ ...c, observations: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white"
                />
              ) : (
                <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                  {closing.observations}
                </p>
              )}
            </div>
          </div>

          {/* Asistentes al Cierre */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Asistentes a la Reunión de Cierre
              </h3>
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowClosingAttendeeModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-xs rounded hover:bg-slate-800 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Añadir Asistente</span>
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300">
                  <tr>
                    <th className="py-2.5 px-4">NOMBRE COMPLETO</th>
                    <th className="py-2.5 px-4">CARGO</th>
                    <th className="py-2.5 px-4 text-center">FIRMA DIGITAL</th>
                    <th className="py-2.5 px-4">FECHA Y HORA</th>
                    {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {closing.attendees.map((att) => (
                    <tr key={att.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-4 font-bold text-slate-900">{att.name}</td>
                      <td className="py-3 px-4 text-slate-600">{att.position}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {att.signatureImage ? (
                            <div className="space-y-0.5">
                              <img
                                src={att.signatureImage}
                                alt={`Firma ${att.name}`}
                                className="h-8 max-w-[110px] object-contain bg-white rounded border border-slate-200 p-0.5"
                              />
                              <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ PNG Verificada</span>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleClosingAttendeeSignature(att.id)}
                              className={`px-3 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                                att.signature
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {att.signature ? '✓ Aceptado Digitalmente' : 'Pendiente'}
                            </button>
                          )}

                          {isEditMode && (
                            <button
                              type="button"
                              onClick={() =>
                                setSignatureModalConfig({
                                  isOpen: true,
                                  title: `Firma Digital de ${att.name}`,
                                  initialName: att.name,
                                  currentSignature: att.signatureImage,
                                  target: 'closingAttendee',
                                  attendeeId: att.id,
                                })
                              }
                              className="flex items-center gap-1 text-[10px] text-cyan-700 hover:text-cyan-900 font-semibold cursor-pointer underline"
                              title="Subir PNG o Dibujar Firma"
                            >
                              <PenTool className="w-3 h-3" />
                              <span>{att.signatureImage ? 'Cambiar PNG' : 'Subir PNG / Dibujar'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                        {att.signatureDate || '—'}
                      </td>
                      {isEditMode && (
                        <td className="py-3 px-2 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => deleteClosingAttendee(att.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Firmas de Refrendación del Acta de Cierre (FO-MCO-21) */}
          <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center justify-between">
              <span>Firmas de Refrendación del Acta de Cierre (FO-MCO-21)</span>
              {isEditMode && (
                <span className="text-[11px] text-slate-500 font-normal">
                  Puedes firmar digitalmente o subir firma en formato PNG
                </span>
              )}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Líder del Equipo Auditor */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Líder del Equipo Auditor
                </div>

                <div className="min-h-14 flex items-center justify-center p-2 bg-white rounded border border-slate-200">
                  {closing.leadAuditorSignature ? (
                    closing.leadAuditorSignature.startsWith('data:image/') ||
                    closing.leadAuditorSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={closing.leadAuditorSignature}
                          alt="Firma Auditor Líder"
                          className="max-h-12 max-w-[200px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="font-serif italic font-bold text-slate-900 text-base">
                        {closing.leadAuditorSignature}
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma</span>
                  )}
                </div>

                <div className="space-y-1">
                  {isEditMode ? (
                    <input
                      type="text"
                      value={closing.leadAuditorName || 'Auditor Líder SGC'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setClosing((prev) => ({
                          ...prev,
                          leadAuditorName: val,
                        }));
                      }}
                      className="w-full text-center text-xs font-bold text-slate-800 border border-slate-300 rounded px-1.5 py-1 bg-white focus:outline-cyan-600"
                      placeholder="Nombre del Auditor Líder / Revisor"
                    />
                  ) : (
                    <div className="text-[11px] font-bold text-slate-800">
                      {closing.leadAuditorName || 'Auditor Líder SGC'}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500">Auditor Líder Certificado SGC</div>
                </div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Auditor Líder - Acta de Cierre (FO-MCO-21)',
                        initialName: closing.leadAuditorName || 'Auditor Líder SGC',
                        currentSignature: closing.leadAuditorSignature,
                        target: 'closingLead',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3 h-3 text-cyan-400" />
                    <span>{closing.leadAuditorSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG o Dibujar'}</span>
                  </button>
                  {closing.leadAuditorSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setClosing((prev) => ({ ...prev, leadAuditorSignature: '' }));
                        triggerSaveNotification('Firma de Auditor Líder eliminada');
                      }}
                      className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>

              {/* Líder del Proceso Auditado */}
              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-2">
                <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
                  Líder del Proceso Auditado
                </div>

                <div className="min-h-14 flex items-center justify-center p-2 bg-white rounded border border-slate-200">
                  {closing.processLeaderSignature ? (
                    closing.processLeaderSignature.startsWith('data:image/') ||
                    closing.processLeaderSignature.endsWith('.png') ? (
                      <div className="space-y-1">
                        <img
                          src={closing.processLeaderSignature}
                          alt="Firma Líder Auditado"
                          className="max-h-12 max-w-[200px] object-contain mx-auto"
                        />
                        <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                      </div>
                    ) : (
                      <div className="font-serif italic font-bold text-slate-900 text-base">
                        {closing.processLeaderSignature}
                      </div>
                    )
                  ) : (
                    <span className="text-slate-400 italic text-xs">Sin firma</span>
                  )}
                </div>

                <div className="text-[11px] font-bold text-slate-800">Jorge E. Ramírez</div>
                <div className="text-[10px] text-slate-500">Coordinador de Impresión Offset</div>

                <div className="flex gap-1.5 mt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSignatureModalConfig({
                        isOpen: true,
                        title: 'Firma de Líder Auditado - Acta de Cierre (FO-MCO-21)',
                        initialName: 'Jorge E. Ramírez',
                        currentSignature: closing.processLeaderSignature,
                        target: 'closingProcessLeader',
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                  >
                    <PenTool className="w-3 h-3 text-cyan-400" />
                    <span>{closing.processLeaderSignature ? 'Cambiar Firma PNG' : 'Subir Firma PNG o Dibujar'}</span>
                  </button>
                  {closing.processLeaderSignature && (
                    <button
                      type="button"
                      onClick={() => {
                        setClosing((prev) => ({ ...prev, processLeaderSignature: '' }));
                        triggerSaveNotification('Firma de Líder Auditado eliminada');
                      }}
                      className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded text-xs font-semibold cursor-pointer transition"
                      title="Borrar firma"
                    >
                      Borrar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Official Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
          <FormatApprovalFooter
            workflow={closing.metadata.approvalWorkflow}
            onUpdate={(newWf) => {
              setClosing((prev) => ({
                ...prev,
                metadata: { ...prev.metadata, approvalWorkflow: newWf },
              }));
              triggerSaveNotification('Firmas del Acta de Cierre (Elaboró, Revisó, Aprobó) actualizadas');
            }}
          />
        </div>
      )}

      {/* Modal for adding/structuring a Non-Conformity strictly following the 5 points */}
      {showNCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 text-slate-800 my-8 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <span>Registro Estricto de No Conformidad (5 Campos SGC)</span>
              </h3>
              <button
                onClick={() => setShowNCModal(false)}
                type="button"
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* AI Assistant Banner */}
            <div className="p-3 bg-gradient-to-r from-cyan-900 to-slate-900 text-white rounded-lg flex items-center justify-between gap-3 mb-4 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Asistente IA SGC:</strong> Escribe tu hallazgo y haz clic para estructurar los 5 puntos con normas ISO 9001 / litográficas.
                </span>
              </div>
              <button
                type="button"
                onClick={handleAiAssistNC}
                disabled={isAiLoading}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded shrink-0 transition disabled:opacity-50 cursor-pointer"
              >
                {isAiLoading ? 'Analizando...' : 'Auto-estructurar con IA'}
              </button>
            </div>

            <form onSubmit={handleSaveNC} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Proceso Litográfico</label>
                  <input
                    type="text"
                    required
                    value={ncForm.process}
                    onChange={(e) => setNcForm({ ...ncForm, process: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Criticidad / Severidad</label>
                  <select
                    value={ncForm.severity}
                    onChange={(e) =>
                      setNcForm({ ...ncForm, severity: e.target.value as 'CRÍTICA' | 'MAYOR' | 'MENOR' })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="CRÍTICA">Crítica (Riesgo legal, ambiental o pérdida de cliente)</option>
                    <option value="MAYOR">Mayor (Falla de procedimiento o calibración)</option>
                    <option value="MENOR">Menor (Incumplimiento puntual subsanable)</option>
                  </select>
                </div>
              </div>

              {/* 1. What was found */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  1. Descripción del Hallazgo (¿Qué se encontró?) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detalle exactamente lo observado, número de OP, máquina o pliegos..."
                  value={ncForm.whatWasFound}
                  onChange={(e) => setNcForm({ ...ncForm, whatWasFound: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600 leading-relaxed"
                />
              </div>

              {/* 2. Standard Clause */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  2. Requisito / Norma Incumplida (¿Qué norma recae?) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. ISO 9001:2015 Numeral 8.5.1 / ISO 12647-2 / Res. 1362 de 2007"
                  value={ncForm.standardClause}
                  onChange={(e) => setNcForm({ ...ncForm, standardClause: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              {/* 3. How it violates */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  3. Análisis de Desviación (¿Cómo se viola dicha norma?) *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explique por qué el hecho incumple la disposición normativa..."
                  value={ncForm.howItViolates}
                  onChange={(e) => setNcForm({ ...ncForm, howItViolates: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600 leading-relaxed"
                />
              </div>

              {/* 4. Consequences */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  4. Evaluación del Riesgo / Consecuencias Potenciales *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Sobrecostos de papel, pérdida de clientes por color incorrecto, sanciones ambientales..."
                  value={ncForm.consequences}
                  onChange={(e) => setNcForm({ ...ncForm, consequences: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600 leading-relaxed"
                />
              </div>

              {/* 5. Corrective Action Plan */}
              <div>
                <label className="block font-bold text-slate-900 mb-1">
                  5. Plan de Acción Inicial / Compromisos (Solución, Plazos y Responsables) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="1. Acción inmediata&#10;2. Análisis de causa raíz&#10;3. Acción correctiva definitiva"
                  value={ncForm.correctiveActionPlan}
                  onChange={(e) => setNcForm({ ...ncForm, correctiveActionPlan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Plazo de Solución (Días Hábiles)</label>
                  <input
                    type="number"
                    value={ncForm.deadlineDays}
                    onChange={(e) => setNcForm({ ...ncForm, deadlineDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Responsable del Plan</label>
                  <input
                    type="text"
                    value={ncForm.responsible}
                    onChange={(e) => setNcForm({ ...ncForm, responsible: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNCModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded cursor-pointer shadow-xs"
                >
                  Guardar No Conformidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding strength */}
      {showStrengthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 text-slate-800 animate-in fade-in text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-emerald-600" />
              <span>Registrar Aspecto Favorable (Fortaleza)</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Fortaleza Encontrada</label>
              <textarea
                rows={2}
                value={newStrength.text}
                onChange={(e) => setNewStrength({ ...newStrength, text: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
                placeholder="Ej. Riguroso control de humectación en prensas..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Justificación del Auditor</label>
              <textarea
                rows={2}
                value={newStrength.justification}
                onChange={(e) => setNewStrength({ ...newStrength, justification: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
                placeholder="Explicación de por qué se considera una situación positiva..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowStrengthModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newStrength.text.trim()) {
                    addStrength(newStrength.text.trim(), newStrength.justification.trim());
                    setNewStrength({ text: '', justification: '' });
                    setShowStrengthModal(false);
                  }
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding opportunity */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 text-slate-800 animate-in fade-in text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Registrar Oportunidad de Mejora</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Oportunidad de Mejora (Planteada en positivo)</label>
              <textarea
                rows={2}
                value={newOpp.text}
                onChange={(e) => setNewOpp({ ...newOpp, text: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
                placeholder="Ej. Estandarizar la marcación digital de tarimas..."
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Requisito o Norma que Afecta</label>
              <input
                type="text"
                value={newOpp.affectedRequirement}
                onChange={(e) => setNewOpp({ ...newOpp, affectedRequirement: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded font-mono"
                placeholder="ISO 9001:2015 Numeral 8.5.2"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowOppModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newOpp.text.trim()) {
                    addOpportunity(newOpp.text.trim(), newOpp.affectedRequirement.trim());
                    setNewOpp({ text: '', affectedRequirement: '' });
                    setShowOppModal(false);
                  }
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding closing attendee */}
      {showClosingAttendeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 text-slate-800 animate-in fade-in text-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-cyan-600" />
              <span>Añadir Asistente a la Reunión de Cierre</span>
            </h3>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={newClosingAttendee.name}
                onChange={(e) => setNewClosingAttendee({ ...newClosingAttendee, name: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
                placeholder="Ej. Dr. Fernando Salazar"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Cargo</label>
              <input
                type="text"
                value={newClosingAttendee.position}
                onChange={(e) => setNewClosingAttendee({ ...newClosingAttendee, position: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded"
                placeholder="Ej. Gerente General"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowClosingAttendeeModal(false)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newClosingAttendee.name.trim()) {
                    addClosingAttendee({
                      name: newClosingAttendee.name.trim(),
                      position: newClosingAttendee.position.trim(),
                      signature: true,
                      signatureDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
                    });
                    setNewClosingAttendee({ name: '', position: '' });
                    setShowClosingAttendeeModal(false);
                  }
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
              >
                Guardar
              </button>
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
          onSaveSignature={handleSaveSignature}
        />
      )}
    </div>
  );
};
