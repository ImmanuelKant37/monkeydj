import React from 'react';
import { Shield, Clock, User } from 'lucide-react';
import { AppStorage } from '../../services/storage';

export const AuditLogView: React.FC = () => {
  const logs = AppStorage.getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">HISTORIAL DE AUDITORÍA Y CAMBIOS</h1>
        <p className="text-xs text-slate-400">
          Registro inmutable de acciones realizadas sobre presupuestos, reservas y parámetros del sistema.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold text-[10px]">
                    {log.userRole}
                  </span>
                  <span className="font-bold text-white">{log.action}</span>
                </div>
                <p className="text-slate-400">{log.details}</p>
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                {new Date(log.timestamp).toLocaleString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
