import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  Eye,
  BookOpen,
  Clock,
  Plus,
  Trash2,
  CheckCircle,
  FileText,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';
import { ItineraryItem, ReferenceDocument } from '../types/audit';

export const Module2Plan: React.FC = () => {
  const {
    plan,
    setPlan,
    isEditMode,
    addReferenceDocument,
    updateReferenceDocument,
    deleteReferenceDocument,
    addItineraryItem,
    updateItineraryItem,
    deleteItineraryItem,
    toggleItineraryStatus,
    exportToExcel,
    triggerSaveNotification,
  } = useAudit();

  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);

  const [newItinerary, setNewItinerary] = useState({
    activity: '',
    auditee: '',
    auditor: plan.leadAuditor,
    date: '2026-03-17',
    startTime: '10:00',
    endTime: '10:30',
    location: 'Taller de Impresión Offset',
  });

  const [newDoc, setNewDoc] = useState({
    name: '',
    code: '',
    version: '01',
    standardClause: '',
  });

  const handleAddItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItinerary.activity.trim()) return;

    addItineraryItem({
      ...newItinerary,
      completed: false,
    });
    setShowItineraryModal(false);
    setNewItinerary({
      activity: '',
      auditee: '',
      auditor: plan.leadAuditor,
      date: '2026-03-17',
      startTime: '10:00',
      endTime: '10:30',
      location: 'Taller de Impresión Offset',
    });
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.name.trim()) return;

    addReferenceDocument(newDoc);
    setShowDocModal(false);
    setNewDoc({ name: '', code: '', version: '01', standardClause: '' });
  };

  return (
    <div className="space-y-6">
      {/* Official SGC Header */}
      <FormatHeader
        metadata={plan.metadata}
        title="PLAN DE AUDITORÍA"
        formatKey="FO-MCO-18"
        pageNumber="Página 1 de 2"
      />

      {/* Encabezado Configurable */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wide">
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>Encabezado Configurable del Plan de Auditoría</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">FO-MCO-18</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">CICLO</label>
            {isEditMode ? (
              <input
                type="text"
                value={plan.cycle}
                onChange={(e) => setPlan((p) => ({ ...p, cycle: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{plan.cycle}</div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">AUDITORIA #</label>
            {isEditMode ? (
              <input
                type="text"
                value={plan.auditNumber}
                onChange={(e) => setPlan((p) => ({ ...p, auditNumber: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{plan.auditNumber}</div>
            )}
          </div>

          <div className="lg:col-span-2">
            <label className="block text-slate-600 font-bold mb-1">PROCESO / CARGO AUDITADO</label>
            {isEditMode ? (
              <input
                type="text"
                value={plan.process}
                onChange={(e) => setPlan((p) => ({ ...p, process: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900">{plan.process}</div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">AUDITOR PRINCIPAL</label>
            {isEditMode ? (
              <input
                type="text"
                value={plan.leadAuditor}
                onChange={(e) => setPlan((p) => ({ ...p, leadAuditor: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-900">{plan.leadAuditor}</div>
            )}
          </div>

          <div className="lg:col-span-3">
            <label className="block text-slate-600 font-bold mb-1">EQUIPO ACOMPAÑANTE</label>
            {isEditMode ? (
              <input
                type="text"
                value={plan.assistantAuditors.join(', ')}
                onChange={(e) =>
                  setPlan((p) => ({
                    ...p,
                    assistantAuditors: e.target.value.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
                  }))
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white focus:outline-cyan-600"
                placeholder="Separados por coma..."
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800">
                {plan.assistantAuditors.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Secciones de Texto Editable: Objetivo, Alcance, Criterios */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div>
            <label className="block text-slate-700 font-bold uppercase mb-1">Objetivos del Plan</label>
            {isEditMode ? (
              <textarea
                rows={3}
                value={plan.objective.join('\n')}
                onChange={(e) =>
                  setPlan((p) => ({
                    ...p,
                    objective: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  }))
                }
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
                placeholder="Un objetivo por línea..."
              />
            ) : (
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {plan.objective.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase mb-1">Alcance</label>
            {isEditMode ? (
              <textarea
                rows={3}
                value={plan.scope}
                onChange={(e) => setPlan((p) => ({ ...p, scope: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{plan.scope}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-bold uppercase mb-1">Criterios Normativos</label>
            {isEditMode ? (
              <textarea
                rows={3}
                value={plan.criterion}
                onChange={(e) => setPlan((p) => ({ ...p, criterion: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{plan.criterion}</p>
            )}
          </div>
        </div>

        {/* Metodología y Enfoque de Evaluación */}
        <div className="mt-5 pt-4 border-t border-slate-200 text-xs">
          <div className="font-bold text-slate-800 uppercase mb-2 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-600" />
            <span>Metodología y Enfoque de Evaluación (Observación Directa, Poca Intervención)</span>
          </div>

          {isEditMode && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={plan.methodology.directObservation}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, directObservation: e.target.checked },
                    }))
                  }
                  className="rounded text-cyan-600"
                />
                <span className="font-semibold text-slate-700">Observación directa</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={plan.methodology.lowIntervention}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, lowIntervention: e.target.checked },
                    }))
                  }
                  className="rounded text-cyan-600"
                />
                <span className="font-semibold text-slate-700">Poca intervención</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={plan.methodology.interviews}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, interviews: e.target.checked },
                    }))
                  }
                  className="rounded text-cyan-600"
                />
                <span className="font-semibold text-slate-700">Entrevistas</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  checked={plan.methodology.documentaryReview}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, documentaryReview: e.target.checked },
                    }))
                  }
                  className="rounded text-cyan-600"
                />
                <span className="font-semibold text-slate-700">Revisión documental</span>
              </label>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="block text-slate-600 font-bold mb-1">Descripción Metodológica:</span>
              {isEditMode ? (
                <textarea
                  rows={2}
                  value={plan.methodology.description}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, description: e.target.value },
                    }))
                  }
                  className="w-full p-2 border border-slate-300 rounded text-slate-700 bg-white focus:outline-cyan-600 leading-relaxed"
                />
              ) : (
                <p className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {plan.methodology.description}
                </p>
              )}
            </div>

            <div>
              <span className="block text-slate-600 font-bold mb-1">Guía de Preguntas Clave:</span>
              {isEditMode ? (
                <textarea
                  rows={2}
                  value={plan.methodology.keyQuestionsGuide}
                  onChange={(e) =>
                    setPlan((p) => ({
                      ...p,
                      methodology: { ...p.methodology, keyQuestionsGuide: e.target.value },
                    }))
                  }
                  className="w-full p-2 border border-slate-300 rounded text-slate-700 bg-white focus:outline-cyan-600 leading-relaxed"
                />
              ) : (
                <p className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                  {plan.methodology.keyQuestionsGuide}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Alineación Estratégica con Misión y Visión */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="font-bold text-slate-800 uppercase block mb-1">Alineación con la Misión</span>
            {isEditMode ? (
              <textarea
                rows={2}
                value={plan.alignment.mission}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, alignment: { ...p.alignment, mission: e.target.value } }))
                }
                className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
              />
            ) : (
              <p className="text-slate-700 italic">"{plan.alignment.mission}"</p>
            )}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="font-bold text-slate-800 uppercase block mb-1">Alineación con la Visión</span>
            {isEditMode ? (
              <textarea
                rows={2}
                value={plan.alignment.vision}
                onChange={(e) =>
                  setPlan((p) => ({ ...p, alignment: { ...p.alignment, vision: e.target.value } }))
                }
                className="w-full p-1.5 border border-slate-200 rounded text-xs bg-white"
              />
            ) : (
              <p className="text-slate-700 italic">"{plan.alignment.vision}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Documentos de Referencia (Código, Versión, Numeral) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Documentos de Referencia y Numerales Aplicables
              </h3>
              <p className="text-xs text-slate-500">
                Procedimientos, guías técnicas e instructivos vigentes de Impresos El Día.
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowDocModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Documento</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-3">DOCUMENTO DE REFERENCIA</th>
                <th className="py-2.5 px-3">CÓDIGO</th>
                <th className="py-2.5 px-3 text-center">VERSIÓN</th>
                <th className="py-2.5 px-3">NUMERAL NORMA</th>
                {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plan.referenceDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={doc.name}
                        onChange={(e) => updateReferenceDocument(doc.id, { name: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      doc.name
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={doc.code}
                        onChange={(e) => updateReferenceDocument(doc.id, { code: e.target.value })}
                        className="w-24 p-1 border border-slate-200 rounded text-xs font-mono font-bold"
                      />
                    ) : (
                      doc.code
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={doc.version}
                        onChange={(e) => updateReferenceDocument(doc.id, { version: e.target.value })}
                        className="w-12 p-1 border border-slate-200 rounded text-xs font-mono text-center"
                      />
                    ) : (
                      doc.version
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={doc.standardClause}
                        onChange={(e) => updateReferenceDocument(doc.id, { standardClause: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs font-mono"
                      />
                    ) : (
                      doc.standardClause
                    )}
                  </td>
                  {isEditMode && (
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        onClick={() => deleteReferenceDocument(doc.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Eliminar documento"
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

      {/* Itinerario de Trabajo (Tabla dinámica editable) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Itinerario de Trabajo (Cronología de la Auditoría)
              </h3>
              <p className="text-xs text-slate-500">
                Horario con actividades, cargos auditados, auditores asignados y lugar en planta.
              </p>
            </div>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowItineraryModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Bloque al Itinerario</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-3">ACTIVIDAD</th>
                <th className="py-2.5 px-3">AUDITADO (CARGO/NOMBRE)</th>
                <th className="py-2.5 px-3">AUDITOR(ES)</th>
                <th className="py-2.5 px-3 text-center">FECHA</th>
                <th className="py-2.5 px-3 text-center">INICIO</th>
                <th className="py-2.5 px-3 text-center">FIN</th>
                <th className="py-2.5 px-3">LUGAR EN IMPRENTA</th>
                <th className="py-2.5 px-2 text-center print:hidden">ESTADO</th>
                {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {plan.itinerary.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => updateItineraryItem(item.id, { activity: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs font-medium"
                      />
                    ) : (
                      item.activity
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.auditee}
                        onChange={(e) => updateItineraryItem(item.id, { auditee: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      item.auditee
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.auditor}
                        onChange={(e) => updateItineraryItem(item.id, { auditor: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs font-mono"
                      />
                    ) : (
                      item.auditor
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => updateItineraryItem(item.id, { date: e.target.value })}
                        className="w-24 p-1 border border-slate-200 rounded text-xs text-center"
                      />
                    ) : (
                      item.date
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.startTime}
                        onChange={(e) => updateItineraryItem(item.id, { startTime: e.target.value })}
                        className="w-16 p-1 border border-slate-200 rounded text-xs font-mono text-center"
                      />
                    ) : (
                      item.startTime
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.endTime}
                        onChange={(e) => updateItineraryItem(item.id, { endTime: e.target.value })}
                        className="w-16 p-1 border border-slate-200 rounded text-xs font-mono text-center"
                      />
                    ) : (
                      item.endTime
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={item.location}
                        onChange={(e) => updateItineraryItem(item.id, { location: e.target.value })}
                        className="w-full p-1 border border-slate-200 rounded text-xs"
                      />
                    ) : (
                      item.location
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-center print:hidden">
                    <button
                      onClick={() => toggleItineraryStatus(item.id)}
                      type="button"
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                        item.completed
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {item.completed ? 'Ejecutado' : 'Pendiente'}
                    </button>
                  </td>
                  {isEditMode && (
                    <td className="py-2.5 px-2 text-center print:hidden">
                      <button
                        onClick={() => deleteItineraryItem(item.id)}
                        type="button"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Eliminar bloque"
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

      {/* Firmas de Validación */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Firmas de Aceptación del Plan de Auditoría
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Auditor Principal */}
          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-1.5">
            <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">Auditor Principal</div>
            <div className="min-h-12 flex items-center justify-center p-1.5 bg-white rounded border border-slate-200">
              {plan.leadAuditorSignature ? (
                plan.leadAuditorSignature.startsWith('data:image/') || plan.leadAuditorSignature.endsWith('.png') ? (
                  <img src={plan.leadAuditorSignature} alt="Firma Auditor" className="max-h-10 max-w-[160px] object-contain mx-auto" />
                ) : (
                  <div className="font-serif italic font-bold text-slate-900 text-sm">{plan.leadAuditorSignature}</div>
                )
              ) : (
                <span className="text-slate-400 italic text-xs">Sin firma</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">{plan.leadAuditor || 'Líder Equipo Auditor'}</div>
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setPlan((p) => ({
                    ...p,
                    leadAuditorSignature: p.leadAuditorSignature ? '' : (p.leadAuditor || 'Auditor Líder'),
                  }));
                  triggerSaveNotification('Firma de Auditor Principal actualizada');
                }}
                className={`w-full py-1 text-[10px] font-semibold rounded cursor-pointer transition ${
                  plan.leadAuditorSignature ? 'text-rose-600 hover:bg-rose-50' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.leadAuditorSignature ? 'Limpiar Firma' : 'Firmar Digitalmente'}
              </button>
            )}
          </div>

          {/* Auditor Acompañante */}
          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-1.5">
            <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">Auditor Acompañante</div>
            <div className="min-h-12 flex items-center justify-center p-1.5 bg-white rounded border border-slate-200">
              {plan.assistantAuditorSignature ? (
                plan.assistantAuditorSignature.startsWith('data:image/') || plan.assistantAuditorSignature.endsWith('.png') ? (
                  <img src={plan.assistantAuditorSignature} alt="Firma Acompañante" className="max-h-10 max-w-[160px] object-contain mx-auto" />
                ) : (
                  <div className="font-serif italic font-bold text-slate-900 text-sm">{plan.assistantAuditorSignature}</div>
                )
              ) : (
                <span className="text-slate-400 italic text-xs">Sin firma</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">Especialista Técnico SGC</div>
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setPlan((p) => ({
                    ...p,
                    assistantAuditorSignature: p.assistantAuditorSignature ? '' : 'Auditor Acompañante',
                  }));
                  triggerSaveNotification('Firma de Auditor Acompañante actualizada');
                }}
                className={`w-full py-1 text-[10px] font-semibold rounded cursor-pointer transition ${
                  plan.assistantAuditorSignature ? 'text-rose-600 hover:bg-rose-50' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.assistantAuditorSignature ? 'Limpiar Firma' : 'Firmar Digitalmente'}
              </button>
            )}
          </div>

          {/* Líder del Proceso Auditado */}
          <div className="p-3 border border-slate-200 rounded-xl bg-slate-50/70 text-center space-y-1.5">
            <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">Líder del Proceso Auditado</div>
            <div className="min-h-12 flex items-center justify-center p-1.5 bg-white rounded border border-slate-200">
              {plan.auditeeSignature ? (
                plan.auditeeSignature.startsWith('data:image/') || plan.auditeeSignature.endsWith('.png') ? (
                  <img src={plan.auditeeSignature} alt="Firma Auditado" className="max-h-10 max-w-[160px] object-contain mx-auto" />
                ) : (
                  <div className="font-serif italic font-bold text-slate-900 text-sm">{plan.auditeeSignature}</div>
                )
              ) : (
                <span className="text-slate-400 italic text-xs">Sin firma</span>
              )}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold">Coordinador de Impresión Offset</div>
            {isEditMode && (
              <button
                type="button"
                onClick={() => {
                  setPlan((p) => ({
                    ...p,
                    auditeeSignature: p.auditeeSignature ? '' : 'Jorge E. Ramírez',
                  }));
                  triggerSaveNotification('Firma de Líder Auditado actualizada');
                }}
                className={`w-full py-1 text-[10px] font-semibold rounded cursor-pointer transition ${
                  plan.auditeeSignature ? 'text-rose-600 hover:bg-rose-50' : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {plan.auditeeSignature ? 'Limpiar Firma' : 'Firmar Digitalmente'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official Approval Workflow Footer (Elaboró, Revisó, Aprobó - TOTALMENTE EDITABLE) */}
      <FormatApprovalFooter
        workflow={plan.metadata.approvalWorkflow}
        onUpdate={(newWf) => {
          setPlan((prev) => ({
            ...prev,
            metadata: { ...prev.metadata, approvalWorkflow: newWf },
          }));
          triggerSaveNotification('Firmas del Plan (Elaboró, Revisó, Aprobó) actualizadas');
        }}
      />

      {/* Modal for adding itinerary item */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-slate-800 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-600" />
              <span>Agregar Bloque al Itinerario</span>
            </h3>

            <form onSubmit={handleAddItinerary} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Inspección de calibración de densitómetro"
                  value={newItinerary.activity}
                  onChange={(e) => setNewItinerary({ ...newItinerary, activity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Auditado (Cargo o Nombre)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Maquinista Heidelberg / Carlos Gómez"
                  value={newItinerary.auditee}
                  onChange={(e) => setNewItinerary({ ...newItinerary, auditee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Auditor Asignado</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Auditor Principal / Acompañante"
                  value={newItinerary.auditor}
                  onChange={(e) => setNewItinerary({ ...newItinerary, auditor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hora Inicio</label>
                  <input
                    type="time"
                    required
                    value={newItinerary.startTime}
                    onChange={(e) => setNewItinerary({ ...newItinerary, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Hora Fin</label>
                  <input
                    type="time"
                    required
                    value={newItinerary.endTime}
                    onChange={(e) => setNewItinerary({ ...newItinerary, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Lugar en Imprenta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Taller de Prensa 1 / Laboratorio de Color"
                  value={newItinerary.location}
                  onChange={(e) => setNewItinerary({ ...newItinerary, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowItineraryModal(false)}
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

      {/* Modal for adding reference document */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-slate-800 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-600" />
              <span>Nuevo Documento de Referencia</span>
            </h3>

            <form onSubmit={handleAddDoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nombre del Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Procedimiento de Lavado de Baterías"
                  value={newDoc.name}
                  onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="PR-IMP-02"
                    value={newDoc.code}
                    onChange={(e) => setNewDoc({ ...newDoc, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Versión</label>
                  <input
                    type="text"
                    required
                    placeholder="01"
                    value={newDoc.version}
                    onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Numerales de la Norma</label>
                <input
                  type="text"
                  required
                  placeholder="ISO 9001:2015 8.5.1 / ISO 14001 8.1"
                  value={newDoc.standardClause}
                  onChange={(e) => setNewDoc({ ...newDoc, standardClause: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
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
    </div>
  );
};
