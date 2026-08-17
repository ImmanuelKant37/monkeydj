import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  X,
  Search,
  Upload,
  Power,
  Eye,
  EyeOff,
  Star,
  Save
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { ServiceItem } from '../../types';

interface ServicesManagerProps {
  onServicesUpdated?: () => void;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({ onServicesUpdated }) => {
  const [services, setServices] = useState<ServiceItem[]>(AppStorage.getServices());
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newSpecText, setNewSpecText] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingService(null);
        setIsCreating(false);
        setDeleteConfirmId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'DJ', label: 'DJ' },
    { id: 'Sonido', label: 'Sonido' },
    { id: 'Iluminación', label: 'Iluminación' },
    { id: 'Animación', label: 'Animación' },
    { id: 'Efectos', label: 'Efectos / FX' },
    { id: 'Pantallas', label: 'Pantallas LED' },
    { id: 'Estructuras', label: 'Estructuras' },
    { id: 'Extras', label: 'Extras' },
    { id: 'Energía', label: 'Energía' }
  ];

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'todos' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSaveAll = (updated: ServiceItem[]) => {
    setServices(updated);
    AppStorage.saveServices(updated);
    if (onServicesUpdated) onServicesUpdated();
  };

  const handleCreateNew = () => {
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      name: 'Nuevo Servicio de Producción',
      category: 'DJ',
      description: 'Descripción completa del servicio, alcance e inclusiones principales para el evento.',
      basePrice: 50000,
      unit: 'evento',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1000',
      videoUrl: '',
      active: true,
      featured: false,
      specs: ['Equipamiento profesional homologado', 'Personal técnico en sitio'],
      requiresPowerKw: 2
    };
    setEditingService(newService);
    setIsCreating(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    let updated: ServiceItem[];
    if (isCreating) {
      updated = [editingService, ...services];
      showToast('¡Servicio agregado exitosamente al catálogo!');
    } else {
      updated = services.map((s) => (s.id === editingService.id ? editingService : s));
      showToast('¡Servicio actualizado correctamente!');
    }

    handleSaveAll(updated);
    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    handleSaveAll(updated);
    setDeleteConfirmId(null);
    showToast('Servicio eliminado del catálogo.');
  };

  const handleToggleActive = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    handleSaveAll(updated);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s));
    handleSaveAll(updated);
  };

  // Image Upload handler (convert to Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingService({
          ...editingService,
          imageUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Video Upload handler (convert to Base64 or Blob URL)
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingService) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingService({
          ...editingService,
          videoUrl: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSpec = () => {
    if (!newSpecText.trim() || !editingService) return;
    const currentSpecs = editingService.specs || [];
    setEditingService({
      ...editingService,
      specs: [...currentSpecs, newSpecText.trim()]
    });
    setNewSpecText('');
  };

  const handleRemoveSpec = (index: number) => {
    if (!editingService || !editingService.specs) return;
    const currentSpecs = [...editingService.specs];
    currentSpecs.splice(index, 1);
    setEditingService({
      ...editingService,
      specs: currentSpecs
    });
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
            <Sparkles className="w-4 h-4" />
            <span>Catálogo Comercial de Producción</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            SERVICIOS DE PRODUCCIÓN Y SHOWS
          </h1>
          <p className="text-xs text-slate-400">
            Administra los servicios individuales, portadas, videos promocionales, especificaciones y precios base.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>AGREGAR NUEVO SERVICIO</span>
        </button>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className={`bg-slate-900 border ${
              service.active ? 'border-slate-800 hover:border-purple-500/50' : 'border-rose-900/40 opacity-75'
            } rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group`}
          >
            <div>
              {/* Cover Media Preview */}
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-purple-600/80 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-0.5 rounded-lg uppercase">
                    {service.category}
                  </span>
                  {service.featured && (
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" /> DESTACADO
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  {service.videoUrl && (
                    <span className="bg-rose-600/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-md">
                      <Video className="w-3 h-3" /> VIDEO OK
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-xs text-slate-300 font-bold bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    ${service.basePrice.toLocaleString('es-AR')} /{service.unit}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      service.active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {service.active ? 'ACTIVO' : 'INACTIVO'}
                  </span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 space-y-2.5">
                <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-purple-300 transition-colors">
                  {service.name}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Specs count */}
                {service.specs && service.specs.length > 0 && (
                  <div className="pt-2 flex items-center gap-1 text-[11px] text-purple-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{service.specs.length} especificaciones incluidas</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(service.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    service.active
                      ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      : 'bg-rose-950/50 text-rose-300 border-rose-800 hover:bg-rose-900/50'
                  }`}
                  title={service.active ? 'Desactivar servicio' : 'Activar servicio'}
                >
                  {service.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleToggleFeatured(service.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    service.featured
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Marcar como Destacado"
                >
                  <Star className={`w-4 h-4 ${service.featured ? 'fill-amber-300' : ''}`} />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingService(service);
                    setIsCreating(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(service.id)}
                  className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                  title="Eliminar servicio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
            <h3 className="font-extrabold text-lg text-white">¿Eliminar este servicio?</h3>
            <p className="text-xs text-slate-400">
              Esta acción quitará el servicio del catálogo público y del cotizador automático.
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
      {editingService && (
        <div
          onClick={() => {
            setEditingService(null);
            setIsCreating(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-3xl w-full p-5 sm:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] flex flex-col cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/40">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {isCreating ? 'CREAR NUEVO SERVICIO' : `EDITAR SERVICIO: ${editingService.name}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configura portada, video demostrativo, precios y especificaciones técnicas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingService(null);
                  setIsCreating(false);
                }}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto space-y-5 pr-1 text-xs">
              {/* Name, Category & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre del Servicio *</label>
                  <input
                    type="text"
                    required
                    value={editingService.name}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Ej. Show DJ Residente + Consola Pioneer"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría *</label>
                  <select
                    value={editingService.category}
                    onChange={(e) =>
                      setEditingService({ ...editingService, category: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="DJ">DJ</option>
                    <option value="Sonido">Sonido</option>
                    <option value="Iluminación">Iluminación</option>
                    <option value="Animación">Animación</option>
                    <option value="Efectos">Efectos / FX</option>
                    <option value="Pantallas">Pantallas LED</option>
                    <option value="Estructuras">Estructuras</option>
                    <option value="Extras">Extras</option>
                    <option value="Energía">Energía</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sucursal Asignada *</label>
                  <select
                    value={editingService.branchId || 'all'}
                    onChange={(e) => setEditingService({ ...editingService, branchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">Todas las Sucursales</option>
                    {AppStorage.getBranches().map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name.includes('Concordia') ? 'Sucursal Concordia' : b.name.includes('Posadas') ? 'Sucursal Posadas' : b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descripción Detallada *</label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Detalla lo que incluye el servicio, impacto visual, estilo musical, etc."
                />
              </div>

              {/* Price & Unit & Power */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Precio Base ($ ARS) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editingService.basePrice}
                    onChange={(e) =>
                      setEditingService({ ...editingService, basePrice: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidad de Medida *</label>
                  <select
                    value={editingService.unit}
                    onChange={(e) => setEditingService({ ...editingService, unit: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="evento">Por Evento</option>
                    <option value="hora">Por Hora</option>
                    <option value="unidad">Por Unidad</option>
                    <option value="m2">Por Metro Cuadrado (m²)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Requerimiento de Energía (Kw)</label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    value={editingService.requiresPowerKw || 0}
                    onChange={(e) =>
                      setEditingService({ ...editingService, requiresPowerKw: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Cover Image Upload / URL */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span>Imagen de Portada (URL o Subir Archivo)</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="url"
                      value={editingService.imageUrl}
                      onChange={(e) => setEditingService({ ...editingService, imageUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                      placeholder="https://images.unsplash.com/..."
                    />
                    <div className="flex items-center gap-2">
                      <label className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 rounded-xl text-purple-300 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Imagen desde dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preview Thumbnail */}
                  <div className="h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                    {editingService.imageUrl ? (
                      <img
                        src={editingService.imageUrl}
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

              {/* Video URL or File */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-pink-400" />
                  <span>Video Demostrativo / Reel (Opcional - URL o Archivo)</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2 space-y-2">
                    <input
                      type="text"
                      value={editingService.videoUrl || ''}
                      onChange={(e) => setEditingService({ ...editingService, videoUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                      placeholder="URL de YouTube, Vimeo, MP4 o enlace externo"
                    />
                    <label className="py-2 px-3 bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/40 rounded-xl text-pink-300 font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Video Corto desde dispositivo</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {editingService.videoUrl && (
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">Video cargado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <label className="text-slate-300 font-bold block">
                  Especificaciones e Inclusiones Clave
                </label>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpecText}
                    onChange={(e) => setNewSpecText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                    placeholder="Ej. Consola Digital 4 Canales Pioneer"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSpec();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSpec}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                  >
                    Agregar
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  {editingService.specs?.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                    >
                      <span className="text-slate-200">{spec}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(idx)}
                        className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags (Active & Featured) */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={editingService.active}
                    onChange={(e) => setEditingService({ ...editingService, active: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded"
                  />
                  <span>Servicio Activo en Catálogo Público</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={!!editingService.featured}
                    onChange={(e) => setEditingService({ ...editingService, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Destacar como "MÁS SOLICITADO"</span>
                </label>
              </div>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
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
                  <span>{isCreating ? 'Crear Servicio' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
