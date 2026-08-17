import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calculator,
  Calendar,
  Clock,
  Users,
  MapPin,
  Building2,
  CheckCircle2,
  FileText,
  Download,
  Mail,
  Send,
  Ticket,
  ChevronRight,
  Flame,
  Volume2,
  ShieldAlert,
  Zap,
  Info
} from 'lucide-react';

import {
  EventType,
  Branch,
  ServiceItem,
  Equipment,
  PricingConfig,
  QuoteCalculationInput,
  QuoteResult,
  Coupon
} from '../../types';

import { calculateQuote } from '../../utils/quoteCalculator';
import { generateQuotePDF } from '../../utils/pdfGenerator';
import { AppStorage } from '../../services/storage';

interface QuoteCalculatorProps {
  branches?: Branch[];
  services?: ServiceItem[];
  equipmentList?: Equipment[];
  pricing?: PricingConfig[];
  preselectedServiceId?: string;
  onRequestBooking?: (quote: QuoteResult) => void;
  onBookNow?: (quote: QuoteResult) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({
  branches = [],
  services = [],
  equipmentList,
  preselectedServiceId,
  onRequestBooking,
  onBookNow
}) => {
  const allBranches = branches.length > 0 ? branches : AppStorage.getBranches();
  const allServices = services.length > 0 ? services : AppStorage.getServices();
  const activeBranch = allBranches[0];
  const pricingConfig = AppStorage.getPricingConfig();
  const coupons = AppStorage.getCoupons();
  const handleBooking = onRequestBooking || onBookNow || (() => {});

  // Form State
  const [eventType, setEventType] = useState<EventType>('Casamiento');
  const [eventDate, setEventDate] = useState<string>(
    new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState<string>('21:00');
  const [durationHours, setDurationHours] = useState<number>(8);
  const [guestCount, setGuestCount] = useState<number>(150);
  const [selectedBranchId, setSelectedBranchId] = useState<string>(activeBranch?.id || '');
  const [city, setCity] = useState<string>('Buenos Aires');
  const [distanceKm, setDistanceKm] = useState<number>(20);

  // Services selection
  const [selectedServices, setSelectedServices] = useState<string[]>([
    's-dj-pro',
    's-sonido-line',
    's-luces-roboticas'
  ]);
  const [extras, setExtras] = useState<{ [serviceId: string]: number }>({
    's-humo-burbujas': 1
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [userEmailInput, setUserEmailInput] = useState<string>('');
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEmailModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Preselect incoming service if requested
  useEffect(() => {
    if (preselectedServiceId && !selectedServices.includes(preselectedServiceId)) {
      setSelectedServices((prev) => [...prev, preselectedServiceId]);
    }
  }, [preselectedServiceId]);

  // Recalculate quote automatically
  useEffect(() => {
    const input: QuoteCalculationInput = {
      eventType,
      eventDate,
      startTime,
      durationHours,
      guestCount,
      branchId: selectedBranchId || allBranches[0]?.id || '',
      city,
      distanceKm,
      selectedServices,
      selectedExtras: Object.entries(extras).map(([serviceId, quantity]) => ({
        serviceId,
        quantity: Number(quantity)
      })),
      appliedCoupon
    };

    const result = calculateQuote(input, allServices, allBranches, pricingConfig, coupons);
    setQuoteResult(result);
  }, [
    eventType,
    eventDate,
    startTime,
    durationHours,
    guestCount,
    selectedBranchId,
    city,
    distanceKm,
    selectedServices,
    extras,
    appliedCoupon
  ]);

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleApplyCoupon = () => {
    if (!appliedCoupon) return;
    const found = coupons.find(
      (c) => c.code.toUpperCase() === appliedCoupon.toUpperCase() && c.active
    );
    if (found) {
      setCouponMsg({ text: `¡Cupón válido! -${found.discountPercent}% aplicado`, ok: true });
    } else {
      setCouponMsg({ text: 'Cupón no válido o expirado', ok: false });
    }
  };

  const handleDownloadPDF = () => {
    if (!quoteResult) return;
    const branch = allBranches.find((b) => b.id === selectedBranchId) || allBranches[0];
    generateQuotePDF(quoteResult, branch);
    AppStorage.saveQuote(quoteResult);
  };

  const handleSendEmail = async () => {
    if (!userEmailInput || !quoteResult) return;

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmailInput,
          subject: `Presupuesto AURA ${quoteResult.quoteNumber} para ${eventType}`,
          type: 'quote_sent',
          payload: quoteResult
        })
      });

      setEmailSentSuccess(true);
      setTimeout(() => {
        setEmailSentSuccess(false);
        setEmailModalOpen(false);
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const eventTypesList: EventType[] = [
    'Casamiento',
    'Cumpleaños de XV',
    'Cumpleaños Adultos',
    'Fiesta Infantil',
    'Evento Empresarial',
    'Fiesta de Egreso',
    'Evento Privado',
    'Festival / Concierto',
    'Otro'
  ];

  return (
    <section id="cotizador" className="py-20 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span>Simulador de Presupuestos Transparente</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            COTIZADOR AUTOMÁTICO EN TIEMPO REAL
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Configura los datos de tu evento y obtén un desglose exacto de costos, recomendación de potencia de sonido y descarga tu presupuesto oficial en PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configurator Steps */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Event Basics */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-600/30">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Datos del Evento</h3>
                  <p className="text-xs text-slate-400">Fecha, invitados, horario y ubicación</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Event Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tipo de Celebración
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  >
                    {eventTypesList.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fecha del Evento
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duración ({durationHours} Horas)
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={14}
                    value={durationHours}
                    onChange={(e) => setDurationHours(Number(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cantidad de Invitados ({guestCount} pers.)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={1500}
                    step={10}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                {/* Branch Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Sucursal Asignada
                  </label>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  >
                    {allBranches.map((b) => (
                      <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Distance in KM */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Distancia Aproximada ({distanceKm} km)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Main Services & Extras Selection */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm text-white shadow-lg shadow-blue-600/30">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Selección de Servicios y Módulos</h3>
                  <p className="text-xs text-slate-400">Personaliza los componentes del show</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allServices.map((srv) => {
                  const isSelected = selectedServices.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-500/80 shadow-md shadow-purple-900/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${
                            isSelected ? 'bg-purple-500 text-white' : 'border border-slate-700'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{srv.name}</p>
                          <p className="text-[10px] text-amber-300 font-semibold">
                            ${srv.basePrice.toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Coupon Discount */}
            <div className="bg-slate-900 border border-purple-900/40 rounded-3xl p-5 shadow-xl flex items-center gap-3">
              <Ticket className="w-5 h-5 text-purple-400 shrink-0" />
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Código de Cupón (ej. AURA2026, BODASVIP)"
                  value={appliedCoupon}
                  onChange={(e) => setAppliedCoupon(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                />
                {couponMsg && (
                  <p
                    className={`text-[11px] mt-1 font-semibold ${
                      couponMsg.ok ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}
              </div>
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl"
              >
                Aplicar
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Quote Summary & Actions */}
          <div className="lg:col-span-5 space-y-6">
            {quoteResult && (
              <div className="bg-slate-900 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl space-y-6 sticky top-24">
                {/* Header Badge */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                      RESUMEN DEL PRESUPUESTO
                    </span>
                    <h3 className="text-xl font-black text-white">
                      N° {quoteResult.quoteNumber}
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-purple-950 border border-purple-800 text-purple-300 text-xs font-bold rounded-full">
                    {quoteResult.input.eventType}
                  </span>
                </div>

                {/* Suggested Gear Box */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-purple-900/50 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Equipamiento Técnico Recomendado</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div>🔊 Bafles: {quoteResult.recommendedEquipment.speakersCount} un.</div>
                    <div>🔊 Subwoofers: {quoteResult.recommendedEquipment.subwoofersCount} un.</div>
                    <div>⚡ Potencia: {quoteResult.recommendedEquipment.totalWattage}W RMS</div>
                    <div>💡 Cabezas Móviles: {quoteResult.recommendedEquipment.movingHeadsCount} un.</div>
                  </div>
                </div>

                {/* Cost Items Table */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                  {quoteResult.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 border-b border-slate-800/60 text-slate-300"
                    >
                      <span className="truncate max-w-[200px]">{item.concept}</span>
                      <span className="font-mono font-semibold text-white">
                        ${item.totalPrice.toLocaleString('es-AR')}
                      </span>
                    </div>
                  ))}

                  {/* Surcharges */}
                  {quoteResult.surcharges.map((s, idx) => (
                    <div
                      key={`sur-${idx}`}
                      className="flex items-center justify-between py-1 text-amber-400 font-semibold"
                    >
                      <span>{s.name}</span>
                      <span>+${s.amount.toLocaleString('es-AR')}</span>
                    </div>
                  ))}

                  {/* Discounts */}
                  {quoteResult.discounts.map((d, idx) => (
                    <div
                      key={`disc-${idx}`}
                      className="flex items-center justify-between py-1 text-emerald-400 font-semibold"
                    >
                      <span>{d.name}</span>
                      <span>-${d.amount.toLocaleString('es-AR')}</span>
                    </div>
                  ))}
                </div>

                {/* Total Box */}
                <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-950 p-5 rounded-2xl border border-purple-500/50 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Subtotal Neto</span>
                    <span>${quoteResult.subtotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex items-center justify-between text-2xl font-black text-amber-300 pt-1 border-t border-purple-800/60">
                    <span>TOTAL FINAL:</span>
                    <span>${quoteResult.total.toLocaleString('es-AR')}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 pt-1 text-right">
                    Seña requerida (30%): ${quoteResult.suggestedDeposit.toLocaleString('es-AR')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => handleBooking(quoteResult)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>SOLICITAR RESERVA CON ESTE PRESUPUESTO</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleDownloadPDF}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-purple-400" />
                      <span>Descargar PDF</span>
                    </button>
                    <button
                      onClick={() => setEmailModalOpen(true)}
                      className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-pink-400" />
                      <span>Enviar por Email</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {emailModalOpen && (
        <div
          onClick={() => setEmailModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 max-w-md w-full text-white space-y-4 cursor-default"
          >
            <h3 className="font-bold text-lg text-white">Enviar Presupuesto por Correo</h3>
            <p className="text-xs text-slate-300">
              Ingresa tu correo electrónico para recibir el presupuesto oficial en tu bandeja de entrada:
            </p>
            <input
              type="email"
              placeholder="tuemail@ejemplo.com"
              value={userEmailInput}
              onChange={(e) => setUserEmailInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
            />
            {emailSentSuccess && (
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                ¡Presupuesto enviado exitosamente!
              </p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEmailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendEmail}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
