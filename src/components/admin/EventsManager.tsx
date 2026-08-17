import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Copy,
  Trash2,
  CheckCircle2,
  UserCheck,
  PackageCheck,
  Truck,
  FileSpreadsheet,
  X,
  AlertTriangle
} from 'lucide-react';

import { AppStorage } from '../../services/storage';
import { EventRecord, EventType, EventStatus } from '../../types';
import { exportEventsToExcel } from '../../utils/excelExporter';

export const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<EventRecord[]>(AppStorage.getEvents());
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEditingEvent(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    let updated: EventRecord[];
    if (isNew) {
      updated = [editingEvent, ...events];
    } else {
      updated = events.map((ev) => (ev.id === editingEvent.id ? editingEvent : ev));
    }

    setEvents(updated);
    AppStorage.saveEvents(updated);
    AppStorage.addAuditLog('Admin', isNew ? 'Evento Creado' : 'Evento Modificado', editingEvent.title);
    setEditingEvent(null);
  };

  const handleDuplicate = (ev: EventRecord) => {
    const dup: EventRecord = {
      ...ev,
      id: `ev-${Date.now()}`,
      eventNumber: `EV-2026-${Math.floor(300 + Math.random() * 600)}`,
      title: `${ev.title} (Copia)`,
      status: 'Presupuestado'
    };
    const updated = [dup, ...events];
    setEvents(updated);
    AppStorage.saveEvents(updated);
  };

  const handleCancel = (id: string) => {
    const updated = events.map((ev) => (ev.id === id ? { ...ev, status: 'Cancelado' as EventStatus } : ev));
    setEvents(updated);
    AppStorage.saveEvents(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">GESTIÓN OPERATIVA DE EVENTOS</h1>
          <p className="text-xs text-slate-400">
            Administración completa de fechas, contratos, asignación de personal y logística.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => exportEventsToExcel(events)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={() => {
              setIsNew(true);
              setEditingEvent({
                id: `ev-${Date.now()}`,
                eventNumber: `EV-2026-${Math.floor(100 + Math.random() * 800)}`,
                title: 'Nuevo Evento Especial',
                eventType: 'Casamiento',
                customerId: 'c-101',
                customerName: 'Cliente Nuevo',
                customerPhone: '1100000000',
                branchId: 'b-capital',
                branchName: 'Sucursal Central - Capital Federal',
                eventDate: new Date().toISOString().slice(0, 10),
                startTime: '21:00',
                endTime: '05:00',
                venueName: 'Salón de Fiestas',
                venueAddress: 'Av. Corrientes 1000',
                city: 'Buenos Aires',
                guestCount: 100,
                status: 'Confirmado',
                totalPrice: 450000,
                depositPaid: 150000,
                paymentStatus: 'Anticipo Pagado',
                assignedStaff: [{ staffId: 'st-1', name: 'Lucas DJ Lex', role: 'DJ Principal' }],
                assignedEquipment: [{ equipmentId: 'eq-1', name: 'Bafles RCF', quantity: 2 }],
                contractSigned: false
              });
            }}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">N° Evento & Título</th>
                <th className="p-4">Cliente & Fecha</th>
                <th className="p-4">Ubicación</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Monto Total</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <p className="text-[10px] text-purple-400 font-bold uppercase">{ev.eventNumber}</p>
                    <p className="font-bold text-white text-sm">{ev.title}</p>
                    <span className="text-[10px] text-slate-400">{ev.eventType}</span>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">{ev.customerName}</p>
                    <p className="text-slate-400">{ev.eventDate} ({ev.startTime} hs)</p>
                  </td>
                  <td className="p-4">
                    <p className="text-slate-200">{ev.venueName}</p>
                    <p className="text-[11px] text-slate-500">{ev.city}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ev.status === 'Confirmado'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ev.status === 'Cancelado'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-amber-300">${ev.totalPrice.toLocaleString('es-AR')}</p>
                    <p className="text-[10px] text-slate-400">Seña: ${ev.depositPaid.toLocaleString('es-AR')}</p>
                  </td>
                  <td className="p-4 text-right space-x-1">
                    <button
                      onClick={() => {
                        setIsNew(false);
                        setEditingEvent(ev);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(ev)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300"
                      title="Duplicar"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCancel(ev.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300"
                      title="Cancelar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Event Modal */}
      {editingEvent && (
        <div
          onClick={() => setEditingEvent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto cursor-default"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg">
                {isNew ? 'Nuevo Evento' : `Editar ${editingEvent.eventNumber}`}
              </h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Título del Evento</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tipo de Evento</label>
                  <select
                    value={editingEvent.eventType}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventType: e.target.value as EventType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Casamiento">Casamiento</option>
                    <option value="Cumpleaños de XV">Cumpleaños de XV</option>
                    <option value="Evento Empresarial">Evento Empresarial</option>
                    <option value="Fiesta de Egreso">Fiesta de Egreso</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Nombre Cliente</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.customerName}
                    onChange={(e) => setEditingEvent({ ...editingEvent, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.eventDate}
                    onChange={(e) => setEditingEvent({ ...editingEvent, eventDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Precio Total ($)</label>
                  <input
                    type="number"
                    value={editingEvent.totalPrice}
                    onChange={(e) => setEditingEvent({ ...editingEvent, totalPrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Seña Pagada ($)</label>
                  <input
                    type="number"
                    value={editingEvent.depositPaid}
                    onChange={(e) => setEditingEvent({ ...editingEvent, depositPaid: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 bg-slate-800 rounded-xl text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
