import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Camera,
  Play,
  Pause,
  Film,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar
} from 'lucide-react';

import { GalleryItem, SiteContent } from '../../types';
import { AppStorage } from '../../services/storage';
import { getPreviewEffectStyles } from '../../utils/previewEffects';
import { GalleryTimeline } from './GalleryTimeline';

interface GallerySectionProps {
  items: GalleryItem[];
  siteContent?: SiteContent;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ items: propItems, siteContent: propContent }) => {
  const content = propContent || AppStorage.getSiteContent();
  const allItems = (propItems && propItems.length > 0) ? propItems : AppStorage.getGallery();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryItem | null>(null);

  const galleryPreviewStyles = getPreviewEffectStyles(content, { scope: 'gallery' });

  const currentItem: GalleryItem | undefined = allItems[currentIndex] || allItems[0];

  const nextSlide = useCallback(() => {
    if (allItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % allItems.length);
  }, [allItems.length]);

  const prevSlide = useCallback(() => {
    if (allItems.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
  }, [allItems.length]);

  // Autoplay effect for panoramic
  useEffect(() => {
    if (!isAutoPlaying || isHovered || allItems.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, allItems.length, nextSlide]);

  // Keyboard navigation for modal and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMediaModal(null);
      } else if (activeMediaModal) {
        const currIdx = allItems.findIndex((item) => item.id === activeMediaModal.id);
        if (currIdx !== -1) {
          if (e.key === 'ArrowRight') {
            const nextIdx = (currIdx + 1) % allItems.length;
            setActiveMediaModal(allItems[nextIdx]);
          } else if (e.key === 'ArrowLeft') {
            const prevIdx = (currIdx - 1 + allItems.length) % allItems.length;
            setActiveMediaModal(allItems[prevIdx]);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaModal, allItems]);

  const handleModalNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMediaModal || allItems.length === 0) return;
    const currIdx = allItems.findIndex((item) => item.id === activeMediaModal.id);
    const nextIdx = (currIdx + 1) % allItems.length;
    setActiveMediaModal(allItems[nextIdx]);
  };

  const handleModalPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeMediaModal || allItems.length === 0) return;
    const currIdx = allItems.findIndex((item) => item.id === activeMediaModal.id);
    const prevIdx = (currIdx - 1 + allItems.length) % allItems.length;
    setActiveMediaModal(allItems[prevIdx]);
  };

  return (
    <section id="galeria" className="pt-6 sm:pt-10 pb-12 sm:pb-16 bg-transparent text-white relative overflow-hidden">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-4xl h-72 bg-gradient-to-r from-purple-600/15 via-blue-600/15 to-pink-600/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* ======================================================== */}
        {/* 1. GRAND PANORAMIC SPOTLIGHT CAROUSEL (PORTADA)          */}
        {/* ======================================================== */}
        {allItems.length > 0 && currentItem ? (
          <div
            className="relative group max-w-6xl mx-auto w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer Decorative Neon Halo & Glow Frame */}
            <div className="absolute -inset-1 sm:-inset-1.5 rounded-[2.2rem] bg-gradient-to-r from-purple-600/40 via-blue-500/40 to-pink-500/40 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Panoramic Container */}
            <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/20 bg-slate-950/90 shadow-2xl shadow-purple-950/60 backdrop-blur-xl">
              
              {/* Aspect Ratio Box: Panoramic 21:9 on desktop, 16:9 on tablet, 4:3 on mobile */}
              <div
                onClick={() => setActiveMediaModal(currentItem)}
                className="relative w-full h-[340px] sm:h-[460px] lg:h-[520px] cursor-pointer overflow-hidden select-none"
              >
                {/* Blurred Ambient Backdrop of current media */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-40 transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${currentItem.thumbnailUrl || currentItem.mediaUrl})`
                  }}
                />

                {/* Main Panoramic Image / Media with smooth fade animation */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                  <img
                    key={currentItem.id}
                    src={currentItem.thumbnailUrl || currentItem.mediaUrl}
                    alt={currentItem.title}
                    className={`w-full h-full object-cover sm:object-contain object-center ${galleryPreviewStyles.className}`}
                    style={galleryPreviewStyles.style}
                  />
                </div>

                {/* Cinematic Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/40 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80 opacity-60" />

                {/* Top Floating Badge Bar */}
                <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between pointer-events-none z-20">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl">
                      {currentItem.mediaType === 'reel' ? (
                        <>
                          <Film className="w-3.5 h-3.5 text-pink-400 animate-pulse" /> REEL SPOTLIGHT
                        </>
                      ) : currentItem.mediaType === 'video' ? (
                        <>
                          <Play className="w-3.5 h-3.5 text-emerald-400" /> VIDEO SHOW
                        </>
                      ) : (
                        <>
                          <Camera className="w-3.5 h-3.5 text-amber-400" /> FOTOGRAFÍA OFICIAL
                        </>
                      )}
                    </span>

                    <span className="px-3.5 py-1.5 rounded-full bg-purple-900/70 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-bold uppercase shadow-lg">
                      {currentItem.category}
                    </span>

                    {currentItem.location && (
                      <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 text-xs font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        {currentItem.location}
                      </span>
                    )}

                    {currentItem.date && (
                      <span className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 text-xs font-semibold">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        {currentItem.date}
                      </span>
                    )}
                  </div>

                  {/* Fullscreen Hint Pill */}
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-medium shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver pantalla completa</span>
                  </div>
                </div>

                {/* Center Play Button for Video/Reels */}
                {(currentItem.mediaType === 'video' || currentItem.mediaType === 'reel') && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-2xl shadow-purple-600/60 ring-4 ring-white/30 transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 sm:w-10 h-8 sm:h-10 fill-current ml-1" />
                    </div>
                  </div>
                )}

                {/* Bottom Decorated Details Overlay */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-20">
                  <div className="space-y-2 max-w-xl text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 text-[11px] font-semibold tracking-wide">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{currentItem.eventTitle || 'Producción Monkey DJ'}</span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow-md leading-tight">
                      {currentItem.title}
                    </h3>

                    {/* Venue & Location if available */}
                    {currentItem.venue && (
                      <p className="text-xs text-purple-300 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3 h-3 text-pink-400" />
                        <span>{currentItem.venue} {currentItem.location ? `• ${currentItem.location}` : ''}</span>
                      </p>
                    )}

                    {/* Tags */}
                    {currentItem.tags && currentItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {currentItem.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-purple-300 border border-purple-500/30 backdrop-blur-md"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Panoramic Controls & Counter Widget */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl self-start sm:self-auto"
                  >
                    <button
                      onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                      title={isAutoPlaying ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                        isAutoPlaying ? 'text-purple-400 hover:text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="h-4 w-px bg-slate-700" />

                    <div className="text-xs font-black tracking-wider text-white">
                      <span className="text-purple-400 text-sm">{String(currentIndex + 1).padStart(2, '0')}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{String(allItems.length).padStart(2, '0')}</span>
                    </div>

                    <div className="h-4 w-px bg-slate-700" />

                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevSlide}
                        aria-label="Foto anterior"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextSlide}
                        aria-label="Siguiente foto"
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left & Right Big Navigation Chevrons */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevSlide();
                  }}
                  aria-label="Anterior elemento panorámico"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-slate-950/70 hover:bg-purple-600 text-white border border-white/20 hover:border-purple-400 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="w-6 sm:w-7 h-6 sm:h-7" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  aria-label="Siguiente elemento panorámico"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-slate-950/70 hover:bg-purple-600 text-white border border-white/20 hover:border-purple-400 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 cursor-pointer"
                >
                  <ChevronRight className="w-6 sm:w-7 h-6 sm:h-7" />
                </button>

                {/* Active Progress Line at the very bottom */}
                {isAutoPlaying && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
                    <div
                      key={currentIndex}
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 animate-[progress_5s_linear]"
                    />
                  </div>
                )}
              </div>

              {/* Panoramic Thumbnail Strip */}
              <div className="bg-slate-950/95 border-t border-white/10 px-4 sm:px-6 py-3.5 flex items-center gap-3 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider shrink-0 hidden md:inline">
                  PRODUCCIONES:
                </span>
                <div className="flex items-center gap-2.5 flex-nowrap">
                  {allItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-16 sm:w-20 h-11 sm:h-13 rounded-xl overflow-hidden shrink-0 transition-all duration-300 border-2 cursor-pointer ${
                        currentIndex === idx
                          ? 'border-purple-500 scale-105 shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/40'
                          : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={item.thumbnailUrl || item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      {(item.mediaType === 'video' || item.mediaType === 'reel') && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 text-white fill-current" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            <Camera className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-300 font-bold">No hay producciones disponibles.</p>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. TIMELINE ACCORDION SECTION (BY YEARS & MINIMIZED MONTHS) */}
        {/* ======================================================== */}
        <div>
          {allItems.length > 0 ? (
            <GalleryTimeline
              items={allItems}
              onSelectMedia={(item) => setActiveMediaModal(item)}
              previewStyles={galleryPreviewStyles}
            />
          ) : (
            <div className="text-center py-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <p className="text-slate-400 text-sm">No se encontraron eventos en la línea de tiempo.</p>
            </div>
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. FULL-SCREEN LIGHTBOX MODAL WITH CYCLING & KEYBOARD    */}
      {/* ======================================================== */}
      {activeMediaModal && (
        <div
          onClick={() => setActiveMediaModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/95 backdrop-blur-xl animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-purple-500/40 rounded-3xl max-w-5xl w-full p-4 sm:p-6 text-white relative overflow-hidden shadow-2xl cursor-default flex flex-col max-h-[92vh]"
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-black uppercase">
                  {activeMediaModal.category}
                </span>
                {activeMediaModal.location && (
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                    {activeMediaModal.location}
                  </span>
                )}
                {activeMediaModal.date && (
                  <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {activeMediaModal.date}
                  </span>
                )}
                <span className="text-xs text-slate-400 hidden md:inline">
                  {allItems.findIndex((i) => i.id === activeMediaModal.id) + 1} de {allItems.length}
                </span>
              </div>
              <button
                onClick={() => setActiveMediaModal(null)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content Box */}
            <div className="relative flex-1 min-h-[300px] max-h-[58vh] my-4 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              {activeMediaModal.mediaType === 'video' || activeMediaModal.mediaType === 'reel' ? (
                <video
                  src={activeMediaModal.mediaUrl}
                  poster={activeMediaModal.thumbnailUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[58vh] object-contain rounded-xl"
                />
              ) : (
                <img
                  src={activeMediaModal.mediaUrl || activeMediaModal.thumbnailUrl}
                  alt={activeMediaModal.title}
                  className="max-w-full max-h-[58vh] object-contain rounded-xl"
                />
              )}

              {/* Prev/Next in Modal */}
              {allItems.length > 1 && (
                <>
                  <button
                    onClick={handleModalPrev}
                    aria-label="Anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleModalNext}
                    aria-label="Siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/20 transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Details */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 border-t border-slate-800">
              <div className="text-left space-y-1">
                <h4 className="text-lg font-black text-white">{activeMediaModal.title}</h4>
                <p className="text-xs text-slate-400">
                  {activeMediaModal.eventTitle || 'Producción Oficial Monkey DJ'}
                  {activeMediaModal.venue ? ` • Salón: ${activeMediaModal.venue}` : ''}
                </p>
              </div>

              {activeMediaModal.tags && activeMediaModal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeMediaModal.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/60 text-purple-300 border border-purple-500/30"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
