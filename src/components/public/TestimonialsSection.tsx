import React, { useState } from 'react';
import {
  Star,
  MessageSquarePlus,
  Quote,
  CheckCircle2,
  X,
  Send
} from 'lucide-react';

import { Testimonial, EventType } from '../../types';
import { AppStorage } from '../../services/storage';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  onTestimonialSubmitted: (t: Testimonial) => void;
  currentBranchId?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  onTestimonialSubmitted,
  currentBranchId
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [eventType, setEventType] = useState<EventType>('Casamiento');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !comment) return;

    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      customerName,
      eventType,
      date: new Date().toISOString().slice(0, 10),
      rating,
      comment,
      featured: true,
      verified: true,
      branchId: currentBranchId || 'all'
    };

    const currentList = AppStorage.getTestimonials();
    currentList.unshift(newTestimonial);
    AppStorage.saveTestimonials(currentList);

    onTestimonialSubmitted(newTestimonial);
    setModalOpen(false);
    setCustomerName('');
    setComment('');
  };

  return (
    <section id="testimonios" className="py-20 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2 backdrop-blur-md">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Opiniones Reales de Anfitriones</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              TESTIMONIOS DESTACADOS
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mt-1">
              Conoce las opiniones verificadas de novios, quinceañeras y organizadores corporativos que confiaron en nuestro servicio.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-2 shadow-xl hover:scale-105 transition-all backdrop-blur-xl"
          >
            <MessageSquarePlus className="w-4 h-4 text-blue-400" />
            <span>Dejar mi Opinión / Calificación</span>
          </button>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/25 space-y-4 shadow-2xl hover:bg-white/[0.08] transition-all"
            >
              {/* Rating Stars */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                {t.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Evento Verificado
                  </span>
                )}
              </div>

              {/* Comment */}
              <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed">
                "{t.comment}"
              </p>

              {/* User Info */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 font-bold text-sm">
                  {t.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{t.customerName}</h4>
                  <p className="text-[11px] text-purple-400">{t.eventType} • {t.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 max-w-md w-full text-white space-y-4 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg">Compartir mi Experiencia</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Nombre / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Camila & Mateo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Evento</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Casamiento">Casamiento</option>
                  <option value="Cumpleaños de XV">Cumpleaños de XV</option>
                  <option value="Evento Empresarial">Evento Empresarial</option>
                  <option value="Fiesta de Egreso">Fiesta de Egreso</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Calificación (Estrellas)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tu Opinión sobre el Servicio</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escribe tu testimonio..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Publicar Opinión</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
