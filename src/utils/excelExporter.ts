import * as XLSX from 'xlsx';
import { Customer, EventRecord, BookingRequest, QuoteResult, EventProcedure } from '../types';

export function exportCustomersToExcel(customers: Customer[]): void {
  const data = customers.map((c) => ({
    'ID Cliente': c.id,
    'Nombre': c.firstName,
    'Apellido': c.lastName,
    'Empresa': c.company || '-',
    'Teléfono': c.phone,
    'WhatsApp': c.whatsapp,
    'Email': c.email,
    'Ciudad': c.city,
    'Estado': c.status,
    'Eventos Totales': c.totalEventsCount,
    'Monto Invertido ($)': c.totalSpent,
    'Fecha Registro': c.createdAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
  XLSX.writeFile(workbook, `Clientes_AURA_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportEventsToExcel(events: EventRecord[]): void {
  const data = events.map((e) => ({
    'N° Evento': e.eventNumber,
    'Título': e.title,
    'Tipo': e.eventType,
    'Cliente': e.customerName,
    'Sucursal': e.branchName,
    'Fecha Evento': e.eventDate,
    'Horario': `${e.startTime} - ${e.endTime}`,
    'Lugar': e.venueName,
    'Ciudad': e.city,
    'Invitados': e.guestCount,
    'Estado': e.status,
    'Monto Total ($)': e.totalPrice,
    'Seña Pagada ($)': e.depositPaid,
    'Estado Pago': e.paymentStatus,
    'Contrato Firmado': e.contractSigned ? 'SÍ' : 'NO'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Eventos');
  XLSX.writeFile(workbook, `Eventos_AURA_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportBookingsToExcel(bookings: BookingRequest[]): void {
  const data = bookings.map((b) => ({
    'N° Reserva': b.bookingNumber,
    'Cliente': b.customerName,
    'Email': b.customerEmail,
    'WhatsApp': b.customerWhatsApp,
    'Tipo Evento': b.eventType,
    'Fecha': b.eventDate,
    'Hora': b.startTime,
    'Duración (hs)': b.durationHours,
    'Ciudad': b.city,
    'Invitados': b.guestCount,
    'Monto ($)': b.totalAmount,
    'Estado': b.status,
    'Fecha Solicitud': b.createdAt
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
  XLSX.writeFile(workbook, `Reservas_AURA_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportProceduresToExcel(procedures: EventProcedure[], eventTypeFilter: string = 'General'): void {
  const data = procedures.map((p, index) => ({
    'N° Secuencia': index + 1,
    'Horario Estimado': p.estimatedTime || 'A confirmar',
    'Duración (Min)': p.durationMinutes || 15,
    'Momento / Título': p.title,
    'Etapa / Categoría': p.category,
    'Tipo de Evento': p.eventType,
    'Música Sugerida / Estilo': p.suggestedMusic || 'Libre elección DJ',
    'Indicaciones DJ / Animador': p.description || 'Sin indicaciones especiales',
    'Equipamiento / FX Requeridos': p.requiredEquipment || 'Estándar',
    'Estado': p.active !== false ? 'Activo' : 'Inactivo'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Set clean column widths
  worksheet['!cols'] = [
    { wch: 12 }, // N°
    { wch: 16 }, // Horario
    { wch: 14 }, // Duracion
    { wch: 35 }, // Titulo
    { wch: 22 }, // Categoria
    { wch: 22 }, // Tipo evento
    { wch: 35 }, // Musica
    { wch: 45 }, // Indicaciones
    { wch: 35 }, // Equipos
    { wch: 12 }  // Estado
  ];

  const workbook = XLSX.utils.book_new();
  const cleanSheetName = eventTypeFilter.substring(0, 31).replace(/[\/\\?*:[\]]/g, '');
  XLSX.utils.book_append_sheet(workbook, worksheet, cleanSheetName || 'Protocolos');

  const safeFileName = `Protocolo_${eventTypeFilter.replace(/[\s\/\\]+/g, '_')}_AURA_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, safeFileName);
}

