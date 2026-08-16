import React from 'react';
import {
  FileText,
  Clock,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Award,
  PieChart,
  BarChart3,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import { AppStorage } from '../../services/storage';

export const DashboardOverview: React.FC = () => {
  const events = AppStorage.getEvents();
  const bookings = AppStorage.getBookings();
  const quotes = AppStorage.getQuotes();
  const customers = AppStorage.getCustomers();

  const totalQuotesSent = quotes.length + 18; // plus baseline
  const pendingBookings = bookings.filter((b) => b.status === 'Pendiente').length;
  const eventsThisMonth = events.length;
  
  const totalRevenueEstimates = events.reduce((acc, curr) => acc + curr.totalPrice, 0) + 1850000;
  const newClientsCount = customers.filter((c) => c.status === 'Prospecto' || c.status === 'Confirmado').length;
  const repeatClientsCount = customers.filter((c) => c.status === 'Cliente frecuente').length;

  const conversionRate = Math.round((events.length / Math.max(1, totalQuotesSent)) * 100);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">INDICADORES Y MÉTRICAS DE NEGOCIO</h1>
          <p className="text-xs text-slate-400 mt-1">
            Resumen ejecutivo del estado de presupuestos, reservas, facturación estimada y logística.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-semibold">Sistema Activo Multi-Sucursal</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-purple-900/40 p-5 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Presupuestos Enviados</span>
            <div className="p-2 rounded-xl bg-purple-950 text-purple-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{totalQuotesSent}</p>
          <p className="text-[11px] text-emerald-400 font-medium">↑ +14% vs mes anterior</p>
        </div>

        <div className="bg-slate-900 border border-purple-900/40 p-5 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Reservas Pendientes</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-amber-300">{pendingBookings}</p>
          <p className="text-[11px] text-slate-400">A la espera de aprobación</p>
        </div>

        <div className="bg-slate-900 border border-purple-900/40 p-5 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Eventos del Mes</span>
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">{eventsThisMonth}</p>
          <p className="text-[11px] text-purple-400 font-medium">85% ocupación agenda</p>
        </div>

        <div className="bg-slate-900 border border-purple-900/40 p-5 rounded-3xl space-y-2 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Facturación Estimada</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-300">
            ${totalRevenueEstimates.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">Proyección acumulada</p>
        </div>
      </div>

      {/* Second KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>CLIENTES NUEVOS vs RECURRENTES</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-2xl font-bold text-white">{newClientsCount} Nuevos</span>
            <span className="text-sm text-purple-300 font-medium">{repeatClientsCount} VIPs</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>TASA DE CONVERSIÓN PRESUPUESTOS</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{conversionRate}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>SERVICIO MÁS DEMANDADO</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-base font-bold text-white">DJ Live + Sonido Line Array + Robot LED</p>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Bar Visualization */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Evolución Mensual de Facturación ($ ARS)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">2026</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6">
            {[
              { month: 'Ene', val: 1200000, h: 'h-24' },
              { month: 'Feb', val: 1450000, h: 'h-28' },
              { month: 'Mar', val: 1800000, h: 'h-36' },
              { month: 'Abr', val: 1600000, h: 'h-32' },
              { month: 'May', val: 1950000, h: 'h-40' },
              { month: 'Jun', val: 2100000, h: 'h-44' },
              { month: 'Jul', val: 2400000, h: 'h-48' }
            ].map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full bg-gradient-to-t from-purple-800 to-indigo-500 rounded-t-xl ${m.h} transition-all hover:opacity-90`}
                ></div>
                <span className="text-[10px] text-slate-400 font-semibold">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Type Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-pink-400" />
              <span>Distribución de Eventos por Categoría</span>
            </h3>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Casamientos (Weddings)</span>
                <span>45%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="bg-purple-500 h-full w-[45%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Cumpleaños de 15</span>
                <span>30%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="bg-pink-500 h-full w-[30%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Eventos Empresariales & Galas</span>
                <span>15%</span>
              </div>
              <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden">
                <div className="bg-indigo-500 h-2 w-[15%]"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 font-semibold mb-1">
                <span>Egresos & Fiestas Privadas</span>
                <span>10%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[10%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
