import React, { useState } from 'react';
import {
  Layout,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  Edit3,
  Type,
  FileText,
  Camera,
  ZoomIn,
  ZoomOut,
  Move,
  Sliders,
  Compass,
  MousePointer,
  Square,
  Play,
  Layers,
  Gauge,
  SlidersHorizontal,
  Check,
  RefreshCw
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { SiteContent, PreviewEffectType, PreviewSpeedType } from '../../types';
import { INITIAL_SITE_CONTENT } from '../../data/initialData';
import {
  PREVIEW_EFFECT_OPTIONS,
  PREVIEW_SPEED_OPTIONS,
  getPreviewEffectStyles
} from '../../utils/previewEffects';

const SAMPLE_PREVIEW_IMAGES = [
  {
    id: 'dj-main',
    name: 'Cabina DJ & Luces',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'wedding',
    name: 'Boda de Gala',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'xv-party',
    name: 'Fiesta de 15 & Láseres',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'robot-led',
    name: 'Show Robot LED CO2',
    url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'
  }
];

export const SiteContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(AppStorage.getSiteContent());
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'effects' | 'hero' | 'services' | 'faq' | 'banner'>('effects');
  const [selectedSampleImage, setSelectedSampleImage] = useState(SAMPLE_PREVIEW_IMAGES[0].url);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    AppStorage.saveSiteContent(content);
    showToast('¡Ajustes y Efectos de Portada guardados exitosamente!');
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer todos los textos y efectos visuales a sus valores originales?')) {
      setContent(INITIAL_SITE_CONTENT);
      AppStorage.saveSiteContent(INITIAL_SITE_CONTENT);
      showToast('Configuración restablecida a los valores por defecto.');
    }
  };

  const currentEffect: PreviewEffectType = content.previewEffect || 'ken-burns';
  const currentSpeed: PreviewSpeedType = content.previewSpeed || 'slow';
  const hoverZoomActive = content.previewHoverZoom !== false;

  const currentPreviewStyles = getPreviewEffectStyles(content);

  const getEffectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5" />;
      case 'ZoomIn': return <ZoomIn className="w-5 h-5" />;
      case 'ZoomOut': return <ZoomOut className="w-5 h-5" />;
      case 'Move': return <Move className="w-5 h-5" />;
      case 'Sliders': return <Sliders className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'MousePointer': return <MousePointer className="w-5 h-5" />;
      default: return <Square className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-pink-600/30 text-pink-300 font-extrabold text-[10px] tracking-wider uppercase border border-pink-500/40">
              Personalización & Efectos Visuales
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-pink-400 animate-pulse" />
            AJUSTES DE PORTADA & EFECTOS DE PREVIEWS
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Controla las animaciones de zoom dinámico, efecto Ken Burns, flotación cinematográfica y los textos principales de la web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restablecer</span>
          </button>
          <button
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR CAMBIOS</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('effects')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'effects'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-purple-600/40 border border-pink-400 scale-105'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-pink-300 animate-pulse" />
          <span>Efectos de Zoom & Movimiento</span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layout className="w-4 h-4 text-blue-300" />
          <span>Sección Hero (Portada)</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'services'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-300" />
          <span>Sección Servicios</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'faq'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Preguntas Frecuentes</span>
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'banner'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Type className="w-4 h-4 text-purple-300" />
          <span>Banner Cotizador</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ======================================================== */}
        {/* 1. VISUAL PREVIEW EFFECTS STUDIO TAB                     */}
        {/* ======================================================== */}
        {activeTab === 'effects' && (
          <div className="space-y-6">
            {/* Live Interactive Preview Box */}
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/40">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-white">Laboratorio de Vista Previa en Vivo</h2>
                    <p className="text-xs text-slate-400">
                      Prueba en tiempo real cómo se moverá cada imagen en la portada pública, galería y servicios.
                    </p>
                  </div>
                </div>

                {/* Sample Image Chooser */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto overflow-x-auto">
                  <span className="text-[10px] font-bold text-slate-400 px-2 uppercase shrink-0">Foto de prueba:</span>
                  {SAMPLE_PREVIEW_IMAGES.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedSampleImage(img.url)}
                      className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                        selectedSampleImage === img.url
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {img.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Simulation Box */}
              <div className="relative group rounded-2xl overflow-hidden border border-white/20 bg-slate-950 shadow-2xl h-64 sm:h-96 flex items-center justify-center select-none">
                {/* Blurred Background Glow */}
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-30 scale-125"
                  style={{ backgroundImage: `url(${selectedSampleImage})` }}
                />

                {/* Main Animated Image */}
                <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                  <img
                    key={`${selectedSampleImage}-${currentEffect}-${currentSpeed}`}
                    src={selectedSampleImage}
                    alt="Simulación de Efecto"
                    className={`w-full h-full object-cover ${currentPreviewStyles.className}`}
                    style={currentPreviewStyles.style}
                  />
                </div>

                {/* Gradients & Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none opacity-80" />

                {/* Live Info Tags on Preview */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-200 text-xs font-black uppercase flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                      Efecto: {PREVIEW_EFFECT_OPTIONS.find(e => e.id === currentEffect)?.name || currentEffect}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 text-xs font-bold uppercase backdrop-blur-md">
                      {PREVIEW_SPEED_OPTIONS.find(s => s.id === currentSpeed)?.name}
                    </span>
                  </div>

                  <span className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-blue-900/70 border border-blue-400/40 text-blue-200 text-xs font-bold uppercase backdrop-blur-md">
                    Pasa el cursor para probar zoom
                  </span>
                </div>

                {/* Bottom Overlay Details */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 pointer-events-none">
                  <div className="space-y-1">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold backdrop-blur-md uppercase tracking-wider">
                      Simulación en tiempo real
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-lg">
                      Monkey DJ Show Live Experience
                    </h3>
                  </div>

                  <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-slate-300 font-bold backdrop-blur-md">
                    {hoverZoomActive ? '🔍 Hover Zoom: Activo' : '🔒 Hover Zoom: Desactivado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Effects Selection Grid */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-purple-400" />
                    Selecciona el Estilo de Movimiento / Zoom
                  </h3>
                  <p className="text-xs text-slate-400">
                    Elige el estilo visual que mejor combine con la identidad de tus eventos:
                  </p>
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  {PREVIEW_EFFECT_OPTIONS.length} Efectos Disponibles
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PREVIEW_EFFECT_OPTIONS.map((opt) => {
                  const isSelected = currentEffect === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setContent({ ...content, previewEffect: opt.id })}
                      className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                        isSelected
                          ? 'bg-gradient-to-b from-purple-950/60 to-slate-900 border-purple-500 shadow-xl shadow-purple-900/30 ring-2 ring-purple-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-purple-500/50 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className={`p-2 rounded-xl transition-colors ${
                            isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-purple-400'
                          }`}>
                            {getEffectIcon(opt.iconName)}
                          </div>
                          
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                            isSelected
                              ? 'bg-pink-500/30 text-pink-300 border-pink-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {opt.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                            {opt.name}
                            {isSelected && <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />}
                          </h4>
                          <p className="text-[11px] text-purple-300 font-semibold mt-0.5">
                            {opt.shortDesc}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 font-medium">Estado:</span>
                        <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                          {isSelected ? '● ACTIVO' : 'Seleccionar'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Animation Speed Selector */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    Velocidad y Ritmo de la Animación
                  </h3>
                  <p className="text-xs text-slate-400">
                    Ajusta los segundos que tarda el ciclo continuo de zoom o paneo:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PREVIEW_SPEED_OPTIONS.map((spd) => {
                  const isSelected = currentSpeed === spd.id;
                  return (
                    <button
                      key={spd.id}
                      type="button"
                      onClick={() => setContent({ ...content, previewSpeed: spd.id })}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/40'
                          : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm">{spd.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <p className={`text-xs mt-1.5 leading-snug ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {spd.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Scope Application & Hover Zoom Switches */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Áreas de Aplicación en el Sitio Web
              </h3>
              <p className="text-xs text-slate-400">
                Selecciona en qué secciones del sitio se aplicará el efecto de movimiento:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={content.previewEnableOnHero !== false}
                    onChange={(e) => setContent({ ...content, previewEnableOnHero: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-lg text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="text-sm font-extrabold text-white block">Portada Principal (Hero Carousel)</span>
                    <span className="text-xs text-slate-400">Aplica el efecto en el carrusel panorámico de cabecera.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={content.previewEnableOnGallery !== false}
                    onChange={(e) => setContent({ ...content, previewEnableOnGallery: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-lg text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="text-sm font-extrabold text-white block">Galería Panorámica & Lightbox</span>
                    <span className="text-xs text-slate-400">Aplica el efecto en la pantalla de fotos/videos y el modal.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={content.previewEnableOnServices !== false}
                    onChange={(e) => setContent({ ...content, previewEnableOnServices: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-lg text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="text-sm font-extrabold text-white block">Tarjetas del Catálogo de Servicios</span>
                    <span className="text-xs text-slate-400">Aplica animación continua en las imágenes de cada servicio.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={hoverZoomActive}
                    onChange={(e) => setContent({ ...content, previewHoverZoom: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded-lg text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <div>
                    <span className="text-sm font-extrabold text-white block">Zoom Adicional al Pasar el Cursor (Hover)</span>
                    <span className="text-xs text-slate-400">Intensifica suavemente el zoom cuando el cliente interactúa con el mouse.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* HERO SECTION EDITING */}
        {activeTab === 'hero' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layout className="w-5 h-5 text-blue-400" />
              Textos de la Cabecera Principal (Hero)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Etiqueta Superior (Badge Tag)</label>
                <input
                  type="text"
                  value={content.heroTag}
                  onChange={(e) => setContent({ ...content, heroTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título Principal - Línea 1</label>
                <input
                  type="text"
                  value={content.heroTitleLine1}
                  onChange={(e) => setContent({ ...content, heroTitleLine1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título Principal - Línea 2 (Destacada)</label>
                <input
                  type="text"
                  value={content.heroTitleLine2}
                  onChange={(e) => setContent({ ...content, heroTitleLine2: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500 text-blue-400"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo / Bajada Descriptiva</label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Botón CTA 1 (Cotizador)</label>
                <input
                  type="text"
                  value={content.heroCtaQuoteText}
                  onChange={(e) => setContent({ ...content, heroCtaQuoteText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Botón CTA 2 (Explorar Servicios)</label>
                <input
                  type="text"
                  value={content.heroCtaServicesText}
                  onChange={(e) => setContent({ ...content, heroCtaServicesText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* SERVICES SECTION EDITING */}
        {activeTab === 'services' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              Encabezados de la Sección de Servicios
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Etiqueta de Sección (Tag)</label>
                <input
                  type="text"
                  value={content.servicesTag}
                  onChange={(e) => setContent({ ...content, servicesTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Título Principal de Servicios</label>
                <input
                  type="text"
                  value={content.servicesTitle}
                  onChange={(e) => setContent({ ...content, servicesTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500 text-cyan-400"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo Descriptivo</label>
                <textarea
                  rows={2}
                  value={content.servicesSubtitle}
                  onChange={(e) => setContent({ ...content, servicesSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* FAQ SECTION EDITING */}
        {activeTab === 'faq' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Encabezados de Preguntas Frecuentes
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Etiqueta de Sección</label>
                <input
                  type="text"
                  value={content.faqTag}
                  onChange={(e) => setContent({ ...content, faqTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Título Principal</label>
                <input
                  type="text"
                  value={content.faqTitle}
                  onChange={(e) => setContent({ ...content, faqTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500 text-amber-400"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo</label>
                <textarea
                  rows={2}
                  value={content.faqSubtitle}
                  onChange={(e) => setContent({ ...content, faqSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* BANNER SECTION EDITING */}
        {activeTab === 'banner' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-lg font-black text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Type className="w-5 h-5 text-purple-400" />
              Banner de Llamado a Cotizar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Etiqueta del Banner</label>
                <input
                  type="text"
                  value={content.quoteBannerTag}
                  onChange={(e) => setContent({ ...content, quoteBannerTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título del Banner</label>
                <input
                  type="text"
                  value={content.quoteBannerTitle}
                  onChange={(e) => setContent({ ...content, quoteBannerTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo / Texto Explicativo</label>
                <textarea
                  rows={2}
                  value={content.quoteBannerSubtitle}
                  onChange={(e) => setContent({ ...content, quoteBannerSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Footer Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:to-blue-500 text-white font-black text-xs shadow-xl flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR Y APLICAR CAMBIOS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
