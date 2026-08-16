import React, { useState, useRef } from 'react';
import {
  User,
  FileText,
  Calendar,
  Download,
  PenTool,
  CheckCircle2,
  Ticket,
  Clock,
  ShieldCheck,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Bell,
  Send,
  Sparkles,
  Info
} from 'lucide-react';

import { EventRecord, QuoteResult, BookingRequest, Coupon } from '../../types';
import { AppStorage } from '../../services/storage';
import { generateContractPDF, generateQuotePDF } from '../../utils/pdfGenerator';

export const ClientPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'quotes' | 'support' | 'coupons' | 'notifications'>('events');

  const events = AppStorage.getEvents();
  const quotes = AppStorage.getQuotes();
  const coupons = AppStorage.getCoupons();
  const bookings = AppStorage.getBookings();

  // Support consultation message state
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportHistory, setSupportHistory] = useState([
    {
      id: 'sup-1',
      date: 'Ayer, 18:30 hs',
      subject: 'Consulta sobre Iluminación Robótica DMX',
      message: 'Hola equipo MonkeyDJ, quería consultar si el paquete Pro incluye cabezales móviles en el salón.',
      status: 'Respondió MonkeyDJ',
      reply: '¡Hola! Sí, el Paquete Pro incluye 4 x Cabezales Móviles Beam 10R con control DMX y operador en vivo.'
    }
  ]);

  // Client notifications state
  const [notifications] = useState([
    {
      id: 'notif-1',
      date: 'Hoy, 10:15 hs',
      type: 'reserva',
      title: 'Presupuesto Guardado',
      description: 'Tu cotización para Fiesta de 15 en Concordia ha sido almacenada correctamente.',
      read: false
    },
    {
      id: 'notif-2',
      date: 'Ayer, 15:40 hs',
      type: 'contrato',
      title: 'Contrato Digital Disponible',
      description: 'Ya puedes realizar la firma digital de tu evento y descargar el comprobante en PDF.',
      read: true
    },
    {
      id: 'notif-3',
      date: 'Hace 2 días',
      type: 'promocion',
      title: 'Nuevo Cupón Exclusivo - MONKEY15',
      description: 'Aprovecha un 15% de descuento adicional en combos de Sonido + Robot LED.',
      read: true
    }
  ]);

  // Selected event for digital signature modal
  const [signingEvent, setSigningEvent] = useState<EventRecord | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signedSuccess, setSignedSuccess] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (!signingEvent) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL('image/png');

    const updatedEvents = events.map((ev) => {
      if (ev.id === signingEvent.id) {
        return {
          ...ev,
          contractSigned: true,
          contractSignedAt: new Date().toLocaleString('es-AR'),
          contractSignatureData: signatureData
        };
      }
      return ev;
    });

    AppStorage.saveEvents(updatedEvents);
    setSignedSuccess(true);
    setTimeout(() => {
      setSignedSuccess(false);
      setSigningEvent(null);
    }, 1500);
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header User Banner */}
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <User className="w-8 h-8 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Portal de Anfitriones</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase">
                  CLIENTE VERIFICADO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Gestiona tus reservas, firma tu contrato digital y descarga comprobantes.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'events' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Eventos ({events.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'quotes' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cotizaciones ({quotes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'support' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              <span>Consultas a Soporte ({supportHistory.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'coupons' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              <span>Cupones ({coupons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'notifications' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Notificaciones ({notifications.filter(n => !n.read).length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: My Events */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>Historial y Seguimiento de Eventos</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-purple-400 uppercase">
                        {ev.eventNumber}
                      </span>
                      <h3 className="text-lg font-extrabold text-white">{ev.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-950 border border-purple-800 text-purple-300">
                      {ev.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>📅 Fecha: <span className="font-semibold text-white">{ev.eventDate}</span></div>
                    <div>🕒 Horario: <span className="font-semibold text-white">{ev.startTime} hs</span></div>
                    <div>📍 Salón: <span className="font-semibold text-white">{ev.venueName}</span></div>
                    <div>👥 Invitados: <span className="font-semibold text-white">{ev.guestCount}</span></div>
                  </div>

                  {/* Payment Status Bar */}
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">Monto Contratado</p>
                      <p className="font-extrabold text-amber-300">${ev.totalPrice.toLocaleString('es-AR')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Anticipo Abonado</p>
                      <p className="font-bold text-emerald-400">${ev.depositPaid.toLocaleString('es-AR')}</p>
                    </div>
                  </div>

                  {/* Actions: Contract Sign & Download */}
                  <div className="flex items-center gap-2 pt-2">
                    {ev.contractSigned ? (
                      <button
                        onClick={() => generateContractPDF(ev)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-900/80 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar Contrato Firmado</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSigningEvent(ev)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-colors"
                      >
                        <PenTool className="w-4 h-4" />
                        <span>Firmar Contrato Digital</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Saved Quotes */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>Presupuestos Cotizados</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotes.map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <p className="text-[10px] text-purple-400 font-bold uppercase">{q.quoteNumber}</p>
                      <h3 className="text-base font-bold text-white">{q.input.eventType}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{q.input.eventDate}</span>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <p>• Invitados: {q.input.guestCount} personas</p>
                    <p>• Duración: {q.input.durationHours} Horas</p>
                    <p>• Cobertura: {q.input.city}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <p className="text-[10px] text-slate-400">Total Cotizado</p>
                      <p className="text-lg font-black text-amber-300">${q.total.toLocaleString('es-AR')}</p>
                    </div>
                    <button
                      onClick={() => generateQuotePDF(q)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Support Consultations */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-pink-400" />
              <span>Consultas a Soporte Técnico y Asesoramiento</span>
            </h2>

            {/* New Question Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Enviar Nueva Consulta Técnica o Cambios de Evento</span>
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!supportMessage.trim()) return;
                  const newEntry = {
                    id: `sup-${Date.now()}`,
                    date: 'Hace un instante',
                    subject: 'Consulta General',
                    message: supportMessage,
                    status: 'Pendiente de Respuesta',
                    reply: 'Recibido. Un asesor técnico de MonkeyDJ responderá tu consulta a la brevedad.'
                  };
                  setSupportHistory([newEntry, ...supportHistory]);
                  setSupportMessage('');
                  setSupportSubmitted(true);
                  setTimeout(() => setSupportSubmitted(false), 3000);
                }}
                className="space-y-3"
              >
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe tu consulta sobre sonido, horarios, equipamiento o logística de tu fiesta..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-pink-500"
                ></textarea>
                {supportSubmitted && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>¡Consulta enviada con éxito! MonkeyDJ responderá en breve.</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-pink-600/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Consulta Directa</span>
                </button>
              </form>
            </div>

            {/* History */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-300">Historial de Consultas Realizadas</h3>
              {supportHistory.map((s) => (
                <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-xs text-white">{s.subject}</span>
                    <span className="text-[10px] text-slate-400">{s.date}</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                    "{s.message}"
                  </p>
                  {s.reply && (
                    <div className="bg-purple-950/40 border border-purple-500/30 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                        <span>Respuesta MonkeyDJ:</span>
                      </div>
                      <p className="text-slate-200">{s.reply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400" />
              <span>Centro de Notificaciones y Avisos de Evento</span>
            </h2>

            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                    n.read
                      ? 'bg-slate-900 border-slate-800'
                      : 'bg-purple-950/30 border-purple-500/40 shadow-lg shadow-purple-600/10'
                  }`}
                >
                  <div className="p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-white">{n.title}</h3>
                      <span className="text-[10px] text-slate-400">{n.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Digital Signature Canvas Modal */}
      {signingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-white">Firma Digital del Contrato</h3>
                <p className="text-xs text-slate-400">Evento: {signingEvent.title}</p>
              </div>
              <button
                onClick={() => setSigningEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Dibuja tu firma en el recuadro utilizando el ratón o la pantalla táctil de tu dispositivo:
            </p>

            {/* Signature Canvas */}
            <div className="bg-white rounded-2xl border-2 border-purple-500 p-1">
              <canvas
                ref={canvasRef}
                width={440}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 cursor-crosshair rounded-xl touch-none"
              ></canvas>
            </div>

            {signedSuccess && (
              <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                ¡Firma registrada exitosamente!
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Limpiar Trazo
              </button>

              <button
                onClick={saveSignature}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirmar y Guardar Firma</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
