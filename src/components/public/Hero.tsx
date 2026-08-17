import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  Calendar,
  CheckCircle2,
  Volume2,
  Flame,
  Award,
  Users,
  Music,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Film
} from 'lucide-react';
import { Branch, SiteContent, GalleryItem } from '../../types';
import { AppStorage } from '../../services/storage';

interface HeroProps {
  branch?: Branch;
  siteContent?: SiteContent;
  gallery?: GalleryItem[];
  onOpenQuote?: () => void;
  onOpenQuoteModal?: () => void;
  onOpenServices?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  branch,
  siteContent: propContent,
  gallery: propGallery,
  onOpenQuote,
  onOpenQuoteModal,
  onOpenServices
}) => {
  const content = propContent || AppStorage.getSiteContent();
  const handleQuoteClick = onOpenQuote || onOpenQuoteModal || (() => {});
  const city = branch?.city || 'Buenos Aires';

  // Gallery items for the header carousel
  const items: GalleryItem[] = (propGallery && propGallery.length > 0)
    ? propGallery
    : AppStorage.getGallery();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [activeMediaModal, setActiveMediaModal] = useState<GalleryItem | null>(null);

  useEffect(() => {
    if (currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  const currentItem: GalleryItem | undefined = items[currentIndex] || items[0];

  const nextSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay rotation
  useEffect(() => {
    if (!isAutoPlaying || isHovered || items.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, items.length, nextSlide]);

  // Lightbox keyboard controls
  useEffect(() => {
    if (!activeMediaModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMediaModal(null);
      } else if (e.key === 'ArrowRight') {
        const curIdx = items.findIndex((i) => i.id === activeMediaModal.id);
        if (curIdx !== -1) {
          const nextIdx = (curIdx + 1) % items.length;
          setActiveMediaModal(items[nextIdx]);
        }
      } else if (e.key === 'ArrowLeft') {
        const curIdx = items.findIndex((i) => i.id === activeMediaModal.id);
        if (curIdx !== -1) {
          const prevIdx = (curIdx - 1 + items.length) % items.length;
          setActiveMediaModal(items[prevIdx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeMediaModal, items]);

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center bg-slate-950 overflow-hidden pt-6 sm:pt-10 pb-16">
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

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        
        {/* ======================================================== */}
        {/* 1. PANORAMIC CAROUSEL IN THE CABECERA (ABOVE THE TITLE) */}
        {/* ======================================================== */}
        {items.length > 0 && currentItem && (
          <div
            className="relative group max-w-6xl mx-auto w-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer Decorative Neon Glow Frame */}
            <div className="absolute -inset-1 sm:-inset-1.5 rounded-[2.2rem] bg-gradient-to-r from-purple-600/40 via-blue-500/40 to-pink-500/40 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Panoramic Screen Container */}
            <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/20 bg-slate-950/90 shadow-2xl shadow-purple-950/70 backdrop-blur-xl">
              
              {/* Aspect Ratio Box: Panoramic viewport */}
              <div
                onClick={() => setActiveMediaModal(currentItem)}
                className="relative w-full h-[320px] sm:h-[440px] lg:h-[500px] cursor-pointer overflow-hidden select-none"
              >
                {/* Blurred Ambient Backdrop of current media */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl scale-125 opacity-40 transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${currentItem.thumbnailUrl || currentItem.mediaUrl})`
                  }}
                />

                {/* Main Panoramic Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    key={currentItem.id}
                    src={currentItem.thumbnailUrl || currentItem.mediaUrl}
                    alt={currentItem.title}
                    className="w-full h-full object-cover sm:object-contain object-center transition-all duration-700 animate-in fade-in zoom-in-95"
                  />
                </div>

                {/* Cinematic Vignette & Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/50 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-transparent to-slate-950/70 opacity-60" />

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
                          <Camera className="w-3.5 h-3.5 text-amber-400" /> FOTOGRAFÍA EN VIVO
                        </>
                      )}
                    </span>

                    <span className="px-3.5 py-1.5 rounded-full bg-purple-900/70 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-bold uppercase shadow-lg">
                      {currentItem.category}
                    </span>

                    <span className="hidden md:inline-flex px-3 py-1.5 rounded-full bg-blue-900/60 backdrop-blur-md border border-blue-400/40 text-blue-200 text-xs font-bold uppercase shadow-lg">
                      {city}
                    </span>
                  </div>

                  {/* Fullscreen Hint Pill */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-medium shadow-lg">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
                    <span className="hidden sm:inline">Ver pantalla completa</span>
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
                  <div className="space-y-1.5 max-w-xl text-left">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 text-[11px] font-semibold tracking-wide">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{currentItem.eventTitle || 'Producción Monkey DJ'}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white drop-shadow-md leading-tight">
                      {currentItem.title}
                    </h3>

                    {/* Tags */}
                    {currentItem.tags && currentItem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {currentItem.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900/80 text-purple-300 border border-purple-500/30 backdrop-blur-md"
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
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isAutoPlaying ? 'text-purple-400 hover:text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="h-4 w-px bg-slate-700" />

                    <div className="text-xs font-black tracking-wider text-white">
                      <span className="text-purple-400 text-sm">{String(currentIndex + 1).padStart(2, '0')}</span>
                      <span className="text-slate-500 mx-1">/</span>
                      <span className="text-slate-400">{String(items.length).padStart(2, '0')}</span>
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
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 animate-[progress_4.5s_linear]"
                    />
                  </div>
                )}
              </div>

              {/* Panoramic Thumbnail Strip */}
              <div className="bg-slate-950/95 border-t border-white/10 px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider shrink-0 hidden md:inline">
                  PRODUCCIONES:
                </span>
                <div className="flex items-center gap-2.5 flex-nowrap">
                  {items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`relative w-14 sm:w-18 h-10 sm:h-12 rounded-xl overflow-hidden shrink-0 transition-all duration-300 border-2 cursor-pointer ${
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
                          <Play className="w-3 h-3 text-white fill-current" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. CABECERA HEADLINE & ACTIONS (BELOW CAROUSEL)          */}
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
              onClick={onOpenServices}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-base hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xl shadow-xl cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-blue-400" />
              <span>EXPLORAR SERVICIOS</span>
            </button>
          </div>

          {/* Feature Highlights Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-slate-200 text-xs sm:text-sm font-medium">
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
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
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

      {/* ======================================================== */}
      {/* FULL-SCREEN LIGHTBOX MODAL FOR CABECERA CAROUSEL         */}
      {/* ======================================================== */}
      {activeMediaModal && (
        <div
          onClick={() => setActiveMediaModal(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-300"
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveMediaModal(null)}
            className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all border border-white/20 cursor-pointer shadow-xl"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Right Arrows in Lightbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const curIdx = items.findIndex((i) => i.id === activeMediaModal.id);
              if (curIdx !== -1) {
                const prevIdx = (curIdx - 1 + items.length) % items.length;
                setActiveMediaModal(items[prevIdx]);
              }
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-2xl hover:scale-110"
            aria-label="Anterior elemento"
          >
            <ChevronLeft className="w-7 sm:w-9 h-7 sm:h-9" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const curIdx = items.findIndex((i) => i.id === activeMediaModal.id);
              if (curIdx !== -1) {
                const nextIdx = (curIdx + 1) % items.length;
                setActiveMediaModal(items[nextIdx]);
              }
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-black/60 hover:bg-purple-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-2xl hover:scale-110"
            aria-label="Siguiente elemento"
          >
            <ChevronRight className="w-7 sm:w-9 h-7 sm:h-9" />
          </button>

          {/* Modal Content Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[90vh] bg-slate-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] max-h-[68vh]">
              {activeMediaModal.mediaType === 'video' || activeMediaModal.mediaType === 'reel' ? (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <video
                    src={activeMediaModal.mediaUrl}
                    poster={activeMediaModal.thumbnailUrl}
                    controls
                    autoPlay
                    className="max-h-[65vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain"
                  />
                </div>
              ) : (
                <img
                  src={activeMediaModal.mediaUrl}
                  alt={activeMediaModal.title}
                  className="max-h-[68vh] w-auto max-w-full object-contain"
                />
              )}
            </div>

            {/* Modal Bottom Metadata */}
            <div className="p-6 bg-slate-900 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold uppercase">
                    {activeMediaModal.category}
                  </span>
                  {activeMediaModal.eventTitle && (
                    <span className="text-xs text-slate-400">
                      {activeMediaModal.eventTitle}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeMediaModal.title}
                </h3>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeMediaModal.tags?.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

