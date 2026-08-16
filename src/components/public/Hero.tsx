import React from 'react';
import {
  Sparkles,
  Play,
  Calendar,
  CheckCircle2,
  Volume2,
  Flame,
  Award,
  Users,
  Music
} from 'lucide-react';
import { Branch, SiteContent } from '../../types';
import { AppStorage } from '../../services/storage';

interface HeroProps {
  branch?: Branch;
  siteContent?: SiteContent;
  onOpenQuote?: () => void;
  onOpenQuoteModal?: () => void;
  onOpenServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ branch, siteContent: propContent, onOpenQuote, onOpenQuoteModal, onOpenServices }) => {
  const content = propContent || AppStorage.getSiteContent();
  const handleQuoteClick = onOpenQuote || onOpenQuoteModal || (() => {});
  const city = branch?.city || 'Buenos Aires';
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center bg-slate-950 overflow-hidden pt-8 pb-16">
      {/* Background Media Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1920&q=80"
          alt="DJ Live Show"
          className="w-full h-full object-cover opacity-25 filter brightness-50 contrast-125 scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
      </div>

      {/* Dynamic Visual Equalizer Waves Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-4 opacity-30 pointer-events-none">
        {Array.from({ length: 36 }).map((_, i) => {
          const heights = ['h-6', 'h-12', 'h-16', 'h-20', 'h-10', 'h-8'];
          return (
            <div
              key={i}
              className={`w-1.5 bg-gradient-to-t from-purple-600 via-pink-500 to-indigo-400 rounded-t-full animate-bounce`}
              style={{
                animationDuration: `${0.6 + (i % 7) * 0.2}s`,
                animationDelay: `${(i % 5) * 0.1}s`
              }}
            ></div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-8">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-xl text-blue-300 text-xs sm:text-sm font-semibold shadow-2xl">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
          <span>{content.heroTag}</span>
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-1 font-bold">
            {city}
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            {content.heroTitleLine1}
            <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
              {content.heroTitleLine2}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            {content.heroSubtitle}
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={handleQuoteClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group border border-white/20"
          >
            <Flame className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{content.heroCtaQuoteText || 'COTIZAR MI EVENTO AHORA'}</span>
          </button>


          <button
            onClick={onOpenServices}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xl shadow-xl"
          >
            <Volume2 className="w-5 h-5 text-blue-400" />
            <span>EXPLORAR SERVICIOS</span>
          </button>
        </div>

        {/* Feature Highlights Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4 text-slate-200 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Presupuestos 100% Personalizables</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Garantía Anti Cero Fallas</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Contrato Digital y Factura Oficial</span>
          </div>
        </div>

        {/* Real-time Stats Grid */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
            <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white font-mono">12+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Años de Trayectoria</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white font-mono">1,400+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Eventos Realizados</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
            <Users className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white font-mono">99.8%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Clientes Satisfechos</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
            <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-white font-mono">45,000W</p>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Potencia Disponible</p>
          </div>
        </div>
      </div>
    </section>
  );
};
