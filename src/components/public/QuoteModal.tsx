import React from 'react';
import { X, Calculator } from 'lucide-react';
import { QuoteCalculator } from './QuoteCalculator';
import { Branch, ServiceItem, Equipment, QuoteResult } from '../../types';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches?: Branch[];
  services?: ServiceItem[];
  equipmentList?: Equipment[];
  onRequestBooking?: (quote: QuoteResult) => void;
  onBookNow?: (quote: QuoteResult) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  branches,
  services,
  equipmentList,
  onRequestBooking,
  onBookNow
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in font-sans">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-5xl w-full p-4 sm:p-8 text-white relative shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                COTIZADOR EN VIVO - MONKEYDJ
              </h2>
              <p className="text-xs text-slate-400">
                Calcula tu presupuesto al instante con descuentos por sucursal y fecha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            title="Cerrar Cotizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Calculator Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          <QuoteCalculator
            branches={branches}
            services={services}
            equipmentList={equipmentList}
            onRequestBooking={(q) => {
              if (onRequestBooking) onRequestBooking(q);
              onClose();
            }}
            onBookNow={(q) => {
              if (onBookNow) onBookNow(q);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};
