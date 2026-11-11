import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuditProgram,
  AuditPlan,
  OpeningMinute,
  ChecklistItem,
  ClosingMinute,
  FinalReport,
  AuditorEvaluation,
  ModuleTab,
  AuditRisk,
  NonConformityStrict,
  ComplianceStatus,
  CriterionCategory,
  FormatMetadata,
  ScheduledProcess,
  ReferenceDocument,
  ItineraryItem,
  MeetingAttendee,
  AuditorEvaluationItem,
  SimulatorDifficulty,
} from '../types/audit';
import {
  INITIAL_PROGRAM,
  INITIAL_PLAN,
  INITIAL_OPENING,
  INITIAL_CHECKLIST,
  INITIAL_CLOSING,
  INITIAL_FINAL_REPORT,
  INITIAL_AUDITOR_EVALUATION,
} from '../data/initialData';

interface AuditContextType {
  activeTab: ModuleTab;
  setActiveTab: (tab: ModuleTab) => void;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  saveNotification: string | null;
  triggerSaveNotification: (msg?: string) => void;

  // Documents
  program: AuditProgram;
  setProgram: React.Dispatch<React.SetStateAction<AuditProgram>>;
  plan: AuditPlan;
  setPlan: React.Dispatch<React.SetStateAction<AuditPlan>>;
  opening: OpeningMinute;
  setOpening: React.Dispatch<React.SetStateAction<OpeningMinute>>;
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  closing: ClosingMinute;
  setClosing: React.Dispatch<React.SetStateAction<ClosingMinute>>;
  finalReport: FinalReport;
  setFinalReport: React.Dispatch<React.SetStateAction<FinalReport>>;
  auditorEvaluation: AuditorEvaluation;
  setAuditorEvaluation: React.Dispatch<React.SetStateAction<AuditorEvaluation>>;

  // Global Metadata and Approval Workflow
  updateFormatMetadata: (formatCode: string, metadataUpdates: Partial<FormatMetadata>) => void;
  updateWorkflowSignatures: (
    formatCode: string,
    field: 'elaboratedBy' | 'reviewedBy' | 'approvedBy',
    data: { name: string; position: string; date: string }
  ) => void;

  // Module 1 Actions (FO-MCO-17)
  addAuditRisk: (risk: Omit<AuditRisk, 'id' | 'fxs'>) => void;
  updateAuditRisk: (id: string, updated: Partial<AuditRisk>) => void;
  deleteAuditRisk: (id: string) => void;
  addScheduledProcess: (proc: Omit<ScheduledProcess, 'id'>) => void;
  updateScheduledProcess: (id: string, updated: Partial<ScheduledProcess>) => void;
  deleteScheduledProcess: (id: string) => void;
  addAuditTeamMember: (member: string) => void;
  deleteAuditTeamMember: (index: number) => void;

  // Module 2 Actions (FO-MCO-18)
  addReferenceDocument: (doc: Omit<ReferenceDocument, 'id'>) => void;
  updateReferenceDocument: (id: string, updated: Partial<ReferenceDocument>) => void;
  deleteReferenceDocument: (id: string) => void;
  addItineraryItem: (item: Omit<ItineraryItem, 'id'>) => void;
  updateItineraryItem: (id: string, updated: Partial<ItineraryItem>) => void;
  deleteItineraryItem: (id: string) => void;
  toggleItineraryStatus: (id: string) => void;

  // Module 3 Actions (FO-MCO-20)
  addOpeningAttendee: (attendee: Omit<MeetingAttendee, 'id'>) => void;
  deleteOpeningAttendee: (id: string) => void;
  toggleOpeningAttendeeSignature: (id: string) => void;

  // Module 4 Actions (FO-MCO-19)
  updateChecklistItemStatus: (
    id: string,
    status: ComplianceStatus,
    evidence?: string,
    observations?: string
  ) => void;
  updateChecklistItem: (id: string, updated: Partial<ChecklistItem>) => void;
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'itemNumber'>) => void;
  deleteChecklistItem: (id: string) => void;

  // Module 5 Actions (FO-MCO-21 & FO-MCO-22)
  addClosingAttendee: (attendee: Omit<MeetingAttendee, 'id'>) => void;
  deleteClosingAttendee: (id: string) => void;
  toggleClosingAttendeeSignature: (id: string) => void;
  addNonConformity: (nc: Omit<NonConformityStrict, 'id' | 'codeNC'>) => void;
  updateNonConformity: (id: string, updated: Partial<NonConformityStrict>) => void;
  deleteNonConformity: (id: string) => void;
  addStrength: (text: string, justification: string) => void;
  deleteStrength: (id: string) => void;
  addOpportunity: (text: string, affectedRequirement: string) => void;
  deleteOpportunity: (id: string) => void;

  // Module 7 Evaluation (FO-MCO-23)
  updateAuditorEvaluationAspect: (id: number, score: 1 | 2 | 3 | 4 | 5, comments?: string) => void;

  // Export & Utilities
  exportToExcel: (formatCode?: string) => void;
  exportToWord: (formatCode?: string) => void;
  exportToJSON: (formatCode?: string) => void;
  resetAllToFactory: () => void;
  downloadEmptyTemplate: () => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROGRAM: 'impresos_eldia_audit_program_v2',
  PLAN: 'impresos_eldia_audit_plan_v2',
  OPENING: 'impresos_eldia_audit_opening_v2',
  CHECKLIST: 'impresos_eldia_audit_checklist_v2',
  CLOSING: 'impresos_eldia_audit_closing_v2',
  REPORT: 'impresos_eldia_audit_report_v2',
  EVAL: 'impresos_eldia_audit_eval_v2',
  EDIT_MODE: 'impresos_eldia_audit_edit_mode',
};

export const AuditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('module1_program');
  const [isEditMode, setIsEditMode] = useState<boolean>(true); // Default to dynamic edit mode
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const triggerSaveNotification = (msg: string = 'Cambios guardados con éxito en almacenamiento local') => {
    setSaveNotification(msg);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const cleanLegacySignature = (val?: string): string => {
    if (!val) return '';
    if (typeof val === 'string' && val.includes('Noralba')) {
      return '';
    }
    return val;
  };

  const [program, setProgram] = useState<AuditProgram>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAM);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.leadAuditorSignature = cleanLegacySignature(parsed.leadAuditorSignature);
        return parsed;
      }
      return INITIAL_PROGRAM;
    } catch {
      return INITIAL_PROGRAM;
    }
  });

  const [plan, setPlan] = useState<AuditPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.leadAuditorSignature = cleanLegacySignature(parsed.leadAuditorSignature);
        return parsed;
      }
      return INITIAL_PLAN;
    } catch {
      return INITIAL_PLAN;
    }
  });

  const [opening, setOpening] = useState<OpeningMinute>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.OPENING);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.leadAuditorSignature = cleanLegacySignature(parsed.leadAuditorSignature);
        if (parsed.attendees) {
          parsed.attendees = parsed.attendees.map((att: MeetingAttendee) =>
            att.name.includes('Noralba')
              ? { ...att, name: 'Auditor Líder SGC', signature: false, signatureDate: '', signatureImage: undefined }
              : att
          );
        }
        return parsed;
      }
      return INITIAL_OPENING;
    } catch {
      return INITIAL_OPENING;
    }
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
      return saved ? JSON.parse(saved) : INITIAL_CHECKLIST;
    } catch {
      return INITIAL_CHECKLIST;
    }
  });

  const [closing, setClosing] = useState<ClosingMinute>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLOSING);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.leadAuditorSignature = cleanLegacySignature(parsed.leadAuditorSignature);
        if (parsed.attendees) {
          parsed.attendees = parsed.attendees.map((att: MeetingAttendee) =>
            att.name.includes('Noralba')
              ? { ...att, name: 'Auditor Líder SGC', signature: false, signatureDate: '', signatureImage: undefined }
              : att
          );
        }
        return parsed;
      }
      return INITIAL_CLOSING;
    } catch {
      return INITIAL_CLOSING;
    }
  });

  const [finalReport, setFinalReport] = useState<FinalReport>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORT);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.leadAuditorSignature = cleanLegacySignature(parsed.leadAuditorSignature);
        return parsed;
      }
      return INITIAL_FINAL_REPORT;
    } catch {
      return INITIAL_FINAL_REPORT;
    }
  });

  const [auditorEvaluation, setAuditorEvaluation] = useState<AuditorEvaluation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        parsed.evaluatorSignature = cleanLegacySignature(parsed.evaluatorSignature);
        return parsed;
      }
      return INITIAL_AUDITOR_EVALUATION;
    } catch {
      return INITIAL_AUDITOR_EVALUATION;
    }
  });

  // Local storage auto-sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRAM, JSON.stringify(program));
    } catch (e) {
      console.warn('Failed to save program', e);
    }
  }, [program]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAN, JSON.stringify(plan));
    } catch (e) {
      console.warn('Failed to save plan', e);
    }
  }, [plan]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.OPENING, JSON.stringify(opening));
    } catch (e) {
      console.warn('Failed to save opening', e);
    }
  }, [opening]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
    } catch (e) {
      console.warn('Failed to save checklist', e);
    }
  }, [checklist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLOSING, JSON.stringify(closing));
    } catch (e) {
      console.warn('Failed to save closing', e);
    }
  }, [closing]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORT, JSON.stringify(finalReport));
    } catch (e) {
      console.warn('Failed to save report', e);
    }
  }, [finalReport]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVAL, JSON.stringify(auditorEvaluation));
    } catch (e) {
      console.warn('Failed to save eval', e);
    }
  }, [auditorEvaluation]);

  // Global Metadata and Workflow Update
  const updateFormatMetadata = (formatCode: string, metadataUpdates: Partial<FormatMetadata>) => {
    if (formatCode === 'FO-MCO-17') {
      setProgram((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    } else if (formatCode === 'FO-MCO-18') {
      setPlan((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    } else if (formatCode === 'FO-MCO-20') {
      setOpening((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    } else if (formatCode === 'FO-MCO-21') {
      setClosing((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    } else if (formatCode === 'FO-MCO-22') {
      setFinalReport((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    } else if (formatCode === 'FO-MCO-23') {
      setAuditorEvaluation((prev) => ({ ...prev, metadata: { ...prev.metadata, ...metadataUpdates } }));
    }
    triggerSaveNotification(`Encabezado de ${formatCode} actualizado`);
  };

  const updateWorkflowSignatures = (
    formatCode: string,
    field: 'elaboratedBy' | 'reviewedBy' | 'approvedBy',
    data: { name: string; position: string; date: string }
  ) => {
    const updater = (prevMeta: FormatMetadata) => ({
      ...prevMeta,
      approvalWorkflow: {
        ...prevMeta.approvalWorkflow,
        [field]: data,
      },
    });

    if (formatCode === 'FO-MCO-17') setProgram((p) => ({ ...p, metadata: updater(p.metadata) }));
    else if (formatCode === 'FO-MCO-18') setPlan((p) => ({ ...p, metadata: updater(p.metadata) }));
    else if (formatCode === 'FO-MCO-20') setOpening((p) => ({ ...p, metadata: updater(p.metadata) }));
    else if (formatCode === 'FO-MCO-21') setClosing((p) => ({ ...p, metadata: updater(p.metadata) }));
    else if (formatCode === 'FO-MCO-22') setFinalReport((p) => ({ ...p, metadata: updater(p.metadata) }));
    else if (formatCode === 'FO-MCO-23') setAuditorEvaluation((p) => ({ ...p, metadata: updater(p.metadata) }));
    triggerSaveNotification(`Firma de ${field} actualizada`);
  };

  // Module 1 Actions
  const addAuditRisk = (riskData: Omit<AuditRisk, 'id' | 'fxs'>) => {
    const fxs = riskData.frequency * riskData.severity;
    setProgram((prev) => ({
      ...prev,
      risks: [
        ...prev.risks,
        {
          ...riskData,
          id: `risk-${Date.now()}`,
          fxs,
        },
      ],
    }));
    triggerSaveNotification('Riesgo agregado al programa');
  };

  const updateAuditRisk = (id: string, updated: Partial<AuditRisk>) => {
    setProgram((prev) => ({
      ...prev,
      risks: prev.risks.map((r) => {
        if (r.id !== id) return r;
        const newFreq = updated.frequency !== undefined ? updated.frequency : r.frequency;
        const newSev = updated.severity !== undefined ? updated.severity : r.severity;
        return {
          ...r,
          ...updated,
          frequency: newFreq,
          severity: newSev,
          fxs: newFreq * newSev,
        };
      }),
    }));
  };

  const deleteAuditRisk = (id: string) => {
    setProgram((prev) => ({
      ...prev,
      risks: prev.risks.filter((r) => r.id !== id),
    }));
    triggerSaveNotification('Riesgo eliminado');
  };

  const addScheduledProcess = (procData: Omit<ScheduledProcess, 'id'>) => {
    setProgram((prev) => ({
      ...prev,
      processes: [...prev.processes, { ...procData, id: `proc-${Date.now()}` }],
    }));
    triggerSaveNotification('Proceso agregado al cronograma');
  };

  const updateScheduledProcess = (id: string, updated: Partial<ScheduledProcess>) => {
    setProgram((prev) => ({
      ...prev,
      processes: prev.processes.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    }));
  };

  const deleteScheduledProcess = (id: string) => {
    setProgram((prev) => ({
      ...prev,
      processes: prev.processes.filter((p) => p.id !== id),
    }));
    triggerSaveNotification('Proceso eliminado del cronograma');
  };

  const addAuditTeamMember = (member: string) => {
    if (!member.trim()) return;
    setProgram((prev) => ({
      ...prev,
      auditTeam: [...prev.auditTeam, member.trim()],
    }));
    triggerSaveNotification('Miembro añadido al equipo auditor');
  };

  const deleteAuditTeamMember = (index: number) => {
    setProgram((prev) => ({
      ...prev,
      auditTeam: prev.auditTeam.filter((_, idx) => idx !== index),
    }));
  };

  // Module 2 Actions
  const addReferenceDocument = (docData: Omit<ReferenceDocument, 'id'>) => {
    setPlan((prev) => ({
      ...prev,
      referenceDocuments: [...prev.referenceDocuments, { ...docData, id: `doc-${Date.now()}` }],
    }));
    triggerSaveNotification('Documento de referencia agregado');
  };

  const updateReferenceDocument = (id: string, updated: Partial<ReferenceDocument>) => {
    setPlan((prev) => ({
      ...prev,
      referenceDocuments: prev.referenceDocuments.map((d) => (d.id === id ? { ...d, ...updated } : d)),
    }));
  };

  const deleteReferenceDocument = (id: string) => {
    setPlan((prev) => ({
      ...prev,
      referenceDocuments: prev.referenceDocuments.filter((d) => d.id !== id),
    }));
    triggerSaveNotification('Documento eliminado');
  };

  const addItineraryItem = (itemData: Omit<ItineraryItem, 'id'>) => {
    setPlan((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { ...itemData, id: `itin-${Date.now()}` }],
    }));
    triggerSaveNotification('Actividad agregada al itinerario');
  };

  const updateItineraryItem = (id: string, updated: Partial<ItineraryItem>) => {
    setPlan((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((it) => (it.id === id ? { ...it, ...updated } : it)),
    }));
  };

  const deleteItineraryItem = (id: string) => {
    setPlan((prev) => ({
      ...prev,
      itinerary: prev.itinerary.filter((it) => it.id !== id),
    }));
    triggerSaveNotification('Bloque de itinerario eliminado');
  };

  const toggleItineraryStatus = (id: string) => {
    setPlan((prev) => ({
      ...prev,
      itinerary: prev.itinerary.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)),
    }));
  };

  // Module 3 Actions
  const addOpeningAttendee = (attendee: Omit<MeetingAttendee, 'id'>) => {
    setOpening((prev) => ({
      ...prev,
      attendees: [...prev.attendees, { ...attendee, id: `att-${Date.now()}` }],
    }));
    triggerSaveNotification('Asistente registrado en apertura');
  };

  const deleteOpeningAttendee = (id: string) => {
    setOpening((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a.id !== id),
    }));
  };

  const toggleOpeningAttendeeSignature = (id: string) => {
    setOpening((prev) => ({
      ...prev,
      attendees: prev.attendees.map((att) =>
        att.id === id
          ? {
              ...att,
              signature: !att.signature,
              signatureDate: !att.signature ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
            }
          : att
      ),
    }));
  };

  // Module 4 Actions
  const updateChecklistItemStatus = (
    id: string,
    status: ComplianceStatus,
    evidence?: string,
    observations?: string
  ) => {
    setChecklist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          status,
          objectiveEvidence: evidence !== undefined ? evidence : item.objectiveEvidence,
          observations: observations !== undefined ? observations : item.observations,
        };
      })
    );
  };

  const updateChecklistItem = (id: string, updated: Partial<ChecklistItem>) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const addChecklistItem = (itemData: Omit<ChecklistItem, 'id' | 'itemNumber'>) => {
    setChecklist((prev) => [
      ...prev,
      {
        ...itemData,
        id: `chk-${Date.now()}`,
        itemNumber: prev.length + 1,
      },
    ]);
    triggerSaveNotification('Pregunta agregada a la lista de verificación');
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.filter((i) => i.id !== id).map((item, idx) => ({ ...item, itemNumber: idx + 1 }))
    );
    triggerSaveNotification('Ítem eliminado de la lista de verificación');
  };

  // Module 5 Actions
  const addClosingAttendee = (attendee: Omit<MeetingAttendee, 'id'>) => {
    setClosing((prev) => ({
      ...prev,
      attendees: [...prev.attendees, { ...attendee, id: `att-c-${Date.now()}` }],
    }));
    triggerSaveNotification('Asistente registrado en acta de cierre');
  };

  const deleteClosingAttendee = (id: string) => {
    setClosing((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a) => a.id !== id),
    }));
  };

  const toggleClosingAttendeeSignature = (id: string) => {
    setClosing((prev) => ({
      ...prev,
      attendees: prev.attendees.map((att) =>
        att.id === id
          ? {
              ...att,
              signature: !att.signature,
              signatureDate: !att.signature ? new Date().toISOString().replace('T', ' ').substring(0, 16) : undefined,
            }
          : att
      ),
    }));
  };

  const addNonConformity = (ncData: Omit<NonConformityStrict, 'id' | 'codeNC'>) => {
    setFinalReport((prev) => {
      const nextCode = `NC-${String(prev.nonConformities.length + 1).padStart(2, '0')}`;
      const newNC: NonConformityStrict = {
        ...ncData,
        id: `nc-${Date.now()}`,
        codeNC: nextCode,
      };

      const newFinding = {
        id: `f-${Date.now()}`,
        finding: ncData.whatWasFound,
        classification: 'NC' as const,
        requirementBreached: ncData.standardClause,
        process: ncData.process,
      };

      return {
        ...prev,
        nonConformities: [...prev.nonConformities, newNC],
        findings: [...prev.findings, newFinding],
      };
    });
    triggerSaveNotification('No Conformidad estructurada y registrada');
  };

  const updateNonConformity = (id: string, updated: Partial<NonConformityStrict>) => {
    setFinalReport((prev) => ({
      ...prev,
      nonConformities: prev.nonConformities.map((nc) => (nc.id === id ? { ...nc, ...updated } : nc)),
    }));
    triggerSaveNotification('No Conformidad actualizada');
  };

  const deleteNonConformity = (id: string) => {
    setFinalReport((prev) => ({
      ...prev,
      nonConformities: prev.nonConformities.filter((nc) => nc.id !== id),
    }));
    triggerSaveNotification('No Conformidad eliminada');
  };

  const addStrength = (text: string, justification: string) => {
    setFinalReport((prev) => ({
      ...prev,
      strengths: [...prev.strengths, { id: `str-${Date.now()}`, text, justification }],
    }));
    triggerSaveNotification('Fortaleza agregada al informe');
  };

  const deleteStrength = (id: string) => {
    setFinalReport((prev) => ({
      ...prev,
      strengths: prev.strengths.filter((s) => s.id !== id),
    }));
  };

  const addOpportunity = (text: string, affectedRequirement: string) => {
    setFinalReport((prev) => ({
      ...prev,
      opportunitiesForImprovement: [
        ...prev.opportunitiesForImprovement,
        { id: `opp-${Date.now()}`, text, affectedRequirement },
      ],
    }));
    triggerSaveNotification('Oportunidad de mejora agregada');
  };

  const deleteOpportunity = (id: string) => {
    setFinalReport((prev) => ({
      ...prev,
      opportunitiesForImprovement: prev.opportunitiesForImprovement.filter((o) => o.id !== id),
    }));
  };

  // Module 7 Evaluation Actions
  const updateAuditorEvaluationAspect = (id: number, score: 1 | 2 | 3 | 4 | 5, comments?: string) => {
    setAuditorEvaluation((prev) => ({
      ...prev,
      aspects: prev.aspects.map((asp) => (asp.id === id ? { ...asp, score, comments: comments !== undefined ? comments : asp.comments } : asp)),
    }));
  };

  // Export functions
  const exportToExcel = (formatCode?: string) => {
    // Generate CSV data with BOM for Excel Spanish compatibility
    let csvContent = '\uFEFF';
    const target = formatCode || 'FO-MCO-19';

    if (target === 'FO-MCO-19') {
      csvContent += 'Item,Criterio,Numeral Norma,Pregunta o Aspecto a Verificar,Calificación,Evidencia Objetiva,Observaciones\n';
      checklist.forEach((item) => {
        csvContent += `"${item.itemNumber}","${item.criterion}","${item.standardClause}","${item.question.replace(/"/g, '""')}","${item.status}","${item.objectiveEvidence.replace(/"/g, '""')}","${item.observations.replace(/"/g, '""')}"\n`;
      });
    } else if (target === 'FO-MCO-17') {
      csvContent += 'Riesgo Identificado,Frecuencia (F),Severidad (S),Valoracion (FxS),Consecuencias,Controles a Implementar\n';
      program.risks.forEach((r) => {
        csvContent += `"${r.risk.replace(/"/g, '""')}","${r.frequency}","${r.severity}","${r.fxs}","${r.consequences.join('; ')}","${r.controls.join('; ')}"\n`;
      });
    } else if (target === 'FO-MCO-22') {
      csvContent += 'Código NC,Proceso,¿Qué se encontró?,Norma infringida,¿Cómo viola la norma?,Consecuencias / Riesgos,Plan de Acción,Plazo (días),Responsable\n';
      finalReport.nonConformities.forEach((nc) => {
        csvContent += `"${nc.codeNC}","${nc.process}","${nc.whatWasFound.replace(/"/g, '""')}","${nc.standardClause}","${nc.howItViolates.replace(/"/g, '""')}","${nc.consequences.replace(/"/g, '""')}","${nc.correctiveActionPlan.replace(/"/g, '""')}","${nc.deadlineDays}","${nc.responsible}"\n`;
      });
    } else {
      csvContent += 'Formato,Proceso,Versión,Fecha Aprobación\n';
      csvContent += `"${target}","${program.metadata.processOrPosition}","${program.metadata.version}","${program.metadata.approvalDate}"\n`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${target}_Impresos_El_Dia.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSaveNotification(`Archivo Excel/CSV exportado exitosamente`);
  };

  const exportToWord = (formatCode?: string) => {
    // Generate clean HTML document formatted for MS Word (.doc)
    const target = formatCode || 'FO-MCO-22';
    const htmlHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${target} - Impresos El Día</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; margin: 20mm; }
        h1, h2, h3 { color: #0f172a; text-transform: uppercase; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15pt; }
        th, td { border: 1pt solid #cbd5e1; padding: 6pt; font-size: 9.5pt; text-align: left; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .header-box { border: 1.5pt solid #0f172a; padding: 10pt; margin-bottom: 15pt; }
      </style>
      </head><body>
    `;

    let htmlBody = `
      <div class="header-box">
        <table style="border:none;">
          <tr>
            <td style="border:none; width:60%;">
              <h2>IMPRESOS EL DÍA S.A.S.</h2>
              <p>SISTEMA DE GESTIÓN DE LA CALIDAD (ISO 9001:2015)</p>
            </td>
            <td style="border:none; width:40%; text-align:right;">
              <p><strong>Código:</strong> ${target}</p>
              <p><strong>Copia:</strong> COPIA CONTROLADA</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CO')}</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    if (target === 'FO-MCO-22') {
      htmlBody += `
        <h3>INFORME FINAL DE AUDITORÍA INTERNA DE CALIDAD</h3>
        <p><strong>Proceso:</strong> ${finalReport.auditedProcess}</p>
        <p><strong>Criterios:</strong> ${finalReport.criteria}</p>
        <h4>Hallazgos de No Conformidad:</h4>
      `;
      finalReport.nonConformities.forEach((nc) => {
        htmlBody += `
          <div style="border:1pt solid #e2e8f0; padding:8pt; margin-bottom:10pt;">
            <p><strong>${nc.codeNC} - ${nc.process}</strong> (Plazo: ${nc.deadlineDays} días)</p>
            <p><strong>1. Hallazgo:</strong> ${nc.whatWasFound}</p>
            <p><strong>2. Norma infringida:</strong> ${nc.standardClause}</p>
            <p><strong>3. Desviación:</strong> ${nc.howItViolates}</p>
            <p><strong>4. Consecuencias:</strong> ${nc.consequences}</p>
            <p><strong>5. Plan de acción:</strong> ${nc.correctiveActionPlan} (Resp: ${nc.responsible})</p>
          </div>
        `;
      });
    } else {
      htmlBody += `<h3>${target} - Documento Oficial SGC</h3><p>Generado desde la plataforma interactiva de Impresos El Día S.A.S.</p>`;
    }

    const htmlContent = htmlHeader + htmlBody + '</body></html>';
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${target}_Impresos_El_Dia.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSaveNotification(`Documento Word (.doc) exportado exitosamente`);
  };

  const exportToJSON = (formatCode?: string) => {
    const fullDataset = {
      empresa: 'Impresos El Día S.A.S.',
      sistema: 'SGC ISO 9001:2015',
      fechaExportacion: new Date().toISOString(),
      program,
      plan,
      opening,
      checklist,
      closing,
      finalReport,
      auditorEvaluation,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(fullDataset, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `SGC_Impresos_El_Dia_Completo.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSaveNotification(`Copia completa JSON exportada exitosamente`);
  };

  const downloadEmptyTemplate = () => {
    const emptyProgram: AuditProgram = {
      ...INITIAL_PROGRAM,
      year: new Date().getFullYear(),
      cycle: '02',
      startDate: '',
      endDate: '',
      leadAuditor: '',
      auditTeam: [],
      processes: [],
      risks: [],
      observations: '',
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(emptyProgram, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `Plantilla_Vacia_FO_MCO_17.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSaveNotification(`Plantilla vacía descargada`);
  };

  const resetAllToFactory = () => {
    if (
      window.confirm(
        '¿Está seguro de restaurar todos los formatos y datos oficiales de Impresos El Día? Se reestablecerán las plantillas originales de la organización.'
      )
    ) {
      setProgram(INITIAL_PROGRAM);
      setPlan(INITIAL_PLAN);
      setOpening(INITIAL_OPENING);
      setChecklist(INITIAL_CHECKLIST);
      setClosing(INITIAL_CLOSING);
      setFinalReport(INITIAL_FINAL_REPORT);
      setAuditorEvaluation(INITIAL_AUDITOR_EVALUATION);
      localStorage.clear();
      triggerSaveNotification('Datos oficiales restaurados por defecto');
    }
  };

  return (
    <AuditContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isEditMode,
        setIsEditMode,
        saveNotification,
        triggerSaveNotification,
        program,
        setProgram,
        plan,
        setPlan,
        opening,
        setOpening,
        checklist,
        setChecklist,
        closing,
        setClosing,
        finalReport,
        setFinalReport,
        auditorEvaluation,
        setAuditorEvaluation,
        updateFormatMetadata,
        updateWorkflowSignatures,
        addAuditRisk,
        updateAuditRisk,
        deleteAuditRisk,
        addScheduledProcess,
        updateScheduledProcess,
        deleteScheduledProcess,
        addAuditTeamMember,
        deleteAuditTeamMember,
        addReferenceDocument,
        updateReferenceDocument,
        deleteReferenceDocument,
        addItineraryItem,
        updateItineraryItem,
        deleteItineraryItem,
        toggleItineraryStatus,
        addOpeningAttendee,
        deleteOpeningAttendee,
        toggleOpeningAttendeeSignature,
        updateChecklistItemStatus,
        updateChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        addClosingAttendee,
        deleteClosingAttendee,
        toggleClosingAttendeeSignature,
        addNonConformity,
        updateNonConformity,
        deleteNonConformity,
        addStrength,
        deleteStrength,
        addOpportunity,
        deleteOpportunity,
        updateAuditorEvaluationAspect,
        exportToExcel,
        exportToWord,
        exportToJSON,
        resetAllToFactory,
        downloadEmptyTemplate,
      }}
    >
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = () => {
  const context = useContext(AuditContext);
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};
