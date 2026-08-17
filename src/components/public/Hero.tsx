import React from 'react';
import {
  Sparkles,
  Calendar,
  CheckCircle2,
  Volume2,
  Flame,
  Award,
  Users,
  Music,
  Camera
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

export const Hero: React.FC<HeroProps> = ({
  branch,
  siteContent: propContent,
  onOpenQuote,
  onOpenQuoteModal,
  onOpenServices
}) => {
  const content = propContent || AppStorage.getSiteContent();
  const handleQuoteClick = onOpenQuote || onOpenQuoteModal || (() => {});
  const city = branch?.city || 'Buenos Aires';

  const scrollToGallery = () => {
    const el = document.getElementById('galeria');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[60vh] sm:min-h-[65vh] flex flex-col items-center justify-center bg-slate-950 overflow-hidden pt-12 sm:pt-16 pb-12 sm:pb-16">
      {/* Background Ambient Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/25 via-transparent to-transparent" />
      </div>

      {/* Dynamic Visual Equalizer Waves Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-between px-4 opacity-25 pointer-events-none z-0">
        {Array.from({ length: 36 }).map((_, i) => {
          return (
            <div
              key={i}
              className="w-1.5 bg-gradient-to-t from-purple-600 via-pink-500 to-indigo-400 rounded-t-full animate-bounce"
              style={{
                animationDuration: `${0.6 + (i % 7) * 0.2}s`,
                animationDelay: `${(i % 5) * 0.1}s`
              }}
            />
          );
        })}
      </div>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10 space-y-8">
        
        {/* ======================================================== */}
        {/* CABECERA HEADLINE & ACTIONS                              */}
        {/* ======================================================== */}
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/15 backdrop-blur-xl text-blue-300 text-xs sm:text-sm font-semibold shadow-2xl">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span>{content.heroTag}</span>
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ml-1 font-bold">
              {city}
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleQuoteClick}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-base shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group border border-white/20 cursor-pointer"
            >
              <Flame className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>{content.heroCtaQuoteText || 'COTIZAR MI EVENTO AHORA'}</span>
            </button>

            <button
              onClick={scrollToGallery}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-400/40 font-bold text-base hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xl shadow-xl cursor-pointer"
            >
              <Camera className="w-5 h-5 text-pink-400" />
              <span>VER GALERÍA & PRODUCCIONES</span>
            </button>

            <button
              onClick={onOpenServices}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xl shadow-xl cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-blue-400" />
              <span>SERVICIOS</span>
            </button>
          </div>

          {/* Feature Highlights Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-slate-200 text-xs sm:text-sm font-medium">
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
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
              <Award className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white font-mono">12+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Años de Trayectoria</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
              <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white font-mono">1,400+</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Eventos Realizados</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
              <Users className="w-6 h-6 text-pink-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white font-mono">99.8%</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Clientes Satisfechos</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all shadow-xl">
              <Music className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-black text-white font-mono">45,000W</p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Potencia Disponible</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
