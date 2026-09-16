import React, { useState } from 'react';
import { MessageCircle, X, Send, Clock, Calendar, Check, ExternalLink } from 'lucide-react';
import { WHATSAPP_CONFIG } from '../utils/whatsapp';

export const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissedTooltip, setHasDismissedTooltip] = useState(false);

  const handleOpenWhatsApp = () => {
    WHATSAPP_CONFIG.openChat();
  };

  return (
    <aside
      aria-label="Atención por WhatsApp"
      className="fixed bottom-24 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end print:hidden select-none"
    >
      {/* Expanded Popover Card */}
      {isOpen && (
        <div
          id="whatsapp-chat-popover"
          className="mb-3 w-[330px] sm:w-[360px] rounded-3xl bg-[#131416]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold shadow-inner">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight leading-tight">V-LA Taller Mecánico</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-white/90">
                  <span className="w-2 h-2 rounded-full bg-[#A3FFD6] animate-pulse" />
                  <span>En línea | Solicitud de Turnos</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors"
              aria-label="Cerrar ventana WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body Mockup */}
          <div className="p-4 space-y-3 bg-[#0D0D0D]/60 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="p-3 rounded-2xl rounded-tl-none bg-[#1A1C20] border border-white/[0.08] text-[#F4F7F8] space-y-1.5 max-w-[90%] shadow-sm">
                <p className="font-semibold text-[#25D366] flex items-center gap-1">
                  <span>Recepción V-LA</span>
                  <Check className="w-3 h-3 text-[#25D366]" />
                </p>
                <p className="text-[#9AA8B6] leading-relaxed">
                  ¡Hola! ¿Necesitas un turno para tu vehículo o consultar presupuesto de mantenimiento?
                </p>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-[#9AA8B6]">
                  <Clock className="w-3 h-3" />
                  <span>Lun a Vie 08:00 - 19:00</span>
                </div>
              </div>
            </div>

            {/* Pre-configured User Message Bubble */}
            <div className="flex items-end justify-end">
              <div className="p-3 rounded-2xl rounded-tr-none bg-[#25D366]/15 border border-[#25D366]/40 text-[#F4F7F8] space-y-1 max-w-[90%] shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#25D366] tracking-wider block">
                  Mensaje listo para enviar:
                </span>
                <p className="text-[12px] font-medium leading-relaxed italic text-white">
                  &ldquo;{WHATSAPP_CONFIG.defaultMessage}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-3.5 bg-[#17191D] border-t border-white/[0.08] space-y-2">
            <a
              id="btn-whatsapp-open-chat"
              href={WHATSAPP_CONFIG.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] font-black text-xs flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(37,211,102,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Solicitar Turno por WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75 ml-0.5" />
            </a>
            <div className="flex items-center justify-between text-[10px] text-[#9AA8B6] px-1">
              <span>WhatsApp Oficial: <strong>{WHATSAPP_CONFIG.displayPhone}</strong></span>
              <span className="text-[#25D366] font-medium">Respuesta Rápida</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Tooltip & Main Globito Button */}
      <div className="flex items-center gap-2.5">
        {/* Tooltip Pill */}
        {!isOpen && !hasDismissedTooltip && (
          <div
            id="whatsapp-bubble-hint"
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#131416]/95 backdrop-blur-xl border border-[#25D366]/40 text-xs font-semibold text-[#F4F7F8] shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-[#25D366] transition-all animate-in fade-in slide-in-from-right-3 duration-300"
            onClick={() => setIsOpen(true)}
          >
            <Calendar className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="group-hover:text-[#25D366] transition-colors">
              ¿Querés sacar turno? Escribinos
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHasDismissedTooltip(true);
              }}
              className="ml-1 text-[#9AA8B6] hover:text-white p-0.5"
              aria-label="Cerrar aviso"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Primary Circular WhatsApp Button (Globito) */}
        <button
          id="btn-floating-whatsapp"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0D0D0D] flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 group"
          title="Sacar turno por WhatsApp (543512422637)"
          aria-label="Abrir WhatsApp para solicitar turno"
        >
          {/* Pulsating Wave Effect */}
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping pointer-events-none group-hover:opacity-60" />

          {/* Icon */}
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white drop-shadow-sm relative z-10 transition-transform group-hover:rotate-6" />

          {/* Unread Alert Ping Dot */}
          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#F21616] border-2 border-[#131416] z-20" />
        </button>
      </div>
    </aside>
  );
};
