import React, { useState } from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  X,
  Save,
  Building2,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { Testimonial, EventType } from '../../types';
import { MediaUploaderField } from './MediaUploaderField';

interface TestimonialsManagerProps {
  onTestimonialsUpdated?: () => void;
}

export const TestimonialsManager: React.FC<TestimonialsManagerProps> = ({
  onTestimonialsUpdated
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    AppStorage.getTestimonials()
  );
  const [branches] = useState(AppStorage.getBranches());
  const [selectedBranch, setSelectedBranch] = useState<string>('todos');
  const [selectedMinRating, setSelectedMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState('');

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

  const filteredItems = testimonials.filter((t) => {
    const matchesBranch =
      selectedBranch === 'todos' ||
      !t.branchId ||
      t.branchId === 'all' ||
      t.branchId === 'todas' ||
      t.branchId === selectedBranch;

    const matchesRating = t.rating >= selectedMinRating;

    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.eventType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBranch && matchesRating && matchesSearch;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSaveAll = (updated: Testimonial[]) => {
    setTestimonials(updated);
    AppStorage.saveTestimonials(updated);
    if (onTestimonialsUpdated) onTestimonialsUpdated();
  };

  const handleCreateNew = () => {
    const newItem: Testimonial = {
      id: `t-${Date.now()}`,
      customerName: 'Cliente Ejemplo',
      eventType: 'Casamiento',
      date: new Date().toISOString().slice(0, 10),
      rating: 5,
      comment: '¡El servicio fue excelente! Excelente ambientación sonora e iluminación de primer nivel.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      featured: true,
      verified: true,
      branchId: 'all'
    };
    setEditingItem(newItem);
    setIsCreating(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    let updated: Testimonial[];
    if (isCreating) {
      updated = [editingItem, ...testimonials];
      showToast('¡Testimonio agregado exitosamente!');
    } else {
      updated = testimonials.map((t) => (t.id === editingItem.id ? editingItem : t));
      showToast('¡Testimonio actualizado correctamente!');
    }

    handleSaveAll(updated);
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    handleSaveAll(updated);
    setDeleteConfirmId(null);
    showToast('Testimonio eliminado correctamente.');
  };

  const handleToggleFeatured = (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, featured: !t.featured } : t
    );
    handleSaveAll(updated);
  };

  const handleToggleVerified = (id: string) => {
    const updated = testimonials.map((t) =>
      t.id === id ? { ...t, verified: !t.verified } : t
    );
    handleSaveAll(updated);
  };

  const getBranchLabel = (branchId?: string) => {
    if (!branchId || branchId === 'all' || branchId === 'todas') return 'Todas las Sucursales';
    const found = branches.find((b) => b.id === branchId);
    return found ? found.name.split('-')[1]?.trim() || found.name : branchId;
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Success Toast */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>Reseñas, Opiniones & Testimonios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GESTIÓN DE TESTIMONIOS Y REVIEWS
          </h1>
          <p className="text-xs text-slate-400">
            Administra los testimonios visibles en el inicio. Puedes destacar, marcar como verificado, editar u omitir según la sucursal.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>NUEVO TESTIMONIO / RESEÑA</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente, comentario o evento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Branch Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400" />
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

          {/* Rating Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-400">Puntaje:</span>
            <select
              value={selectedMinRating}
              onChange={(e) => setSelectedMinRating(Number(e.target.value))}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value={0} className="bg-slate-900 text-white">Todos los Puntajes</option>
              <option value={5} className="bg-slate-900 text-white">Solo 5 Estrellas</option>
              <option value={4} className="bg-slate-900 text-white">4 Estrellas o más</option>
              <option value={3} className="bg-slate-900 text-white">3 Estrellas o más</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((t) => (
          <div
            key={t.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all group relative overflow-hidden"
          >
            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-base shrink-0 overflow-hidden">
                    {t.avatarUrl ? (
                      <img src={t.avatarUrl} alt={t.customerName} className="w-full h-full object-cover" />
                    ) : (
                      t.customerName.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-snug group-hover:text-amber-300 transition-colors">
                      {t.customerName}
                    </h3>
                    <p className="text-[11px] text-amber-400 font-semibold">
                      {t.eventType} • <span className="text-slate-400 font-normal">{t.date}</span>
                    </p>
                  </div>
                </div>

                <span className="bg-purple-900/80 backdrop-blur-md text-purple-200 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-purple-300" />
                  <span>{getBranchLabel(t.branchId)}</span>
                </span>
              </div>

              {/* Rating & Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {t.verified && (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Verificado
                    </span>
                  )}
                  {t.featured && (
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-300" /> Destacado
                    </span>
                  )}
                </div>
              </div>

              {/* Comment */}
              <p className="text-slate-300 text-xs italic leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/60">
                "{t.comment}"
              </p>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleFeatured(t.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    t.featured
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Destacar en portada"
                >
                  <Star className={`w-4 h-4 ${t.featured ? 'fill-amber-300' : ''}`} />
                </button>

                <button
                  onClick={() => handleToggleVerified(t.id)}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    t.verified
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Marcar como verificado"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingItem(t);
                    setIsCreating(false);
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>

                <button
                  onClick={() => setDeleteConfirmId(t.id)}
                  className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                  title="Eliminar testimonio"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">¿Eliminar esta reseña?</h3>
            <p className="text-xs text-slate-400">
              Esta reseña ya no aparecerá en el inicio de la plataforma.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-xl w-full p-5 sm:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {isCreating ? 'NUEVO TESTIMONIO / RESEÑA' : `EDITAR RESEÑA DE: ${editingItem.customerName}`}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Modifica detalles del cliente, calificación, opinión y sucursal.
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

            {/* Form */}
            <form onSubmit={handleSaveModal} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {/* Customer Name & Event Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nombre / Empresa *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.customerName}
                    onChange={(e) => setEditingItem({ ...editingItem, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                    placeholder="Ej. Camila & Tomás"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento *</label>
                  <select
                    value={editingItem.eventType}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, eventType: e.target.value as any })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {eventCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Rating & Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fecha del Evento</label>
                  <input
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Calificación (Estrellas)</label>
                  <select
                    value={editingItem.rating}
                    onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value={5}>5 Estrellas (Excelente)</option>
                    <option value={4}>4 Estrellas (Muy Bueno)</option>
                    <option value={3}>3 Estrellas (Bueno)</option>
                    <option value={2}>2 Estrellas (Regular)</option>
                    <option value={1}>1 Estrella (Malo)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sucursal Asignada *</label>
                  <select
                    value={editingItem.branchId || 'all'}
                    onChange={(e) => setEditingItem({ ...editingItem, branchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500"
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

              {/* Comment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Comentario / Opinión *</label>
                <textarea
                  required
                  rows={4}
                  value={editingItem.comment}
                  onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
                  placeholder="Escribe la reseña o testimonio..."
                ></textarea>
              </div>

              {/* Avatar Upload / URL using MediaUploaderField */}
              <MediaUploaderField
                label="Avatar / Foto del Cliente (Opcional)"
                value={editingItem.avatarUrl || ''}
                required={false}
                helperText="Sube la foto del cliente o pega un enlace para el avatar."
                onChange={(avatar) => {
                  setEditingItem((prev) => (prev ? { ...prev, avatarUrl: avatar } : null));
                }}
              />

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={!!editingItem.verified}
                    onChange={(e) => setEditingItem({ ...editingItem, verified: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>Evento Verificado</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-bold">
                  <input
                    type="checkbox"
                    checked={!!editingItem.featured}
                    onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                  <span>Destacar en Portada</span>
                </label>
              </div>

              {/* Buttons */}
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
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreating ? 'Agregar Testimonio' : 'Guardar Cambios'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
