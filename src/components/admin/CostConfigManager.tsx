import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, DollarSign, Percent } from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { PricingConfig } from '../../types';

export const CostConfigManager: React.FC = () => {
  const [pricing, setPricing] = useState<PricingConfig>(AppStorage.getPricingConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AppStorage.savePricingConfig(pricing);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">MATRIZ DINÁMICA DE TARIFAS Y COSTOS</h1>
          <p className="text-xs text-slate-400">
            Modifica las fórmulas de cálculo del cotizador en tiempo real sin alterar el código.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950 p-2 rounded-xl border border-emerald-800">
            <CheckCircle2 className="w-4 h-4" /> ¡Configuración guardada!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        {/* Base Rates */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            1. Tarifas Operativas Base
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Costo por Hora Base ($)</label>
              <input
                type="number"
                value={pricing.baseHourlyRate}
                onChange={(e) => setPricing({ ...pricing, baseHourlyRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Costo por Invitado Adicional ($)</label>
              <input
                type="number"
                value={pricing.baseGuestRate}
                onChange={(e) => setPricing({ ...pricing, baseGuestRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Flete Base ($)</label>
              <input
                type="number"
                value={pricing.baseFreightFee}
                onChange={(e) => setPricing({ ...pricing, baseFreightFee: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Travel & Staff */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            2. Viáticos, Traslado y Honorarios de Personal
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Costo por Kilómetro Travel ($)</label>
              <input
                type="number"
                value={pricing.perKmRate}
                onChange={(e) => setPricing({ ...pricing, perKmRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Honorario Hora DJ ($)</label>
              <input
                type="number"
                value={pricing.djHourlyRate}
                onChange={(e) => setPricing({ ...pricing, djHourlyRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Honorario Hora Animador ($)</label>
              <input
                type="number"
                value={pricing.animatorHourlyRate}
                onChange={(e) => setPricing({ ...pricing, animatorHourlyRate: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Surcharges & Taxes */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            3. Recargos por Fechas Especiales e Impuestos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Recargo Fin de Semana (%)</label>
              <input
                type="number"
                value={pricing.weekendSurchargePercent}
                onChange={(e) => setPricing({ ...pricing, weekendSurchargePercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Recargo Feriados (%)</label>
              <input
                type="number"
                value={pricing.holidaySurchargePercent}
                onChange={(e) => setPricing({ ...pricing, holidaySurchargePercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Recargo Alta Temporada (%)</label>
              <input
                type="number"
                value={pricing.highSeasonSurchargePercent}
                onChange={(e) => setPricing({ ...pricing, highSeasonSurchargePercent: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Seña Requerida (%)</label>
              <input
                type="number"
                value={pricing.depositPercentage}
                onChange={(e) => setPricing({ ...pricing, depositPercentage: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración Tarifaria</span>
          </button>
        </div>
      </form>
    </div>
  );
};
