import React, { useState } from 'react';
import { useAudit } from '../context/AuditContext';
import {
  Calendar,
  ClipboardList,
  Users,
  Search,
  FileBarChart,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ExternalLink,
  Layers,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Image as ImageIcon,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { ModuleTab } from '../types/audit';

interface FlowchartStep {
  number: number;
  id: string;
  title: string;
  shortDesc: string;
  lane: 'responsable' | 'management' | 'auditee';
  laneLabel: 'RESPONSABLE' | 'MANAGEMENT' | 'AUDITEE';
  color: string;
  icon: React.ReactNode;
  formatCode: string;
  formatTitle: string;
  targetTab: ModuleTab;
  detailedTasks: string[];
  inputs: string[];
  outputs: string[];
  decisionNode?: {
    question: string;
    yesText: string;
    noText: string;
  };
}

export const InteractiveFlowchart: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { setActiveTab, triggerSaveNotification } = useAudit();
  const [selectedStepId, setSelectedStepId] = useState<string>('step-1');
  const [showOriginalImage, setShowOriginalImage] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'step-1': true,
    'step-2': true,
    'step-3': true,
    'step-4': false,
    'step-5': false,
    'step-6': false,
    'step-7': false,
  });

  if (!isOpen) return null;

  const steps: FlowchartStep[] = [
    {
      number: 1,
      id: 'step-1',
      title: 'PLANIFICACIÓN',
      shortDesc: 'Definir alcance, objetivos y riesgos.',
      lane: 'responsable',
      laneLabel: 'RESPONSABLE',
      color: 'from-amber-500 to-amber-700',
      icon: <Calendar className="w-5 h-5 text-amber-400" />,
      formatCode: 'FO-MCO-17',
      formatTitle: 'Programa de Auditoría',
      targetTab: 'module1_program',
      detailedTasks: [
        'Definir los criterios normativos aplicables (ISO 9001:2015, ISO 14001, NTC-ISO 12647-2 de artes gráficas).',
        'Establecer el alcance del ciclo anual para las plantas de impresión offset, preprensa CTP y acabados.',
        'Evaluar la Matriz de Riesgos de Auditoría (Frecuencia × Severidad) con controles obligatorios.',
        'Asignar el Auditor Líder y el equipo auditor acompañante.',
      ],
      inputs: ['Política de calidad corporativa', 'Resultados de auditorías de ciclos anteriores', 'Mapa de procesos litográficos'],
      outputs: ['Formato FO-MCO-17 aprobado', 'Matriz de riesgos FxS validada', 'Cronograma maestro'],
    },
    {
      number: 2,
      id: 'step-2',
      title: 'PREPARACIÓN',
      shortDesc: 'Desarrollar el programa de auditoría y notificar a la gerencia.',
      lane: 'responsable',
      laneLabel: 'RESPONSABLE',
      color: 'from-amber-600 to-amber-800',
      icon: <ClipboardList className="w-5 h-5 text-amber-300" />,
      formatCode: 'FO-MCO-18',
      formatTitle: 'Plan de Auditoría',
      targetTab: 'module2_plan',
      detailedTasks: [
        'Elaborar el itinerario horario detallado por puesto de trabajo (Prensas Heidelberg, Troqueladoras, CTP).',
        'Definir la metodología de baja intervención para no interrumpir el flujo productivo ni los tirajes en caliente.',
        'Alinear los objetivos de la auditoría con la Misión, Visión y Caracterización de procesos.',
        'Listar los documentos y fichas técnicas de referencia (PR-IMP-01, PR-CAL-03, FDS químicas).',
      ],
      inputs: ['FO-MCO-17', 'Disponibilidad de turnos de planta', 'Fichas de caracterización'],
      outputs: ['Formato FO-MCO-18 formalizado', 'Notificación formal enviada a Gerencia y Auditados'],
    },
    {
      number: 3,
      id: 'step-3',
      title: 'EJECUCIÓN',
      shortDesc: 'Reunión de apertura, entrevistas, recopilación de evidencias y pruebas de cumplimiento.',
      lane: 'auditee',
      laneLabel: 'AUDITEE',
      color: 'from-cyan-500 to-cyan-700',
      icon: <Users className="w-5 h-5 text-cyan-400" />,
      formatCode: 'FO-MCO-20 & FO-MCO-19',
      formatTitle: 'Acta de Apertura & Lista de Chequeo',
      targetTab: 'module3_opening',
      detailedTasks: [
        'Desarrollar la reunión formal de apertura cumpliendo los 4 puntos oficiales del Orden del Día.',
        'Registrar la lista de asistentes y recolectar las firmas de aceptación digital.',
        'Aplicar la Lista de Chequeo (FO-MCO-19) verificando los 4 criterios obligatorios (Legales, Técnicos, Caracterización y Formatos).',
        'Realizar muestreo de pliegos impresos, verificación de visto bueno (VoBo) y calibración metrológica de densitómetros.',
      ],
      inputs: ['Plan de auditoría FO-MCO-18', 'Carpetas de Orden de Producción (OP)', 'Tirajes en máquina'],
      outputs: ['Acta FO-MCO-20 firmada', 'Lista de chequeo FO-MCO-19 diligenciada con evidencias'],
    },
    {
      number: 4,
      id: 'step-4',
      title: 'ANÁLISIS DE HALLAZGOS',
      shortDesc: 'Evaluar observaciones, identificar desviaciones y clasificar hallazgos.',
      lane: 'responsable',
      laneLabel: 'RESPONSABLE',
      color: 'from-blue-600 to-indigo-800',
      icon: <Search className="w-5 h-5 text-blue-300" />,
      formatCode: 'FO-MCO-22',
      formatTitle: 'Estructuración de Hallazgos y No Conformidades',
      targetTab: 'module5_closing_report',
      decisionNode: {
        question: '¿Hallazgos significativos / No Conformidades detectadas?',
        yesText: 'Sí: Documentar No Conformidades en 5 partes estrictas (Hallazgo, Norma, Desviación, Consecuencias y Plan).',
        noText: 'No: Clasificar como Observaciones u Oportunidades de Mejora Continua.',
      },
      detailedTasks: [
        'Contrastar las evidencias objetivas recolectadas contra los numerales de la norma ISO 9001:2015 e ISO 12647-2.',
        'Clasificar cada hallazgo entre Oportunidad de Mejora, Observación (OBS) o No Conformidad (NC).',
        'Estructurar las No Conformidades respondiendo obligatoriamente a las 5 preguntas del Sistema de Calidad.',
        'Utilizar el Asistente IA para validar la coherencia y severidad del hallazgo.',
      ],
      inputs: ['Evidencias físicas y fotográficas', 'Planillas de visto bueno', 'Registros de calibración'],
      outputs: ['Matriz de hallazgos clasificados', 'Fichas de No Conformidad en 5 partes'],
    },
    {
      number: 5,
      id: 'step-5',
      title: 'REPORTE PRELIMINAR',
      shortDesc: 'Elaborar y presentar borrador del informe. Discutir con Gerencia.',
      lane: 'management',
      laneLabel: 'MANAGEMENT',
      color: 'from-orange-500 to-amber-600',
      icon: <FileBarChart className="w-5 h-5 text-orange-300" />,
      formatCode: 'FO-MCO-22 (Borrador)',
      formatTitle: 'Reunión Previa de Socialización',
      targetTab: 'module5_closing_report',
      detailedTasks: [
        'Redactar el borrador del informe consolidado con fortalezas y desviaciones detectadas.',
        'Sostener sesión previa con la Gerencia General y Director de Calidad para revisar el impacto operacional.',
        'Aclarar dudas técnicas sobre tolerancias de color (Delta E) o mermas de papel antes del cierre formal.',
        'Acordar preliminarmente los plazos de solución (15 a 30 días hábiles).',
      ],
      inputs: ['Fichas de No Conformidad estructuradas', 'Matriz de fortalezas'],
      outputs: ['Borrador de informe final revisado por la alta dirección'],
    },
    {
      number: 6,
      id: 'step-6',
      title: 'INFORME FINAL Y ACCIÓN CORRECTIVA',
      shortDesc: 'Emitir informe oficial, acordar plan de acción y seguimiento de mejoras.',
      lane: 'management',
      laneLabel: 'MANAGEMENT',
      color: 'from-emerald-600 to-teal-800',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-300" />,
      formatCode: 'FO-MCO-21 & FO-MCO-22',
      formatTitle: 'Acta de Cierre e Informe Final',
      targetTab: 'module5_closing_report',
      detailedTasks: [
        'Celebrar la reunión formal de cierre con la participación de todos los líderes auditados.',
        'Presentar el balance: fortalezas institucionales, oportunidades de mejora y No Conformidades.',
        'Firmar compromisos formales con asignación de responsables y fechas límite de cumplimiento.',
        'Recolectar firmas de cierre en FO-MCO-21 y FO-MCO-22.',
      ],
      inputs: ['Acta de apertura FO-MCO-20', 'Informe final FO-MCO-22', 'Compromisos de los líderes de planta'],
      outputs: ['Acta de Cierre FO-MCO-21 firmada', 'Informe Final Oficial FO-MCO-22'],
    },
    {
      number: 7,
      id: 'step-7',
      title: 'SEGUIMIENTO Y CIERRE',
      shortDesc: 'Verificar la implementación de acciones correctivas y cerrar la auditoría.',
      lane: 'responsable',
      laneLabel: 'RESPONSABLE',
      color: 'from-slate-700 to-slate-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      formatCode: 'FO-MCO-23',
      formatTitle: 'Evaluación de Auditores & Cierre de Ciclo',
      targetTab: 'module7_evaluation',
      detailedTasks: [
        'Evaluar la eficacia del desempeño del auditor interno mediante la matriz de 10 aspectos (FO-MCO-23).',
        'Verificar el cierre eficaz de las acciones correctivas planteadas tras cumplirse los plazos.',
        'Constatar que no hay recurrencia de las desviaciones en los tirajes subsiguientes.',
        'Emitir el concepto formal de auditoría cerrada en el Sistema de Gestión de Calidad (End).',
      ],
      inputs: ['Planes de acción ejecutados', 'Evidencias de cierre de NC', 'Registro de auditorías'],
      outputs: ['Evaluación FO-MCO-23 calificada sobre 50 puntos', 'Cierre definitivo del ciclo de auditoría'],
    },
  ];

  const currentStep = steps.find((s) => s.id === selectedStepId) || steps[0];

  const toggleStepCompletion = (id: string) => {
    setCompletedSteps((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      triggerSaveNotification(`Estado de etapa ${id} actualizado`);
      return next;
    });
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header Strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                  Flujo de Proceso de Auditoría Interna
                </h2>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  7 ETAPAS CLAVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Flujograma interactivo oficial por carriles de responsabilidad: Responsable, Management y Auditee.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOriginalImage(!showOriginalImage)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showOriginalImage ? 'Ver Flujograma Interactivo' : 'Ver Diagrama Original'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Progreso del Ciclo Actual:</span>
            <span className="font-mono font-bold text-amber-400">
              {completedCount} de {steps.length} etapas completadas
            </span>
          </div>
          <div className="flex-1 max-w-xs bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-cyan-400 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
        </div>

        {/* Content Body */}
        {showOriginalImage ? (
          <div className="p-4 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-slate-950">
            <img
              src="/assets/aistudio/Gemini_Generated_Image_8djw4j8djw4j8djw_a4a065bd.jpg"
              alt="Flujograma de Auditoría Interna"
              className="max-h-[65vh] w-auto rounded-lg border border-slate-700 shadow-xl object-contain"
            />
            <p className="text-xs text-slate-400 mt-3 text-center">
              Diagrama oficial del Flujo de Proceso de Auditoría Interna (7 Etapas Clave y Carriles de Gestión).
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-950/50">
            {/* Visual Interactive Swimlane Flujograma Grid */}
            <div className="relative border border-slate-800 rounded-xl bg-slate-900/90 p-4 overflow-x-auto shadow-inner">
              <div className="min-w-[860px]">
                {/* 3 Swimlane Headers Indicator */}
                <div className="grid grid-cols-12 gap-2 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  <div className="col-span-1 text-center text-slate-500">Carril</div>
                  <div className="col-span-11 grid grid-cols-7 gap-2 text-center">
                    {steps.map((st) => (
                      <div key={st.id} className="truncate">
                        Etapa {st.number}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps Cards Row */}
                <div className="grid grid-cols-7 gap-2.5 relative">
                  {steps.map((st) => {
                    const isSelected = selectedStepId === st.id;
                    const isDone = !!completedSteps[st.id];

                    return (
                      <div
                        key={st.id}
                        onClick={() => setSelectedStepId(st.id)}
                        className={`rounded-xl p-3 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                          isSelected
                            ? 'bg-gradient-to-b from-slate-800 to-slate-850 border-cyan-400 shadow-lg shadow-cyan-950/50 scale-[1.02]'
                            : 'bg-slate-850/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800'
                        }`}
                      >
                        {/* Status Check & Number Badge */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                              isDone ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {isDone ? '✓' : st.number}
                          </span>

                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800">
                            {st.laneLabel.substring(0, 4)}
                          </span>
                        </div>

                        {/* Title and Icon */}
                        <div className="my-1.5">
                          <div className="flex items-center gap-1.5 mb-1">
                            {st.icon}
                            <h4 className="text-xs font-black tracking-tight text-white leading-tight">
                              {st.title}
                            </h4>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                            {st.shortDesc}
                          </p>
                        </div>

                        {/* Format Code Badge */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="font-mono text-cyan-300 font-bold truncate">
                            {st.formatCode}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 text-slate-500 transition group-hover:translate-x-0.5 ${
                              isSelected ? 'text-cyan-400' : ''
                            }`}
                          />
                        </div>

                        {/* Special decision indicator for Stage 4 */}
                        {st.decisionNode && (
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded text-[8px] font-bold uppercase tracking-wider shadow">
                            Decisión ¿Hallazgos?
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Step Detailed Information Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                    {currentStep.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        ETAPA {currentStep.number} DE 7
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        Carril: {currentStep.laneLabel}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-white tracking-wide mt-0.5">
                      {currentStep.title} — {currentStep.formatTitle}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStepCompletion(currentStep.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      completedSteps[currentStep.id]
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>
                      {completedSteps[currentStep.id]
                        ? 'Etapa Completada ✓'
                        : 'Marcar como Completada'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab(currentStep.targetTab);
                      onClose();
                      triggerSaveNotification(`Navegando al formato ${currentStep.formatCode}`);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    <span>Ir a {currentStep.formatCode}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Decision Box if applicable */}
              {currentStep.decisionNode && (
                <div className="bg-indigo-950/60 border border-indigo-700/60 rounded-lg p-3.5 text-xs text-indigo-200 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold mb-1">
                      Rombo de Decisión: {currentStep.decisionNode.question}
                    </strong>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      <div className="p-2 bg-indigo-900/40 rounded border border-indigo-800 text-[11px]">
                        <span className="text-amber-400 font-bold block mb-0.5">Ruta YES:</span>
                        {currentStep.decisionNode.yesText}
                      </div>
                      <div className="p-2 bg-indigo-900/40 rounded border border-indigo-800 text-[11px]">
                        <span className="text-cyan-400 font-bold block mb-0.5">Ruta NO:</span>
                        {currentStep.decisionNode.noText}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks and Requirements Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Detailed Tasks */}
                <div className="md:col-span-2 bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Actividades Críticas a Ejecutar en esta Etapa:</span>
                  </h4>
                  <ul className="space-y-2 text-slate-300">
                    {currentStep.detailedTasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inputs & Outputs */}
                <div className="space-y-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider block mb-1.5">
                      Entradas Requeridas:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                      {currentStep.inputs.map((inp, idx) => (
                        <li key={idx}>{inp}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5">
                    <span className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider block mb-1.5">
                      Salidas / Entregables Oficiales:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                      {currentStep.outputs.map((out, idx) => (
                        <li key={idx}>{out}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Estructura auditada según estándares ISO 19011:2018 y Sistema de Gestión de Calidad ISO 9001:2015.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition cursor-pointer"
            >
              Cerrar Flujograma
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
