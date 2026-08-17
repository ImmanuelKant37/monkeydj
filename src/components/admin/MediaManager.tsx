import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Camera,
  Play,
  Film,
  Search,
  Upload,
  UploadCloud,
  CheckCircle2,
  X,
  Star,
  Save,
  Building2,
  Tag,
  Layers
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { GalleryItem, EventType } from '../../types';
import { BulkMediaImporter } from './BulkMediaImporter';
import { optimizeImageFile, optimizeVideoFile, cleanMediaUrl } from '../../utils/imageOptimizer';

interface MediaManagerProps {
  onGalleryUpdated?: () => void;
}

export const MediaManager: React.FC<MediaManagerProps> = ({ onGalleryUpdated }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>(AppStorage.getGallery());
  const [branches] = useState(AppStorage.getBranches());
  const [selectedBranch, setSelectedBranch] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newTagText, setNewTagText] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingItem(null);
        setIsCreating(false);
        setIsBulkImportOpen(false);
        setDeleteConfirmId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  const filteredItems = gallery.filter((item) => {
    const matchesBranch =
      selectedBranch === 'todos' ||
      !item.branchId ||
      item.branchId === 'all' ||
      item.branchId === 'todas' ||
      item.branchId === selectedBranch;

    const matchesType = selectedType === 'todos' || item.mediaType === selectedType;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.eventTitle && item.eventTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBranch && matchesType && matchesSearch;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSaveAll = (updated: GalleryItem[]) => {
    setGallery(updated);
    AppStorage.saveGallery(updated);
    if (onGalleryUpdated) onGalleryUpdated();
  };

  const handleCreateNew = () => {
    const newItem: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: 'Nueva Producción Audiovisual',
      eventTitle: '',
      mediaType: 'photo',
      mediaUrl: '',
      thumbnailUrl: '',
      category: 'Casamiento',
      tags: ['MonkeyDJ', 'ProduccionLive'],
      featured: true,
      branchId: 'all'
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: GalleryItem[];
    if (isCreating) {
      updated = [editingItem, ...gallery];
      showToast('¡Elemento agregado exitosamente a la Galería!');
    } else {
      updated = gallery.map((g) => (g.id === editingItem.id ? editingItem : g));
      showToast('¡Elemento actualizado correctamente!');
    }

    handleSaveAll(updated);
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleBulkImportComplete = (newItems: GalleryItem[]) => {
    const updated = [...newItems, ...gallery];
    handleSaveAll(updated);
    showToast(`¡${newItems.length} producciones importadas con éxito a la galería!`);
  };

  const handleDelete = (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    handleSaveAll(updated);
    setDeleteConfirmId(null);
    showToast('Elemento eliminado de la galería.');
  };

  const handleClearAllGallery = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar todas las fotos y videos de la galería?')) {
      handleSaveAll([]);
      showToast('Galería vaciada completamente.');
    }
  };

  const handleToggleFeatured = (id: string) => {
    const updated = gallery.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g));
    handleSaveAll(updated);
  };

  // Upload handlers with auto-compression
  const handleMediaFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      try {
        if (file.type.startsWith('video/')) {
          const opt = await optimizeVideoFile(file);
          setEditingItem({
            ...editingItem,
            mediaUrl: opt.mediaUrl,
            thumbnailUrl: editingItem.thumbnailUrl || opt.thumbnailUrl,
            mediaType: opt.mediaType
          });
          showToast('Video cargado correctamente.');
        } else {
          const opt = await optimizeImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
          setEditingItem({
            ...editingItem,
            mediaUrl: opt.mediaUrl,
            thumbnailUrl: editingItem.thumbnailUrl || opt.thumbnailUrl
          });
          showToast('Imagen cargada y comprimida exitosamente.');
        }
      } catch (err) {
        showToast('Error al procesar el archivo seleccionado.');
      }
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      try {
        const opt = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.75 });
        setEditingItem({
          ...editingItem,
          thumbnailUrl: opt.thumbnailUrl || opt.mediaUrl
        });
        showToast('Miniatura actualizada.');
      } catch (err) {
        showToast('Error al procesar la miniatura.');
      }
    }
  };

  const handleAddTag = () => {
    if (!newTagText.trim() || !editingItem) return;
    const currentTags = editingItem.tags || [];
    setEditingItem({
      ...editingItem,
      tags: [...currentTags, newTagText.trim().replace(/^#/, '')]
    });
    setNewTagText('');
  };

  const handleRemoveTag = (index: number) => {
    if (!editingItem || !editingItem.tags) return;
    const currentTags = [...editingItem.tags];
    currentTags.splice(index, 1);
    setEditingItem({
      ...editingItem,
      tags: currentTags
    });
  };

  const getBranchLabel = (branchId?: string) => {
    if (!branchId || branchId === 'all' || branchId === 'todas') return 'Todas las Sucursales';
    const found = branches.find((b) => b.id === branchId);
    return found ? found.name.split('-')[1]?.trim() || found.name : branchId;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Camera className="w-4 h-4" />
            <span>Portafolio Audiovisual & Reels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GESTIÓN DE GALERÍA DE FOTOS Y VIDEOS
          </h1>
          <p className="text-xs text-slate-400">
            Administra fotos, reels y videos. Asigna contenido por sucursal (Concordia / Posadas / Todas) para personalizar el inicio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {gallery.length > 0 && (
            <button
              onClick={handleClearAllGallery}
              className="py-3 px-4 rounded-2xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              title="Vaciar toda la galería"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">VACIAR GALERÍA</span>
            </button>
          )}

          <button
            onClick={() => setIsBulkImportOpen(true)}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105 border border-indigo-400/30"
          >
            <UploadCloud className="w-4 h-4" />
            <span>IMPORTADOR MASIVO (DRAG & DROP)</span>
          </button>

          <button
            onClick={handleCreateNew}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>AGREGAR ELEMENTO INDIVIDUAL</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por título o evento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Branch & Type Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-400">Sucursal:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value="todos" className="bg-slate-900 text-white">Todas las Sucursales</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name.includes('Concordia') ? 'Sucursal Concordia' : b.name.includes('Posadas') ? 'Sucursal Posadas' : b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {['todos', 'photo', 'video', 'reel'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'todos' ? 'Todos' : type === 'photo' ? 'Fotos' : type === 'video' ? 'Videos' : 'Reels'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto">
            <Camera className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-white">No se encontraron elementos en la galería</h3>
            <p className="text-xs text-slate-400">
              No hay fotos o videos que coincidan con la búsqueda o filtro seleccionado. Puedes subir nuevo material masivamente.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Importador Masivo Drag & Drop</span>
            </button>
            <button
              onClick={handleCreateNew}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Uno Individual</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group"
            >
              <div>
                {/* Media Preview Container */}
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={item.thumbnailUrl || item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-black/70 backdrop-blur-md text-purple-300 font-bold text-[10px] px-2.5 py-0.5 rounded-lg uppercase border border-purple-500/30 flex items-center gap-1">
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

                    {item.featured && (
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <Star className="w-3 h-3 fill-slate-950" /> DESTACADO
                      </span>
                    )}
                  </div>

                  {/* Branch Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-purple-300" />
                      <span>{getBranchLabel(item.branchId)}</span>
                    </span>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    {item.eventTitle && (
                      <span className="text-[10px] text-slate-400 italic">
                        {item.eventTitle}
                      </span>
                    )}
                  </div>

                  <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleFeatured(item.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    item.featured
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Destacar en portada"
                >
                  <Star className={`w-4 h-4 ${item.featured ? 'fill-amber-300' : ''}`} />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsCreating(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                    title="Eliminar elemento"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          onClick={() => setDeleteConfirmId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl cursor-default"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">¿Eliminar este elemento?</h3>
            <p className="text-xs text-slate-400">
              Esta foto o video ya no se mostrará en la galería de inicio.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingItem && (
        <div
          onClick={() => {
            setEditingItem(null);
            setIsCreating(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-5 sm:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] flex flex-col cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {isCreating ? 'NUEVO ELEMENTO DE GALERÍA' : `EDITAR MULTIMEDIA: ${editingItem.title}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configura imagen, reel o video, categoría del evento y sucursal.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsCreating(false);
                }}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Title & Event Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Título Principal *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. Boda Inolvidable en Estancia La Sofía"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Título del Evento / Salón</label>
                  <input
                    type="text"
                    value={editingItem.eventTitle || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, eventTitle: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. Boda Valeria & Gonzalo - Salón Concordia"
                  />
                </div>
              </div>

              {/* Media Type, Category & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Contenido *</label>
                  <select
                    value={editingItem.mediaType}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, mediaType: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="photo">Foto</option>
                    <option value="video">Video</option>
                    <option value="reel">Reel / Short</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría de Evento *</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, category: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    {eventCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sucursal Asignada *</label>
                  <select
                    value={editingItem.branchId || 'all'}
                    onChange={(e) => setEditingItem({ ...editingItem, branchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">Todas las Sucursales</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name.includes('Concordia') ? 'Sucursal Concordia' : b.name.includes('Posadas') ? 'Sucursal Posadas' : b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Media URL / Upload */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">
                  URL del Archivo Multimedia (o subir desde dispositivo)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="text"
                      required
                      value={editingItem.mediaUrl}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          mediaUrl: e.target.value,
                          thumbnailUrl: editingItem.thumbnailUrl || e.target.value
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                      placeholder="https://images.unsplash.com/... o sube un archivo"
                    />
                    <label className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl text-purple-300 font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir archivo desde dispositivo</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div className="h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                    {editingItem.mediaUrl ? (
                      <img
                        src={editingItem.thumbnailUrl || editingItem.mediaUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px]">
                        Sin vista previa
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail (for videos) */}
              {editingItem.mediaType !== 'photo' && (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <label className="text-slate-300 font-bold block">
                    Portada / Miniatura para el Video (Opcional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={editingItem.thumbnailUrl}
                      onChange={(e) => setEditingItem({ ...editingItem, thumbnailUrl: e.target.value })}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                      placeholder="URL de imagen de portada para el video"
                    />
                    <label className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-300 font-bold text-xs inline-flex items-center gap-2 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Portada</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">Etiquetas (#Tags)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                    placeholder="Ej. LineArray (sin #)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                  >
                    Agregar Tag
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {editingItem.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 text-xs font-semibold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={!!editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Destacar en la primera grilla de la galería</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-2xl shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Agregar a Galería' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Media Importer Modal */}
      {isBulkImportOpen && (
        <BulkMediaImporter
          branches={branches}
          onImportComplete={handleBulkImportComplete}
          onClose={() => setIsBulkImportOpen(false)}
        />
      )}
    </div>
  );
};
