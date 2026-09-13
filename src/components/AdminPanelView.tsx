import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Wrench,
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Download,
  CalendarDays,
  Settings,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import {
  AppointmentSlot,
  DailyTimeRange,
  ServiceCategory,
  UserProfile,
  WeeklyScheduleConfig,
  WorkshopService,
} from '../types';
import { storageRepository } from '../services/storageRepository';

interface AdminPanelViewProps {
  currentUser: UserProfile;
  onSwitchRole: (role: 'admin' | 'advisor' | 'technician') => void;
  onNavigateToReception?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  onSwitchRole,
  onNavigateToReception,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'schedules' | 'gcalendar'>('services');
  const currentWorkshop = storageRepository.getCurrentWorkshop();

  // Services Catalog State
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);

  // New Service Form State
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('mantenimiento');
  const [newDescription, setNewDescription] = useState('');
  const [newDuration, setNewDuration] = useState<number>(60);
  const [newPrice, setNewPrice] = useState<number>(95);
  const [newIntervalKm, setNewIntervalKm] = useState<number>(10000);
  const [newRequiresElevator, setNewRequiresElevator] = useState<boolean>(true);

  // Weekly Schedule State
  const [scheduleConfig, setScheduleConfig] = useState<WeeklyScheduleConfig>(
    storageRepository.getWeeklySchedule(),
  );
  const [selectedSimDate, setSelectedSimDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [simulatedSlots, setSimulatedSlots] = useState<AppointmentSlot[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [targetSlot, setTargetSlot] = useState<AppointmentSlot | null>(null);
  const [bookPlate, setBookPlate] = useState('VLA-4821');
  const [bookClientName, setBookClientName] = useState('Alejandro Morales Silva');
  const [bookClientPhone, setBookClientPhone] = useState('+34 622 458 910');
  const [bookServiceId, setBookServiceId] = useState('');
  const [bookNotes, setBookNotes] = useState('');

  // Google Calendar State
  const [gcalStatus, setGcalStatus] = useState(storageRepository.getGoogleCalendarStatus());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Load Initial Data
  const reloadData = () => {
    setServices(storageRepository.getWorkshopServices());
    const sched = storageRepository.getWeeklySchedule();
    setScheduleConfig(sched);
    setGcalStatus(storageRepository.getGoogleCalendarStatus());
    setSimulatedSlots(storageRepository.generateAvailableSlots(selectedSimDate));
  };

  useEffect(() => {
    reloadData();
  }, [selectedSimDate]);

  const isAdmin = currentUser.role === 'admin';

  // Handle New Service Submission (Only Admin Allowed)
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Permiso denegado: Solo el Administrador puede cargar servicios.');
      return;
    }
    if (!newName.trim()) {
      showToast('Por favor introduce el nombre del servicio.');
      return;
    }

    try {
      const generatedCode =
        newCode.trim() ||
        `SRV-${newCategory.slice(0, 4).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

      storageRepository.createWorkshopService({
        code: generatedCode,
        name: newName.trim(),
        category: newCategory,
        description: newDescription.trim() || 'Servicio estándar con verificación técnica de calidad.',
        estimatedDurationMinutes: Number(newDuration) || 60,
        basePrice: Number(newPrice) || 0,
        recommendedMileageInterval: newIntervalKm ? Number(newIntervalKm) : undefined,
        requiresElevator: newRequiresElevator,
        active: true,
      });

      showToast(`Servicio "${newName}" creado y añadido al catálogo oficial.`);
      setShowNewServiceModal(false);
      // Reset form
      setNewCode('');
      setNewName('');
      setNewDescription('');
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Error al crear servicio.');
    }
  };

  // Handle Service Deletion
  const handleDeleteService = (id: string, name: string) => {
    if (!isAdmin) {
      showToast('Solo el Administrador puede eliminar servicios.');
      return;
    }
    if (window.confirm(`¿Estás seguro de que deseas eliminar el servicio "${name}" del catálogo?`)) {
      try {
        storageRepository.deleteWorkshopService(id);
        showToast(`Servicio "${name}" eliminado.`);
        reloadData();
      } catch (err: any) {
        showToast(err.message || 'Error al eliminar');
      }
    }
  };

  // Handle Service Toggle Active
  const handleToggleServiceActive = (service: WorkshopService) => {
    if (!isAdmin) {
      showToast('Solo el Administrador puede modificar servicios.');
      return;
    }
    try {
      storageRepository.updateWorkshopService(service.id, {
        active: !service.active,
      });
      showToast(`Servicio ${service.active ? 'desactivado' : 'activado'} en catálogo.`);
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Error al modificar');
    }
  };

  // Handle Schedule Preset Quick Apply
  const handleApplyPreset = (preset: 'tarde' | 'manana' | 'completo') => {
    if (!isAdmin) {
      showToast('Solo el Administrador puede modificar los horarios.');
      return;
    }
    try {
      storageRepository.applySchedulePreset(preset);
      showToast(
        preset === 'tarde'
          ? 'Aplicado horario de Turno Tarde (14:00 a 20:00) para Lunes a Viernes'
          : preset === 'manana'
          ? 'Aplicado horario de Turno Mañana (08:00 a 12:00) para Lunes a Sábado'
          : 'Aplicado horario de Jornada Completa',
      );
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Error al aplicar preset.');
    }
  };

  // Handle Single Day Range Change
  const handleDayRangeChange = (
    dayKey: keyof WeeklyScheduleConfig['days'],
    field: keyof DailyTimeRange,
    value: any,
  ) => {
    if (!isAdmin) return;
    const currentDay = scheduleConfig.days[dayKey];
    const updatedDay = {
      ...currentDay,
      [field]: value,
    };

    const updatedConfig: WeeklyScheduleConfig = {
      ...scheduleConfig,
      days: {
        ...scheduleConfig.days,
        [dayKey]: updatedDay,
      },
    };

    setScheduleConfig(updatedConfig);
  };

  const handleSaveScheduleConfig = () => {
    if (!isAdmin) {
      showToast('Solo el Administrador puede guardar la configuración de horarios.');
      return;
    }
    try {
      storageRepository.updateWeeklySchedule(scheduleConfig);
      showToast('Configuración semanal de turnos guardada exitosamente.');
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar horarios.');
    }
  };

  // Handle Booking Appointment Test
  const handleBookSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSlot) return;

    try {
      const selectedService = services.find((s) => s.id === bookServiceId) || services[0];
      const booked = storageRepository.bookAppointment({
        date: targetSlot.date,
        startTime: targetSlot.startTime,
        endTime: targetSlot.endTime,
        licensePlate: bookPlate.toUpperCase().trim(),
        clientName: bookClientName.trim(),
        clientPhone: bookClientPhone.trim(),
        serviceId: selectedService?.id,
        serviceName: selectedService?.name || 'Revisión General',
        notes: bookNotes.trim() || 'Cita agendada desde Panel Admin',
        status: 'reservado',
      });

      showToast(`Turno agendado para ${booked.licensePlate} a las ${booked.startTime} h.`);
      setShowBookingModal(false);
      setTargetSlot(null);
      reloadData();
    } catch (err: any) {
      showToast(err.message || 'Error al reservar turno');
    }
  };

  // Handle Google Calendar Direct Link
  const handleOpenGoogleCalendar = (slot: AppointmentSlot) => {
    const url = storageRepository.generateGoogleCalendarUrl(slot);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle ICS Download
  const handleDownloadICS = (slot: AppointmentSlot) => {
    const icsContent = storageRepository.generateICSDownload(slot);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `turno-${slot.licensePlate || 'cita'}-${slot.date}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Fichero .ics descargado para importar a Google Calendar o Apple Calendar.');
  };

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 px-5 py-3 rounded-2xl glass-panel border border-[#00CCF2]/40 text-xs font-semibold text-[#F4F7F8] shadow-[0_12px_36px_rgba(0,0,0,0.7)] flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#00CCF2] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Access Gate: Role Check Notice */}
      {!isAdmin && (
        <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-[#F21616]/20 via-[#1A1C20] to-[#0D0D0D] border border-[#F21616]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_10px_30px_rgba(242,22,22,0.15)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F21616]/20 border border-[#F21616]/40 flex items-center justify-center text-[#F21616]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F4F7F8] flex items-center gap-2">
                Acceso Exclusivo de Administrador
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F21616]/20 text-[#F21616] border border-[#F21616]/30">
                  Solo Lectura (Rol: {currentUser.role.toUpperCase()})
                </span>
              </h4>
              <p className="text-xs text-[#9AA8B6] mt-0.5">
                Solo el rol <strong>Admin</strong> puede cargar nuevos servicios al catálogo y configurar la disponibilidad semanal de turnos del taller.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSwitchRole('admin')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Conmutar a Administrador (Carlos V.)
          </button>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00CCF2]/20 to-[#F27D16]/20 border border-[#00CCF2]/30 flex items-center justify-center text-[#00CCF2]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F4F7F8]">
              Panel de Control <span className="text-[#00CCF2]">Administrador</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#9AA8B6] mt-1">
            Gestión centralizada del catálogo de servicios oficiales, agenda de turnos y sincronización con Google Calendar.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#131416] border border-white/[0.08] self-start md:self-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] shadow-md'
                : 'text-[#9AA8B6] hover:text-[#F4F7F8] hover:bg-white/[0.04]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Catálogo de Servicios</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/30 font-mono">
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedules'
                ? 'bg-gradient-to-r from-[#F27D16] to-[#F25116] text-[#0D0D0D] shadow-md'
                : 'text-[#9AA8B6] hover:text-[#F4F7F8] hover:bg-white/[0.04]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Turnos & Disponibilidad</span>
          </button>

          <button
            onClick={() => setActiveTab('gcalendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gcalendar'
                ? 'bg-gradient-to-r from-[#00CCF2] via-[#F27D16] to-[#F21616] text-[#0D0D0D] shadow-md font-extrabold'
                : 'text-[#9AA8B6] hover:text-[#F4F7F8] hover:bg-white/[0.04]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Google Calendar</span>
            <span className="w-2 h-2 rounded-full bg-[#00CCF2] animate-pulse" />
          </button>
        </div>
      </div>

      {/* ================= TAB 1: CATALOGO DE SERVICIOS (SOLO ADMIN) ================= */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          {/* Action and Search Bar */}
          <div className="glass-panel p-5 rounded-3xl border border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <input
                type="text"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                placeholder="Buscar por código, nombre o descripción..."
                className="w-full sm:w-80 px-4 py-2 rounded-xl bg-[#1A1C20] border border-white/[0.08] text-xs text-[#F4F7F8] focus:border-[#00CCF2] outline-none"
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Filtrar por categoría de servicio"
                className="px-3.5 py-2 rounded-xl bg-[#1A1C20] border border-white/[0.08] text-xs text-[#9AA8B6] focus:border-[#00CCF2] outline-none"
              >
                <option value="all">Todas las categorías</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="frenos">Frenos</option>
                <option value="motor">Motor</option>
                <option value="suspension">Suspensión</option>
                <option value="electronica">Electrónica</option>
                <option value="climatizacion">Climatización</option>
                <option value="itv">Pre-ITV</option>
              </select>
            </div>

            <button
              onClick={() => {
                if (!isAdmin) {
                  showToast('Acceso restringido: Solo el Administrador puede dar de alta nuevos servicios.');
                  return;
                }
                setShowNewServiceModal(true);
              }}
              className={`w-full md:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                isAdmin
                  ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] hover:brightness-110 active:scale-95'
                  : 'bg-white/10 text-[#9AA8B6] cursor-not-allowed'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Cargar Nuevo Servicio (Solo Admin)</span>
            </button>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`glass-panel p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                  service.active
                    ? 'border-white/[0.08] hover:border-[#00CCF2]/40'
                    : 'border-white/[0.04] opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#00CCF2] border border-[#00CCF2]/20">
                      {service.code}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        service.category === 'mantenimiento'
                          ? 'bg-[#00CCF2]/15 text-[#00CCF2]'
                          : service.category === 'frenos'
                          ? 'bg-[#F21616]/15 text-[#F21616]'
                          : service.category === 'climatizacion'
                          ? 'bg-[#18C7D9]/15 text-[#18C7D9]'
                          : 'bg-[#F27D16]/15 text-[#F27D16]'
                      }`}
                    >
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#F4F7F8] mb-1.5 leading-snug">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#9AA8B6] leading-relaxed line-clamp-3 mb-4">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#9AA8B6]">
                      <Clock className="w-3.5 h-3.5 text-[#00CCF2]" />
                      <span>{service.estimatedDurationMinutes} min</span>
                    </div>
                    {service.recommendedMileageInterval && (
                      <span className="text-[11px] text-[#9AA8B6] font-mono">
                        Cada {service.recommendedMileageInterval.toLocaleString()} km
                      </span>
                    )}
                    <span className="text-base font-extrabold text-[#F4F7F8]">
                      {service.basePrice} €
                    </span>
                  </div>

                  {/* Actions (Admin Controls) */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleToggleServiceActive(service)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-lg border transition-colors ${
                        service.active
                          ? 'bg-[#28C98B]/10 text-[#28C98B] border-[#28C98B]/30'
                          : 'bg-white/5 text-[#9AA8B6] border-white/10'
                      }`}
                    >
                      {service.active ? 'Activo en Taller' : 'Desactivado'}
                    </button>

                    <button
                      onClick={() => handleDeleteService(service.id, service.name)}
                      className="p-1.5 rounded-lg text-[#9AA8B6] hover:text-[#F21616] hover:bg-[#F21616]/10 transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12 glass-panel rounded-3xl border border-white/[0.08]">
              <p className="text-sm text-[#9AA8B6]">
                No se encontraron servicios que coincidan con la búsqueda.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: HORARIOS Y DISPONIBILIDAD SEMANAL ================= */}
      {activeTab === 'schedules' && (
        <div className="space-y-8">
          {/* Quick Presets Notice based on user prompt */}
          <div className="glass-panel p-6 rounded-3xl border border-[#F27D16]/30 bg-gradient-to-br from-[#16181D] via-[#131416] to-[#0D0D0D]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#F27D16]/15 text-[#F27D16] border border-[#F27D16]/30">
                  Control Operativo de Turnos
                </span>
                <h2 className="text-lg font-bold text-[#F4F7F8] mt-2">
                  Preconfiguración Rápida de Semanas
                </h2>
                <p className="text-xs text-[#9AA8B6] mt-1 max-w-2xl leading-relaxed">
                  Configura con un clic los turnos alternos solicitados (semanas de <strong>14:00 a 20:00</strong> o semanas de <strong>08:00 a 12:00</strong>). Los clientes y asesores solo podrán agendar dentro de estos rangos válidos.
                </p>
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleApplyPreset('tarde')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    scheduleConfig.pattern === 'tarde'
                      ? 'bg-[#F27D16] text-[#0D0D0D] border-[#F27D16] shadow-lg shadow-[#F27D16]/20'
                      : 'bg-[#1A1C20] text-[#F4F7F8] border-white/10 hover:border-[#F27D16]/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turno Tarde (14:00 - 20:00)</span>
                </button>

                <button
                  onClick={() => handleApplyPreset('manana')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    scheduleConfig.pattern === 'manana'
                      ? 'bg-[#00CCF2] text-[#0D0D0D] border-[#00CCF2] shadow-lg shadow-[#00CCF2]/20'
                      : 'bg-[#1A1C20] text-[#F4F7F8] border-white/10 hover:border-[#00CCF2]/40'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Turno Mañana (08:00 - 12:00)</span>
                </button>

                <button
                  onClick={() => handleApplyPreset('completo')}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 border transition-all ${
                    scheduleConfig.pattern === 'completo'
                      ? 'bg-white text-[#0D0D0D] border-white'
                      : 'bg-[#1A1C20] text-[#9AA8B6] border-white/10 hover:text-white'
                  }`}
                >
                  <span>Jornada Completa</span>
                </button>
              </div>
            </div>
          </div>

          {/* Days Configuration Table / Grid */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-[#F4F7F8] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#00CCF2]" />
                Horarios Específicos por Día de la Semana
              </h3>
              <button
                onClick={handleSaveScheduleConfig}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
              >
                Guardar Horario Semanal
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                [
                  ['lunes', 'Lunes'],
                  ['martes', 'Martes'],
                  ['miercoles', 'Miércoles'],
                  ['jueves', 'Jueves'],
                  ['viernes', 'Viernes'],
                  ['sabado', 'Sábado'],
                  ['domingo', 'Domingo'],
                ] as [keyof WeeklyScheduleConfig['days'], string][]
              ).map(([dayKey, dayLabel]) => {
                const day = scheduleConfig.days[dayKey];
                return (
                  <div
                    key={dayKey}
                    className={`p-4 rounded-2xl border transition-all ${
                      day.enabled
                        ? 'bg-[#16181D] border-white/10'
                        : 'bg-[#111215] border-white/[0.04] opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-[#F4F7F8]">{dayLabel}</span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={day.enabled}
                          onChange={(e) =>
                            handleDayRangeChange(dayKey, 'enabled', e.target.checked)
                          }
                          className="rounded bg-[#1A1C20] border-white/20 text-[#00CCF2] focus:ring-0"
                        />
                        <span className="text-[10px] text-[#9AA8B6]">
                          {day.enabled ? 'Abierto' : 'Cerrado'}
                        </span>
                      </label>
                    </div>

                    {day.enabled ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <span className="text-[10px] text-[#9AA8B6] block mb-1">Apertura</span>
                            <input
                              type="time"
                              value={day.open}
                              onChange={(e) =>
                                handleDayRangeChange(dayKey, 'open', e.target.value)
                              }
                              className="w-full px-2 py-1 rounded-lg bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] text-[#9AA8B6] block mb-1">Cierre</span>
                            <input
                              type="time"
                              value={day.close}
                              onChange={(e) =>
                                handleDayRangeChange(dayKey, 'close', e.target.value)
                              }
                              className="w-full px-2 py-1 rounded-lg bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#9AA8B6] pt-1">
                          <span>Duración turno:</span>
                          <select
                            value={day.slotDurationMinutes}
                            onChange={(e) =>
                              handleDayRangeChange(dayKey, 'slotDurationMinutes', Number(e.target.value))
                            }
                            aria-label={`Duración de turno para ${dayLabel}`}
                            className="bg-[#1A1C20] border border-white/10 rounded px-1.5 py-0.5 text-[#00CCF2] font-mono"
                          >
                            <option value={30}>30 min</option>
                            <option value={45}>45 min</option>
                            <option value={60}>60 min</option>
                            <option value={90}>90 min</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 flex items-center justify-center text-xs text-[#9AA8B6] italic">
                        Taller cerrado
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Turnos Simulator / Inspection */}
          <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-[#F4F7F8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F27D16]" />
                  Simulador de Agenda de Turnos en Vivo
                </h3>
                <p className="text-xs text-[#9AA8B6] mt-0.5">
                  Verifica los turnos disponibles generados según la disponibilidad establecida.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[#9AA8B6]">Fecha a inspeccionar:</span>
                <input
                  type="date"
                  value={selectedSimDate}
                  onChange={(e) => setSelectedSimDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                />
              </div>
            </div>

            {/* Slots Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {simulatedSlots.map((slot) => {
                const isBooked = slot.status === 'reservado';
                return (
                  <div
                    key={slot.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isBooked
                        ? 'bg-[#1F1715] border-[#F25116]/40'
                        : 'bg-[#15191C] border-white/10 hover:border-[#00CCF2]/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono font-extrabold text-[#F4F7F8]">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isBooked
                              ? 'bg-[#F25116]/20 text-[#F25116] border border-[#F25116]/30'
                              : 'bg-[#00CCF2]/20 text-[#00CCF2] border border-[#00CCF2]/30'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </div>

                      {isBooked ? (
                        <div className="space-y-1 text-xs">
                          <p className="font-bold text-[#F4F7F8] truncate">
                            {slot.licensePlate} · {slot.clientName}
                          </p>
                          <p className="text-[11px] text-[#9AA8B6] truncate">{slot.serviceName}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#9AA8B6] italic">
                          Puesto y elevador libre para asignación.
                        </p>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                      {isBooked ? (
                        <div className="flex items-center gap-2 w-full justify-between">
                          <button
                            onClick={() => handleOpenGoogleCalendar(slot)}
                            className="text-[10px] text-[#00CCF2] hover:underline flex items-center gap-1 font-semibold"
                          >
                            <Calendar className="w-3 h-3" />
                            GCalendar
                          </button>
                          <button
                            onClick={() => handleDownloadICS(slot)}
                            className="text-[10px] text-[#9AA8B6] hover:text-[#F4F7F8] flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            .ics
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setTargetSlot(slot);
                            setShowBookingModal(true);
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#00CCF2]/15 text-[#00CCF2] border border-[#00CCF2]/30 text-xs font-bold hover:bg-[#00CCF2] hover:text-[#0D0D0D] transition-all"
                        >
                          Agendar en este slot
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {simulatedSlots.length === 0 && (
              <div className="py-8 text-center text-xs text-[#9AA8B6]">
                El taller no tiene horario habilitado para esta fecha según la configuración semanal.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: GOOGLE CALENDAR EVALUATION & ARCHITECTURE ================= */}
      {activeTab === 'gcalendar' && (
        <div className="space-y-8">
          {/* Executive Evaluation Summary Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#00CCF2]/30 bg-gradient-to-br from-[#12161A] via-[#101214] to-[#0D0D0D]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#00CCF2]/20 text-[#00CCF2] border border-[#00CCF2]/30">
                  EVALUACIÓN DE FACTIBILIDAD TÉCNICA
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#F4F7F8] mt-2.5">
                  Conexión Bidireccional con Google Calendar
                </h2>
                <p className="text-xs sm:text-sm text-[#9AA8B6] mt-1.5 max-w-3xl leading-relaxed">
                  Integración entre los horarios definidos por el administrador (turnos de 14:00 a 20:00 o de 08:00 a 12:00) y el calendario de Google Workspace de <strong>V-LA Taller Mecánico</strong>.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-4 rounded-2xl bg-[#1A1C20] border border-white/10 flex items-center gap-4 self-start md:self-auto">
                <div className="w-3 h-3 rounded-full bg-[#00CCF2] animate-ping" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#9AA8B6] block">
                    Estado del Conector
                  </span>
                  <strong className="text-xs text-[#F4F7F8]">
                    {gcalStatus.connected ? 'Sincronización Lista' : 'Desconectado'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Architecture Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-[#16181D] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#00CCF2]/20 text-[#00CCF2] flex items-center justify-center mb-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#F4F7F8] mb-1">
                  1. Sincronización Automática
                </h4>
                <p className="text-xs text-[#9AA8B6] leading-relaxed">
                  Cada vez que un asesor o el admin agenda un turno, el evento se programa directamente en la cuenta oficial del taller con la matrícula en el título para visibilidad instantánea.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#16181D] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#F27D16]/20 text-[#F27D16] flex items-center justify-center mb-3">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#F4F7F8] mb-1">
                  2. Invitación & Recordatorio al Cliente
                </h4>
                <p className="text-xs text-[#9AA8B6] leading-relaxed">
                  Google Calendar envía una notificación al email y smartphone del cliente con recordatorios automáticos 24h y 2h antes, reduciendo ausencias injustificadas a cero.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#16181D] border border-white/[0.06]">
                <div className="w-8 h-8 rounded-xl bg-[#F21616]/20 text-[#F21616] flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#F4F7F8] mb-1">
                  3. Bloqueo de Disponibilidad
                </h4>
                <p className="text-xs text-[#9AA8B6] leading-relaxed">
                  Si el taller cambia de semana (de 14 a 20 a 8 a 12), los slots libres se actualizan automáticamente y no permiten citas fuera del horario del taller.
                </p>
              </div>
            </div>
          </div>

          {/* Operational Test Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Calendar Settings */}
            <div className="glass-panel p-6 rounded-3xl border border-white/[0.08]">
              <h3 className="text-base font-bold text-[#F4F7F8] mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#00CCF2]" />
                Parámetros de Calendario Google
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[#9AA8B6] block mb-1">Calendario de Destino:</span>
                  <input
                    type="text"
                    readOnly
                    value={gcalStatus.calendarName}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-[#F4F7F8] font-medium"
                  />
                </div>

                <div>
                  <span className="text-[#9AA8B6] block mb-1">Email de la Cuenta:</span>
                  <input
                    type="text"
                    readOnly
                    value={gcalStatus.accountEmail}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-[#F4F7F8] font-mono"
                  />
                </div>

                <div>
                  <span className="text-[#9AA8B6] block mb-1">Ubicación de Cita (Google Maps):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentWorkshop.googleMapsUrl || 'Enlace verificado'}
                      className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-[#00CCF2] font-mono text-[11px] truncate"
                    />
                    {currentWorkshop.googleMapsUrl && (
                      <a
                        href={currentWorkshop.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-[#00CCF2]/15 text-[#00CCF2] border border-[#00CCF2]/30 hover:bg-[#00CCF2]/25 shrink-0 transition-all"
                        title="Abrir mapa del taller"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[#9AA8B6]">
                  <span>Eventos sincronizados:</span>
                  <span className="font-mono font-bold text-[#00CCF2]">
                    {gcalStatus.syncedEventsCount} citas
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Export & Test Intent */}
            <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#F4F7F8] mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#F27D16]" />
                  Descarga y Exportación Universal
                </h3>
                <p className="text-xs text-[#9AA8B6] leading-relaxed">
                  Además de la API, el sistema genera de forma nativa ficheros de calendario <strong>.ics</strong> compatibles con Google Calendar, Apple Calendar en iPhone/Mac y Microsoft Outlook.
                </p>
              </div>

              <div className="pt-4 space-y-2.5">
                <button
                  onClick={() => {
                    const sampleSlot = storageRepository.getAppointments()[0] || simulatedSlots[0];
                    if (sampleSlot) {
                      handleDownloadICS(sampleSlot);
                    } else {
                      showToast('No hay turnos disponibles para generar archivo muestra.');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#1A1C20] hover:bg-[#22252B] border border-white/10 text-xs font-bold text-[#F4F7F8] flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-[#00CCF2]" />
                  Descargar Cita Muestra (.ics)
                </button>

                <button
                  onClick={() => {
                    const sampleSlot = storageRepository.getAppointments()[0] || simulatedSlots[0];
                    if (sampleSlot) {
                      handleOpenGoogleCalendar(sampleSlot);
                    } else {
                      showToast('No hay citas registradas.');
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Abrir Web Intent Oficial de Google Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: CARGAR NUEVO SERVICIO (SOLO ADMIN) ================= */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00CCF2]/20 text-[#00CCF2] flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F4F7F8]">
                    Cargar Nuevo Servicio al Catálogo
                  </h3>
                  <span className="text-[10px] text-[#00CCF2] font-mono">
                    Autorizado: Rol Administrador
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowNewServiceModal(false)}
                className="p-1.5 rounded-lg text-[#9AA8B6] hover:text-[#F4F7F8]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                    Código del Servicio (Opcional)
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ej. SRV-MANT-08"
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                    Categoría
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none focus:border-[#00CCF2]"
                  >
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="frenos">Frenos</option>
                    <option value="motor">Motor</option>
                    <option value="suspension">Suspensión</option>
                    <option value="electronica">Electrónica</option>
                    <option value="climatizacion">Climatización</option>
                    <option value="itv">Pre-ITV</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                  Nombre Oficial del Servicio *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Cambio de Kit de Distribución y Bomba de Agua"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none focus:border-[#00CCF2]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                  Descripción Operativa del Trabajo
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Especifica los pasos técnicos requeridos, chequeos y componentes..."
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none focus:border-[#00CCF2]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                    Precio Base (€)
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#9AA8B6] font-semibold block mb-1">
                    Intervalo Recomendado (km)
                  </label>
                  <input
                    type="number"
                    value={newIntervalKm}
                    onChange={(e) => setNewIntervalKm(Number(e.target.value))}
                    placeholder="Ej. 60000"
                    className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="requiresElevator"
                  checked={newRequiresElevator}
                  onChange={(e) => setNewRequiresElevator(e.target.checked)}
                  className="rounded bg-[#1A1C20] border-white/20 text-[#00CCF2]"
                />
                <label htmlFor="requiresElevator" className="text-xs text-[#9AA8B6] cursor-pointer">
                  Requiere elevador hidráulico en el puesto de trabajo
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA8B6] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] font-bold text-xs shadow-lg hover:brightness-110 transition-all"
                >
                  Guardar y Activar en Catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: AGENDAR TURNO DE PRUEBA EN SLOT ================= */}
      {showBookingModal && targetSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#F4F7F8]">
                  Agendar Turno ({targetSlot.startTime} - {targetSlot.endTime})
                </h3>
                <span className="text-[10px] text-[#00CCF2] font-mono">
                  Fecha: {targetSlot.date}
                </span>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-1.5 rounded-lg text-[#9AA8B6] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSlot} className="space-y-3.5">
              <div>
                <label className="text-[11px] text-[#9AA8B6] block mb-1">
                  Matrícula del Vehículo *
                </label>
                <input
                  type="text"
                  required
                  value={bookPlate}
                  onChange={(e) => setBookPlate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs font-mono font-bold text-[#00CCF2] uppercase outline-none focus:border-[#00CCF2]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] block mb-1">Nombre del Cliente *</label>
                <input
                  type="text"
                  required
                  value={bookClientName}
                  onChange={(e) => setBookClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none focus:border-[#00CCF2]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] block mb-1">WhatsApp de Contacto</label>
                <input
                  type="text"
                  value={bookClientPhone}
                  onChange={(e) => setBookClientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] font-mono outline-none focus:border-[#00CCF2]"
                />
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] block mb-1">
                  Servicio Solicitado (del Catálogo)
                </label>
                <select
                  value={bookServiceId}
                  onChange={(e) => setBookServiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none focus:border-[#00CCF2]"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.basePrice} €)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#9AA8B6] block mb-1">Notas / Motivo</label>
                <input
                  type="text"
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="Ej. Revisar antes de viaje largo"
                  className="w-full px-3 py-2 rounded-xl bg-[#1A1C20] border border-white/10 text-xs text-[#F4F7F8] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#9AA8B6]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#087E91] text-[#0D0D0D] font-bold text-xs shadow-lg hover:brightness-110"
                >
                  Confirmar Turno & Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
