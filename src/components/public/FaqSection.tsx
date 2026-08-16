import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { SiteContent } from '../../types';
import { AppStorage } from '../../services/storage';

interface FaqSectionProps {
  siteContent?: SiteContent;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ siteContent: propContent }) => {
  const content = propContent || AppStorage.getSiteContent();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Con cuánta anticipación debo reservar la fecha de mi evento?',
      a: 'Recomendamos congelar la fecha con una anticipación de 3 a 6 meses, especialmente para temporadas altas (Noviembre a Marzo). Sin embargo, gracias a nuestra estructura multi-sucursal y stock propio, también cubrimos reservas de último momento según disponibilidad.'
    },
    {
      q: '¿Cómo funciona la seña y congelamiento de precio?',
      a: 'Con el pago de una seña inicial del 30% del total presupuestado, la fecha queda automáticamente bloqueada a tu nombre y el valor total se congela sin sufrir reajustes por inflación.'
    },
    {
      q: '¿Qué requerimientos técnicos e instalaciones necesita el salón?',
      a: 'Requerimos un punto de conexión eléctrica monofásica o trifásica estable de 220V. Para salones en zonas con riesgo de baja tensión, ofrecemos el adicional de Grupo Electrógeno Insonorizado de 40KVA con transferencia automática.'
    },
    {
      q: '¿Podemos personalizar la lista de canciones y momentos clave con el DJ?',
      a: '¡Absolutamente! Teniendo el contrato firmado realizaremos reuniones de producción (presenciales o virtuales) para armar el protocolo del evento, la playlist deseada, canciones prohibidas y la dinámica del carnaval carioca.'
    },
    {
      q: '¿Realizan eventos en quintas o al aire libre?',
      a: 'Sí. Contamos con estructuras Truss autoportantes, módulos de iluminación resistente a intemperie y sonido direccional preparado para grandes espacios verdes y parques.'
    }
  ];

  return (
    <section id="preguntas" className="py-20 bg-transparent text-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span>{content.faqTag}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {content.faqTitle}
          </h2>
          <p className="text-slate-400 text-sm">
            {content.faqSubtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden transition-all shadow-xl"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 hover:text-blue-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
