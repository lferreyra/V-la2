import jsPDF from 'jspdf';
import { Client, ServiceOrder, Vehicle } from '../types';

function formatDate(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return `${d.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })} ${d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
  } catch {
    return isoString;
  }
}

/**
 * Genera y descarga el informe técnico en PDF de una orden de servicio individual
 */
export function downloadOrderPdf(
  order: ServiceOrder,
  vehicle: Vehicle,
  client: Client,
  workshopName: string = 'V-LA Taller Mecánico',
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner
  doc.setFillColor(13, 13, 13);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line
  doc.setFillColor(0, 204, 242); // #00CCF2
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(244, 247, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(workshopName.toUpperCase(), 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(154, 168, 182);
  doc.text('REGISTRO TÉCNICO DE SERVICIO Y MANTENIMIENTO AUTOMOTRIZ', 14, 21);

  // Order Reference Badge on Header Right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 204, 242);
  doc.text(`ORDEN: ${order.orderNumber}`, pageWidth - 14, 13, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(200, 210, 220);
  doc.text(`Fecha: ${formatDate(order.entryDate)}`, pageWidth - 14, 20, { align: 'right' });

  y = 36;

  // Section: Vehicle & Client Data (2 Columns)
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(12, y, pageWidth - 24, 34, 3, 3, 'F');
  doc.setDrawColor(220, 226, 235);
  doc.roundedRect(12, y, pageWidth - 24, 34, 3, 3, 'S');

  // Column 1: Vehicle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('DATOS DEL VEHÍCULO', 16, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  // License plate highlight
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 204);
  doc.text(`Patente: ${order.licensePlate}`, 16, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Vehículo: ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`.trim(), 16, y + 19);
  doc.text(`Año: ${vehicle.year || '-'}   |   VIN / Chasis: ${vehicle.vin || '-'}`, 16, y + 25);
  doc.text(`Odómetro de Entrada: ${order.entryMileage.toLocaleString('es-AR')} km${order.exitMileage ? ` | Salida: ${order.exitMileage.toLocaleString('es-AR')} km` : ''}`, 16, y + 31);

  // Column 2: Client
  const col2X = pageWidth / 2 + 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('DATOS DEL TITULAR / CLIENTE', col2X, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Nombre: ${client.fullName}`, col2X, y + 13);
  doc.text(`WhatsApp / Teléfono: ${client.phoneWhatsApp}`, col2X, y + 19);
  doc.text(`Email: ${client.email || 'No especificado'}`, col2X, y + 25);
  doc.text(`Estado de Orden: ${order.status.toUpperCase()}`, col2X, y + 31);

  y += 40;

  // Motivo de Visita
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. MOTIVO DE VISITA / DIAGNÓSTICO INICIAL', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const visitLines = doc.splitTextToSize(order.visitReason || 'Sin motivo especificado.', pageWidth - 28);
  doc.text(visitLines, 14, y);
  y += visitLines.length * 4.2 + 4;

  // Servicio de Aceite y Filtros
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SERVICIO DE LUBRICACIÓN Y FILTRACIÓN', 14, y);
  y += 4.5;

  doc.setFillColor(250, 250, 252);
  doc.roundedRect(12, y, pageWidth - 24, 24, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, y, pageWidth - 24, 24, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Aceite de Motor:', 16, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  if (order.oil.done === 'si') {
    doc.text(`Realizado - ${order.oil.brand || 'Marca taller'} | Viscosidad: ${order.oil.viscosity || '-'} | Norma: ${order.oil.specification || '-'}`, 44, y + 5.5);
  } else if (order.oil.done === 'no') {
    doc.text('No requerido en este servicio', 44, y + 5.5);
  } else {
    doc.text('No informado', 44, y + 5.5);
  }

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Filtros:', 16, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  if (order.filters.done === 'si' && order.filters.items.length > 0) {
    const filterText = order.filters.items.map((f) => `${f.type} (${f.brand || 'Homologado'})`).join(', ');
    const fLines = doc.splitTextToSize(filterText, pageWidth - 55);
    doc.text(fLines, 44, y + 12);
  } else if (order.filters.done === 'no') {
    doc.text('No se reemplazaron filtros en este servicio', 44, y + 12);
  } else {
    doc.text('No informado', 44, y + 12);
  }

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Personal:', 16, y + 19);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`Mecánico: ${order.assignedTechnicianName || 'Taller Central'}   |   Recepción: ${order.advisorName || 'Asesoría V-LA'}`, 44, y + 19);

  y += 30;

  // Trabajo Mecánico Realizado
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DESCRIPCIÓN DEL TRABAJO MECÁNICO REALIZADO', 14, y);
  y += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const workLines = doc.splitTextToSize(order.mechanicalWork.description || 'Sin descripción.', pageWidth - 28);
  doc.text(workLines, 14, y);
  y += workLines.length * 4.2 + 4;

  // Repuestos y Piezas Sustituidas (Detalle Técnico)
  if (order.mechanicalWork.partsReplacedNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('4. DETALLE DE REPUESTOS Y PIEZAS SUSTITUIDAS', 14, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const partsLines = doc.splitTextToSize(order.mechanicalWork.partsReplacedNotes, pageWidth - 28);
    doc.text(partsLines, 14, y);
    y += partsLines.length * 4.2 + 4;
  }

  // Observaciones Técnicas
  if (order.mechanicalWork.technicalObservations) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text('5. OBSERVACIONES TÉCNICAS DEL TALLER', 14, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const obsLines = doc.splitTextToSize(order.mechanicalWork.technicalObservations, pageWidth - 28);
    doc.text(obsLines, 14, y);
    y += obsLines.length * 4.2 + 4;
  }

  // Recomendaciones Futuras
  if (order.mechanicalWork.futureRecommendations) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 83, 9); // Amber / orange alert
    doc.text('RECOMENDACIONES PARA EL PRÓXIMO SERVICIO', 14, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const recLines = doc.splitTextToSize(order.mechanicalWork.futureRecommendations, pageWidth - 28);
    doc.text(recLines, 14, y);
    y += recLines.length * 4.2 + 6;
  }

  // Footer Signature & Guarantee Area
  const footerY = 272;
  doc.setDrawColor(220, 226, 235);
  doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Documento emitido por ${workshopName} · Registro digital conforme a la orden ${order.orderNumber} para la patente argentina ${order.licensePlate}.`,
    14,
    footerY,
  );
  doc.text(
    `Generado: ${formatDateTime(new Date().toISOString())} · Documento válido como constancia de mantenimiento para el cliente.`,
    14,
    footerY + 4,
  );

  // Save the PDF file
  const fileName = `Informe_${order.licensePlate}_${order.orderNumber}.pdf`;
  doc.save(fileName);
}

/**
 * Genera y descarga el informe del historial completo del vehículo en formato PDF
 */
export function downloadVehicleHistoryPdf(
  vehicle: Vehicle,
  client: Client,
  orders: ServiceOrder[],
  workshopName: string = 'V-LA Taller Mecánico',
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 18;

  const drawHeader = () => {
    doc.setFillColor(13, 13, 13);
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setFillColor(0, 204, 242);
    doc.rect(0, 26, pageWidth, 2, 'F');

    doc.setTextColor(244, 247, 248);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(workshopName.toUpperCase(), 14, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(154, 168, 182);
    doc.text('HISTORIAL TÉCNICO COMPLETO DEL VEHÍCULO POR PATENTE', 14, 19);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(0, 204, 242);
    doc.text(`PATENTE: ${vehicle.licensePlate}`, pageWidth - 14, 13, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(200, 210, 220);
    doc.text(`${orders.length} Intervenciones Registradas`, pageWidth - 14, 19, { align: 'right' });
  };

  drawHeader();
  y = 34;

  // Vehicle & Owner Card
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(12, y, pageWidth - 24, 28, 3, 3, 'F');
  doc.setDrawColor(220, 226, 235);
  doc.roundedRect(12, y, pageWidth - 24, 28, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Vehículo: ${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`.trim(), 16, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Año: ${vehicle.year || '-'}   |   VIN: ${vehicle.vin || '-'}   |   Último Odómetro: ${vehicle.currentMileage.toLocaleString('es-AR')} km`, 16, y + 13);
  doc.text(`Titular Registrado: ${client.fullName}   |   Contacto WhatsApp: ${client.phoneWhatsApp}`, 16, y + 19.5);
  doc.text(`Última Visita al Taller: ${formatDate(vehicle.lastVisitDate)}`, 16, y + 25);

  y += 34;

  // Orders list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CRONOLOGÍA DE SERVICIOS Y MANTENIMIENTO REALIZADOS', 14, y);
  y += 6;

  orders.forEach((ord, index) => {
    // Check if we need a new page
    if (y > pageHeight - 55) {
      doc.addPage();
      drawHeader();
      y = 34;
    }

    doc.setFillColor(index % 2 === 0 ? 255 : 250, 251, 253);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(12, y, pageWidth - 24, 8, 2, 2, 'FD');

    // Title row of order
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(0, 102, 204);
    doc.text(`N° ${ord.orderNumber}  (${formatDate(ord.entryDate)})`, 16, y + 5.5);

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`Km: ${ord.entryMileage.toLocaleString('es-AR')}   |   Estado: ${ord.status.toUpperCase()}`, 75, y + 5.5);

    doc.text(`Mecánico: ${ord.assignedTechnicianName || 'Taller'}`, pageWidth - 16, y + 5.5, { align: 'right' });

    y += 11;

    // Motivo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Motivo:', 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const mLines = doc.splitTextToSize(ord.visitReason, pageWidth - 45);
    doc.text(mLines, 32, y);
    y += mLines.length * 3.8 + 2;

    // Trabajo
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Trabajo:', 16, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const wLines = doc.splitTextToSize(ord.mechanicalWork.description, pageWidth - 45);
    doc.text(wLines, 32, y);
    y += wLines.length * 3.8 + 2;

    // Repuestos
    if (ord.mechanicalWork.partsReplacedNotes) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Repuestos:', 16, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const pLines = doc.splitTextToSize(ord.mechanicalWork.partsReplacedNotes, pageWidth - 45);
      doc.text(pLines, 32, y);
      y += pLines.length * 3.8 + 2;
    }

    // Aceite y Filtros
    if (ord.oil.done === 'si' || (ord.filters.done === 'si' && ord.filters.items.length > 0)) {
      const partsArr: string[] = [];
      if (ord.oil.done === 'si') partsArr.push(`Aceite ${ord.oil.viscosity || ''} ${ord.oil.brand || ''}`);
      if (ord.filters.done === 'si') {
        partsArr.push(`Filtros: ${ord.filters.items.map((f) => f.type).join(', ')}`);
      }
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Insumos:', 16, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(partsArr.join(' | '), 32, y);
      y += 5;
    }

    // Future recommendations if any
    if (ord.mechanicalWork.futureRecommendations) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(180, 83, 9);
      doc.text('Aviso futuro:', 16, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      const rLines = doc.splitTextToSize(ord.mechanicalWork.futureRecommendations, pageWidth - 45);
      doc.text(rLines, 36, y);
      y += rLines.length * 3.8 + 2;
    }

    y += 5; // spacing between orders
  });

  // Footer on final page
  const footerY = pageHeight - 12;
  doc.setDrawColor(220, 226, 235);
  doc.line(14, footerY - 4, pageWidth - 14, footerY - 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Historial técnico emitido por ${workshopName} para el vehículo patente argentina ${vehicle.licensePlate}. Total de órdenes: ${orders.length}.`,
    14,
    footerY,
  );

  const fileName = `Historial_${vehicle.licensePlate}.pdf`;
  doc.save(fileName);
}
