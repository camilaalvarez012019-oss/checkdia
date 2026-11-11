import {
  AuditProgram,
  AuditPlan,
  OpeningMinute,
  ChecklistItem,
  ClosingMinute,
  FinalReport,
  AuditorEvaluation,
  RoleplayPosition,
  FormatMetadata,
} from '../types/audit';

const DEFAULT_WORKFLOW = {
  elaboratedBy: {
    name: 'Auditor Líder',
    position: 'Auditor Líder SGC',
    date: 'Enero 15 de 2024',
  },
  reviewedBy: {
    name: 'Director de Calidad / Revisor',
    position: 'Director de Aseguramiento de Calidad',
    date: 'Febrero 01 de 2024',
  },
  approvedBy: {
    name: 'Gerencia General',
    position: 'Gerente General',
    date: 'Febrero 14 de 2024',
  },
};

export const INITIAL_PROGRAM: AuditProgram = {
  metadata: {
    processOrPosition: 'Coordinador de Producción e Impresión Offset',
    code: 'FO-MCO-17',
    version: '02',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 2',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  year: 2026,
  cycle: '01',
  startDate: '2026-03-16',
  endDate: '2026-03-20',
  criteria:
    'NTC-ISO 9001:2015 (Sistema de Gestión de la Calidad), NTC-ISO 12647-2 (Control de Proceso Litográfico), Decreto 1072 de 2015 (SG-SST), Normatividad Ambiental RESPEL Res. 1362 de 2007, Procedimientos Internos de Impresos El Día.',
  leadAuditor: 'Auditor Líder SGC (Certificado IRCA)',
  auditTeam: [
    'Ing. Claudia Restrepo (Auditora Técnica de Preprensa y CTP)',
    'Ing. Didier Rave (Auditor de Producción e Impresión Offset)',
    'Dra. Emilia Arévalo (Especialista en SG-SST y Riesgo Químico)',
    'Lic. Jenith Montoya (Auditora de Gestión Documental y Calidad)',
    'Dra. Yolanda Medina (Auditora Ambiental y Manejo de Solventes)',
    'Ing. Verónica Muñoz (Auditora de Acabados y Trazabilidad Comercial)',
  ],
  auditedProcess: 'Producción Litográfica e Impresión Offset (Proceso Misional Priorizado)',
  objective: [
    'Determinar la conformidad de los procesos de impresión litográfica y control de calidad con los requisitos de la norma ISO 9001:2015 e ISO 12647-2.',
    'Verificar la eficacia en la implementación de los procedimientos operacionales de visto bueno (VoBo), calibración de densitómetros y manejo seguro de tintas y solventes.',
    'Identificar áreas de mejora potencial para reducir la merma de sustratos de papel y asegurar la entrega oportuna a los clientes.',
  ],
  scope:
    'Aplica a todos los procedimientos definidos dentro del proceso de Impresión Offset y Preprensa de Impresos El Día, desde la recepción de archivos en CTP, preparación de tintas, tiraje en prensas de 4 y 5 colores, hasta la entrega a la sección de troquelado y acabados.',
  resources:
    'Oficinas de Control de Calidad, Taller de Prensa Offset, Sala de Juntas Central, computadores con acceso al software ERP GrafiSys, densitómetros y espectrofotómetros calibrados, muestras físicas de tiraje y registros de Órdenes de Producción (OP).',
  processes: [
    {
      id: 'proc-01',
      auditNumber: 'AUD-01',
      process: 'Reunión de Apertura (Sala de Juntas)',
      standardClause: 'Directriz ISO 19011:2018 Numeral 6.4.2',
      scheduledDate: '2026-03-16',
      scheduledTime: '08:00 - 08:30',
      executedDate: '2026-03-16',
      executedTime: '08:00 - 08:35',
      leadAuditor: 'Auditor Líder SGC',
      assistantAuditor: 'Equipo Auditor Completo',
      status: 'COMPLETADA',
    },
    {
      id: 'proc-02',
      auditNumber: 'AUD-02',
      process: 'Preprensa Digital, Generación de Planchas CTP y Pruebas de Color',
      standardClause: 'ISO 9001:2015 8.2.3, 8.5.1 / ISO 12647-2',
      scheduledDate: '2026-03-16',
      scheduledTime: '08:45 - 11:30',
      executedDate: '2026-03-16',
      executedTime: '08:50 - 11:45',
      leadAuditor: 'Claudia Restrepo',
      assistantAuditor: 'Jenith Montoya',
      status: 'COMPLETADA',
    },
    {
      id: 'proc-03',
      auditNumber: 'AUD-03',
      process: 'Impresión Offset: Prensas Heidelberg Speedmaster y Komori Lithrone',
      standardClause: 'ISO 9001:2015 7.1.5, 8.5.1, 8.5.2, 8.5.4, 8.7',
      scheduledDate: '2026-03-17',
      scheduledTime: '08:00 - 13:00',
      executedDate: '2026-03-17',
      executedTime: '08:05 - 13:10',
      leadAuditor: 'Auditor Líder SGC',
      assistantAuditor: 'Didier Rave',
      status: 'COMPLETADA',
    },
    {
      id: 'proc-04',
      auditNumber: 'AUD-04',
      process: 'Almacén de Sustratos (Papel/Cartulina), Tintas y Manejo de Químicos Volátiles',
      standardClause: 'ISO 9001:2015 8.5.4, ISO 14001:2015 8.1, Dec. 1072 SST',
      scheduledDate: '2026-03-18',
      scheduledTime: '09:00 - 12:30',
      executedDate: '2026-03-18',
      executedTime: '09:00 - 12:45',
      leadAuditor: 'Yolanda Medina',
      assistantAuditor: 'Emilia Arévalo',
      status: 'COMPLETADA',
    },
    {
      id: 'proc-05',
      auditNumber: 'AUD-05',
      process: 'Acabados, Guillotinado, Troquelado y Control de Producto No Conforme',
      standardClause: 'ISO 9001:2015 8.6, 8.7, 7.1.3 Mantenimiento',
      scheduledDate: '2026-03-19',
      scheduledTime: '08:30 - 12:00',
      executedDate: '2026-03-19',
      executedTime: '08:30 - 12:15',
      leadAuditor: 'Verónica Muñoz',
      assistantAuditor: 'Didier Rave',
      status: 'COMPLETADA',
    },
    {
      id: 'proc-06',
      auditNumber: 'AUD-06',
      process: 'Reunión de Cierre e Informe Preliminar (Sala de Juntas)',
      standardClause: 'Directriz ISO 19011:2018 Numeral 6.4.9',
      scheduledDate: '2026-03-20',
      scheduledTime: '15:00 - 16:30',
      executedDate: '2026-03-20',
      executedTime: '15:00 - 16:40',
      leadAuditor: 'Auditor Líder SGC',
      assistantAuditor: 'Equipo Auditor Completo',
      status: 'COMPLETADA',
    },
  ],
  risks: [
    {
      id: 'risk-01',
      risk: 'Tiempo insuficiente para auditar el proceso de tiro y retiro en prensas de alta velocidad',
      frequency: 2,
      severity: 10,
      fxs: 20,
      consequences: [
        'Muestreo estadístico incompleto de pliegos aprobados y tirajes de color.',
        'Insuficiente identificación de evidencias para soportar hallazgos de variaciones cromáticas.',
      ],
      controls: [
        'Programación coordinada con el Jefe de Producción según el plan maestro de tirajes del día.',
        'Muestreo focalizado en cambios de turno y aprobación de visto bueno inicial.',
      ],
    },
    {
      id: 'risk-02',
      risk: 'Auditores poco competentes en la calibración y lectura de densitómetros y curvas de ganancia de punto',
      frequency: 1,
      severity: 20,
      fxs: 20,
      consequences: [
        'Interpretación errónea de desviaciones Delta E o densidad óptica como No Conformidades inexistentes.',
        'Pérdida de credibilidad del equipo auditor ante los maestros prensistas.',
      ],
      controls: [
        'Inclusión de Auditor Líder y especialistas con experiencia en artes gráficas y certificación ISO 12647.',
        'Acompañamiento técnico previo en la interpretación de tiras de control de color.',
      ],
    },
    {
      id: 'risk-03',
      risk: 'Falta de confidencialidad en especificaciones y artes confidenciales de clientes corporativos',
      frequency: 1,
      severity: 30,
      fxs: 30,
      consequences: [
        'Filtración de artes gráficos de empaques o campañas no lanzadas al mercado.',
        'Sanciones legales, contractuales y daño reputacional a Impresos El Día.',
      ],
      controls: [
        'Firma previa de acuerdo de confidencialidad y código de ética de auditores internos.',
        'Prohibición de captura fotográfica a bocetos de clientes sin previa autorización.',
      ],
    },
    {
      id: 'risk-04',
      risk: 'No socialización oportuna del programa de auditoría a los operarios de máquinas litográficas',
      frequency: 2,
      severity: 10,
      fxs: 20,
      consequences: [
        'Resistencia o nerviosismo de los maquinistas durante las observaciones directas.',
        'Retrasos en la presentación de carpetas de Orden de Producción y bitácoras.',
      ],
      controls: [
        'Socialización formal en reunión de grupo primario de planta 5 días antes.',
        'Publicación del cronograma en cartelera informativa de producción.',
      ],
    },
  ],
  observations:
    'Las auditorías en planta contarán en todo momento con el acompañamiento del Coordinador de Producción o su delegado para garantizar la seguridad industrial en proximidad a máquinas en movimiento.',
  leadAuditorSignature: '',
  leadAuditorSignatureDate: '',
};

export const INITIAL_PLAN: AuditPlan = {
  metadata: {
    processOrPosition: 'Coordinador de Impresión Offset',
    code: 'FO-MCO-18',
    version: '01',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 2',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  cycle: '01',
  auditNumber: 'AUD-IMP-01',
  process: 'Impresión Offset y Control de Color Litográfico',
  leadAuditor: 'Auditor Líder SGC',
  assistantAuditors: ['Claudia Restrepo', 'Didier Rave', 'Emilia Arévalo'],
  objective: [
    'Verificar y evaluar la conformidad del proceso de Impresión Offset con los criterios de calidad ISO 9001:2015 y parámetros técnicos NTC-ISO 12647-2.',
    'Verificar la implementación sistemática de las fichas de proceso, formatos de Visto Bueno (VoBo) y trazabilidad de tintas y papel.',
    'Identificar las áreas de mejora potencial en la reducción de merma y estandarización del tiraje.',
  ],
  scope:
    'Comprende las actividades de recepción de planchas CTP, montaje de planchas en prensa, calibración de baterías de tinta y humectación, visto bueno con densitometría, tiraje continuo, registro de mermas y entrega de producto a acabados en Impresos El Día.',
  criterion:
    'NTC-ISO 9001:2015 Numerales 4.4, 7.1.5, 7.5, 8.1, 8.5.1, 8.5.2, 8.5.4, 8.6, 8.7; NTC-ISO 12647-2; Procedimientos PR-IMP-01, PR-CAL-03 y Guías Técnicas internas.',
  methodology: {
    directObservation: true,
    lowIntervention: true,
    interviews: true,
    documentaryReview: true,
    description:
      'Metodología basada en observación directa en el taller de impresión litográfica sin detener el ritmo de producción para evitar paradas innecesarias de máquina; entrevistas breves a los maquinistas y prensistas principales; y revisión documental profunda de las carpetas de OP, vistos buenos y certificados de calibración.',
    keyQuestionsGuide:
      'Preguntas clave: ¿Cómo verifica la densidad CMYK en la tira FOGRA? ¿Dónde archiva el visto bueno de la muestra maestra? ¿Qué control realiza si el pH del agua varía?',
  },
  alignment: {
    mission:
      'Proveer soluciones litográficas y de empaque con altos estándares de fidelidad gráfica y cumplimiento, optimizando recursos mediante un sistema de calidad sólido.',
    vision:
      'Consolidarse como la imprenta líder en Colombia reconocida por su precisión cromática, innovación tecnológica y sostenibilidad ambiental.',
    description:
      'El proceso de Impresión Offset es el corazón misional de Impresos El Día; su estandarización impacta de forma directa la fidelidad cromática pactada con el cliente y la rentabilidad del negocio.',
  },
  referenceDocuments: [
    {
      id: 'doc-01',
      name: 'Procedimiento de Operación de Prensas Offset',
      code: 'PR-IMP-01',
      version: '03',
      standardClause: 'ISO 9001:2015 8.5.1',
    },
    {
      id: 'doc-02',
      name: 'Instructivo de Control de Color y Visto Bueno (VoBo)',
      code: 'IT-CAL-02',
      version: '02',
      standardClause: 'ISO 12647-2 / ISO 9001 8.5.2',
    },
    {
      id: 'doc-03',
      name: 'Procedimiento de Mantenimiento y Calibración de Equipos Litográficos',
      code: 'PR-MAN-01',
      version: '02',
      standardClause: 'ISO 9001:2015 7.1.5',
    },
    {
      id: 'doc-04',
      name: 'Procedimiento de Control de Salidas No Conformes y Merma',
      code: 'PR-CAL-05',
      version: '04',
      standardClause: 'ISO 9001:2015 8.7',
    },
    {
      id: 'doc-05',
      name: 'Guía de Manejo Seguro y Disposición de Tintas y Solventes Químicos',
      code: 'GU-AMB-01',
      version: '01',
      standardClause: 'ISO 14001:2015 8.1 / Res. 1362',
    },
  ],
  itinerary: [
    {
      id: 'itin-01',
      activity: 'Reunión de Apertura con Líder de Producción y Prensistas',
      auditee: 'Coordinador de Impresión Offset (Jorge E. Ramírez)',
      auditor: 'Auditor Líder SGC y Equipo Auditor',
      date: '2026-03-17',
      startTime: '08:00',
      endTime: '08:30',
      location: 'Sala de Juntas de Planta Litográfica',
      completed: true,
    },
    {
      id: 'itin-02',
      activity: 'Entrevista sobre Caracterización, Objetivos y Gestión del Riesgo en Prensa',
      auditee: 'Jorge E. Ramírez (Líder de Proceso)',
      auditor: 'Auditor Líder SGC - Didier Rave',
      date: '2026-03-17',
      startTime: '08:30',
      endTime: '09:15',
      location: 'Oficina Técnica de Producción',
      completed: true,
    },
    {
      id: 'itin-03',
      activity: 'Observación Directa en Prensa Heidelberg Speedmaster (Tiraje y VoBo)',
      auditee: 'Maquinista Principal (Carlos Gómez)',
      auditor: 'Didier Rave - Claudia Restrepo',
      date: '2026-03-17',
      startTime: '09:15',
      endTime: '10:45',
      location: 'Taller de Impresión - Zona de Prensas 1 y 2',
      completed: true,
    },
    {
      id: 'itin-04',
      activity: 'Revisión Documental: Carpetas de OP, Calibración de Densitómetros y VoBo',
      auditee: 'Inspector de Calidad de Turno',
      auditor: 'Claudia Restrepo - Auditor Líder SGC',
      date: '2026-03-17',
      startTime: '10:45',
      endTime: '11:45',
      location: 'Mesa de Luz y Laboratorio de Color',
      completed: true,
    },
    {
      id: 'itin-05',
      activity: 'Verificación de Evidencia: Manejo de Merma, Químicos y Hojas de Seguridad',
      auditee: 'Auxiliar de Prensa y Gestor Ambiental',
      auditor: 'Emilia Arévalo - Didier Rave',
      date: '2026-03-17',
      startTime: '11:45',
      endTime: '12:30',
      location: 'Zona de Lavado de Baterías y Tarimas de Merma',
      completed: true,
    },
    {
      id: 'itin-06',
      activity: 'Consolidación de Hallazgos y Evaluación Preliminar del Equipo Auditor',
      auditee: 'Equipo Auditor Interno',
      auditor: 'Auditor Líder SGC',
      date: '2026-03-17',
      startTime: '12:30',
      endTime: '13:00',
      location: 'Sala de Juntas Técnica',
      completed: true,
    },
    {
      id: 'itin-07',
      activity: 'Reunión de Cierre del Proceso y Socialización de Hallazgos',
      auditee: 'Líder de Proceso y Gerente de Operaciones',
      auditor: 'Auditor Líder SGC y Equipo',
      date: '2026-03-17',
      startTime: '13:00',
      endTime: '13:30',
      location: 'Sala de Juntas de Planta Litográfica',
      completed: true,
    },
  ],
  leadAuditorSignature: '',
  assistantAuditorSignature: '',
  auditeeSignature: '',
};

export const INITIAL_OPENING: OpeningMinute = {
  metadata: {
    processOrPosition: 'Coordinador de Impresión Offset',
    code: 'FO-MCO-20',
    version: '01',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 2',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  date: '2026-03-17',
  time: '08:00 a.m.',
  location: 'Sala de Juntas de Planta Litográfica - Impresos El Día',
  auditedArea: 'Proceso de Impresión Offset y Control de Color',
  attendees: [
    { id: 'att-1', name: 'Auditor Líder SGC', position: 'Auditor Líder SGC', signature: false, signatureDate: '' },
    { id: 'att-2', name: 'Claudia Restrepo', position: 'Auditora Técnica de Preprensa', signature: true, signatureDate: '2026-03-17 08:26' },
    { id: 'att-3', name: 'Didier Rave', position: 'Auditor Técnico de Impresión', signature: true, signatureDate: '2026-03-17 08:26' },
    { id: 'att-4', name: 'Jorge E. Ramírez', position: 'Coordinador de Impresión Offset (Auditado)', signature: true, signatureDate: '2026-03-17 08:28' },
    { id: 'att-5', name: 'Carlos Gómez', position: 'Prensista Principal Heidelberg', signature: true, signatureDate: '2026-03-17 08:29' },
    { id: 'att-6', name: 'Ing. Mauricio Henao', position: 'Director de Aseguramiento de la Calidad', signature: true, signatureDate: '2026-03-17 08:30' },
  ],
  objective: [
    'Verificar el grado de conformidad del proceso de Impresión Offset frente a la norma ISO 9001:2015 y procedimientos internos de Impresos El Día.',
    'Constatar el cumplimiento de los controles de color, visto bueno de clientes y preservación de materia prima (papel y tintas).',
    'Fomentar la cultura de mejora continua y control de desperdicios en planta.',
  ],
  scope:
    'Aplica a la línea de prensas offset Heidelberg Speedmaster CD 102 de 5 colores y Komori Lithrone, incluyendo operarios del turno diurno y vespertino.',
  methodology:
    'Observación directa en pie de máquina litográfica con mínima interferencia, entrevistas guiadas con personal operativo y revisión de registros documentales en carpetas de producción.',
  agenda: [
    {
      id: 'ag-1',
      time: '08:00 - 08:10',
      requirement: 'ISO 19011 Num. 6.4.2',
      activity: 'Presentación formal del equipo auditor y objetivos de la auditoría',
      auditee: 'Todo el personal convocado',
      auditors: 'Auditor Líder SGC',
    },
    {
      id: 'ag-2',
      time: '08:10 - 08:20',
      requirement: 'ISO 9001:2015 8.5.1',
      activity: 'Confirmación de recursos de auditoría, enlaces de comunicación y técnicas de muestreo',
      auditee: 'Jorge E. Ramírez',
      auditors: 'Claudia Restrepo - Didier Rave',
    },
    {
      id: 'ag-3',
      time: '08:20 - 08:25',
      requirement: 'Participación',
      activity: 'Sesión de preguntas y aclaraciones del auditado sobre el itinerario detallado',
      auditee: 'Equipo de Planta',
      auditors: 'Equipo Auditor',
    },
    {
      id: 'ag-4',
      time: '08:25 - 08:30',
      requirement: 'Cierre del Acta',
      activity: 'Fijación de hora de reunión de cierre (13:00 p.m.) y suscripción de firmas',
      auditee: 'Líder del Proceso',
      auditors: 'Auditor Líder',
    },
  ],
  orderOfDay: {
    presentationCompleted: true,
    planConfirmed: true,
    qaCompleted: true,
    closingMeetingConfirmed: true,
    notes:
      'Se acuerda con el líder de impresión que las entrevistas en máquinas se efectuarán respetando las normas de seguridad (uso obligatorio de cofia, gafas de seguridad y protectores auditivos). No se requiere parar prensas durante la toma de muestras de tiraje.',
  },
  orderOfDayPoints: [
    {
      id: 'ord-1',
      orderNumber: 1,
      title: '1. Presentación del Equipo Auditor',
      description:
        'Presentación formal del equipo auditor multidisciplinario con asignación de auditor líder, auditores de soporte técnico litográfico, seguridad y ambiental.',
      completed: true,
    },
    {
      id: 'ord-2',
      orderNumber: 2,
      title: '2. Confirmación del Plan de Auditoría, Recursos, Enlaces y Técnicas',
      description:
        'Revisión del itinerario de prensas y preprensa, canales de comunicación, confirmación de técnicas (observación directa sin interrupción del tiraje, lista de verificación y entrevista).',
      completed: true,
    },
    {
      id: 'ord-3',
      orderNumber: 3,
      title: '3. Espacio para Preguntas del Auditado sobre el Plan Detallado',
      description:
        'Aclaración de dudas formuladas por los líderes de prensa respecto a los tiempos de muestreo y acceso seguro al taller de máquinas litográficas.',
      completed: true,
    },
    {
      id: 'ord-4',
      orderNumber: 4,
      title: '4. Confirmación de Fecha y Hora de la Reunión de Cierre',
      description:
        'Se ratificó la reunión formal de cierre e informe de hallazgos para las 13:00 p.m. en la Sala de Juntas Central.',
      completed: true,
    },
  ],
  observations:
    'El auditado manifiesta plena disposición y provee acceso al software GrafiSys para consulta de trazabilidad de lotes.',
  leadAuditorName: 'Auditor Líder SGC',
  leadAuditorRole: 'Auditor Líder SGC',
  leadAuditorSignature: '',
  leadAuditorSignedDate: '',
  processLeaderName: 'Jorge E. Ramírez',
  processLeaderRole: 'Coordinador de Impresión Offset',
  processLeaderSignature: 'Jorge E. Ramírez',
  processLeaderSignedDate: '2026-03-17 08:30',
};

export const INITIAL_CHECKLIST: ChecklistItem[] = [
  // 1. NORMAS LEGALES
  {
    id: 'chk-01',
    itemNumber: 1,
    criterion: 'Normas legales',
    standardClause: 'Decreto 1072 de 2015 (SG-SST) Art. 2.2.4.6.24',
    question:
      '¿Los operarios de prensa y guillotina cuentan y utilizan permanentemente los Elementos de Protección Personal (EPP) reglamentarios para el riesgo químico por vapores de solventes y riesgo mecánico por atrapamiento?',
    targetRole: 'Operador Litográfico / Guillotinero',
    directObservationNotes: 'Inspeccionar el uso de protectores auditivos de copa, gafas protectoras y calzado con puntera de seguridad durante el tiraje en máquina.',
    guideQuestions: [
      'Verificar uso de protectores auditivos en planta de impresión.',
      'Verificar uso de guantes de nitrilo resistente a solventes durante lavado de baterías de rodillos.',
      'Verificar calzado de seguridad con puntera dieléctrica.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'Se inspeccionaron las máquinas Heidelberg 01 y Komori 02 durante operación activa; los 4 maquinistas portaban protectores de copa marca 3M, gafas de seguridad y calzado reglamentario. Se verificaron planillas de entrega de dotación en carpeta de Talento Humano.',
    observations: 'Excelente disciplina en el uso de EPP por parte del personal de prensas.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-02',
    itemNumber: 2,
    criterion: 'Normas legales',
    standardClause: 'Resolución 1362 de 2007 / Decreto 4741 de 2005 (Manejo RESPEL)',
    question:
      '¿Se encuentran plenamente identificados, rotulados y almacenados los residuos peligrosos (waypes impregnados de tinta, trapos con solvente de lavado, envases metálicos de tintas usadas) en recipientes herméticos antichispa?',
    targetRole: 'Auxiliar de Prensa / Gestor Ambiental',
    directObservationNotes: 'Revisar la parte trasera de las baterías de entintado y el contenedor de trapos contaminados.',
    guideQuestions: [
      'Verificar rotulación bajo Sistema Globalmente Armonizado (SGA).',
      'Verificar canecas metálicas rojas con tapa de pedal.',
      'Verificar entrega a gestor ambiental autorizado con manifiestos de disposición final.',
    ],
    status: 'NO_CONFORME',
    objectiveEvidence:
      'En la parte posterior de la prensa Heidelberg Speedmaster se halló un tambor plástico azul destapado que contenía trapos embebidos en solvente de lavado de rodillos sin rotular, y residuos de tinta escurridos sobre el piso sin cubeto de contención de derrames secundario.',
    observations:
      'Incumple la normatividad ambiental de almacenamiento temporal de residuos peligrosos y genera riesgo de vapores inflamables.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-03',
    itemNumber: 3,
    criterion: 'Normas legales',
    standardClause: 'Resolución 0312 de 2019 Estándar de Seguridad en Máquinas y Equipos',
    question:
      '¿Las prensas litográficas cuentan con resguardos fijos, enclavamientos de seguridad en rodillos y paradas de emergencia (setas rojas) operativas y señalizadas?',
    targetRole: 'Operador Litográfico',
    directObservationNotes: 'Verificar estado de pulsadores de seta y tiempo de respuesta en parada rápida.',
    guideQuestions: [
      'Probar botón de parada de emergencia en consola principal y en salida de pliegos.',
      'Comprobar que los rodillos se detienen de inmediato al levantar la rejilla de protección.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'Se realizó prueba controlada en la parada de emergencia del cabezal de salida de la Heidelberg CD 102; la máquina se detuvo en menos de 0.8 segundos. Los resguardos móviles poseen microinterruptores de desconexión inmediata.',
    observations: 'Mantenimiento preventivo al día en sistemas de parada de emergencia.',
    auditedProcess: 'Impresión Offset',
  },

  // 2. NORMAS TÉCNICAS
  {
    id: 'chk-04',
    itemNumber: 4,
    criterion: 'Normas técnicas',
    standardClause: 'NTC-ISO 9001:2015 Numeral 7.1.5 (Recursos de seguimiento y medición)',
    question:
      '¿Los densitómetros y espectrofotómetros de mesa de luz utilizados para el control de densidad cromática y ganancia de punto cuentan con certificados de calibración vigentes y rutina de calibración a cero?',
    targetRole: 'Inspector de Calidad / Prensista',
    directObservationNotes: 'Examinar el sticker metrológico y la tarjeta blanca de referencia cerámica del equipo X-Rite eXact.',
    guideQuestions: [
      'Verificar sticker de calibración en el equipo X-Rite eXact.',
      'Verificar certificado de calibración por laboratorio acreditado ONAC.',
      'Verificar la limpieza del parche blanco de referencia cerámica.',
    ],
    status: 'NO_CONFORME',
    objectiveEvidence:
      'El densitómetro de reflexión X-Rite eXact utilizado por los maquinistas en la mesa de control de la prensa Heidelberg presentaba sticker con fecha de calibración vencida desde el 15 de diciembre de 2025. No se evidenció certificado de calibración vigente para el año en curso.',
    observations:
      'Afecta la confiabilidad en la medición de densidad óptica de tintas Cyan, Magenta, Amarillo y Negro (CMYK).',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-05',
    itemNumber: 5,
    criterion: 'Normas técnicas',
    standardClause: 'NTC-ISO 12647-2 (Parámetros técnicos de control de proceso para impresión litográfica)',
    question:
      '¿Se controlan los valores de densidad óptica y tolerancia de ganancia de punto (TVI) según el estándar de papel estucado (tipo 1 y 2) en los pliegos de tiraje?',
    targetRole: 'Prensista Principal',
    directObservationNotes: 'Medir en la tira FOGRA 39 los parches del 40% y 80% para verificar la ganancia de punto.',
    guideQuestions: [
      'Verificar tira de control de color impresa al pie de cada pliego.',
      'Verificar si los valores Delta E se mantienen en tolerancia menor a 3.0.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'Se tomaron 5 pliegos aleatorios de la OP-5104 (catálogo comercial); la tira de control FOGRA 39 al pie mostraba densidades estándar (Cyan: 1.45, Magenta: 1.40, Amarillo: 1.05, Negro: 1.70) dentro de la tolerancia estipulada.',
    observations: 'El maquinista demuestra excelente dominio técnico en la entonación de tintas.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-06',
    itemNumber: 6,
    criterion: 'Normas técnicas',
    standardClause: 'NTC-ISO 9001:2015 Numeral 8.5.1 (Control de la producción y de la provisión del servicio)',
    question:
      '¿Se encuentran disponibles en el puesto de trabajo las condiciones controladas, tales como fichas técnicas de tintas, solución de fuente (alcohol/humectador) y pH controlado entre 4.8 y 5.5?',
    targetRole: 'Operador Litográfico',
    directObservationNotes: 'Verificar la pantalla del sistema de recirculación humectadora Technotrans.',
    guideQuestions: [
      'Verificar kit de medición de conductividad y pH de la solución de fuente.',
      'Verificar registro diario de control de agua de prensa.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'El sistema de recirculación Technotrans marcaba conductividad de 1450 microSiemens y pH de 5.1, registrado en la bitácora física diaria BT-IMP-02 a las 06:30 a.m.',
    observations: 'Cumplimiento adecuado de los parámetros físico-químicos de la solución humectadora.',
    auditedProcess: 'Impresión Offset',
  },

  // 3. CARACTERIZACIÓN DEL PROCESO
  {
    id: 'chk-07',
    itemNumber: 7,
    criterion: 'Caracterización del proceso',
    standardClause: 'ISO 9001:2015 Numeral 4.4 (Sistema de gestión y sus procesos)',
    question:
      '¿El personal del proceso conoce el objetivo, las entradas (planchas CTP, papel habilitado, tintas CMYK/Pantone), las salidas (pliegos impresos aprobados) y los clientes internos de su actividad?',
    targetRole: 'Coordinador de Producción / Maquinistas',
    directObservationNotes: 'Entrevistar a los operarios sobre quién es su cliente inmediato interno.',
    guideQuestions: [
      'Consultar al maquinista por el cliente del proceso (Acabados/Troquelado).',
      'Verificar si conoce el objetivo del proceso estipulado en la caracterización CP-IMP-01.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'En entrevista a dos prensistas, explicaron con claridad cómo la caracterización del proceso define que la salida es el pliego seco con aprobación de color que alimenta al proceso cliente de Troquelado y Plegado.',
    observations: 'Apropiación satisfactoria de la caracterización institucional.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-08',
    itemNumber: 8,
    criterion: 'Caracterización del proceso',
    standardClause: 'ISO 9001:2015 Numeral 9.1.3 (Análisis y evaluación de indicadores KPI)',
    question:
      '¿Se realiza el seguimiento periódico a los indicadores clave de desempeño (KPI) del proceso, específicamente el porcentaje de merma de papel (meta < 4.5%) y tiempo de alistamiento de prensa?',
    targetRole: 'Coordinador de Producción',
    directObservationNotes: 'Revisar la cartelera gráfica de piso de planta con las gráficas de merma mensual.',
    guideQuestions: [
      'Revisar el tablero de indicadores del mes anterior.',
      'Verificar planes de acción si se superó la meta de merma en tirajes complejos.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'Se evidenció el tablero de control de febrero de 2026: el indicador de merma se situó en 3.8% (cumpliendo la meta) y el tiempo promedio de alistamiento de prensa fue de 28 minutos.',
    observations: 'Excelente gestión visual de indicadores en la cartelera de planta.',
    auditedProcess: 'Impresión Offset',
  },

  // 4. FORMATOS Y PLATAFORMAS UTILIZADOS
  {
    id: 'chk-09',
    itemNumber: 9,
    criterion: 'Formatos y plataformas utilizados',
    standardClause: 'ISO 9001:2015 Numeral 7.5.3 (Control de la información documentada)',
    question:
      '¿Cada tiraje cuenta con la Orden de Producción (OP) física y digital en el software GrafiSys debidamente diligenciada con el Visto Bueno (VoBo) del cliente o del supervisor de calidad antes de iniciar el tiraje masivo?',
    targetRole: 'Inspector de Calidad / Prensista',
    directObservationNotes: 'Solicitar pliego maestro firmado y sellado al pie de la consola de mando de la máquina.',
    guideQuestions: [
      'Revisar muestra de 5 órdenes de producción activas en máquinas.',
      'Constatar la presencia de la muestra maestra con firma y sello de visto bueno.',
    ],
    status: 'NO_CONFORME',
    objectiveEvidence:
      'En la Orden de Producción OP-5089 (impresión de 25.000 afiches publicitarios) en la máquina Komori, el tiraje ya iba en el pliego 14.200 pero el formato FO-PRO-04 de "Visto Bueno de Color" no tenía la firma del supervisor de calidad ni del cliente, habiéndose iniciado el tiraje masivo únicamente con aprobación verbal.',
    observations:
      'Incumplimiento crítico del procedimiento PR-CAL-03 que prohíbe arrancar tiraje sin visto bueno formal firmado.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-10',
    itemNumber: 10,
    criterion: 'Formatos y plataformas utilizados',
    standardClause: 'ISO 9001:2015 Numeral 8.5.2 (Identificación y trazabilidad)',
    question:
      '¿Las tarimas de pliegos impresos en proceso cuentan con el formato de identificación FO-ALM-06 ("Tarjeta de Estado de Producto") que indique número de OP, cliente, tiraje realizado, fecha y estado de calidad (Conforme / Retenido)?',
    targetRole: 'Auxiliar de Prensa / Operador Litográfico',
    directObservationNotes: 'Inspeccionar las etiquetas visibles en los cuatro costados de las tarimas de secado.',
    guideQuestions: [
      'Revisar las tarimas ubicadas en la zona intermedia de secado.',
      'Verificar que ninguna tarima carezca de identificación de trazabilidad.',
    ],
    status: 'OBSERVACION',
    objectiveEvidence:
      'De 8 tarimas de pliegos impresos en la zona de secado, 2 de ellas presentaban tarjetas de identificación escritas a lápiz con borrones, lo que dificultó la lectura inmediata del número de OP.',
    observations:
      'Oportunidad de mejora: estandarizar el uso de rótulos impresos desde el software GrafiSys para evitar errores de transcripción manual.',
    auditedProcess: 'Impresión Offset',
  },
  {
    id: 'chk-11',
    itemNumber: 11,
    criterion: 'Formatos y plataformas utilizados',
    standardClause: 'ISO 9001:2015 Numeral 8.7 (Control de las salidas no conformes)',
    question:
      '¿Los pliegos defectuosos por mancha, repinte, fuera de registro o rotura de papel se segregan y registran en el formato FO-CAL-08 de "Salida No Conforme"?',
    targetRole: 'Prensista / Inspector de Calidad',
    directObservationNotes: 'Verificar la zona demarcada con líneas amarillas en el piso con aviso de "Merma / No Conforme".',
    guideQuestions: [
      'Verificar zona demarcada de producto no conforme en taller litográfico.',
      'Revisar si los pliegos defectuosos se marcan con spray o crayón rojo para que no se confundan con el tiraje bueno.',
    ],
    status: 'CONFORME',
    objectiveEvidence:
      'Se constató que la tarima de papel descartado estaba debidamente ubicada dentro de la demarcación amarilla de "Producto No Conforme", con rótulo rojo indicando causa "Moteado por tinta seca".',
    observations: 'Adecuado aislamiento de producto no conforme.',
    auditedProcess: 'Impresión Offset',
  },
];

export const INITIAL_NON_CONFORMITIES = [
  {
    id: 'nc-01',
    codeNC: 'NC-01',
    process: 'Impresión Offset Litográfica',
    whatWasFound:
      'En la Orden de Producción OP-5089 (impresión de 25.000 afiches publicitarios) en la máquina Komori Lithrone, el tiraje masivo avanzaba en el pliego 14.200 sin que existiera en la carpeta física ni en el sistema el formato FO-PRO-04 con la firma y aprobación formal de Visto Bueno (VoBo) por parte del Inspector de Calidad o del Cliente, habiéndose iniciado la producción con una simple instrucción verbal.',
    standardClause:
      'ISO 9001:2015 Numeral 8.5.1 (Control de la producción) y Numeral 8.6 (Liberación de los productos y servicios), en concordancia con el Procedimiento PR-CAL-03 de Impresos El Día.',
    howItViolates:
      'Se contraviene la disposición explícita del procedimiento PR-CAL-03 Numeral 5.2, el cual exige que ninguna prensa podrá superar la etapa de puesta a punto (más de 100 pliegos de ajuste) ni iniciar el tiraje continuo sin que repose el pliego maestro firmado y sellado por el supervisor de calidad.',
    consequences:
      'Riesgo inminente de rechazo total del lote por parte del cliente por diferencias cromáticas o errores de texto no detectados, lo que generaría pérdidas económicas estimadas en más de 8 millones de pesos por reposición de papel y tintas, paradas no programadas de planta y grave afectación de la reputación institucional.',
    correctiveActionPlan:
      '1. Detener de inmediato el tiraje de la OP-5089 para someter los pliegos producidos a inspección por muestreo AQL contra la prueba digital de contrato.\n2. Instalar un bloqueo digital en el software GrafiSys que impida a la prensa registrar pliegos en tiraje masivo hasta que el supervisor ingrese su código de aprobación de visto bueno.\n3. Capacitar y sensibilizar a todos los maquinistas y prensistas en la obligatoriedad del VoBo formal.',
    deadlineDays: 15,
    responsible: 'Coordinador de Impresión Offset y Director de Aseguramiento de Calidad',
    severity: 'MAYOR' as const,
    isApproved: true,
  },
  {
    id: 'nc-02',
    codeNC: 'NC-02',
    process: 'Control de Equipos de Medición y Colorimetría',
    whatWasFound:
      'El densitómetro de reflexión de mesa marca X-Rite eXact utilizado por los operarios de la prensa Heidelberg Speedmaster para el control de densidad de tintas CMYK y ganancia de punto tenía su calibración externa vencida desde el 15 de diciembre de 2025. No se presentó registro ni certificado emitido por laboratorio metrológico acreditado vigente.',
    standardClause:
      'ISO 9001:2015 Numeral 7.1.5.2 (Trazabilidad de las mediciones) y Procedimiento Interno PR-MAN-01.',
    howItViolates:
      'El requisito normativo exige que cuando la trazabilidad de las mediciones sea un requisito para proporcionar confianza en la validez de los resultados, el equipo debe calibrarse a intervalos especificados o antes de su utilización contra patrones trazables internacionalmente.',
    consequences:
      'Lecturas erróneas de densidad óptica en pliegos impresos, lo que causa variaciones imperceptibles para el ojo humano bajo luz artificial pero visibles a la luz natural, ocasionando entregas heterogéneas de color en revistas y catálogos de tirajes prolongados.',
    correctiveActionPlan:
      '1. Enviar el densitómetro X-Rite al laboratorio metrológico acreditado en un plazo no mayor a 5 días y utilizar mientras tanto el espectrofotómetro de respaldo calibrado del área de Preprensa.\n2. Actualizar el cronograma de calibraciones en el módulo de metrología del ERP con alertas automáticas 30 días antes del vencimiento.\n3. Implementar verificación diaria contra parche cerámico patrón.',
    deadlineDays: 20,
    responsible: 'Coordinador de Mantenimiento Metrológico y Director de Calidad',
    severity: 'MAYOR' as const,
    isApproved: true,
  },
  {
    id: 'nc-03',
    codeNC: 'NC-03',
    process: 'Gestión Ambiental y Seguridad en el Taller Litográfico',
    whatWasFound:
      'En la parte posterior de la batería de entintado de la prensa Heidelberg, se encontró un contenedor plástico destapado que almacenaba trapos y waypes saturados con solvente de lavado de rodillos (Varsol / hidrocarburos volátiles) sin rótulo del Sistema Globalmente Armonizado (SGA), sin tapa hermética y sobre el suelo sin bandeja de contención de derrames.',
    standardClause:
      'Decreto 4741 de 2005 (Manejo de Residuos Peligrosos), Resolución 1362 de 2007, y Decreto 1072 de 2015 (SG-SST), articulado con ISO 14001:2015 Numeral 8.1.',
    howItViolates:
      'Incumple la directriz ambiental y de seguridad que exige disponer los residuos impregnados con hidrocarburos inflamables en recipientes metálicos herméticos con accionamiento de pedal y etiquetado visible con código de residuo RESPEL (código Y12 para residuos de tintas y solventes).',
    consequences:
      'Riesgo crítico de conflagración o incendio en la zona de prensas por vapores inflamables en contacto con fuentes eléctricas estáticas, exposición prolongada del personal a vapores orgánicos nocivos y sanciones pecuniarias por parte de la autoridad ambiental.',
    correctiveActionPlan:
      '1. Reemplazar inmediatamente el contenedor improvisado por canecas de seguridad antichispa con pedal y cierre hermético con rotulación SGA.\n2. Trasladar los trapos contaminados al cuarto central de acopio de RESPEL con registro de pesaje en la planilla ambiental.\n3. Realizar jornada de reinducción en manejo de sustancias químicas y RESPEL a todo el personal de planta.',
    deadlineDays: 10,
    responsible: 'Coordinador de SG-SST y Gestor Ambiental de Impresos El Día',
    severity: 'CRÍTICA' as const,
    isApproved: true,
  },
];

export const INITIAL_CLOSING: ClosingMinute = {
  metadata: {
    processOrPosition: 'Coordinador de Impresión Offset',
    code: 'FO-MCO-21',
    version: '01',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 2',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  date: '2026-03-17',
  time: '13:00 p.m.',
  location: 'Sala de Juntas de Planta Litográfica - Impresos El Día',
  auditedArea: 'Proceso de Impresión Offset y Control de Color Litográfico',
  objective:
    'Presentar los resultados, fortalezas, oportunidades de mejora y No Conformidades identificadas durante la auditoría interna del proceso de Impresión Offset.',
  scope:
    'Línea de producción de prensas Heidelberg y Komori, mesas de control de color y zonas de acopio temporal de materias primas.',
  attendees: [
    { id: 'att-c1', name: 'Auditor Líder SGC', position: 'Auditor Líder SGC', signature: false, signatureDate: '' },
    { id: 'att-c2', name: 'Claudia Restrepo', position: 'Auditora Técnica de Preprensa', signature: true, signatureDate: '2026-03-17 13:25' },
    { id: 'att-c3', name: 'Didier Rave', position: 'Auditor Técnico de Impresión', signature: true, signatureDate: '2026-03-17 13:26' },
    { id: 'att-c4', name: 'Jorge E. Ramírez', position: 'Coordinador de Impresión Offset (Auditado)', signature: true, signatureDate: '2026-03-17 13:27' },
    { id: 'att-c5', name: 'Ing. Mauricio Henao', position: 'Director de Aseguramiento de la Calidad', signature: true, signatureDate: '2026-03-17 13:28' },
    { id: 'att-c6', name: 'Dr. Fernando Salazar', position: 'Gerente General de Impresos El Día', signature: true, signatureDate: '2026-03-17 13:30' },
  ],
  orderOfDay: {
    findingsPresented: true,
    deadlinesAgreed: true,
    planResponsibleAssigned: true,
    agreementTimeframeDays: 15,
    planResponsibleName: 'Jorge E. Ramírez (Coordinador de Impresión Offset)',
    notes:
      'Se presentaron 3 No Conformidades (2 mayores y 1 crítica ambiental/SST) y 1 Oportunidad de Mejora. El líder del proceso acepta los hallazgos y se compromete a presentar el Plan de Acción Correctivo (PAC) en un plazo no mayor a 15 días hábiles.',
  },
  observations:
    'La Gerencia General felicita al equipo de prensas por los buenos resultados en la reducción de merma e instruye dar máxima prioridad a la subsanación de los aspectos de metrología y residuos.',
  leadAuditorName: 'Auditor Líder SGC',
  leadAuditorRole: 'Auditor Líder Certificado SGC',
  leadAuditorSignature: '',
  processLeaderName: 'Jorge E. Ramírez',
  processLeaderRole: 'Coordinador de Impresión Offset',
  processLeaderSignature: '',
};

export const INITIAL_FINAL_REPORT: FinalReport = {
  metadata: {
    processOrPosition: 'Coordinador de Impresión Offset',
    code: 'FO-MCO-22',
    version: '01',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 3',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  date: '2026-03-20',
  time: '15:00 p.m.',
  auditedProcess: 'Proceso de Impresión Offset y Control de Color Litográfico',
  auditees: [
    'Jorge E. Ramírez (Coordinador de Impresión Offset)',
    'Carlos Gómez (Prensista Principal)',
    'Héctor Fabio Ruiz (Inspector de Calidad de Turno)',
  ],
  auditors: [
    'Auditor Líder SGC',
    'Claudia Restrepo (Auditora Técnica)',
    'Didier Rave (Auditor Técnico)',
  ],
  objective: [
    'Evaluar el grado de conformidad y eficacia del proceso frente a los requisitos de la norma NTC-ISO 9001:2015 y estándares litográficos NTC-ISO 12647-2.',
    'Verificar la implementación del Sistema de Gestión de Calidad en el piso de planta y la trazabilidad de los trabajos litográficos.',
    'Identificar fortalezas y oportunidades de mejora para consolidar la competitividad de Impresos El Día.',
  ],
  scope:
    'Aplica a la totalidad de las actividades de alistamiento de prensas, dosificación de tintas, tiraje continuo, inspección de densidad óptica y entrega a acabados en la sede principal de Impresos El Día.',
  criteria:
    'Norma NTC-ISO 9001:2015, NTC-ISO 12647-2, Decreto 1072 de 2015, Manual de Calidad de Impresos El Día y fichas técnicas de proceso.',
  findings: [
    {
      id: 'f-1',
      finding:
        'Tiraje masivo de 25.000 ejemplares en la OP-5089 sin firma ni registro de Visto Bueno (VoBo) en formato FO-PRO-04.',
      classification: 'NC',
      requirementBreached: 'ISO 9001:2015 Numeral 8.5.1 / 8.6',
      process: 'Impresión Offset',
    },
    {
      id: 'f-2',
      finding:
        'Densitómetro X-Rite eXact en puesto de trabajo con certificado y calibración externa vencida.',
      classification: 'NC',
      requirementBreached: 'ISO 9001:2015 Numeral 7.1.5.2',
      process: 'Metrología y Calidad',
    },
    {
      id: 'f-3',
      finding:
        'Almacenamiento inadecuado de trapos con solvente en recipiente plástico sin tapa ni rótulo SGA cerca a prensa.',
      classification: 'NC',
      requirementBreached: 'Dec. 4741 RESPEL / ISO 14001:2015 8.1',
      process: 'Manejo Ambiental y SST',
    },
    {
      id: 'f-4',
      finding:
        'Diligenciamiento manual de tarjetas de identificación de tarimas en zona de secado con datos difíciles de leer.',
      classification: 'OBS',
      requirementBreached: 'ISO 9001:2015 Numeral 8.5.2',
      process: 'Impresión Offset',
    },
  ],
  strengths: [
    {
      id: 'str-1',
      text: 'Excelente competencia técnica y pericia del personal maquinista en el control de humectación y entonación de tintas CMYK.',
      justification:
        'Durante la inspección de 5 tirajes continuos, se constató que la estabilidad tonal se mantuvo homogénea con variaciones Delta E inferiores a 2.5, superando la expectativa del cliente.',
    },
    {
      id: 'str-2',
      text: 'Cumplimiento sobresaliente del indicador de reducción de merma de papel (3.8% frente a meta máxima del 4.5%).',
      justification:
        'El equipo de prensas ha optimizado el ajuste de pinzas y registros en la puesta a punto, ahorrando pliegos de sustratos de alto gramaje.',
    },
    {
      id: 'str-3',
      text: 'Rigurosidad en el mantenimiento de las guardas de seguridad y botones de parada de emergencia en prensas.',
      justification:
        'Las pruebas dinámicas demostraron detención instantánea de las máquinas, garantizando la integridad de los operarios.',
    },
  ],
  opportunitiesForImprovement: [
    {
      id: 'opp-1',
      text: 'Digitalizar el sistema de Visto Bueno mediante terminales tipo tableta táctil al lado de cada prensa vinculadas a GrafiSys.',
      affectedRequirement: 'ISO 9001:2015 Numeral 7.5 y 8.5.1',
    },
    {
      id: 'opp-2',
      text: 'Implementar lectura con código de barras en las tarjetas de estado de producto de las tarimas de pliegos en secado para agilizar la entrada al área de troquelado.',
      affectedRequirement: 'ISO 9001:2015 Numeral 8.5.2 (Trazabilidad)',
    },
    {
      id: 'opp-3',
      text: 'Realizar calibración diaria cruzada entre el densitómetro de planta y el espectrofotómetro de control de calidad para blindar las mediciones de color.',
      affectedRequirement: 'ISO 9001:2015 Numeral 7.1.5.1',
    },
  ],
  nonConformities: INITIAL_NON_CONFORMITIES,
  conclusions: [
    'El proceso de Impresión Offset demuestra un nivel de madurez técnica elevado y un compromiso manifiesto con la calidad del producto final.',
    'Se requiere actuar con carácter prioritario sobre la formalización del Visto Bueno y la calibración externa de los equipos de medición para evitar desviaciones en tirajes críticos.',
    'Se concluye que el Sistema de Gestión de Calidad en el proceso auditado es CONFORME de manera general, condicionado al levantamiento eficaz de las 3 No Conformidades señaladas en el plazo de 15 días hábiles.',
  ],
  leadAuditorSignature: '',
  processLeaderSignature: 'Jorge E. Ramírez',
};

export const INITIAL_AUDITOR_EVALUATION: AuditorEvaluation = {
  metadata: {
    processOrPosition: 'Auditor Interno de Calidad',
    code: 'FO-MCO-23',
    version: '01',
    approvalDate: 'Febrero 14 de 2024',
    copyControl: 'COPIA CONTROLADA',
    pageNumber: 'Página 1 de 1',
    approvalWorkflow: DEFAULT_WORKFLOW,
  },
  date: '2026-03-21',
  auditNumbers: 'AUD-01, AUD-02, AUD-03 y AUD-04',
  leadAuditorEvaluator: 'Auditor Líder Evaluador / Revisor SGC',
  internalAuditorEvaluated: 'Ing. Didier Rave Zuluaga (Auditor Interno Evaluado)',
  objective:
    'Evaluar el desempeño del Auditor Interno de acuerdo con la planeación y ejecución de la auditoría interna en Impresos El Día y los criterios de la norma ISO 19011.',
  instructions:
    'La siguiente evaluación debe ser diligenciada por el Auditor Líder. Califique de 1 a 5 según la escala: 1: Malo, 2: Regular, 3: Aceptable, 4: Bueno, 5: Excelente.',
  aspects: [
    { id: 1, aspect: 'Elabora listas de verificación adecuadas y las utiliza durante la auditoría.', score: 5, comments: 'Cubre normas legales y de colorimetría.' },
    { id: 2, aspect: 'Explica claramente durante la reunión de apertura el objeto y alcance de la auditoría.', score: 4, comments: 'Buena claridad y manejo del auditorio.' },
    { id: 3, aspect: 'Realiza la auditoría en la fecha y hora programada.', score: 5, comments: 'Puntualidad rigurosa.' },
    { id: 4, aspect: 'Conoce los requisitos de la norma (ISO 9001, ISO 14001, ISO 12647).', score: 4, comments: 'Dominio de los numerales operativos.' },
    { id: 5, aspect: 'Conoce el proceso a auditar y su dinámica litográfica.', score: 5, comments: 'Comprende el argot y riesgos de imprenta.' },
    { id: 6, aspect: 'Demuestra imparcialidad, ética e interés profesional durante la auditoría.', score: 5, comments: 'Apego estricto al código de ética.' },
    { id: 7, aspect: 'Tiene habilidad para la formulación de preguntas abiertas y realización de entrevistas a operarios.', score: 4, comments: 'Excelente empatía y asertividad.' },
    { id: 8, aspect: 'Identifica y redacta adecuadamente una No Conformidad con evidencia objetiva.', score: 5, comments: 'Estructuración impecable en 5 puntos.' },
    { id: 9, aspect: 'Es oportuno para presentar informes y resultados de auditoría.', score: 5, comments: 'Entrega previa al cierre formal.' },
    { id: 10, aspect: 'Identifica y redacta adecuadamente acciones correctivas, preventivas y de mejora.', score: 4, comments: 'Planes orientados a causa raíz.' },
  ],
  observations:
    'El auditor demostró excelente criterio técnico en el muestreo de pliegos litográficos y logró una comunicación asertiva con los prensistas sin generar confrontaciones ni detener el flujo productivo.',
  resultAnalysis:
    'Puntaje total obtenido: 46 / 50 (Calificación: Excelente - 92%). El auditor interno cumple con creces el perfil de competencias requerido para liderar auditorías internas de calidad en Impresos El Día.',
  evaluatorSignature: '',
  evaluatorSignatureDate: '',
};

export const ROLEPLAY_POSITIONS: RoleplayPosition[] = [
  {
    id: 'pos-offset',
    name: 'Coordinador de Impresión Offset',
    department: 'Planta de Producción Litográfica',
    description:
      'Responsable de la operación de las prensas Heidelberg y Komori, asignación de turnos, control de tintas y cumplimiento de especificaciones del visto bueno.',
    keyNorms: ['ISO 9001:2015 (8.5.1, 8.5.2, 8.7)', 'NTC-ISO 12647-2 (Color)', 'Res. 1362 (RESPEL)'],
    typicalRisks: [
      'Iniciar tiraje sin firma de visto bueno',
      'Desviación cromática Delta E por densidad de tinta',
      'Acopio indebido de trapos con solventes',
    ],
    sampleQuestions: [
      '¿Cuál es el procedimiento cuando una muestra de tiraje presenta variación en el balance de grises o tono magenta?',
      '¿Cómo asegura que los maquinistas no inicien la producción masiva sin el Visto Bueno firmado?',
      'Muéstreme el registro de mantenimiento y cambio de mantillas de caucho de la prensa 2.',
    ],
  },
  {
    id: 'pos-prepress',
    name: 'Líder de Preprensa Digital & CTP',
    department: 'Departamento Técnico y Diseño',
    description:
      'Encargado del procesado de archivos de clientes, separación de color, calibración del CTP láser, generación de pruebas de color de contrato y curvas de ganancia de punto.',
    keyNorms: ['ISO 9001:2015 (8.2.3, 8.3, 8.5.1)', 'ISO 12647-2 (Perfiles ICC FOGRA)'],
    typicalRisks: [
      'Procesar archivos con perfiles RGB sin conversión certificada',
      'Desgaste del láser del CTP sin verificación de punto en plancha',
      'Entrega de pruebas de color sin tira de control certificada',
    ],
    sampleQuestions: [
      '¿Cómo valida que el archivo enviado por el cliente cumple las especificaciones de sangrado y resolución antes de quemar las planchas?',
      '¿Con qué frecuencia calibran el densitómetro de transmisión para planchas CTP?',
      '¿Qué perfil ICC aplican para sustratos de papel bond frente a propalcote?',
    ],
  },
  {
    id: 'pos-quality',
    name: 'Inspector de Aseguramiento de Calidad',
    department: 'Gestión de la Calidad y Metrología',
    description:
      'Responsable de muestreo por AQL, pruebas de adherencia de tinta (test de cinta), control de registro, verificación de tolerancias y gestión de salidas no conformes.',
    keyNorms: ['ISO 9001:2015 (7.1.5, 8.6, 8.7, 9.1.3)', 'Normas de Muestreo ISO 2859-1'],
    typicalRisks: [
      'Uso de densitómetro con calibración vencida',
      'No segregación inmediata de pliegos retenidos en secado',
      'Demoras en la respuesta a quejas de clientes por variaciones de color',
    ],
    sampleQuestions: [
      '¿Qué nivel de inspección y tamaño de muestra AQL aplica para un tiraje de 50.000 folletos?',
      '¿Cómo procede si encuentra que la densidad del negro está en 1.95 superando el límite superior de tolerancia?',
      'Permítame ver los registros de calibración de los instrumentos de medición del último trimestre.',
    ],
  },
  {
    id: 'pos-warehouse',
    name: 'Coordinador de Almacén de Sustratos y Químicos',
    department: 'Logística e Insumos',
    description:
      'Administra la recepción de bobinas y resmas de papel, control de humedad relativa en bodega para evitar ondulaciones (curling), almacenamiento de tintas y solventes inflamables.',
    keyNorms: ['ISO 9001:2015 (8.5.4 Preservación)', 'ISO 14001:2015 (8.1)', 'SGA / GHS'],
    typicalRisks: [
      'Almacenar papel en contacto directo con el suelo sin tarima',
      'Incompatibilidad química entre solventes oxidantes e inflamables',
      'Caducidad de barnices UV o tintas especiales',
    ],
    sampleQuestions: [
      '¿Cómo controla la temperatura y humedad relativa en la bodega de papel estucado para evitar el repinte?',
      '¿Dónde se encuentran las Fichas de Datos de Seguridad (FDS/MSDS) de los solventes de lavado?',
      '¿Qué criterio aplican para el principio PEPS (Primeras en entrar, Primeras en salir) en las tintas?',
    ],
  },
  {
    id: 'pos-finishing',
    name: 'Supervisor de Acabados, Guillotina y Troquelado',
    department: 'Terminados y Empaque',
    description:
      'Supervisa el corte en guillotina trilateral, plegado, armado de cajas plegadizas, plastificado brillante/mate y empaque para despacho.',
    keyNorms: ['ISO 9001:2015 (8.5.1, 8.5.4)', 'SG-SST Dec. 1072 (Seguridad en Guillotinas)'],
    typicalRisks: [
      'Descuadre en corte milimétrico por cuchilla desafilada',
      'Fallas de adherencia en plastificado térmico',
      'Omisión de fotocélulas de seguridad en guillotina',
    ],
    sampleQuestions: [
      '¿Cuál es la tolerancia máxima permitida de desfase en el corte de guillotina para empaques con sangrado?',
      '¿Cómo comprueban que el sensor de barrera óptica de la guillotina impide el descenso de la cuchilla si el operario ingresa la mano?',
      '¿Cómo identifican las cajas terminadas listas para entrega al cliente?',
    ],
  },
];
