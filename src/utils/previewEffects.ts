import React from 'react';
import { PreviewEffectType, PreviewSpeedType, SiteContent } from '../types';

export interface PreviewEffectOption {
  id: PreviewEffectType;
  name: string;
  shortDesc: string;
  description: string;
  badge: string;
  iconName: string;
}

export interface PreviewSpeedOption {
  id: PreviewSpeedType;
  name: string;
  durationSeconds: number;
  description: string;
}

export const PREVIEW_EFFECT_OPTIONS: PreviewEffectOption[] = [
  {
    id: 'ken-burns',
    name: 'Ken Burns Cinemático',
    shortDesc: 'Zoom sutil y paneo multidireccional',
    description: 'Efecto documental cinematográfico que combina un zoom progresivo con paneos suaves en 4 esquinas.',
    badge: 'Recomendado',
    iconName: 'Camera'
  },
  {
    id: 'slow-zoom-in',
    name: 'Zoom In Progresivo',
    shortDesc: 'Acercamiento gradual y elegante',
    description: 'Acercamiento continuo que profundiza en los detalles de la fiesta y los efectos visuales.',
    badge: 'Elegante',
    iconName: 'ZoomIn'
  },
  {
    id: 'slow-zoom-out',
    name: 'Zoom Out Panorámico',
    shortDesc: 'Apertura hacia el entorno',
    description: 'Alejamiento suave que expande la toma para mostrar la atmósfera general del salón.',
    badge: 'Espacioso',
    iconName: 'ZoomOut'
  },
  {
    id: 'subtle-float',
    name: 'Flotación & Levitación',
    shortDesc: 'Respiración vertical sutil',
    description: 'Movimiento ondulante vertical y ligero aumento de escala que da sensación de flotación aérea.',
    badge: 'Flotante',
    iconName: 'Move'
  },
  {
    id: 'pan-left-right',
    name: 'Paneo Horizontal',
    shortDesc: 'Desplazamiento de izquierda a derecha',
    description: 'Paneo continuo de lado a lado que recorre pantallas gigantes, cabina de DJ y pistas de baile.',
    badge: 'Gran Angular',
    iconName: 'Sliders'
  },
  {
    id: 'cinematic-pulse',
    name: 'Pulso & Brillo de Luz',
    shortDesc: 'Respiración de escala y luminosidad',
    description: 'Latido sutil de escala acompañado de un realce de iluminación que evoca la energía del show.',
    badge: 'Vibrante',
    iconName: 'Sparkles'
  },
  {
    id: 'gentle-tilt',
    name: 'Inclinación 3D Dinámica',
    shortDesc: 'Micro-rotación con profundidad',
    description: 'Rotación angular de ±1 grado con zoom ligero que crea perspectiva tridimensional.',
    badge: '3D Moderno',
    iconName: 'Compass'
  },
  {
    id: 'hover-zoom',
    name: 'Zoom Solo en Hover',
    shortDesc: 'Reposo estático y zoom interactivo',
    description: 'Imagen inmóvil en reposo que ejecuta un zoom suave y potente cuando el usuario pasa el cursor.',
    badge: 'Interactivo',
    iconName: 'MousePointer'
  },
  {
    id: 'none',
    name: 'Estático (Sin Movimiento)',
    shortDesc: 'Fotografía fija tradicional',
    description: 'Desactiva todas las animaciones de movimiento para una visualización sin transiciones.',
    badge: 'Clásico',
    iconName: 'Square'
  }
];

export const PREVIEW_SPEED_OPTIONS: PreviewSpeedOption[] = [
  {
    id: 'ultra-slow',
    name: 'Ultra Lento (20s)',
    durationSeconds: 20,
    description: 'Movimiento hipnótico casi imperceptible, ideal para fotos de bodas y cenas de gala.'
  },
  {
    id: 'slow',
    name: 'Cinemático Suave (12s)',
    durationSeconds: 12,
    description: 'El balance perfecto entre dinamismo y sofisticación visual.'
  },
  {
    id: 'medium',
    name: 'Moderado Dinámico (7s)',
    durationSeconds: 7,
    description: 'Mayor energía de movimiento, excelente para fiestas de 15 y shows con luces.'
  },
  {
    id: 'fast',
    name: 'Rápido Enérgico (4s)',
    durationSeconds: 4,
    description: 'Transición rítmica rápida y marcada.'
  }
];

/**
 * Helper to compute CSS class and style for any media preview element
 */
export function getPreviewEffectStyles(
  siteContent?: Partial<SiteContent> | null,
  options?: {
    scope?: 'hero' | 'gallery' | 'services';
    forceEffect?: PreviewEffectType;
    forceSpeed?: PreviewSpeedType;
  }
): {
  className: string;
  style: React.CSSProperties;
} {
  const effect = options?.forceEffect || siteContent?.previewEffect || 'ken-burns';
  const speed = options?.forceSpeed || siteContent?.previewSpeed || 'slow';
  const hoverZoom = siteContent?.previewHoverZoom !== false;

  // Check if enabled for specific scope
  if (options?.scope === 'hero' && siteContent?.previewEnableOnHero === false) {
    return {
      className: hoverZoom ? 'transition-transform duration-500 hover:scale-105' : '',
      style: {}
    };
  }
  if (options?.scope === 'gallery' && siteContent?.previewEnableOnGallery === false) {
    return {
      className: hoverZoom ? 'transition-transform duration-500 hover:scale-105' : '',
      style: {}
    };
  }
  if (options?.scope === 'services' && siteContent?.previewEnableOnServices === false) {
    return {
      className: hoverZoom ? 'transition-transform duration-500 hover:scale-105' : '',
      style: {}
    };
  }

  let durationSec = 12;
  if (speed === 'ultra-slow') durationSec = 20;
  if (speed === 'slow') durationSec = 12;
  if (speed === 'medium') durationSec = 7;
  if (speed === 'fast') durationSec = 4;

  if (effect === 'none') {
    return {
      className: hoverZoom ? 'transition-transform duration-500 hover:scale-105' : '',
      style: {}
    };
  }

  if (effect === 'hover-zoom') {
    return {
      className: 'transition-all duration-700 ease-out hover:scale-110 hover:brightness-105',
      style: {
        transformOrigin: 'center center',
        willChange: 'transform'
      }
    };
  }

  // Animation class map
  const animationMap: Record<PreviewEffectType, string> = {
    'ken-burns': 'animate-preview-ken-burns',
    'slow-zoom-in': 'animate-preview-zoom-in',
    'slow-zoom-out': 'animate-preview-zoom-out',
    'subtle-float': 'animate-preview-float',
    'pan-left-right': 'animate-preview-pan',
    'cinematic-pulse': 'animate-preview-pulse',
    'gentle-tilt': 'animate-preview-tilt',
    'hover-zoom': '',
    'none': ''
  };

  const animClass = animationMap[effect] || 'animate-preview-ken-burns';
  const hoverClass = hoverZoom ? 'hover:scale-[1.12] transition-transform duration-500' : '';

  return {
    className: `${animClass} ${hoverClass}`.trim(),
    style: {
      animationDuration: `${durationSec}s`,
      animationIterationCount: 'infinite',
      animationTimingFunction: 'ease-in-out',
      animationDirection: effect === 'ken-burns' ? 'alternate' : 'alternate',
      transformOrigin: 'center center',
      willChange: 'transform'
    }
  };
}
