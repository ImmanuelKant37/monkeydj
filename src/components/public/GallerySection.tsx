import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Play,
  Film,
  Maximize2,
  X,
  Tag
} from 'lucide-react';

import { GalleryItem, EventType } from '../../types';

interface GallerySectionProps {
  items: GalleryItem[];
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryItem | null>(null);

  const categories = [
    'Todas',
    'Casamiento',
    'Cumpleaños de XV',
    'Evento Empresarial',
    'Fiesta de Egreso',
    'Cumpleaños Adultos',
    'Otros'
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'Todas') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="galeria" className="py-20 bg-transparent text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-4 h-4 text-blue-400" />
            <span>Portafolio Audiovisual Vivo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            GALERÍA DE FOTOS, VIDEOS Y REELS
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Revive el impacto visual de nuestras producciones en salones y estancias destacadas.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all backdrop-blur-md ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400 scale-105'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry / Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMediaModal(item)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md"
            >
              <img
                src={item.thumbnailUrl || item.mediaUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-90 group-hover:brightness-100"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Top Type Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-blue-300 text-[10px] font-bold uppercase flex items-center gap-1 shadow-lg">
                  {item.mediaType === 'reel' ? (
                    <>
                      <Film className="w-3 h-3 text-pink-400" /> REEL
                    </>
                  ) : item.mediaType === 'video' ? (
                    <>
                      <Play className="w-3 h-3 text-emerald-400" /> VIDEO
                    </>
                  ) : (
                    <>
                      <Camera className="w-3 h-3 text-amber-400" /> FOTO
                    </>
                  )}
                </span>
              </div>

              {/* Center Play Icon for Video/Reels */}
              {(item.mediaType === 'video' || item.mediaType === 'reel') && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-purple-600/80 text-white flex items-center justify-center backdrop-blur-sm group-hover:scale-125 transition-transform shadow-lg shadow-purple-600/40">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
              )}

              {/* Bottom Info */}
              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <p className="text-xs text-purple-400 font-semibold">{item.category}</p>
                <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                  {item.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-4xl w-full p-4 text-white relative overflow-hidden shadow-2xl">
            <button
              onClick={() => setActiveMediaModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="relative max-h-[70vh] rounded-2xl overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={activeMediaModal.mediaUrl}
                  alt={activeMediaModal.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-2 space-y-2">
                <span className="text-xs text-purple-400 font-bold uppercase">
                  {activeMediaModal.category}
                </span>
                <h3 className="text-xl font-bold">{activeMediaModal.title}</h3>
                <p className="text-xs text-slate-400">{activeMediaModal.eventTitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
