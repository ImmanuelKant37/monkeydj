import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronDown,
  Camera,
  Play,
  Film,
  MapPin,
  Sparkles,
  Maximize2,
  Bookmark,
  FolderOpen,
  Folder
} from 'lucide-react';
import { GalleryItem } from '../../types';
import {
  groupGalleryByTimeline,
  TimelineMonthGroup,
  TimelineTitleGroup,
  formatTimelineDate
} from '../../utils/timelineUtils';

interface GalleryTimelineProps {
  items: GalleryItem[];
  onSelectMedia: (item: GalleryItem) => void;
  previewStyles?: {
    className: string;
    style?: React.CSSProperties;
  };
}

export const GalleryTimeline: React.FC<GalleryTimelineProps> = ({
  items,
  onSelectMedia,
  previewStyles
}) => {
  const { yearGroups } = useMemo(
    () => groupGalleryByTimeline(items),
    [items]
  );

  // Month accordions state
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => new Set<string>());

  // Title accordions state (key: "2026-08__Title")
  const [openTitles, setOpenTitles] = useState<Set<string>>(() => new Set<string>());

  // Toggle single month accordion
  const toggleMonth = (monthKey: string) => {
    setOpenMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }
      return next;
    });
  };

  // Toggle single title accordion
  const toggleTitle = (titleKey: string) => {
    setOpenTitles((prev) => {
      const next = new Set(prev);
      if (next.has(titleKey)) {
        next.delete(titleKey);
      } else {
        next.add(titleKey);
      }
      return next;
    });
  };

  // Expand / collapse all titles in a month
  const toggleAllTitlesInMonth = (month: TimelineMonthGroup, expand: boolean) => {
    setOpenTitles((prev) => {
      const next = new Set(prev);
      month.titleGroups.forEach((tg) => {
        if (expand) {
          next.add(tg.titleKey);
        } else {
          next.delete(tg.titleKey);
        }
      });
      return next;
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-8 font-sans">
      {/* Timeline Tree */}
      <div className="relative pl-3 sm:pl-6 space-y-12">
        {/* Continuous glowing vertical rail line */}
        <div className="absolute left-[17px] sm:left-[29px] top-6 bottom-6 w-1 bg-gradient-to-b from-purple-500 via-pink-500/60 to-blue-500/30 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.4)]" />

        {yearGroups.map((yearGroup) => (
          <div key={yearGroup.year} className="relative space-y-6">
            
            {/* 1. Year Node Header */}
            <div className="flex items-center gap-4 relative z-10">
              {/* Glowing Year Node */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-sm sm:text-base flex items-center justify-center shadow-lg shadow-purple-600/40 ring-4 ring-slate-950 border border-purple-400/50">
                {yearGroup.year.toString().slice(-2)}
              </div>

              <div className="flex items-center gap-3">
                <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>AÑO {yearGroup.year}</span>
                </h4>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300">
                  {yearGroup.totalItemsCount} producciones en {yearGroup.months.length} {yearGroup.months.length === 1 ? 'mes' : 'meses'}
                </span>
              </div>
            </div>

            {/* 2. Months List inside Year */}
            <div className="space-y-5 pl-7 sm:pl-10">
              {yearGroup.months.map((month) => {
                const isMonthOpen = openMonths.has(month.monthKey);
                const isRecent = month.isCurrentOrLatest;
                const isPast = month.isPast && !isRecent;

                return (
                  <div
                    key={month.monthKey}
                    className={`rounded-3xl border transition-all duration-500 overflow-hidden ${
                      isMonthOpen
                        ? 'bg-slate-900/90 border-purple-500/60 shadow-2xl shadow-purple-950/60 backdrop-blur-xl'
                        : isPast
                        ? 'bg-slate-950/70 hover:bg-slate-900/80 border-slate-800/80 hover:border-pink-500/50 cursor-pointer shadow-lg'
                        : 'bg-slate-950/80 hover:bg-slate-900/90 border-slate-800 hover:border-purple-500/40 cursor-pointer shadow-lg'
                    }`}
                  >
                    {/* Month Accordion Header */}
                    <div
                      onClick={() => toggleMonth(month.monthKey)}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                        isMonthOpen ? 'bg-purple-950/30 border-b border-purple-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Month Icon */}
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                            isRecent
                              ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/40'
                              : 'bg-slate-800 text-purple-300 border border-purple-500/30'
                          }`}
                        >
                          <Calendar className="w-5 h-5" />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-base sm:text-lg font-black text-white tracking-tight">
                              {month.fullLabel}
                            </span>

                            {isRecent && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-pink-500 text-slate-950 animate-pulse shadow-md shadow-pink-500/30">
                                <Sparkles className="w-3 h-3 fill-slate-950" />
                                <span>MES MÁS RECIENTE</span>
                              </span>
                            )}
                          </div>

                          {/* Quick summary of items & titles */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1">
                            <span className="font-semibold text-slate-300">
                              {month.titleGroups.length} {month.titleGroups.length === 1 ? 'título/evento' : 'títulos/eventos'} • {month.items.length} producciones
                            </span>

                            {month.locations.length > 0 && (
                              <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
                                <MapPin className="w-3 h-3 text-purple-400" />
                                <span>{month.locations.slice(0, 2).join(' • ')}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action Trigger */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span className="text-xs font-bold text-slate-400 sm:hidden">
                          {isMonthOpen ? 'Ocultar mes' : 'Ver títulos'}
                        </span>
                        
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isMonthOpen
                              ? 'bg-purple-600 text-white rotate-180 shadow-md shadow-purple-600/40'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Month Content: List of TITLE Desplegables (When Expanded) */}
                    {isMonthOpen && (
                      <div className="p-4 sm:p-6 space-y-4 animate-in fade-in zoom-in-98 duration-300">
                        
                        {/* Title list header & actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Bookmark className="w-3.5 h-3.5 text-purple-400" />
                            <span>Eventos y producciones de <strong>{month.monthName}</strong> ordenados por título:</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllTitlesInMonth(month, true);
                              }}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <FolderOpen className="w-3 h-3 text-purple-400" />
                              <span>Abrir títulos</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllTitlesInMonth(month, false);
                              }}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-bold transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Folder className="w-3 h-3" />
                              <span>Cerrar</span>
                            </button>
                          </div>
                        </div>

                        {/* 3. Desplegables por TÍTULO */}
                        <div className="space-y-3 pt-1">
                          {month.titleGroups.map((titleGroup) => {
                            const isTitleOpen = openTitles.has(titleGroup.titleKey);

                            return (
                              <div
                                key={titleGroup.titleKey}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                  isTitleOpen
                                    ? 'bg-slate-950/90 border-purple-500/50 shadow-xl ring-1 ring-purple-500/20'
                                    : 'bg-slate-950/60 hover:bg-slate-950/90 border-slate-800/90 hover:border-slate-700 cursor-pointer'
                                }`}
                              >
                                {/* Title Accordion Header */}
                                <div
                                  onClick={() => toggleTitle(titleGroup.titleKey)}
                                  className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                                    isTitleOpen ? 'bg-purple-950/20 border-b border-purple-500/20' : ''
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                        isTitleOpen
                                          ? 'bg-purple-600 text-white'
                                          : 'bg-slate-900 text-purple-300 border border-purple-500/20'
                                      }`}
                                    >
                                      <Bookmark className="w-4 h-4" />
                                    </div>

                                    <div className="space-y-0.5">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <h5 className="font-extrabold text-white text-sm sm:text-base leading-snug">
                                          {titleGroup.title}
                                        </h5>

                                        {titleGroup.category && (
                                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900/60 text-purple-300 border border-purple-500/30 font-bold uppercase">
                                            {titleGroup.category}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                                        {titleGroup.venue && (
                                          <span className="text-slate-300">
                                            {titleGroup.venue}
                                          </span>
                                        )}
                                        {titleGroup.location && (
                                          <span className="flex items-center gap-1 text-slate-400">
                                            <MapPin className="w-3 h-3 text-pink-400" />
                                            {titleGroup.location}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Right side: Items counter & Chevron */}
                                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                                      {titleGroup.items.length} {titleGroup.items.length === 1 ? 'archivo' : 'archivos'}
                                      {titleGroup.photosCount > 0 && ` (${titleGroup.photosCount} fotos)`}
                                      {titleGroup.videosCount > 0 && ` (${titleGroup.videosCount} videos)`}
                                      {titleGroup.reelsCount > 0 && ` (${titleGroup.reelsCount} reels)`}
                                    </span>

                                    <div
                                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-300 ${
                                        isTitleOpen
                                          ? 'bg-purple-600/30 text-purple-300 rotate-180'
                                          : 'bg-slate-900 text-slate-400'
                                      }`}
                                    >
                                      <ChevronDown className="w-4 h-4" />
                                    </div>
                                  </div>
                                </div>

                                {/* Media Grid inside Title (When Title is Open) */}
                                {isTitleOpen && (
                                  <div className="p-4 sm:p-5 animate-in fade-in duration-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                      {titleGroup.items.map((item) => (
                                        <div
                                          key={item.id}
                                          onClick={() => onSelectMedia(item)}
                                          className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-purple-500/60 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-950/50 flex flex-col justify-between"
                                        >
                                          {/* Thumbnail preview */}
                                          <div className="relative h-48 overflow-hidden bg-slate-950">
                                            <img
                                              src={item.thumbnailUrl || item.mediaUrl}
                                              alt={item.title}
                                              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                                                previewStyles?.className || ''
                                              }`}
                                              style={previewStyles?.style}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none">
                                              <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase text-white flex items-center gap-1 shadow-lg">
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
                                                    <Camera className="w-3 h-3 text-purple-300" /> FOTO
                                                  </>
                                                )}
                                              </span>

                                              {item.featured && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black uppercase shadow-lg">
                                                  DESTACADO
                                                </span>
                                              )}
                                            </div>

                                            {/* Hover Maximize Icon */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-950/40 backdrop-blur-xs">
                                              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                                                <Maximize2 className="w-4 h-4" />
                                              </div>
                                            </div>

                                            {/* Date pill */}
                                            {item.date && (
                                              <div className="absolute bottom-2 left-2.5 pointer-events-none">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md border border-white/10 text-[9px] font-bold text-slate-300">
                                                  📅 {formatTimelineDate(item.date)}
                                                </span>
                                              </div>
                                            )}
                                          </div>

                                          {/* Card Footer */}
                                          <div className="p-3 space-y-1 bg-slate-950/80">
                                            <p className="font-bold text-white text-xs leading-snug group-hover:text-purple-300 transition-colors line-clamp-1">
                                              {item.title}
                                            </p>
                                            {item.eventTitle && item.eventTitle !== item.title && (
                                              <p className="text-[11px] text-slate-400 truncate">
                                                {item.eventTitle}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
