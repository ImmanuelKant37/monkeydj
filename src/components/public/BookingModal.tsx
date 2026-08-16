import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  X,
  Lock,
  Send,
  FileCheck
} from 'lucide-react';

import {
  QuoteResult,
  Branch,
  BookingRequest,
  EventType
} from '../../types';

import { AppStorage } from '../../services/storage';

interface BookingModalProps {
  quote?: QuoteResult | null;
  branches?: Branch[];
  onClose?: () => void;
  onBookingSubmitted?: (booking: BookingRequest) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  quote,
  branches = [],
  onClose = () => {},
  onBookingSubmitted = (_booking: BookingRequest) => {}
}) => {
  const allBranches = branches.length > 0 ? branches : AppStorage.getBranches();
  const [branchId, setBranchId] = useState<string>(
    quote?.input.branchId || allBranches[0]?.id || ''
  );
  const [eventType, setEventType] = useState<EventType>(
    quote?.input.eventType || 'Casamiento'
  );
  const [eventDate, setEventDate] = useState<string>(
    quote?.input.eventDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState<string>(quote?.input.startTime || '21:00');
  const [durationHours, setDurationHours] = useState<number>(
    quote?.input.durationHours || 8
  );
  const [guestCount, setGuestCount] = useState<number>(quote?.input.guestCount || 150);

  // Venue & Customer Details
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [venueName, setVenueName] = useState<string>('');
  const [venueAddress, setVenueAddress] = useState<string>('');
  const [city, setCity] = useState<string>(quote?.input.city || 'Buenos Aires');
  const [notes, setNotes] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [availabilityResult, setAvailabilityResult] = useState<{
    checked: boolean;
    available: boolean;
    conflictReason?: string;
  }>({ checked: false, available: true });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const checkDateAvailability = (dateToTest: string, bId: string) => {
    const res = AppStorage.checkAvailability(dateToTest, bId);
    setAvailabilityResult({
      checked: true,
      available: res.available,
      conflictReason: res.conflictReason
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) return;

    // Final availability validation
    const res = AppStorage.checkAvailability(eventDate, branchId);
    if (!res.available) {
      setAvailabilityResult({ checked: true, available: false, conflictReason: res.conflictReason });
      return;
    }

    setSubmitting(true);

    const bookingNumber = `RES-2026-${Math.floor(100 + Math.random() * 900)}`;
    const totalAmount = quote ? quote.total : 450000;
    const deposit = quote ? quote.suggestedDeposit : 135000;

    const newBooking: BookingRequest = {
      id: `bk-${Date.now()}`,
      bookingNumber,
      quoteId: quote?.id,
      customerId: `c-${Date.now()}`,
      customerName: `${firstName} ${lastName}`,
      customerEmail: email,
      customerPhone: phone,
      customerWhatsApp: whatsapp || phone,
      eventType,
      eventDate,
      startTime,
      durationHours,
      branchId,
      venueName: venueName || 'A definir',
      venueAddress: venueAddress || 'A definir',
      city,
      guestCount,
      status: 'Pendiente',
      totalAmount,
      depositPaid: 0,
      pendingBalance: totalAmount,
      termsAccepted,
      notes,
      createdAt: new Date().toISOString()
    };

    // Save in storage
    const bookings = AppStorage.getBookings();
    bookings.unshift(newBooking);
    AppStorage.saveBookings(bookings);

    // Add audit log
    AppStorage.addAuditLog(
      'Cliente',
      'Nueva Solicitud de Reserva',
      `Reserva N° ${bookingNumber} para ${firstName} ${lastName} (${eventDate})`
    );

    // Send admin notification
    const config = AppStorage.getNotificationConfig();
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: config.adminEmails,
          subject: `🚨 NUEVA RESERVA PENDIENTE: ${bookingNumber} - ${firstName} ${lastName}`,
          type: 'new_booking',
          payload: newBooking
        })
      });
    } catch (err) {
      console.error(err);
    }

    setSubmitting(false);
    setSubmitted(true);
    onBookingSubmitted(newBooking);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5 text-pink-400" />
                <span>Solicitud de Reserva Oficial</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold">
                RESERVAR FECHA DE EVENTO
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Completa tus datos para bloquear la disponibilidad en nuestro calendario operativo.
              </p>
            </div>

            {/* Quote Summary Badge if attached */}
            {quote && (
              <div className="bg-purple-950/60 p-4 rounded-2xl border border-purple-800/60 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">Presupuesto Asociado N° {quote.quoteNumber}</p>
                  <p className="text-purple-300">{quote.items.length} servicios incluidos • {quote.input.durationHours} hs</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400">Total a congelar</p>
                  <p className="text-base font-black text-amber-300">${quote.total.toLocaleString('es-AR')}</p>
                </div>
              </div>
            )}

            {/* Date & Availability Live Check */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fecha Solicitada
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    checkDateAvailability(e.target.value, branchId);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Sucursal Cobertura
                </label>
                <select
                  value={branchId}
                  onChange={(e) => {
                    setBranchId(e.target.value);
                    checkDateAvailability(eventDate, e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                >
                  {allBranches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Alert Banner */}
              {availabilityResult.checked && !availabilityResult.available && (
                <div className="sm:col-span-2 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{availabilityResult.conflictReason}</span>
                </div>
              )}
            </div>

            {/* Client Personal Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Datos del Titular de la Reserva
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre *"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Apellido *"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Correo Electrónico *"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Teléfono / WhatsApp *"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Venue Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Lugar de la Celebración (Salón / Quinta)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre del Salón o Quinta"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Ciudad / Localidad *"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Dirección del Salón"
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  className="sm:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Terms Acceptance Checkbox */}
            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 accent-purple-600 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-slate-300 leading-tight cursor-pointer">
                Acepto los términos y condiciones de contratación. Entiendo que la reserva quedará en estado <span className="text-amber-400 font-bold">Pendiente</span> hasta la confirmación de la seña por parte del equipo administrativo.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !termsAccepted || (availabilityResult.checked && !availabilityResult.available)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>ENVIAR SOLICITUD DE RESERVA AHORA</span>
            </button>
          </form>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">
              ¡SOLICITUD REGISTRADA EXITOSAMENTE!
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Hemos enviado una notificación a nuestros coordinadores. Te contactaremos por WhatsApp al <span className="text-emerald-400 font-bold">{whatsapp}</span> para confirmar los datos del contrato.
            </p>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Volver al Sitio Web
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
