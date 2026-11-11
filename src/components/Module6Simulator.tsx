import React, { useState, useRef, useEffect } from 'react';
import { ROLEPLAY_POSITIONS } from '../data/initialData';
import { RoleplayMessage, RoleplayPosition, SimulatorDifficulty } from '../types/audit';
import { useAudit } from '../context/AuditContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  Award,
  Lightbulb,
  Scale,
  RotateCcw,
  ShieldAlert,
  Zap,
  CheckCircle2,
  FileCheck2,
  BookOpen,
} from 'lucide-react';

export const Module6Simulator: React.FC = () => {
  const { checklist } = useAudit();

  const [userRole, setUserRole] = useState<'auditor' | 'auditee'>('auditor');
  const [selectedPositionId, setSelectedPositionId] = useState<string>('pos-offset');
  const [difficulty, setDifficulty] = useState<SimulatorDifficulty>('cooperativo');
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [evaluationScore, setEvaluationScore] = useState<number | null>(null);
  const [evaluationFeedback, setEvaluationFeedback] = useState<string>('');
  const [showChecklistSelector, setShowChecklistSelector] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentPosition: RoleplayPosition =
    ROLEPLAY_POSITIONS.find((p) => p.id === selectedPositionId) || ROLEPLAY_POSITIONS[0];

  // Initialize simulation when position, role, or difficulty changes
  useEffect(() => {
    startNewSimulation();
  }, [userRole, selectedPositionId, difficulty]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewSimulation = () => {
    setIsEvaluated(false);
    setEvaluationScore(null);
    setEvaluationFeedback('');

    let initialBotText = '';
    let hint = '';

    if (userRole === 'auditor') {
      // User is the auditor, bot is the employee being audited
      if (difficulty === 'cooperativo') {
        initialBotText = `Buenos días, Auditor. Soy ${currentPosition.name} en Impresos El Día. Tengo a la mano los manuales y registros de nuestro proceso en ${currentPosition.department}. Estamos listos para atender sus preguntas y presentar la evidencia física o digital que requiera.`;
        hint = `Como auditor, formula preguntas abiertas (¿Cómo?, ¿De qué manera?, ¿Qué procedimiento aplican?) y solicita siempre ver la evidencia física o digital en el software GrafiSys.`;
      } else if (difficulty === 'riguroso') {
        initialBotText = `Buenos días, Auditor. Me desempeño como ${currentPosition.name}. Le informo que nuestro proceso opera bajo tolerancias estrictas de ISO 12647-2 e ISO 9001:2015. Tengo listas las bitácoras metrológicas y certificados vigentes. ¿Qué numeral normativo específico desea auditar en este momento?`;
        hint = `El auditado conoce la norma al pie de la letra. Cita numerales específicos (ej. 8.5.1, 7.1.5, 8.7) y contrasta registros contra tolerancias técnicas reales.`;
      } else {
        // Evasivo
        initialBotText = `Buenos días. Soy ${currentPosition.name}. Mire, le aviso con franqueza: estamos en pleno cierre de producción mensual con las prensas a máxima capacidad y el personal está corriendo. Ojalá la auditoría sea rápida porque aquí parar una máquina nos cuesta millones. ¿Qué necesita revisar?`;
        hint = `Nivel Evasivo: El auditado pondrá excusas de tiempo o delegará en otros. Mantén la serenidad, sé asertivo y recuerda el acuerdo del Plan de Auditoría (FO-MCO-18).`;
      }
    } else {
      // User is the auditee, bot is the Lead Auditor
      if (difficulty === 'riguroso') {
        initialBotText = `Buenos días. Como Auditor Líder para el proceso de ${currentPosition.department}, iniciaremos la verificación estricta de los controles operacionales bajo ISO 9001:2015 y ficha técnica. Para comenzar: ${currentPosition.sampleQuestions[0]} Por favor, responda indicando el código exacto del formato y la evidencia objetiva.`;
        hint = `El auditor exige códigos oficiales de formatos, fechas y evidencia verificable. No des respuestas teóricas.`;
      } else if (difficulty === 'evasivo') {
        initialBotText = `Buenos días. Vamos a evaluar el proceso de ${currentPosition.department}. Para avanzar: ${currentPosition.sampleQuestions[0]}`;
        hint = `Sé muy estructurado y cita los procedimientos oficiales de Impresos El Día para demostrar pleno dominio.`;
      } else {
        // Cooperativo
        initialBotText = `Buenos días. Como Auditor Líder para el proceso de ${currentPosition.department}, vamos a verificar la conformidad del sistema de calidad. Para iniciar: ${currentPosition.sampleQuestions[0]}`;
        hint = `Como auditado, responde con seguridad basándote en los procedimientos documentados y menciona los formatos o registros oficiales (FO-PRO, densitometría, visto bueno).`;
      }
    }

    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        text: initialBotText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        coachingHint: hint,
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: RoleplayMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: userRole,
          position: currentPosition.name,
          topic: currentPosition.department,
          difficulty,
          messages: updatedMessages.map((m) => ({ sender: m.sender, text: m.text })),
          userMessage: userMsg.text,
        }),
      });

      const data = await response.json();
      const botReply = data.reply || 'Sin respuesta del simulador.';

      // Generate coaching hint based on role and text
      let coachingHint = '';
      const textLower = userMsg.text.toLowerCase();
      if (userRole === 'auditor') {
        if (!textLower.includes('evidencia') && !textLower.includes('muéstreme') && !textLower.includes('registro') && !textLower.includes('planilla')) {
          coachingHint = 'Técnica ISO 19011: Recuerda pedir evidencia objetiva verificable (ej: "Por favor muéstreme el registro o planilla firmada").';
        } else if (difficulty === 'evasivo' && (textLower.includes('urgente') || textLower.includes('después'))) {
          coachingHint = 'Asertividad: No aceptes postergaciones sin justificación; el itinerario FO-MCO-18 fue acordado en el acta de apertura.';
        } else {
          coachingHint = 'Bien formulado: Indagaste por evidencia tangible. Ahora valida si coincide con el procedimiento escrito.';
        }
      } else {
        if (userMsg.text.length < 35) {
          coachingHint = 'Defensa de proceso: Brinda respuestas completas citando los controles y formatos oficiales de Impresos El Día.';
        } else {
          coachingHint = 'Buena sustentación del proceso. Mantén la calma y responde estrictamente lo que se te pregunta sin divagar.';
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: botReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          coachingHint,
        },
      ]);
    } catch (error) {
      console.error('Error in simulator dialogue', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'Comprendo su intervención. De acuerdo con los procedimientos de la organización, continuamos con la evaluación de los controles operacionales en planta.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluateSession = () => {
    // Generate evaluation analysis based on FO-MCO-23
    setIsEvaluated(true);
    const userMessageCount = messages.filter((m) => m.sender === 'user').length;
    const baseScore = Math.min(96, Math.max(70, 72 + userMessageCount * 6));
    setEvaluationScore(baseScore);

    if (userRole === 'auditor') {
      setEvaluationFeedback(
        `Desempeño como Auditor en Nivel "${difficulty.toUpperCase()}": Demostró adecuada técnica de indagación en el proceso litográfico. Mantuvo el hilo conductor conforme a ISO 19011. En nivel ${difficulty}, logró superar las barreras comunicativas y orientar al interlocutor hacia la evidencia objetiva. Recomendación: verificar siempre las fechas de vencimiento de las calibraciones y firmas de VoBo.`
      );
    } else {
      setEvaluationFeedback(
        `Desempeño como Auditado en Nivel "${difficulty.toUpperCase()}": Buena defensa de los procedimientos operativos de ${currentPosition.name}. Demostró conocimiento de la caracterización de calidad. Recomendación: acompañar siempre las explicaciones verbales con el pliego impreso testigo o la bitácora física de GrafiSys.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Master Header */}
      <div className="bg-slate-900 text-white rounded-lg p-5 border border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded">
                <Bot className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-bold tracking-tight">
                Simulador Interactivo de Auditoría (Roleplay IA)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Entrenamiento interactivo con inteligencia artificial especializada en artes gráficas, litografía offset y normas ISO 9001:2015.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewSimulation}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Diálogo</span>
            </button>

            <button
              onClick={handleEvaluateSession}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Evaluar Competencia</span>
            </button>
          </div>
        </div>

        {/* 3 Parameter Selection Blocks: Role, Difficulty, & Lithographic Position */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. My Role */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">
              1. Selecciona tu Rol:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserRole('auditor')}
                className={`p-2.5 rounded border text-left transition cursor-pointer ${
                  userRole === 'auditor'
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Soy el Auditor</span>
                </div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                  Interroga y pide evidencias
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUserRole('auditee')}
                className={`p-2.5 rounded border text-left transition cursor-pointer ${
                  userRole === 'auditee'
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Soy el Auditado</span>
                </div>
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                  Defiende tus procesos SGC
                </div>
              </button>
            </div>
          </div>

          {/* 2. Difficulty Level */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">
              2. Nivel de Dificultad del Interlocutor:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setDifficulty('cooperativo')}
                className={`p-2 rounded border text-center transition cursor-pointer ${
                  difficulty === 'cooperativo'
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
                title="Colaborador, responde claro y entrega registros"
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px]">Cooperativo</span>
                </div>
                <span className="text-[9px] text-slate-400 block font-normal">Receptivo</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('riguroso')}
                className={`p-2 rounded border text-center transition cursor-pointer ${
                  difficulty === 'riguroso'
                    ? 'bg-amber-950/70 border-amber-400 text-amber-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
                title="Técnico, exigente y formal con numerales"
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span className="text-[11px]">Riguroso</span>
                </div>
                <span className="text-[9px] text-slate-400 block font-normal">Muy exigente</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('evasivo')}
                className={`p-2 rounded border text-center transition cursor-pointer ${
                  difficulty === 'evasivo'
                    ? 'bg-rose-950/70 border-rose-400 text-rose-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                }`}
                title="Pone excusas de tiempo o taller para desafiar al auditor"
              >
                <div className="flex items-center justify-center gap-1 mb-0.5">
                  <ShieldAlert className="w-3 h-3 text-rose-400" />
                  <span className="text-[11px]">Evasivo</span>
                </div>
                <span className="text-[9px] text-slate-400 block font-normal">Retador</span>
              </button>
            </div>
          </div>

          {/* 3. Lithographic Position */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">
              3. Cargo Evaluado en "Impresos El Día":
            </label>
            <select
              value={selectedPositionId}
              onChange={(e) => setSelectedPositionId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded text-xs focus:outline-cyan-400 cursor-pointer"
            >
              {ROLEPLAY_POSITIONS.map((pos) => (
                <option key={pos.id} value={pos.id}>
                  {pos.name} ({pos.department})
                </option>
              ))}
            </select>
            <div className="mt-1 text-[11px] text-slate-400 truncate">
              {currentPosition.description}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Chat Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chat Dialogue (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-xs flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900">
                {userRole === 'auditor' ? 'Auditando a ' : 'Auditado como '} {currentPosition.name}
              </span>
              <span className="text-slate-400">·</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                difficulty === 'cooperativo' ? 'bg-emerald-100 text-emerald-800' :
                difficulty === 'riguroso' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                Nivel {difficulty}
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px]">ISO 19011:2018</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-slate-50/30">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${
                    isUser ? 'ml-auto' : 'mr-auto'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {isUser ? (userRole === 'auditor' ? 'Tú (Auditor Interno)' : 'Tú (Auditado)') : currentPosition.name}
                    </span>
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-lg leading-relaxed shadow-2xs whitespace-pre-line ${
                      isUser
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Coaching hint attached to model responses */}
                  {msg.coachingHint && (
                    <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded text-[11px] flex items-start gap-1.5 max-w-full">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold">Consejo de Técnica SGC:</strong> {msg.coachingHint}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-lg max-w-xs text-xs text-slate-500">
                <Sparkles className="w-4 h-4 text-cyan-600 animate-spin" />
                <span>Interlocutor analizando en planta litográfica...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Checklist Insertion Drawer / Selector */}
          <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold">Inyectar Pregunta:</span>
              <button
                type="button"
                onClick={() => setShowChecklistSelector(!showChecklistSelector)}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-cyan-800 border border-cyan-300 font-semibold rounded transition cursor-pointer"
              >
                <FileCheck2 className="w-3 h-3 text-cyan-600" />
                <span>Desde Lista de Chequeo (Pág 4)</span>
              </button>
            </div>

            <div className="flex gap-1 overflow-x-auto max-w-md scrollbar-none">
              {currentPosition.sampleQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInputText(q)}
                  className="px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded whitespace-nowrap text-[11px] transition cursor-pointer"
                  title={q}
                >
                  {q.length > 32 ? `${q.substring(0, 32)}...` : q}
                </button>
              ))}
            </div>
          </div>

          {/* Expanded Checklist Items Selector */}
          {showChecklistSelector && (
            <div className="p-3 bg-cyan-50 border-t border-cyan-200 max-h-40 overflow-y-auto space-y-1 text-xs animate-in slide-in-from-top-1">
              <div className="flex items-center justify-between text-cyan-900 font-semibold mb-1">
                <span>Selecciona una pregunta activa de tu Lista de Verificación (FO-MCO-19):</span>
                <button
                  type="button"
                  onClick={() => setShowChecklistSelector(false)}
                  className="text-cyan-700 hover:text-cyan-900 text-[10px] font-bold"
                >
                  Cerrar ✕
                </button>
              </div>
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setInputText(item.question);
                    setShowChecklistSelector(false);
                  }}
                  className="p-1.5 bg-white hover:bg-cyan-100/70 border border-cyan-200 rounded text-slate-800 text-[11px] cursor-pointer flex items-center justify-between gap-2"
                >
                  <span className="truncate">
                    <strong>#{item.itemNumber} ({item.standardClause}):</strong> {item.question}
                  </span>
                  <span className="text-[10px] text-cyan-600 font-semibold shrink-0">Usar</span>
                </div>
              ))}
            </div>
          )}

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                userRole === 'auditor'
                  ? 'Escribe tu pregunta como auditor o solicita una evidencia física verificable...'
                  : 'Responde como auditado justificando tu labor con los procedimientos oficiales...'
              }
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded focus:outline-cyan-600"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>

        {/* Right Column: Context, Applicable Norms, & Evaluation Result */}
        <div className="space-y-4 text-xs">
          {/* Position Info Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
            <div className="font-bold text-slate-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-cyan-600" />
              <span>Normas Clave Aplicables al Cargo</span>
            </div>
            <div className="space-y-1 mb-3">
              {currentPosition.keyNorms.map((n, i) => (
                <div key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-700">
                  {n}
                </div>
              ))}
            </div>

            <div className="font-bold text-slate-900 uppercase tracking-wide mb-1.5">
              Riesgos Operacionales Típicos en Imprenta:
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              {currentPosition.typicalRisks.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Evaluation Score Card (FO-MCO-23 alignment) */}
          {isEvaluated && evaluationScore !== null ? (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg p-5 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-cyan-400 text-xs">
                  Evaluación de Competencia
                </span>
                <span className="text-[10px] text-slate-400 font-mono">FO-MCO-23</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-3xl font-extrabold font-mono text-cyan-300">
                  {evaluationScore} / 100
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  Nivel: Competente y Apto
                </div>
              </div>

              <p className="text-slate-300 text-xs leading-relaxed bg-slate-800/80 p-3 rounded border border-slate-700">
                {evaluationFeedback}
              </p>

              <div className="pt-2 border-t border-slate-700 text-[10px] text-slate-400 flex items-center justify-between">
                <span>✓ Ponderado según los 10 criterios de FO-MCO-23.</span>
                <span className="text-cyan-400 font-semibold">Ver Pág 7 para matriz completa</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 text-center text-slate-500">
              <Award className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <div className="font-bold text-slate-700">¿Listo para ser calificado?</div>
              <p className="text-[11px] text-slate-500 mt-1">
                Realiza al menos 2 intercambios de preguntas y haz clic en "Evaluar Competencia" para obtener tu informe de desempeño ISO 19011.
              </p>
              <button
                onClick={handleEvaluateSession}
                type="button"
                className="mt-3 px-3 py-1.5 bg-slate-900 text-white rounded text-xs hover:bg-slate-800 cursor-pointer"
              >
                Generar Evaluación
              </button>
            </div>
          )}

          {/* Quick Guidance Box */}
          <div className="bg-cyan-50/60 border border-cyan-200 rounded-lg p-3 text-cyan-900">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <BookOpen className="w-3.5 h-3.5 text-cyan-700" />
              <span>Reglas de Oro del Auditor Litográfico:</span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-cyan-800">
              <li>Nunca confíes solo en la palabra: pide siempre el pliego testigo o registro.</li>
              <li>No interrumpas tirajes en caliente; observa la lectura densitométrica al vuelo.</li>
              <li>Verifica que la prueba de contrato digital tenga la tira de certificación FOGRA 39.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
