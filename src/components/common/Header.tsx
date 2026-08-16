import React, { useState } from 'react';
import {
  Disc,
  Calendar,
  Sparkles,
  Phone,
  MessageSquare,
  User,
  Sliders,
  Moon,
  Sun,
  Menu,
  X,
  MapPin,
  Flame,
  FileText,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Branch } from '../../types';
import { MonkeyLogo } from './MonkeyLogo';

interface HeaderProps {
  branches?: Branch[];
  selectedBranch?: Branch;
  onSelectBranch?: (branch: Branch) => void;
  activeView?: string;
  setActiveView?: (view: string) => void;
  darkMode?: boolean;
  setDarkMode?: (dark: boolean) => void;
  portalMode?: 'public' | 'client' | 'admin';
  setPortalMode?: (mode: 'public' | 'client' | 'admin') => void;
  onOpenQuote?: () => void;
  onOpenAuth?: () => void;
  onOpenConsultas?: () => void;
  currentUserEmail?: string | null;
  onLogout?: () => void;
}

const DEFAULT_BRANCH: Branch = {
  id: 'b-bue',
  name: 'Sucursal Central Buenos Aires',
  code: 'BUE',
  city: 'Buenos Aires',
  address: 'Av. Corrientes 1234, CABA',
  phone: '+54 11 4000-0000',
  whatsapp: '541140000000',
  email: 'contacto@auradjeventos.com',
  coverageKm: 100,
  baseTravelFee: 5000,
  perKmFee: 150,
  branchMultiplier: 1.0,
  active: true,
  staffCount: 12,
  vehiclesCount: 4
};

export const Header: React.FC<HeaderProps> = ({
  branches = [],
  selectedBranch,
  onSelectBranch,
  activeView = 'public',
  setActiveView,
  darkMode = true,
  setDarkMode,
  portalMode = 'public',
  setPortalMode,
  onOpenQuote,
  onOpenAuth,
  onOpenConsultas,
  currentUserEmail,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentBranch = selectedBranch || branches[0] || DEFAULT_BRANCH;

  const scrollToSection = (id: string) => {
    if (setPortalMode) setPortalMode('public');
    if (setActiveView) setActiveView('public');
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 text-white transition-all duration-300">
      {/* Top Banner with Branch Selector & Contact */}
      <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 text-xs text-slate-300 border-b border-white/10 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-blue-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Sucursal Cobertura:
            </span>
            <select
              value={currentBranch.id}
              onChange={(e) => {
                const b = branches.find((item) => item.id === e.target.value);
                if (b && onSelectBranch) onSelectBranch(b);
              }}
              className="bg-white/10 text-white border border-white/20 rounded px-2 py-0.5 focus:outline-none focus:border-blue-400 cursor-pointer backdrop-blur-md"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Fechas Disponibles Temporada 2026/2027
            </span>
            <a
              href={`https://wa.me/${(currentBranch.whatsapp || '').replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp Directo
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1">
              <MonkeyLogo size={32} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                Monkey <span className="text-yellow-400">DJ</span> - Sonido y animacion
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-medium tracking-wide">
              Sonido, DJ y animacion
            </p>
          </div>
        </div>

        {/* Public Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => scrollToSection('servicios')}
            className="text-slate-300 hover:text-purple-400 transition-colors"
          >
            Servicios
          </button>
          <button
            onClick={() => scrollToSection('cotizador')}
            className="text-slate-300 hover:text-purple-400 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            Cotizador
          </button>
          <button
            onClick={() => scrollToSection('galeria')}
            className="text-slate-300 hover:text-purple-400 transition-colors"
          >
            Galería
          </button>
          <button
            onClick={() => scrollToSection('testimonios')}
            className="text-slate-300 hover:text-purple-400 transition-colors"
          >
            Testimonios
          </button>
          <button
            onClick={() => scrollToSection('preguntas')}
            className="text-slate-300 hover:text-purple-400 transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Consultas & Combos Button */}
          {onOpenConsultas && (
            <button
              onClick={onOpenConsultas}
              className="px-3.5 py-2 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 text-pink-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Consultas & Combos</span>
            </button>
          )}

          {/* Quick Quote Button */}
          <button
            onClick={() => {
              scrollToSection('cotizador');
              if (onOpenQuote) onOpenQuote();
            }}
            className="relative group overflow-hidden rounded-xl p-px font-semibold text-xs text-white shadow-lg shadow-purple-600/25"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 group-hover:opacity-90 transition-opacity"></span>
            <span className="relative block px-4 py-2 bg-slate-950/40 rounded-[11px] backdrop-blur-sm flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-pink-400 animate-bounce" />
              Cotizar Evento
            </span>
          </button>

          {/* Login Control / Session Indicator */}
          {currentUserEmail ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (setActiveView) setActiveView(portalMode === 'admin' ? 'admin' : 'client');
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-purple-400" />
                <span className="max-w-[130px] truncate">{currentUserEmail}</span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 text-slate-300 hover:text-rose-300 text-xs font-bold transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-white/10 transition-all cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="group-hover:scale-105 transition-transform">Entrar con Google</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => {
              if (setDarkMode) setDarkMode(!darkMode);
            }}
            className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-center ${
              darkMode
                ? 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 hover:border-amber-300 shadow-lg shadow-amber-500/10 hover:scale-105 active:scale-95'
                : 'bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/40 hover:border-indigo-300 shadow-lg shadow-indigo-500/10 hover:scale-105 active:scale-95'
            }`}
            title={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Cambiar Modo Claro/Oscuro"
          >
            {darkMode ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-300" />
            )}
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-purple-500/20 px-4 pt-3 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-slate-200">
            <button
              onClick={() => scrollToSection('servicios')}
              className="text-left py-1 hover:text-purple-400"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('cotizador')}
              className="text-left py-1 hover:text-purple-400 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              Cotizador Automático
            </button>
            <button
              onClick={() => scrollToSection('galeria')}
              className="text-left py-1 hover:text-purple-400"
            >
              Galería de Fotos & Reels
            </button>
            <button
              onClick={() => scrollToSection('testimonios')}
              className="text-left py-1 hover:text-purple-400"
            >
              Testimonios de Clientes
            </button>
            <button
              onClick={() => scrollToSection('preguntas')}
              className="text-left py-1 hover:text-purple-400"
            >
              Preguntas Frecuentes
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {currentUserEmail ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (setActiveView) setActiveView(portalMode === 'admin' ? 'admin' : 'client');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-purple-900/40 border border-purple-500/40 rounded-xl text-xs text-purple-200 font-bold flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4 text-purple-400" />
                  <span>Mi Cuenta ({currentUserEmail})</span>
                </button>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-200 font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenAuth) onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-white hover:bg-slate-100 rounded-xl text-xs text-slate-900 font-black flex items-center justify-center gap-2 shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Entrar con Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
