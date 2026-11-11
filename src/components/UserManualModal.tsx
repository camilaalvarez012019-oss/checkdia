import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  CheckCircle,
  HelpCircle,
  FileText,
  Sliders,
  Bot,
  Scale,
  Award,
  Layers,
  Sparkles,
  HardDriveDownload,
  Trash2,
  Save,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const UserManualModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  if (!isOpen) return null;

  const sections = [
    { id: 'intro', label: '1. Introducción y Filosofía SGC', icon: <BookOpen className="w-4 h-4 text-cyan-400" /> },
    { id: 'editing', label: '2. Editor Dinámico y Parametrización', icon: <Sliders className="w-4 h-4 text-amber-400" /> },
    { id: 'flow', label: '3. Los 7 Momentos y Formatos FO-MCO', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
    { id: 'nc_rule', label: '4. Estructuración de No Conformidades (5 Partes)', icon: <Scale className="w-4 h-4 text-rose-400" /> },
    { id: 'simulator', label: '5. Simulador Roleplay IA (3 Niveles)', icon: <Bot className="w-4 h-4 text-cyan-300" /> },
    { id: 'eval', label: '6. Evaluación de Auditores (FO-MCO-23)', icon: <Award className="w-4 h-4 text-amber-300" /> },
    { id: 'install_export', label: '7. Instalación, Desinstalación y Exportaciones', icon: <HardDriveDownload className="w-4 h-4 text-purple-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                  Manual de Usuario Oficial SGC
                </h2>
                <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  GUÍA OPERATIVA
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Plataforma de Auditoría Interna — Impresos El Día S.A.S. (ISO 9001:2015 / ISO 19011:2018).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Imprimir Manual</span>
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

        {/* Content Body with Left Sidebar + Right Content */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4">
          {/* Navigation Sidebar */}
          <div className="p-3 bg-slate-950/70 border-r border-slate-800 space-y-1 overflow-y-auto text-xs">
            {sections.map((sec) => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition cursor-pointer ${
                  activeSection === sec.id
                    ? 'bg-cyan-950/70 text-cyan-300 font-bold border border-cyan-800/80 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {sec.icon}
                <span className="truncate">{sec.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section Content */}
          <div className="md:col-span-3 p-5 sm:p-6 overflow-y-auto space-y-5 text-xs text-slate-300 bg-slate-900/60 leading-relaxed">
            {activeSection === 'intro' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase">
                  <BookOpen className="w-4 h-4" />
                  <span>1. Introducción y Filosofía del Sistema de Gestión</span>
                </div>
                <p>
                  Bienvenido a la <strong>Plataforma Oficial de Gestión de Auditorías Internas</strong> de <strong>Impresos El Día S.A.S.</strong>, diseñada a la medida para los procesos de litografía offset, preprensa digital (CTP), control colorimétrico espectrofotométrico, almacenamiento de papel y químicos, y líneas de acabados y guillotinas.
                </p>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                  <strong className="text-white block font-bold">Principios Rectores del Ciclo de Auditoría:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li><strong>Baja intervención en planta:</strong> Las observaciones y entrevistas en máquinas impresoras no deben interrumpir los tirajes en caliente ni provocar paradas no programadas.</li>
                    <li><strong>Evidencia Objetiva:</strong> Todo hallazgo debe sustentarse en registros físicos o digitales verificables (bitácoras FO-PRO, pliegos testigo con Visto Bueno firmado, densitometría o certificados metrológicos ONAC).</li>
                    <li><strong>Enfoque en Procesos y Mejora Continua:</strong> La auditoría busca la conformidad y madurez del sistema, promoviendo acciones correctivas orientadas a la causa raíz.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'editing' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase">
                  <Sliders className="w-4 h-4" />
                  <span>2. Editor Dinámico Global y Parametrización de Encabezados</span>
                </div>
                <p>
                  La plataforma cuenta con un <strong>Editor Dinámico Global</strong> que permite ajustar cualquier dato de la organización con persistencia inmediata en LocalStorage:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-cyan-300 block font-bold mb-1">Modo Edición vs. Vista Previa:</strong>
                    <p className="text-slate-400">
                      Usa el selector en la barra superior para alternar entre <em>Modo Edición</em> (inputs, modales y botones de agregar/eliminar) y <em>Vista Previa / Imprimir</em> (renderizado limpio idéntico al formato oficial en papel).
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-cyan-300 block font-bold mb-1">Drawer de Metadatos y Firmas:</strong>
                    <p className="text-slate-400">
                      En el encabezado de cada página, haz clic en <em>"Editar Metadatos y Firmas"</em> para cambiar el código FO-MCO, versión, fecha de aprobación, control de copia (Copia Controlada) y los nombres, cargos y fechas de quién <strong>Elaboró</strong>, <strong>Revisó</strong> y <strong>Aprobó</strong>.
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-cyan-950/40 border border-cyan-800 rounded-lg text-cyan-200">
                  ✓ Al hacer cualquier modificación, la plataforma guarda automáticamente los cambios en tu navegador. Puedes presionar el botón <strong>"Guardar"</strong> en la barra superior en cualquier instante para confirmar la sincronización.
                </div>
              </div>
            )}

            {activeSection === 'flow' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase">
                  <Layers className="w-4 h-4" />
                  <span>3. Los 7 Momentos de la Auditoría y sus Formatos FO-MCO</span>
                </div>
                <div className="space-y-2.5">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 1: Programación de Auditoría (FO-MCO-17)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Define el ciclo anual, criterios normativos, equipo auditor y la <strong>Matriz de Riesgos ($F \times S$)</strong> con controles preventivos.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 2: Plan de Auditoría (FO-MCO-18)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Establece el itinerario horario por máquinas y puestos, documentos de referencia y alineación con la Misión y Visión institucional.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 3: Acta de Apertura (FO-MCO-20)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Registro de la reunión inicial con <strong>Orden del Día interactivo y 100% editable</strong> (títulos, descripciones, adición de puntos) y firmas digitales de asistentes y líderes.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 4: Lista de Chequeo / Verificación (FO-MCO-19)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Banco de preguntas clasificado en los 4 criterios obligatorios: <em>Normas Legales</em>, <em>Normas Técnicas</em>, <em>Caracterización de Proceso</em> y <em>Formatos/Plataformas</em>. Califica Conforme / No Conforme y registra evidencias objetivas.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 5: Cierre e Informe Final (FO-MCO-21 & FO-MCO-22)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Consolida fortalezas, oportunidades de mejora y las <strong>No Conformidades estructuradas estrictamente en 5 partes</strong>.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 6: Simulador Roleplay IA</strong>
                    <p className="text-slate-400 mt-0.5">
                      Entrenamiento interactivo en roles de Auditor o Auditado con 3 niveles de dificultad e inyección directa desde la Lista de Chequeo.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white">Página 7: Evaluación de Auditores Internos (FO-MCO-23)</strong>
                    <p className="text-slate-400 mt-0.5">
                      Matriz oficial de 10 aspectos de competencia calificados de 1 a 5 con cálculo automático de puntaje sobre 50 puntos y porcentaje.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'nc_rule' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase">
                  <Scale className="w-4 h-4" />
                  <span>4. Regla Estricta de 5 Partes para Redactar No Conformidades</span>
                </div>
                <p>
                  Toda No Conformidad registrada en Impresos El Día debe responder obligatoriamente a estas 5 preguntas para tener validez ante auditorías de certificación:
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400 block">1. ¿Qué fue lo que se encontró?</span>
                    <span className="text-slate-300">Descripción exacta del hecho o hallazgo con evidencia física objetiva (número de orden de producción, equipo, fecha y magnitud de la desviación).</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400 block">2. ¿Qué norma recae?</span>
                    <span className="text-slate-300">Cita precisa del numeral de ISO 9001:2015 (ej. 7.1.5, 8.5.1, 8.7), norma técnica gráfica (NTC-ISO 12647-2) o instructivo interno (PR-IMP-01).</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400 block">3. ¿Cómo viola dicha norma?</span>
                    <span className="text-slate-300">Análisis claro de la desviación entre lo exigido por el procedimiento y lo constatado en la planta de litografía.</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400 block">4. Riesgos y Consecuencias Potenciales</span>
                    <span className="text-slate-300">Impacto potencial en reprocesos, merma de pliegos, reclamaciones de clientes por tonalidad o sanciones legales.</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <span className="font-bold text-cyan-400 block">5. Plan de Acción, Plazos y Responsables</span>
                    <span className="text-slate-300">Acción correctiva inmediata, análisis de causa raíz, plazo límite (15 a 30 días hábiles) y cargo responsable de la solución.</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  <em>Tip: Puedes presionar el botón "Asistente IA" en la Página 5 para estructurar automáticamente cualquier hallazgo informal en estas 5 partes.</em>
                </p>
              </div>
            )}

            {activeSection === 'simulator' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm uppercase">
                  <Bot className="w-4 h-4" />
                  <span>5. Guía del Simulador de Auditoría con Roleplay IA</span>
                </div>
                <p>
                  El simulador permite recrear escenarios reales en el taller litográfico con inteligencia artificial adaptada a los estándares de Impresos El Día:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white block font-bold mb-1">Niveles de Dificultad:</strong>
                    <ul className="space-y-1.5 text-slate-300">
                      <li><strong className="text-emerald-400">🟢 Cooperativo:</strong> El personaje responde amablemente, colabora y entrega carpetas y bitácoras sin reservas.</li>
                      <li><strong className="text-amber-400">🟡 Riguroso:</strong> El personaje es sumamente técnico, formal y cita tolerancias metrológicas exigiendo precisión.</li>
                      <li><strong className="text-rose-400">🔴 Evasivo:</strong> El personaje pone excusas de taller ("la prensa no se puede detener", "el turno de la noche tiene la llave"), desafiando la asertividad y tenacidad del auditor.</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white block font-bold mb-1">Inyección desde la Lista de Chequeo:</strong>
                    <p className="text-slate-400">
                      En la barra inferior del chat, haz clic en <em>"Desde Lista de Chequeo (Pág 4)"</em> para inyectar directamente las preguntas que hayas configurado en tu auditoría activa.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'eval' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase">
                  <Award className="w-4 h-4" />
                  <span>6. Evaluación de Auditores Internos (FO-MCO-23)</span>
                </div>
                <p>
                  El formato <strong>FO-MCO-23</strong> evalúa 10 competencias críticas del auditor interno bajo los lineamientos de ISO 19011:2018:
                </p>
                <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                  <strong className="text-white block font-bold">Escala y Clasificación:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    <li><strong>Escala de 1 a 5:</strong> 1: Malo, 2: Regular, 3: Aceptable, 4: Bueno, 5: Excelente.</li>
                    <li><strong>Puntaje Máximo:</strong> 50 puntos (10 aspectos × 5).</li>
                    <li><strong>Niveles de Idoneidad:</strong> $\ge 90\%$ (Sobresaliente / Auditor Líder), $80-89\%$ (Competente), $70-79\%$ (Aceptable con acompañamiento), $&lt; 70\%$ (Requiere reentrenamiento).</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'install_export' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase">
                  <HardDriveDownload className="w-4 h-4" />
                  <span>7. Instalación, Desinstalación y Herramientas de Exportación</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white block font-bold mb-1">Instalar la Aplicación (PWA):</strong>
                    <p className="text-slate-400">
                      Haz clic en el botón <strong>"Instalar App"</strong> en la barra superior. En navegadores Chromium (Chrome, Edge) se agregará como aplicación de escritorio independiente sin barras de navegador. En iPhone/iPad (Safari), toca el botón Compartir y selecciona <em>"Agregar a pantalla de inicio"</em>.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-rose-400 block font-bold mb-1">Desinstalar o Restablecer Datos:</strong>
                    <p className="text-slate-400">
                      Haz clic en el botón <strong>"Desinstalar"</strong> en la barra de navegación para abrir el asistente de desinstalación. Podrás limpiar la memoria local (LocalStorage) y restablecer los datos oficiales de fábrica cuando inicies un nuevo ciclo anual de auditoría.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                    <strong className="text-white block font-bold mb-1">Exportaciones Oficiales:</strong>
                    <ul className="list-disc pl-4 space-y-1 text-slate-300 mt-1">
                      <li><strong>Word (.doc):</strong> Descarga el formato oficial listo para archivar con estilos SGC.</li>
                      <li><strong>Excel (.csv):</strong> Exporta tablas de lista de chequeo y matrices con codificación UTF-8 compatible con acentos en español.</li>
                      <li><strong>Imprimir / PDF:</strong> Genera la versión impresa oficial con control de copia controlada.</li>
                      <li><strong>Backup JSON:</strong> Guarda una copia completa de seguridad de todo el ciclo.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Documento emitido por la Dirección de Gestión de la Calidad — Impresos El Día S.A.S.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition cursor-pointer"
          >
            Entendido, Cerrar Manual
          </button>
        </div>
      </div>
    </div>
  );
};
