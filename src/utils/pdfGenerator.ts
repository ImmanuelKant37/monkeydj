import { jsPDF } from 'jspdf';
import { QuoteResult, EventRecord, Branch } from '../types';

export function generateQuotePDF(quote: QuoteResult, branch?: Branch): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const primaryColor = [22, 27, 34]; // Dark slate
  const accentColor = [147, 51, 234]; // Purple accent
  const lightGray = [243, 244, 246];

  // Header banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 38, 'F');

  // Title & Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AURA SOUND & EVENTOS', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Servicio Profesional de DJ, Sonido, Iluminación y Animación', 14, 25);
  doc.text(`Presupuesto N°: ${quote.quoteNumber}`, 145, 18);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, 145, 25);

  // Client & Event Details Box
  let y = 46;
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.roundedRect(14, y, 182, 36, 3, 3, 'F');

  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DATOS DE LA COTIZACIÓN Y EVENTO', 20, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tipo de Evento: ${quote.input.eventType}`, 20, y + 16);
  doc.text(`Fecha del Evento: ${quote.input.eventDate}`, 20, y + 22);
  doc.text(`Ciudad / Localidad: ${quote.input.city || 'A coordinar'}`, 20, y + 28);

  doc.text(`Invitados Estimados: ${quote.input.guestCount} personas`, 110, y + 16);
  doc.text(`Duración del Servicio: ${quote.input.durationHours} Horas`, 110, y + 22);
  doc.text(`Sucursal de Cobertura: ${branch ? branch.name : 'Central'}`, 110, y + 28);

  // Equipment Specs Box
  y += 42;
  doc.setFillColor(245, 243, 255);
  doc.roundedRect(14, y, 182, 22, 3, 3, 'F');

  doc.setTextColor(109, 40, 217);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('CONFIGURACIÓN TÉCNICA SUGERIDA PARA SU EVENTO', 20, y + 7);

  doc.setTextColor(55, 65, 81);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const eq = quote.recommendedEquipment;
  doc.text(
    `Sonido: ${eq.speakersCount} Bafles RCF/JBL + ${eq.subwoofersCount} Subwoofers (${eq.totalWattage}W RMS) | Iluminación: ${eq.movingHeadsCount} Cabezas Móviles + ${eq.parLightsCount} PAR LEDs`,
    20,
    y + 14
  );

  // Items Table Header
  y += 28;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 8, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Concepto / Servicio', 18, y + 5.5);
  doc.text('Cant.', 125, y + 5.5);
  doc.text('Precio Unit.', 145, y + 5.5);
  doc.text('Subtotal', 178, y + 5.5);

  // Items rows
  y += 10;
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  quote.items.forEach((item, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    if (index % 2 === 1) {
      doc.setFillColor(249, 250, 251);
      doc.rect(14, y - 4, 182, 7, 'F');
    }

    const shortConcept = item.concept.length > 55 ? item.concept.substring(0, 52) + '...' : item.concept;
    doc.text(shortConcept, 18, y);
    doc.text(item.quantity.toString(), 127, y);
    doc.text(`$${item.unitPrice.toLocaleString('es-AR')}`, 145, y);
    doc.text(`$${item.totalPrice.toLocaleString('es-AR')}`, 178, y);

    y += 7;
  });

  // Totals Section
  y += 4;
  doc.setDrawColor(229, 231, 235);
  doc.line(14, y, 196, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  if (quote.surcharges.length > 0) {
    quote.surcharges.forEach((s) => {
      doc.text(`${s.name}:`, 110, y);
      doc.text(`+$${s.amount.toLocaleString('es-AR')}`, 178, y);
      y += 5;
    });
  }

  if (quote.discounts.length > 0) {
    doc.setTextColor(16, 185, 129);
    quote.discounts.forEach((d) => {
      doc.text(`${d.name}:`, 100, y);
      doc.text(`-$${d.amount.toLocaleString('es-AR')}`, 178, y);
      y += 5;
    });
    doc.setTextColor(31, 41, 55);
  }

  if (quote.taxAmount > 0) {
    doc.text(`Impuestos / IVA (${quote.taxPercentage}%):`, 110, y);
    doc.text(`+$${quote.taxAmount.toLocaleString('es-AR')}`, 178, y);
    y += 5;
  }

  // Grand Total Box
  y += 3;
  doc.setFillColor(147, 51, 234);
  doc.roundedRect(105, y, 91, 14, 2, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL PRESUPUESTADO:', 110, y + 9);
  doc.text(`$${quote.total.toLocaleString('es-AR')}`, 160, y + 9);

  // Deposit Info
  y += 20;
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Seña sugerida para congelar fecha (30%): $${quote.suggestedDeposit.toLocaleString('es-AR')}`, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text('Validez del presupuesto: 15 días corridos. Sujeto a disponibilidad de fecha al momento de señar.', 14, y + 6);
  doc.text('Contacto Comercial: WhatsApp +54 9 11 2345-6789 | Email: contacto@aurasound.com.ar', 14, y + 11);

  // Download PDF file
  doc.save(`Presupuesto_AURA_${quote.quoteNumber}.pdf`);
}

export function generateContractPDF(event: EventRecord, branch?: Branch): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Colors
  const darkSlate = [15, 23, 42];

  // Header
  doc.setFillColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('CONTRATO DIGITAL DE PRESTACIÓN DE SERVICIOS', 14, 16);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('AURA SOUND & EVENTOS | DJ, Sonido, Iluminación y Animación', 14, 23);
  doc.text(`Contrato N°: ${event.eventNumber}`, 145, 23);

  let y = 42;

  // Cláusulas principales
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. PARTES Y DATOS DEL EVENTO', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Cliente: ${event.customerName} (Tel: ${event.customerPhone})`, 14, y);
  doc.text(`Tipo de Evento: ${event.eventType}`, 120, y);
  y += 5;
  doc.text(`Lugar: ${event.venueName} (${event.venueAddress}, ${event.city})`, 14, y);
  doc.text(`Fecha y Horario: ${event.eventDate} de ${event.startTime} a ${event.endTime} hs`, 120, y);
  y += 5;
  doc.text(`Sucursal Proveedora: ${event.branchName || branch?.name}`, 14, y);

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. RESUMEN FINANCIERO Y FORMA DE PAGO', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Monto Total Contratado: $${event.totalPrice.toLocaleString('es-AR')}`, 14, y);
  doc.text(`Anticipo / Seña Recibida: $${event.depositPaid.toLocaleString('es-AR')}`, 100, y);
  doc.text(`Saldo Pendiente: $${(event.totalPrice - event.depositPaid).toLocaleString('es-AR')}`, 150, y);

  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('3. TÉRMINOS Y CONDICIONES GENERALES', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const clauses = [
    'a) EL PROVEEDOR se compromete a instalar el equipamiento especificado 2 horas antes del inicio fijado del evento.',
    'b) EL CLIENTE proveerá suministro eléctrico estable (220V / 50Hz) y espacio protegido de intemperie.',
    'c) La seña efectuada reserva la fecha de manera exclusiva y no es reembolsable en caso de cancelación no justificada.',
    'd) El saldo pendiente deberá ser saldado al inicio de la prestación del servicio o según acuerdo previo escrito.',
    'e) En caso de fuerza mayor o fallas fortuitas, EL PROVEEDOR responderá reemplazando equipos por equivalentes de igual calidad.'
  ];

  clauses.forEach((c) => {
    doc.text(c, 14, y);
    y += 5.5;
  });

  // Digital Signature section
  y += 10;
  doc.setFillColor(243, 244, 246);
  doc.roundedRect(14, y, 182, 45, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('4. FIRMA Y CONFORMIDAD DIGITAL', 20, y + 8);

  if (event.contractSignatureData) {
    try {
      doc.addImage(event.contractSignatureData, 'PNG', 20, y + 12, 60, 22);
    } catch (e) {
      doc.text('[Firma Digital Registrada]', 20, y + 20);
    }
  } else {
    doc.text('[Firma pendiente del cliente]', 20, y + 20);
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Firmado por: ${event.customerName}`, 110, y + 18);
  doc.text(`Fecha y Hora de Firma: ${event.contractSignedAt || 'Pendiente'}`, 110, y + 24);
  doc.text('Certificado de Autenticidad Digital AURA ID: ' + event.id, 110, y + 30);

  doc.save(`Contrato_AURA_${event.eventNumber}.pdf`);
}
