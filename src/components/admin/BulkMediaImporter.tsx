import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Camera,
  Play,
  Film,
  Building2,
  Layers,
  Link,
  Plus,
  AlertCircle,
  Star,
  Check,
  RefreshCw,
  Clipboard,
  Zap,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';
import { GalleryItem, EventType, Branch } from '../../types';
import { optimizeImageFile, optimizeVideoFile, cleanMediaUrl } from '../../utils/imageOptimizer';

interface StagedMediaItem {
  id: string;
  file?: File;
  title: string;
  eventTitle: string;
  mediaType: 'photo' | 'video' | 'reel';
  mediaUrl: string;
  thumbnailUrl: string;
  category: EventType;
  branchId: string;
  date: string;
  location: string;
  venue?: string;
  tags: string[];
  featured: boolean;
  status: 'ready' | 'processing' | 'done' | 'error';
  errorMessage?: string;
  originalSize?: number;
  compressedSize?: number;
}

interface BulkMediaImporterProps {
  branches: Branch[];
  onImportComplete: (newItems: GalleryItem[]) => void;
  onClose: () => void;
}

export const BulkMediaImporter: React.FC<BulkMediaImporterProps> = ({
  branches,
  onImportComplete,
  onClose
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [activeTab, setActiveTab] = useState<'dragdrop' | 'urls'>('dragdrop');
  const [isDragging, setIsDragging] = useState(false);
  const [stagedItems, setStagedItems] = useState<StagedMediaItem[]>([]);
  const [isReadingFiles, setIsReadingFiles] = useState(false);
  const [readingProgress, setReadingProgress] = useState({ current: 0, total: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Batch default controls
  const [defaultCategory, setDefaultCategory] = useState<EventType>('Casamiento');
  const [defaultBranchId, setDefaultBranchId] = useState<string>('all');
  const [defaultDate, setDefaultDate] = useState<string>(today);
  const [defaultLocation, setDefaultLocation] = useState<string>('Concordia, Entre Ríos');
  const [defaultVenue, setDefaultVenue] = useState<string>('');
  const [defaultEventTitle, setDefaultEventTitle] = useState<string>('');
  const [defaultTagsText, setDefaultTagsText] = useState<string>('ProduccionLive, MonkeyDJ');
  const [defaultFeatured, setDefaultFeatured] = useState<boolean>(true);
  const [defaultMediaType, setDefaultMediaType] = useState<'auto' | 'photo' | 'video' | 'reel'>('auto');

  // URL bulk text area
  const [urlListText, setUrlListText] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const eventCategories: EventType[] = [
    'Casamiento',
    'Cumpleaños de XV',
    'Cumpleaños Adultos',
    'Fiesta Infantil',
    'Evento Empresarial',
    'Fiesta de Egreso',
    'Evento Privado',
    'Festival / Concierto',
    'Otro'
  ];

  // Helper to format clean title from filename
  const formatTitleFromFilename = (filename: string) => {
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
    return nameWithoutExt
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Parse tags string
  const parseTags = (text: string): string[] => {
    return text
      .split(/[,;\s]+/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);
  };

  // Helper format bytes
  const formatBytes = (bytes?: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Process files (Image / Video compression)
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      setIsReadingFiles(true);
      setReadingProgress({ current: 0, total: fileArray.length });

      const newStagedList: StagedMediaItem[] = [];
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setReadingProgress({ current: i + 1, total: fileArray.length });

        try {
          const isImage =
            file.type.startsWith('image/') ||
            /\.(jpg|jpeg|png|webp|gif|bmp|heic)$/i.test(file.name);
          const isVideo =
            file.type.startsWith('video/') || /\.(mp4|mov|webm|avi|mkv|m4v)$/i.test(file.name);

          if (!isImage && !isVideo) {
            errorCount++;
            continue;
          }

          let finalMediaUrl = '';
          let finalThumbUrl = '';
          let detectedMediaType: 'photo' | 'video' | 'reel' = 'photo';
          let origSize = file.size;
          let compSize = file.size;

          if (isImage) {
            const opt = await optimizeImageFile(file, {
              maxWidth: 1600,
              maxHeight: 1600,
              quality: 0.82
            });
            finalMediaUrl = opt.mediaUrl;
            finalThumbUrl = opt.thumbnailUrl || opt.mediaUrl;
            detectedMediaType = 'photo';
            origSize = opt.originalSize;
            compSize = opt.compressedSize;
          } else {
            const opt = await optimizeVideoFile(file);
            finalMediaUrl = opt.mediaUrl;
            finalThumbUrl = opt.thumbnailUrl;
            detectedMediaType = opt.mediaType;
            origSize = opt.originalSize;
            compSize = opt.compressedSize;
          }

          // Override media type if forced by user
          const finalType =
            defaultMediaType !== 'auto' ? defaultMediaType : detectedMediaType;

          const title = formatTitleFromFilename(file.name);

          newStagedList.push({
            id: `staged-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
            file,
            title,
            eventTitle: defaultEventTitle || 'Producción Monkey DJ',
            mediaType: finalType,
            mediaUrl: finalMediaUrl,
            thumbnailUrl: finalThumbUrl,
            category: defaultCategory,
            branchId: defaultBranchId,
            date: defaultDate,
            location: defaultLocation,
            venue: defaultVenue,
            tags: parseTags(defaultTagsText),
            featured: defaultFeatured,
            status: 'ready',
            originalSize: origSize,
            compressedSize: compSize
          });

          successCount++;
        } catch (err: any) {
          console.error('Error optimizing file:', file.name, err);
          errorCount++;
        }
      }

      setIsReadingFiles(false);

      if (newStagedList.length > 0) {
        setStagedItems((prev) => [...prev, ...newStagedList]);
        setFeedbackMsg({
          type: 'success',
          text: `Se procesaron y optimizaron ${successCount} archivo(s) correctamente.`
        });
      } else if (errorCount > 0) {
        setFeedbackMsg({
          type: 'error',
          text: 'No se pudieron procesar los archivos seleccionados. Verifica que sean imágenes o videos.'
        });
      }
    },
    [defaultCategory, defaultBranchId, defaultDate, defaultLocation, defaultVenue, defaultEventTitle, defaultTagsText, defaultFeatured, defaultMediaType]
  );

  // Clipboard paste listener (Ctrl+V support)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const pastedFiles: File[] = [];
      let pastedText = '';

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const f = item.getAsFile();
          if (f) pastedFiles.push(f);
        } else if (item.kind === 'string' && item.type === 'text/plain') {
          item.getAsString((text) => {
            pastedText = text;
          });
        }
      }

      if (pastedFiles.length > 0) {
        processFiles(pastedFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // URL Bulk parse
  const handleParseUrls = () => {
    if (!urlListText.trim()) return;

    const rawLines = urlListText.split(/[\r\n]+/);
    const validItems: StagedMediaItem[] = [];

    rawLines.forEach((line, idx) => {
      const clean = cleanMediaUrl(line);
      if (clean && clean.url) {
        const type = defaultMediaType !== 'auto' ? defaultMediaType : clean.type;
        validItems.push({
          id: `staged-url-${Date.now()}-${idx}`,
          title: `Producción Multimedia ${idx + 1}`,
          eventTitle: defaultEventTitle || 'Evento Destacado Monkey DJ',
          mediaType: type,
          mediaUrl: clean.url,
          thumbnailUrl: type === 'photo' ? clean.url : '',
          category: defaultCategory,
          branchId: defaultBranchId,
          date: defaultDate,
          location: defaultLocation,
          venue: defaultVenue,
          tags: parseTags(defaultTagsText),
          featured: defaultFeatured,
          status: 'ready'
        });
      }
    });

    if (validItems.length > 0) {
      setStagedItems((prev) => [...prev, ...validItems]);
      setUrlListText('');
      setFeedbackMsg({
        type: 'success',
        text: `Se agregaron ${validItems.length} enlace(s) a la cola de importación.`
      });
    } else {
      setFeedbackMsg({
        type: 'error',
        text: 'No se encontraron enlaces válidos (deben comenzar con http:// o https://).'
      });
    }
  };

  // Apply batch defaults to all staged items
  const handleApplyDefaultsToAll = () => {
    setStagedItems((prev) =>
      prev.map((item) => ({
        ...item,
        category: defaultCategory,
        branchId: defaultBranchId,
        date: defaultDate,
        location: defaultLocation,
        venue: defaultVenue,
        eventTitle: defaultEventTitle || item.eventTitle,
        tags: parseTags(defaultTagsText),
        featured: defaultFeatured,
        mediaType: defaultMediaType !== 'auto' ? defaultMediaType : item.mediaType
      }))
    );
    setFeedbackMsg({
      type: 'info',
      text: `Valores de fecha, lugar y categoría aplicados a los ${stagedItems.length} elementos en cola.`
    });
  };

  // Remove individual staged item
  const handleRemoveStagedItem = (id: string) => {
    setStagedItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update specific staged item
  const handleUpdateItem = (id: string, updates: Partial<StagedMediaItem>) => {
    setStagedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  // Replace file for a specific staged item
  const handleReplaceStagedFile = async (itemId: string, file: File) => {
    try {
      const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|bmp|heic)$/i.test(file.name);
      if (isImage) {
        const opt = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
        handleUpdateItem(itemId, {
          mediaUrl: opt.mediaUrl,
          thumbnailUrl: opt.thumbnailUrl || opt.mediaUrl,
          originalSize: opt.originalSize,
          compressedSize: opt.compressedSize,
          mediaType: 'photo'
        });
      } else {
        const opt = await optimizeVideoFile(file);
        handleUpdateItem(itemId, {
          mediaUrl: opt.mediaUrl,
          thumbnailUrl: opt.thumbnailUrl,
          originalSize: opt.originalSize,
          compressedSize: opt.compressedSize,
          mediaType: opt.mediaType
        });
      }
      setFeedbackMsg({
        type: 'success',
        text: 'Archivo reemplazado y optimizado correctamente en la cola.'
      });
    } catch (err) {
      console.error('Error replacing staged file:', err);
      setFeedbackMsg({
        type: 'error',
        text: 'Error al reemplazar el archivo.'
      });
    }
  };

  // Final Import Confirmation
  const handleConfirmImport = async () => {
    if (stagedItems.length === 0) return;

    setIsProcessing(true);
    setProgress(0);

    const total = stagedItems.length;
    const finalGalleryItems: GalleryItem[] = [];

    for (let i = 0; i < total; i++) {
      const item = stagedItems[i];
      await new Promise((res) => setTimeout(res, 30));

      finalGalleryItems.push({
        id: `gal-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title.trim() || 'Producción Monkey DJ',
        eventTitle: item.eventTitle.trim(),
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl || (item.mediaType === 'photo' ? item.mediaUrl : ''),
        category: item.category,
        branchId: item.branchId,
        date: item.date || today,
        location: item.location || 'Concordia, Entre Ríos',
        venue: item.venue,
        tags: item.tags,
        featured: item.featured
      });

      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsProcessing(false);
    onImportComplete(finalGalleryItems);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-5xl w-full p-5 sm:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">
                  IMPORTADOR MASIVO DE FOTOS Y VIDEOS
                </h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-400" /> Clasificación Automática
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sube docenas de fotos y videos con compresión automática y asígnales fecha, lugar y sucursal.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-between mb-3 shrink-0 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : feedbackMsg.type === 'error'
                ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                : 'bg-blue-950/60 border border-blue-500/40 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-xs">
          
          {/* Navigation Tabs */}
          <div className="flex gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab('dragdrop')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'dragdrop'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Arrastrar y Soltar Archivos (PC / Móvil)</span>
            </button>
            <button
              onClick={() => setActiveTab('urls')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'urls'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link className="w-4 h-4" />
              <span>Pegar Lista de URLs / Enlaces</span>
            </button>
          </div>

          {/* Tab 1: Drag and Drop Zone */}
          {activeTab === 'dragdrop' && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-purple-400 bg-purple-950/40 scale-[1.01] shadow-2xl shadow-purple-600/30'
                  : 'border-slate-700 bg-slate-950/70 hover:border-purple-500/50 hover:bg-slate-950'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    processFiles(e.target.files);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />

              {isReadingFiles ? (
                <div className="flex flex-col items-center gap-3 py-4">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                  <p className="text-sm font-bold text-purple-300">
                    Optimizando y comprimiendo archivo {readingProgress.current} de {readingProgress.total}...
                  </p>
                  <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200"
                      style={{
                        width: `${Math.round((readingProgress.current / (readingProgress.total || 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-lg">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-black text-white">
                      Arrastra y suelta tus fotos y videos aquí
                    </p>
                    <p className="text-slate-400 text-xs">
                      o haz clic para explorar tus archivos (Selección múltiple admitida). También puedes presionar <strong>Ctrl + V</strong> para pegar desde el portapapeles.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[10px] text-slate-500">
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-purple-300 font-semibold">
                      JPG, PNG, WEBP, GIF
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-pink-300 font-semibold">
                      MP4, MOV, WEBM
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-emerald-300 font-semibold">
                      Reels / Shorts
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Tab 2: Bulk URLs Textarea */}
          {activeTab === 'urls' && (
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-slate-300 font-bold">
                  Pega múltiples URLs de fotos o videos (un enlace por línea):
                </label>
                <span className="text-[10px] text-slate-500">Soporta Unsplash, Drive, Imgur, CDN</span>
              </div>
              <textarea
                rows={4}
                value={urlListText}
                onChange={(e) => setUrlListText(e.target.value)}
                placeholder="https://images.unsplash.com/photo-1519741497674...&#10;https://images.unsplash.com/photo-1492684223066...&#10;https://assets.mixkit.co/videos/preview/dj-lights.mp4"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleParseUrls}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:opacity-90 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Enlaces a la Cola</span>
              </button>
            </div>
          )}

          {/* 2. Global Batch Defaults Config with Classification */}
          <div className="bg-slate-950/80 p-4 sm:p-5 rounded-3xl border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Valores Predeterminados & Clasificación para el Lote
                </h3>
              </div>
              {stagedItems.length > 0 && (
                <button
                  type="button"
                  onClick={handleApplyDefaultsToAll}
                  className="text-[11px] font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 w-fit"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Aplicar estos valores a los {stagedItems.length} elementos en cola</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Category */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Categoría por Lote</label>
                <select
                  value={defaultCategory}
                  onChange={(e) => setDefaultCategory(e.target.value as EventType)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                >
                  {eventCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Sucursal Asignada</label>
                <select
                  value={defaultBranchId}
                  onChange={(e) => setDefaultBranchId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="all">Todas las Sucursales</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name.includes('Concordia')
                        ? 'Sucursal Concordia'
                        : b.name.includes('Posadas')
                        ? 'Sucursal Posadas'
                        : b.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-purple-300 font-semibold mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" /> Fecha del Lote
                </label>
                <input
                  type="date"
                  value={defaultDate}
                  onChange={(e) => setDefaultDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-pink-300 font-semibold mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" /> Lugar / Ciudad del Lote
                </label>
                <input
                  type="text"
                  value={defaultLocation}
                  onChange={(e) => setDefaultLocation(e.target.value)}
                  placeholder="Ej. Concordia, Entre Ríos"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Row 2: Event Name, Venue, Media Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nombre Evento / Pareja</label>
                <input
                  type="text"
                  value={defaultEventTitle}
                  onChange={(e) => setDefaultEventTitle(e.target.value)}
                  placeholder="Ej. Boda Valeria & Gonzalo"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Salón / Espacio (Venue)</label>
                <input
                  type="text"
                  value={defaultVenue}
                  onChange={(e) => setDefaultVenue(e.target.value)}
                  placeholder="Ej. Salón La Sofía"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Tipo de Medio</label>
                <select
                  value={defaultMediaType}
                  onChange={(e) => setDefaultMediaType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                >
                  <option value="auto">Auto-detectar por archivo</option>
                  <option value="photo">Forzar Foto</option>
                  <option value="video">Forzar Video</option>
                  <option value="reel">Forzar Reel</option>
                </select>
              </div>
            </div>

            {/* Tags & Featured row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center pt-1 border-t border-slate-800/80">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">
                  Etiquetas globales (#Tags separados por coma)
                </label>
                <input
                  type="text"
                  value={defaultTagsText}
                  onChange={(e) => setDefaultTagsText(e.target.value)}
                  placeholder="Ej. SonidoLive, Roboticas, BodaVip"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={defaultFeatured}
                    onChange={(e) => setDefaultFeatured(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <span>Marcar lote como Destacado</span>
                </label>
              </div>
            </div>
          </div>

          {/* 3. Staging Queue List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Elementos en Cola para Importar ({stagedItems.length})
                </h3>
              </div>

              {stagedItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStagedItems([])}
                  className="text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Limpiar Cola</span>
                </button>
              )}
            </div>

            {stagedItems.length === 0 ? (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center text-slate-500 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-slate-700" />
                <p className="font-semibold text-slate-400">No hay archivos en cola todavía</p>
                <p className="text-[11px]">
                  Arrastra fotos o videos en el recuadro superior o pega URLs para comenzar.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {stagedItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 transition-all"
                  >
                    {/* Index & Thumbnail */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold text-slate-500 w-4">
                        #{idx + 1}
                      </span>
                      <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative shrink-0">
                        {item.mediaUrl ? (
                          <img
                            src={item.thumbnailUrl || item.mediaUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-600">
                            <Camera className="w-4 h-4" />
                          </div>
                        )}
                        <span className="absolute top-1 left-1 p-0.5 rounded bg-black/70 text-white text-[9px]">
                          {item.mediaType === 'photo' ? (
                            <Camera className="w-2.5 h-2.5" />
                          ) : item.mediaType === 'reel' ? (
                            <Film className="w-2.5 h-2.5" />
                          ) : (
                            <Play className="w-2.5 h-2.5" />
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Editable Title & Classification */}
                    <div className="flex-1 w-full sm:w-auto space-y-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-bold text-xs focus:outline-none focus:border-purple-500"
                        placeholder="Título del elemento..."
                      />
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-purple-300 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.date || 'Sin fecha'}
                        </span>
                        <span>•</span>
                        <span className="text-pink-300 font-medium flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.location || 'Sin lugar'}
                        </span>
                        {item.originalSize && item.compressedSize && item.originalSize > item.compressedSize && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400">
                              -{Math.round(((item.originalSize - item.compressedSize) / item.originalSize) * 100)}%
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Media Type & Category Dropdowns */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      <select
                        value={item.mediaType}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { mediaType: e.target.value as any })
                        }
                        className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-slate-300 text-xs font-semibold focus:outline-none"
                      >
                        <option value="photo">Foto</option>
                        <option value="video">Video</option>
                        <option value="reel">Reel</option>
                      </select>

                      <select
                        value={item.category}
                        onChange={(e) =>
                          handleUpdateItem(item.id, { category: e.target.value as EventType })
                        }
                        className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-purple-300 text-xs font-semibold focus:outline-none"
                      >
                        {eventCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>

                      <label
                        className="p-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
                        title="Cambiar / Reemplazar Foto"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleReplaceStagedFile(item.id, file);
                            }
                            e.target.value = '';
                          }}
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => handleUpdateItem(item.id, { featured: !item.featured })}
                        className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                          item.featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                        title="Destacado"
                      >
                        <Star className={`w-3.5 h-3.5 ${item.featured ? 'fill-amber-300' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveStagedItem(item.id)}
                        className="p-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                        title="Quitar de la cola"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar when processing */}
        {isProcessing && (
          <div className="py-3 shrink-0 space-y-1">
            <div className="flex justify-between text-xs text-purple-300 font-bold">
              <span>Importando elementos a la galería...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            {stagedItems.length > 0 ? (
              <span>
                <strong className="text-white">{stagedItems.length}</strong> archivo
                {stagedItems.length > 1 ? 's' : ''} preparado{stagedItems.length > 1 ? 's' : ''} para
                ingresar a la galería.
              </span>
            ) : (
              <span>Selecciona archivos para habilitar la importación.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={stagedItems.length === 0 || isProcessing}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Check className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'IMPORTANDO...'
                  : `IMPORTAR ${stagedItems.length > 0 ? stagedItems.length : ''} ELEMENTOS`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
