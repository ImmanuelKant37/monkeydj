import React, { useState } from 'react';
import {
  Disc,
  Sparkles,
  Volume2,
  Tv,
  Flame,
  Camera,
  Zap,
  Mic,
  CheckCircle2,
  ChevronRight,
  Info,
  X,
  Plus,
  Video
} from 'lucide-react';
import { ServiceItem, ServicePackage, SiteContent } from '../../types';
import { AppStorage } from '../../services/storage';
import { getPreviewEffectStyles } from '../../utils/previewEffects';

interface ServicesListProps {
  services?: ServiceItem[];
  packages?: ServicePackage[];
  siteContent?: SiteContent;
  onSelectServiceForQuote?: (serviceId: string) => void;
  onSelectPackage?: (pkg: ServicePackage) => void;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  packages,
  siteContent: propContent,
  onSelectServiceForQuote,
  onSelectPackage
}) => {
  const content = propContent || AppStorage.getSiteContent();
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedModalService, setSelectedModalService] = useState<ServiceItem | null>(null);

  const servicesPreviewStyles = getPreviewEffectStyles(content, { scope: 'services' });

  const availableServices = services && services.length > 0 ? services : AppStorage.getServices();

  const categories = [
    { id: 'todos', name: 'Todos los Servicios' },
    { id: 'DJ', name: 'DJ & Animación' },
    { id: 'Sonido', name: 'Sonido High Fidelity' },
    { id: 'Iluminación', name: 'Iluminación & Luces' },
    { id: 'Efectos', name: 'Show Robot & FX' },
    { id: 'Pantallas', name: 'Pantallas LED' },
    { id: 'Extras', name: 'Cabina Fotos & Extras' }
  ];

  const filteredServices = availableServices.filter((s) => {
    if (!s.active) return false;
    if (activeCategory === 'todos') return true;
    if (activeCategory === 'DJ') return s.category === 'DJ' || s.category === 'Animación';
    return s.category === activeCategory;
  });

  return (
    <section id="servicios" className="py-20 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>{content.servicesTag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {content.servicesTitle}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            {content.servicesSubtitle}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all backdrop-blur-md ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/25 overflow-hidden shadow-2xl hover:bg-white/[0.08] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Media Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className={`w-full h-full object-cover filter brightness-90 ${servicesPreviewStyles.className}`}
                    style={servicesPreviewStyles.style}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent pointer-events-none"></div>
                  
                  {service.featured && (
                    <span className="absolute top-3 left-3 bg-blue-500/30 text-blue-300 border border-blue-400/50 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      MÁS SOLICITADO
                    </span>
                  )}

                  {service.videoUrl && (
                    <span className="absolute top-3 right-3 bg-rose-600/90 text-white border border-rose-400/50 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Video className="w-3 h-3" /> DEMO VIDEO
                    </span>
                  )}

                  <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md text-slate-200 border border-white/10 text-xs font-semibold px-2.5 py-0.5 rounded-lg">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-lg text-white group-hover:text-blue-300 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  {/* Specs List preview */}
                  {service.specs && service.specs.length > 0 && (
                    <div className="pt-2 space-y-1">
                      {service.specs.slice(0, 2).map((spec, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 border-t border-slate-800/60 mt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Precio Base</p>
                  <p className="text-xl font-extrabold text-amber-300">
                    ${service.basePrice.toLocaleString('es-AR')}
                    <span className="text-xs text-slate-400 font-normal ml-1">
                      /{service.unit}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedModalService(service)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    title="Ver detalles completos"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (onSelectServiceForQuote) {
                        onSelectServiceForQuote(service.id);
                      } else {
                        const el = document.getElementById('cotizador');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-purple-600/30 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Cotizar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-white relative">
            <button
              onClick={() => setSelectedModalService(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-5">
              <div className="relative h-64 rounded-2xl overflow-hidden">
                <img
                  src={selectedModalService.imageUrl}
                  alt={selectedModalService.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <span className="absolute bottom-3 left-3 bg-purple-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                  {selectedModalService.category}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">
                  {selectedModalService.name}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mt-2">
                  {selectedModalService.description}
                </p>
              </div>

              {selectedModalService.videoUrl && (
                <div className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-rose-400" /> Video / Reel Demostrativo
                  </h4>
                  {selectedModalService.videoUrl.startsWith('data:video') || selectedModalService.videoUrl.endsWith('.mp4') ? (
                    <video
                      controls
                      src={selectedModalService.videoUrl}
                      className="w-full max-h-64 rounded-xl bg-black"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-300 font-medium truncate max-w-xs">
                        {selectedModalService.videoUrl}
                      </span>
                      <a
                        href={selectedModalService.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                      >
                        Ver Video Demo
                      </a>
                    </div>
                  )}
                </div>
              )}

              {selectedModalService.specs && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Especificaciones Técnicas e Inclusiones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedModalService.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-xs text-slate-400">Costo Base Configurado</p>
                  <p className="text-2xl font-black text-amber-300">
                    ${selectedModalService.basePrice.toLocaleString('es-AR')}
                    <span className="text-xs font-normal text-slate-400 ml-1">
                      /{selectedModalService.unit}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (onSelectServiceForQuote) {
                      onSelectServiceForQuote(selectedModalService.id);
                    } else {
                      const el = document.getElementById('cotizador');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                    setSelectedModalService(null);
                  }}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/40 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Agregar al Cotizador Automático</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
