import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X, Check, Tag, Send, Gift, ShieldCheck } from 'lucide-react';
import { SupabaseService, CustomerConsulta } from '../../services/supabase';
import { AppStorage } from '../../services/storage';

interface ConsultasCombosModalProps {
  onClose: () => void;
  onOpenQuote?: () => void;
}

export const ConsultasCombosModal: React.FC<ConsultasCombosModalProps> = ({ onClose, onOpenQuote }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Casamiento');
  const [message, setMessage] = useState('');
  const [selectedCombo, setSelectedCombo] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const combos = [
    {
      id: 'combo-dj-ilum',
      name: 'Combo Fiesta Premium (DJ + Iluminación Robótica + Humo)',
      discount: '15% OFF',
      discountPercentage: 15,
      desc: 'Ideal para Casamientos y Fiestas de 15. Incluye DJ residente, estructura Truss, cabezas móviles Beam y máquina de humo.'
    },
    {
      id: 'combo-sonido-pantalla',
      name: 'Combo Mega Visual (Sonido Line Array + Pantalla LED + Cabina Fotos)',
      discount: '20% OFF',
      discountPercentage: 20,
      desc: 'Para eventos masivos o corporativos. Sonido envolvente con Pantalla LED Gigante 4K e Impresión de fotos instantáneas.'
    },
    {
      id: 'combo-cumple-chispas',
      name: 'Combo Cumpleaños de Gala (DJ + Chispero Frío + Láser RGB)',
      discount: '10% OFF',
      discountPercentage: 10,
      desc: 'Música personalizada, ingreso triunfal con chisperos fríos de interior sin humo y show láser multidimensional.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setLoading(true);
    const comboObj = combos.find((c) => c.id === selectedCombo);

    const newConsulta: CustomerConsulta = {
      id: `cons-${Date.now()}`,
      customerName: name,
      email: email.trim().toLowerCase(),
      phone: phone || '+54 11 0000-0000',
      eventType,
      message,
      appliedCombo: comboObj?.name || undefined,
      discountPercentage: comboObj?.discountPercentage || undefined,
      status: 'Pendiente',
      createdAt: new Date().toISOString()
    };

    await SupabaseService.saveConsulta(newConsulta);
    AppStorage.addMessage({
      name,
      email: email.trim().toLowerCase(),
      phone: phone || '',
      subject: comboObj ? `Consulta por ${comboObj.name}` : `Consulta por Evento ${eventType}`,
      message: comboObj ? `[Combo seleccionado: ${comboObj.name}] ${message}` : message,
      eventType: eventType as any,
      source: 'Formulario Web'
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-white space-y-5 relative shadow-2xl my-8 cursor-default"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center mx-auto text-white mb-2 shadow-lg shadow-purple-600/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-white tracking-wide">CONSULTAS Y COMBOS EXCLUSIVOS</h2>
              <p className="text-xs text-slate-400">
                Aprovecha nuestros combos especiales y recibe atención directa para tu evento
              </p>
            </div>

            {/* Combos selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-pink-400" />
                <span>SELECCIONA UN COMBO CON DESCUENTO (OPCIONAL)</span>
              </label>

              <div className="grid grid-cols-1 gap-2">
                {combos.map((combo) => {
                  const isSelected = selectedCombo === combo.id;
                  return (
                    <div
                      key={combo.id}
                      onClick={() => setSelectedCombo(isSelected ? null : combo.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-600/25 border-purple-400 shadow-md shadow-purple-600/20'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-pink-400" />
                          <span className="text-xs font-black text-white">{combo.name}</span>
                        </div>
                        <span className="bg-pink-500/20 border border-pink-500/40 text-pink-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                          {combo.discount}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{combo.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Consulta Form */}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="+54 11 1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none"
                  >
                    <option value="Casamiento">Casamiento / Boda</option>
                    <option value="Fiesta de 15">Fiesta de 15</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Evento Corporativo">Evento Corporativo</option>
                    <option value="Festival / Masivo">Festival / Masivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tu Consulta / Detalle del Evento *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Cuéntanos fecha aproximada, cantidad de invitados, requerimientos de DJ, luces o sonido..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>ENVIAR CONSULTA Y REGISTRAR EN SUPABASE</span>
              </button>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-black text-white">¡CONSULTA REGISTRADA CON ÉXITO!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Tus datos han sido integrados en nuestra base de datos de <span className="text-emerald-400 font-bold">Supabase</span>. Un asesor de AURA te contactará a la brevedad con la propuesta con descuento.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
              >
                Cerrar
              </button>
              {onOpenQuote && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenQuote();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  Ir al Cotizador Interactivo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
