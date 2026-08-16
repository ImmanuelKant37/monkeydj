import React, { useState } from 'react';
import { Building2, Plus, Edit, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';
import { AppStorage } from '../../services/storage';
import { Branch } from '../../types';

export const BranchesManager: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>(AppStorage.getBranches());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-white">GESTIÓN DE SUCURSALES Y COBERTURA</h1>
          <p className="text-xs text-slate-400">
            Administra los centros operativos independientes con costos y radios de cobertura propios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase">{b.code}</span>
                <h2 className="text-lg font-bold text-white">{b.name}</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {b.active ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1.5">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>{b.address} ({b.city})</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>{b.phone} | WA: {b.whatsapp}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{b.email}</span>
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-[11px]">
              <div>Radio Cobertura: <strong>{b.coverageKm} km</strong></div>
              <div>Flete Base: <strong>${b.baseTravelFee.toLocaleString('es-AR')}</strong></div>
              <div>Personal: <strong>{b.staffCount} pers.</strong></div>
              <div>Vehículos: <strong>{b.vehiclesCount} un.</strong></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
