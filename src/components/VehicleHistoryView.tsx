import React, { useState } from 'react';
import {
  Calendar,
  Car,
  Clock,
  Droplet,
  Filter,
  Wrench,
  Camera,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Gauge,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  Maximize2,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Client, EvidenceImage, OrderStatus, ServiceOrder, Vehicle } from '../types';
import { storageRepository } from '../services/storageRepository';

interface VehicleHistoryViewProps {
  initialVehicleId?: string;
  onNewOrder: (vehicle: Vehicle, client: Client) => void;
}

export const VehicleHistoryView: React.FC<VehicleHistoryViewProps> = ({
  initialVehicleId,
  onNewOrder,
}) => {
  const allVehicles = storageRepository.getVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(
    initialVehicleId || (allVehicles[0]?.vehicle.id ?? ''),
  );

  // Filters state
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterOil, setFilterOil] = useState<string>('all');
  const [filterFilters, setFilterFilters] = useState<string>('all');
  const [searchWork, setSearchWork] = useState<string>('');
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<EvidenceImage | null>(null);

  const historyData = selectedVehicleId
    ? storageRepository.getVehicleHistory(selectedVehicleId)
    : null;

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  // Filter logic
  const filteredOrders = (historyData?.orders || []).filter((order) => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (filterOil !== 'all' && order.oil.done !== filterOil) return false;
    if (filterFilters !== 'all' && order.filters.done !== filterFilters) return false;
    if (searchWork.trim()) {
      const q = searchWork.toLowerCase();
      const inWork = order.mechanicalWork.description.toLowerCase().includes(q);
      const inRec = order.mechanicalWork.futureRecommendations.toLowerCase().includes(q);
      const inReason = order.visitReason.toLowerCase().includes(q);
      if (!inWork && !inRec && !inReason) return false;
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
        cls: 'bg-[#00CCF2]/20 text-[#00CCF2] border-[#00CCF2]',
        dot: 'bg-[#00CCF2] animate-pulse',
      },
      listo: {
        text: 'Listo Entrega',
        cls: 'bg-[#28C98B]/20 text-[#28C98B] border-[#28C98B]/60',
        dot: 'bg-[#28C98B]',
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

  const renderSegmentBadge = (label: string, value: 'si' | 'no' | 'no_informado') => {
    if (value === 'si') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#28C98B]/15 text-[#28C98B] border border-[#28C98B]/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>{label}: Realizado</span>
        </span>
      );
    }
    if (value === 'no') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#FF5A4F]/15 text-[#FF5A4F] border border-[#FF5A4F]/30">
          <AlertTriangle className="w-3 h-3" />
          <span>{label}: No realizado</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-[#9AA8B6] border border-white/10">
        <HelpCircle className="w-3 h-3" />
        <span>{label}: No informado</span>
      </span>
    );
  };

  if (!historyData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Car className="w-12 h-12 text-[#9AA8B6] mx-auto opacity-40" />
        <h2 className="text-xl font-bold text-[#F4F7F8]">No hay vehículo seleccionado</h2>
        <p className="text-sm text-[#9AA8B6]">
          Seleccione un vehículo registrado para consultar su historial técnico completo.
        </p>
      </div>
    );
  }

  const { vehicle, client, orders } = historyData;
  const lastOrder = orders[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="vehicle-history-view">
      {/* Top Selector Bar (Glass Pill) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-4 sm:p-5 rounded-[28px] border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <Car className="w-5 h-5 text-[#00CCF2]" />
          <span className="text-xs font-semibold text-[#9AA8B6]">Consultar automóvil:</span>
          <select
            id="select-history-vehicle"
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            className="bg-[#0D0D0D] border border-white/15 text-[#00CCF2] font-mono font-bold text-xs rounded-xl px-3.5 py-2 outline-none cursor-pointer"
          >
            {allVehicles.map(({ vehicle: v, client: c }) => (
              <option key={v.id} value={v.id}>
                {v.licensePlate} — {v.brand} {v.model} ({c.fullName})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          id="btn-history-new-order"
          onClick={() => onNewOrder(vehicle, client)}
          className="px-5 py-2.5 bg-[#00CCF2] hover:bg-[#00CCF2]/90 text-[#0D0D0D] text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,204,242,0.3)] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Orden para este Coche</span>
        </button>
      </div>

      {/* Vehicle Header Specs Card (Porsche / Tech style from Image 1 & 3) */}
      <div className="glass-panel border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-start gap-4">
            <div className="px-5 py-3.5 rounded-2xl bg-[#0D0D0D] border-2 border-[#00CCF2] shadow-[0_0_20px_rgba(0,204,242,0.25)] shrink-0">
              <span className="text-[10px] bg-[#00CCF2] text-[#0D0D0D] font-black px-2 py-0.5 rounded block text-center mb-1 font-mono">
                ES
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-black text-[#F4F7F8] tracking-widest">
                {vehicle.licensePlate}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#00CCF2]/10 text-[#00CCF2] border border-[#00CCF2]/30">
                  AÑO {vehicle.year}
                </span>
                <span className="text-xs font-mono text-[#9AA8B6]">
                  VIN: {vehicle.vin || 'NO ASIGNADO'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#F4F7F8]">
                {vehicle.brand} {vehicle.model}
              </h1>
              <p className="text-xs text-[#9AA8B6] font-medium">{vehicle.version}</p>
            </div>
          </div>

          {/* Client summary pill */}
          <div className="glass-pill p-4 rounded-2xl space-y-1.5 self-start md:self-auto">
            <span className="text-[10px] uppercase font-bold text-[#9AA8B6] tracking-wider block">
              Propietario Asociado
            </span>
            <p className="font-bold text-sm text-[#F4F7F8]">{client.fullName}</p>
            <div className="flex items-center gap-2 text-xs text-[#28C98B] font-mono">
              <Phone className="w-3.5 h-3.5" />
              <span>{client.phoneWhatsApp}</span>
            </div>
          </div>
        </div>

        {/* Quick telemetry metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
            <span className="text-[#9AA8B6] flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-[#00CCF2]" />
              Kilometraje Actual
            </span>
            <p className="font-mono font-bold text-sm text-[#F4F7F8]">
              {vehicle.currentMileage.toLocaleString()} km
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
            <span className="text-[#9AA8B6] flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#00CCF2]" />
              Total Intervenciones
            </span>
            <p className="font-mono font-bold text-sm text-[#00CCF2]">
              {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
            <span className="text-[#9AA8B6] flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#00CCF2]" />
              Última Visita
            </span>
            <p className="font-bold text-xs text-[#F4F7F8]">
              {vehicle.lastVisitDate
                ? new Date(vehicle.lastVisitDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Sin visitas'}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
            <span className="text-[#9AA8B6] flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#28C98B]" />
              Estado General
            </span>
            <p className="font-bold text-xs text-[#28C98B]">Al día / Operativo</p>
          </div>
        </div>

        {/* Highlight Banner of the Last Visit */}
        {lastOrder && (
          <div className="p-4 rounded-2xl bg-[#00CCF2]/10 border border-[#00CCF2]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-mono font-bold text-[#00CCF2] tracking-wider">
                RESUMEN DE LA ÚLTIMA VISITA ({lastOrder.orderNumber})
              </span>
              <p className="text-xs text-[#F4F7F8] font-medium">
                "{lastOrder.visitReason}" — {lastOrder.entryMileage.toLocaleString()} km
              </p>
            </div>
            {lastOrder.mechanicalWork.futureRecommendations && (
              <div className="text-xs text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 px-3 py-1.5 rounded-xl font-medium">
                Recomendación: {lastOrder.mechanicalWork.futureRecommendations}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FILTER BAR FOR TIMELINE (Framer pill style) */}
      <div className="glass-panel border border-white/10 p-5 rounded-[28px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#00CCF2]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F4F7F8]">
              Filtros del Historial
            </h3>
          </div>

          {/* Search by text inside work description */}
          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA8B6]" />
            <input
              type="text"
              placeholder="Buscar en descripción mecánica..."
              value={searchWork}
              onChange={(e) => setSearchWork(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-white/10 focus:border-[#00CCF2] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] text-[#9AA8B6] font-medium mb-1">
              Estado de la Orden:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-white/10 text-[#F4F7F8] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">Todos los estados</option>
              <option value="cerrado">Cerrados</option>
              <option value="en trabajo">En Trabajo</option>
              <option value="listo">Listo</option>
              <option value="recibido">Recibido</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#9AA8B6] font-medium mb-1">
              Filtro por Aceite:
            </label>
            <select
              value={filterOil}
              onChange={(e) => setFilterOil(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-white/10 text-[#F4F7F8] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">Cualquier estado de aceite</option>
              <option value="si">Solo con cambio de aceite (Sí)</option>
              <option value="no">Sin cambio de aceite (No)</option>
              <option value="no_informado">No informado</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[#9AA8B6] font-medium mb-1">
              Filtro por Filtros:
            </label>
            <select
              value={filterFilters}
              onChange={(e) => setFilterFilters(e.target.value)}
              className="w-full bg-[#0D0D0D] border border-white/10 text-[#F4F7F8] rounded-xl px-3 py-2 outline-none cursor-pointer"
            >
              <option value="all">Cualquier sustitución de filtros</option>
              <option value="si">Con filtros cambiados (Sí)</option>
              <option value="no">Sin filtros cambiados (No)</option>
              <option value="no_informado">No informado</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE (DESCENDING: MOST RECENT FIRST) */}
      <div className="space-y-6" id="history-timeline-container">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#F4F7F8]">
            Línea de Tiempo de Intervenciones
          </h2>
          <span className="text-xs text-[#9AA8B6] font-mono">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="glass-panel border border-white/10 rounded-[28px] p-12 text-center space-y-3">
            <Wrench className="w-10 h-10 text-[#9AA8B6]/30 mx-auto" />
            <h3 className="text-base font-bold text-[#F4F7F8]">Sin registros con estos filtros</h3>
            <p className="text-xs text-[#9AA8B6]">
              Ajuste los filtros de búsqueda para consultar las órdenes históricas.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#00CCF2] before:via-[#18C7D9] before:to-[#243340]">
            {filteredOrders.map((order, idx) => {
              const isExpanded = !!expandedOrders[order.id];
              return (
                <div key={order.id} className="relative group">
                  {/* Timeline node dot */}
                  <div className="absolute -left-6 sm:-left-8 top-5 w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-[#0D0D0D] border-2 border-[#00CCF2] flex items-center justify-center shadow-[0_0_12px_rgba(0,204,242,0.5)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00CCF2]" />
                  </div>

                  {/* Order Timeline Card */}
                  <div className="rounded-[28px] glass-panel border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#00CCF2]/40 shadow-[0_12px_36px_rgba(0,0,0,0.4)]">
                    {/* Collapsible Header */}
                    <div
                      onClick={() => toggleExpand(order.id)}
                      className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-sm font-black text-[#00CCF2]">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-[#9AA8B6] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(order.entryDate).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-[#F4F7F8]">{order.visitReason}</h4>
                        <div className="flex items-center gap-4 text-xs text-[#9AA8B6]">
                          <span>
                            Odómetro: <strong>{order.entryMileage.toLocaleString()} km</strong>
                          </span>
                          {order.exitMileage && (
                            <span>
                              Salida: <strong>{order.exitMileage.toLocaleString()} km</strong>
                            </span>
                          )}
                          <span>
                            Técnico: <strong>{order.assignedTechnicianName || 'Oficial'}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex items-center gap-2">
                          {renderSegmentBadge('Aceite', order.oil.done)}
                          {renderSegmentBadge('Filtros', order.filters.done)}
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 text-[#9AA8B6] group-hover:text-[#00CCF2] transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Technical Detail */}
                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-white/10 space-y-6 animate-in fade-in duration-200">
                        {/* Oil & Filters Specification breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Oil Spec */}
                          <div className="p-4 rounded-2xl bg-[#0D0D0D]/70 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#F4F7F8] flex items-center gap-1.5">
                                <Droplet className="w-4 h-4 text-[#00CCF2]" />
                                Especificación del Aceite
                              </span>
                              {renderSegmentBadge('Aceite', order.oil.done)}
                            </div>
                            {order.oil.done === 'si' ? (
                              <div className="space-y-1 text-xs text-[#9AA8B6]">
                                <p>
                                  Marca: <strong className="text-[#F4F7F8]">{order.oil.brand || 'No indicada'}</strong>
                                </p>
                                <p>
                                  Viscosidad: <strong className="text-[#00CCF2] font-mono">{order.oil.viscosity || 'No indicada'}</strong>
                                </p>
                                <p>
                                  Norma: <strong className="text-[#F4F7F8] font-mono">{order.oil.specification || 'Estándar'}</strong>
                                </p>
                              </div>
                            ) : (
                              <p className="text-xs text-[#9AA8B6]">
                                No se requirió intervención en circuito de lubricación en esta visita.
                              </p>
                            )}
                          </div>

                          {/* Filters Spec */}
                          <div className="p-4 rounded-2xl bg-[#0D0D0D]/70 border border-white/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#F4F7F8] flex items-center gap-1.5">
                                <Filter className="w-4 h-4 text-[#00CCF2]" />
                                Sustitución de Filtros
                              </span>
                              {renderSegmentBadge('Filtros', order.filters.done)}
                            </div>
                            {order.filters.done === 'si' && order.filters.items.length > 0 ? (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {order.filters.items.map((item, fIdx) => (
                                  <span
                                    key={fIdx}
                                    className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-[#F4F7F8]"
                                  >
                                    {item.type} {item.brand ? `(${item.brand})` : ''}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-[#9AA8B6]">
                                Sin sustitución de elementos filtrantes en esta orden.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Mechanical Work Description */}
                        <div className="space-y-2">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00CCF2] block">
                            TRABAJO MECÁNICO REALIZADO
                          </span>
                          <div className="p-4 rounded-2xl bg-[#0D0D0D]/80 border border-white/10 text-xs text-[#F4F7F8] leading-relaxed font-sans whitespace-pre-wrap">
                            {order.mechanicalWork.description}
                          </div>
                        </div>

                        {/* Future Recommendations (Separated from executed work) */}
                        {order.mechanicalWork.futureRecommendations && (
                          <div className="space-y-2">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623] block">
                              RECOMENDACIONES PREVENTIVAS PARA EL CLIENTE
                            </span>
                            <div className="p-4 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/30 text-xs text-[#F5A623] leading-relaxed font-medium">
                              {order.mechanicalWork.futureRecommendations}
                            </div>
                          </div>
                        )}

                        {/* Photographic Evidence Gallery */}
                        {order.evidence && order.evidence.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00CCF2] flex items-center gap-2">
                              <Camera className="w-4 h-4" />
                              <span>EVIDENCIA FOTOGRÁFICA CERTIFICADA ({order.evidence.length})</span>
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {order.evidence.map((img) => (
                                <div
                                  key={img.id}
                                  onClick={() => setLightboxImage(img)}
                                  className="relative group/img overflow-hidden rounded-2xl border border-white/10 aspect-video cursor-pointer bg-[#0D0D0D]"
                                >
                                  <img
                                    src={img.url}
                                    alt={img.description}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-80" />
                                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-[#F4F7F8]">
                                    <span className="capitalize font-bold bg-[#0D0D0D]/80 px-2 py-0.5 rounded">
                                      {img.category}
                                    </span>
                                    <Maximize2 className="w-3.5 h-3.5 text-[#00CCF2]" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full-Resolution Photo Inspection */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="relative max-w-4xl w-full rounded-3xl glass-panel border border-white/20 p-4 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#00CCF2] uppercase tracking-wider">
                CATEGORÍA: {lightboxImage.category}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-full bg-white/10 text-[#F4F7F8] hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black">
              <img
                src={lightboxImage.url}
                alt={lightboxImage.description}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#9AA8B6] italic">{lightboxImage.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};
