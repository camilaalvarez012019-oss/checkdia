import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { FormatHeader, FormatApprovalFooter } from './FormatHeader';
import {
  CheckCircle2,
  Clock,
  MapPin,
  UserCheck,
  CheckSquare,
  MessageSquare,
  ShieldAlert,
  Plus,
  Trash2,
  UserPlus,
  Edit2,
  Save,
  PenTool,
  Calendar,
  Layers,
} from 'lucide-react';
import { OrderOfDayPoint, MeetingAttendee } from '../types/audit';
import { SignatureModal } from './SignatureModal';

export const Module3Opening: React.FC = () => {
  const {
    opening,
    setOpening,
    isEditMode,
    addOpeningAttendee,
    deleteOpeningAttendee,
    toggleOpeningAttendeeSignature,
    triggerSaveNotification,
  } = useAudit();

  const [showAddAttendeeModal, setShowAddAttendeeModal] = useState(false);
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    position: '',
  });

  const [showAddOrderPointModal, setShowAddOrderPointModal] = useState(false);
  const [newOrderPoint, setNewOrderPoint] = useState({
    title: '',
    description: '',
  });

  const [signatureModalConfig, setSignatureModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    initialName: string;
    currentSignature?: string;
    target: 'lead' | 'processLeader' | 'attendee';
    attendeeId?: string;
  }>({
    isOpen: false,
    title: '',
    initialName: '',
    target: 'lead',
  });

  // Ensure orderOfDayPoints exists
  const orderPoints: OrderOfDayPoint[] =
    opening.orderOfDayPoints && opening.orderOfDayPoints.length > 0
      ? opening.orderOfDayPoints
      : [
          {
            id: 'ord-1',
            orderNumber: 1,
            title: '1. Presentación del Equipo Auditor',
            description:
              'Presentación formal del equipo auditor multidisciplinario con asignación de auditor líder, auditores de soporte técnico litográfico, seguridad y ambiental.',
            completed: opening.orderOfDay.presentationCompleted ?? true,
          },
          {
            id: 'ord-2',
            orderNumber: 2,
            title: '2. Confirmación del Plan de Auditoría, Recursos, Enlaces y Técnicas',
            description:
              'Revisión del itinerario de prensas y preprensa, canales de comunicación, confirmación de técnicas (observación directa sin interrupción del tiraje, lista de verificación y entrevista).',
            completed: opening.orderOfDay.planConfirmed ?? true,
          },
          {
            id: 'ord-3',
            orderNumber: 3,
            title: '3. Espacio para Preguntas del Auditado sobre el Plan Detallado',
            description:
              'Aclaración de dudas formuladas por los líderes de prensa respecto a los tiempos de muestreo y acceso seguro al taller de máquinas litográficas.',
            completed: opening.orderOfDay.qaCompleted ?? true,
          },
          {
            id: 'ord-4',
            orderNumber: 4,
            title: '4. Confirmación de Fecha y Hora de la Reunión de Cierre',
            description:
              'Se ratificó la reunión formal de cierre e informe de hallazgos para las 13:00 p.m. en la Sala de Juntas Central.',
            completed: opening.orderOfDay.closingMeetingConfirmed ?? true,
          },
        ];

  const handleToggleOrderPoint = (id: string) => {
    setOpening((prev) => {
      const updatedPoints = (prev.orderOfDayPoints || orderPoints).map((pt) =>
        pt.id === id ? { ...pt, completed: !pt.completed } : pt
      );
      return {
        ...prev,
        orderOfDayPoints: updatedPoints,
      };
    });
    triggerSaveNotification('Estado del orden del día actualizado');
  };

  const handleUpdateOrderPoint = (id: string, updated: Partial<OrderOfDayPoint>) => {
    setOpening((prev) => {
      const updatedPoints = (prev.orderOfDayPoints || orderPoints).map((pt) =>
        pt.id === id ? { ...pt, ...updated } : pt
      );
      return {
        ...prev,
        orderOfDayPoints: updatedPoints,
      };
    });
  };

  const handleDeleteOrderPoint = (id: string) => {
    setOpening((prev) => {
      const current = prev.orderOfDayPoints || orderPoints;
      const filtered = current
        .filter((pt) => pt.id !== id)
        .map((pt, idx) => ({ ...pt, orderNumber: idx + 1 }));
      return {
        ...prev,
        orderOfDayPoints: filtered,
      };
    });
    triggerSaveNotification('Punto eliminado del orden del día');
  };

  const handleAddOrderPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderPoint.title.trim()) return;

    const current = opening.orderOfDayPoints || orderPoints;
    const newPt: OrderOfDayPoint = {
      id: `ord-${Date.now()}`,
      orderNumber: current.length + 1,
      title: `${current.length + 1}. ${newOrderPoint.title.trim()}`,
      description: newOrderPoint.description.trim() || 'Actividad convenida en reunión de apertura.',
      completed: false,
    };

    setOpening((prev) => ({
      ...prev,
      orderOfDayPoints: [...(prev.orderOfDayPoints || orderPoints), newPt],
    }));

    setNewOrderPoint({ title: '', description: '' });
    setShowAddOrderPointModal(false);
    triggerSaveNotification('Nuevo punto agregado al orden del día');
  };

  const handleUpdateAttendeeField = (id: string, field: keyof MeetingAttendee, value: any) => {
    setOpening((prev) => ({
      ...prev,
      attendees: prev.attendees.map((att) => (att.id === id ? { ...att, [field]: value } : att)),
    }));
  };

  const handleSignLead = () => {
    setOpening((prev) => ({
      ...prev,
      leadAuditorSignature: prev.leadAuditorSignature ? '' : (prev.leadAuditorName || 'Auditor Líder SGC'),
      leadAuditorSignedDate: prev.leadAuditorSignature ? '' : new Date().toLocaleString('es-CO'),
    }));
    triggerSaveNotification('Firma de Auditor Líder actualizada');
  };

  const handleSignProcessLeader = () => {
    setOpening((prev) => ({
      ...prev,
      processLeaderSignature: prev.processLeaderSignature ? '' : (prev.processLeaderName || 'Jorge E. Ramírez'),
      processLeaderSignedDate: prev.processLeaderSignature ? '' : new Date().toLocaleString('es-CO'),
    }));
    triggerSaveNotification('Firma de Líder Auditado actualizada');
  };

  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttendee.name.trim()) return;

    addOpeningAttendee({
      name: newAttendee.name.trim(),
      position: newAttendee.position.trim() || 'Colaborador',
      signature: true,
      signatureDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    setNewAttendee({ name: '', position: '' });
    setShowAddAttendeeModal(false);
  };

  const handleSaveSignatureModal = (signatureDataUrl: string) => {
    if (signatureModalConfig.target === 'lead') {
      setOpening((prev) => ({
        ...prev,
        leadAuditorSignature: signatureDataUrl,
        leadAuditorSignedDate: prev.leadAuditorSignedDate || new Date().toLocaleString('es-CO'),
      }));
      triggerSaveNotification('Firma digital (PNG) de Auditor Líder actualizada');
    } else if (signatureModalConfig.target === 'processLeader') {
      setOpening((prev) => ({
        ...prev,
        processLeaderSignature: signatureDataUrl,
        processLeaderSignedDate: prev.processLeaderSignedDate || new Date().toLocaleString('es-CO'),
      }));
      triggerSaveNotification('Firma digital (PNG) de Líder Auditado actualizada');
    } else if (signatureModalConfig.target === 'attendee' && signatureModalConfig.attendeeId) {
      handleUpdateAttendeeField(signatureModalConfig.attendeeId, 'signatureImage', signatureDataUrl);
      handleUpdateAttendeeField(signatureModalConfig.attendeeId, 'signature', true);
      triggerSaveNotification('Firma digital de asistente guardada');
    }
  };

  return (
    <div className="space-y-6">
      {/* Official SGC Header with Parameterization */}
      <FormatHeader
        metadata={opening.metadata}
        title="ACTA DE APERTURA DE AUDITORÍA INTERNA DE CALIDAD"
        formatKey="FO-MCO-20"
        pageNumber="Página 1 de 2"
        showWorkflowFooter={false}
      />

      {/* Campos Generales Editables */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wide">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span>Datos Generales de la Sesión de Apertura</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">FO-MCO-20</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold mb-1">FECHA DE REUNIÓN</label>
            {isEditMode ? (
              <input
                type="text"
                value={opening.date}
                onChange={(e) => setOpening((o) => ({ ...o, date: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600 font-mono"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{opening.date}</div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">HORA DE APERTURA</label>
            {isEditMode ? (
              <input
                type="text"
                value={opening.time}
                onChange={(e) => setOpening((o) => ({ ...o, time: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600 font-mono"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold">{opening.time}</div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">LUGAR DE REUNIÓN</label>
            {isEditMode ? (
              <input
                type="text"
                value={opening.location}
                onChange={(e) => setOpening((o) => ({ ...o, location: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded text-slate-800">{opening.location}</div>
            )}
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-1">ÁREA / PROCESO AUDITADO</label>
            {isEditMode ? (
              <input
                type="text"
                value={opening.auditedArea}
                onChange={(e) => setOpening((o) => ({ ...o, auditedArea: e.target.value }))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 bg-white focus:outline-cyan-600"
              />
            ) : (
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-bold text-slate-900">{opening.auditedArea}</div>
            )}
          </div>
        </div>

        {/* Objetivo, Alcance y Metodología */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-800 uppercase block mb-1">Objetivos del Acta</span>
            {isEditMode ? (
              <textarea
                rows={3}
                value={opening.objective.join('\n')}
                onChange={(e) =>
                  setOpening((o) => ({
                    ...o,
                    objective: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                  }))
                }
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
                placeholder="Un objetivo por línea..."
              />
            ) : (
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                {opening.objective.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-800 uppercase block mb-1">Alcance Convenido</span>
            {isEditMode ? (
              <textarea
                rows={3}
                value={opening.scope}
                onChange={(e) => setOpening((o) => ({ ...o, scope: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{opening.scope}</p>
            )}
          </div>

          <div>
            <span className="font-bold text-slate-800 uppercase block mb-1">Metodología de Aplicación</span>
            {isEditMode ? (
              <textarea
                rows={3}
                value={opening.methodology}
                onChange={(e) => setOpening((o) => ({ ...o, methodology: e.target.value }))}
                className="w-full p-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
              />
            ) : (
              <p className="text-slate-700 leading-relaxed">{opening.methodology}</p>
            )}
          </div>
        </div>
      </div>

      {/* Agenda y Orden del Día Interactivo (TOTALMENTE EDITABLE) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-cyan-600" />
              <span>Agenda y Orden del Día Oficial (Editable FO-MCO-20)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Secuencia formal obligatoria. Puedes editar cada punto, marcar su cumplimiento, o agregar nuevos puntos al orden del día.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowAddOrderPointModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar Punto al Orden del Día</span>
            </button>
          )}
        </div>

        <div className="p-5 space-y-3 text-xs">
          {orderPoints.map((point) => (
            <div
              key={point.id}
              className={`p-3.5 border rounded-lg transition ${
                point.completed ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleOrderPoint(point.id)}
                    className="mt-0.5 cursor-pointer text-slate-400 hover:text-emerald-600"
                    title={point.completed ? 'Punto cumplido' : 'Marcar como cumplido'}
                  >
                    <CheckSquare
                      className={`w-5 h-5 ${point.completed ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'}`}
                    />
                  </button>

                  <div className="flex-1 space-y-1">
                    {isEditMode ? (
                      <>
                        <input
                          type="text"
                          value={point.title}
                          onChange={(e) => handleUpdateOrderPoint(point.id, { title: e.target.value })}
                          className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-slate-900 text-sm bg-white focus:outline-cyan-600"
                          placeholder="Título del punto..."
                        />
                        <textarea
                          rows={2}
                          value={point.description}
                          onChange={(e) => handleUpdateOrderPoint(point.id, { description: e.target.value })}
                          className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 text-xs bg-white focus:outline-cyan-600"
                          placeholder="Descripción o acuerdos de este punto..."
                        />
                      </>
                    ) : (
                      <>
                        <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                          <span>{point.title}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              point.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {point.completed ? '✓ Desahogado y Cumplido' : 'Pendiente'}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mt-0.5">{point.description}</p>
                      </>
                    )}
                  </div>
                </div>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => handleDeleteOrderPoint(point.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer shrink-0"
                    title="Eliminar este punto del orden del día"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Notes and Agreements */}
          <div className="pt-3 border-t border-slate-200">
            <label className="block text-slate-700 font-bold mb-1">Notas y Acuerdos de la Apertura:</label>
            {isEditMode ? (
              <textarea
                rows={2}
                value={opening.orderOfDay.notes}
                onChange={(e) =>
                  setOpening((prev) => ({
                    ...prev,
                    orderOfDay: { ...prev.orderOfDay, notes: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-800 bg-white focus:outline-cyan-600 leading-relaxed"
                placeholder="Anotaciones clave acordadas durante la sesión de apertura..."
              />
            ) : (
              <p className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
                {opening.orderOfDay.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de Asistentes Editables (Nombres, Cargos y Firmas) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-cyan-600" />
              <span>Lista de Asistentes y Aceptación Digital (Firmas Editables)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Registro formal de asistencia de líderes de proceso y equipo auditor. Puedes editar los nombres, cargos y firmas de cada persona.
            </p>
          </div>

          {isEditMode && (
            <button
              onClick={() => setShowAddAttendeeModal(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Agregar Asistente</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-100 font-bold uppercase border-b border-slate-300 tracking-wider">
              <tr>
                <th className="py-2.5 px-4 min-w-[200px]">NOMBRE COMPLETO</th>
                <th className="py-2.5 px-4 min-w-[220px]">CARGO EN "IMPRESOS EL DÍA"</th>
                <th className="py-2.5 px-4 text-center">ESTADO DE FIRMA DIGITAL</th>
                <th className="py-2.5 px-4 min-w-[140px]">FECHA Y HORA DE FIRMA</th>
                {isEditMode && <th className="py-2.5 px-2 text-center print:hidden">ACCIÓN</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {opening.attendees.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={att.name}
                        onChange={(e) => handleUpdateAttendeeField(att.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-slate-900 focus:outline-cyan-600"
                      />
                    ) : (
                      att.name
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {isEditMode ? (
                      <input
                        type="text"
                        value={att.position}
                        onChange={(e) => handleUpdateAttendeeField(att.id, 'position', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-700 focus:outline-cyan-600"
                      />
                    ) : (
                      att.position
                    )}
                  </td>
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
                          onClick={() => toggleOpeningAttendeeSignature(att.id)}
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
                              target: 'attendee',
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
                    {isEditMode ? (
                      <input
                        type="text"
                        value={att.signatureDate || ''}
                        onChange={(e) => handleUpdateAttendeeField(att.id, 'signatureDate', e.target.value)}
                        placeholder="Fecha y hora..."
                        className="w-full px-2 py-1 border border-slate-300 rounded text-[11px] font-mono focus:outline-cyan-600"
                      />
                    ) : (
                      att.signatureDate || '—'
                    )}
                  </td>
                  {isEditMode && (
                    <td className="py-3 px-2 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => deleteOpeningAttendee(att.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                        title="Eliminar de lista"
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

      {/* Firmas de Refrendación del Acta (Líder Auditor y Líder Auditado - EDITABLES CON PNG) */}
      <div className="bg-white border border-slate-300 shadow-xs rounded-lg p-5">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Firmas de Refrendación del Acta de Apertura</span>
          <span className="text-[11px] text-slate-500 font-normal">
            {isEditMode ? 'Modo Edición: Puedes editar datos y subir firmas en PNG o dibujarlas' : ''}
          </span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Líder Auditor */}
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/70 text-center space-y-2.5">
            <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
              Líder del Equipo Auditor
            </div>

            {/* Visualización de firma (PNG o Caligráfica) */}
            <div className="min-h-16 flex items-center justify-center p-2 bg-white rounded border border-slate-200 shadow-2xs">
              {opening.leadAuditorSignature ? (
                opening.leadAuditorSignature.startsWith('data:image/') ||
                opening.leadAuditorSignature.endsWith('.png') ? (
                  <div className="space-y-1">
                    <img
                      src={opening.leadAuditorSignature}
                      alt="Firma Auditor Líder"
                      className="max-h-14 max-w-[220px] object-contain mx-auto"
                    />
                    <span className="text-[9px] text-emerald-700 font-mono block">Firma PNG Verificada ✓</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="font-serif italic font-bold text-slate-900 text-lg">
                      {opening.leadAuditorSignature}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block">Validación Criptográfica SGC</span>
                  </div>
                )
              ) : (
                <span className="text-slate-400 italic text-xs">Sin firma registrada</span>
              )}
            </div>

            {isEditMode ? (
              <div className="space-y-1.5 my-2">
                <input
                  type="text"
                  value={opening.leadAuditorName || ''}
                  onChange={(e) => setOpening((o) => ({ ...o, leadAuditorName: e.target.value }))}
                  placeholder="Nombre Auditor Líder (editable)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-center focus:outline-cyan-600 bg-white"
                />
                <input
                  type="text"
                  value={opening.leadAuditorRole || ''}
                  onChange={(e) => setOpening((o) => ({ ...o, leadAuditorRole: e.target.value }))}
                  placeholder="Cargo (ej. Auditor Líder SGC)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-[11px] text-center focus:outline-cyan-600 bg-white"
                />
                <input
                  type="text"
                  value={opening.leadAuditorSignedDate || ''}
                  onChange={(e) => setOpening((o) => ({ ...o, leadAuditorSignedDate: e.target.value }))}
                  placeholder="Fecha y hora de firma"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-[10px] font-mono text-center focus:outline-cyan-600 bg-white"
                />
              </div>
            ) : (
              <>
                <div className="font-bold text-slate-900">{opening.leadAuditorName || 'Auditor Líder SGC'}</div>
                <div className="text-[11px] text-slate-500">{opening.leadAuditorRole || 'Auditor Líder SGC'}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Fecha: {opening.leadAuditorSignedDate || 'Pendiente'}
                </div>
              </>
            )}

            <div className="pt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setSignatureModalConfig({
                    isOpen: true,
                    title: 'Firma de Auditor Líder (PNG / Digital)',
                    initialName: opening.leadAuditorName || 'Auditor Líder',
                    currentSignature: opening.leadAuditorSignature,
                    target: 'lead',
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
              >
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                <span>{opening.leadAuditorSignature ? 'Cambiar Firma (PNG / Digital)' : 'Subir Firma PNG o Dibujar'}</span>
              </button>

              <button
                onClick={handleSignLead}
                type="button"
                className={`py-1 text-[11px] rounded transition cursor-pointer font-semibold ${
                  opening.leadAuditorSignature
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opening.leadAuditorSignature ? 'Limpiar Firma' : 'Firmar Rápido'}
              </button>
            </div>
          </div>

          {/* Líder Auditado */}
          <div className="p-4 border border-slate-200 rounded-lg bg-slate-50/70 text-center space-y-2.5">
            <div className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider">
              Líder del Proceso Auditado
            </div>

            {/* Visualización de firma (PNG o Caligráfica) */}
            <div className="min-h-16 flex items-center justify-center p-2 bg-white rounded border border-slate-200 shadow-2xs">
              {opening.processLeaderSignature ? (
                opening.processLeaderSignature.startsWith('data:image/') ||
                opening.processLeaderSignature.endsWith('.png') ? (
                  <div className="space-y-1">
                    <img
                      src={opening.processLeaderSignature}
                      alt="Firma Líder Auditado"
                      className="max-h-14 max-w-[220px] object-contain mx-auto"
                    />
                    <span className="text-[9px] text-emerald-700 font-mono block">Firma PNG Verificada ✓</span>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div className="font-serif italic font-bold text-slate-900 text-lg">
                      {opening.processLeaderSignature}
                    </div>
                    <span className="text-[9px] text-slate-400 font-mono block">Validación Criptográfica SGC</span>
                  </div>
                )
              ) : (
                <span className="text-slate-400 italic text-xs">Sin firma registrada</span>
              )}
            </div>

            {isEditMode ? (
              <div className="space-y-1.5 my-2">
                <input
                  type="text"
                  value={opening.processLeaderName || 'Jorge E. Ramírez'}
                  onChange={(e) => setOpening((o) => ({ ...o, processLeaderName: e.target.value }))}
                  placeholder="Nombre Líder Auditado"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs font-bold text-center focus:outline-cyan-600 bg-white"
                />
                <input
                  type="text"
                  value={opening.processLeaderRole || 'Coordinador de Impresión Offset'}
                  onChange={(e) => setOpening((o) => ({ ...o, processLeaderRole: e.target.value }))}
                  placeholder="Cargo"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-[11px] text-center focus:outline-cyan-600 bg-white"
                />
                <input
                  type="text"
                  value={opening.processLeaderSignedDate || '2026-03-17 08:30'}
                  onChange={(e) => setOpening((o) => ({ ...o, processLeaderSignedDate: e.target.value }))}
                  placeholder="Fecha y hora de firma"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-[10px] font-mono text-center focus:outline-cyan-600 bg-white"
                />
              </div>
            ) : (
              <>
                <div className="font-bold text-slate-900">{opening.processLeaderName || 'Jorge E. Ramírez'}</div>
                <div className="text-[11px] text-slate-500">{opening.processLeaderRole || 'Coordinador de Impresión Offset'}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Fecha: {opening.processLeaderSignedDate || '2026-03-17 08:30'}
                </div>
              </>
            )}

            <div className="pt-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setSignatureModalConfig({
                    isOpen: true,
                    title: 'Firma de Líder Auditado (PNG / Digital)',
                    initialName: opening.processLeaderName || 'Jorge E. Ramírez',
                    currentSignature: opening.processLeaderSignature,
                    target: 'processLeader',
                  })
                }
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shadow-xs transition"
              >
                <PenTool className="w-3.5 h-3.5 text-cyan-400" />
                <span>{opening.processLeaderSignature ? 'Cambiar Firma (PNG / Digital)' : 'Subir Firma PNG o Dibujar'}</span>
              </button>

              <button
                onClick={handleSignProcessLeader}
                type="button"
                className={`py-1 text-[11px] rounded transition cursor-pointer font-semibold ${
                  opening.processLeaderSignature
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {opening.processLeaderSignature ? 'Limpiar Firma' : 'Firmar Rápido'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Firmas de Aprobación de Formato FO-MCO-20 (Elaboró, Revisó, Aprobó - EDITABLE) */}
      <div className="space-y-1">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
          <span>Firmas de Aprobación del Documento FO-MCO-20:</span>
          {isEditMode && (
            <span className="text-[11px] text-cyan-700 font-semibold">
              Puedes editar directamente los nombres, cargos y fechas de Elaboró, Revisó y Aprobó abajo:
            </span>
          )}
        </div>
        <FormatApprovalFooter
          workflow={opening.metadata.approvalWorkflow}
          onUpdate={(newWf) => {
            setOpening((prev) => ({
              ...prev,
              metadata: { ...prev.metadata, approvalWorkflow: newWf },
            }));
            triggerSaveNotification('Firmas de Elaboró, Revisó y Aprobó actualizadas');
          }}
        />
      </div>

      {/* Modal para Agregar Asistente */}
      {showAddAttendeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-sm w-full shadow-xl space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900 uppercase">Agregar Asistente a la Apertura</h4>
            <form onSubmit={handleAddAttendee} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Nombre Completo:</label>
                <input
                  type="text"
                  required
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                  placeholder="Ej. Ing. Mauricio Restrepo"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Cargo en Impresos El Día:</label>
                <input
                  type="text"
                  required
                  value={newAttendee.position}
                  onChange={(e) => setNewAttendee({ ...newAttendee, position: e.target.value })}
                  placeholder="Ej. Supervisor de Acabados / Prensista"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAttendeeModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer font-semibold"
                >
                  Registrar Asistente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Agregar Punto al Orden del Día */}
      {showAddOrderPointModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-5 max-w-md w-full shadow-xl space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-900 uppercase">Nuevo Punto para el Orden del Día</h4>
            <form onSubmit={handleAddOrderPoint} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Título del Punto:</label>
                <input
                  type="text"
                  required
                  value={newOrderPoint.title}
                  onChange={(e) => setNewOrderPoint({ ...newOrderPoint, title: e.target.value })}
                  placeholder="Ej. Verificación de acuerdos previos o revisión de protocolos de seguridad"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Descripción y Directrices:</label>
                <textarea
                  rows={3}
                  value={newOrderPoint.description}
                  onChange={(e) => setNewOrderPoint({ ...newOrderPoint, description: e.target.value })}
                  placeholder="Detalle el contenido o dinámica a tratar en este punto..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-cyan-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddOrderPointModal(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-800 cursor-pointer font-semibold"
                >
                  Guardar Punto
                </button>
              </div>
            </form>
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
          onSaveSignature={handleSaveSignatureModal}
        />
      )}
    </div>
  );
};
