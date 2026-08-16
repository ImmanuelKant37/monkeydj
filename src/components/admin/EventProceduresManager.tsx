import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Music,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
  Copy,
  Printer,
  Calendar,
  Layers,
  HelpCircle,
  X,
  Volume2,
  Sliders,
  Share2,
  Tag,
  Zap,
  Mic,
  Heart,
  MessageSquare,
  Flame,
  Users
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { EventProcedure, EventType, EventRecord } from '../../types';

export const EventProceduresManager: React.FC = () => {
  const [procedures, setProcedures] = useState<EventProcedure[]>(AppStorage.getProcedures());
  const [events] = useState<EventRecord[]>(AppStorage.getEvents());

  // Filters
  const [selectedEventType, setSelectedEventType] = useState<string>('Cumpleaños de XV');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState<EventProcedure | null>(null);
  const [formData, setFormData] = useState<Partial<EventProcedure>>({
    title: '',
    eventType: 'Cumpleaños de XV',
    category: 'Entrada & Recepción',
    estimatedTime: '21:00 hs',
    durationMinutes: 30,
    suggestedMusic: '',
    description: '',
    requiredEquipment: '',
    active: true
  });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<EventProcedure | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  // Selected Event for Live Protocol Application
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const saveList = (newList: EventProcedure[]) => {
    setProcedures(newList);
    AppStorage.saveProcedures(newList);
  };

  const eventTypesList: (EventType | 'Todos')[] = [
    'Cumpleaños de XV',
    'Casamiento',
    'Cumpleaños Adultos',
    'Evento Empresarial',
    'Fiesta de Egreso',
    'Todos'
  ];

  const categoriesList = [
    'todas',
    'Entrada & Recepción',
    'Cena & Fondo',
    'Momentos Clave',
    'Pista & Baile',
    'Show / Animación',
    'Cierre & Especiales'
  ];

  // Common quick title presets requested by user
  const titlePresets = [
    { title: 'Entrada con canción solicitada', category: 'Entrada & Recepción', defaultMusic: 'Canción favorita del anfitrión' },
    { title: 'Vals con familiares', category: 'Momentos Clave', defaultMusic: 'Vals tradicional de Strauss o instrumental' },
    { title: 'Cena (música sugerida)', category: 'Cena & Fondo', defaultMusic: 'Lounge, Bossa Nova o Pop acústico' },
    { title: 'Etapa de baile (canciones sugeridas)', category: 'Pista & Baile', defaultMusic: 'Hits actuales, Reggaeton & Cumbia' },
    { title: 'Banda / Show en vivo', category: 'Show / Animación', defaultMusic: 'Set en vivo' },
    { title: 'Animación & Juegos', category: 'Show / Animación', defaultMusic: 'Cortinas cómicas & concurso' },
    { title: 'Parte emotiva / Video homenaje', category: 'Momentos Clave', defaultMusic: 'Banda sonora emotiva' },
    { title: 'Preguntas íntimas / Trivia', category: 'Show / Animación', defaultMusic: 'Música de suspenso y humor' },
    { title: 'Momento de parejas', category: 'Show / Animación', defaultMusic: 'Baladas lentas y románticas' },
    { title: 'Dedicatorias del público al anfitrión', category: 'Momentos Clave', defaultMusic: 'Fondo instrumental inspirador' },
    { title: 'Carnaval Carioca & Cotillón', category: 'Cierre & Especiales', defaultMusic: 'Samba brasilera, Murga & Remixes' }
  ];

  // Filtered Procedures
  const filteredProcedures = procedures
    .filter((proc) => {
      const matchesType =
        selectedEventType === 'Todos' || proc.eventType === 'Todos' || proc.eventType === selectedEventType;
      const matchesCat = selectedCategory === 'todas' || proc.category === selectedCategory;
      const matchesSearch =
        proc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proc.suggestedMusic && proc.suggestedMusic.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proc.description && proc.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesCat && matchesSearch;
    })
    .sort((a, b) => a.order - b.order);

  // Reorder Handler
  const handleMove = (id: string, direction: 'up' | 'down') => {
    const list = [...filteredProcedures];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const prev = list[index - 1];
      const current = list[index];
      const tempOrder = current.order;
      current.order = prev.order;
      prev.order = tempOrder;
    } else if (direction === 'down' && index < list.length - 1) {
      const next = list[index + 1];
      const current = list[index];
      const tempOrder = current.order;
      current.order = next.order;
      next.order = tempOrder;
    }

    // Update global list preserving order
    const updatedGlobal = procedures.map((item) => {
      const found = list.find((l) => l.id === item.id);
      return found ? found : item;
    });

    saveList(updatedGlobal);
    showToast('Orden de protocolo actualizado');
  };

  // Open Modal
  const handleOpenAdd = () => {
    setEditingProcedure(null);
    setFormData({
      title: '',
      eventType: (selectedEventType as any) === 'Todos' ? 'Cumpleaños de XV' : (selectedEventType as any),
      category: 'Entrada & Recepción',
      estimatedTime: '21:00 hs',
      durationMinutes: 30,
      suggestedMusic: '',
      description: '',
      requiredEquipment: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proc: EventProcedure) => {
    setEditingProcedure(proc);
    setFormData({ ...proc });
    setIsModalOpen(true);
  };

  const handleApplyPreset = (preset: typeof titlePresets[0]) => {
    setFormData((prev) => ({
      ...prev,
      title: preset.title,
      category: preset.category as any,
      suggestedMusic: preset.defaultMusic
    }));
  };

  // Save Modal Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingProcedure) {
      const updated = procedures.map((p) =>
        p.id === editingProcedure.id ? ({ ...p, ...formData } as EventProcedure) : p
      );
      saveList(updated);
      showToast('Procedimiento actualizado correctamente');
    } else {
      const nextOrder = procedures.length > 0 ? Math.max(...procedures.map((p) => p.order)) + 1 : 1;
      const newProc: EventProcedure = {
        id: `proc-${Date.now()}`,
        title: formData.title!,
        eventType: formData.eventType as any || 'Cumpleaños de XV',
        category: formData.category as any || 'Entrada & Recepción',
        estimatedTime: formData.estimatedTime || '21:00 hs',
        durationMinutes: Number(formData.durationMinutes) || 15,
        suggestedMusic: formData.suggestedMusic || '',
        description: formData.description || '',
        requiredEquipment: formData.requiredEquipment || '',
        order: nextOrder,
        active: formData.active ?? true
      };
      saveList([...procedures, newProc]);
      showToast('Nuevo procedimiento agregado al protocolo');
    }
    setIsModalOpen(false);
  };

  // Delete
  const confirmDelete = () => {
    if (!deleteTarget) return;
    saveList(procedures.filter((p) => p.id !== deleteTarget.id));
    showToast('Procedimiento eliminado.');
    setDeleteTarget(null);
  };

  // Duplicate
  const handleDuplicate = (proc: EventProcedure) => {
    const nextOrder = Math.max(...procedures.map((p) => p.order)) + 1;
    const duplicated: EventProcedure = {
      ...proc,
      id: `proc-${Date.now()}`,
      title: `${proc.title} (Copia)`,
      order: nextOrder
    };
    saveList([...procedures, duplicated]);
    showToast('Procedimiento duplicado.');
  };

  // Copy Protocol to Clipboard (WhatsApp formatted)
  const handleCopyProtocolText = () => {
    if (filteredProcedures.length === 0) {
      showToast('No hay procedimientos en el filtro actual para copiar');
      return;
    }

    let text = `📋 *PLANIFICACIÓN Y PROTOCOLO DE EVENTO*\n`;
    text += `🎉 *Tipo de Evento:* ${selectedEventType}\n`;
    text += `----------------------------------------\n\n`;

    filteredProcedures.forEach((proc, idx) => {
      text += `*${idx + 1}. [${proc.estimatedTime || 'N/A'}] ${proc.title}* (${proc.durationMinutes || 15} min)\n`;
      if (proc.suggestedMusic) text += `🎵 *Música:* ${proc.suggestedMusic}\n`;
      if (proc.description) text += `📝 *Detalle:* ${proc.description}\n`;
      if (proc.requiredEquipment) text += `⚡ *Equipamiento:* ${proc.requiredEquipment}\n`;
      text += `\n`;
    });

    text += `✨ *Aura Sound & Events* - Coordinación y Operación Técnica`;

    navigator.clipboard.writeText(text);
    showToast('¡Protocolo copiado al portapapeles!');
  };

  // Assign protocol template to an Event
  const handleAssignToEvent = () => {
    if (!selectedEventId) return;

    const targetEvent = events.find((e) => e.id === selectedEventId);
    if (!targetEvent) return;

    const allEvents = AppStorage.getEvents();
    const updatedEvents = allEvents.map((e) => {
      if (e.id === selectedEventId) {
        return {
          ...e,
          protocolProcedures: filteredProcedures
        };
      }
      return e;
    });

    AppStorage.saveEvents(updatedEvents);
    showToast(`¡Protocolo asignado con éxito a ${targetEvent.title}!`);
    setIsAssignModalOpen(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-purple-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 rounded-3xl border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-600/30 text-purple-300 font-extrabold text-[10px] tracking-wider uppercase border border-purple-500/40">
              Coordinación & DJs
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase border border-amber-500/30">
              Planificación por Horario
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Clock className="w-7 h-7 text-purple-400" />
            PROCEDIMIENTOS Y PROTOCOLOS DE EVENTOS
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl">
            Diseña, personaliza y reordena la secuencia cronológica de momentos clave (Entrada con canción solicitada, Vals, Tandas de baile, Banda, Animación, Preguntas íntimas, Momento de parejas, Carnaval carioca) adaptada a cada tipo de fiesta.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <button
            onClick={handleCopyProtocolText}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            title="Copiar texto formateado para enviar por WhatsApp al DJ o cliente"
          >
            <Copy className="w-4 h-4 text-purple-400" />
            <span>Copiar WhatsApp</span>
          </button>

          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="px-3.5 py-2.5 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-200 font-bold text-xs border border-purple-800 flex items-center gap-2 transition-all cursor-pointer shadow-md"
            title="Asignar este protocolo a un evento confirmado"
          >
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>Asignar a Evento</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>NUEVO MOMENTO / PROCEDIMIENTO</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4">
        {/* Event Type Selector Tabs */}
        <div>
          <label className="block text-[11px] uppercase font-extrabold text-slate-400 mb-2">
            Seleccionar Tipo de Evento / Plantilla Protocolar:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {eventTypesList.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedEventType(type)}
                className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all cursor-pointer flex items-center gap-2 ${
                  selectedEventType === type
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50 scale-105'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {type === 'Cumpleaños de XV' && <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
                {type === 'Casamiento' && <Heart className="w-3.5 h-3.5 text-rose-400" />}
                {type === 'Evento Empresarial' && <Users className="w-3.5 h-3.5 text-blue-400" />}
                {type === 'Cumpleaños Adultos' && <Zap className="w-3.5 h-3.5 text-amber-400" />}
                {type === 'Fiesta de Egreso' && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                {type === 'Todos' && <Layers className="w-3.5 h-3.5 text-purple-400" />}
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center pt-2 border-t border-slate-800/80">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por momento, canción sugerida, detalle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-purple-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-56 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="todas">Todas las Etapas / Categorías</option>
              {categoriesList.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Sequence List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>Secuencia de momentos ({filteredProcedures.length} registros)</span>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-normal">
              Usa las flechas ▲ ▼ para reordenar la cronología
            </span>
          </p>
        </div>

        {filteredProcedures.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
            <Clock className="w-12 h-12 text-purple-500/40 mx-auto" />
            <h3 className="font-extrabold text-base text-white">No hay momentos registrados para esta plantilla</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Haz clic en "Nuevo Momento / Procedimiento" o selecciona una plantilla distinta para configurar la secuencia de tiempos.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-2 py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>AGREGAR PRIMER MOMENTO</span>
            </button>
          </div>
        ) : (
          filteredProcedures.map((proc, index) => (
            <div
              key={proc.id}
              className="bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all shadow-xl space-y-3 group relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left Header: Index + Title + Tags */}
                <div className="flex items-start gap-3">
                  {/* Step Number Badge */}
                  <div className="w-9 h-9 rounded-2xl bg-purple-950 text-purple-300 border border-purple-800/60 font-black text-sm flex items-center justify-center shrink-0 shadow-inner">
                    #{index + 1}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-white">{proc.title}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-900/40 text-purple-300 border border-purple-700/40">
                        {proc.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {proc.eventType}
                      </span>
                    </div>

                    {/* Time & Duration */}
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <span className="flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                        <Clock className="w-3.5 h-3.5" />
                        Horario: {proc.estimatedTime || 'A confirmar'}
                      </span>
                      <span className="text-slate-300">
                        Duración: <strong>{proc.durationMinutes || 15} min</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Reorder */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {/* Reorder Up */}
                  <button
                    onClick={() => handleMove(proc.id, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Mover arriba en la secuencia"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  {/* Reorder Down */}
                  <button
                    onClick={() => handleMove(proc.id, 'down')}
                    disabled={index === filteredProcedures.length - 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                    title="Mover abajo en la secuencia"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  {/* Duplicate */}
                  <button
                    onClick={() => handleDuplicate(proc)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 transition-all cursor-pointer"
                    title="Duplicar procedimiento"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(proc)}
                    className="p-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 transition-all cursor-pointer"
                    title="Editar detalles"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => setDeleteTarget(proc)}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-800/40 transition-all cursor-pointer"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Procedure Sub-details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
                {/* Suggested Music */}
                <div className="space-y-1">
                  <span className="text-[10px] text-purple-400 uppercase font-black flex items-center gap-1">
                    <Music className="w-3.5 h-3.5" />
                    Música Sugerida / Estilo
                  </span>
                  <p className="font-semibold text-slate-200">
                    {proc.suggestedMusic || 'A elección libre del DJ según clima de la pista'}
                  </p>
                </div>

                {/* Detailed Description */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                    Indicaciones para DJ / Animador
                  </span>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    {proc.description || 'Sin indicaciones especiales.'}
                  </p>
                </div>

                {/* Required Equipment */}
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-black flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Equipamiento / FX Necesarios
                  </span>
                  <p className="text-slate-300 font-medium">
                    {proc.requiredEquipment || 'Sonido estándar del combo'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                {editingProcedure ? 'EDITAR MOMENTO PROTOCOLAR' : 'NUEVO MOMENTO / PROCEDIMIENTO PROTOCOLAR'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title Quick Presets Chips */}
            {!editingProcedure && (
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <label className="block text-[10px] uppercase font-bold text-purple-400">
                  ⚡ Sugerencias rápidas de momentos (Haz clic para autocompletar):
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                  {titlePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-[11px] bg-slate-900 hover:bg-purple-950 text-slate-300 hover:text-purple-200 border border-slate-800 hover:border-purple-700/60 px-2.5 py-1 rounded-xl transition-all cursor-pointer text-left"
                    >
                      + {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Title */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre / Título del Momento *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Entrada con canción solicitada / Vals / Carnaval Carioca"
                />
              </div>

              {/* Event Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Cumpleaños de XV">Cumpleaños de XV</option>
                    <option value="Casamiento">Casamiento</option>
                    <option value="Cumpleaños Adultos">Cumpleaños Adultos</option>
                    <option value="Evento Empresarial">Evento Empresarial</option>
                    <option value="Fiesta de Egreso">Fiesta de Egreso</option>
                    <option value="Todos">Aplica a Todos los Eventos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Etapa / Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Entrada & Recepción">Entrada & Recepción</option>
                    <option value="Cena & Fondo">Cena & Fondo</option>
                    <option value="Momentos Clave">Momentos Clave</option>
                    <option value="Pista & Baile">Pista & Baile</option>
                    <option value="Show / Animación">Show / Animación</option>
                    <option value="Cierre & Especiales">Cierre & Especiales</option>
                  </select>
                </div>
              </div>

              {/* Estimated Time & Duration */}
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Horario Estimado (Ej. 22:30 hs / +45m)</label>
                  <input
                    type="text"
                    value={formData.estimatedTime}
                    onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-bold focus:outline-none focus:border-purple-500"
                    placeholder="22:30 hs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Duración (Minutos)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 15 })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Suggested Music */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  🎵 Música Sugerida / Canciones Solicitadas
                </label>
                <input
                  type="text"
                  value={formData.suggestedMusic}
                  onChange={(e) => setFormData({ ...formData, suggestedMusic: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Tema específico a elección del cliente, lista de Cumbia 2000s, Bossa Nova lounge..."
                />
              </div>

              {/* Technical & DJ Instructions */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  📝 Indicaciones Protocolares para el DJ / Animador / Técnico
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. Bajar luces generales, encender robóticas en blanco cálido y humo denso. El animador anuncia la entrada..."
                ></textarea>
              </div>

              {/* Required Equipment & FX */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ⚡ Equipamiento / Efectos Requeridos para este Momento
                </label>
                <input
                  type="text"
                  value={formData.requiredEquipment}
                  onChange={(e) => setFormData({ ...formData, requiredEquipment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ej. 2 Micrófonos inalámbricos, chispas frías, máquina de humo bajo, traje de Robot LED..."
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold rounded-xl shadow-lg cursor-pointer"
                >
                  {editingProcedure ? 'Guardar Cambios' : 'Agregar Momento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TO EVENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                ASIGNAR PROTOCOLO A UN EVENTO
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copia la secuencia actual de <strong>{filteredProcedures.length} momentos</strong> ({selectedEventType}) directamente en la ficha del evento seleccionado para la hoja de ruta del DJ.
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">Seleccionar Evento Confirmado:</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="">-- Elige un evento de la lista --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.eventNumber} - {ev.title} ({ev.eventDate})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={!selectedEventId}
                onClick={handleAssignToEvent}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-extrabold rounded-xl shadow-lg cursor-pointer text-xs"
              >
                Asignar Protocolo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-white">¿Eliminar "{deleteTarget.title}"?</h3>
            <p className="text-xs text-slate-400">
              Esta acción quitará el momento del protocolo.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
