import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import { Settings, Printer, Check, ChevronDown, ChevronUp, UserCheck, Shield, PenTool } from 'lucide-react';
import { FormatMetadata } from '../types/audit';
import { SignatureModal } from './SignatureModal';

interface FormatHeaderProps {
  metadata: FormatMetadata;
  title: string;
  formatKey: string; // e.g. 'FO-MCO-17'
  pageNumber?: string;
  showWorkflowFooter?: boolean;
}

export const FormatHeader: React.FC<FormatHeaderProps> = ({
  metadata,
  title,
  formatKey,
  pageNumber = 'Página 1 de 2',
  showWorkflowFooter = true,
}) => {
  const { isEditMode, updateFormatMetadata, updateWorkflowSignatures, triggerSaveNotification } = useAudit();
  const [showConfigPanel, setShowConfigPanel] = useState(false);

  const predefinedRoles = [
    'Coordinador de Producción e Impresión Offset',
    'Diseñador de Preprensa Digital y CTP',
    'Operador Litográfico de Prensa Heidelberg / Komori',
    'Inspector de Aseguramiento de la Calidad y Colorimetría',
    'Coordinador de Almacén de Sustratos y Químicos',
    'Supervisor de Acabados, Guillotinado y Troquelado',
    'Director de Gestión de la Calidad y Procesos',
  ];

  return (
    <div className="mb-6 space-y-2">
      {/* Parameterization Banner in Edit Mode */}
      {isEditMode && (
        <div className="bg-slate-800 text-white p-3 rounded-t-md text-xs flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-cyan-500/20 text-cyan-400 rounded">
              <Settings className="w-3.5 h-3.5" />
            </span>
            <span className="font-semibold text-slate-200">
              Parametrización del Formato: <strong className="text-cyan-300">{metadata.code}</strong>
            </span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden md:inline">
              Cargo/Proceso: <strong className="text-white">{metadata.processOrPosition}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowConfigPanel(!showConfigPanel)}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-cyan-300 rounded font-medium transition cursor-pointer"
            >
              <span>{showConfigPanel ? 'Ocultar Parámetros' : 'Editar Metadatos y Firmas'}</span>
              {showConfigPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Expandable Configuration Drawer in Edit Mode */}
      {isEditMode && showConfigPanel && (
        <div className="bg-slate-50 border border-slate-300 rounded-b-md p-4 text-xs space-y-4 print:hidden animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Cargo / Proceso a Auditar</label>
              <input
                type="text"
                list="roles-list"
                value={metadata.processOrPosition}
                onChange={(e) => updateFormatMetadata(formatKey, { processOrPosition: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 font-semibold focus:outline-cyan-600"
              />
              <datalist id="roles-list">
                {predefinedRoles.map((r, i) => (
                  <option key={i} value={r} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Código del Formato</label>
              <input
                type="text"
                value={metadata.code}
                onChange={(e) => updateFormatMetadata(formatKey, { code: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono font-bold text-slate-900 focus:outline-cyan-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Versión</label>
              <input
                type="text"
                value={metadata.version}
                onChange={(e) => updateFormatMetadata(formatKey, { version: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-mono text-slate-900 focus:outline-cyan-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Fecha de Aprobación</label>
              <input
                type="text"
                value={metadata.approvalDate}
                onChange={(e) => updateFormatMetadata(formatKey, { approvalDate: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900 focus:outline-cyan-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Control de Distribución</label>
              <select
                value={metadata.copyControl}
                onChange={(e) =>
                  updateFormatMetadata(formatKey, {
                    copyControl: e.target.value as 'COPIA CONTROLADA' | 'COPIA NO CONTROLADA',
                  })
                }
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white font-bold text-slate-800"
              >
                <option value="COPIA CONTROLADA">COPIA CONTROLADA</option>
                <option value="COPIA NO CONTROLADA">COPIA NO CONTROLADA</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Numeración de Página</label>
              <input
                type="text"
                value={metadata.pageNumber || pageNumber}
                onChange={(e) => updateFormatMetadata(formatKey, { pageNumber: e.target.value })}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Workflow Signatures Editor: Elaboró, Revisó, Aprobó */}
          <div className="pt-3 border-t border-slate-200">
            <span className="font-bold text-slate-800 block mb-2 uppercase text-[11px] tracking-wider">
              Firmas de Aprobación del Formato Oficial (Pie de Página):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Elaboró */}
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="font-bold text-slate-700 block mb-1">Elaboró:</span>
                <input
                  type="text"
                  placeholder="Nombre y cargo"
                  value={metadata.approvalWorkflow?.elaboratedBy?.name || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'elaboratedBy', {
                      ...metadata.approvalWorkflow.elaboratedBy,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-800 mb-1"
                />
                <input
                  type="text"
                  placeholder="Fecha (Ej. Enero de 2024)"
                  value={metadata.approvalWorkflow?.elaboratedBy?.date || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'elaboratedBy', {
                      ...metadata.approvalWorkflow.elaboratedBy,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600 text-[11px]"
                />
              </div>

              {/* Revisó */}
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="font-bold text-slate-700 block mb-1">Revisó (Revisor de la Auditoría):</span>
                <input
                  type="text"
                  placeholder="Nombre de quién revisa"
                  value={metadata.approvalWorkflow?.reviewedBy?.name || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'reviewedBy', {
                      ...metadata.approvalWorkflow.reviewedBy,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-800 mb-1"
                />
                <input
                  type="text"
                  placeholder="Cargo del revisor"
                  value={metadata.approvalWorkflow?.reviewedBy?.position || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'reviewedBy', {
                      ...metadata.approvalWorkflow.reviewedBy,
                      position: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-700 mb-1 text-[11px]"
                />
                <input
                  type="text"
                  placeholder="Fecha (Ej. Febrero de 2024)"
                  value={metadata.approvalWorkflow?.reviewedBy?.date || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'reviewedBy', {
                      ...metadata.approvalWorkflow.reviewedBy,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600 text-[11px]"
                />
              </div>

              {/* Aprobó */}
              <div className="p-2.5 bg-white border border-slate-200 rounded">
                <span className="font-bold text-slate-700 block mb-1">Aprobó:</span>
                <input
                  type="text"
                  placeholder="Nombre y cargo"
                  value={metadata.approvalWorkflow?.approvedBy?.name || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'approvedBy', {
                      ...metadata.approvalWorkflow.approvedBy,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-800 mb-1"
                />
                <input
                  type="text"
                  placeholder="Fecha (Ej. Febrero de 2024)"
                  value={metadata.approvalWorkflow?.approvedBy?.date || ''}
                  onChange={(e) =>
                    updateWorkflowSignatures(formatKey, 'approvedBy', {
                      ...metadata.approvalWorkflow.approvedBy,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-2 py-1 border border-slate-200 rounded text-slate-600 text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official SGC Header Box (Conforming strictly to FO-MCO scanned documents) */}
      <div className="border border-slate-300 bg-white text-slate-900 shadow-xs print:border-black">
        <div className="grid grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-300 print:divide-black">
          {/* Brand Logo & Name */}
          <div className="col-span-12 md:col-span-3 p-3 flex flex-col items-center justify-center text-center bg-slate-50/60">
            <div className="flex items-center gap-2 mb-1">
              {/* CMYK square logo */}
              <div className="grid grid-cols-2 gap-0.5 w-6 h-6 shrink-0">
                <span className="bg-cyan-500 rounded-2xs" />
                <span className="bg-pink-500 rounded-2xs" />
                <span className="bg-amber-400 rounded-2xs" />
                <span className="bg-slate-950 rounded-2xs" />
              </div>
              <div className="font-extrabold text-sm tracking-tight text-slate-900">
                IMPRESOS EL DÍA
              </div>
            </div>
            <div className="text-[10px] tracking-wider text-slate-500 uppercase font-medium">
              SGC ISO 9001:2015 / ISO 12647-2
            </div>
            <div className="text-[10px] text-cyan-800 font-semibold mt-1">
              {metadata.processOrPosition}
            </div>
          </div>

          {/* Document Title */}
          <div className="col-span-12 md:col-span-6 p-4 flex flex-col items-center justify-center text-center">
            <h2 className="text-base md:text-lg font-bold tracking-wide uppercase text-slate-900">
              {title}
            </h2>
            <div className="text-[11px] font-semibold tracking-wider text-slate-600 mt-1">
              SISTEMA DE GESTIÓN INTEGRAL DE LA CALIDAD
            </div>
          </div>

          {/* Document Controlled Parameters */}
          <div className="col-span-12 md:col-span-3 text-xs divide-y divide-slate-300 print:divide-black flex flex-col justify-between">
            <div className="p-2 flex justify-between items-center">
              <span className="font-semibold text-slate-600">Código:</span>
              <span className="font-mono font-bold text-slate-900">{metadata.code}</span>
            </div>
            <div className="p-2 flex justify-between items-center">
              <span className="font-semibold text-slate-600">Versión:</span>
              <span className="font-mono font-medium text-slate-800">{metadata.version}</span>
            </div>
            <div className="p-2 flex justify-between items-center text-[11px]">
              <span className="font-semibold text-slate-600">Aprobación:</span>
              <span className="text-slate-800">{metadata.approvalDate}</span>
            </div>
            <div className="p-2 flex justify-between items-center bg-slate-50/80 font-bold text-[10px] text-slate-600 tracking-wider">
              <span>{metadata.pageNumber || pageNumber}</span>
              <span
                className={`font-extrabold tracking-widest border px-1 py-0.5 ${
                  metadata.copyControl === 'COPIA CONTROLADA'
                    ? 'text-slate-900 bg-white border-slate-300'
                    : 'text-amber-700 bg-amber-50 border-amber-300'
                }`}
              >
                {metadata.copyControl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormatApprovalFooter: React.FC<{
  workflow: FormatMetadata['approvalWorkflow'];
  onUpdate?: (updated: FormatMetadata['approvalWorkflow']) => void;
}> = ({ workflow, onUpdate }) => {
  const { isEditMode, triggerSaveNotification } = useAudit();
  const [activeModalStage, setActiveModalStage] = useState<'elaboratedBy' | 'reviewedBy' | 'approvedBy' | null>(null);

  const handleFieldChange = (
    stage: 'elaboratedBy' | 'reviewedBy' | 'approvedBy',
    field: 'name' | 'position' | 'date',
    value: string
  ) => {
    if (!onUpdate) return;
    const currentStage = workflow[stage] || { name: '', position: '', date: '' };
    const updatedStage = { ...currentStage, [field]: value };
    const newWorkflow = { ...workflow, [stage]: updatedStage };
    onUpdate(newWorkflow);
    triggerSaveNotification(`Firma de ${stage === 'elaboratedBy' ? 'Elaboró' : stage === 'reviewedBy' ? 'Revisó' : 'Aprobó'} actualizada`);
  };

  const handleClearSignature = (stage: 'elaboratedBy' | 'reviewedBy' | 'approvedBy') => {
    if (!onUpdate) return;
    const currentStage = workflow[stage] || { name: '', position: '', date: '' };
    const updatedStage = { ...currentStage, signatureImage: undefined };
    const newWorkflow = { ...workflow, [stage]: updatedStage };
    onUpdate(newWorkflow);
    triggerSaveNotification(`Firma de ${stage === 'elaboratedBy' ? 'Elaboró' : stage === 'reviewedBy' ? 'Revisó' : 'Aprobó'} eliminada`);
  };

  const handleSaveSignature = (signatureUrl: string, name?: string, dateStr?: string) => {
    if (!activeModalStage || !onUpdate) return;
    const currentStage = workflow[activeModalStage] || { name: '', position: '', date: '' };
    const updatedStage = {
      ...currentStage,
      signatureImage: signatureUrl,
      name: name || currentStage.name,
      date: dateStr || currentStage.date,
    };
    const newWorkflow = { ...workflow, [activeModalStage]: updatedStage };
    onUpdate(newWorkflow);
    triggerSaveNotification(`Firma digital/PNG guardada para ${activeModalStage === 'elaboratedBy' ? 'Elaboró' : activeModalStage === 'reviewedBy' ? 'Revisó' : 'Aprobó'}`);
  };

  return (
    <>
      <div className="mt-8 border border-slate-300 bg-white text-xs divide-y sm:divide-y-0 sm:divide-x divide-slate-300 grid grid-cols-1 sm:grid-cols-3 print:border-black print:divide-black rounded-lg overflow-hidden shadow-xs">
        {/* Elaboró */}
        <div className="p-3 bg-slate-50/50 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
              Elaboró (Auditor Líder):
            </span>
            {isEditMode && onUpdate ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={workflow?.elaboratedBy?.name || ''}
                  onChange={(e) => handleFieldChange('elaboratedBy', 'name', e.target.value)}
                  placeholder="Nombre de quién elaboró (editable)"
                  className="w-full px-2 py-1 border border-slate-300 rounded font-semibold text-slate-900 bg-white text-xs focus:outline-cyan-600"
                />
                <input
                  type="text"
                  value={workflow?.elaboratedBy?.position || ''}
                  onChange={(e) => handleFieldChange('elaboratedBy', 'position', e.target.value)}
                  placeholder="Cargo"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 bg-white text-[11px] focus:outline-cyan-600"
                />
                <input
                  type="text"
                  value={workflow?.elaboratedBy?.date || ''}
                  onChange={(e) => handleFieldChange('elaboratedBy', 'date', e.target.value)}
                  placeholder="Fecha (ej. Enero 15 de 2026)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-600 bg-white font-mono text-[10px] focus:outline-cyan-600"
                />
              </div>
            ) : (
              <>
                <div className="font-semibold text-slate-900 mt-0.5">{workflow?.elaboratedBy?.name || 'Auditor Líder'}</div>
                <div className="text-[11px] text-slate-600">{workflow?.elaboratedBy?.position || 'Auditor Líder SGC'}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Fecha: {workflow?.elaboratedBy?.date || 'Enero de 2024'}
                </div>
              </>
            )}
          </div>

          {/* Signature PNG Image rendering & change button */}
          <div className="pt-2 border-t border-slate-200">
            {workflow?.elaboratedBy?.signatureImage ? (
              <div className="space-y-1 text-center">
                <img
                  src={workflow.elaboratedBy.signatureImage}
                  alt="Firma Elaboró"
                  className="max-h-12 max-w-full object-contain mx-auto bg-white p-0.5 rounded border border-slate-200"
                />
                <span className="text-[9px] text-emerald-700 font-mono block">Firma PNG Verificada ✓</span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic text-center py-1">Sin firma gráfica</div>
            )}

            {isEditMode && onUpdate && (
              <div className="flex gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setActiveModalStage('elaboratedBy')}
                  className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold rounded cursor-pointer transition shadow-2xs"
                >
                  <PenTool className="w-3 h-3 text-cyan-400" />
                  <span>{workflow?.elaboratedBy?.signatureImage ? 'Cambiar Firma PNG' : 'Subir Firma PNG'}</span>
                </button>
                {workflow?.elaboratedBy?.signatureImage && (
                  <button
                    type="button"
                    onClick={() => handleClearSignature('elaboratedBy')}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded border border-slate-200 bg-white cursor-pointer"
                    title="Borrar firma"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Revisó - QUIEN ESTÁ REVISANDO LA AUDITORÍA (TOTALMENTE EDITABLE) */}
        <div className="p-3 bg-slate-50/50 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
              Revisó (Revisión de la Auditoría):
            </span>
            {isEditMode && onUpdate ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={workflow?.reviewedBy?.name || ''}
                  onChange={(e) => handleFieldChange('reviewedBy', 'name', e.target.value)}
                  placeholder="Nombre de quién revisa la auditoría (editable)"
                  className="w-full px-2 py-1 border border-cyan-400 rounded font-semibold text-slate-900 bg-white text-xs focus:outline-cyan-600 focus:ring-1 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  value={workflow?.reviewedBy?.position || ''}
                  onChange={(e) => handleFieldChange('reviewedBy', 'position', e.target.value)}
                  placeholder="Cargo del revisor (ej. Director de Calidad / Revisor SGC)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 bg-white text-[11px] focus:outline-cyan-600"
                />
                <input
                  type="text"
                  value={workflow?.reviewedBy?.date || ''}
                  onChange={(e) => handleFieldChange('reviewedBy', 'date', e.target.value)}
                  placeholder="Fecha de revisión (ej. Febrero 10 de 2026)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-600 bg-white font-mono text-[10px] focus:outline-cyan-600"
                />
              </div>
            ) : (
              <>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {workflow?.reviewedBy?.name || 'Revisor de Auditoría'}
                </div>
                <div className="text-[11px] text-slate-600">
                  {workflow?.reviewedBy?.position || 'Director de Aseguramiento de Calidad'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Fecha: {workflow?.reviewedBy?.date || 'Febrero de 2024'}
                </div>
              </>
            )}
          </div>

          {/* Signature PNG Image rendering & change button */}
          <div className="pt-2 border-t border-slate-200">
            {workflow?.reviewedBy?.signatureImage ? (
              <div className="space-y-1 text-center">
                <img
                  src={workflow.reviewedBy.signatureImage}
                  alt="Firma Revisó"
                  className="max-h-12 max-w-full object-contain mx-auto bg-white p-0.5 rounded border border-slate-200"
                />
                <span className="text-[9px] text-emerald-700 font-mono block">Firma PNG Verificada ✓</span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic text-center py-1">Sin firma gráfica</div>
            )}

            {isEditMode && onUpdate && (
              <div className="flex gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setActiveModalStage('reviewedBy')}
                  className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold rounded cursor-pointer transition shadow-2xs"
                >
                  <PenTool className="w-3 h-3 text-cyan-400" />
                  <span>{workflow?.reviewedBy?.signatureImage ? 'Cambiar Firma PNG' : 'Subir Firma PNG'}</span>
                </button>
                {workflow?.reviewedBy?.signatureImage && (
                  <button
                    type="button"
                    onClick={() => handleClearSignature('reviewedBy')}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded border border-slate-200 bg-white cursor-pointer"
                    title="Borrar firma"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Aprobó */}
        <div className="p-3 bg-slate-50/50 space-y-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
              Aprobó (Gerencia General):
            </span>
            {isEditMode && onUpdate ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={workflow?.approvedBy?.name || ''}
                  onChange={(e) => handleFieldChange('approvedBy', 'name', e.target.value)}
                  placeholder="Nombre de quién aprobó (editable)"
                  className="w-full px-2 py-1 border border-slate-300 rounded font-semibold text-slate-900 bg-white text-xs focus:outline-cyan-600"
                />
                <input
                  type="text"
                  value={workflow?.approvedBy?.position || ''}
                  onChange={(e) => handleFieldChange('approvedBy', 'position', e.target.value)}
                  placeholder="Cargo"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-700 bg-white text-[11px] focus:outline-cyan-600"
                />
                <input
                  type="text"
                  value={workflow?.approvedBy?.date || ''}
                  onChange={(e) => handleFieldChange('approvedBy', 'date', e.target.value)}
                  placeholder="Fecha (ej. Febrero 14 de 2026)"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-slate-600 bg-white font-mono text-[10px] focus:outline-cyan-600"
                />
              </div>
            ) : (
              <>
                <div className="font-semibold text-slate-900 mt-0.5">
                  {workflow?.approvedBy?.name || 'Gerencia General'}
                </div>
                <div className="text-[11px] text-slate-600">
                  {workflow?.approvedBy?.position || 'Gerente General / Representante Legal'}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Fecha: {workflow?.approvedBy?.date || 'Febrero de 2024'}
                </div>
              </>
            )}
          </div>

          {/* Signature PNG Image rendering & change button */}
          <div className="pt-2 border-t border-slate-200">
            {workflow?.approvedBy?.signatureImage ? (
              <div className="space-y-1 text-center">
                <img
                  src={workflow.approvedBy.signatureImage}
                  alt="Firma Aprobó"
                  className="max-h-12 max-w-full object-contain mx-auto bg-white p-0.5 rounded border border-slate-200"
                />
                <span className="text-[9px] text-emerald-700 font-mono block">Firma PNG Verificada ✓</span>
              </div>
            ) : (
              <div className="text-[10px] text-slate-400 italic text-center py-1">Sin firma gráfica</div>
            )}

            {isEditMode && onUpdate && (
              <div className="flex gap-1 mt-1">
                <button
                  type="button"
                  onClick={() => setActiveModalStage('approvedBy')}
                  className="flex-1 flex items-center justify-center gap-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold rounded cursor-pointer transition shadow-2xs"
                >
                  <PenTool className="w-3 h-3 text-cyan-400" />
                  <span>{workflow?.approvedBy?.signatureImage ? 'Cambiar Firma PNG' : 'Subir Firma PNG'}</span>
                </button>
                {workflow?.approvedBy?.signatureImage && (
                  <button
                    type="button"
                    onClick={() => handleClearSignature('approvedBy')}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded border border-slate-200 bg-white cursor-pointer"
                    title="Borrar firma"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Modal for Approval Footer */}
      {activeModalStage && (
        <SignatureModal
          isOpen={!!activeModalStage}
          onClose={() => setActiveModalStage(null)}
          title={`Firma de ${
            activeModalStage === 'elaboratedBy'
              ? 'Elaboró (Auditor Líder)'
              : activeModalStage === 'reviewedBy'
              ? 'Revisó (Director de Calidad)'
              : 'Aprobó (Gerencia General)'
          }`}
          initialSignerName={workflow[activeModalStage]?.name}
          currentSignature={workflow[activeModalStage]?.signatureImage}
          onSaveSignature={handleSaveSignature}
        />
      )}
    </>
  );
};
