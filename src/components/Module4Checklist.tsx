import React, { useState, useMemo, useEffect } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  Plus,
  Trash2,
  FileCheck,
  Search,
  Scale,
  Award,
  Layers,
  FileSpreadsheet,
  MinusCircle,
  Eye,
  Briefcase,
} from 'lucide-react';
import { ChecklistItem, ComplianceStatus, CriterionCategory, FormatMetadata } from '../types/audit';

export const Module4Checklist: React.FC = () => {
  const {
    checklist,
    isEditMode,
    updateChecklistItemStatus,
    updateChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    exportToExcel,
    triggerSaveNotification,
  } = useAudit();

  const [selectedCriterion, setSelectedCriterion] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New question form state
  const [newItem, setNewItem] = useState({
    criterion: 'Normas técnicas' as CriterionCategory,
    standardClause: '',
    question: '',
    targetRole: 'Operador Litográfico',
    directObservationNotes: '',
    status: 'PENDIENTE' as ComplianceStatus,
    objectiveEvidence: '',
    observations: '',
    auditedProcess: 'Impresión Offset',
  });

  const categories: { label: CriterionCategory; icon: React.ReactNode; desc: string }[] = [
    {
      label: 'Normas legales',
      icon: <Scale className="w-4 h-4 text-amber-600" />,
      desc: 'SST Decreto 1072, Res. 1362 RESPEL, EPP y vertimientos',
    },
    {
      label: 'Normas técnicas',
      icon: <Award className="w-4 h-4 text-cyan-600" />,
      desc: 'ISO 9001:2015, ISO 12647-2 de Color, Calibración de densitómetros',
    },
    {
      label: 'Caracterización del proceso',
      icon: <Layers className="w-4 h-4 text-indigo-600" />,
      desc: 'Entradas, salidas, clientes internos, indicadores de merma y OTD',
    },
    {
      label: 'Formatos y plataformas utilizados',
      icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" />,
      desc: 'Órdenes de Producción OP, VoBo firmado, ERP GrafiSys, rótulos',
    },
  ];

  // Unique target roles in checklist
  const rolesList = useMemo(() => {
    const set = new Set<string>();
    checklist.forEach((item) => {
      if (item.targetRole) set.add(item.targetRole);
    });
    return Array.from(set);
  }, [checklist]);

  // Filtered items
  const filteredList = useMemo(() => {
    return checklist.filter((item) => {
      const matchCrit = selectedCriterion === 'ALL' || item.criterion === selectedCriterion;
      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchRole = selectedRoleFilter === 'ALL' || item.targetRole === selectedRoleFilter;
      const matchSearch =
        searchQuery === '' ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.standardClause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.objectiveEvidence.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.targetRole && item.targetRole.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCrit && matchStatus && matchRole && matchSearch;
    });
  }, [checklist, selectedCriterion, selectedStatus, selectedRoleFilter, searchQuery]);

  // Statistics
  const total = checklist.length;
  const conformes = checklist.filter((i) => i.status === 'CONFORME').length;
  const noConformes = checklist.filter((i) => i.status === 'NO_CONFORME').length;
  const noAplica = checklist.filter((i) => i.status === 'NO_APLICA').length;
  const observaciones = checklist.filter((i) => i.status === 'OBSERVACION').length;
  const pendientes = checklist.filter((i) => i.status === 'PENDIENTE').length;
  const evaluables = total - noAplica;
  const complianceRate = evaluables > 0 ? Math.round((conformes / evaluables) * 100) : 0;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.question.trim()) return;

    addChecklistItem({
      criterion: newItem.criterion,
      standardClause: newItem.standardClause || 'ISO 9001:2015',
      question: newItem.question.trim(),
      targetRole: newItem.targetRole,
      directObservationNotes: newItem.directObservationNotes,
      status: newItem.status,
      objectiveEvidence: newItem.objectiveEvidence,
      observations: newItem.observations,
      auditedProcess: newItem.auditedProcess,
    });

    setNewItem({
      criterion: 'Normas técnicas',
      standardClause: '',
      question: '',
      targetRole: 'Operador Litográfico',
      directObservationNotes: '',
      status: 'PENDIENTE',
      objectiveEvidence: '',
      observations: '',
      auditedProcess: 'Impresión Offset',
    });
    setShowAddModal(false);
  };

  const [checklistMetadata, setChecklistMetadata] = useState<FormatMetadata>(() => {
    try {
      const saved = localStorage.getItem('impresos_eldia_checklist_metadata_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      processOrPosition: 'Coordinador de Impresión / Operador Litográfico',
      code: 'FO-MCO-19',
      version: '01',
      approvalDate: 'Febrero 14 de 2024',
      copyControl: 'COPIA CONTROLADA' as const,
      pageNumber: 'Página 1 de 3',
      approvalWorkflow: {
        elaboratedBy: { name: 'Auditor Líder', position: 'Auditor Líder SGC', date: 'Enero 15 de 2024' },
        reviewedBy: { name: 'Director de Calidad / Revisor', position: 'Director de Calidad', date: 'Febrero 01 de 2024' },
        approvedBy: { name: 'Gerencia General', position: 'Gerente General', date: 'Febrero 14 de 2024' },
      },
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem('impresos_eldia_checklist_metadata_v2', JSON.stringify(checklistMetadata));
    } catch {}
  }, [checklistMetadata]);

  return (
    <div className="space-y-6">
      {/* Official SGC Header */}
      <FormatHeader
        metadata={checklistMetadata}
        title="LISTA DE VERIFICACIÓN (LISTA DE CHEQUEO DE AUDITORÍA)"
        formatKey="FO-MCO-19"
        pageNumber="Página 1 de 3"
      />

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
        <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs">
          <div className="text-slate-500 font-bold uppercase text-[10px]">Índice Conformidad</div>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{complianceRate}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{conformes} de {evaluables} aspectos</div>
        </div>

        <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs">
          <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conformes</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">{conformes}</div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Cumple requisito</div>
        </div>

        <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs">
          <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>No Conformes</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-600 mt-0.5">{noConformes}</div>
          <div className="text-[10px] text-rose-600 mt-0.5">Generan hallazgo NC</div>
        </div>

        <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs">
          <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Observaciones</span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-600 mt-0.5">{observaciones}</div>
          <div className="text-[10px] text-amber-600 mt-0.5">Oportunidad de mejora</div>
        </div>

        <div className="p-3 bg-white border border-slate-300 rounded-lg shadow-xs col-span-2 sm:col-span-1">
          <div className="text-slate-500 font-bold uppercase text-[10px] flex items-center gap-1">
            <MinusCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>No Aplica / Pend.</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-700 mt-0.5">{noAplica + pendientes}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{noAplica} N/A · {pendientes} Pend.</div>
        </div>
      </div>

      {/* 4 Mandatory SGC Criteria Breakdown */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center justify-between">
          <span>Estructura Obligatoria de los 4 Criterios de Evaluación</span>
          <span className="text-[11px] font-normal text-slate-500 font-mono">FO-MCO-19</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = checklist.filter((i) => i.criterion === cat.label).length;
            const isSelected = selectedCriterion === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setSelectedCriterion(isSelected ? 'ALL' : cat.label)}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  isSelected
                    ? 'border-cyan-600 bg-cyan-50/70 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <span className="font-bold text-slate-900 text-xs">{cat.label}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">{count}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter, Search, and Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-slate-300 rounded-lg text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[180px] flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar aspecto, norma o evidencia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-slate-800 focus:outline-cyan-600"
            />
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-800 text-[11px]"
            >
              <option value="ALL">Todos los cargos</option>
              {rolesList.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
            <button
              onClick={() => setSelectedStatus('ALL')}
              type="button"
              className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                selectedStatus === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({checklist.length})
            </button>
            <button
              onClick={() => setSelectedStatus('CONFORME')}
              type="button"
              className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                selectedStatus === 'CONFORME'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Conforme ({conformes})
            </button>
            <button
              onClick={() => setSelectedStatus('NO_CONFORME')}
              type="button"
              className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                selectedStatus === 'NO_CONFORME'
                  ? 'bg-rose-600 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-rose-700'
              }`}
            >
              No Conforme ({noConformes})
            </button>
            <button
              onClick={() => setSelectedStatus('NO_APLICA')}
              type="button"
              className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                selectedStatus === 'NO_APLICA'
                  ? 'bg-slate-700 text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              N/A ({noAplica})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToExcel('FO-MCO-19')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium rounded transition cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Exportar Lista a Excel</span>
          </button>

          {isEditMode && (
            <button
              onClick={() => setShowAddModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir Pregunta / Aspecto</span>
            </button>
          )}
        </div>
      </div>

      {/* Constructor Dinámico de Lista de Verificación (Tabla) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-3 text-center w-10">#</th>
                <th className="py-2.5 px-3 w-44">CRITERIO / NORMA</th>
                <th className="py-2.5 px-4 w-1/3">PREGUNTA / ASPECTO A OBSERVAR</th>
                <th className="py-2.5 px-3 text-center w-36">CALIFICACIÓN</th>
                <th className="py-2.5 px-4">EVIDENCIA OBJETIVA REGISTRADA & OBSERVACIONES</th>
                {isEditMode && <th className="py-2.5 px-2 text-center w-10 print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 align-top">
                    {/* Item Number */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900">
                      {item.itemNumber}
                    </td>

                    {/* Criterion & Standard Clause */}
                    <td className="py-3 px-3">
                      {isEditMode ? (
                        <div className="space-y-1">
                          <select
                            value={item.criterion}
                            onChange={(e) =>
                              updateChecklistItem(item.id, { criterion: e.target.value as CriterionCategory })
                            }
                            className="w-full p-1 border border-slate-200 rounded text-[11px] font-semibold"
                          >
                            <option value="Normas legales">Normas legales</option>
                            <option value="Normas técnicas">Normas técnicas</option>
                            <option value="Caracterización del proceso">Caracterización</option>
                            <option value="Formatos y plataformas utilizados">Formatos y plataformas</option>
                          </select>
                          <input
                            type="text"
                            value={item.standardClause}
                            onChange={(e) => updateChecklistItem(item.id, { standardClause: e.target.value })}
                            className="w-full p-1 border border-slate-200 rounded font-mono text-[11px]"
                          />
                          {item.targetRole && (
                            <div className="text-[10px] text-cyan-800 font-medium">
                              Cargo: {item.targetRole}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="font-semibold text-slate-900 block">{item.criterion}</span>
                          <span className="font-mono text-[11px] text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 mt-1 inline-block">
                            {item.standardClause}
                          </span>
                          {item.targetRole && (
                            <span className="text-[10px] text-slate-500 block mt-1">
                              Cargo: {item.targetRole}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Question / Guide Points / Direct Observation */}
                    <td className="py-3 px-4">
                      {isEditMode ? (
                        <textarea
                          rows={2}
                          value={item.question}
                          onChange={(e) => updateChecklistItem(item.id, { question: e.target.value })}
                          className="w-full p-1.5 border border-slate-200 rounded text-xs font-medium leading-relaxed"
                        />
                      ) : (
                        <p className="font-medium text-slate-900 leading-relaxed">{item.question}</p>
                      )}

                      {/* Direct observation guide if available */}
                      {item.directObservationNotes && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 flex items-start gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-800 font-semibold">Observación directa en máquina:</strong>{' '}
                            {item.directObservationNotes}
                          </div>
                        </div>
                      )}

                      {item.guideQuestions && item.guideQuestions.length > 0 && (
                        <div className="mt-2 pl-3 border-l-2 border-slate-200 space-y-0.5">
                          {item.guideQuestions.map((gq, gi) => (
                            <div key={gi} className="text-[11px] text-slate-500">
                              · {gq}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Interactive Qualification Status */}
                    <td className="py-3 px-3 text-center">
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() => updateChecklistItemStatus(item.id, 'CONFORME')}
                          className={`w-full py-1 px-2 rounded text-[11px] font-semibold border flex items-center justify-center gap-1 transition cursor-pointer ${
                            item.status === 'CONFORME'
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChecklistItemStatus(item.id, 'NO_CONFORME')}
                          className={`w-full py-1 px-2 rounded text-[11px] font-semibold border flex items-center justify-center gap-1 transition cursor-pointer ${
                            item.status === 'NO_CONFORME'
                              ? 'bg-rose-600 text-white border-rose-700 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          <XCircle className="w-3 h-3" />
                          <span>No Conforme</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChecklistItemStatus(item.id, 'NO_APLICA')}
                          className={`w-full py-1 px-2 rounded text-[11px] font-semibold border flex items-center justify-center gap-1 transition cursor-pointer ${
                            item.status === 'NO_APLICA'
                              ? 'bg-slate-700 text-white border-slate-800 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <MinusCircle className="w-3 h-3" />
                          <span>No Aplica</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => updateChecklistItemStatus(item.id, 'OBSERVACION')}
                          className={`w-full py-1 px-2 rounded text-[11px] font-semibold border flex items-center justify-center gap-1 transition cursor-pointer ${
                            item.status === 'OBSERVACION'
                              ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>Observación</span>
                        </button>
                      </div>
                    </td>

                    {/* Objective Evidence and Notes */}
                    <td className="py-3 px-4">
                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                            Evidencia Objetiva Verificada:
                          </label>
                          {isEditMode ? (
                            <textarea
                              rows={2}
                              value={item.objectiveEvidence}
                              onChange={(e) =>
                                updateChecklistItemStatus(
                                  item.id,
                                  item.status,
                                  e.target.value,
                                  item.observations
                                )
                              }
                              placeholder="Detalle los registros, muestras tomadas o condiciones visuales observadas..."
                              className="w-full mt-1 p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 text-xs leading-relaxed"
                            />
                          ) : (
                            <p className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 text-xs leading-relaxed">
                              {item.objectiveEvidence || 'Sin evidencia registrada'}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                            Observaciones del Auditor:
                          </label>
                          {isEditMode ? (
                            <input
                              type="text"
                              value={item.observations}
                              onChange={(e) =>
                                updateChecklistItemStatus(
                                  item.id,
                                  item.status,
                                  item.objectiveEvidence,
                                  e.target.value
                                )
                              }
                              placeholder="Comentario técnico o recomendación..."
                              className="w-full mt-0.5 px-2 py-1 border border-slate-200 rounded text-slate-700 bg-white focus:outline-cyan-600 text-xs"
                            />
                          ) : (
                            <div className="text-slate-600 text-xs mt-0.5">{item.observations}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Delete item */}
                    {isEditMode && (
                      <td className="py-3 px-2 text-center print:hidden">
                        <button
                          onClick={() => deleteChecklistItem(item.id)}
                          type="button"
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
      <FormatApprovalFooter
        workflow={checklistMetadata.approvalWorkflow}
        onUpdate={(newWf) => {
          setChecklistMetadata((prev) => ({ ...prev, approvalWorkflow: newWf }));
          triggerSaveNotification('Firmas de la Lista de Chequeo (Elaboró, Revisó, Aprobó) actualizadas');
        }}
      />

      {/* Modal for adding new item to checklist */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 text-slate-800 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-600" />
              <span>Añadir Pregunta a la Lista de Verificación</span>
            </h3>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Criterio Obligatorio de Evaluación
                </label>
                <select
                  value={newItem.criterion}
                  onChange={(e) =>
                    setNewItem({ ...newItem, criterion: e.target.value as CriterionCategory })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white focus:outline-cyan-600"
                >
                  <option value="Normas legales">1. Normas legales (SST, Residuos RESPEL, ambiental)</option>
                  <option value="Normas técnicas">2. Normas técnicas (ISO 9001:2015, Color ISO 12647-2)</option>
                  <option value="Caracterización del proceso">3. Caracterización del proceso (Entradas, salidas, KPIs)</option>
                  <option value="Formatos y plataformas utilizados">
                    4. Formatos y plataformas utilizados (OP, GrafiSys, VoBo)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Numeral o Norma</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. ISO 9001:2015 8.5.1"
                    value={newItem.standardClause}
                    onChange={(e) => setNewItem({ ...newItem, standardClause: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Cargo a Observar</label>
                  <input
                    type="text"
                    placeholder="Ej. Operador Litográfico"
                    value={newItem.targetRole}
                    onChange={(e) => setNewItem({ ...newItem, targetRole: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pregunta o Aspecto a Verificar *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. ¿Se verifica la temperatura de las baterías de tinta antes del tiraje?"
                  value={newItem.question}
                  onChange={(e) => setNewItem({ ...newItem, question: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Pauta de Observación Directa en Planta
                </label>
                <input
                  type="text"
                  placeholder="Ej. Constatar el termómetro infrarrojo en la consola de la máquina Heidelberg..."
                  value={newItem.directObservationNotes}
                  onChange={(e) => setNewItem({ ...newItem, directObservationNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Calificación Inicial</label>
                  <select
                    value={newItem.status}
                    onChange={(e) =>
                      setNewItem({ ...newItem, status: e.target.value as ComplianceStatus })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="CONFORME">Conforme</option>
                    <option value="NO_CONFORME">No Conforme</option>
                    <option value="NO_APLICA">No Aplica</option>
                    <option value="OBSERVACION">Observación</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Proceso Auditado</label>
                  <input
                    type="text"
                    value={newItem.auditedProcess}
                    onChange={(e) => setNewItem({ ...newItem, auditedProcess: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-medium cursor-pointer"
                >
                  Guardar Aspecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
