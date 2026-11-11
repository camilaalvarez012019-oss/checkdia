export type ModuleTab =
  | 'module1_program'
  | 'module2_plan'
  | 'module3_opening'
  | 'module4_checklist'
  | 'module5_closing_report'
  | 'module6_simulator'
  | 'module7_evaluation';

export type CriterionCategory =
  | 'Normas legales'
  | 'Normas técnicas'
  | 'Caracterización del proceso'
  | 'Formatos y plataformas utilizados';

export type ComplianceStatus = 'CONFORME' | 'NO_CONFORME' | 'NO_APLICA' | 'OBSERVACION' | 'PENDIENTE';

export type SimulatorDifficulty = 'cooperativo' | 'riguroso' | 'evasivo';

export interface DocumentApprovalWorkflow {
  elaboratedBy: { name: string; position: string; date: string; signatureImage?: string };
  reviewedBy: { name: string; position: string; date: string; signatureImage?: string };
  approvedBy: { name: string; position: string; date: string; signatureImage?: string };
}

export interface FormatMetadata {
  processOrPosition: string; // e.g. "Coordinador de Producción", "Diseñador de Preprensa", "Operador Litográfico"
  code: string; // e.g. FO-MCO-17
  version: string; // e.g. 02
  approvalDate: string; // e.g. Febrero 14 de 2024
  copyControl: 'COPIA CONTROLADA' | 'COPIA NO CONTROLADA';
  pageNumber?: string;
  approvalWorkflow: DocumentApprovalWorkflow;
}

export interface AuditRisk {
  id: string;
  risk: string;
  frequency: number; // 1 to 5
  severity: number; // 10, 20, 30, etc.
  fxs: number; // calculated: frequency * severity
  consequences: string[];
  controls: string[];
}

export interface ScheduledProcess {
  id: string;
  auditNumber: string;
  process: string;
  standardClause: string;
  scheduledDate: string;
  scheduledTime: string;
  executedDate?: string;
  executedTime?: string;
  leadAuditor: string;
  assistantAuditor: string;
  status: 'PROGRAMADA' | 'EN_EJECUCION' | 'COMPLETADA';
}

export interface AuditProgram {
  metadata: FormatMetadata;
  year: number;
  cycle: string;
  startDate: string;
  endDate: string;
  criteria: string;
  leadAuditor: string;
  auditTeam: string[];
  auditedProcess: string;
  objective: string[];
  scope: string;
  resources: string;
  processes: ScheduledProcess[];
  risks: AuditRisk[];
  observations: string;
  leadAuditorSignature?: string;
  leadAuditorSignatureDate?: string;
}

export interface ReferenceDocument {
  id: string;
  name: string;
  code: string;
  version: string;
  standardClause: string;
}

export interface ItineraryItem {
  id: string;
  activity: string;
  auditee: string;
  auditor: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  completed?: boolean;
}

export interface AuditPlan {
  metadata: FormatMetadata;
  cycle: string;
  auditNumber: string;
  process: string;
  leadAuditor: string;
  assistantAuditors: string[];
  objective: string[];
  scope: string;
  criterion: string;
  methodology: {
    directObservation: boolean;
    lowIntervention: boolean;
    interviews: boolean;
    documentaryReview: boolean;
    description: string;
    keyQuestionsGuide: string;
  };
  alignment: {
    mission: string;
    vision: string;
    processCharacterizationUrl?: string;
    description: string;
  };
  referenceDocuments: ReferenceDocument[];
  itinerary: ItineraryItem[];
  leadAuditorSignature?: string;
  assistantAuditorSignature?: string;
  auditeeSignature?: string;
}

export interface MeetingAttendee {
  id: string;
  name: string;
  position: string;
  signature: boolean;
  signatureImage?: string; // PNG or digital signature data URL
  signatureDate?: string;
}

export interface AgendaItem {
  id: string;
  time: string;
  requirement: string;
  activity: string;
  auditee: string;
  auditors: string;
}

export interface OrderOfDayPoint {
  id: string;
  orderNumber: number;
  title: string;
  description: string;
  completed: boolean;
}

export interface OpeningMinute {
  metadata: FormatMetadata;
  date: string;
  time: string;
  location: string;
  auditedArea: string;
  attendees: MeetingAttendee[];
  objective: string[];
  scope: string;
  methodology: string;
  agenda: AgendaItem[];
  orderOfDay: {
    presentationCompleted: boolean;
    planConfirmed: boolean;
    qaCompleted: boolean;
    closingMeetingConfirmed: boolean;
    notes: string;
  };
  orderOfDayPoints?: OrderOfDayPoint[];
  observations: string;
  leadAuditorName?: string;
  leadAuditorRole?: string;
  leadAuditorSignature?: string;
  leadAuditorSignedDate?: string;
  processLeaderName?: string;
  processLeaderRole?: string;
  processLeaderSignature?: string;
  processLeaderSignedDate?: string;
}

export interface ChecklistItem {
  id: string;
  itemNumber: number;
  criterion: CriterionCategory;
  standardClause: string; // e.g. 'ISO 9001:2015 8.5.1', 'Res. 1362/2007'
  question: string;
  targetRole?: string; // Cargo específico al que va dirigida la pregunta
  directObservationNotes?: string; // Aspecto específico a observar directamente
  guideQuestions?: string[];
  status: ComplianceStatus;
  objectiveEvidence: string;
  observations: string;
  auditedProcess: string;
}

export interface NonConformityStrict {
  id: string;
  codeNC: string; // e.g., NC-01
  process: string;
  // 5 strict required parts:
  whatWasFound: string; // 1. ¿Qué se encontró? (Descripción del hallazgo con evidencia objetiva)
  standardClause: string; // 2. ¿Qué norma recae? (Requisito o norma incumplida)
  howItViolates: string; // 3. ¿Cómo se viola dicha norma? (Análisis de desviación)
  consequences: string; // 4. Evaluación del riesgo / consecuencias potenciales
  correctiveActionPlan: string; // 5. Plan de acción inicial / compromisos (solución, plazos y responsables)
  deadlineDays: number;
  responsible: string;
  severity: 'CRÍTICA' | 'MAYOR' | 'MENOR';
  isApproved: boolean;
}

export interface AuditFinding {
  id: string;
  finding: string;
  classification: 'OBS' | 'NC';
  requirementBreached: string;
  process: string;
}

export interface ClosingMinute {
  metadata: FormatMetadata;
  date: string;
  time: string;
  location: string;
  auditedArea: string;
  objective: string;
  scope: string;
  attendees: MeetingAttendee[];
  orderOfDay: {
    findingsPresented: boolean;
    deadlinesAgreed: boolean;
    planResponsibleAssigned: boolean;
    agreementTimeframeDays: number;
    planResponsibleName: string;
    notes: string;
  };
  observations: string;
  leadAuditorName?: string;
  leadAuditorRole?: string;
  leadAuditorSignature?: string;
  leadAuditorSignedDate?: string;
  processLeaderName?: string;
  processLeaderRole?: string;
  processLeaderSignature?: string;
  processLeaderSignedDate?: string;
}

export interface FinalReport {
  metadata: FormatMetadata;
  date: string;
  time: string;
  auditedProcess: string;
  auditees: string[];
  auditors: string[];
  objective: string[];
  scope: string;
  criteria: string;
  findings: AuditFinding[];
  strengths: { id: string; text: string; justification: string }[];
  opportunitiesForImprovement: { id: string; text: string; affectedRequirement: string }[];
  nonConformities: NonConformityStrict[];
  conclusions: string[];
  leadAuditorSignature?: string;
  processLeaderSignature?: string;
}

export interface AuditorEvaluationItem {
  id: number;
  aspect: string;
  score: 1 | 2 | 3 | 4 | 5; // 1: Malo, 2: Regular, 3: Aceptable, 4: Bueno, 5: Excelente
  comments?: string;
}

export interface AuditorEvaluation {
  metadata: FormatMetadata;
  date: string;
  auditNumbers: string;
  leadAuditorEvaluator: string;
  internalAuditorEvaluated: string;
  objective: string;
  instructions: string;
  aspects: AuditorEvaluationItem[];
  observations: string;
  resultAnalysis: string;
  evaluatorSignature?: string;
  evaluatorSignatureDate?: string;
  evaluatedSignature?: string;
  evaluatedSignatureDate?: string;
}

export interface RoleplayMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  coachingHint?: string;
  detectedFinding?: string;
}

export interface RoleplayPosition {
  id: string;
  name: string;
  department: string;
  description: string;
  keyNorms: string[];
  typicalRisks: string[];
  sampleQuestions: string[];
}
