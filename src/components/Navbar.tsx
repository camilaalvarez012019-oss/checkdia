import React, { useState } from 'react';
import {
  Calendar,
  FileSpreadsheet,
  FileText,
  CheckSquare,
  FileCheck2,
  Bot,
  Award,
  RotateCcw,
  Printer,
  FileDown,
  Edit3,
  Eye,
  Save,
  FileCode,
  Download,
  Check,
  Layers,
  BookOpen,
  HardDriveDownload,
  Trash2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { ModuleTab } from '../types/audit';
import { useAudit } from '../context/AuditContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { InteractiveFlowchart } from './InteractiveFlowchart';
import { UserManualModal } from './UserManualModal';
import { UninstallModal } from './UninstallModal';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isEditMode,
    setIsEditMode,
    saveNotification,
    triggerSaveNotification,
    resetAllToFactory,
    downloadEmptyTemplate,
    exportToExcel,
    exportToWord,
    exportToJSON,
    checklist,
    finalReport,
    program,
  } = useAudit();

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFlowchart, setShowFlowchart] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showUninstall, setShowUninstall] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        triggerSaveNotification('¡Aplicación instalada con éxito en tu dispositivo!');
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // In desktop chrome/edge if prompt not fired yet
      triggerSaveNotification('Para instalar en PC/Mac: Haz clic en el ícono de instalar (⊕) en la barra de direcciones de tu navegador');
    }
  };

  const modules: { id: ModuleTab; pageNum: string; label: string; code: string; icon: React.ReactNode }[] = [
    {
      id: 'module1_program',
      pageNum: 'Pág 1',
      label: 'Programación',
      code: 'FO-MCO-17',
      icon: <Calendar className="w-3.5 h-3.5" />,
    },
    {
      id: 'module2_plan',
      pageNum: 'Pág 2',
      label: 'Plan de Auditoría',
      code: 'FO-MCO-18',
      icon: <FileSpreadsheet className="w-3.5 h-3.5" />,
    },
    {
      id: 'module3_opening',
      pageNum: 'Pág 3',
      label: 'Acta de Apertura',
      code: 'FO-MCO-20',
      icon: <FileText className="w-3.5 h-3.5" />,
    },
    {
      id: 'module4_checklist',
      pageNum: 'Pág 4',
      label: 'Lista de Chequeo',
      code: 'FO-MCO-19',
      icon: <CheckSquare className="w-3.5 h-3.5" />,
    },
    {
      id: 'module5_closing_report',
      pageNum: 'Pág 5',
      label: 'Cierre e Informe',
      code: 'FO-MCO-21/22',
      icon: <FileCheck2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'module6_simulator',
      pageNum: 'Pág 6',
      label: 'Simulador Roleplay',
      code: 'Roleplay IA',
      icon: <Bot className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: 'module7_evaluation',
      pageNum: 'Pág 7',
      label: 'Evaluación Auditores',
      code: 'FO-MCO-23',
      icon: <Award className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  return (
    <>
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 print:hidden shadow-md">
        {/* Save Notification Toast */}
        {saveNotification && (
          <div className="bg-cyan-600 text-white py-1.5 px-4 text-xs font-semibold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top shadow-md">
            <Check className="w-3.5 h-3.5" />
            <span>{saveNotification}</span>
          </div>
        )}

        {/* Top Corporate Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand & Process Priority */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-800 rounded border border-slate-700 shadow-xs">
              <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                <span className="bg-cyan-400 rounded-2xs" />
                <span className="bg-pink-500 rounded-2xs" />
                <span className="bg-amber-400 rounded-2xs" />
                <span className="bg-white rounded-2xs" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  IMPRESOS EL DÍA S.A.S.
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">
                  · Auditorías SGC ISO 9001:2015
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>
                  Proceso Priorizado:{' '}
                  <strong className="text-cyan-300">{program.metadata.processOrPosition}</strong>
                </span>
                <span className="text-slate-600">/</span>
                <span>Ciclo {program.cycle} - {program.year}</span>
              </div>
            </div>
          </div>

          {/* Core Controls: Flujograma, Manual, Guardar Cambios, Instalar, Desinstalar, Modo y Exportar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Flujograma Interactivo Button */}
            <button
              type="button"
              onClick={() => setShowFlowchart(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 rounded-md font-bold transition cursor-pointer shadow-xs"
              title="Abrir Flujograma Interactivo de los 7 Momentos"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Flujograma</span>
              <span className="bg-amber-500 text-slate-950 text-[9px] px-1 py-0.2 rounded font-black">7</span>
            </button>

            {/* Manual de Usuario Button */}
            <button
              type="button"
              onClick={() => setShowManual(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-md font-semibold transition cursor-pointer"
              title="Abrir Manual de Usuario Oficial"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Manual</span>
            </button>

            {/* BOTÓN: GUARDAR CAMBIOS (Prominente) */}
            <button
              type="button"
              onClick={() => triggerSaveNotification('✓ Todos los cambios fueron guardados exitosamente')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-bold transition cursor-pointer shadow-sm shadow-emerald-950/40"
              title="Guardar de inmediato todos los cambios en LocalStorage"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Cambios</span>
            </button>

            {/* BOTÓN: INSTALAR APLICACIÓN (PWA) */}
            <button
              type="button"
              onClick={handleInstallClick}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer border ${
                isInstalled
                  ? 'bg-slate-800 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
              }`}
              title={isInstalled ? 'Aplicación ya instalada como PWA' : 'Instalar en PC, Mac, Android o iOS'}
            >
              <HardDriveDownload className={`w-3.5 h-3.5 ${isInstalled ? 'text-emerald-400' : 'text-purple-400'}`} />
              <span className="hidden sm:inline">{isInstalled ? 'Instalada' : 'Instalar'}</span>
            </button>

            {/* BOTÓN: DESINSTALAR / RESTABLECER */}
            <button
              type="button"
              onClick={() => setShowUninstall(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-rose-400 border border-slate-700 rounded-md transition cursor-pointer"
              title="Desinstalar PWA o limpiar datos locales"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Desinstalar</span>
            </button>

            {/* Mode Switcher Toggle: Modo Edición Dinámica vs Modo Vista Previa / Imprimir */}
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => {
                  setIsEditMode(true);
                  triggerSaveNotification('Modo Edición Dinámica activado');
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer text-xs ${
                  isEditMode ? 'bg-cyan-500 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Permite editar cualquier campo, tabla o lista"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Edición</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditMode(false);
                  triggerSaveNotification('Modo Vista Previa / Imprimir activado');
                }}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer text-xs ${
                  !isEditMode ? 'bg-slate-100 text-slate-900 shadow-xs' : 'text-slate-300 hover:text-white'
                }`}
                title="Vista limpia idéntica al documento oficial impreso"
              >
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Imprimir</span>
              </button>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-300" />
                <span className="hidden sm:inline">Exportar</span>
              </button>

              {showExportMenu && (
                <div
                  className="absolute right-0 mt-1 w-52 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      window.print();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Imprimir / Guardar PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToWord();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Exportar a Word (.doc)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToExcel();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Exportar a Excel (.csv)</span>
                  </button>

                  <div className="border-t border-slate-200 my-1" />

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      exportToJSON();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>Descargar Backup JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowExportMenu(false);
                      downloadEmptyTemplate();
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-100 flex items-center gap-2 text-slate-600 cursor-pointer text-[11px]"
                  >
                    <Download className="w-3 h-3 text-slate-500" />
                    <span>Descargar Plantilla Vacía</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 7 Official Moments of Audit Pages Navigation Bar */}
        <div className="bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none" aria-label="7 Momentos de Auditoría">
              {modules.map((m) => {
                const isActive = activeTab === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveTab(m.id)}
                    type="button"
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-800 text-cyan-300 shadow-xs border-b-2 border-cyan-400 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 font-mono">{m.pageNum}:</span>
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>{m.icon}</span>
                    <span>{m.label}</span>
                    <span
                      className={`text-[10px] hidden lg:inline font-mono ${
                        isActive ? 'text-cyan-200/80 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      ({m.code})
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Modals */}
      <InteractiveFlowchart isOpen={showFlowchart} onClose={() => setShowFlowchart(false)} />
      <UserManualModal isOpen={showManual} onClose={() => setShowManual(false)} />
      <UninstallModal isOpen={showUninstall} onClose={() => setShowUninstall(false)} />

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl text-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold uppercase text-slate-900">Instalar en iPhone o iPad</h3>
            <p className="text-slate-600 leading-relaxed">
              1. En la barra inferior de Safari, pulsa el botón <strong>Compartir</strong> (ícono con un cuadrado y flecha hacia arriba).<br />
              2. Desplázate hacia abajo y selecciona <strong>"Agregar a la pantalla de inicio"</strong>.<br />
              3. Pulsa <strong>Agregar</strong> en la esquina superior derecha.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full mt-2 py-2 bg-slate-900 text-white font-bold rounded-lg cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
