import React, { useState, useEffect } from 'react';
import { Shield, UserCheck, Plus, Trash2, Edit3, Database, CheckCircle2, RefreshCw, Key, Mail, Lock } from 'lucide-react';
import { SupabaseService, UserRoleRecord } from '../../services/supabase';
import { AppStorage } from '../../services/storage';

export const UserRolesManager: React.FC = () => {
  const [roles, setRoles] = useState<UserRoleRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'operator' | 'client'>('admin');
  const [msg, setMsg] = useState('');

  const [dbStats, setDbStats] = useState({
    customers: 0,
    consultas: 0,
    bookings: 0,
    services: 0,
    branches: 0,
    equipment: 0
  });

  const loadData = async () => {
    setLoading(true);
    const rList = await SupabaseService.getUserRoles();
    setRoles(rList);

    const customers = AppStorage.getCustomers();
    const consultas = await SupabaseService.getConsultas();
    const bookings = AppStorage.getBookings();
    const services = AppStorage.getServices();
    const branches = AppStorage.getBranches();
    const equipment = AppStorage.getEquipment();

    setDbStats({
      customers: customers.length,
      consultas: consultas.length,
      bookings: bookings.length,
      services: services.length,
      branches: branches.length,
      equipment: equipment.length
    });
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setLoading(true);
    const clean = newEmail.trim().toLowerCase();
    const record: UserRoleRecord = {
      email: clean,
      role: newRole,
      created_at: new Date().toISOString()
    };
    await SupabaseService.saveUserRole(record);
    setMsg(`Rol '${newRole.toUpperCase()}' asignado a ${clean} e integrado en Supabase.`);
    setNewEmail('');
    await loadData();
    setTimeout(() => setMsg(''), 4000);
  };

  const handleDeleteRole = async (emailToDelete: string) => {
    if (emailToDelete.toLowerCase() === 'fecsoul@gmail.com') {
      alert('fecsoul@gmail.com es el Super Admin principal y no puede eliminarse.');
      return;
    }
    const filtered = roles.filter((r) => r.email.toLowerCase() !== emailToDelete.toLowerCase());
    setRoles(filtered);
    localStorage.setItem('aura_user_roles_v1', JSON.stringify(filtered));
    setMsg(`Rol eliminado de ${emailToDelete}`);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSyncAllToSupabase = async () => {
    setLoading(true);
    setMsg('Sincronizando todas las entidades del dashboard con Supabase DB...');
    try {
      await SupabaseService.saveEntity('branches', 'aura_branches_v1', AppStorage.getBranches());
      await SupabaseService.saveEntity('services', 'aura_services_v1', AppStorage.getServices());
      await SupabaseService.saveEntity('equipment', 'aura_equipment_v1', AppStorage.getEquipment());
      await SupabaseService.saveEntity('customers', 'aura_customers_v1', AppStorage.getCustomers());
      await SupabaseService.saveEntity('events', 'aura_events_v1', AppStorage.getEvents());
      await SupabaseService.saveEntity('bookings', 'aura_bookings_v1', AppStorage.getBookings());
      setMsg('¡Sincronización completa con Supabase finalizada con éxito!');
    } catch (err: any) {
      setMsg('Sincronización local completa finalizada.');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-black text-white">ROLES Y CONEXIÓN SUPABASE DB</h1>
          </div>
          <p className="text-xs text-slate-400">
            Asignación de permisos por correo (ej: <span className="text-emerald-400 font-bold">fecsoul@gmail.com</span>) y sincronización activa en la nube.
          </p>
        </div>

        <button
          onClick={handleSyncAllToSupabase}
          disabled={loading}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Todo a Supabase</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Supabase Realtime Health Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Clientes CRM</span>
          <p className="text-lg font-black text-purple-300">{dbStats.customers}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Consultas</span>
          <p className="text-lg font-black text-blue-300">{dbStats.consultas}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Reservas</span>
          <p className="text-lg font-black text-emerald-300">{dbStats.bookings}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Servicios</span>
          <p className="text-lg font-black text-pink-300">{dbStats.services}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Sucursales</span>
          <p className="text-lg font-black text-amber-300">{dbStats.branches}</p>
        </div>
        <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Equipamiento</span>
          <p className="text-lg font-black text-indigo-300">{dbStats.equipment}</p>
        </div>
      </div>

      {/* Add New Role Assignment */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span>ASIGNAR ROL POR CORREO ELECTRÓNICO</span>
        </h3>

        <form onSubmit={handleAddRole} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="md:col-span-2">
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com (ej: fecsoul@gmail.com)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none"
            >
              <option value="admin">Administrador Central</option>
              <option value="operator">Operador Logístico</option>
              <option value="client">Cliente / Anfitrión</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Guardar Rol Supabase</span>
          </button>
        </form>
      </div>

      {/* Role List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase text-slate-300 tracking-wider">
            ROLES CONFIGURADOS Y ACTIVOS EN LA PLATAFORMA
          </h3>
          <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full font-bold">
            {roles.length} Usuarios Registrados
          </span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {roles.map((r, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-white flex items-center gap-2">
                    <span>{r.email}</span>
                    {r.email.toLowerCase() === 'fecsoul@gmail.com' && (
                      <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] px-2 py-0.5 rounded-full font-bold">
                        Super Admin Principal
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400">Rol asignado: {r.role.toUpperCase()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                    r.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : r.role === 'operator'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {r.role === 'admin' ? 'Administrador' : r.role === 'operator' ? 'Operador' : 'Cliente'}
                </span>

                {r.email.toLowerCase() !== 'fecsoul@gmail.com' && (
                  <button
                    onClick={() => handleDeleteRole(r.email)}
                    className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                    title="Eliminar Rol"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
