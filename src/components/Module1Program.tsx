import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  Edit2,
  Check,
  X,
  FileSpreadsheet,
  PenTool,
} from 'lucide-react';
import { AuditRisk, ScheduledProcess } from '../types/audit';
import { SignatureModal } from './SignatureModal';

export const Module1Program: React.FC = () => {
  const {
    program,
    setProgram,
    isEditMode,
    addAuditRisk,
    updateAuditRisk,
    deleteAuditRisk,
    addScheduledProcess,
    updateScheduledProcess,
    deleteScheduledProcess,
    addAuditTeamMember,
    deleteAuditTeamMember,
    exportToExcel,
    triggerSaveNotification,
  } = useAudit();

  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState('');

  // New Risk form state
  const [newRisk, setNewRisk] = useState({
    risk: '',
    frequency: 1,
    severity: 10,
    consequences: '',
    controls: '',
  });

  // New Scheduled Process form state
  const [newProcess, setNewProcess] = useState<Omit<ScheduledProcess, 'id'>>({
    auditNumber: `AUD-0${program.processes.length + 1}`,
    process: '',
    standardClause: 'ISO 9001:2015',
    scheduledDate: program.startDate || '2026-03-16',
    scheduledTime: '08:00 - 10:00',
    executedDate: '',
    executedTime: '',
    leadAuditor: program.leadAuditor,
    assistantAuditor: 'Equipo Auditor',
    status: 'PROGRAMADA',
  });

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRisk.risk.trim()) return;

    addAuditRisk({
      risk: newRisk.risk.trim(),
      frequency: Number(newRisk.frequency),
      severity: Number(newRisk.severity),
      consequences: newRisk.consequences.split('\n').filter((c) => c.trim().length > 0),
      controls: newRisk.controls.split('\n').filter((c) => c.trim().length > 0),
    });

    setNewRisk({ risk: '', frequency: 1, severity: 10, consequences: '', controls: '' });
    setShowRiskModal(false);
  };

  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcess.process.trim()) return;

    addScheduledProcess(newProcess);
    setShowProcessModal(false);
    setNewProcess({
      auditNumber: `AUD-0${program.processes.length + 2}`,
      process: '',
      standardClause: 'ISO 9001:2015',
      scheduledDate: program.startDate || '2026-03-16',
      scheduledTime: '08:00 - 10:00',
      executedDate: '',
      executedTime: '',
      leadAuditor: program.leadAuditor,
      assistantAuditor: 'Equipo Auditor',
      status: 'PROGRAMADA',
    });
  };

  const getFxsBadge = (fxs: number) => {
    if (fxs >= 30) {
      return (
        <span className="font-mono font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-xs">
          {fxs} (Alto)
        </span>
      );
    }
    if (fxs >= 20) {
      return (
        <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs">
          {fxs} (Medio)
        </span>
      );
    }
    return (
      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-xs">
        {fxs} (Bajo)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Official SGC Header with parameterization */}
      <FormatHeader
        metadata={program.metadata}
        title="PROGRAMA DE AUDITORIA"
        formatKey="FO-MCO-17"
        pageNumber="Página 1 de 2"
      />

      {/* Bloque General Editable (Año, Ciclo, Fechas, Criterios, Objetivos, Alcance, Recursos) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>Datos de Planificación del Ciclo y Criterios Normativos</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">FO-MCO-17</span>
        </div>

        {/* 4 General fields: Año, Ciclo, Fecha Inicio, Fecha Final */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">AÑO</label>
            {isEditMode ? (
              <input
                type="number"
                value={program.year}
                onChange={(e) => setProgram((p) => ({ ...p, year: Number(e.target.value) }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900">
                {program.year}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">CICLO</label>
            {isEditMode ? (
              <input
                type="text"
                value={program.cycle}
                onChange={(e) => setProgram((p) => ({ ...p, cycle: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900">
                {program.cycle}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">FECHA INICIO</label>
            {isEditMode ? (
              <input
                type="date"
                value={program.startDate}
                onChange={(e) => setProgram((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-900">
                {program.startDate}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">FECHA FINAL</label>
            {isEditMode ? (
              <input
                type="date"
                value={program.endDate}
                onChange={(e) => setProgram((p) => ({ ...p, endDate: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-900">
                {program.endDate}
              </div>
            )}
          </div>
        </div>

        {/* Criterios y Auditor Líder */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">CRITERIO NORMATIVO APLICABLE</label>
            {isEditMode ? (
              <textarea
                rows={2}
                value={program.criteria}
                onChange={(e) => setProgram((p) => ({ ...p, criteria: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 leading-relaxed">
                {program.criteria}
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">AUDITOR LÍDER</label>
            {isEditMode ? (
              <input
                type="text"
                value={program.leadAuditor}
                onChange={(e) => setProgram((p) => ({ ...p, leadAuditor: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900">
                {program.leadAuditor}
              </div>
            )}
          </div>
        </div>

        {/* Asignación de Roles Editables: Equipo Auditor (Lista dinámica) */}
        <div className="mt-4 text-xs pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-slate-700 font-bold uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-700" />
              <span>Equipo Auditor Designado (Auditores Principales y Acompañantes)</span>
            </label>
            <span className="text-slate-500 text-[11px] font-mono">Total: {program.auditTeam.length} miembros</span>
          </div>

          {isEditMode && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Nombre, título y especialidad del auditor acompañante..."
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAuditTeamMember(newTeamMember);
                    setNewTeamMember('');
                  }
                }}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-cyan-600"
              />
              <button
                type="button"
                onClick={() => {
                  addAuditTeamMember(newTeamMember);
                  setNewTeamMember('');
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {program.auditTeam.map((member, idx) => (
              <div
                key={idx}
                className="p-2 border border-slate-200 rounded bg-slate-50 text-slate-800 flex items-center justify-between"
              >
                <span className="text-[11px] font-medium">{member}</span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => deleteAuditTeamMember(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                    title="Eliminar auditor del equipo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Textos Libres Editables: Objetivos, Alcance, Recursos */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div>
            <div className="font-bold text-slate-800 uppercase mb-1 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-cyan-600" />
              <span>Objetivos de la Auditoría</span>
            </div>
            {isEditMode ? (
              <textarea
                rows={4}
                value={program.objective.join('\n')}
                onChange={(e) =>
                  setProgram((p) => ({
                    ...p,
                    objective: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  }))
                }
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
                placeholder="Un objetivo por línea..."
              />
            ) : (
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {program.objective.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <div className="font-bold text-slate-800 uppercase mb-1">Alcance de la Auditoría</div>
            {isEditMode ? (
              <textarea
                rows={4}
                value={program.scope}
                onChange={(e) => setProgram((p) => ({ ...p, scope: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{program.scope}</p>
            )}
          </div>

          <div>
            <div className="font-bold text-slate-800 uppercase mb-1">Recursos Necesarios</div>
            {isEditMode ? (
              <textarea
                rows={4}
                value={program.resources}
                onChange={(e) => setProgram((p) => ({ ...p, resources: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{program.resources}</p>
            )}
          </div>
        </div>
      </div>

      {/* Cronograma / Matriz de Auditorías (Tabla editable) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Cronograma / Matriz de Auditorías por Proceso o Cargo
            </h3>
            <p className="text-xs text-slate-500">
              Programación horaria para la evaluación en planta litográfica y áreas de soporte.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowProcessModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Programar Nuevo Proceso / Cargo</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-3">AUD #</th>
                <th className="py-2.5 px-3">PROCESO / CARGO</th>
                <th className="py-2.5 px-3">NUMERAL NORMA</th>
                <th className="py-2.5 px-3">FECHA Y HORA PROGRAMADA</th>
                <th className="py-2.5 px-3">FECHA Y HORA EJECUTADA</th>
                <th className="py-2.5 px-3">AUDITOR PRINCIPAL</th>
                <th className="py-2.5 px-3">AUDITOR ACOMPAÑANTE</th>
                {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {program.processes.map((proc) => (
                <tr key={proc.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{proc.auditNumber}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={proc.process}
                        onChange={(e) => updateScheduledProcess(proc.id, { process: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      proc.process
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={proc.standardClause}
                        onChange={(e) => updateScheduledProcess(proc.id, { standardClause: e.target.value })}
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                      />
                    ) : (
                      proc.standardClause
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {isEditMode ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={proc.scheduledDate}
                          onChange={(e) => updateScheduledProcess(proc.id, { scheduledDate: e.target.value })}
                          className="w-24 px-1.5 py-0.5 border border-slate-200 rounded text-[11px]"
                        />
                        <input
                          type="text"
                          value={proc.scheduledTime}
                          onChange={(e) => updateScheduledProcess(proc.id, { scheduledTime: e.target.value })}
                          className="w-28 px-1.5 py-0.5 border border-slate-200 rounded text-[11px] font-mono"
                        />
                      </div>
                    ) : (
                      <div>
                        <div>{proc.scheduledDate}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{proc.scheduledTime}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                    {isEditMode ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Fecha ejec."
                          value={proc.executedDate || ''}
                          onChange={(e) => updateScheduledProcess(proc.id, { executedDate: e.target.value })}
                          className="w-24 px-1.5 py-0.5 border border-slate-200 rounded text-[11px]"
                        />
                        <input
                          type="text"
                          placeholder="Hora ejec."
                          value={proc.executedTime || ''}
                          onChange={(e) => updateScheduledProcess(proc.id, { executedTime: e.target.value })}
                          className="w-28 px-1.5 py-0.5 border border-slate-200 rounded text-[11px] font-mono"
                        />
                      </div>
                    ) : (
                      <div>
                        <div>{proc.executedDate || '—'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{proc.executedTime || '—'}</div>
                      </div>
                    )}
                  </td>
                  <td className="py-2.5 px-3">{proc.leadAuditor}</td>
                  <td className="py-2.5 px-3 text-slate-600">{proc.assistantAuditor}</td>
                  {isEditMode && (
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => deleteScheduledProcess(proc.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Eliminar del cronograma"
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

      {/* Matriz de Evaluación de Riesgos de Auditoría (F x S) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Matriz de Evaluación de Riesgos de Auditoría (F x S)
              </h3>
              <p className="text-xs text-slate-500">
                Valoración: Frecuencia (F: 1 a 5) x Severidad (S: 10 a 50) = Valoración FxS automática con consecuencias y controles preventivos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel('FO-MCO-17')}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Exportar Riesgos a Excel</span>
            </button>

            {isEditMode && (
              <button
                onClick={() => setShowRiskModal(true)}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Riesgo</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-1/4">RIESGO IDENTIFICADO</th>
                <th className="py-2.5 px-2 text-center">F</th>
                <th className="py-2.5 px-2 text-center">S</th>
                <th className="py-2.5 px-2 text-center">FxS</th>
                <th className="py-2.5 px-3 w-1/3">CONSECUENCIAS EN CASO DE MATERIALIZARSE</th>
                <th className="py-2.5 px-3 w-1/3">CONTROLES A IMPLEMENTAR</th>
                {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {program.risks.map((risk) => (
                <tr key={risk.id} className="hover:bg-slate-50/60 align-top">
                  <td className="py-3 px-3 font-medium text-slate-900">
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={risk.risk}
                        onChange={(e) => updateAuditRisk(risk.id, { risk: e.target.value })}
                        className="w-full p-1.5 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      risk.risk
                    )}
                  </td>
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditMode ? (
                      <select
                        value={risk.frequency}
                        onChange={(e) => updateAuditRisk(risk.id, { frequency: Number(e.target.value) })}
                        className="p-1 border border-slate-200 rounded font-mono"
                      >
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      risk.frequency
                    )}
                  </td>
                  <td className="py-3 px-2 text-center font-mono">
                    {isEditMode ? (
                      <select
                        value={risk.severity}
                        onChange={(e) => updateAuditRisk(risk.id, { severity: Number(e.target.value) })}
                        className="p-1 border border-slate-200 rounded font-mono"
                      >
                        {[10, 20, 30, 40, 50].map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      risk.severity
                    )}
                  </td>
                  <td className="py-3 px-2 text-center whitespace-nowrap">{getFxsBadge(risk.fxs)}</td>
                  <td className="py-3 px-3">
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={risk.consequences.join('\n')}
                        onChange={(e) =>
                          updateAuditRisk(risk.id, {
                            consequences: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          })
                        }
                        className="w-full p-1.5 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 text-slate-600">
                        {risk.consequences.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {isEditMode ? (
                      <textarea
                        rows={2}
                        value={risk.controls.join('\n')}
                        onChange={(e) =>
                          updateAuditRisk(risk.id, {
                            controls: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                          })
                        }
                        className="w-full p-1.5 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      <ul className="list-disc pl-4 space-y-1 text-slate-700">
                        {risk.controls.map((ctrl, i) => (
                          <li key={i}>{ctrl}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  {isEditMode && (
                    <td className="py-3 px-2 text-center print:hidden">
                      <button
                        onClick={() => deleteAuditRisk(risk.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="Eliminar riesgo"
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

      {/* Observaciones y Firma del Auditor Líder */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <div className="text-xs space-y-3">
          <div>
            <label className="block text-slate-800 font-bold uppercase mb-1">
              OBSERVACIONES GENERALES
            </label>
            {isEditMode ? (
              <textarea
                rows={2}
                value={program.observations}
                onChange={(e) => setProgram((p) => ({ ...p, observations: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600"
              />
            ) : (
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700">
                {program.observations}
              </p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex-1 min-w-[240px]">
              <span className="text-slate-500 font-semibold uppercase text-[10px]">Auditor Líder:</span>
              {isEditMode ? (
                <div className="mt-1 space-y-1.5">
                  <input
                    type="text"
                    value={program.leadAuditor}
                    onChange={(e) => setProgram((p) => ({ ...p, leadAuditor: e.target.value }))}
                    placeholder="Nombre y cargo del Auditor Líder..."
                    className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 border border-slate-300 rounded bg-white focus:outline-cyan-600"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">Fecha de firma:</span>
                    <input
                      type="date"
                      value={program.leadAuditorSignatureDate || ''}
                      onChange={(e) => setProgram((p) => ({ ...p, leadAuditorSignatureDate: e.target.value }))}
                      className="px-2 py-0.5 text-xs border border-slate-300 rounded bg-white text-slate-800"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-0.5">
                  <div className="font-bold text-slate-900 text-sm">{program.leadAuditor}</div>
                  <div className="text-[11px] text-slate-400">
                    Fecha de firma: {program.leadAuditorSignatureDate || 'Pendiente de formalización'}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50/70 rounded-xl text-center min-w-[280px] space-y-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5">
                <span>Firma Digital Auditor Líder (FO-MCO-17)</span>
              </div>
              <div className="min-h-14 flex items-center justify-center p-2 bg-white rounded border border-slate-200 shadow-2xs">
                {program.leadAuditorSignature ? (
                  program.leadAuditorSignature.startsWith('data:image/') ||
                  program.leadAuditorSignature.endsWith('.png') ? (
                    <div className="space-y-1">
                      <img
                        src={program.leadAuditorSignature}
                        alt="Firma Auditor Líder"
                        className="max-h-12 max-w-[220px] object-contain mx-auto"
                      />
                      <span className="text-[9px] text-emerald-700 font-mono block font-semibold">✓ Firma PNG Verificada</span>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="font-serif italic font-bold text-slate-900 text-base">
                        {program.leadAuditorSignature}
                      </div>
                      <span className="text-[9px] text-slate-400 font-mono block">Firma Digital Caligráfica</span>
                    </div>
                  )
                ) : (
                  <span className="text-slate-400 italic text-xs">Sin firma registrada</span>
                )}
              </div>

              <div className="flex gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
                >
                  <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{program.leadAuditorSignature ? 'Cambiar Firma (PNG / Dibujo)' : 'Subir Firma PNG o Dibujar'}</span>
                </button>
                {program.leadAuditorSignature && (
                  <button
                    type="button"
                    onClick={() => {
                      setProgram((p) => ({ ...p, leadAuditorSignature: '', leadAuditorSignatureDate: '' }));
                      triggerSaveNotification('Firma digital de Auditor Líder eliminada');
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
      </div>

      {/* Official Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
      <FormatApprovalFooter
        workflow={program.metadata.approvalWorkflow}
        onUpdate={(newWf) => {
          setProgram((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, approvalWorkflow: newWf },
          }));
          triggerSaveNotification('Firmas del Programa (Elaboró, Revisó, Aprobó) actualizadas');
        }}
      />

      {/* Modal for adding audit risk */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-slate-800 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>Nuevo Riesgo del Programa de Auditoría</span>
            </h3>

            <form onSubmit={handleAddRisk} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Identificación del Riesgo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Resistencia de los prensistas a la toma de muestras..."
                  value={newRisk.risk}
                  onChange={(e) => setNewRisk({ ...newRisk, risk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Frecuencia (F: 1 a 5)</label>
                  <select
                    value={newRisk.frequency}
                    onChange={(e) => setNewRisk({ ...newRisk, frequency: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  >
                    <option value={1}>1 - Muy improbable</option>
                    <option value={2}>2 - Improbable</option>
                    <option value={3}>3 - Posible</option>
                    <option value={4}>4 - Probable</option>
                    <option value={5}>5 - Frecuente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Severidad (S: 10 a 50)</label>
                  <select
                    value={newRisk.severity}
                    onChange={(e) => setNewRisk({ ...newRisk, severity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  >
                    <option value={10}>10 - Menor / Operativo</option>
                    <option value={20}>20 - Moderado / Desviación</option>
                    <option value={30}>30 - Grave / Clientes</option>
                    <option value={40}>40 - Muy Grave / Legal</option>
                    <option value={50}>50 - Crítico / Sanción</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center font-mono">
                <span className="text-slate-600">Valor FxS calculado:</span>
                <span className="font-bold text-slate-900">{newRisk.frequency * newRisk.severity}</span>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Consecuencias en caso de materializarse (un punto por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Detener tiraje masivo erróneamente&#10;Inconformidad del cliente con entregas"
                  value={newRisk.consequences}
                  onChange={(e) => setNewRisk({ ...newRisk, consequences: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Controles a Implementar (un punto por línea)
                </label>
                <textarea
                  rows={2}
                  placeholder="Capacitación previa a prensistas&#10;Acompañamiento del supervisor de planta"
                  value={newRisk.controls}
                  onChange={(e) => setNewRisk({ ...newRisk, controls: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowRiskModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
                >
                  Guardar Riesgo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for adding scheduled process */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-slate-800 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Programar Nuevo Proceso / Cargo</span>
            </h3>

            <form onSubmit={handleAddProcess} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Auditoría #</label>
                  <input
                    type="text"
                    required
                    value={newProcess.auditNumber}
                    onChange={(e) => setNewProcess({ ...newProcess, auditNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Numeral Norma</label>
                  <input
                    type="text"
                    required
                    value={newProcess.standardClause}
                    onChange={(e) => setNewProcess({ ...newProcess, standardClause: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Proceso o Cargo Litográfico</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Encuadernación y Guillotina Polar"
                  value={newProcess.process}
                  onChange={(e) => setNewProcess({ ...newProcess, process: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    required
                    value={newProcess.scheduledDate}
                    onChange={(e) => setNewProcess({ ...newProcess, scheduledDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Horario Programado</label>
                  <input
                    type="text"
                    placeholder="08:00 - 10:00"
                    value={newProcess.scheduledTime}
                    onChange={(e) => setNewProcess({ ...newProcess, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Auditor Principal</label>
                  <input
                    type="text"
                    value={newProcess.leadAuditor}
                    onChange={(e) => setNewProcess({ ...newProcess, leadAuditor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Auditor Acompañante</label>
                  <input
                    type="text"
                    value={newProcess.assistantAuditor}
                    onChange={(e) => setNewProcess({ ...newProcess, assistantAuditor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          title="Firma Digital Auditor Líder - Programa (FO-MCO-17)"
          initialSignerName={program.leadAuditor}
          currentSignature={program.leadAuditorSignature}
          onSaveSignature={(signatureUrl, newSignerName) => {
            setProgram((prev) => ({
              ...prev,
              leadAuditor: newSignerName?.trim() || prev.leadAuditor,
              leadAuditorSignature: signatureUrl,
              leadAuditorSignatureDate: new Date().toISOString().split('T')[0],
            }));
            setShowSignatureModal(false);
            triggerSaveNotification('Firma digital y nombre del Auditor Líder actualizados con éxito');
          }}
        />
      )}
    </div>
  );
};
