import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Users,
  MessageSquare,
  Sparkles,
  DollarSign,
  Package,
  Building2,
  Image,
  Star,
  Mail,
  Shield,
  LogOut,
  Sliders,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  Clock,
  Edit3
} from 'lucide-react';
import { MonkeyLogo } from '../common/MonkeyLogo';

interface AdminLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  onExitAdmin,
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda & Calendario', icon: CalendarDays },
    { id: 'events', label: 'Gestión de Eventos', icon: Calendar },
    { id: 'procedures', label: 'Protocolos de Eventos', icon: Clock },
    { id: 'site-content', label: 'Textos Landing Page', icon: Edit3 },
    { id: 'crm', label: 'CRM & Presupuestos', icon: Users },
    { id: 'messages', label: 'Mensajes & Consultas', icon: MessageSquare },
    { id: 'services', label: 'Servicios & Shows', icon: Sparkles },
    { id: 'pricing', label: 'Configuración de Costos', icon: DollarSign },
    { id: 'inventory', label: 'Inventario & Logística', icon: Package },
    { id: 'branches', label: 'Sucursales', icon: Building2 },
    { id: 'media', label: 'Galería & Reels', icon: Image },
    { id: 'testimonials', label: 'Testimonios', icon: Star },
    { id: 'notifications', label: 'Notificaciones Email', icon: Mail },
    { id: 'roles', label: 'Roles & Supabase DB', icon: UserCheck },
    { id: 'audit', label: 'Auditoría & Historial', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Mobile Bar */}
      <div className="md:hidden bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MonkeyLogo size={24} />
          <span className="font-extrabold text-sm text-white">PANEL MONKEYDJ</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 space-y-6 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Top Brand Tag */}
          <div className="hidden md:flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1">
                <MonkeyLogo size={28} />
              </div>
            </div>
            <div>
              <h2 className="font-black text-sm text-white tracking-wider">Monkey<span className="text-pink-500">DJ</span></h2>
              <span className="text-[10px] text-purple-400 font-bold uppercase">CONCORDIA & POSADAS</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Exit Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onExitAdmin}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-rose-300 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Volver al Sitio Público</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-full">
        {children}
      </main>
    </div>
  );
};
