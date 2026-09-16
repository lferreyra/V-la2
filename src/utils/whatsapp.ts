/**
 * WhatsApp Integration Utilities & Constants
 * Oficial V-LA Taller Mecánico Appointment Booking
 */

export const WHATSAPP_CONFIG = {
  phone: '543512422637',
  displayPhone: '+54 351 242-2637',
  defaultMessage: 'Hola V-LA, quiero solicitar un turno, que disponibilidad tienen?',
  get bookingUrl(): string {
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(this.defaultMessage)}`;
  },
  createCustomUrl(customMessage?: string): string {
    const text = customMessage || this.defaultMessage;
    return `https://wa.me/${this.phone}?text=${encodeURIComponent(text)}`;
  },
  openChat(customMessage?: string): void {
    const url = this.createCustomUrl(customMessage);
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  },
};
