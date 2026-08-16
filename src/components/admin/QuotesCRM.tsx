import React, { useState, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  FileSpreadsheet,
  Download,
  Plus,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Building2,
  Trash2,
  Tag,
  Gift,
  RefreshCw,
  X
} from 'lucide-react';

import { AppStorage } from '../../services/storage';
import { SupabaseService, CustomerConsulta } from '../../services/supabase';
import { Customer, CustomerStatus } from '../../types';
import { exportCustomersToExcel } from '../../utils/excelExporter';

export const QuotesCRM: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'consultas'>('customers');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [consultas, setConsultas] = useState<CustomerConsulta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [loading, setLoading] = useState(false);

  // New Customer Modal State
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCity, setNewCity] = useState('Buenos Aires');

  const loadData = async () => {
    setLoading(true);
    const custs = await SupabaseService.syncCustomers();
    setCustomers(custs);
    const cons = await SupabaseService.getConsultas();
    setConsultas(cons);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.firstName} ${c.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredConsultas = consultas.filter((c) => {
    const matchesSearch = c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newEmail) return;

    const created: Customer = {
      id: `cust-${Date.now()}`,
      firstName: newFirstName,
      lastName: newLastName || 'Cliente',
      email: newEmail.trim().toLowerCase(),
      phone: newPhone || '+54 11 0000-0000',
      whatsapp: newPhone || '+54 11 0000-0000',
      city: newCity,
      status: 'Confirmado',
      notes: 'Cliente creado desde CRM Admin',
      createdAt: new Date().toISOString(),
      totalEventsCount: 0,
      totalSpent: 0,
      registeredUser: true
    };

    await SupabaseService.upsertCustomer(created);
    setShowAddCustomerModal(false);
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    await loadData();
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este cliente de Supabase CRM?')) return;
    await SupabaseService.deleteCustomer(id);
    await loadData();
  };

  const handleDeleteConsulta = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta consulta?')) return;
    await SupabaseService.deleteConsulta(id);
    await loadData();
  };

  const sendWhatsAppMsg = (phone: string, name: string) => {
    const clean = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(`Hola ${name}, te escribimos de AURA Sound & Eventos sobre tu cotización de evento. ¿En qué podemos ayudarte?`);
    window.open(`https://wa.me/${clean}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">CRM DE CLIENTES & CONSULTAS SUPABASE</h1>
          <p className="text-xs text-slate-400">
            Sincronización en tiempo real de clientes, consultas de combos y prospectos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddCustomerModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/30"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>

          <button
            onClick={() => exportCustomersToExcel(customers)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Exportar Excel</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs: Clientes vs Consultas / Combos */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('customers')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeSubTab === 'customers'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Base de Clientes ({customers.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('consultas')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeSubTab === 'consultas'
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Consultas & Combos ({consultas.length})</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por nombre o email en Supabase..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        {activeSubTab === 'customers' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="todos">Todos los Estados</option>
            <option value="Prospecto">Prospecto</option>
            <option value="Presupuesto enviado">Presupuesto enviado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmado">Confirmado</option>
            <option value="Cliente frecuente">Cliente frecuente</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'customers' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Cliente / Usuario</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Ciudad / Ubicación</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Inversión Acumulada</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{c.firstName} {c.lastName}</p>
                      <p className="text-[10px] text-purple-400">{c.company || 'Particular Registrado'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300">{c.email}</p>
                      <p className="text-slate-400">{c.phone}</p>
                    </td>
                    <td className="p-4">{c.city}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-amber-300">${c.totalSpent.toLocaleString('es-AR')}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => sendWhatsAppMsg(c.whatsapp, c.firstName)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 font-bold text-xs flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar de Supabase CRM"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Consultas & Combos Table */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase border-b border-slate-800">
                <tr>
                  <th className="p-4">Cliente Consultante</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Tipo Evento</th>
                  <th className="p-4">Combo / Descuento Aplicado</th>
                  <th className="p-4">Mensaje / Consulta</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
                {filteredConsultas.map((cons) => (
                  <tr key={cons.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm">{cons.customerName}</p>
                      <p className="text-[10px] text-slate-400">{new Date(cons.createdAt).toLocaleDateString('es-AR')}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-slate-300">{cons.email}</p>
                      <p className="text-slate-400">{cons.phone}</p>
                    </td>
                    <td className="p-4 font-bold text-purple-300">{cons.eventType}</td>
                    <td className="p-4">
                      {cons.appliedCombo ? (
                        <div className="flex items-center gap-1 bg-pink-500/20 border border-pink-500/40 text-pink-300 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit">
                          <Gift className="w-3 h-3 text-pink-400" />
                          <span>{cons.appliedCombo} ({cons.discountPercentage}% OFF)</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[10px]">Consulta estándar</span>
                      )}
                    </td>
                    <td className="p-4 max-w-xs truncate text-slate-300" title={cons.message}>
                      {cons.message}
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => sendWhatsAppMsg(cons.phone, cons.customerName)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 font-bold text-xs flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Responder</span>
                      </button>

                      <button
                        onClick={() => handleDeleteConsulta(cons.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Eliminar Consulta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-4 relative shadow-2xl">
            <button
              onClick={() => setShowAddCustomerModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-black text-white">NUEVO CLIENTE EN SUPABASE CRM</h2>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Carlos"
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Apellido</label>
                <input
                  type="text"
                  placeholder="Gómez"
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  placeholder="carlos@ejemplo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+54 11 9876-5432"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Ciudad</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Guardar Cliente en Supabase DB</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

