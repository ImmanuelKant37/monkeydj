import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  Loader2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { optimizeImageFile, optimizeVideoFile, cleanMediaUrl } from '../../utils/imageOptimizer';
import { SupabaseService } from '../../services/supabase';

interface MediaUploaderFieldProps {
  label: string;
  value: string;
  thumbnailUrl?: string;
  mediaType?: 'photo' | 'video' | 'reel';
  onChange: (mediaUrl: string, thumbnailUrl?: string, detectedType?: 'photo' | 'video' | 'reel') => void;
  accept?: string;
  allowVideo?: boolean;
  required?: boolean;
  helperText?: string;
  maxDimension?: number;
}

export const MediaUploaderField: React.FC<MediaUploaderFieldProps> = ({
  label,
  value,
  thumbnailUrl,
  mediaType = 'photo',
  onChange,
  accept = 'image/*',
  allowVideo = false,
  required = false,
  helperText = 'Formatos admitidos: JPG, PNG, WEBP, GIF (o pega un enlace web).',
  maxDimension = 1600
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasMedia = Boolean(value && value.trim().length > 0);
  const isBase64 = value?.startsWith('data:');
  const previewSource = thumbnailUrl || value;

  const handleProcessFile = async (file: File) => {
    setIsProcessing(true);
    setStatusMessage('Optimizando y procesando archivo...');

    try {
      const cloudUrl = await SupabaseService.uploadMediaFile(file, file.name);

      if (file.type.startsWith('video/') && allowVideo) {
        if (cloudUrl) {
          onChange(cloudUrl, cloudUrl, 'video');
        } else {
          const opt = await optimizeVideoFile(file);
          onChange(opt.mediaUrl, opt.thumbnailUrl, opt.mediaType);
        }
        setStatusMessage('Video cargado correctamente');
      } else {
        if (cloudUrl) {
          onChange(cloudUrl, cloudUrl, 'photo');
        } else {
          const opt = await optimizeImageFile(file, {
            maxWidth: maxDimension,
            maxHeight: maxDimension,
            quality: 0.82
          });
          onChange(opt.mediaUrl, opt.thumbnailUrl || opt.mediaUrl, 'photo');
        }
        setStatusMessage('¡Foto cargada y optimizada!');
      }
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      console.error('Error uploading media:', err);
      setStatusMessage('Error al procesar el archivo. Intenta con otra imagen.');
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // Always reset input value so re-selecting the exact same file fires onChange
    e.target.value = '';
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    const cleaned = cleanMediaUrl(manualUrl.trim());
    onChange(cleaned, cleaned, mediaType);
    setManualUrl('');
    setShowUrlInput(false);
    setStatusMessage('URL aplicada correctamente');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleRemoveMedia = () => {
    onChange('', '', mediaType);
    setManualUrl('');
    setShowUrlInput(false);
    setStatusMessage('Foto eliminada');
    setTimeout(() => setStatusMessage(null), 2000);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTriggerFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2 font-sans">
      {/* Label and Status */}
      <div className="flex items-center justify-between">
        <label className="text-slate-300 font-bold text-xs flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span>
            {label} {required && <span className="text-rose-400">*</span>}
          </span>
        </label>

        {statusMessage && (
          <span className="text-[11px] font-semibold text-purple-300 flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {statusMessage}
          </span>
        )}
      </div>

      {/* Hidden file input with ref for reliable triggers */}
      <input
        ref={fileInputRef}
        type="file"
        accept={allowVideo ? 'image/*,video/*' : accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* When media IS loaded: Show Visual Card with Preview & Replace Actions */}
      {hasMedia ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-slate-950 border ${
            isDragging ? 'border-purple-500 bg-purple-950/20' : 'border-slate-800'
          } rounded-2xl p-3.5 transition-all relative group`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Thumbnail Preview */}
            <div className="relative w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 group-hover:border-purple-500/50 transition-colors">
              <img
                src={previewSource}
                alt="Vista previa"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                </div>
              )}
            </div>

            {/* Information & Action Buttons */}
            <div className="flex-1 w-full space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Foto Cargada y Lista</span>
                </span>

                {isBase64 ? (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    Archivo Local Optimizado
                  </span>
                ) : (
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 truncate max-w-[200px]"
                  >
                    <span>{value.length > 30 ? `${value.substring(0, 30)}...` : value}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
              </div>

              {/* Action Buttons to CHANGE or REPLACE photo */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleTriggerFilePicker}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer transform hover:scale-102"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Cambiar / Reemplazar Foto</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span>{showUrlInput ? 'Ocultar URL' : 'Pegar Enlace Web'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Eliminar esta foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Quitar</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Puedes arrastrar y soltar una nueva foto directamente aquí para cambiarla al instante.
              </p>
            </div>
          </div>

          {/* Collapsible Manual URL input */}
          {showUrlInput && (
            <div className="mt-3 pt-3 border-t border-slate-800 flex gap-2 animate-in fade-in">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="Pega aquí la nueva URL de la imagen (https://...)"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyManualUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleApplyManualUrl}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Aplicar URL
              </button>
            </div>
          )}
        </div>
      ) : (
        /* When NO media is loaded: Clean Drag & Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerFilePicker}
          className={`bg-slate-950 border-2 border-dashed ${
            isDragging
              ? 'border-purple-500 bg-purple-950/30 ring-2 ring-purple-500/20'
              : 'border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/50'
          } rounded-2xl p-6 text-center cursor-pointer transition-all space-y-3 group`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-xs font-bold text-purple-300">Optimizando y comprimiendo foto...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 group-hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black text-white">
                  Haz clic para subir una foto <span className="text-slate-400 font-normal">o arrástrala aquí</span>
                </p>
                <p className="text-[11px] text-slate-400">{helperText}</p>
              </div>

              <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showUrlInput ? 'Ocultar campo de enlace' : 'O pegar enlace / URL web'}</span>
                </button>
              </div>
            </>
          )}

          {/* Collapsible Manual URL input if empty */}
          {showUrlInput && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="pt-3 border-t border-slate-800 flex gap-2 text-left"
            >
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleApplyManualUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleApplyManualUrl}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Cargar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
