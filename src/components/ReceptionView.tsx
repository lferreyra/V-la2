import React, { useState } from 'react';
import {
  Car,
  Search,
  UserPlus,
  ArrowRight,
  Clock,
  Gauge,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle2,
  FileText,
  History,
  ShieldAlert,
  Sparkles,
  Info,
  Zap,
  Activity,
  Award,
} from 'lucide-react';
import {
  formatDisplayPlate,
  normalizeLicensePlate,
  storageRepository,
} from '../services/storageRepository';
import { Client, Vehicle } from '../types';

interface ReceptionViewProps {
  onStartNewOrder: (vehicle: Vehicle, client: Client) => void;
  onViewHistory: (vehicleId: string) => void;
}

export const ReceptionView: React.FC<ReceptionViewProps> = ({
  onStartNewOrder,
  onViewHistory,
}) => {
  const [plateInput, setPlateInput] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    vehicle: Vehicle;
    client: Client;
    lastVisitDate?: string;
    orderCount: number;
  } | null>(null);

  // New vehicle & client registration form state
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneWhatsApp: '',
    email: '',
    licensePlate: '',
    brand: '',
    model: '',
    version: '',
    year: new Date().getFullYear().toString(),
    currentMileage: '',
    vin: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Quick suggestions from active workshop
  const availableVehicles = storageRepository.getVehicles();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Normalizar automáticamente al escribir o pegar: mayúsculas sin guiones ni caracteres especiales
    const cleanVal = normalizeLicensePlate(e.target.value);
    setPlateInput(cleanVal);
    if (hasSearched) {
      setHasSearched(false);
      setSearchResult(null);
      setShowRegisterForm(false);
      setErrorMessage(null);
    }
  };

  const executeSearch = (targetPlate?: string) => {
    const query = targetPlate || plateInput;
    const normalized = normalizeLicensePlate(query);

    if (!normalized) {
      setErrorMessage('Por favor, introduzca una patente válida para buscar (ej. VLA481 o AA123BB).');
      return;
    }

    setErrorMessage(null);
    setHasSearched(true);

    const result = storageRepository.searchVehicleByPlate(normalized);

    if (result) {
      setSearchResult({
        vehicle: result.vehicle,
        client: result.client,
        lastVisitDate: result.vehicle.lastVisitDate,
        orderCount: result.orderCount,
      });
      setShowRegisterForm(false);
    } else {
      setSearchResult(null);
      setShowRegisterForm(true);
      setFormData((prev) => ({
        ...prev,
        licensePlate: normalizeLicensePlate(normalized),
      }));
    }
  };

  const handleQuickPlateClick = (plate: string) => {
    setPlateInput(plate);
    executeSearch(plate);
  };

  // Form Validation and submission for new registration
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      errs.fullName = 'El nombre completo del propietario es obligatorio (mínimo 3 caracteres).';
    }
    if (!formData.phoneWhatsApp.trim() || formData.phoneWhatsApp.trim().length < 7) {
      errs.phoneWhatsApp = 'El número de WhatsApp es obligatorio para avisos y seguimiento.';
    }
    if (!formData.licensePlate.trim()) {
      errs.licensePlate = 'La matrícula es obligatoria.';
    }
    if (!formData.brand.trim()) {
      errs.brand = 'Indique la marca del vehículo (ej. Toyota, Volkswagen).';
    }
    if (!formData.model.trim()) {
      errs.model = 'Indique el modelo del vehículo (ej. Golf, RAV4).';
    }
    const yr = parseInt(formData.year, 10);
    const currentYear = new Date().getFullYear();
    if (isNaN(yr) || yr < 1970 || yr > currentYear + 1) {
      errs.year = `Año inválido (debe ser entre 1970 y ${currentYear + 1}).`;
    }
    const km = parseInt(formData.currentMileage, 10);
    if (isNaN(km) || km < 0) {
      errs.currentMileage = 'Indique el kilometraje actual en números válidos.';
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) return;

    try {
      const created = storageRepository.registerClientAndVehicle({
        fullName: formData.fullName,
        phoneWhatsApp: formData.phoneWhatsApp,
        email: formData.email,
        licensePlate: formData.licensePlate,
        brand: formData.brand,
        model: formData.model,
        version: formData.version || 'Estándar',
        year: parseInt(formData.year, 10),
        currentMileage: parseInt(formData.currentMileage, 10),
        vin: formData.vin,
      });

      setSaveSuccessMessage('Cliente y vehículo registrados correctamente en el taller.');
      setSearchResult({
        vehicle: created.vehicle,
        client: created.client,
        lastVisitDate: undefined,
        orderCount: 0,
      });
      setShowRegisterForm(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al registrar el cliente y vehículo.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8" id="reception-view">
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00CCF2]/10 border border-[#00CCF2]/30 text-xs font-mono font-bold uppercase text-[#00CCF2] mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>MÓDULO DE ADMISIÓN RÁPIDA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
            Identificación por <span className="text-[#00CCF2]">Matrícula</span>
          </h1>
          <p className="text-sm text-[#9AA8B6] mt-1 max-w-xl">
            Entrada directa para consultar el historial computarizado o aperturar una orden técnica.
          </p>
        </div>

        {/* Live Workshop Pill Status */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl flex items-center gap-3 border border-white/10 shrink-0">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00CCF2] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00CCF2]"></span>
          </div>
          <div className="text-xs">
            <span className="text-[#9AA8B6] block text-[10px] uppercase font-bold tracking-wider">
              Taller Activo
            </span>
            <span className="font-bold text-[#F4F7F8]">
              {storageRepository.getCurrentWorkshop().name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero License Plate Search Console (Webflow/Framer styled) */}
      <div
        className="relative overflow-hidden rounded-[32px] glass-panel p-6 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
        id="license-plate-search-box"
      >
        {/* Specular lighting effect behind search */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00CCF2]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#18C7D9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold tracking-widest text-[#00CCF2] uppercase">
              PATENTE IDENTIFICATIVA • ARGENTINA
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F4F7F8]">
              Introduce la patente del vehículo
            </h2>
            <p className="text-xs text-[#9AA8B6]">
              Sin guiones en el medio: Formato tradicional (<span className="text-[#00CCF2] font-mono font-bold">VLA481</span>) o Mercosur (<span className="text-[#00CCF2] font-mono font-bold">AA123BB</span>)
            </p>
          </div>

          {/* Large Floating Automotive Search Input */}
          <div className="relative flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-[#00CCF2] text-[#0D0D0D] text-[10px] font-black font-mono tracking-wider">
                  AR
                </span>
              </div>
              <input
                id="license-plate-input"
                type="text"
                value={plateInput}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === 'Enter' && executeSearch()}
                placeholder="EJ. VLA481 O AA123BB"
                autoComplete="off"
                className="w-full bg-[#0D0D0D]/90 border-2 border-white/15 focus:border-[#00CCF2] focus:shadow-[0_0_30px_rgba(0,204,242,0.25)] rounded-2xl py-4 sm:py-5 pl-16 pr-4 text-2xl sm:text-3xl font-mono font-black tracking-widest text-[#F4F7F8] placeholder-[#9AA8B6]/30 uppercase outline-none transition-all duration-300 text-center sm:text-left shadow-inner"
              />
            </div>

            <button
              id="btn-search-vehicle"
              type="button"
              onClick={() => executeSearch()}
              className="w-full sm:w-auto px-8 py-4 sm:py-5 bg-[#00CCF2] hover:bg-[#00CCF2]/90 text-[#0D0D0D] font-black text-sm rounded-2xl transition-all duration-200 shadow-[0_0_24px_rgba(0,204,242,0.35)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-5 h-5" />
              <span>BUSCAR VEHÍCULO</span>
            </button>
          </div>

          {/* Quick Click Demo Badges (Pill style from Image 1 & 2) */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#9AA8B6] font-medium mr-1 text-[11px]">Pruebas rápidas:</span>
            {availableVehicles.slice(0, 3).map(({ vehicle }) => (
              <button
                key={vehicle.id}
                id={`quick-plate-${vehicle.id}`}
                onClick={() => handleQuickPlateClick(vehicle.licensePlate)}
                className="px-3.5 py-1.5 rounded-full glass-pill hover:bg-white/15 text-[#F4F7F8] font-mono font-bold text-xs border border-white/10 hover:border-[#00CCF2]/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00CCF2]" />
                <span>{vehicle.licensePlate}</span>
                <span className="text-[10px] text-[#9AA8B6] font-sans font-normal">
                  ({vehicle.brand})
                </span>
              </button>
            ))}
            <button
              id="quick-plate-not-found"
              onClick={() => handleQuickPlateClick('AF987XZ')}
              className="px-3.5 py-1.5 rounded-full glass-pill hover:bg-[#F5A623]/20 text-[#F5A623] font-mono font-bold text-xs border border-[#F5A623]/30 transition-all cursor-pointer"
              title="Probar registro de vehículo inexistente"
            >
              + AF987XZ (Nuevo)
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      {errorMessage && (
        <div
          className="p-4 rounded-2xl bg-[#FF5A4F]/15 border border-[#FF5A4F]/40 text-[#FF5A4F] flex items-center gap-3 backdrop-blur-xl animate-in fade-in"
          id="reception-error-banner"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}

      {saveSuccessMessage && (
        <div
          className="p-4 rounded-2xl bg-[#28C98B]/15 border border-[#28C98B]/40 text-[#28C98B] flex items-center gap-3 backdrop-blur-xl animate-in fade-in"
          id="reception-success-banner"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{saveSuccessMessage}</p>
        </div>
      )}

      {/* CASE A: VEHICLE FOUND -> CONFIRMATION CARD (Porsche / Framer Aesthetic from Image 1) */}
      {hasSearched && searchResult && (
        <div
          id="vehicle-confirmation-card"
          className="relative overflow-hidden rounded-[32px] glass-panel border border-[#00CCF2]/40 p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6 animate-in zoom-in-95 duration-200"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#00CCF2]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Header Bar */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Automotive Metallic Plate Badge */}
              <div className="px-6 py-3.5 rounded-2xl bg-[#0D0D0D] border-2 border-[#00CCF2] shadow-[0_0_24px_rgba(0,204,242,0.25)] flex items-center gap-3.5 shrink-0">
                <span className="text-[11px] bg-[#00CCF2] text-[#0D0D0D] font-black px-2 py-0.5 rounded">
                  ES
                </span>
                <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-[#F4F7F8]">
                  {searchResult.vehicle.licensePlate}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#28C98B]/15 text-[#28C98B] border border-[#28C98B]/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Vehículo Verificado
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#9AA8B6]">
                    ★ 5.0 Servicio
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#F4F7F8]">
                  {searchResult.vehicle.brand} {searchResult.vehicle.model}
                </h2>
                <p className="text-xs text-[#9AA8B6] font-medium">{searchResult.vehicle.version}</p>
              </div>
            </div>

            <div className="glass-pill px-4 py-3 rounded-2xl text-left md:text-right shrink-0">
              <span className="text-[10px] text-[#9AA8B6] uppercase font-bold tracking-wider block">
                Historial Registrado
              </span>
              <span className="text-base font-black text-[#00CCF2] font-mono">
                {searchResult.orderCount} {searchResult.orderCount === 1 ? 'visita' : 'visitas'}
              </span>
            </div>
          </div>

          {/* Technical Specs Grid (Pill style telemetry) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
              <span className="text-xs text-[#9AA8B6] font-semibold flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-[#00CCF2]" />
                Propietario
              </span>
              <p className="font-bold text-sm text-[#F4F7F8] truncate">
                {searchResult.client.fullName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#28C98B] font-mono">
                <Phone className="w-3 h-3" />
                <span>{searchResult.client.phoneWhatsApp}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
              <span className="text-xs text-[#9AA8B6] font-semibold flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#00CCF2]" />
                Año & Chasis
              </span>
              <p className="font-bold text-sm text-[#F4F7F8]">
                {searchResult.vehicle.year}
              </p>
              <p className="text-[11px] text-[#9AA8B6] font-mono truncate">
                VIN: {searchResult.vehicle.vin || 'No registrado'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
              <span className="text-xs text-[#9AA8B6] font-semibold flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#00CCF2]" />
                Kilometraje
              </span>
              <p className="font-black text-sm text-[#F4F7F8] font-mono">
                {searchResult.vehicle.currentMileage.toLocaleString()} km
              </p>
              <p className="text-[11px] text-[#28C98B]">Odómetro sincronizado</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0D0D0D]/60 border border-white/10 space-y-1">
              <span className="text-xs text-[#9AA8B6] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00CCF2]" />
                Última Atención
              </span>
              <p className="font-bold text-sm text-[#F4F7F8]">
                {searchResult.lastVisitDate
                  ? new Date(searchResult.lastVisitDate).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Primera visita'}
              </p>
              <p className="text-[11px] text-[#9AA8B6]">Mantenimiento digital</p>
            </div>
          </div>

          {/* Confirmation Guard Action Bar */}
          <div className="p-5 rounded-2xl bg-[#131416]/90 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-[#9AA8B6]">
              <Info className="w-4 h-4 text-[#00CCF2] shrink-0" />
              <span>
                Confirme que el vehículo físico corresponde con la placa antes de aperturar la orden.
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="btn-view-vehicle-history"
                type="button"
                onClick={() => onViewHistory(searchResult.vehicle.id)}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#0D0D0D] hover:bg-white/10 border border-white/15 text-[#F4F7F8] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <History className="w-4 h-4 text-[#00CCF2]" />
                <span>Ver Historial</span>
              </button>

              <button
                id="btn-confirm-and-new-order"
                type="button"
                onClick={() => onStartNewOrder(searchResult.vehicle, searchResult.client)}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#00CCF2] hover:bg-[#00CCF2]/90 text-[#0D0D0D] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,204,242,0.35)] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Confirmar y Abrir Orden</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CASE B: VEHICLE NOT FOUND -> NEW CLIENT & VEHICLE REGISTRATION */}
      {hasSearched && showRegisterForm && (
        <div
          id="new-client-vehicle-form-card"
          className="rounded-[32px] glass-panel border border-white/15 p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-8 animate-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#F5A623] mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Matrícula no registrada</span>
              </div>
              <h2 className="text-2xl font-black text-[#F4F7F8]">
                Alta de Nuevo Cliente & Vehículo
              </h2>
              <p className="text-xs text-[#9AA8B6]">
                Ingrese los datos para registrar la ficha automotriz e iniciar la orden de servicio.
              </p>
            </div>

            <div className="px-5 py-2.5 rounded-2xl bg-[#0D0D0D] border-2 border-[#00CCF2] font-mono font-black text-[#00CCF2] text-lg tracking-widest self-start sm:self-auto">
              {formData.licensePlate || 'SIN PLACA'}
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6" id="form-register-new-client">
            {/* Section 1: Client Information */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00CCF2] flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>1. Información del Propietario</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Nombre Completo <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-client-name"
                    type="text"
                    required
                    placeholder="Ej. Martín Soler García"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none transition-all"
                  />
                  {formErrors.fullName && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    WhatsApp <span className="text-[#00CCF2] font-mono">* Obligatorio</span>
                  </label>
                  <input
                    id="input-client-whatsapp"
                    type="tel"
                    required
                    placeholder="+34 600 000 000"
                    value={formData.phoneWhatsApp}
                    onChange={(e) => setFormData({ ...formData, phoneWhatsApp: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none transition-all"
                  />
                  {formErrors.phoneWhatsApp && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.phoneWhatsApp}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9AA8B6] mb-1.5">
                    Email (Opcional)
                  </label>
                  <input
                    id="input-client-email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Vehicle Information */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#00CCF2] flex items-center gap-2">
                <Car className="w-4 h-4" />
                <span>2. Ficha Técnica Automotriz</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Patente (Sin guiones) <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-vehicle-plate"
                    type="text"
                    required
                    placeholder="Ej. VLA481 o AA123BB"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        licensePlate: normalizeLicensePlate(e.target.value),
                      })
                    }
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm font-mono font-black text-[#00CCF2] uppercase outline-none"
                  />
                  {formErrors.licensePlate ? (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.licensePlate}</p>
                  ) : (
                    <p className="text-[10px] text-[#9AA8B6] mt-1">Formato Arg: VLA481 o AA123BB</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Marca <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-vehicle-brand"
                    type="text"
                    required
                    placeholder="Ej. Porsche, Audi, Volkswagen"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none"
                  />
                  {formErrors.brand && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.brand}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Modelo <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-vehicle-model"
                    type="text"
                    required
                    placeholder="Ej. Taycan, Golf GTI, A4"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none"
                  />
                  {formErrors.model && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9AA8B6] mb-1.5">
                    Versión / Motor
                  </label>
                  <input
                    id="input-vehicle-version"
                    type="text"
                    placeholder="Ej. 2.0 TSI 245cv DSG"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Año <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-vehicle-year"
                    type="number"
                    required
                    min={1970}
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm font-mono text-[#F4F7F8] outline-none"
                  />
                  {formErrors.year && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                    Kilometraje Inicial <span className="text-[#FF5A4F]">*</span>
                  </label>
                  <input
                    id="input-vehicle-mileage"
                    type="number"
                    required
                    min={0}
                    placeholder="Ej. 45000"
                    value={formData.currentMileage}
                    onChange={(e) => setFormData({ ...formData, currentMileage: e.target.value })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm font-mono text-[#F4F7F8] outline-none"
                  />
                  {formErrors.currentMileage && (
                    <p className="text-[11px] text-[#FF5A4F] mt-1">{formErrors.currentMileage}</p>
                  )}
                </div>

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-[#9AA8B6] mb-1.5">
                    VIN / Número de Bastidor (Opcional - sin bloquear registro)
                  </label>
                  <input
                    id="input-vehicle-vin"
                    type="text"
                    maxLength={25}
                    placeholder="Ej. WVWZZZAUZMW091244"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })}
                    className="w-full bg-[#0D0D0D] border border-white/15 focus:border-[#00CCF2] rounded-xl px-4 py-3 text-sm font-mono text-[#F4F7F8] placeholder-[#9AA8B6]/40 outline-none uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowRegisterForm(false);
                  setHasSearched(false);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-xs font-semibold text-[#9AA8B6] hover:text-[#F4F7F8] hover:bg-white/5 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-save-new-vehicle"
                type="submit"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#00CCF2] hover:bg-[#00CCF2]/90 text-[#0D0D0D] text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(0,204,242,0.35)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>GUARDAR Y HABILITAR ORDEN</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
