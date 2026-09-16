export type UserRole = 'admin' | 'advisor' | 'technician';

export interface UserProfile {
  uid: string;
  username?: string;
  email: string;
  displayName: string;
  role: UserRole;
  workshopId: string;
  avatarUrl?: string;
}

export interface Workshop {
  id: string;
  name: string;
  businessName: string;
  phoneWhatsApp: string;
  email: string;
  address: string;
  schedule: string;
  currency: string;
  googleMapsUrl?: string;
  publishAddress?: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  workshopId: string;
  fullName: string;
  phoneWhatsApp: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle {
  id: string;
  workshopId: string;
  clientId: string;
  licensePlate: string;
  licensePlateNormalized: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  currentMileage: number;
  vin?: string;
  lastVisitDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'recibido'
  | 'inspección'
  | 'presupuesto'
  | 'aprobado'
  | 'en trabajo'
  | 'listo'
  | 'cerrado';

export interface StatusTransition {
  from: OrderStatus | null;
  to: OrderStatus;
  timestamp: string;
  userId: string;
  userName: string;
  role: UserRole;
  note?: string;
}

export type SegmentOption = 'si' | 'no' | 'no_informado';

export interface OilService {
  done: SegmentOption;
  brand?: string;
  specification?: string;
  viscosity?: string;
}

export type FilterType =
  | 'Aire de motor'
  | 'Aceite'
  | 'Habitáculo (Cabina)'
  | 'Combustible'
  | 'Caja / Transmisión'
  | 'Líquido de frenos'
  | 'Otro';

export interface FilterItem {
  id: string;
  type: FilterType;
  brand: string;
  notes?: string;
}

export interface FiltersService {
  done: SegmentOption;
  items: FilterItem[];
}

export interface MechanicalWork {
  description: string;
  futureRecommendations: string;
  partsReplacedNotes?: string;
  technicalObservations?: string;
}

export type EvidenceCategory =
  | 'recepcion'
  | 'trabajo'
  | 'pieza_dañada'
  | 'finalizado';

export interface EvidenceImage {
  id: string;
  url: string;
  description: string;
  category: EvidenceCategory;
  uploadedAt: string;
  fileName?: string;
}

export interface ServiceOrder {
  id: string;
  orderNumber: string;
  workshopId: string;
  vehicleId: string;
  clientId: string;
  licensePlate: string;
  licensePlateNormalized: string;
  entryDate: string;
  entryMileage: number;
  exitMileage?: number;
  visitReason: string;
  oil: OilService;
  filters: FiltersService;
  mechanicalWork: MechanicalWork;
  evidence?: EvidenceImage[];
  status: OrderStatus;
  statusHistory: StatusTransition[];
  assignedTechnicianId?: string;
  assignedTechnicianName?: string;
  advisorId: string;
  advisorName: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface Reminder {
  id: string;
  workshopId: string;
  vehicleId: string;
  licensePlate: string;
  clientName: string;
  clientWhatsApp: string;
  title: string;
  dueDate: string;
  dueMileage?: number;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

// Catalog of Services (Only Admin can create/edit)
export type ServiceCategory =
  | 'mantenimiento'
  | 'frenos'
  | 'motor'
  | 'suspension'
  | 'electronica'
  | 'climatizacion'
  | 'itv';

export interface WorkshopService {
  id: string;
  workshopId: string;
  code: string;
  name: string;
  category: ServiceCategory;
  description: string;
  estimatedDurationMinutes: number;
  basePrice: number;
  recommendedMileageInterval?: number;
  requiresElevator: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Weekly Schedule & Shifts Configuration (Managed by Admin)
export interface DailyTimeRange {
  open: string; // e.g. "14:00" or "08:00"
  close: string; // e.g. "20:00" or "12:00"
  slotDurationMinutes: number; // e.g. 30, 60
  maxSimultaneousVehicles: number; // e.g. 2 lifts
  enabled: boolean;
}

export type WeekPatternType = 'tarde' | 'manana' | 'personalizado' | 'completo';

export interface WeeklyScheduleConfig {
  id: string;
  workshopId: string;
  weekStartDate: string; // ISO date string for the Monday of the week, e.g. "2026-09-14"
  weekName: string; // e.g. "Semana Tarde (14:00 - 20:00)" or "Semana Mañana (08:00 - 12:00)"
  pattern: WeekPatternType;
  defaultDailyRange: DailyTimeRange;
  days: {
    lunes: DailyTimeRange;
    martes: DailyTimeRange;
    miercoles: DailyTimeRange;
    jueves: DailyTimeRange;
    viernes: DailyTimeRange;
    sabado: DailyTimeRange;
    domingo: DailyTimeRange;
  };
  googleCalendarConnected: boolean;
  googleCalendarId?: string;
  autoSyncGoogleCalendar: boolean;
  updatedAt: string;
}

export interface AppointmentSlot {
  id: string;
  workshopId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm (e.g. "14:00")
  endTime: string; // HH:mm (e.g. "15:00")
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  licensePlate?: string;
  serviceId?: string;
  serviceName?: string;
  notes?: string;
  status: 'disponible' | 'reservado' | 'en_taller' | 'cancelado';
  googleEventId?: string;
  googleCalendarLink?: string;
  createdAt: string;
}

export interface GoogleCalendarSyncStatus {
  connected: boolean;
  calendarName: string;
  calendarId: string;
  lastSyncTimestamp: string | null;
  syncedEventsCount: number;
  pendingSyncCount: number;
  accountEmail: string;
}

