import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Calendar,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileSearch,
  Filter,
  Flame,
  MessageSquare,
  Phone,
  PlusCircle,
  Search,
  Wrench,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { storageRepository } from '../services/storageRepository';
import { Client, OrderStatus, Reminder, ServiceOrder, Vehicle } from '../types';

interface DashboardViewProps {
  onSelectVehicleHistory: (vehicleId: string) => void;
  onEditOrder: (order: ServiceOrder) => void;
  onGoToReception: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectVehicleHistory,
  onEditOrder,
  onGoToReception,
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newReminderTitle, setNewReminderTitle] = useState('');
  const [newReminderPlate, setNewReminderPlate] = useState('');
  const [newReminderDate, setNewReminderDate] = useState('');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [, setRefreshState] = useState(0);

  const dashboardData = storageRepository.getDashboardData();
  const { metrics, recentOrders, reminders } = dashboardData;
  const workshop = storageRepository.getCurrentWorkshop();
  const currentUser = storageRepository.getCurrentUser();

  // Filtered recent orders
  const filteredRecentOrders = recentOrders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (quickSearch.trim()) {
      const q = quickSearch.toUpperCase();
      return (
        o.licensePlate.includes(q) ||
        o.orderNumber.includes(q) ||
        o.visitReason.toUpperCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: OrderStatus) => {
    const map: Record<OrderStatus, { text: string; cls: string; dot: string }> = {
      recibido: {
        text: 'Recibido',
        cls: 'bg-[#18C7D9]/15 text-[#18C7D9] border-[#18C7D9]/40',
        dot: 'bg-[#18C7D9]',
      },
      inspección: {
        text: 'Inspección',
        cls: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/40',
        dot: 'bg-[#F5A623]',
      },
      presupuesto: {
        text: 'Presupuesto',
        cls: 'bg-white/10 text-[#9AA8B6] border-white/15',
        dot: 'bg-[#9AA8B6]',
      },
      aprobado: {
        text: 'Aprobado',
        cls: 'bg-[#00CCF2]/15 text-[#00CCF2] border-[#00CCF2]/40',
        dot: 'bg-[#00CCF2]',
      },
      'en trabajo': {
        text: 'En Trabajo',
        cls: 'bg-[#F27D16]/20 text-[#F27D16] border-[#F27D16]',
        dot: 'bg-[#F27D16] animate-pulse',
      },
      listo: {
        text: 'Listo Entrega',
        cls: 'bg-[#00CCF2]/20 text-[#00CCF2] border-[#00CCF2]/60',
        dot: 'bg-[#00CCF2]',
      },
      cerrado: {
        text: 'Cerrado',
        cls: 'bg-[#1A1C20] text-[#9AA8B6] border-white/10',
        dot: 'bg-[#9AA8B6]',
      },
    };
    const s = map[status] || {
      text: status,
      cls: 'bg-gray-800 text-gray-300 border-gray-700',
      dot: 'bg-gray-400',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${s.cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        <span>{s.text}</span>
      </span>
    );
  };

  const handleToggleReminder = (id: string) => {
    storageRepository.toggleReminder(id);
    setRefreshState((prev) => prev + 1);
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReminderTitle || !newReminderPlate || !newReminderDate) return;

    const vResult = storageRepository.searchVehicleByPlate(newReminderPlate);

    storageRepository.createReminder({
      vehicleId: vResult ? vResult.vehicle.id : `veh-${Date.now()}`,
      licensePlate: newReminderPlate.toUpperCase(),
      clientName: vResult ? vResult.client.fullName : 'Cliente General',
      clientWhatsApp: vResult ? vResult.client.phoneWhatsApp : '+34 600 000 000',
      title: newReminderTitle,
      dueDate: newReminderDate,
      completed: false,
    });

    setNewReminderTitle('');
    setNewReminderPlate('');
    setNewReminderDate('');
    setShowAddReminderModal(false);
    setRefreshState((prev) => prev + 1);
  };

  const statusPills: { id: string; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'recibido', label: 'Recibidos' },
    { id: 'inspección', label: 'Inspección' },
    { id: 'en trabajo', label: 'En Trabajo' },
    { id: 'listo', label: 'Listos' },
    { id: 'cerrado', label: 'Cerrados' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="dashboard-view">
      {/* Top Banner with Industrial Telemetry Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00CCF2]/10 border border-[#00CCF2]/30 text-xs font-mono font-bold uppercase text-[#00CCF2] mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>CENTRO DE CONTROL & OPERACIONES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
            Panel Operativo de <span className="text-[#00CCF2]">{workshop.name}</span>
          </h1>
          <p className="text-sm text-[#9AA8B6] mt-1">
            Supervisión continua de órdenes de servicio, vehículos en elevador y citas preventivas.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            id="btn-dash-new-reception"
            onClick={onGoToReception}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00CCF2] to-[#0099B8] hover:from-[#00E5FF] hover:to-[#00B4D8] text-[#0D0D0D] text-xs font-black flex items-center gap-2 shadow-[0_0_24px_rgba(0,204,242,0.35)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NUEVA ADMISIÓN (MATRÍCULA)</span>
          </button>
        </div>
      </div>

      {/* KPI METRICS (High-Contrast Framer / Porsche Style from Image 1 & 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="dashboard-kpis">
        {/* Metric 1: Recibidos Hoy */}
        <div className="relative overflow-hidden rounded-[28px] glass-panel p-6 border border-white/10 glass-panel-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9AA8B6] font-bold">
              RECIBIDOS HOY
            </span>
            <div className="p-2.5 rounded-2xl bg-[#00CCF2]/15 text-[#00CCF2] border border-[#00CCF2]/30">
              <FileSearch className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-[#F4F7F8] tracking-tight">
              {metrics.receivedToday}
            </span>
            <span className="text-xs font-medium text-[#9AA8B6]">ingresos</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#00CCF2]">
            <span className="w-2 h-2 rounded-full bg-[#00CCF2]" />
            <span>Ingresados en recepción</span>
          </div>
        </div>

        {/* Metric 2: En Trabajo (Elevadores) */}
        <div className="relative overflow-hidden rounded-[28px] glass-panel p-6 border border-[#F27D16]/40 shadow-[0_8px_25px_rgba(242,125,22,0.1)] glass-panel-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F27D16] font-bold">
              EN TRABAJO (ELEVADOR)
            </span>
            <div className="p-2.5 rounded-2xl bg-[#F27D16]/20 text-[#F27D16] border border-[#F27D16]/40">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-[#F27D16] tracking-tight">
              {metrics.inProgress}
            </span>
            <span className="text-xs font-medium text-[#9AA8B6]">operaciones</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#F27D16]">
            <span className="w-2 h-2 rounded-full bg-[#F27D16] animate-ping" />
            <span>Mecánicos interviniendo</span>
          </div>
        </div>

        {/* Metric 3: Listos para Entrega */}
        <div className="relative overflow-hidden rounded-[28px] glass-panel p-6 border border-white/10 glass-panel-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#28C98B] font-bold">
              LISTOS PARA ENTREGA
            </span>
            <div className="p-2.5 rounded-2xl bg-[#28C98B]/15 text-[#28C98B] border border-[#28C98B]/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-[#28C98B] tracking-tight">
              {metrics.ready}
            </span>
            <span className="text-xs font-medium text-[#9AA8B6]">vehículos</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#28C98B]">
            <span className="w-2 h-2 rounded-full bg-[#28C98B]" />
            <span>Control de calidad superado</span>
          </div>
        </div>

        {/* Metric 4: Avisos Pendientes */}
        <div className="relative overflow-hidden rounded-[28px] glass-panel p-6 border border-white/10 glass-panel-hover group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#F5A623] font-bold">
              RECORDATORIOS ACTIVOS
            </span>
            <div className="p-2.5 rounded-2xl bg-[#F5A623]/15 text-[#F5A623] border border-[#F5A623]/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono text-[#F5A623] tracking-tight">
              {metrics.pendingMaintenance}
            </span>
            <span className="text-xs font-medium text-[#9AA8B6]">alertas</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-[#F5A623]">
            <span className="w-2 h-2 rounded-full bg-[#F5A623]" />
            <span>Mantenimiento preventivo</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: RECENT ORDERS (70%) + REMINDERS (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Orders Management Table */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-[32px] glass-panel border border-white/10 p-6 sm:p-8 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#F4F7F8]">
                  Órdenes Recientes del Taller
                </h2>
                <p className="text-xs text-[#9AA8B6]">
                  Control de estado, odómetro y técnico responsable.
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative max-w-xs w-full">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA8B6]" />
                <input
                  id="dashboard-search-orders"
                  type="text"
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  placeholder="Buscar matrícula o folio..."
                  className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#00CCF2] rounded-xl pl-10 pr-3 py-2 text-xs text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none"
                />
              </div>
            </div>

            {/* Segmented Status Pill Filter (Webflow / Framer style) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {statusPills.map((pill) => {
                const isActive = statusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    id={`filter-pill-${pill.id}`}
                    onClick={() => setStatusFilter(pill.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00CCF2] to-[#0099B8] text-[#0D0D0D] font-bold shadow-[0_0_15px_rgba(0,204,242,0.3)]'
                        : 'glass-pill text-[#9AA8B6] hover:text-[#F4F7F8]'
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Orders List */}
            {filteredRecentOrders.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-[#0D0D0D]/60 border border-white/5 space-y-2">
                <Car className="w-8 h-8 text-[#9AA8B6]/40 mx-auto" />
                <p className="text-sm text-[#9AA8B6]">
                  No se encontraron órdenes con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecentOrders.map((order) => (
                  <div
                    key={order.id}
                    id={`dashboard-order-row-${order.id}`}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0D0D0D]/60 hover:bg-[#131416] border border-white/10 hover:border-[#00CCF2]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Metallic Plate Badge */}
                      <div className="px-3.5 py-2 rounded-xl bg-[#131416] border border-[#00CCF2]/40 text-[#F4F7F8] font-mono font-bold text-sm tracking-wider shrink-0 shadow-sm">
                        {order.licensePlate}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-semibold text-[#00CCF2]">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-[11px] text-[#9AA8B6]">
                            {new Date(order.entryDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#F4F7F8] font-medium line-clamp-1">
                          {order.visitReason}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#9AA8B6]">
                          <span>
                            Odómetro: <strong>{order.entryMileage.toLocaleString()} km</strong>
                          </span>
                          <span>•</span>
                          <span>
                            Mecánico:{' '}
                            <strong className="text-[#F4F7F8]">
                              {order.assignedTechnicianName || 'Por asignar'}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Row Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => onSelectVehicleHistory(order.vehicleId)}
                        className="px-3 py-1.5 rounded-xl glass-pill hover:bg-white/10 text-xs text-[#F4F7F8] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Ver historial completo del automóvil"
                      >
                        <span>Historial</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#00CCF2]" />
                      </button>

                      <button
                        onClick={() => onEditOrder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#0099B8] hover:from-[#00E5FF] hover:to-[#00B4D8] text-[#0D0D0D] text-xs font-bold transition-all shadow-sm cursor-pointer"
                        title="Editar o cambiar estado de la orden"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Maintenance Reminders & WhatsApp Dispatch */}
        <div className="space-y-5">
          <div className="rounded-[32px] glass-panel border border-white/10 p-6 sm:p-7 space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#F4F7F8] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F27D16]" />
                  <span>Avisos de Mantenimiento</span>
                </h2>
                <p className="text-xs text-[#9AA8B6]">WhatsApp automático para clientes</p>
              </div>

              <button
                id="btn-add-reminder"
                onClick={() => setShowAddReminderModal(true)}
                className="p-2 rounded-xl bg-[#00CCF2]/10 hover:bg-[#00CCF2]/20 text-[#00CCF2] border border-[#00CCF2]/30 transition-all cursor-pointer"
                title="Programar nuevo recordatorio"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Reminder List */}
            <div className="space-y-3">
              {reminders.map((rem) => {
                const isOverdue = new Date(rem.dueDate) < new Date() && !rem.completed;
                const whatsappUrl = `https://wa.me/${rem.clientWhatsApp.replace(
                  /\D/g,
                  '',
                )}?text=${encodeURIComponent(
                  `Hola ${rem.clientName}, te escribimos de V-LA Taller Mecánico para recordarte el servicio programado: "${rem.title}" para tu vehículo con matrícula ${rem.licensePlate}. ¿Deseas agendar tu cita esta semana?`,
                )}`;

                return (
                  <div
                    key={rem.id}
                    id={`reminder-item-${rem.id}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      rem.completed
                        ? 'bg-[#0D0D0D]/40 border-white/5 opacity-50'
                        : isOverdue
                        ? 'bg-[#F21616]/10 border-[#F21616]/30'
                        : 'bg-[#0D0D0D]/80 border-white/10 hover:border-[#00CCF2]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#00CCF2]">
                            {rem.licensePlate}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F21616]/20 text-[#F21616] font-bold">
                              Vencido
                            </span>
                          )}
                          {rem.completed && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00CCF2]/20 text-[#00CCF2] font-bold">
                              Completado
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-[#F4F7F8]">{rem.title}</p>
                        <p className="text-[11px] text-[#9AA8B6]">
                          Cliente: {rem.clientName} · Fecha: {rem.dueDate}
                        </p>
                      </div>

                      {/* Checkbox toggle */}
                      <button
                        onClick={() => handleToggleReminder(rem.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          rem.completed
                            ? 'bg-[#00CCF2] text-[#0D0D0D] border-[#00CCF2]'
                            : 'border-white/20 hover:border-[#00CCF2]'
                        }`}
                        title={rem.completed ? 'Marcar pendiente' : 'Marcar completado'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>

                    {!rem.completed && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-[#9AA8B6]">Aviso directo</span>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00CCF2]/15 hover:bg-[#00CCF2]/25 text-[#00CCF2] border border-[#00CCF2]/30 text-[11px] font-bold transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Enviar WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md rounded-[28px] glass-panel border border-white/20 p-6 space-y-5 shadow-2xl">
            <h3 className="text-lg font-black text-[#F4F7F8]">
              Programar Recordatorio Preventivo
            </h3>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F4F7F8] mb-1">
                  Matrícula del Vehículo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. VLA-4821"
                  value={newReminderPlate}
                  onChange={(e) => setNewReminderPlate(e.target.value.toUpperCase())}
                  className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-[#00CCF2] outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F7F8] mb-1">
                  Concepto del Mantenimiento
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cambio de pastillas traseras"
                  value={newReminderTitle}
                  onChange={(e) => setNewReminderTitle(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-2.5 text-xs text-[#F4F7F8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F7F8] mb-1">
                  Fecha Estimada
                </label>
                <input
                  type="date"
                  required
                  value={newReminderDate}
                  onChange={(e) => setNewReminderDate(e.target.value)}
                  className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-2.5 text-xs text-[#F4F7F8] outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddReminderModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#9AA8B6] hover:text-[#F4F7F8]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00CCF2] to-[#0099B8] hover:from-[#00E5FF] hover:to-[#00B4D8] text-[#0D0D0D] text-xs font-black"
                >
                  Guardar Aviso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
