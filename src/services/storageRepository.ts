import {
  AppointmentSlot,
  Client,
  DailyTimeRange,
  EvidenceImage,
  GoogleCalendarSyncStatus,
  OrderStatus,
  Reminder,
  ServiceOrder,
  UserProfile,
  UserRole,
  Vehicle,
  WeeklyScheduleConfig,
  Workshop,
  WorkshopService,
} from '../types';

export function normalizeLicensePlate(input: string): string {
  if (!input) return '';
  // Convert to uppercase, remove extra spaces, hyphens, and any non-alphanumeric characters
  return input
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .trim();
}

/**
 * En Argentina las patentes se ingresan y visualizan SIN guión:
 * - Formato Tradicional: 3 letras y 3 números (ej. VLA481, VLA321)
 * - Formato Mercosur: 2 letras, 3 números y 2 letras (ej. AA123BB, AA156BB)
 */
export function formatDisplayPlate(normalized: string): string {
  if (!normalized) return '';
  return normalizeLicensePlate(normalized);
}

/**
 * Valida si cumple con alguno de los dos formatos oficiales de patentes en Argentina
 */
export function isValidArgentinePlate(input: string): boolean {
  const clean = normalizeLicensePlate(input);
  // Formato Tradicional: 3 letras + 3 dígitos (ej. VLA481, VLA321)
  const isTraditional = /^[A-Z]{3}[0-9]{3}$/.test(clean);
  // Formato Mercosur: 2 letras + 3 dígitos + 2 letras (ej. AA123BB, AA156BB)
  const isMercosur = /^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(clean);
  return isTraditional || isMercosur;
}

// Initial Mock Workshops
export const OFFICIAL_WORKSHOP_MAPS_URL = 'https://maps.app.goo.gl/7aJDCHTASg3yeJ5o9';

export const formatARS = (amount: number): string => {
  return `$ ${Number(amount || 0).toLocaleString('es-AR')}`;
};

export const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'workshop-vla-01',
    name: 'V-LA Taller Mecánico - Sede Central',
    businessName: 'V-LA Automotriz S.A.',
    phoneWhatsApp: '+54 351 242 2637',
    email: 'contacto@vlataller.com',
    address: 'V-LA Taller Mecánico, Córdoba, Argentina',
    schedule: 'Lunes a Viernes 08:00 - 19:00 | Sábados 08:30 - 13:30',
    currency: 'ARS',
    googleMapsUrl: OFFICIAL_WORKSHOP_MAPS_URL,
    publishAddress: true,
    createdAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'workshop-test-02',
    name: 'Taller Independiente Norte (Otro Taller)',
    businessName: 'Norte Motors SL',
    phoneWhatsApp: '+34 688 999 111',
    email: 'admin@nortemotors.es',
    address: 'Calle del Motor 12, Zona Norte',
    schedule: 'Lunes a Viernes 09:00 - 18:00',
    currency: 'ARS',
    googleMapsUrl: OFFICIAL_WORKSHOP_MAPS_URL,
    publishAddress: true,
    createdAt: '2025-02-01T08:00:00.000Z',
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'usr-admin-vla',
    username: 'ADMIN',
    displayName: 'ADMIN (Administrador General)',
    email: 'admin@vlataller.com',
    role: 'admin',
    workshopId: 'workshop-vla-01',
  },
  {
    uid: 'usr-admin-01',
    displayName: 'Carlos V. (Gerente Admin)',
    email: 'carlos@vlataller.com',
    role: 'admin',
    workshopId: 'workshop-vla-01',
  },
  {
    uid: 'usr-adv-01',
    displayName: 'Laura Méndez (Asesora de Servicio)',
    email: 'laura.m@vlataller.com',
    role: 'advisor',
    workshopId: 'workshop-vla-01',
  },
  {
    uid: 'usr-tech-01',
    displayName: 'Mateo R. (Técnico Especialista)',
    email: 'mateo.r@vlataller.com',
    role: 'technician',
    workshopId: 'workshop-vla-01',
  },
  {
    uid: 'usr-other-02',
    displayName: 'Javier Pérez (Taller Norte)',
    email: 'javier@nortemotors.es',
    role: 'admin',
    workshopId: 'workshop-test-02',
  },
];

const SAMPLE_CLIENTS: Client[] = [
  {
    id: 'cli-001',
    workshopId: 'workshop-vla-01',
    fullName: 'Alejandro Morales Silva',
    phoneWhatsApp: '+34 622 458 910',
    email: 'amorales.silva@email.com',
    createdAt: '2025-04-10T10:00:00.000Z',
    updatedAt: '2025-09-01T11:00:00.000Z',
  },
  {
    id: 'cli-002',
    workshopId: 'workshop-vla-01',
    fullName: 'Beatriz Quintana Vega',
    phoneWhatsApp: '+34 633 112 244',
    email: 'b.quintana@gmail.com',
    createdAt: '2025-06-12T09:30:00.000Z',
    updatedAt: '2025-08-20T16:00:00.000Z',
  },
  {
    id: 'cli-003',
    workshopId: 'workshop-vla-01',
    fullName: 'Diego Ferrando Costa',
    phoneWhatsApp: '+34 644 789 012',
    email: 'dferrando@empresa.com',
    createdAt: '2025-08-01T12:15:00.000Z',
    updatedAt: '2025-09-10T14:20:00.000Z',
  },
  {
    id: 'cli-004-other',
    workshopId: 'workshop-test-02',
    fullName: 'Lucía Santos (Cliente Taller Norte)',
    phoneWhatsApp: '+34 699 333 444',
    email: 'lucia.santos@mail.es',
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: '2025-08-15T09:00:00.000Z',
  },
];

const SAMPLE_VEHICLES: Vehicle[] = [
  {
    id: 'veh-001',
    workshopId: 'workshop-vla-01',
    clientId: 'cli-001',
    licensePlate: 'VLA481',
    licensePlateNormalized: 'VLA481',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    version: '2.0 TSI Performance DSG 245cv',
    year: 2021,
    currentMileage: 48500,
    vin: 'WVWZZZAUZMW091244',
    lastVisitDate: '2025-08-22T10:15:00.000Z',
    createdAt: '2025-04-10T10:00:00.000Z',
    updatedAt: '2025-08-22T10:15:00.000Z',
  },
  {
    id: 'veh-002',
    workshopId: 'workshop-vla-01',
    clientId: 'cli-002',
    licensePlate: 'AA123BB',
    licensePlateNormalized: 'AA123BB',
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    version: '2.5 Dynamic Force AWD Advance',
    year: 2020,
    currentMileage: 64200,
    vin: 'JTMBZREV700084321',
    lastVisitDate: '2025-09-02T16:40:00.000Z',
    createdAt: '2025-06-12T09:30:00.000Z',
    updatedAt: '2025-09-02T16:40:00.000Z',
  },
  {
    id: 'veh-003',
    workshopId: 'workshop-vla-01',
    clientId: 'cli-003',
    licensePlate: 'AB456CD',
    licensePlateNormalized: 'AB456CD',
    brand: 'Audi',
    model: 'A4 Avant',
    version: '40 TDI S line S tronic quattro',
    year: 2022,
    currentMileage: 35100,
    vin: 'WAUZZZF45NA019933',
    lastVisitDate: '2025-09-12T08:30:00.000Z',
    createdAt: '2025-08-01T12:15:00.000Z',
    updatedAt: '2025-09-12T08:30:00.000Z',
  },
  {
    id: 'veh-004-other',
    workshopId: 'workshop-test-02',
    clientId: 'cli-004-other',
    licensePlate: 'VLA321',
    licensePlateNormalized: 'VLA321',
    brand: 'Peugeot',
    model: '3008',
    version: '1.2 PureTech Allure',
    year: 2019,
    currentMileage: 78000,
    vin: 'VF3MC9HP8KL012399',
    lastVisitDate: '2025-08-15T09:00:00.000Z',
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: '2025-08-15T09:00:00.000Z',
  },
];

const SAMPLE_ORDERS: ServiceOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'OS-2025-001',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-001',
    clientId: 'cli-001',
    licensePlate: 'VLA481',
    licensePlateNormalized: 'VLA481',
    entryDate: '2025-04-10T10:15:00.000Z',
    entryMileage: 38200,
    exitMileage: 38210,
    visitReason: 'Mantenimiento preventivo anual de 40.000 km y revisión de frenos.',
    oil: {
      done: 'si',
      brand: 'Castrol EDGE Professional',
      specification: 'VW 508 00 / 509 00',
      viscosity: '0W-20',
    },
    filters: {
      done: 'si',
      items: [
        { id: 'f-1', type: 'Aceite', brand: 'Mann-Filter HU 6013 z' },
        { id: 'f-2', type: 'Aire de motor', brand: 'Mann-Filter C 30 005' },
        { id: 'f-3', type: 'Habitáculo (Cabina)', brand: 'Mann-Filter FreciousPlus FP 26 009' },
      ],
    },
    mechanicalWork: {
      description:
        'Se realizó vaciado completo de aceite motor por tapón inferior con cambio de arandela. Sustitución de cartucho filtrante de aceite y filtro de aire de admisión. Desinfección de evaporador y cambio de filtro de polen antialérgeno. Chequeo de espesor de discos y pastillas (delanteras a 75%, traseras a 80%). Nivelación de líquido refrigerante G12evo.',
      futureRecommendations:
        'Sustitución de bujías de encendido recomendada a los 60.000 km. Neumáticos delanteros con 4.5 mm restantes.',
      partsReplacedNotes:
        '1x Filtro Aceite Mann HU 6013 z (nuevo montado; usado presentaba suciedad habitual de 10.000 km). 1x Filtro Aire C 30 005. 1x Filtro Polen FP 26 009. 5.7L Aceite Castrol EDGE 0W-20 con especificación VW 508.00.',
      technicalObservations:
        'Vano motor sin fugas en retenes ni manguitos. Batería AGM verificada en 12.6V en reposo. Par de apriete de tapón cárter a 30 Nm según manual de taller.',
    },
    evidence: [],
    status: 'cerrado',
    statusHistory: [
      {
        from: null,
        to: 'recibido',
        timestamp: '2025-04-10T10:15:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
      },
      {
        from: 'recibido',
        to: 'en trabajo',
        timestamp: '2025-04-10T11:00:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
      },
      {
        from: 'en trabajo',
        to: 'listo',
        timestamp: '2025-04-10T16:00:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
      },
      {
        from: 'listo',
        to: 'cerrado',
        timestamp: '2025-04-10T17:30:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
        note: 'Vehículo entregado a satisfacción del cliente.',
      },
    ],
    assignedTechnicianId: 'usr-tech-01',
    assignedTechnicianName: 'Mateo R.',
    advisorId: 'usr-adv-01',
    advisorName: 'Laura Méndez',
    createdAt: '2025-04-10T10:15:00.000Z',
    updatedAt: '2025-04-10T17:30:00.000Z',
    closedAt: '2025-04-10T17:30:00.000Z',
  },
  {
    id: 'ord-002',
    orderNumber: 'OS-2025-014',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-001',
    clientId: 'cli-001',
    licensePlate: 'VLA481',
    licensePlateNormalized: 'VLA481',
    entryDate: '2025-08-22T10:15:00.000Z',
    entryMileage: 48500,
    visitReason: 'Ruido metálico leve al frenar a baja velocidad y chequeo de suspensión.',
    oil: {
      done: 'no',
    },
    filters: {
      done: 'no',
      items: [],
    },
    mechanicalWork: {
      description:
        'Desmontaje de pinzas de freno traseras. Limpieza por ultrasonido y engrase de guías con grasa cerámica para alta temperatura. Las pastillas aún tenían 6 mm pero presentaban cristalización superficial. Rectificado de rebabas y purga de circuito.',
      futureRecommendations:
        'Próximo servicio regular de aceite y filtros previsto a los 53.000 km.',
      partsReplacedNotes:
        'No se requirió reemplazo de pastillas (grosor remanente 6.2 mm con vida útil adecuada). Se aplicaron consumibles: Grasa cerámica para frenos Liqui Moly 50g y 500ml de Líquido de Frenos DOT 4 Bosch.',
      technicalObservations:
        'Discos de freno traseros medidos en micrómetro: 11.4 mm (espesor mínimo homologado: 10.0 mm). Rodamientos de rueda sin juego ni zumbido.',
    },
    evidence: [],
    status: 'cerrado',
    statusHistory: [
      {
        from: null,
        to: 'recibido',
        timestamp: '2025-08-22T10:15:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
      },
      {
        from: 'recibido',
        to: 'cerrado',
        timestamp: '2025-08-22T15:00:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
      },
    ],
    assignedTechnicianId: 'usr-tech-01',
    assignedTechnicianName: 'Mateo R.',
    advisorId: 'usr-adv-01',
    advisorName: 'Laura Méndez',
    createdAt: '2025-08-22T10:15:00.000Z',
    updatedAt: '2025-08-22T15:00:00.000Z',
    closedAt: '2025-08-22T15:00:00.000Z',
  },
  {
    id: 'ord-003',
    orderNumber: 'OS-2025-028',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-002',
    clientId: 'cli-002',
    licensePlate: 'AA123BB',
    licensePlateNormalized: 'AA123BB',
    entryDate: '2025-09-02T16:40:00.000Z',
    entryMileage: 64200,
    visitReason: 'Mantenimiento de 60.000 km, comprobación del sistema híbrido y filtros.',
    oil: {
      done: 'si',
      brand: 'Motul Hybrid',
      specification: 'API SP / ILSAC GF-6A',
      viscosity: '0W-16',
    },
    filters: {
      done: 'si',
      items: [
        { id: 'f-4', type: 'Aceite', brand: 'Toyota Genuine Parts' },
        { id: 'f-5', type: 'Aire de motor', brand: 'Toyota Genuine Parts' },
        { id: 'f-6', type: 'Habitáculo (Cabina)', brand: 'Denso Carbon Active' },
      ],
    },
    mechanicalWork: {
      description:
        'Sustitución de lubricante de motor con viscosidad ultra baja recomendada para ciclo Atkinson. Lectura de parámetros de batería híbrida con scanner: celdas balanceadas con desviación inferior a 0.02V. Limpieza de conductos de refrigeración del pack de baterías.',
      futureRecommendations:
        'Verificar líquido de frenos DOT 4 en próxima visita de primavera.',
      partsReplacedNotes:
        'Filtro de aceite original Toyota 04152-YZZA6, Filtro de aire 17801-F0020, Filtro de habitáculo Denso carbon activado. 4.2L Aceite sintético 0W-16 Motul Hybrid.',
      technicalObservations:
        'Comprobación del inversor y circuito de alta tensión sin fugas de aislamiento. Inyector de bypass y bujías revisadas sin depósitos anómalos.',
    },
    evidence: [],
    status: 'listo',
    statusHistory: [
      {
        from: null,
        to: 'recibido',
        timestamp: '2025-09-02T16:40:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
      },
      {
        from: 'recibido',
        to: 'en trabajo',
        timestamp: '2025-09-03T08:30:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
      },
      {
        from: 'en trabajo',
        to: 'listo',
        timestamp: '2025-09-03T12:00:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
        note: 'Trabajos finalizados con éxito y test de carretera sin anomalías.',
      },
    ],
    assignedTechnicianId: 'usr-tech-01',
    assignedTechnicianName: 'Mateo R.',
    advisorId: 'usr-adv-01',
    advisorName: 'Laura Méndez',
    createdAt: '2025-09-02T16:40:00.000Z',
    updatedAt: '2025-09-03T12:00:00.000Z',
  },
  {
    id: 'ord-004',
    orderNumber: 'OS-2025-035',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-003',
    clientId: 'cli-003',
    licensePlate: 'AB456CD',
    licensePlateNormalized: 'AB456CD',
    entryDate: '2025-09-12T08:30:00.000Z',
    entryMileage: 35100,
    visitReason: 'Testigo de control de emisiones encendido intermitente y pérdida de potencia en alta.',
    oil: {
      done: 'no_informado',
    },
    filters: {
      done: 'si',
      items: [
        { id: 'f-7', type: 'Combustible', brand: 'UFI Filters Diesel' },
      ],
    },
    mechanicalWork: {
      description:
        'Diagnóstico OBD con código P2002 (eficiencia de filtro de partículas diésel). Se detectó sensor diferencial de presión con lectura errática. Se sustituye sensor y se fuerza regeneración estática en banco.',
      futureRecommendations:
        'Se recomienda realizar ciclo en autopista a más de 2.500 rpm durante 20 minutos tras entrega.',
      partsReplacedNotes:
        'Sensor de presión diferencial DPF Bosch ref 0281006005 sustituido. Filtro de gasoil UFI montado con purga electrónica del circuito de combustible.',
      technicalObservations:
        'Saturación de hollín post-regeneración reducida al 6%. Presión diferencial en ralentí estable a 4 hPa. Tensión de alternador a 14.4V.',
    },
    evidence: [],
    status: 'en trabajo',
    statusHistory: [
      {
        from: null,
        to: 'recibido',
        timestamp: '2025-09-12T08:30:00.000Z',
        userId: 'usr-adv-01',
        userName: 'Laura Méndez',
        role: 'advisor',
      },
      {
        from: 'recibido',
        to: 'inspección',
        timestamp: '2025-09-12T09:00:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
      },
      {
        from: 'inspección',
        to: 'en trabajo',
        timestamp: '2025-09-12T10:15:00.000Z',
        userId: 'usr-tech-01',
        userName: 'Mateo R.',
        role: 'technician',
      },
    ],
    assignedTechnicianId: 'usr-tech-01',
    assignedTechnicianName: 'Mateo R.',
    advisorId: 'usr-adv-01',
    advisorName: 'Laura Méndez',
    createdAt: '2025-09-12T08:30:00.000Z',
    updatedAt: '2025-09-12T10:15:00.000Z',
  },
  {
    id: 'ord-005-other',
    orderNumber: 'OS-NOR-001',
    workshopId: 'workshop-test-02',
    vehicleId: 'veh-004-other',
    clientId: 'cli-004-other',
    licensePlate: 'VLA321',
    licensePlateNormalized: 'VLA321',
    entryDate: '2025-08-15T09:00:00.000Z',
    entryMileage: 78000,
    visitReason: 'Cambio de pastillas delanteras.',
    oil: { done: 'no' },
    filters: { done: 'no', items: [] },
    mechanicalWork: {
      description: 'Trabajo en Taller Norte SL',
      futureRecommendations: '',
      partsReplacedNotes: 'Juego de pastillas de freno delanteras Brembo P61066.',
      technicalObservations: 'Inspección ocular conforme.',
    },
    evidence: [],
    status: 'cerrado',
    statusHistory: [],
    advisorId: 'usr-other-02',
    advisorName: 'Javier Pérez',
    createdAt: '2025-08-15T09:00:00.000Z',
    updatedAt: '2025-08-15T09:00:00.000Z',
  },
];

const SAMPLE_REMINDERS: Reminder[] = [
  {
    id: 'rem-001',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-001',
    licensePlate: 'VLA481',
    clientName: 'Alejandro Morales Silva',
    clientWhatsApp: '+34 622 458 910',
    title: 'Próximo cambio de bujías (60.000 km)',
    dueDate: '2025-11-15',
    dueMileage: 60000,
    completed: false,
    notes: 'Recomendado en la última revisión de frenos.',
    createdAt: '2025-08-22T15:05:00.000Z',
  },
  {
    id: 'rem-002',
    workshopId: 'workshop-vla-01',
    vehicleId: 'veh-002',
    licensePlate: 'AA123BB',
    clientName: 'Beatriz Quintana Vega',
    clientWhatsApp: '+34 633 112 244',
    title: 'Revisión semestral de líquido de frenos DOT 4',
    dueDate: '2025-10-30',
    dueMileage: 70000,
    completed: false,
    notes: 'Avisar a la clienta con 3 días de antelación.',
    createdAt: '2025-09-03T12:05:00.000Z',
  },
];

// Sample Catalog of Workshop Services (Editable ONLY by Admin)
export const SAMPLE_SERVICES: WorkshopService[] = [
  {
    id: 'svc-001',
    workshopId: 'workshop-vla-01',
    code: 'SRV-MANT-01',
    name: 'Mantenimiento Preventivo 10.000 km',
    category: 'mantenimiento',
    description: 'Cambio de aceite 100% sintético según especificación OEM + sustitución de filtros de aceite, aire y habitáculo con chequeo multipunto de 25 elementos.',
    estimatedDurationMinutes: 60,
    basePrice: 145000,
    recommendedMileageInterval: 10000,
    requiresElevator: true,
    active: true,
    createdAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2025-01-15T09:00:00.000Z',
  },
  {
    id: 'svc-002',
    workshopId: 'workshop-vla-01',
    code: 'SRV-FREN-02',
    name: 'Frenado de Alta Precisión & Pastillas',
    category: 'frenos',
    description: 'Desmontaje de pinzas, limpieza ultrasonido, engrase cerámico de guías, pastillas de baja emisión y purgado de circuito con fluido DOT 5.1 a presión compensada.',
    estimatedDurationMinutes: 75,
    basePrice: 180000,
    recommendedMileageInterval: 30000,
    requiresElevator: true,
    active: true,
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
  },
  {
    id: 'svc-003',
    workshopId: 'workshop-vla-01',
    code: 'SRV-DIAG-03',
    name: 'Diagnosis Electrónica & Lectura OBD',
    category: 'electronica',
    description: 'Escaneo con máquina de diagnosis OBD, lectura y borrado de averías registradas y reseteo del aviso de revisión en cuadro.',
    estimatedDurationMinutes: 45,
    basePrice: 65000,
    requiresElevator: false,
    active: true,
    createdAt: '2025-02-01T08:30:00.000Z',
    updatedAt: '2025-02-01T08:30:00.000Z',
  },
  {
    id: 'svc-004',
    workshopId: 'workshop-vla-01',
    code: 'SRV-CLIM-04',
    name: 'Climatización & Carga Ecológica Gas R1234yf',
    category: 'climatizacion',
    description: 'Recuperación de gas residual, prueba de vacío y estanqueidad por 20 minutos, inyección de aceite PAG y recarga de refrigerante ecológico.',
    estimatedDurationMinutes: 50,
    basePrice: 95000,
    requiresElevator: false,
    active: true,
    createdAt: '2025-02-10T11:00:00.000Z',
    updatedAt: '2025-02-10T11:00:00.000Z',
  },
  {
    id: 'svc-005',
    workshopId: 'workshop-vla-01',
    code: 'SRV-SUSP-05',
    name: 'Alineación Tridimensional 3D & Tren de Rodaje',
    category: 'suspension',
    description: 'Medición computarizada en bancada láser, ajuste de cotas de convergencia, avance y caída en ambos ejes para desgaste uniforme.',
    estimatedDurationMinutes: 60,
    basePrice: 75000,
    recommendedMileageInterval: 20000,
    requiresElevator: true,
    active: true,
    createdAt: '2025-02-15T14:00:00.000Z',
    updatedAt: '2025-02-15T14:00:00.000Z',
  },
  {
    id: 'svc-006',
    workshopId: 'workshop-vla-01',
    code: 'SRV-ITV-06',
    name: 'Revisión Oficial Pre-ITV con Opacímetro',
    category: 'itv',
    description: 'Análisis de emisiones de 4 gases / opacidad diésel, frenómetro dinámico, holguras mecánicas de rótulas y reglaje óptico de faros.',
    estimatedDurationMinutes: 45,
    basePrice: 55000,
    requiresElevator: true,
    active: true,
    createdAt: '2025-02-20T09:00:00.000Z',
    updatedAt: '2025-02-20T09:00:00.000Z',
  },
];

// Default Weekly Schedule Configuration (Managed by Admin)
export const DEFAULT_WEEKLY_SCHEDULE: WeeklyScheduleConfig = {
  id: 'sched-vla-current',
  workshopId: 'workshop-vla-01',
  weekStartDate: '2026-09-14',
  weekName: 'Semana Turno Tarde (14:00 - 20:00)',
  pattern: 'tarde',
  defaultDailyRange: {
    open: '14:00',
    close: '20:00',
    slotDurationMinutes: 60,
    maxSimultaneousVehicles: 2,
    enabled: true,
  },
  days: {
    lunes: { open: '14:00', close: '20:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    martes: { open: '14:00', close: '20:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    miercoles: { open: '14:00', close: '20:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    jueves: { open: '14:00', close: '20:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    viernes: { open: '14:00', close: '20:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    sabado: { open: '09:00', close: '13:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
    domingo: { open: '00:00', close: '00:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 0, enabled: false },
  },
  googleCalendarConnected: true,
  googleCalendarId: 'taller.vla.turnos@gmail.com',
  autoSyncGoogleCalendar: true,
  updatedAt: new Date().toISOString(),
};

export const SAMPLE_APPOINTMENTS: AppointmentSlot[] = [
  {
    id: 'apt-001',
    workshopId: 'workshop-vla-01',
    date: '2026-09-14',
    startTime: '14:00',
    endTime: '15:00',
    clientName: 'Alejandro Morales Silva',
    clientPhone: '+34 622 458 910',
    clientEmail: 'amorales.silva@email.com',
    licensePlate: 'VLA481',
    serviceId: 'svc-001',
    serviceName: 'Mantenimiento Preventivo 10.000 km',
    notes: 'Revisión rápida de nivel de refrigerante antes de entrega.',
    status: 'reservado',
    googleEventId: 'gcal-evt-101',
    googleCalendarLink: 'https://calendar.google.com/calendar/r/eventedit?text=Mantenimiento+VLA481',
    createdAt: '2026-09-12T10:00:00.000Z',
  },
  {
    id: 'apt-002',
    workshopId: 'workshop-vla-01',
    date: '2026-09-14',
    startTime: '16:00',
    endTime: '17:00',
    clientName: 'Beatriz Quintana Vega',
    clientPhone: '+34 633 112 244',
    clientEmail: 'b.quintana@gmail.com',
    licensePlate: 'AA123BB',
    serviceId: 'svc-003',
    serviceName: 'Diagnosis Electrónica & Lectura OBD',
    notes: 'Lectura y borrado de aviso de mantenimiento en Toyota RAV4.',
    status: 'reservado',
    googleEventId: 'gcal-evt-102',
    googleCalendarLink: 'https://calendar.google.com/calendar/r/eventedit?text=Diagnosis+AA123BB',
    createdAt: '2026-09-12T14:30:00.000Z',
  },
];

const STORAGE_KEYS = {
  WORKSHOPS: 'vla_workshops_v2',
  CLIENTS: 'vla_clients_v2',
  VEHICLES: 'vla_vehicles_v2',
  ORDERS: 'vla_orders_v2',
  REMINDERS: 'vla_reminders_v2',
  SERVICES: 'vla_services_v2',
  SCHEDULES: 'vla_schedules_v2',
  APPOINTMENTS: 'vla_appointments_v2',
  GCAL_STATUS: 'vla_gcal_status_v2',
  CURRENT_WORKSHOP_ID: 'vla_current_workshop_id_v2',
  CURRENT_USER_UID: 'vla_current_user_uid_v2',
};

class StorageRepository {
  private workshops: Workshop[] = [];
  private clients: Client[] = [];
  private vehicles: Vehicle[] = [];
  private orders: ServiceOrder[] = [];
  private reminders: Reminder[] = [];
  private services: WorkshopService[] = [];
  private schedules: WeeklyScheduleConfig[] = [];
  private appointments: AppointmentSlot[] = [];
  private gcalStatus: GoogleCalendarSyncStatus = {
    connected: true,
    calendarName: 'V-LA Turnos Taller (Oficial)',
    calendarId: 'taller.vla.turnos@gmail.com',
    accountEmail: 'admin@vlataller.com',
    lastSyncTimestamp: '2026-09-13T09:30:00.000Z',
    syncedEventsCount: 14,
    pendingSyncCount: 0,
  };
  private currentWorkshopId: string = 'workshop-vla-01';
  private currentUserUid: string = 'usr-admin-01';

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedWorkshops = localStorage.getItem(STORAGE_KEYS.WORKSHOPS);
      this.workshops = storedWorkshops ? JSON.parse(storedWorkshops) : INITIAL_WORKSHOPS;
      // Ensure googleMapsUrl, publishAddress and ARS currency are present on all workshops
      this.workshops.forEach((ws) => {
        if (!ws.googleMapsUrl || ws.id === 'workshop-vla-01') {
          ws.googleMapsUrl = ws.googleMapsUrl || OFFICIAL_WORKSHOP_MAPS_URL;
        }
        if (ws.publishAddress === undefined) {
          ws.publishAddress = true;
        }
        if (!ws.address || ws.address === 'V-LA Taller Mecánico') {
          ws.address = 'V-LA Taller Mecánico, Córdoba, Argentina';
        }
        ws.currency = 'ARS';
      });

      const storedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      this.clients = storedClients ? JSON.parse(storedClients) : SAMPLE_CLIENTS;

      const storedVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      this.vehicles = storedVehicles ? JSON.parse(storedVehicles) : SAMPLE_VEHICLES;

      const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      this.orders = storedOrders ? JSON.parse(storedOrders) : SAMPLE_ORDERS;

      const storedReminders = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      this.reminders = storedReminders ? JSON.parse(storedReminders) : SAMPLE_REMINDERS;

      const storedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      this.services = storedServices ? JSON.parse(storedServices) : SAMPLE_SERVICES;
      // Ensure prices are in Argentine Pesos (convert legacy demo values)
      this.services.forEach((s) => {
        if (s.basePrice < 1000) {
          s.basePrice = s.basePrice * 1000;
        }
      });

      const storedSchedules = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      this.schedules = storedSchedules ? JSON.parse(storedSchedules) : [DEFAULT_WEEKLY_SCHEDULE];

      const storedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      this.appointments = storedAppointments ? JSON.parse(storedAppointments) : SAMPLE_APPOINTMENTS;

      const storedGcal = localStorage.getItem(STORAGE_KEYS.GCAL_STATUS);
      if (storedGcal) {
        this.gcalStatus = JSON.parse(storedGcal);
      }

      const storedWId = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKSHOP_ID);
      if (storedWId && this.workshops.some((w) => w.id === storedWId)) {
        this.currentWorkshopId = storedWId;
      }

      const storedUId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_UID);
      if (storedUId && INITIAL_USERS.some((u) => u.uid === storedUId)) {
        this.currentUserUid = storedUId;
      }

      const storedAuthSession = localStorage.getItem('vla_auth_session');
      if (storedAuthSession) {
        try {
          const session = JSON.parse(storedAuthSession);
          if (session?.uid && INITIAL_USERS.some((u) => u.uid === session.uid)) {
            this.currentUserUid = session.uid;
          }
        } catch (_) {
          // ignore parsing error
        }
      }
    } catch (e) {
      console.warn('LocalStorage error or unavailable, fallback to in-memory state', e);
      this.workshops = [...INITIAL_WORKSHOPS];
      this.clients = [...SAMPLE_CLIENTS];
      this.vehicles = [...SAMPLE_VEHICLES];
      this.orders = [...SAMPLE_ORDERS];
      this.reminders = [...SAMPLE_REMINDERS];
      this.services = [...SAMPLE_SERVICES];
      this.schedules = [DEFAULT_WEEKLY_SCHEDULE];
      this.appointments = [...SAMPLE_APPOINTMENTS];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKSHOPS, JSON.stringify(this.workshops));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(this.clients));
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(this.vehicles));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(this.reminders));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(this.services));
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(this.schedules));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(this.appointments));
      localStorage.setItem(STORAGE_KEYS.GCAL_STATUS, JSON.stringify(this.gcalStatus));
      localStorage.setItem(STORAGE_KEYS.CURRENT_WORKSHOP_ID, this.currentWorkshopId);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_UID, this.currentUserUid);
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }

  public resetToDemoData() {
    this.workshops = [...INITIAL_WORKSHOPS];
    this.clients = [...SAMPLE_CLIENTS];
    this.vehicles = [...SAMPLE_VEHICLES];
    this.orders = [...SAMPLE_ORDERS];
    this.reminders = [...SAMPLE_REMINDERS];
    this.currentWorkshopId = 'workshop-vla-01';
    this.currentUserUid = 'usr-adv-01';
    this.persist();
  }

  // License plate helper
  public normalizeLicensePlate(input: string): string {
    return normalizeLicensePlate(input);
  }

  // Multi-Tenant workshop context
  public getWorkshops(): Workshop[] {
    return this.workshops;
  }

  public getCurrentWorkshop(): Workshop {
    const found = this.workshops.find((w) => w.id === this.currentWorkshopId);
    return found || this.workshops[0];
  }

  public updateCurrentWorkshop(data: Partial<Workshop>): Workshop {
    const ws = this.getCurrentWorkshop();
    Object.assign(ws, data);
    this.persist();
    return ws;
  }

  public updateWorkshopAddress(
    address: string,
    googleMapsUrl?: string,
    publishAddress?: boolean,
  ): Workshop {
    const ws = this.getCurrentWorkshop();
    ws.address = address.trim();
    if (googleMapsUrl !== undefined) {
      ws.googleMapsUrl = googleMapsUrl.trim();
    }
    if (publishAddress !== undefined) {
      ws.publishAddress = publishAddress;
    }
    this.persist();
    return ws;
  }

  public switchWorkshop(workshopId: string) {
    if (this.workshops.some((w) => w.id === workshopId)) {
      this.currentWorkshopId = workshopId;
      // Auto assign appropriate user for that workshop
      const workshopUser = INITIAL_USERS.find((u) => u.workshopId === workshopId);
      if (workshopUser) {
        this.currentUserUid = workshopUser.uid;
      }
      this.persist();
    }
  }

  // User Profile and Roles
  public getCurrentUser(): UserProfile {
    const found = INITIAL_USERS.find((u) => u.uid === this.currentUserUid);
    if (found && found.workshopId === this.currentWorkshopId) {
      return found;
    }
    // Fallback to first user belonging to current workshop
    return (
      INITIAL_USERS.find((u) => u.workshopId === this.currentWorkshopId) || {
        uid: 'usr-fallback',
        displayName: 'Operador del Taller',
        email: 'staff@vlataller.com',
        role: 'advisor',
        workshopId: this.currentWorkshopId,
      }
    );
  }

  public switchUserRole(role: UserRole) {
    const userForRole = INITIAL_USERS.find(
      (u) => u.workshopId === this.currentWorkshopId && u.role === role,
    );
    if (userForRole) {
      this.currentUserUid = userForRole.uid;
      this.persist();
    }
  }

  public switchUserByUid(uid: string) {
    const user = INITIAL_USERS.find((u) => u.uid === uid);
    if (user) {
      this.currentUserUid = user.uid;
      this.currentWorkshopId = user.workshopId;
      this.persist();
    }
  }

  // Authentication for Admin (User: ADMIN / Pass: PANCHO2026)
  public authenticateUser(
    usernameInput: string,
    passwordInput: string,
  ): { success: boolean; user?: UserProfile; message: string } {
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    // Check requested admin credentials
    if (cleanUser.toUpperCase() === 'ADMIN' && cleanPass === 'PANCHO2026') {
      const adminUser = INITIAL_USERS.find((u) => u.uid === 'usr-admin-vla') || {
        uid: 'usr-admin-vla',
        username: 'ADMIN',
        displayName: 'ADMIN (Administrador General)',
        email: 'admin@vlataller.com',
        role: 'admin' as UserRole,
        workshopId: 'workshop-vla-01',
      };
      this.currentUserUid = adminUser.uid;
      this.currentWorkshopId = adminUser.workshopId;
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'vla_auth_session',
          JSON.stringify({
            uid: adminUser.uid,
            username: 'ADMIN',
            role: 'admin',
            timestamp: Date.now(),
          }),
        );
      }
      this.persist();
      return {
        success: true,
        user: adminUser,
        message: '¡Bienvenido, ADMIN! Acceso administrativo total desbloqueado.',
      };
    }

    return {
      success: false,
      message: 'Credenciales inválidas. Usuario esperado: ADMIN | Contraseña: PANCHO2026',
    };
  }

  public logoutUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vla_auth_session');
    }
    const advisor = INITIAL_USERS.find(
      (u) => u.workshopId === this.currentWorkshopId && u.role === 'advisor',
    );
    if (advisor) {
      this.currentUserUid = advisor.uid;
    }
    this.persist();
  }

  public isUserAuthenticatedAsAdmin(): boolean {
    const user = this.getCurrentUser();
    return user.role === 'admin' && (user.username === 'ADMIN' || user.uid === 'usr-admin-vla');
  }

  // Security Check Helper: strictly enforces workshop isolation
  private enforceWorkshopBoundary(dataWorkshopId: string) {
    if (dataWorkshopId !== this.currentWorkshopId) {
      throw new Error(
        `Acceso denegado: El registro pertenece a otro taller (${dataWorkshopId}) y el taller activo es (${this.currentWorkshopId}).`,
      );
    }
  }

  // Reception / Vehicle Search by License Plate
  public searchVehicleByPlate(
    rawPlate: string,
  ): { vehicle: Vehicle; client: Client; lastOrder?: ServiceOrder; orderCount: number } | null {
    const normalized = normalizeLicensePlate(rawPlate);
    if (!normalized) return null;

    // Strict multi-tenant isolation: only search vehicles of CURRENT workshop
    const vehicle = this.vehicles.find(
      (v) =>
        v.workshopId === this.currentWorkshopId &&
        v.licensePlateNormalized === normalized,
    );

    if (!vehicle) return null;

    const client = this.clients.find(
      (c) => c.workshopId === this.currentWorkshopId && c.id === vehicle.clientId,
    );

    if (!client) return null;

    // Find all orders for this vehicle in current workshop
    const vehicleOrders = this.orders
      .filter(
        (o) => o.workshopId === this.currentWorkshopId && o.vehicleId === vehicle.id,
      )
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

    return {
      vehicle,
      client,
      lastOrder: vehicleOrders[0],
      orderCount: vehicleOrders.length,
    };
  }

  // Quick list of vehicles for suggestions
  public getVehicles(): { vehicle: Vehicle; client: Client }[] {
    return this.vehicles
      .filter((v) => v.workshopId === this.currentWorkshopId)
      .map((vehicle) => {
        const client = this.clients.find((c) => c.id === vehicle.clientId) || {
          id: vehicle.clientId,
          workshopId: this.currentWorkshopId,
          fullName: 'Propietario no asignado',
          phoneWhatsApp: '',
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        };
        return { vehicle, client };
      });
  }

  // Registration: Client + Vehicle in an atomic action
  public registerClientAndVehicle(params: {
    fullName: string;
    phoneWhatsApp: string;
    email?: string;
    licensePlate: string;
    brand: string;
    model: string;
    version: string;
    year: number;
    currentMileage: number;
    vin?: string;
  }): { client: Client; vehicle: Vehicle } {
    const currentUser = this.getCurrentUser();
    // Role check: Only admin and advisor can register clients and vehicles
    if (currentUser.role === 'technician') {
      throw new Error(
        'Permiso denegado: El rol de técnico no tiene autorización para registrar nuevos clientes y vehículos. Solicite a un Asesor o Administrador.',
      );
    }

    const normalizedPlate = normalizeLicensePlate(params.licensePlate);
    if (!normalizedPlate) {
      throw new Error('La matrícula introducida no es válida.');
    }

    // Check if plate already exists in this workshop
    const existing = this.vehicles.find(
      (v) =>
        v.workshopId === this.currentWorkshopId &&
        v.licensePlateNormalized === normalizedPlate,
    );
    if (existing) {
      throw new Error(
        `El vehículo con matrícula ${params.licensePlate} ya está registrado en este taller.`,
      );
    }

    const timestamp = new Date().toISOString();
    const clientId = `cli-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const vehicleId = `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newClient: Client = {
      id: clientId,
      workshopId: this.currentWorkshopId,
      fullName: params.fullName.trim(),
      phoneWhatsApp: params.phoneWhatsApp.trim(),
      email: params.email?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const newVehicle: Vehicle = {
      id: vehicleId,
      workshopId: this.currentWorkshopId,
      clientId: clientId,
      licensePlate: params.licensePlate.trim().toUpperCase(),
      licensePlateNormalized: normalizedPlate,
      brand: params.brand.trim(),
      model: params.model.trim(),
      version: params.version.trim(),
      year: Number(params.year),
      currentMileage: Number(params.currentMileage),
      vin: params.vin?.trim() || undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.clients.push(newClient);
    this.vehicles.push(newVehicle);
    this.persist();

    return { client: newClient, vehicle: newVehicle };
  }

  // Service Order Creation
  public createServiceOrder(
    data: Omit<
      ServiceOrder,
      'id' | 'orderNumber' | 'workshopId' | 'createdAt' | 'updatedAt' | 'statusHistory'
    >,
  ): ServiceOrder {
    const currentUser = this.getCurrentUser();
    // Role check: Only admin and advisor can initiate service orders
    if (currentUser.role === 'technician') {
      throw new Error(
        'Permiso denegado: Los técnicos no pueden abrir nuevas órdenes de servicio. Contacte a Recepción o Asesoría.',
      );
    }

    const now = new Date().toISOString();
    const countThisYear =
      this.orders.filter((o) => o.workshopId === this.currentWorkshopId).length + 1;
    const orderNumber = `OS-${new Date().getFullYear()}-${String(countThisYear).padStart(3, '0')}`;
    const orderId = `ord-${Date.now()}`;

    const initialTransition = {
      from: null,
      to: data.status || 'recibido',
      timestamp: now,
      userId: currentUser.uid,
      userName: currentUser.displayName,
      role: currentUser.role,
      note: 'Apertura de orden en recepción',
    };

    const newOrder: ServiceOrder = {
      ...data,
      id: orderId,
      orderNumber,
      workshopId: this.currentWorkshopId,
      statusHistory: [initialTransition],
      createdAt: now,
      updatedAt: now,
    };

    this.orders.unshift(newOrder);

    // Update vehicle's mileage and lastVisitDate
    const vehicle = this.vehicles.find(
      (v) => v.workshopId === this.currentWorkshopId && v.id === data.vehicleId,
    );
    if (vehicle) {
      if (data.entryMileage > vehicle.currentMileage) {
        vehicle.currentMileage = data.entryMileage;
      }
      vehicle.lastVisitDate = data.entryDate || now;
      vehicle.updatedAt = now;
    }

    this.persist();
    return newOrder;
  }

  // Update existing Service Order
  public updateServiceOrder(
    orderId: string,
    updates: Partial<ServiceOrder>,
    note?: string,
  ): ServiceOrder {
    const order = this.orders.find(
      (o) => o.workshopId === this.currentWorkshopId && o.id === orderId,
    );
    if (!order) {
      throw new Error('Orden de servicio no encontrada en el taller activo.');
    }

    const currentUser = this.getCurrentUser();
    const now = new Date().toISOString();

    // RBAC Permissions check:
    // Technician: Can only edit assigned / permitted operational fields:
    // inspection, oil, filters, mechanicalWork, evidence, status to 'en trabajo' or 'listo'
    if (currentUser.role === 'technician') {
      if (updates.status === 'cerrado' || updates.status === 'presupuesto') {
        throw new Error(
          'Permiso denegado: El técnico no tiene autorización para presupuestar o cerrar formalmente la orden. Corresponde al Asesor o Administrador.',
        );
      }
    }

    // Status transition tracking
    if (updates.status && updates.status !== order.status) {
      const transition = {
        from: order.status,
        to: updates.status,
        timestamp: now,
        userId: currentUser.uid,
        userName: currentUser.displayName,
        role: currentUser.role,
        note: note || `Cambio de estado a ${updates.status}`,
      };
      order.statusHistory.push(transition);
      order.status = updates.status;

      if (updates.status === 'cerrado') {
        order.closedAt = now;
      }
    }

    if (updates.oil !== undefined) order.oil = updates.oil;
    if (updates.filters !== undefined) order.filters = updates.filters;
    if (updates.mechanicalWork !== undefined) order.mechanicalWork = updates.mechanicalWork;
    if (updates.evidence !== undefined) order.evidence = updates.evidence;
    if (updates.exitMileage !== undefined) order.exitMileage = updates.exitMileage;
    if (updates.assignedTechnicianId !== undefined) {
      order.assignedTechnicianId = updates.assignedTechnicianId;
      order.assignedTechnicianName = updates.assignedTechnicianName;
    }

    order.updatedAt = now;

    // If exitMileage was provided and greater than vehicle mileage, update vehicle
    if (updates.exitMileage) {
      const vehicle = this.vehicles.find((v) => v.id === order.vehicleId);
      if (vehicle && updates.exitMileage > vehicle.currentMileage) {
        vehicle.currentMileage = updates.exitMileage;
        vehicle.updatedAt = now;
      }
    }

    this.persist();
    return order;
  }

  // Vehicle History Query
  public getVehicleHistory(vehicleId: string): {
    vehicle: Vehicle;
    client: Client;
    orders: ServiceOrder[];
  } | null {
    const vehicle = this.vehicles.find(
      (v) => v.workshopId === this.currentWorkshopId && v.id === vehicleId,
    );
    if (!vehicle) return null;

    const client = this.clients.find(
      (c) => c.workshopId === this.currentWorkshopId && c.id === vehicle.clientId,
    );
    if (!client) return null;

    const orders = this.orders
      .filter((o) => o.workshopId === this.currentWorkshopId && o.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

    return { vehicle, client, orders };
  }

  // Dashboard Metrics & Operational Data
  public getDashboardData() {
    const workshopOrders = this.orders.filter(
      (o) => o.workshopId === this.currentWorkshopId,
    );
    const todayStr = new Date().toISOString().slice(0, 10);

    const receivedToday = workshopOrders.filter((o) => {
      const orderDate = (o.entryDate || o.createdAt).slice(0, 10);
      return orderDate === todayStr || o.status === 'recibido';
    }).length;

    const inProgress = workshopOrders.filter((o) => o.status === 'en trabajo').length;
    const ready = workshopOrders.filter((o) => o.status === 'listo').length;
    const pendingMaintenance = this.reminders.filter(
      (r) => r.workshopId === this.currentWorkshopId && !r.completed,
    ).length;

    const recentOrders = [...workshopOrders]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);

    const activeReminders = this.reminders
      .filter((r) => r.workshopId === this.currentWorkshopId && !r.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return {
      metrics: {
        receivedToday,
        inProgress,
        ready,
        pendingMaintenance,
        totalOrders: workshopOrders.length,
        totalVehicles: this.vehicles.filter((v) => v.workshopId === this.currentWorkshopId).length,
      },
      recentOrders,
      reminders: activeReminders,
    };
  }

  // Reminders Management
  public getReminders(): Reminder[] {
    return this.reminders
      .filter((r) => r.workshopId === this.currentWorkshopId)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  public createReminder(
    data: Omit<Reminder, 'id' | 'workshopId' | 'createdAt'>,
  ): Reminder {
    const now = new Date().toISOString();
    const newRem: Reminder = {
      ...data,
      id: `rem-${Date.now()}`,
      workshopId: this.currentWorkshopId,
      createdAt: now,
    };
    this.reminders.unshift(newRem);
    this.persist();
    return newRem;
  }

  public toggleReminder(id: string): Reminder | null {
    const rem = this.reminders.find(
      (r) => r.workshopId === this.currentWorkshopId && r.id === id,
    );
    if (!rem) return null;
    rem.completed = !rem.completed;
    this.persist();
    return rem;
  }

  // ================= ADMIN SERVICES CATALOG (ONLY ADMIN CAN CREATE/EDIT) =================

  public getWorkshopServices(): WorkshopService[] {
    return this.services.filter((s) => s.workshopId === this.currentWorkshopId);
  }

  public createWorkshopService(
    data: Omit<WorkshopService, 'id' | 'workshopId' | 'createdAt' | 'updatedAt'>,
  ): WorkshopService {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'admin') {
      throw new Error('Permiso denegado: Únicamente el usuario con rol Administrador puede dar de alta nuevos servicios en el catálogo.');
    }

    const now = new Date().toISOString();
    const newService: WorkshopService = {
      ...data,
      id: `svc-${Date.now()}`,
      workshopId: this.currentWorkshopId,
      createdAt: now,
      updatedAt: now,
    };

    this.services.push(newService);
    this.persist();
    return newService;
  }

  public updateWorkshopService(
    id: string,
    data: Partial<Omit<WorkshopService, 'id' | 'workshopId' | 'createdAt'>>,
  ): WorkshopService {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'admin') {
      throw new Error('Permiso denegado: Únicamente el Administrador puede modificar los servicios del catálogo.');
    }

    const idx = this.services.findIndex(
      (s) => s.id === id && s.workshopId === this.currentWorkshopId,
    );
    if (idx === -1) {
      throw new Error('Servicio no encontrado en el taller actual.');
    }

    this.services[idx] = {
      ...this.services[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.persist();
    return this.services[idx];
  }

  public deleteWorkshopService(id: string): boolean {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'admin') {
      throw new Error('Permiso denegado: Únicamente el Administrador puede eliminar servicios del catálogo.');
    }

    const prevLength = this.services.length;
    this.services = this.services.filter(
      (s) => !(s.id === id && s.workshopId === this.currentWorkshopId),
    );

    if (this.services.length !== prevLength) {
      this.persist();
      return true;
    }
    return false;
  }

  // ================= ADMIN SCHEDULE & SHIFTS CONFIGURATION (14-20 or 8-12) =================

  public getWeeklySchedule(weekStartDate?: string): WeeklyScheduleConfig {
    const targetWeek = weekStartDate || '2026-09-14';
    const found = this.schedules.find(
      (s) => s.workshopId === this.currentWorkshopId && s.weekStartDate === targetWeek,
    );
    if (found) return found;

    // Return default or active schedule cloned for target week
    const current = this.schedules.find((s) => s.workshopId === this.currentWorkshopId);
    if (current) {
      return {
        ...current,
        id: `sched-${Date.now()}`,
        weekStartDate: targetWeek,
      };
    }

    return {
      ...DEFAULT_WEEKLY_SCHEDULE,
      workshopId: this.currentWorkshopId,
      weekStartDate: targetWeek,
    };
  }

  public updateWeeklySchedule(
    config: Partial<WeeklyScheduleConfig> & { weekStartDate: string },
  ): WeeklyScheduleConfig {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'admin') {
      throw new Error('Permiso denegado: Solo el Administrador puede configurar la disponibilidad y turnos del taller.');
    }

    const existingIdx = this.schedules.findIndex(
      (s) => s.workshopId === this.currentWorkshopId && s.weekStartDate === config.weekStartDate,
    );

    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      this.schedules[existingIdx] = {
        ...this.schedules[existingIdx],
        ...config,
        updatedAt: now,
      };
      this.persist();
      return this.schedules[existingIdx];
    } else {
      const newConfig: WeeklyScheduleConfig = {
        ...DEFAULT_WEEKLY_SCHEDULE,
        ...config,
        id: `sched-${Date.now()}`,
        workshopId: this.currentWorkshopId,
        updatedAt: now,
      };
      this.schedules.push(newConfig);
      this.persist();
      return newConfig;
    }
  }

  /**
   * Applies quick operational shift presets:
   * - 'tarde': 14:00 a 20:00 (Ejemplo del usuario)
   * - 'manana': 08:00 a 12:00 (Ejemplo del usuario)
   * - 'completo': 08:30 a 18:30
   */
  public applySchedulePreset(
    pattern: 'tarde' | 'manana' | 'completo',
    weekStartDate?: string,
  ): WeeklyScheduleConfig {
    const currentUser = this.getCurrentUser();
    if (currentUser.role !== 'admin') {
      throw new Error('Permiso denegado: Solo el Administrador puede aplicar patrones de turno.');
    }

    const open = pattern === 'tarde' ? '14:00' : pattern === 'manana' ? '08:00' : '08:30';
    const close = pattern === 'tarde' ? '20:00' : pattern === 'manana' ? '12:00' : '18:30';
    const weekName =
      pattern === 'tarde'
        ? 'Semana Turno Tarde (14:00 - 20:00)'
        : pattern === 'manana'
        ? 'Semana Turno Mañana (08:00 - 12:00)'
        : 'Semana Jornada Completa (08:30 - 18:30)';

    const defaultRange: DailyTimeRange = {
      open,
      close,
      slotDurationMinutes: 60,
      maxSimultaneousVehicles: 2,
      enabled: true,
    };

    return this.updateWeeklySchedule({
      weekStartDate: weekStartDate || '2026-09-14',
      weekName,
      pattern,
      defaultDailyRange: defaultRange,
      days: {
        lunes: { ...defaultRange },
        martes: { ...defaultRange },
        miercoles: { ...defaultRange },
        jueves: { ...defaultRange },
        viernes: { ...defaultRange },
        sabado: pattern === 'manana' ? { ...defaultRange } : { open: '09:00', close: '13:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 2, enabled: true },
        domingo: { open: '00:00', close: '00:00', slotDurationMinutes: 60, maxSimultaneousVehicles: 0, enabled: false },
      },
    });
  }

  // ================= APPOINTMENTS & TURNO SLOTS ENGINE =================

  public getAppointments(dateFilter?: string): AppointmentSlot[] {
    return this.appointments
      .filter((a) => {
        if (a.workshopId !== this.currentWorkshopId) return false;
        if (dateFilter && a.date !== dateFilter) return false;
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  /**
   * Generates time slots dynamically based on the active weekly schedule
   * for the specific day of the week!
   */
  public generateAvailableSlots(dateStr: string): AppointmentSlot[] {
    const d = new Date(dateStr + 'T12:00:00Z');
    const dayNames: (keyof WeeklyScheduleConfig['days'])[] = [
      'domingo',
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
    ];
    const dayName = dayNames[d.getUTCDay()];

    const schedule = this.getWeeklySchedule();
    const dayConfig = schedule.days[dayName];

    if (!dayConfig || !dayConfig.enabled) {
      return [];
    }

    const [openH, openM] = dayConfig.open.split(':').map(Number);
    const [closeH, closeM] = dayConfig.close.split(':').map(Number);
    const startMinutes = openH * 60 + openM;
    const endMinutes = closeH * 60 + closeM;
    const step = dayConfig.slotDurationMinutes || 60;

    const existingAppointments = this.appointments.filter(
      (a) => a.workshopId === this.currentWorkshopId && a.date === dateStr && a.status !== 'cancelado',
    );

    const slots: AppointmentSlot[] = [];

    for (let m = startMinutes; m + step <= endMinutes; m += step) {
      const slotStartH = Math.floor(m / 60);
      const slotStartM = m % 60;
      const slotEndH = Math.floor((m + step) / 60);
      const slotEndM = (m + step) % 60;

      const formatTime = (h: number, min: number) =>
        `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

      const startTime = formatTime(slotStartH, slotStartM);
      const endTime = formatTime(slotEndH, slotEndM);

      const booked = existingAppointments.find((a) => a.startTime === startTime);

      if (booked) {
        slots.push(booked);
      } else {
        slots.push({
          id: `slot-${dateStr}-${startTime.replace(':', '')}`,
          workshopId: this.currentWorkshopId,
          date: dateStr,
          startTime,
          endTime,
          status: 'disponible',
          createdAt: new Date().toISOString(),
        });
      }
    }

    return slots;
  }

  public bookAppointment(
    data: Omit<AppointmentSlot, 'id' | 'workshopId' | 'createdAt'>,
  ): AppointmentSlot {
    const now = new Date().toISOString();
    const newApt: AppointmentSlot = {
      ...data,
      id: `apt-${Date.now()}`,
      workshopId: this.currentWorkshopId,
      status: 'reservado',
      googleEventId: `gcal-${Date.now()}`,
      googleCalendarLink: this.generateGoogleCalendarUrl({
        ...data,
        id: `apt-${Date.now()}`,
        workshopId: this.currentWorkshopId,
        status: 'reservado',
        createdAt: now,
      }),
      createdAt: now,
    };

    // Remove any existing placeholder for same date & time
    this.appointments = this.appointments.filter(
      (a) => !(a.workshopId === this.currentWorkshopId && a.date === data.date && a.startTime === data.startTime),
    );

    this.appointments.push(newApt);
    this.gcalStatus.syncedEventsCount += 1;
    this.gcalStatus.lastSyncTimestamp = now;
    this.persist();
    return newApt;
  }

  public cancelAppointment(id: string): boolean {
    const apt = this.appointments.find(
      (a) => a.id === id && a.workshopId === this.currentWorkshopId,
    );
    if (!apt) return false;
    apt.status = 'cancelado';
    this.persist();
    return true;
  }

  // ================= GOOGLE CALENDAR INTEGRATION & EVALUATION =================

  public getGoogleCalendarStatus(): GoogleCalendarSyncStatus {
    return this.gcalStatus;
  }

  public toggleGoogleCalendarSync(enabled: boolean): GoogleCalendarSyncStatus {
    this.gcalStatus.connected = enabled;
    this.gcalStatus.lastSyncTimestamp = new Date().toISOString();
    this.persist();
    return this.gcalStatus;
  }

  /**
   * Generates a direct Google Calendar Web Intent URL to add this appointment
   * with complete vehicle, plate and client notes with a single click!
   */
  public generateGoogleCalendarUrl(slot: AppointmentSlot): string {
    const title = encodeURIComponent(
      `Turno Taller V-LA: ${slot.licensePlate || 'Vehículo'} - ${slot.serviceName || 'Servicio'}`,
    );
    const startIso = `${slot.date.replace(/-/g, '')}T${slot.startTime.replace(':', '')}00Z`;
    const endIso = `${slot.date.replace(/-/g, '')}T${slot.endTime.replace(':', '')}00Z`;
    const details = encodeURIComponent(
      `Cita de servicio automotriz en V-LA Taller Mecánico.\nMatrícula: ${slot.licensePlate}\nCliente: ${slot.clientName} (${slot.clientPhone})\nServicio: ${slot.serviceName}\nUbicación Google Maps: ${OFFICIAL_WORKSHOP_MAPS_URL}\nNotas: ${slot.notes || 'Ninguna'}`,
    );
    const location = encodeURIComponent(`V-LA Taller Mecánico - ${OFFICIAL_WORKSHOP_MAPS_URL}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  }

  /**
   * Generates a standard RFC 5545 iCalendar (.ics) string for direct download
   */
  public generateICSDownload(slot: AppointmentSlot): string {
    const cleanDate = slot.date.replace(/-/g, '');
    const cleanStart = slot.startTime.replace(':', '') + '00';
    const cleanEnd = slot.endTime.replace(':', '') + '00';

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//V-LA Taller Mecanico//Turnos Calendar//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${slot.id}@vlataller.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART:${cleanDate}T${cleanStart}`,
      `DTEND:${cleanDate}T${cleanEnd}`,
      `SUMMARY:Turno V-LA Taller: ${slot.licensePlate || 'Auto'} - ${slot.serviceName || 'Servicio'}`,
      `DESCRIPTION:Cliente: ${slot.clientName}\\nTel: ${slot.clientPhone}\\nMatrícula: ${slot.licensePlate}\\nUbicación: ${OFFICIAL_WORKSHOP_MAPS_URL}\\nNotas: ${slot.notes || 'Revisión'}`,
      `LOCATION:V-LA Taller Mecánico - ${OFFICIAL_WORKSHOP_MAPS_URL}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  // Get order by ID
  public getOrderById(orderId: string): ServiceOrder | null {
    const order = this.orders.find(
      (o) => o.workshopId === this.currentWorkshopId && o.id === orderId,
    );
    return order || null;
  }
}

export const storageRepository = new StorageRepository();
