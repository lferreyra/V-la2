import React, { useState, useRef } from 'react';
import {
  Car,
  Calendar,
  Gauge,
  Droplet,
  Filter,
  Wrench,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Image as ImageIcon,
  Clock,
  UserCheck,
  FileCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  Client,
  EvidenceCategory,
  EvidenceImage,
  FilterItem,
  FilterType,
  OrderStatus,
  SegmentOption,
  ServiceOrder,
  Vehicle,
} from '../types';
import { storageRepository } from '../services/storageRepository';

interface ServiceOrderFormProps {
  vehicle: Vehicle;
  client: Client;
  existingOrder?: ServiceOrder;
  onSaveSuccess: (order: ServiceOrder) => void;
  onCancel: () => void;
}

const ORDER_STATUS_DETAILS: Record<
  OrderStatus,
  { label: string; badgeClass: string; description: string }
> = {
  recibido: {
    label: '1. Recibido en Taller',
    badgeClass: 'bg-[#18C7D9]/15 text-[#18C7D9] border-[#18C7D9]/40',
    description: 'Recepción formal e inventario inicial registrado.',
  },
  inspección: {
    label: '2. En Inspección / Diagnóstico',
    badgeClass: 'bg-[#F5A623]/15 text-[#F5A623] border-[#F5A623]/40',
    description: 'Revisión en elevador o diagnóstico computarizado.',
  },
  presupuesto: {
    label: '3. En Presupuesto',
    badgeClass: 'bg-[#A8B6C1]/15 text-[#A8B6C1] border-[#A8B6C1]/40',
    description: 'Cotización de piezas y mano de obra pendiente de confirmación.',
  },
  aprobado: {
    label: '4. Presupuesto Aprobado',
    badgeClass: 'bg-[#18C7D9]/20 text-[#18C7D9] border-[#18C7D9]/60',
    description: 'Cliente autorizó los trabajos a realizar.',
  },
  'en trabajo': {
    label: '5. En Trabajo Mecánico',
    badgeClass: 'bg-[#18C7D9]/25 text-[#18C7D9] border-[#18C7D9]',
    description: 'Técnicos realizando reparaciones y sustituciones.',
  },
  listo: {
    label: '6. Listo para Entrega',
    badgeClass: 'bg-[#28C98B]/20 text-[#28C98B] border-[#28C98B]/60',
    description: 'Trabajos finalizados, prueba de ruta y control de calidad aprobado.',
  },
  cerrado: {
    label: '7. Orden Cerrada / Entregado',
    badgeClass: 'bg-[#263946] text-[#A8B6C1] border-[#263946]',
    description: 'Vehículo retirado por el cliente y expediente cerrado.',
  },
};

const FILTER_TYPES: FilterType[] = [
  'Aire de motor',
  'Aceite',
  'Habitáculo (Cabina)',
  'Combustible',
  'Caja / Transmisión',
  'Líquido de frenos',
  'Otro',
];

const EVIDENCE_CATEGORIES: { id: EvidenceCategory; label: string }[] = [
  { id: 'recepcion', label: 'Recepción del vehículo' },
  { id: 'trabajo', label: 'Durante la intervención' },
  { id: 'pieza_dañada', label: 'Pieza dañada / desgastada' },
  { id: 'finalizado', label: 'Trabajo finalizado' },
];

export const ServiceOrderForm: React.FC<ServiceOrderFormProps> = ({
  vehicle,
  client,
  existingOrder,
  onSaveSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form State initialized from existingOrder or defaults
  const [entryDate, setEntryDate] = useState(
    existingOrder?.entryDate
      ? existingOrder.entryDate.slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  );
  const [entryMileage, setEntryMileage] = useState(
    existingOrder ? existingOrder.entryMileage.toString() : vehicle.currentMileage.toString(),
  );
  const [exitMileage, setExitMileage] = useState(
    existingOrder?.exitMileage ? existingOrder.exitMileage.toString() : '',
  );
  const [visitReason, setVisitReason] = useState(
    existingOrder?.visitReason || 'Mantenimiento preventivo general y chequeo preventivo.',
  );

  // Oil Service
  const [oilDone, setOilDone] = useState<SegmentOption>(existingOrder?.oil.done || 'si');
  const [oilBrand, setOilBrand] = useState(existingOrder?.oil.brand || 'Castrol Edge Titanium');
  const [oilSpec, setOilSpec] = useState(existingOrder?.oil.specification || 'VW 504 00 / 507 00');
  const [oilViscosity, setOilViscosity] = useState(existingOrder?.oil.viscosity || '5W-30');

  // Filters Service
  const [filtersDone, setFiltersDone] = useState<SegmentOption>(
    existingOrder?.filters.done || 'si',
  );
  const [filtersList, setFiltersList] = useState<FilterItem[]>(
    existingOrder?.filters.items || [
      { id: 'flt-1', type: 'Aceite', brand: 'Mann-Filter' },
      { id: 'flt-2', type: 'Aire de motor', brand: 'Mann-Filter' },
    ],
  );

  // Mechanical Work
  const [workDescription, setWorkDescription] = useState(
    existingOrder?.mechanicalWork.description || '',
  );
  const [recommendations, setRecommendations] = useState(
    existingOrder?.mechanicalWork.futureRecommendations || '',
  );

  // Evidence Images
  const [evidenceImages, setEvidenceImages] = useState<EvidenceImage[]>(
    existingOrder?.evidence || [],
  );
  const [newImageDescription, setNewImageDescription] = useState('');
  const [newImageCategory, setNewImageCategory] = useState<EvidenceCategory>('recepcion');

  // Status & Responsible
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(
    existingOrder?.status || 'recibido',
  );
  const [closingNote, setClosingNote] = useState('');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add a new filter item to the dynamic list
  const handleAddFilter = () => {
    setFiltersList((prev) => [
      ...prev,
      {
        id: `flt-${Date.now()}-${Math.floor(Math.random() * 100)}`,
        type: 'Aire de motor',
        brand: '',
      },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    setFiltersList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateFilter = (id: string, field: keyof FilterItem, val: string) => {
    setFiltersList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  // Image Upload or Camera Capture handler
  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newImg: EvidenceImage = {
        id: `ev-${Date.now()}`,
        url: dataUrl,
        description: newImageDescription.trim() || 'Evidencia fotográfica documentada',
        category: newImageCategory,
        uploadedAt: new Date().toISOString(),
        fileName: file.name,
      };

      setEvidenceImages((prev) => [...prev, newImg]);
      setNewImageDescription('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id: string) => {
    setEvidenceImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Step Validation before progressing
  const validateStep = (step: number) => {
    setFormError(null);
    if (step === 1) {
      if (!visitReason.trim()) {
        setFormError('Por favor describa el motivo de la visita o servicio solicitado.');
        return false;
      }
      const km = parseInt(entryMileage, 10);
      if (isNaN(km) || km <= 0) {
        setFormError('El kilometraje de entrada debe ser un número válido mayor a 0.');
        return false;
      }
    }
    return true;
  };

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const goToPrevStep = () => {
    setFormError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final Form Submission
  const handleFinalSave = () => {
    setIsSubmitting(true);
    setFormError(null);

    const currentUser = storageRepository.getCurrentUser();

    try {
      if (existingOrder) {
        // Update existing order
        const updated = storageRepository.updateServiceOrder(
          existingOrder.id,
          {
            entryDate,
            entryMileage: parseInt(entryMileage, 10),
            exitMileage: exitMileage ? parseInt(exitMileage, 10) : undefined,
            visitReason,
            oil: {
              done: oilDone,
              brand: oilDone === 'si' ? oilBrand : undefined,
              specification: oilDone === 'si' ? oilSpec : undefined,
              viscosity: oilDone === 'si' ? oilViscosity : undefined,
            },
            filters: {
              done: filtersDone,
              items: filtersDone === 'si' ? filtersList : [],
            },
            mechanicalWork: {
              description: workDescription,
              futureRecommendations: recommendations,
            },
            evidence: evidenceImages,
            status: orderStatus,
          },
          closingNote || `Actualización en paso ${currentStep}`,
        );

        onSaveSuccess(updated);
      } else {
        // Create new service order
        const newOrder = storageRepository.createServiceOrder({
          vehicleId: vehicle.id,
          clientId: client.id,
          licensePlate: vehicle.licensePlate,
          licensePlateNormalized: vehicle.licensePlateNormalized,
          entryDate,
          entryMileage: parseInt(entryMileage, 10),
          exitMileage: exitMileage ? parseInt(exitMileage, 10) : undefined,
          visitReason,
          oil: {
            done: oilDone,
            brand: oilDone === 'si' ? oilBrand : undefined,
            specification: oilDone === 'si' ? oilSpec : undefined,
            viscosity: oilDone === 'si' ? oilViscosity : undefined,
          },
          filters: {
            done: filtersDone,
            items: filtersDone === 'si' ? filtersList : [],
          },
          mechanicalWork: {
            description: workDescription,
            futureRecommendations: recommendations,
          },
          evidence: evidenceImages,
          status: orderStatus,
          advisorId: currentUser.uid,
          advisorName: currentUser.displayName,
          assignedTechnicianId: currentUser.role === 'technician' ? currentUser.uid : undefined,
          assignedTechnicianName:
            currentUser.role === 'technician' ? currentUser.displayName : 'Técnico de Turno',
        });

        onSaveSuccess(newOrder);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error al procesar la orden de servicio.');
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    'Recepción',
    'Aceite',
    'Filtros',
    'Trabajo Mecánico',
    'Evidencia',
    'Cierre & Resumen',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6" id="service-order-flow">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263946] pb-5">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs text-[#9AA8B6] hover:text-[#00CCF2] transition-colors mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver sin guardar</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-[#F4F7F8]">
            {existingOrder ? `Editar Orden ${existingOrder.orderNumber}` : 'Nueva Orden de Servicio'}
          </h1>
          <p className="text-xs text-[#9AA8B6]">
            Vehículo:{' '}
            <strong className="text-[#00CCF2]">{vehicle.licensePlate}</strong> —{' '}
            {vehicle.brand} {vehicle.model} ({client.fullName})
          </p>
        </div>

        {/* Vehicle Badge */}
        <div className="glass-panel border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="font-mono font-black text-xl text-[#00CCF2]">
            {vehicle.licensePlate}
          </div>
          <div className="text-[11px] text-[#9AA8B6] border-l border-white/10 pl-3">
            <span>Km entrada:</span>
            <span className="font-bold text-[#F4F7F8] block font-mono">{entryMileage} km</span>
          </div>
        </div>
      </div>

      {/* Progress Bar (Visible progress indicator) */}
      <div className="glass-panel border border-white/10 rounded-[28px] p-4 sm:p-5 shadow-[0_12px_36px_rgba(0,0,0,0.3)]" id="progress-bar-container">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="font-mono font-bold text-[#00CCF2] uppercase tracking-wider">
            Paso {currentStep} de {totalSteps}: {stepTitles[currentStep - 1]}
          </span>
          <span className="text-[#9AA8B6] font-mono font-bold">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>

        {/* Continuous Bar */}
        <div className="w-full bg-[#0D0D0D] h-2.5 rounded-full overflow-hidden mb-3.5 border border-white/5">
          <div
            className="bg-gradient-to-r from-[#00CCF2] via-[#18C7D9] to-[#28C98B] h-full transition-all duration-300 shadow-[0_0_12px_rgba(0,204,242,0.5)]"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Buttons (Direct Navigation without losing state) */}
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {stepTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isDone = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            return (
              <button
                key={title}
                type="button"
                id={`step-indicator-${stepNum}`}
                onClick={() => {
                  if (validateStep(currentStep)) {
                    setCurrentStep(stepNum);
                  }
                }}
                className={`py-2 px-1 sm:px-2 rounded-xl text-center text-[10px] sm:text-xs font-semibold truncate transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#00CCF2] text-[#0D0D0D] font-black shadow-[0_0_15px_rgba(0,204,242,0.35)]'
                    : isDone
                    ? 'bg-[#0D0D0D] text-[#28C98B] border border-[#28C98B]/30 font-bold'
                    : 'bg-[#0D0D0D] text-[#9AA8B6] border border-white/5 hover:border-white/20'
                }`}
              >
                <span className="hidden sm:inline">{stepNum}. </span>
                {title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-[#FF5A4F]/15 border border-[#FF5A4F]/40 text-[#FF5A4F] text-xs flex items-center gap-3" id="order-form-error">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* ================= STEP CONTENT ================= */}

      <div className="glass-panel border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-h-[380px]" id="step-content-container">
        {/* STEP 1: DATOS DE RECEPCIÓN */}
        {currentStep === 1 && (
          <div className="space-y-6" id="step-1-reception-data">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#00CCF2]" />
                <span>Paso 1: Datos de Recepción del Vehículo</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Información de ingreso, lectura inicial del odómetro y síntoma o solicitud del cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-[#A8B6C1] mb-1.5">
                  Fecha y Hora de Ingreso
                </label>
                <input
                  type="datetime-local"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full bg-[#0B1117] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7F8] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                  Kilometraje de Entrada (Odómetro) <span className="text-[#FF5A4F]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    required
                    value={entryMileage}
                    onChange={(e) => setEntryMileage(e.target.value)}
                    className="w-full bg-[#0B1117] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#F4F7F8] outline-none"
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-[#A8B6C1] font-mono">
                    km
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A8B6C1] mb-1.5">
                  Matrícula Confirmada
                </label>
                <input
                  type="text"
                  disabled
                  value={vehicle.licensePlate}
                  className="w-full bg-[#0B1117]/60 border border-[#263946] rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-[#18C7D9] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A8B6C1] mb-1.5">
                  Propietario / Conductor
                </label>
                <input
                  type="text"
                  disabled
                  value={`${client.fullName} (${client.phoneWhatsApp})`}
                  className="w-full bg-[#0B1117]/60 border border-[#263946] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7F8] cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                  Motivo de Visita / Síntoma Reportado <span className="text-[#FF5A4F]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describa el motivo por el cual el cliente ingresa el vehículo (ej. cambio de aceite preventivo, ruidos en frenado, pérdida de potencia...)"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  className="w-full bg-[#0B1117] border border-[#263946] focus:border-[#18C7D9] rounded-xl p-3.5 text-sm text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ACEITE */}
        {currentStep === 2 && (
          <div className="space-y-6" id="step-2-oil-service">
            <div className="border-b border-[#263946] pb-3">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <Droplet className="w-5 h-5 text-[#18C7D9]" />
                <span>Paso 2: Servicio de Aceite de Motor</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Indique si se realizó cambio o reposición de lubricante y sus especificaciones técnicas.
              </p>
            </div>

            {/* Segmented Control "Sí / No / No informado" */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A8B6C1] mb-2.5">
                ¿Se realizó cambio o reposición de aceite?
              </label>
              <div className="grid grid-cols-3 gap-2 max-w-md" id="segmented-oil-control">
                {(['si', 'no', 'no_informado'] as SegmentOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    id={`oil-opt-${opt}`}
                    onClick={() => setOilDone(opt)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      oilDone === opt
                        ? opt === 'si'
                          ? 'bg-[#18C7D9] text-[#0B1117] border-[#18C7D9] shadow-md'
                          : opt === 'no'
                          ? 'bg-[#FF5A4F] text-[#F4F7F8] border-[#FF5A4F]'
                          : 'bg-[#F5A623] text-[#0B1117] border-[#F5A623]'
                        : 'bg-[#0B1117] text-[#A8B6C1] border-[#263946] hover:bg-[#1C2A35]'
                    }`}
                  >
                    {opt === 'si' ? 'Sí' : opt === 'no' ? 'No' : 'No informado'}
                  </button>
                ))}
              </div>
            </div>

            {/* If "Sí", show optional manual fields: Marca, Especificación, Viscosidad */}
            {oilDone === 'si' && (
              <div className="p-5 rounded-2xl bg-[#0B1117] border border-[#18C7D9]/40 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#18C7D9]">
                  <Sparkles className="w-4 h-4" />
                  <span>Especificaciones del Lubricante Utilizado</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                      Marca del Aceite
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Castrol, Motul, Mobil 1"
                      value={oilBrand}
                      onChange={(e) => setOilBrand(e.target.value)}
                      className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                      Viscosidad SAE
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. 5W-30, 0W-20, 5W-40"
                      value={oilViscosity}
                      onChange={(e) => setOilViscosity(e.target.value)}
                      className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-sm font-mono text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#F4F7F8] mb-1.5">
                      Norma / Especificación
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. VW 504.00, ACEA C3, API SP"
                      value={oilSpec}
                      onChange={(e) => setOilSpec(e.target.value)}
                      className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-sm text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: FILTROS */}
        {currentStep === 3 && (
          <div className="space-y-6" id="step-3-filters-service">
            <div className="border-b border-[#263946] pb-3">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#18C7D9]" />
                <span>Paso 3: Sustitución y Revisión de Filtros</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Registre los filtros sustituidos con su tipo y marca correspondiente.
              </p>
            </div>

            {/* Segmented Control "Sí / No / No informado" */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A8B6C1] mb-2.5">
                ¿Se cambiaron filtros en esta visita?
              </label>
              <div className="grid grid-cols-3 gap-2 max-w-md" id="segmented-filters-control">
                {(['si', 'no', 'no_informado'] as SegmentOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    id={`filter-opt-${opt}`}
                    onClick={() => setFiltersDone(opt)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                      filtersDone === opt
                        ? opt === 'si'
                          ? 'bg-[#18C7D9] text-[#0B1117] border-[#18C7D9] shadow-md'
                          : opt === 'no'
                          ? 'bg-[#FF5A4F] text-[#F4F7F8] border-[#FF5A4F]'
                          : 'bg-[#F5A623] text-[#0B1117] border-[#F5A623]'
                        : 'bg-[#0B1117] text-[#A8B6C1] border-[#263946] hover:bg-[#1C2A35]'
                    }`}
                  >
                    {opt === 'si' ? 'Sí' : opt === 'no' ? 'No' : 'No informado'}
                  </button>
                ))}
              </div>
            </div>

            {/* If "Sí", allow adding one or more filters with type and manual brand */}
            {filtersDone === 'si' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#18C7D9]">
                    Filtros Sustituidos ({filtersList.length})
                  </span>
                  <button
                    type="button"
                    id="btn-add-filter"
                    onClick={handleAddFilter}
                    className="px-3 py-1.5 rounded-lg bg-[#18C7D9]/15 text-[#18C7D9] hover:bg-[#18C7D9]/25 border border-[#18C7D9]/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Filtro</span>
                  </button>
                </div>

                {filtersList.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#0B1117] border border-dashed border-[#263946] text-center text-xs text-[#A8B6C1]">
                    No ha añadido filtros todavía. Haga clic en "Añadir Filtro" para registrar uno.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filtersList.map((filter, index) => (
                      <div
                        key={filter.id}
                        className="p-4 rounded-xl bg-[#0B1117] border border-[#263946] flex flex-col sm:flex-row items-start sm:items-center gap-3"
                      >
                        <span className="text-xs font-mono font-bold text-[#A8B6C1] w-6">
                          #{index + 1}
                        </span>

                        <div className="flex-1 w-full sm:w-auto">
                          <label className="block text-[11px] text-[#A8B6C1] mb-1">
                            Tipo de Filtro
                          </label>
                          <select
                            value={filter.type}
                            onChange={(e) =>
                              handleUpdateFilter(filter.id, 'type', e.target.value as FilterType)
                            }
                            className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-lg px-3 py-2 text-xs text-[#F4F7F8] outline-none"
                          >
                            {FILTER_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex-1 w-full sm:w-auto">
                          <label className="block text-[11px] text-[#A8B6C1] mb-1">
                            Marca y Referencia Manual
                          </label>
                          <input
                            type="text"
                            placeholder="Ej. Mann-Filter HU 6013 z"
                            value={filter.brand}
                            onChange={(e) => handleUpdateFilter(filter.id, 'brand', e.target.value)}
                            className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-lg px-3 py-2 text-xs text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="self-end sm:self-center p-2 rounded-lg bg-[#FF5A4F]/10 hover:bg-[#FF5A4F]/20 text-[#FF5A4F] transition-colors mt-2 sm:mt-4"
                          title="Eliminar este filtro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: TRABAJO MECÁNICO */}
        {currentStep === 4 && (
          <div className="space-y-6" id="step-4-mechanical-work">
            <div className="border-b border-[#263946] pb-3">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#18C7D9]" />
                <span>Paso 4: Trabajo Mecánico y Recomendaciones Futuras</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Describa detalladamente las tareas ejecutadas y anote recomendaciones separadas para el cliente.
              </p>
            </div>

            <div className="space-y-5">
              {/* Quick Official Catalog Services Picker */}
              <div className="p-4 rounded-2xl bg-[#12161A] border border-white/[0.08]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00CCF2] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00CCF2]" />
                    Plantillas del Catálogo Oficial (Cargadas por Administrador)
                  </span>
                  <span className="text-[10px] text-[#9AA8B6]">
                    Haz clic para cargar el procedimiento
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {storageRepository.getWorkshopServices().filter((s) => s.active).map((svc) => (
                    <button
                      key={svc.id}
                      type="button"
                      onClick={() => {
                        const newText = workDescription
                          ? `${workDescription}\n\n• ${svc.name} (${svc.code}): ${svc.description}`
                          : `• ${svc.name} (${svc.code}): ${svc.description}`;
                        setWorkDescription(newText);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#1A1C20] hover:bg-[#22252B] border border-white/10 hover:border-[#00CCF2]/40 text-xs text-[#F4F7F8] flex items-center gap-1.5 transition-all"
                    >
                      <span className="text-[10px] font-mono font-bold text-[#00CCF2]">{svc.code}</span>
                      <span>{svc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F4F7F8] mb-1.5 flex items-center gap-1.5">
                  <span>Trabajo Mecánico Efectivamente Realizado</span>
                  <span className="text-[10px] text-[#00CCF2] font-normal lowercase">
                    (operaciones en motor, frenos, suspensión, electricidad, etc.)
                  </span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Describa el trabajo realizado con rigor técnico. Ej.: Desmontaje de pinzas traseras, rectificado de rebabas, sustitución de pastillas, purgado con máquina de presión a 2 bar, comprobación en banco de rodillos..."
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  className="w-full bg-[#0B1117] border border-[#263946] focus:border-[#00CCF2] rounded-xl p-4 text-sm text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#0B1117] border border-[#F5A623]/30 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F5A623] mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-[#F5A623]" />
                  <span>Recomendaciones Futuras Separadas</span>
                </label>
                <p className="text-[11px] text-[#A8B6C1]">
                  Observaciones preventivas para la próxima visita (desgaste de neumáticos, próximo cambio de correa, bujías o frenos).
                </p>
                <textarea
                  rows={3}
                  placeholder="Ej.: Correa de distribución prevista a los 120.000 km. Neumáticos traseros al 40% de vida útil. Revisar amortiguadores delanteros en 6 meses."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  className="w-full bg-[#131D26] border border-[#263946] focus:border-[#F5A623] rounded-xl p-3.5 text-sm text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: EVIDENCIA FOTOGRÁFICA */}
        {currentStep === 5 && (
          <div className="space-y-6" id="step-5-evidence-photos">
            <div className="border-b border-[#263946] pb-3">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#18C7D9]" />
                <span>Paso 5: Evidencia Fotográfica Digital</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Tome fotos con la cámara del dispositivo o adjunte imágenes para respaldo técnico y transparencia con el cliente.
              </p>
            </div>

            {/* Hidden native file and camera inputs */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageSelected}
              className="hidden"
              id="file-upload-input"
            />
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handleImageSelected}
              className="hidden"
              id="camera-capture-input"
            />

            {/* Photo Capture Controls Panel */}
            <div className="p-5 rounded-2xl bg-[#0B1117] border border-[#263946] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#A8B6C1] mb-1.5">
                    Categoría de la Fotografía
                  </label>
                  <select
                    value={newImageCategory}
                    onChange={(e) => setNewImageCategory(e.target.value as EvidenceCategory)}
                    className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F7F8] outline-none"
                  >
                    {EVIDENCE_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A8B6C1] mb-1.5">
                    Descripción / Nota de la Evidencia
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Estado de pastilla desgastada a 2mm"
                    value={newImageDescription}
                    onChange={(e) => setNewImageDescription(e.target.value)}
                    className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F7F8] placeholder-[#A8B6C1]/40 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons: Camera vs File Upload */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-take-photo"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-5 py-3 rounded-xl bg-[#18C7D9] hover:bg-[#087E91] text-[#0B1117] text-xs font-bold flex items-center gap-2 transition-all shadow cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Tomar Fotografía con Cámara</span>
                </button>

                <button
                  type="button"
                  id="btn-upload-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-3 rounded-xl bg-[#1C2A35] hover:bg-[#263946] border border-[#263946] text-[#F4F7F8] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-[#18C7D9]" />
                  <span>Adjuntar Archivo de Imagen</span>
                </button>
              </div>
            </div>

            {/* Gallery of Uploaded Evidences */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A8B6C1]">
                Imágenes Vinculadas a la Orden ({evidenceImages.length})
              </span>

              {evidenceImages.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#0B1117] border border-dashed border-[#263946] text-center space-y-2">
                  <ImageIcon className="w-8 h-8 text-[#A8B6C1]/40 mx-auto" />
                  <p className="text-xs text-[#A8B6C1]">
                    No hay fotografías cargadas aún para esta orden.
                  </p>
                  <p className="text-[11px] text-[#A8B6C1]/70">
                    Use los botones de arriba para fotografiar la recepción o piezas intervenidas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evidenceImages.map((img) => (
                    <div
                      key={img.id}
                      className="bg-[#0B1117] border border-[#263946] rounded-xl overflow-hidden shadow group"
                    >
                      <div className="h-40 bg-[#131D26] relative overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.description}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0B1117]/80 backdrop-blur text-[#18C7D9] border border-[#263946]">
                          {EVIDENCE_CATEGORIES.find((c) => c.id === img.category)?.label || img.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#FF5A4F]/80 hover:bg-[#FF5A4F] text-[#F4F7F8] transition-colors"
                          title="Eliminar fotografía"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-[#F4F7F8] truncate">
                          {img.description}
                        </p>
                        <p className="text-[10px] text-[#A8B6C1]">
                          {new Date(img.uploadedAt).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: CIERRE & RESUMEN */}
        {currentStep === 6 && (
          <div className="space-y-6" id="step-6-closure-summary">
            <div className="border-b border-[#263946] pb-3">
              <h2 className="text-lg font-bold text-[#F4F7F8] flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#18C7D9]" />
                <span>Paso 6: Cierre, Estado y Resumen de la Orden</span>
              </h2>
              <p className="text-xs text-[#A8B6C1]">
                Verifique los datos cargados antes de guardar y asigne el estado actual de la orden.
              </p>
            </div>

            {/* Closing Mileage & Status Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-[#0B1117] border border-[#263946]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F4F7F8] mb-1.5">
                  Estado de la Orden <span className="text-[#FF5A4F]">*</span>
                </label>
                <select
                  id="select-order-status"
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                  className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-3 text-sm font-semibold text-[#F4F7F8] outline-none"
                >
                  {Object.entries(ORDER_STATUS_DETAILS).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#A8B6C1] mt-1.5">
                  {ORDER_STATUS_DETAILS[orderStatus].description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F4F7F8] mb-1.5">
                  Kilometraje de Salida (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={parseInt(entryMileage, 10)}
                    placeholder={`Mínimo ${entryMileage} km`}
                    value={exitMileage}
                    onChange={(e) => setExitMileage(e.target.value)}
                    className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-3 text-sm font-mono text-[#F4F7F8] outline-none"
                  />
                  <span className="absolute right-3.5 top-3 text-xs text-[#A8B6C1] font-mono">
                    km
                  </span>
                </div>
                <p className="text-[11px] text-[#A8B6C1] mt-1.5">
                  Actualizará el odómetro actual del vehículo si es mayor al ingreso.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#A8B6C1] mb-1">
                  Nota de Transición o Comentario de Cierre (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Revisión final aprobada, entregado con factura 4402"
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                  className="w-full bg-[#131D26] border border-[#263946] focus:border-[#18C7D9] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F7F8] outline-none"
                />
              </div>
            </div>

            {/* Comprehensive Pre-Save Recap */}
            <div className="border border-[#263946] rounded-2xl overflow-hidden bg-[#0B1117]" id="recap-summary-card">
              <div className="px-5 py-3 bg-[#1C2A35] border-b border-[#263946] flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18C7D9]">
                  Resumen de la Orden a Guardar
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ORDER_STATUS_DETAILS[orderStatus].badgeClass}`}
                >
                  {ORDER_STATUS_DETAILS[orderStatus].label}
                </span>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-[#263946] pb-3">
                  <div>
                    <span className="text-[#A8B6C1] block">Vehículo:</span>
                    <span className="font-bold text-[#F4F7F8] font-mono">{vehicle.licensePlate}</span>
                  </div>
                  <div>
                    <span className="text-[#A8B6C1] block">Propietario:</span>
                    <span className="font-bold text-[#F4F7F8]">{client.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#A8B6C1] block">Km Ingreso:</span>
                    <span className="font-mono text-[#F4F7F8]">{entryMileage} km</span>
                  </div>
                  <div>
                    <span className="text-[#A8B6C1] block">Km Salida:</span>
                    <span className="font-mono text-[#F4F7F8]">
                      {exitMileage ? `${exitMileage} km` : 'Sin registrar'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-[#131D26]">
                    <span className="font-bold text-[#18C7D9] block mb-1">Aceite de Motor:</span>
                    <p className="text-[#F4F7F8]">
                      {oilDone === 'si'
                        ? `Sí (${oilBrand} - ${oilViscosity} - ${oilSpec})`
                        : oilDone === 'no'
                        ? 'No realizado'
                        : 'No informado'}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#131D26]">
                    <span className="font-bold text-[#18C7D9] block mb-1">Filtros:</span>
                    <p className="text-[#F4F7F8]">
                      {filtersDone === 'si'
                        ? `${filtersList.length} filtros: ${filtersList.map((f) => `${f.type} (${f.brand || 'Manual'})`).join(', ') || 'Ninguno especificado'}`
                        : filtersDone === 'no'
                        ? 'No realizado'
                        : 'No informado'}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#131D26] space-y-2">
                  <span className="font-bold text-[#18C7D9] block">Trabajo Mecánico:</span>
                  <p className="text-[#F4F7F8] whitespace-pre-wrap">
                    {workDescription || 'Sin detalle de trabajo registrado.'}
                  </p>
                  {recommendations && (
                    <div className="pt-2 border-t border-[#263946] text-[#F5A623]">
                      <span className="font-bold block">Recomendaciones:</span>
                      <p className="whitespace-pre-wrap">{recommendations}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[#A8B6C1] pt-1">
                  <span>Evidencia adjunta: {evidenceImages.length} fotografías</span>
                  <span>Responsable: {storageRepository.getCurrentUser().displayName}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation and Submission Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div>
          {currentStep > 1 && (
            <button
              type="button"
              id="btn-prev-step"
              onClick={goToPrevStep}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#263946] bg-[#131D26] hover:bg-[#1C2A35] text-[#F4F7F8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior: {stepTitles[currentStep - 2]}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentStep < totalSteps ? (
            <button
              type="button"
              id="btn-next-step"
              onClick={goToNextStep}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#18C7D9] hover:bg-[#087E91] text-[#0B1117] text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <span>Continuar a: {stepTitles[currentStep]}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-save-order-final"
              disabled={isSubmitting}
              onClick={handleFinalSave}
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-[#18C7D9] to-[#28C98B] hover:opacity-90 text-[#0B1117] text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'Guardando...' : 'Guardar y Cerrar Orden'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
