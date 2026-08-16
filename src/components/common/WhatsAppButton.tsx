import React, { useState } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { Branch } from '../../types';

import { AppStorage } from '../../services/storage';

interface WhatsAppButtonProps {
  branch?: Branch | null;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ branch }) => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  const targetBranch = branch || AppStorage.getBranches()[0];

  const sendWhatsApp = (text: string) => {
    const rawPhone = targetBranch?.whatsapp || '+54 9 3454 13-1152';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(text || 'Hola! Quisiera consultar disponibilidad y presupuesto para un evento.');
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Popover */}
      {open && (
        <div className="mb-3 w-80 bg-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl p-4 text-white text-xs space-y-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <MessageSquare className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">MonkeyDJ WhatsApp Directo</p>
                <p className="text-[10px] text-emerald-400 font-medium">
                  {targetBranch?.name || 'MonkeyDJ'} • En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-slate-300 leading-relaxed">
            ¡Hola! ¿En qué fecha y localidad es tu evento? Te asesoramos en minutos sobre combos y disponibilidad.
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => sendWhatsApp('Hola! Me gustaría cotizar un Casamiento.')}
              className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors flex items-center justify-between"
            >
              <span>💍 Cotizar Casamiento</span>
              <Sparkles className="w-3 h-3 text-purple-400" />
            </button>
            <button
              onClick={() => sendWhatsApp('Hola! Me gustaría cotizar un Cumpleaños de 15.')}
              className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors flex items-center justify-between"
            >
              <span>🎉 Cotizar Fiesta de 15</span>
              <Sparkles className="w-3 h-3 text-pink-400" />
            </button>
            <button
              onClick={() => sendWhatsApp('Hola! Necesito un presupuesto para un Evento Empresarial.')}
              className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors flex items-center justify-between"
            >
              <span>🏢 Evento Empresarial / Gala</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </button>
          </div>

          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendWhatsApp(msg);
              }}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => sendWhatsApp(msg)}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl font-bold flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative group p-4 rounded-full bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center"
        title="Consultar por WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950"></span>
        <MessageSquare className="w-6 h-6 fill-slate-950" />
      </button>
    </div>
  );
};
