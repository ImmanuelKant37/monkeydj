import * as XLSX from 'xlsx';
import { Customer, EventRecord, BookingRequest, QuoteResult } from '../types';

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
