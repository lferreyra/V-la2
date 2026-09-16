import React from 'react';
import {
  Wrench,
  ShieldCheck,
  FileText,
  History,
  Phone,
  ArrowRight,
  CheckCircle2,
  Car,
  Star,
  Zap,
  Gauge,
  CalendarCheck2,
  MapPin,
  Clock,
  ExternalLink,
  MessageCircle,
  Lock,
} from 'lucide-react';
import { BrandWordmark } from './BrandWordmark';
import {
  storageRepository,
  formatARS,
  OFFICIAL_WORKSHOP_MAPS_URL,
} from '../services/storageRepository';
import { WHATSAPP_CONFIG } from '../utils/whatsapp';

interface PublicLandingViewProps {
  onEnterApp: () => void;
}

export const PublicLandingView: React.FC<PublicLandingViewProps> = ({ onEnterApp }) => {
  const workshop = storageRepository.getCurrentWorkshop();
  const isAddressPublished = workshop.publishAddress !== false;
  const catalogServices = storageRepository.getWorkshopServices().filter((s) => s.active);

  const defaultFeaturedServices = [
    {
      title: 'Mantenimiento Periódico & Aceite',
      desc: 'Cambio de lubricante con la graduación recomendada por cada fabricante (0W-20, 5W-30, 5W-40), arandela nueva de cárter y sustitución de filtros.',
      icon: Wrench,
      highlight: 'Aceites sintéticos homologados',
      tag: 'MANTENIMIENTO',
      color: 'border-[#00CCF2]/40 text-[#00CCF2]',
      bg: 'bg-[#00CCF2]/10',
    },
    {
      title: 'Frenos, Discos & Pastillas',
      desc: 'Comprobación del desgaste de pastillas y discos de freno, control del líquido de frenos y revisión de latiguillos para máxima seguridad.',
      icon: ShieldCheck,
      highlight: 'Seguridad en cada frenada',
      tag: 'FRENOS & SEGURIDAD',
      color: 'border-[#F27D16]/40 text-[#F27D16]',
      bg: 'bg-[#F27D16]/10',
    },
    {
      title: 'Revisión Pre-ITV y Puesta a Punto',
      desc: 'Comprobación de luces, reglaje de faros, holguras de rótulas, amortiguadores, neumáticos y análisis de gases para pasar la ITV a la primera.',
      icon: Gauge,
      highlight: 'Inspección de puntos clave',
      tag: 'REVISIÓN PRE-ITV',
      color: 'border-[#F21616]/40 text-[#F21616]',
      bg: 'bg-[#F21616]/10',
    },
    {
      title: 'Climatización & Cargas de Gas',
      desc: 'Recarga de gas de aire acondicionado R134a y R1234yf, comprobación de estanqueidad para evitar fugas y sustitución del filtro de polen del habitáculo.',
      icon: Zap,
      highlight: 'Gas R1234yf & R134a',
      tag: 'CLIMATIZACIÓN',
      color: 'border-[#00CCF2]/40 text-[#00CCF2]',
      bg: 'bg-[#00CCF2]/10',
    },
    {
      title: 'Amortiguadores, Suspensión y Ruedas',
      desc: 'Sustitución de amortiguadores, copelas, silentblocks y rótulas de suspensión. Montaje y equilibrado de neumáticos para un rodaje suave y seguro.',
      icon: Car,
      highlight: 'Confort y estabilidad en ruta',
      tag: 'SUSPENSIÓN & RUEDAS',
      color: 'border-[#F25116]/40 text-[#F25116]',
      bg: 'bg-[#F25116]/10',
    },
    {
      title: 'Embragues y Distribución',
      desc: 'Cambio de kits de distribución con bomba de agua y tensores, y kits completos de embrague con recambios de primeras marcas garantizados.',
      icon: Wrench,
      highlight: 'Recambios de primeras marcas',
      tag: 'MECÁNICA GENERAL',
      color: 'border-[#F27D16]/40 text-[#F27D16]',
      bg: 'bg-[#F27D16]/10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F7F8] space-y-24 pb-24" id="public-landing-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Official Brand Logo Emblem */}
              <div className="flex justify-center lg:justify-start">
                <BrandWordmark size="lg" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00CCF2]/10 border border-[#00CCF2]/30 text-xs font-mono font-bold text-[#00CCF2]">
                <Wrench className="w-4 h-4 text-[#00CCF2]" />
                <span>TALLER MECÁNICO DE CONFIANZA & MECÁNICA GENERAL</span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.08]">
                Mecánica general, revisiones periódicas y{' '}
                <span className="bg-gradient-to-r from-[#00CCF2] via-[#F27D16] to-[#F21616] bg-clip-text text-transparent">
                  total transparencia
                </span>
                .
              </h1>

              <p className="text-base sm:text-lg text-[#9AA8B6] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                En <strong>V-LA Taller Mecánico</strong> cuidamos de tu vehículo con recambios de calidad, presupuesto previo sin sorpresas y registro técnico detallado por escrito en el historial de tu matrícula.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start pt-3">
                <a
                  id="btn-landing-whatsapp-cta"
                  href={WHATSAPP_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(37,211,102,0.4)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Pedir turno directo por WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Sacar Turno por WhatsApp</span>
                </a>

                <a
                  href={
                    isAddressPublished
                      ? workshop.googleMapsUrl || OFFICIAL_WORKSHOP_MAPS_URL
                      : '#workshop-location-section'
                  }
                  target={isAddressPublished ? '_blank' : '_self'}
                  rel={isAddressPublished ? 'noopener noreferrer' : undefined}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#1A1C20] hover:bg-[#22252B] border border-[#00CCF2]/40 text-[#00CCF2] text-sm font-bold flex items-center justify-center gap-2.5 transition-all shadow-[0_0_25px_rgba(0,204,242,0.15)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#00CCF2]" />
                  <span>{isAddressPublished ? 'Cómo llegar (Maps)' : 'Ubicación (Privada)'}</span>
                  {isAddressPublished ? (
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 opacity-70 text-[#F27D16]" />
                  )}
                </a>

                <button
                  id="btn-landing-enter-app"
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#00CCF2] via-[#00B4D8] to-[#0099B8] hover:from-[#00E5FF] hover:to-[#00B4D8] text-[#0D0D0D] text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-[0_0_30px_rgba(0,204,242,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Sistema Interno</span>
                  <div className="w-5 h-5 rounded-full bg-[#0D0D0D] text-[#00CCF2] flex items-center justify-center">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#9AA8B6]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00CCF2]" />
                  <span>Informe detallado de cada pieza</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F27D16]" />
                  <span>Sin sorpresas en presupuesto</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F21616]" />
                  <span>Garantía de taller por escrito</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card (5 cols) - Styled with Brand Gradient Border & Sleek Dark Finish */}
            <div className="lg:col-span-5 relative">
              <div className="p-[2px] rounded-[38px] bg-gradient-to-br from-[#00CCF2] via-[#F27D16] to-[#F21616] shadow-[0_25px_60px_rgba(0,204,242,0.2)]">
                <div className="relative overflow-hidden rounded-[36px] bg-[#131416] p-7 text-[#F4F7F8] group transition-all duration-500">
                  {/* Micro Top Header */}
                  <div className="flex items-center justify-between pb-4">
                    <span className="text-[11px] font-mono font-black uppercase tracking-widest bg-gradient-to-r from-[#00CCF2] to-[#0099B8] text-[#0D0D0D] px-3 py-1 rounded-full shadow-sm">
                      VEHÍCULO EN TALLER
                    </span>
                    <div className="flex items-center gap-1 font-bold text-xs text-[#F27D16]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>Revisión Oficial</span>
                    </div>
                  </div>

                  {/* Car Title */}
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#F4F7F8]">
                      Vehículo Sedán / Utilitario Multimarca
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black font-mono text-[#00CCF2]">AB 123 CD</span>
                      <span className="text-xs font-semibold text-[#9AA8B6]">· Mantenimiento periódico integral</span>
                    </div>
                  </div>

                  {/* Generic Vehicle Visual in Workshop Studio */}
                  <div className="my-6 relative flex items-center justify-center py-2">
                    <img
                      src="/generic_modern_car.jpg"
                      alt="Vehículo moderno en revisión técnica en V-LA Taller Mecánico"
                      className="w-full h-48 sm:h-56 object-cover rounded-2xl drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Conventional Workshop Feature Chips */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <div className="p-3 rounded-2xl bg-[#1A1C20] border border-white/[0.08] text-[#F4F7F8] space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#00CCF2] tracking-wider block">
                        LUBRICANTE MOTOR
                      </span>
                      <span className="text-xs font-bold font-mono">5W-30 Sintético OK</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1A1C20] border border-white/[0.08] text-[#F4F7F8] space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#F27D16] tracking-wider block">
                        FILTROS
                      </span>
                      <span className="text-xs font-bold font-mono">Aceite + Aire + Polen</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1A1C20] border border-white/[0.08] text-[#F4F7F8] space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#F25116] tracking-wider block">
                        FRENOS
                      </span>
                      <span className="text-xs font-bold font-mono">Pastillas & Discos OK</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#1A1C20] border border-white/[0.08] text-[#F4F7F8] space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-[#00CCF2] tracking-wider block">
                        DIAGNOSIS
                      </span>
                      <span className="text-xs font-bold font-mono">Escaneo OK</span>
                    </div>
                  </div>

                  {/* Bottom CTA Pill */}
                  <button
                    onClick={onEnterApp}
                    className="mt-5 w-full py-3.5 rounded-2xl bg-[#1A1C20] hover:bg-[#22252B] border border-white/10 text-xs font-bold text-[#F4F7F8] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Consultar historial de este vehículo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00CCF2]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy & Transparency Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-mono font-bold tracking-widest text-[#00CCF2] uppercase">
            NUESTRO COMPROMISO DE TALLER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
            Tres principios claros para tu tranquilidad
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-[32px] glass-panel border border-white/10 glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00CCF2]/15 text-[#00CCF2] border border-[#00CCF2]/30 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#F4F7F8]">Informe técnico por escrito</h3>
            <p className="text-sm text-[#9AA8B6] leading-relaxed">
              Describimos con total precisión cada repuesto sustituido, referencias de fabricante y el trabajo técnico realizado para que sepas exactamente por qué pagas.
            </p>
          </div>

          <div className="p-8 rounded-[32px] glass-panel border border-white/10 glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F27D16]/15 text-[#F27D16] border border-[#F27D16]/30 flex items-center justify-center">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#F4F7F8]">Historial por matrícula</h3>
            <p className="text-sm text-[#9AA8B6] leading-relaxed">
              Guardamos el registro completo de cada visita con fecha, kilometraje y piezas empleadas. Así siempre sabes qué se le hizo y cuándo le toca el próximo servicio.
            </p>
          </div>

          <div className="p-8 rounded-[32px] glass-panel border border-white/10 glass-panel-hover space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F21616]/15 text-[#F21616] border border-[#F21616]/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#F4F7F8]">Presupuesto previo sin sorpresas</h3>
            <p className="text-sm text-[#9AA8B6] leading-relaxed">
              Te informamos con antelación de cada coste. Si durante la intervención observamos otra pieza que requiera atención, te avisamos para que decidas libremente.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog of Services in Argentine Pesos ($ ARS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="servicios-catalogo">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00CCF2]/10 border border-[#00CCF2]/30 text-xs font-mono font-bold text-[#00CCF2] mb-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>CATÁLOGO OFICIAL EN PESOS ARGENTINOS ($ ARS)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight mt-1">
              Servicios Técnicos & Mantenimiento Especializado
            </h2>
          </div>
          <p className="text-sm text-[#9AA8B6] max-w-md">
            Tarifas transparentes expresadas en pesos argentinos ($). Atención profesional con diagnóstico previo y repuestos de máxima fiabilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(catalogServices.length > 0 ? catalogServices : defaultFeaturedServices).map((svc: any, idx) => {
            const isCatalogItem = 'basePrice' in svc;
            const title = isCatalogItem ? svc.name : svc.title;
            const desc = isCatalogItem ? svc.description : svc.desc;
            const tag = isCatalogItem ? svc.category?.toUpperCase() || 'MECÁNICA' : svc.tag;
            const priceFormatted = isCatalogItem
              ? formatARS(svc.basePrice)
              : '$ 95.000';
            const duration = isCatalogItem ? `${svc.durationMinutes} min` : '45-90 min';
            const interval = isCatalogItem && svc.recommendedIntervalKm
              ? `${svc.recommendedIntervalKm.toLocaleString('es-AR')} km`
              : 'Revisión periódica';

            const whatsappServiceUrl = WHATSAPP_CONFIG.createCustomUrl(
              `Hola V-LA, quiero solicitar un turno para "${title}" (${priceFormatted}), que disponibilidad tienen?`,
            );

            return (
              <div
                key={isCatalogItem ? svc.id : idx}
                className="p-7 rounded-[28px] glass-panel border border-white/10 glass-panel-hover flex flex-col justify-between space-y-5 group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border border-[#00CCF2]/40 text-[#00CCF2] bg-[#00CCF2]/10">
                      {tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#9AA8B6]">
                      <Clock className="w-3.5 h-3.5 text-[#F27D16]" />
                      <span>{duration}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#F4F7F8] leading-snug group-hover:text-[#00CCF2] transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-[#9AA8B6] leading-relaxed mt-1.5 line-clamp-3">
                      {desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-[#9AA8B6] font-medium">
                      Intervalo: <strong className="text-[#F4F7F8]">{interval}</strong>
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] text-[#28C98B] font-mono block">PRECIO FINAL</span>
                      <span className="text-xl font-black font-mono text-[#28C98B]">
                        {priceFormatted}
                      </span>
                    </div>
                  </div>

                  <a
                    href={whatsappServiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0D0D0D] border border-[#25D366]/30 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-[0_0_15px_rgba(37,211,102,0.25)]"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Sacar Turno por WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WORKSHOP LOCATION & GOOGLE MAPS SECTION (Dynamic based on Admin choice) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="workshop-location-section">
        <div className="rounded-[36px] glass-panel border border-white/10 p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
          {/* Ambient Corner Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CCF2]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F27D16]/10 rounded-full blur-3xl pointer-events-none" />

          {isAddressPublished ? (
            /* PUBLISHED LOCATION STATE */
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00CCF2]/10 border border-[#00CCF2]/30 text-xs font-mono font-bold text-[#00CCF2]">
                  <MapPin className="w-3.5 h-3.5 text-[#00CCF2]" />
                  <span>UBICACIÓN OFICIAL DEL TALLER</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
                  Visítanos en {workshop.name || 'V-LA Taller Mecánico'}
                </h2>

                <p className="text-sm text-[#9AA8B6] leading-relaxed max-w-xl">
                  Instalaciones preparadas para el mantenimiento integral de turismos y furgonetas: elevadores, máquina de diagnosis multimarca, estación de carga de aire acondicionado y recepción directa por matrícula.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-[#131416] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00CCF2] font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Dirección Física
                    </span>
                    <p className="text-xs font-bold text-[#F4F7F8]">
                      {workshop.address || 'V-LA Taller Mecánico, Córdoba, Argentina'}
                    </p>
                    <p className="text-[11px] text-[#9AA8B6]">
                      Enlace oficial conectado con Google Maps
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#131416] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#F27D16] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Horario de Atención
                    </span>
                    <p className="text-xs font-bold text-[#F4F7F8]">
                      Lunes a Viernes: 08:00 - 19:00
                    </p>
                    <p className="text-[11px] text-[#9AA8B6]">
                      Sábados con turno previo: 08:30 - 13:30
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-4">
                  <a
                    href={workshop.googleMapsUrl || OFFICIAL_WORKSHOP_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#00CCF2] to-[#0099B8] text-[#0D0D0D] text-xs font-black flex items-center gap-2.5 shadow-[0_0_24px_rgba(0,204,242,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#0D0D0D]" />
                    <span>Abrir en Google Maps / Cómo llegar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={WHATSAPP_CONFIG.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#25D366] hover:text-[#0D0D0D] border border-[#25D366]/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Embedded Google Maps Viewport */}
              <div className="lg:col-span-5">
                <div className="rounded-[28px] overflow-hidden border border-[#00CCF2]/30 shadow-2xl bg-[#131416] relative group">
                  <div className="h-72 sm:h-80 w-full relative">
                    <iframe
                      title="Ubicación V-LA Taller Mecánico en Google Maps"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        workshop.address || 'V-LA Taller Mecánico, Córdoba, Argentina',
                      )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      className="w-full h-full"
                    />
                  </div>

                  <div className="p-3 bg-[#131416]/95 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-[#9AA8B6] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#28C98B] animate-pulse" />
                      Navegación GPS disponible
                    </span>
                    <a
                      href={workshop.googleMapsUrl || OFFICIAL_WORKSHOP_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#00CCF2] hover:underline flex items-center gap-1"
                    >
                      <span>Abrir pantalla completa</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* PRIVATE / RESERVED LOCATION STATE (When Admin chooses not to publish) */
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F27D16]/15 border border-[#F27D16]/30 text-xs font-mono font-bold text-[#F27D16]">
                  <Lock className="w-3.5 h-3.5 text-[#F27D16]" />
                  <span>UBICACIÓN PRIVADA / EXCLUSIVA CON TURNO</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
                  Atención Técnica con Turno Confirmado
                </h2>

                <p className="text-sm text-[#9AA8B6] leading-relaxed max-w-xl">
                  Para garantizar la organización del taller, evitar esperas y proteger las instalaciones, la dirección física exacta y el enlace directo de Google Maps se coordinan de forma confidencial vía WhatsApp al momento de confirmar tu turno.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl bg-[#131416] border border-[#F27D16]/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#F27D16] font-bold flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" />
                      Dirección Física
                    </span>
                    <p className="text-xs font-bold text-[#F4F7F8]">
                      Se coordina por WhatsApp
                    </p>
                    <p className="text-[11px] text-[#9AA8B6]">
                      Envío de ubicación GPS con turno confirmado
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#131416] border border-white/[0.08] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#00CCF2] font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Horario de Recepción
                    </span>
                    <p className="text-xs font-bold text-[#F4F7F8]">
                      Lunes a Viernes: 08:00 - 19:00
                    </p>
                    <p className="text-[11px] text-[#9AA8B6]">
                      Sábados con turno previo: 08:30 - 13:30
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-4">
                  <a
                    href={WHATSAPP_CONFIG.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] text-xs font-black flex items-center gap-2.5 shadow-[0_0_24px_rgba(37,211,102,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Pedir Turno & Ubicación por WhatsApp</span>
                  </a>

                  <button
                    onClick={onEnterApp}
                    className="px-6 py-3.5 rounded-2xl bg-[#1A1C20] hover:bg-[#22252B] border border-white/10 text-xs font-bold text-[#F4F7F8] flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Ingreso de Administración</span>
                  </button>
                </div>
              </div>

              {/* Private Location Showcase Card */}
              <div className="lg:col-span-5">
                <div className="p-8 rounded-[28px] glass-panel border border-[#F27D16]/30 bg-[#131416]/95 text-center space-y-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#F27D16]/15 text-[#F27D16] border border-[#F27D16]/30 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#F4F7F8]">
                      Dirección Reservada por Seguridad
                    </h3>
                    <p className="text-xs text-[#9AA8B6] mt-2 leading-relaxed">
                      El administrador ha configurado la ubicación en modo privado. Solo los clientes con turno asignado reciben la dirección y coordenadas exactas.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-left space-y-1.5">
                    <div className="flex items-center gap-2 text-[#28C98B] font-bold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Atención sin demoras ni filas</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#00CCF2] font-bold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Espacio reservado para tu vehículo</span>
                    </div>
                  </div>

                  <a
                    href={WHATSAPP_CONFIG.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] text-xs font-black flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Contactar por WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Floating CTA Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="rounded-[36px] glass-panel border border-[#00CCF2]/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CCF2]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F21616]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F4F7F8] tracking-tight">
              ¿Tu vehículo necesita revisión o mantenimiento?
            </h2>
            <p className="text-sm text-[#9AA8B6] leading-relaxed">
              Consúltanos por WhatsApp con tu matrícula y te facilitaremos los intervalos recomendados y presupuesto previo sin compromiso.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <a
                id="btn-banner-whatsapp-cta"
                href={WHATSAPP_CONFIG.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,211,102,0.35)] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>SOLICITAR TURNO POR WHATSAPP</span>
              </a>
              {isAddressPublished ? (
                <a
                  href={workshop.googleMapsUrl || OFFICIAL_WORKSHOP_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-[#00CCF2] to-[#0099B8] text-[#0D0D0D] text-xs font-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,204,242,0.35)] cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#0D0D0D]" />
                  <span>VER MAPS</span>
                </a>
              ) : (
                <a
                  href="#workshop-location-section"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#1A1C20] hover:bg-[#22252B] border border-white/10 text-xs font-bold text-[#F4F7F8] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#F27D16]" />
                  <span>UBICACIÓN (PRIVADA)</span>
                </a>
              )}
              <button
                onClick={onEnterApp}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl glass-pill hover:bg-white/10 text-xs font-bold text-[#F4F7F8] cursor-pointer"
              >
                Consola Interna
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
