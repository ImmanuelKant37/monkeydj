import React, { useState } from 'react';
import { Mail, Save, CheckCircle2, Plus, Trash2, Bell } from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { NotificationEmailConfig } from '../../types';

export const NotificationsConfig: React.FC = () => {
  const [config, setConfig] = useState<NotificationEmailConfig>(AppStorage.getNotificationConfig());
  const [newEmail, setNewEmail] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddEmail = () => {
    if (!newEmail || config.adminEmails.includes(newEmail)) return;
    setConfig({ ...config, adminEmails: [...config.adminEmails, newEmail] });
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    setConfig({
      ...config,
      adminEmails: config.adminEmails.filter((e) => e !== email)
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    AppStorage.saveNotificationConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">CONFIGURACIÓN DE NOTIFICACIONES</h1>
          <p className="text-xs text-slate-400">
            Define los correos administradores que recibirán alertas automáticas por eventos comerciales.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-950 p-2 rounded-xl border border-emerald-800">
            <CheckCircle2 className="w-4 h-4" /> ¡Configuración guardada!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 text-xs">
        {/* Email Recipients */}
        <div className="space-y-3">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            <span>Destinatarios Administradores</span>
          </h2>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="nuevoadmin@aurasound.com.ar"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-bold text-white flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {config.adminEmails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(email)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Triggers checkboxes */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h2 className="font-bold text-white text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-pink-400" />
            <span>Alertas Automáticas Activadas</span>
          </h2>

          <div className="space-y-2 text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyNewQuote}
                onChange={(e) => setConfig({ ...config, notifyNewQuote: e.target.checked })}
                className="accent-purple-600"
              />
              <span>Notificar cuando llega una nueva solicitud de presupuesto</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyNewBooking}
                onChange={(e) => setConfig({ ...config, notifyNewBooking: e.target.checked })}
                className="accent-purple-600"
              />
              <span>Notificar cuando se registra una nueva solicitud de reserva</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyStatusChange}
                onChange={(e) => setConfig({ ...config, notifyStatusChange: e.target.checked })}
                className="accent-purple-600"
              />
              <span>Notificar cuando una reserva o evento cambia de estado</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyEventCancellation}
                onChange={(e) => setConfig({ ...config, notifyEventCancellation: e.target.checked })}
                className="accent-purple-600"
              />
              <span>Notificar cuando se cancela o finaliza un evento</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={config.notifyNewTestimonial}
                onChange={(e) => setConfig({ ...config, notifyNewTestimonial: e.target.checked })}
                className="accent-purple-600"
              />
              <span>Notificar cuando un cliente publica un testimonio o calificación</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Preferencias</span>
          </button>
        </div>
      </form>
    </div>
  );
};
