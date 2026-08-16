import React from 'react';
import {
  Disc,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  ShieldCheck,
  Award,
  Sparkles,
  Download
} from 'lucide-react';
import { Branch } from '../../types';
import { MonkeyLogo } from './MonkeyLogo';
import { AppStorage } from '../../services/storage';

interface FooterProps {
  branches?: Branch[];
  onSelectBranch?: (b: Branch) => void;
  setPortalMode?: (mode: 'public' | 'client' | 'admin') => void;
  setActiveView?: (v: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  branches,
  onSelectBranch,
  setPortalMode,
  setActiveView
}) => {
  const branchList = branches && branches.length > 0 ? branches : AppStorage.getBranches();
  return (
    <footer className="bg-black/60 backdrop-blur-2xl text-slate-400 border-t border-white/10 pt-16 pb-12 relative overflow-hidden">
      {/* Glow ambient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-purple-600/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center p-1">
                  <MonkeyLogo size={32} />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-tight">
                  Monkey <span className="text-yellow-400">DJ</span> - Sonido y animacion
                </span>
                <p className="text-xs text-yellow-400 font-medium">
                  Sonido, DJ y animacion
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              MonkeyDJ brinda cobertura profesional en Concordia (Entre Ríos) y Posadas (Misiones). Más de 12 años transformando casamientos, quince años, galas empresariales y eventos en fiestas inolvidables con sonido Line Array, iluminación robótica, robot LED y DJs residentes.
            </p>

            <div className="flex items-center gap-3 text-white">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:text-blue-400 transition-all backdrop-blur-md"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:text-blue-400 transition-all backdrop-blur-md"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 hover:text-blue-400 transition-all backdrop-blur-md"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-blue-300">
              Servicios
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">DJ & Set Live Mixing</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Sonido Line Array RCF</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Iluminación Inteligente</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Show de Robot LED CO2</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Pantalla LED HD P3.9</a></li>
              <li><a href="#servicios" className="hover:text-blue-400 transition-colors">Cabina de Fotos Touch</a></li>
            </ul>
          </div>

          {/* Branches list */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-blue-300">
              Nuestras Sucursales
            </h4>
            <ul className="space-y-3 text-xs">
              {branchList.map((b) => (
                <li
                  key={b.id}
                  onClick={() => {
                    if (onSelectBranch) onSelectBranch(b);
                  }}
                  className="cursor-pointer group hover:text-blue-300 transition-colors"
                >
                  <p className="font-semibold text-slate-200 group-hover:text-blue-300">
                    {b.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{b.address}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Security Info */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-yellow-400">
              Garantía y Calidad
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>
                Equipamiento de nivel internacional con respaldo técnico en vivo y grupos electrógenos propios.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Respaldo Energético & Equipos Homologados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MonkeyDJ. Todos los derechos reservados. Concordia (Entre Ríos) & Posadas (Misiones).</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Empresa Certificada en Eventos
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              PWA Ready
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
