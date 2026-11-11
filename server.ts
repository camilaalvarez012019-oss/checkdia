import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // API endpoint for AI Roleplay simulation
  app.post('/api/gemini/roleplay', async (req, res) => {
    try {
      const {
        role, // 'auditor' (user is auditor, AI is auditee) or 'auditee' (user is auditee, AI is auditor)
        position, // 'Coordinador de Impresión Offset', 'Líder de Preprensa y CTP', etc.
        topic, // 'Control de Color y Visto Bueno', 'Manejo de Sustratos y Químicos', etc.
        difficulty = 'cooperativo', // 'cooperativo' | 'riguroso' | 'evasivo'
        messages, // conversation history
        userMessage, // latest message from user
      } = req.body;

      if (!ai) {
        // High-quality contextual fallback when API key is not present
        const fallbackReply = generateFallbackRoleplayResponse(role, position, topic, difficulty, userMessage);
        return res.json({ reply: fallbackReply, isFallback: true });
      }

      let difficultyGuidance = '';
      if (difficulty === 'cooperativo') {
        difficultyGuidance = 'NIVEL COOPERATIVO: El personaje es receptivo, colaborador, responde con claridad, entrega carpetas o registros sin evasivas y reconoce los procedimientos implementados.';
      } else if (difficulty === 'riguroso') {
        difficultyGuidance = 'NIVEL RIGUROSO: El personaje es sumamente técnico, exigente y formal. Solicita o cita numerales específicos de ISO 9001:2015 o ISO 12647-2, contrastando minuciosamente contra datos metrológicos.';
      } else if (difficulty === 'evasivo') {
        difficultyGuidance = 'NIVEL EVASIVO / RETADOR: El personaje tiene resistencia a ser auditado, ofrece respuestas ambiguas, intenta justificar omisiones con la prisa de producción ("la prensa Heidelberg no se puede parar", "el operario anterior no llenó la planilla", "eso lo sabe el jefe de turno que ya se fue"). Pone a prueba la paciencia y asertividad del auditor.';
      }

      const systemPrompt = role === 'auditor'
        ? `Eres un colaborador de la empresa litográfica "Impresos El Día" en el cargo de: "${position}".
El usuario es un Auditor Interno de Calidad bajo la norma ISO 9001:2015, ISO 14001 y normatividad gráfica.
${difficultyGuidance}
Conoces tu labor en planta litográfica (prensas offset, CTP, guillotinas, sustratos y tintas).
Responde de forma natural, realista y concisa (máximo 2 párrafos). Justifica tus acciones con la realidad de planta litográfica.`
        : `Eres un Auditor Líder experto en Sistemas de Gestión de Calidad (ISO 9001:2015, ISO 14001, ISO 45001) para la industria gráfica y litográfica en "Impresos El Día".
El usuario está siendo auditado en su cargo de: "${position}", evaluando el proceso: "${topic}".
${difficultyGuidance}
Tu personalidad: Enfocado en la EVIDENCIA OBJETIVA. No aceptas suposiciones ni excusas sin soporte documental o trazable (pides ver registros de calibración, planillas de aprobación de visto bueno, hojas de seguridad SDS, hojas de vida de máquinas o registros de mantenimiento).
Haz preguntas directas, solicita evidencias específicas y retroalimenta de manera constructiva si la respuesta del auditado es conforme o evidencia una No Conformidad. (Máximo 2 párrafos).`;

      // Build contents
      const conversationHistory = (messages || []).map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      conversationHistory.push({
        role: 'user',
        parts: [{ text: userMessage }],
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: conversationHistory,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      const text = response.text || 'Sin respuesta generada';
      return res.json({ reply: text, isFallback: false });
    } catch (error: any) {
      console.error('Error in /api/gemini/roleplay:', error);
      // Return graceful fallback
      const { role, position, topic, difficulty = 'cooperativo', userMessage } = req.body;
      const fallbackReply = generateFallbackRoleplayResponse(role, position, topic, difficulty, userMessage);
      return res.json({ reply: fallbackReply, isFallback: true, error: error.message });
    }
  });

  // API endpoint for AI NC Assistant (strictly structured according to SGC 5-part rule)
  app.post('/api/gemini/nc-advisor', async (req, res) => {
    try {
      const { finding, processName, standard } = req.body;

      if (!ai) {
        return res.json({
          structuredNC: {
            whatWasFound: finding,
            standardClause: standard || 'ISO 9001:2015 Numeral 8.5.1 / 8.7',
            howItViolates: `No se cuenta con evidencia del registro o control según lo estipulado en el procedimiento del proceso ${processName}.`,
            consequences: 'Riesgo de entregas no conformes al cliente, sobrecostos por reprocesos y posible sanción normativa.',
            correctiveActionPlan: 'Actualizar la plantilla de verificación, capacitar a los operarios en planta y realizar seguimiento semanal por 30 días.',
            deadlineDays: 15,
            responsible: `Líder del Proceso de ${processName}`,
          },
          isFallback: true,
        });
      }

      const prompt = `Actúa como Auditor Líder ISO 9001:2015 en la empresa litográfica "Impresos El Día".
A partir del siguiente hallazgo en el proceso "${processName}":
"${finding}"

Estructura la No Conformidad siguiendo OBLIGATORIAMENTE estos 5 elementos:
1. ¿Qué fue lo que se encontró? (Evidencia objetiva clara y precisa).
2. ¿Qué norma recae? (Numeral exacto de ISO 9001:2015, ISO 14001, SG-SST o norma técnica litográfica).
3. ¿Cómo viola esta norma? (Explicación de la desviación contra el requisito).
4. Posibles consecuencias o riesgos asociados a la materialización de la falla en la imprenta.
5. ¿Qué se debe hacer para solucionarlo? (Plan de acción correctiva, preventiva y mejora, plazo sugerido en días y responsable del cargo).

Devuelve ÚNICAMENTE un JSON válido con el siguiente formato:
{
  "whatWasFound": "...",
  "standardClause": "...",
  "howItViolates": "...",
  "consequences": "...",
  "correctiveActionPlan": "...",
  "deadlineDays": 15,
  "responsible": "..."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json({ structuredNC: parsed, isFallback: false });
    } catch (error: any) {
      console.warn('Fallback triggered for /api/gemini/nc-advisor:', error.message);
      const { finding, processName, standard } = req.body;
      return res.json({
        structuredNC: {
          whatWasFound: finding || 'Hallazgo no documentado formalmente durante la inspección en planta.',
          standardClause: standard || 'ISO 9001:2015 Numeral 8.5.1 / ISO 14001:2015 Numeral 8.1',
          howItViolates: `No se cumple con el protocolo operacional establecido para el proceso de ${processName || 'Producción Litográfica'}, omitiendo el registro de verificación correspondiente.`,
          consequences: 'Riesgo de reprocesos, no conformidad en producto terminado, retraso en despachos a clientes y posibles sanciones por incumplimiento de requisitos normativos.',
          correctiveActionPlan: `1. Contención inmediata del lote afectado.\n2. Análisis de causa raíz con metodología de los 5 Porqués junto al equipo del proceso ${processName || 'de Planta'}.\n3. Actualización del instructivo de trabajo y reentrenamiento a los operarios del turno.`,
          deadlineDays: 15,
          responsible: `Líder del Proceso de ${processName || 'Producción'}`,
        },
        isFallback: true,
        error: error.message,
      });
    }
  });

  // Serve static assets or mount Vite dev middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Fallback logic for roleplay simulator
function generateFallbackRoleplayResponse(
  role: string,
  position: string,
  topic: string,
  difficulty: string,
  userMessage: string
): string {
  const lower = (userMessage || '').toLowerCase();

  if (role === 'auditor') {
    // User is auditor, we reply as the auditee (employee at Impresos El Día)
    if (difficulty === 'evasivo') {
      if (lower.includes('registro') || lower.includes('planilla') || lower.includes('evidencia') || lower.includes('formato')) {
        return `Mire auditor, lo que pasa es que esa carpeta la tiene el supervisor del turno de la noche y él se llevó la llave del archivador. Aquí en la prensa estamos sacando un pedido urgente de 50.000 afiches que debe salir a las 4:00 p.m., así que no podemos detener el tiraje. Si quiere venga mañana a ver los papeles.`;
      }
      if (lower.includes('calibr') || lower.includes('densito') || lower.includes('espectro')) {
        return `Nosotros llevamos 15 años imprimiendo a puro ojo y la experiencia vale más que un aparato. El densitómetro a veces no enciende o le falta batería, pero ningún cliente nos ha devuelto un trabajo por color.`;
      }
      return `Mire, la verdad es que en la práctica los formatos se llenan cuando hay tiempo al final de la semana. Ahorita lo prioritario es cumplir con los despachos del cliente. ¿Es estrictamente indispensable revisar eso en este momento?`;
    }

    if (difficulty === 'riguroso') {
      if (lower.includes('registro') || lower.includes('planilla') || lower.includes('evidencia')) {
        return `Con gusto. Aquí está la bitácora FO-PRO-08 con los valores densitométricos tomados cada 500 pliegos: Cyan 1.45, Magenta 1.48, Yellow 1.05, Black 1.75 bajo norma ISO 12647-2. La firma del Visto Bueno está en el pliego testigo sellado. ¿Desea contrastarlo contra la prueba de contrato digital con la tira FOGRA 39?`;
      }
      if (lower.includes('calibr') || lower.includes('mantenimiento')) {
        return `El espectrofotómetro X-Rite cuenta con certificado metrológico emitido por laboratorio acreditado ONAC con vigencia hasta noviembre de 2026. Además, registramos el cero y la calibración en blanco antes de cada orden en el módulo de metrología de GrafiSys. Aquí tiene la planilla física y digital.`;
      }
      return `Como responsable de "${position}", aplicamos el procedimiento PR-IMP-01 de acuerdo al numeral 8.5.1 de ISO 9001. Contamos con los registros de control estadístico, temperaturas de humectación a 10°C y conductividad a 1200 µS. ¿Qué indicador específico de la ficha técnica requiere auditar?`;
    }

    // Default: cooperativo
    if (lower.includes('registro') || lower.includes('planilla') || lower.includes('formato') || lower.includes('evidencia')) {
      return `Aquí tengo la carpeta de la Orden de Producción OP-4892. Mire, el maquinista firma el visto bueno inicial, aunque admito que durante el cambio de turno a las 2:00 p.m. no siempre anotamos la densidad de tinta en la planilla FO-PRO-08 porque la prensa Heidelberg Speedmaster no se detiene. Pero el tiraje salió parejo.`;
    }
    if (lower.includes('calibr') || lower.includes('mantenimiento') || lower.includes('espectro') || lower.includes('densito')) {
      return `El densitómetro X-Rite lo calibramos contra el parche blanco de referencia antes de empezar cada jornada. El certificado de calibración externa anual lo tiene el Director de Calidad en su oficina; nosotros en planta conservamos la copia del sticker adherido al equipo con fecha de vencimiento en noviembre.`;
    }
    if (lower.includes('seguridad') || lower.includes('quimico') || lower.includes('solvente') || lower.includes('epp') || lower.includes('guantes')) {
      return `Los operarios siempre usan los protectores auditivos de copa y los guantes de nitrilo cuando lavan los rodillos con solvente vegetal. Las hojas de datos de seguridad (FDS) están colgadas en la cartelera junto al almacén de químicos, aunque recientemente cambiamos de proveedor de alcohol isopropílico y estamos esperando la ficha técnica actualizada.`;
    }
    return `Comprendo su pregunta como auditor. En nuestro turno en "${position}", procuramos ceñirnos al procedimiento documentado para "${topic}". Tenemos a la mano las órdenes vigentes y la lista de especificaciones del cliente. ¿Desea revisar alguna muestra física del tiraje o la carpeta de trazabilidad?`;
  } else {
    // User is auditee, we reply as the Lead Auditor
    if (difficulty === 'riguroso') {
      return `Tomo nota de su afirmación, pero bajo el numeral 9.1.1 y 8.5.1 de la ISO 9001:2015, toda declaración debe respaldarse con evidencia verificable. Indíqueme el código del registro, la fecha de la última medición metrológica y el procedimiento escrito que autoriza dicha variación en planta litográfica.`;
    }
    if (difficulty === 'evasivo') {
      return `Como auditor, noto cierta evasión en la respuesta. Le recuerdo que la auditoría busca la conformidad del sistema de calidad según el plan acordado. Reitero la pregunta: ¿dónde se encuentra la evidencia objetiva del control realizado en el tiraje?`;
    }
    // Cooperativo auditor
    if (lower.includes('si') || lower.includes('tenemos') || lower.includes('cumplimos') || lower.includes('hacemos')) {
      return `Entiendo su explicación, sin embargo, como auditor debo basarme en hechos comprobables. Por favor, permítame ver el registro físico o digital que demuestre que esta verificación se realizó en las últimas 3 órdenes de trabajo. ¿Dónde se encuentra documentado el visto bueno del cliente o del supervisor?`;
    }
    return `Correcto. Tomo nota de su declaración. Continuando con la lista de verificación para el proceso de "${topic}": ¿de qué manera el personal operativo conoce los límites de aceptación y qué procedimiento aplican si una muestra presenta desviación de tono cromático o registro defectuoso?`;
  }
}

startServer();
