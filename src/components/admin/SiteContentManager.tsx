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
  FileText
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { SiteContent } from '../../types';
import { INITIAL_SITE_CONTENT } from '../../data/initialData';

export const SiteContentManager: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(AppStorage.getSiteContent());
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'services' | 'faq' | 'banner'>('hero');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AppStorage.saveSiteContent(content);
    showToast('¡Textos de la Landing Page guardados exitosamente!');
  };

  const handleReset = () => {
    if (confirm('¿Deseas restablecer todos los textos de la portada a sus valores originales?')) {
      setContent(INITIAL_SITE_CONTENT);
      AppStorage.saveSiteContent(INITIAL_SITE_CONTENT);
      showToast('Textos restablecidos a los valores por defecto.');
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
            <span className="px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 font-extrabold text-[10px] tracking-wider uppercase border border-blue-500/40">
              Personalización de Portada
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Edit3 className="w-7 h-7 text-blue-400" />
            PERSONALIZADOR DE TEXTOS LANDING PAGE
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Edita los títulos principales, subtítulos y llamados a la acción de la portada pública en tiempo real sin modificar código.
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
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR CAMBIOS</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'hero'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-300" />
          <span>Sección Hero (Portada Principal)</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
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
        {/* HERO SECTION EDITING */}
        {activeTab === 'hero' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Editar Sección Hero (Encabezado de Entrada)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={content.heroTag}
                  onChange={(e) => setContent({ ...content, heroTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título Principal (Línea 1)</label>
                <input
                  type="text"
                  value={content.heroTitleLine1}
                  onChange={(e) => setContent({ ...content, heroTitleLine1: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título Principal (Línea Destacada 2)</label>
                <input
                  type="text"
                  value={content.heroTitleLine2}
                  onChange={(e) => setContent({ ...content, heroTitleLine2: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-purple-300 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Texto Botón Principal (CTA)</label>
                <input
                  type="text"
                  value={content.heroCtaQuoteText}
                  onChange={(e) => setContent({ ...content, heroCtaQuoteText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
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
            </div>

            {/* Live Preview Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-blue-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Vista Previa Instantánea del Hero
              </span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-blue-400 font-semibold">{content.heroTag}</p>
                <h2 className="text-lg font-black text-white">
                  {content.heroTitleLine1}{' '}
                  <span className="text-purple-400 block">{content.heroTitleLine2}</span>
                </h2>
                <p className="text-xs text-slate-300 max-w-md mx-auto">{content.heroSubtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES SECTION EDITING */}
        {activeTab === 'services' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              Editar Encabezado de la Sección de Servicios
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={content.servicesTag}
                  onChange={(e) => setContent({ ...content, servicesTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título de la Sección</label>
                <input
                  type="text"
                  value={content.servicesTitle}
                  onChange={(e) => setContent({ ...content, servicesTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo / Bajada de Servicios</label>
                <textarea
                  rows={2}
                  value={content.servicesSubtitle}
                  onChange={(e) => setContent({ ...content, servicesSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Vista Previa Encabezado de Servicios
              </span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-blue-300 font-semibold">{content.servicesTag}</p>
                <h2 className="text-base font-black text-white">{content.servicesTitle}</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{content.servicesSubtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ SECTION EDITING */}
        {activeTab === 'faq' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Editar Encabezado de Preguntas Frecuentes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={content.faqTag}
                  onChange={(e) => setContent({ ...content, faqTag: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Título Principal FAQ</label>
                <input
                  type="text"
                  value={content.faqTitle}
                  onChange={(e) => setContent({ ...content, faqTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="block text-slate-300 font-semibold">Subtítulo Descriptivo FAQ</label>
                <textarea
                  rows={2}
                  value={content.faqSubtitle}
                  onChange={(e) => setContent({ ...content, faqSubtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-white focus:outline-none focus:border-blue-500 font-medium"
                ></textarea>
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Vista Previa Encabezado FAQ
              </span>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-2">
                <p className="text-xs text-blue-300 font-semibold">{content.faqTag}</p>
                <h2 className="text-base font-black text-white">{content.faqTitle}</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{content.faqSubtitle}</p>
              </div>
            </div>
          </div>
        )}

        {/* BANNER QUOTE EDITING */}
        {activeTab === 'banner' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-5">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Type className="w-5 h-5 text-purple-400" />
              Editar Banner Intermedio de Cotización Instantánea
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300 font-semibold">Etiqueta Superior (Badge)</label>
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
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs shadow-xl flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>GUARDAR Y APLICAR CAMBIOS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
