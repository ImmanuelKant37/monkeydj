import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Building2,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  ExternalLink,
  Plus,
  Send,
  User,
  Filter,
  Eye,
  Archive,
  RefreshCw
} from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { ContactMessage, EventType } from '../../types';

export const MessagesManager: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>(AppStorage.getMessages());
  const [branches] = useState(AppStorage.getBranches());
  const [selectedBranch, setSelectedBranch] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMessage, setViewingMessage] = useState<ContactMessage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState('');

  const [newMessage, setNewMessage] = useState<Partial<ContactMessage>>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    branchId: 'all',
    eventType: 'Casamiento',
    source: 'Directo'
  });

  const filteredMessages = messages.filter((m) => {
    const matchesBranch =
      selectedBranch === 'todos' ||
      !m.branchId ||
      m.branchId === 'all' ||
      m.branchId === 'todas' ||
      m.branchId === selectedBranch;

    const matchesStatus = selectedStatus === 'todos' || m.status === selectedStatus;

    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.subject && m.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBranch && matchesStatus && matchesSearch;
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleSaveAll = (updated: ContactMessage[]) => {
    setMessages(updated);
    AppStorage.saveMessages(updated);
  };

  const handleStatusChange = (id: string, newStatus: ContactMessage['status']) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    handleSaveAll(updated);
    if (viewingMessage && viewingMessage.id === id) {
      setViewingMessage({ ...viewingMessage, status: newStatus });
    }
    showToast(`Estado actualizado a "${newStatus}"`);
  };

  const handleDelete = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    handleSaveAll(updated);
    setDeleteConfirmId(null);
    if (viewingMessage?.id === id) setViewingMessage(null);
    showToast('Mensaje eliminado.');
  };

  const handleCreateNewMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.name || !newMessage.message) return;

    const created = AppStorage.addMessage({
      name: newMessage.name,
      email: newMessage.email,
      phone: newMessage.phone,
      subject: newMessage.subject || 'Consulta Directa',
      message: newMessage.message,
      branchId: newMessage.branchId || 'all',
      eventType: newMessage.eventType || 'Otro',
      source: 'Directo'
    });

    setMessages([created, ...messages]);
    setIsCreating(false);
    setNewMessage({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      branchId: 'all',
      eventType: 'Casamiento',
      source: 'Directo'
    });
    showToast('¡Consulta registrada correctamente!');
  };

  const getBranchLabel = (branchId?: string) => {
    if (!branchId || branchId === 'all' || branchId === 'todas') return 'Todas las Sucursales';
    const found = branches.find((b) => b.id === branchId);
    return found ? found.name.split('-')[1]?.trim() || found.name : branchId;
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const unreadCount = messages.filter((m) => m.status === 'Nuevo').length;

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
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            <span>Centro de Mensajes & Consultas</span>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                {unreadCount} NUEVOS
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            INBOX DE CONTACTO Y SOLICITUDES
          </h1>
          <p className="text-xs text-slate-400">
            Administra las consultas enviadas por clientes desde la web, cotizaciones directas y canales de contacto.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>REGISTRAR CONSULTA MANUAL</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por cliente, correo, teléfono o mensaje..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Status filter buttons */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['todos', 'Nuevo', 'Leído', 'Respondido', 'Archivado'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status === 'todos' ? 'Todos' : status}
              </button>
            ))}
          </div>

          {/* Branch filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Building2 className="w-4 h-4 text-cyan-400" />
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
        </div>
      </div>

      {/* Messages Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Mail className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-white font-bold text-sm">No se encontraron mensajes</h3>
            <p className="text-xs text-slate-500">
              Prueba cambiando los filtros de búsqueda o registra una consulta manual.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredMessages.map((m) => (
              <div
                key={m.id}
                className={`p-5 transition-all hover:bg-slate-800/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  m.status === 'Nuevo' ? 'bg-cyan-950/20 border-l-4 border-l-cyan-400' : ''
                }`}
              >
                {/* Left Info */}
                <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => setViewingMessage(m)}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-white text-sm">{m.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {m.eventType || 'Evento'}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40">
                      {getBranchLabel(m.branchId)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-auto md:ml-0">{m.date}</span>
                  </div>

                  <p className="text-xs font-semibold text-cyan-300">
                    {m.subject || 'Sin asunto'}
                  </p>

                  <p className="text-xs text-slate-400 line-clamp-2 italic">
                    "{m.message}"
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    {m.email && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Mail className="w-3 h-3 text-cyan-400" />
                        {m.email}
                      </span>
                    )}
                    {m.phone && (
                      <span className="flex items-center gap-1 text-slate-300">
                        <Phone className="w-3 h-3 text-emerald-400" />
                        {m.phone}
                      </span>
                    )}
                    {m.source && (
                      <span className="text-[10px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        Vía {m.source}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status & Actions Right */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {/* Status badge & selector */}
                  <select
                    value={m.status}
                    onChange={(e) => handleStatusChange(m.id, e.target.value as any)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                      m.status === 'Nuevo'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : m.status === 'Leído'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : m.status === 'Respondido'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    <option value="Nuevo" className="bg-slate-900 text-rose-300">Nuevo</option>
                    <option value="Leído" className="bg-slate-900 text-amber-300">Leído</option>
                    <option value="Respondido" className="bg-slate-900 text-emerald-300">Respondido</option>
                    <option value="Archivado" className="bg-slate-900 text-slate-400">Archivado</option>
                  </select>

                  <button
                    onClick={() => setViewingMessage(m)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all cursor-pointer"
                    title="Ver detalle de consulta"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {m.phone && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(m.phone)}?text=${encodeURIComponent(`Hola ${m.name}! Te escribimos desde MonkeyDJ respecto a tu consulta por "${m.subject || 'servicio de sonido y eventos'}".`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer"
                      title="Enviar WhatsApp directo"
                    >
                      <Send className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => setDeleteConfirmId(m.id)}
                    className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                    title="Eliminar mensaje"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 text-white space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">{viewingMessage.name}</h3>
                  <p className="text-xs text-slate-400">{viewingMessage.date} • {getBranchLabel(viewingMessage.branchId)}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingMessage(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Asunto: <strong className="text-white">{viewingMessage.subject || 'Consulta'}</strong></span>
                  <span className="text-[10px] font-bold text-cyan-400">{viewingMessage.eventType}</span>
                </div>
                {viewingMessage.email && (
                  <p className="text-slate-300 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <a href={`mailto:${viewingMessage.email}`} className="underline hover:text-cyan-300">
                      {viewingMessage.email}
                    </a>
                  </p>
                )}
                {viewingMessage.phone && (
                  <p className="text-slate-300 flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{viewingMessage.phone}</span>
                  </p>
                )}
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-1">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Mensaje del cliente:</p>
                <p className="text-slate-200 text-xs whitespace-pre-wrap leading-relaxed italic">
                  "{viewingMessage.message}"
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-slate-400 font-bold">Estado de atención:</span>
                <select
                  value={viewingMessage.status}
                  onChange={(e) => handleStatusChange(viewingMessage.id, e.target.value as any)}
                  className="bg-slate-950 text-white font-bold text-xs border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Leído">Leído</option>
                  <option value="Respondido">Respondido</option>
                  <option value="Archivado">Archivado</option>
                </select>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2 justify-end">
              {viewingMessage.phone && (
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(viewingMessage.phone)}?text=${encodeURIComponent(`Hola ${viewingMessage.name}! Te contactamos desde MonkeyDJ respecto a tu consulta por "${viewingMessage.subject || 'servicio de eventos'}".`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/20"
                >
                  <Send className="w-4 h-4" />
                  <span>Responder por WhatsApp</span>
                </a>
              )}
              {viewingMessage.email && (
                <a
                  href={`mailto:${viewingMessage.email}?subject=Respuesta MonkeyDJ - ${viewingMessage.subject || 'Consulta'}`}
                  className="py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-600/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>Responder por Correo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Manual Message Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                REGISTRAR CONSULTA DE CLIENTE
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewMessage} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newMessage.name}
                  onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Ej. Lucas Fernández"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newMessage.email}
                    onChange={(e) => setNewMessage({ ...newMessage, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="text"
                    value={newMessage.phone}
                    onChange={(e) => setNewMessage({ ...newMessage, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="+54 9 3454 ..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipo de Evento</label>
                  <select
                    value={newMessage.eventType}
                    onChange={(e) => setNewMessage({ ...newMessage, eventType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Casamiento">Casamiento</option>
                    <option value="Cumpleaños de XV">Cumpleaños de XV</option>
                    <option value="Cumpleaños Adultos">Cumpleaños Adultos</option>
                    <option value="Evento Empresarial">Evento Empresarial</option>
                    <option value="Fiesta de Egreso">Fiesta de Egreso</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sucursal Asignada</label>
                  <select
                    value={newMessage.branchId || 'all'}
                    onChange={(e) => setNewMessage({ ...newMessage, branchId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
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

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Asunto / Título</label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Ej. Consulta por combo sonido + pantalla"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detalle del Mensaje *</label>
                <textarea
                  required
                  rows={3}
                  value={newMessage.message}
                  onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Escribe la consulta o notas de la llamada..."
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg cursor-pointer"
                >
                  Registrar Consulta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-lg text-white">¿Eliminar este mensaje?</h3>
            <p className="text-xs text-slate-400">
              Esta acción no se puede deshacer.
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
    </div>
  );
};
