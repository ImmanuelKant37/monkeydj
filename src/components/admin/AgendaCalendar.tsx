import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Truck
} from 'lucide-react';

import { AppStorage } from '../../services/storage';
import { EventRecord } from '../../types';

export const AgendaCalendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);

  const events = AppStorage.getEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">AGENDA OPERATIVA DE EVENTOS</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Calendario unificado de montajes, shows y disponibilidad de fechas.
          </p>
        </div>

        {/* View Switchers */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'month' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista Mensual
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'week' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista Semanal
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              viewMode === 'day' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vista Diaria
          </button>
        </div>
      </div>

      {/* Calendar Grid Representation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-white">Agosto 2026</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-xs font-bold">
              {events.length} Eventos Programados
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Events Cards List in Calendar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className="bg-slate-950 border border-purple-900/50 hover:border-purple-500 rounded-2xl p-5 cursor-pointer space-y-3 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-purple-400 uppercase">
                  {ev.eventNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    ev.status === 'Confirmado'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{ev.title}</h3>
                <p className="text-xs text-purple-300 font-medium">{ev.eventType}</p>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-purple-400" />
                  <span>{ev.eventDate} ({ev.startTime} - {ev.endTime} hs)</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" />
                  <span>{ev.venueName} ({ev.city})</span>
                </p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                <span>Personal: {ev.assignedStaff.length} pers.</span>
                <span>Contrato: {ev.contractSigned ? '✓ Firmado' : 'Pendiente'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-xl w-full p-6 text-white space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-purple-400 uppercase">{selectedEvent.eventNumber}</span>
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>📅 <strong className="text-white">Fecha y Hora:</strong> {selectedEvent.eventDate} de {selectedEvent.startTime} a {selectedEvent.endTime} hs</p>
              <p>📍 <strong className="text-white">Ubicación:</strong> {selectedEvent.venueName} ({selectedEvent.venueAddress}, {selectedEvent.city})</p>
              <p>👤 <strong className="text-white">Cliente:</strong> {selectedEvent.customerName} ({selectedEvent.customerPhone})</p>
              <p>🏢 <strong className="text-white">Sucursal:</strong> {selectedEvent.branchName}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-purple-400 uppercase tracking-wider">Personal Asignado</h4>
              <ul className="space-y-1 text-slate-300">
                {selectedEvent.assignedStaff.map((s, i) => (
                  <li key={i}>• {s.name} ({s.role})</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <h4 className="font-bold text-purple-400 uppercase tracking-wider">Equipos & Vehículos</h4>
              <ul className="space-y-1 text-slate-300">
                {selectedEvent.assignedEquipment.map((eq, i) => (
                  <li key={i}>• {eq.name} x{eq.quantity}</li>
                ))}
                {selectedEvent.assignedVehicle && <li>🚚 Vehículo: {selectedEvent.assignedVehicle}</li>}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-xs text-white"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
