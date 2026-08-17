import { jsPDF } from 'jspdf';
import { QuoteResult, EventRecord, Branch, EventProcedure } from '../types';

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

export function generateProcedureProtocolPDF(
  procedures: EventProcedure[],
  eventType: string = 'General',
  eventTitle?: string
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const marginX = 12;
  const contentWidth = pageWidth - marginX * 2; // 273mm

  // Colors
  const primaryColor = [15, 23, 42]; // Slate 900
  const accentColor = [147, 51, 234]; // Purple 600
  const zebraColor = [248, 250, 252]; // Slate 50
  const borderColor = [226, 232, 240]; // Slate 200

  // Calculate totals
  const totalMinutes = procedures.reduce((acc, p) => acc + (p.durationMinutes || 15), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalDurationStr = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ''}` : `${mins} min`;

  const drawHeader = (pageNum: number) => {
    // Header banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 28, 'F');

    // Accent line
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 27, pageWidth, 1.5, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('AURA SOUND & EVENTOS — PROTOCOLO Y CRONOGRAMA OPERATIVO', marginX, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(
      `Tipo de Evento: ${eventType.toUpperCase()}${eventTitle ? ` | Evento: ${eventTitle}` : ''} | Generado: ${new Date().toLocaleDateString('es-AR')} ${new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`,
      marginX,
      19
    );

    // Right header stats
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(243, 232, 255);
    doc.text(`Total Momentos: ${procedures.length} | Duración Est.: ${totalDurationStr}`, pageWidth - marginX - 85, 12);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(192, 132, 252);
    doc.text('Hoja de Ruta para DJ, Animación y Técnica', pageWidth - marginX - 85, 19);
  };

  const drawTableHeader = (startY: number) => {
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(marginX, startY, contentWidth, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    doc.text('N°', marginX + 3, startY + 5.5);
    doc.text('HORARIO / DUR.', marginX + 13, startY + 5.5);
    doc.text('MOMENTO / ETAPA', marginX + 44, startY + 5.5);
    doc.text('MÚSICA SUGERIDA / ESTILO', marginX + 110, startY + 5.5);
    doc.text('INDICACIONES DJ / ANIMADOR', marginX + 172, startY + 5.5);
    doc.text('EQUIPAMIENTO & FX', marginX + 232, startY + 5.5);
  };

  const drawFooter = (currentPage: number, totalPages: number) => {
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.line(marginX, pageHeight - 12, pageWidth - marginX, pageHeight - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('AURA Sound & Eventos • www.aurasound.com.ar • Coordinación Técnica y Producción', marginX, pageHeight - 7);
    doc.text(`Página ${currentPage} de ${totalPages}`, pageWidth - marginX - 25, pageHeight - 7);
  };

  // Render first page header
  drawHeader(1);

  let currentY = 34;
  drawTableHeader(currentY);
  currentY += 8;

  const colWidths = {
    num: 10,
    time: 30,
    title: 65,
    music: 60,
    desc: 58,
    equip: 50
  };

  procedures.forEach((proc, index) => {
    // Split texts to fit column widths
    const timeText = `${proc.estimatedTime || 'N/A'}\n(${proc.durationMinutes || 15} min)`;
    const titleText = `${proc.title}\n[${proc.category}]`;
    const musicText = proc.suggestedMusic || 'Libre elección del DJ';
    const descText = proc.description || 'Sin indicaciones especiales.';
    const equipText = proc.requiredEquipment || 'Estándar';

    const titleLines = doc.splitTextToSize(titleText, colWidths.title - 4);
    const musicLines = doc.splitTextToSize(musicText, colWidths.music - 4);
    const descLines = doc.splitTextToSize(descText, colWidths.desc - 4);
    const equipLines = doc.splitTextToSize(equipText, colWidths.equip - 4);

    const maxLines = Math.max(2, titleLines.length, musicLines.length, descLines.length, equipLines.length);
    const rowHeight = Math.max(12, maxLines * 4.2 + 3);

    // Check page overflow
    if (currentY + rowHeight > pageHeight - 16) {
      doc.addPage();
      drawHeader(doc.getNumberOfPages());
      currentY = 34;
      drawTableHeader(currentY);
      currentY += 8;
    }

    // Zebra background
    if (index % 2 === 1) {
      doc.setFillColor(zebraColor[0], zebraColor[1], zebraColor[2]);
      doc.rect(marginX, currentY, contentWidth, rowHeight, 'F');
    }

    // Bottom row border
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.line(marginX, currentY + rowHeight, marginX + contentWidth, currentY + rowHeight);

    // Column 1: Order Number
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(109, 40, 217); // Purple
    doc.text(`#${index + 1}`, marginX + 3, currentY + 5.5);

    // Column 2: Horario y Duración
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(180, 83, 9); // Amber
    doc.text(proc.estimatedTime || 'A confirmar', marginX + 13, currentY + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${proc.durationMinutes || 15} min`, marginX + 13, currentY + 9);

    // Column 3: Titulo y Categoría
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(titleLines[0] || '', marginX + 44, currentY + 5);
    if (titleLines.length > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      for (let i = 1; i < titleLines.length; i++) {
        doc.text(titleLines[i], marginX + 44, currentY + 5 + i * 3.8);
      }
    }

    // Column 4: Música sugerida
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);
    doc.text(musicLines, marginX + 110, currentY + 5);

    // Column 5: Indicaciones
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(descLines, marginX + 172, currentY + 5);

    // Column 6: Equipamiento
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(equipLines, marginX + 232, currentY + 5);

    currentY += rowHeight;
  });

  // Stamp all page footers
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(i, totalPages);
  }

  const safeFileName = `Protocolo_${eventType.replace(/[\s\/\\]+/g, '_')}_AURA_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(safeFileName);
}

