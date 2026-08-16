import {
  Branch,
  ServiceItem,
  ServicePackage,
  PricingConfig,
  Equipment,
  Vehicle,
  Staff,
  Testimonial,
  GalleryItem,
  Coupon,
  NotificationEmailConfig,
  Customer,
  EventRecord,
  BookingRequest,
  EventProcedure,
  SiteContent
} from '../types';

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b-concordia',
    name: 'MonkeyDJ - Sucursal Concordia (Entre Ríos)',
    code: 'CON-01',
    city: 'Concordia, Entre Ríos',
    address: 'Concordia, Entre Ríos',
    phone: '+54 9 3454 13-1152',
    whatsapp: '+54 9 3454 147 145',
    email: 'concordia@monkeydj.com.ar',
    coverageKm: 50,
    baseTravelFee: 10000,
    perKmFee: 600,
    branchMultiplier: 1.0,
    active: true,
    staffCount: 10,
    vehiclesCount: 3
  },
  {
    id: 'b-posadas',
    name: 'MonkeyDJ - Sucursal Posadas (Misiones)',
    code: 'POS-02',
    city: 'Posadas, Misiones',
    address: 'Posadas, Misiones',
    phone: '+54 9 3454 26-1057',
    whatsapp: '+54 9 3454 26-1057',
    email: 'posadas@monkeydj.com.ar',
    coverageKm: 60,
    baseTravelFee: 12000,
    perKmFee: 650,
    branchMultiplier: 1.0,
    active: true,
    staffCount: 8,
    vehiclesCount: 2
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 's-dj-pro',
    name: 'DJ Profesional Set live & Mixing',
    category: 'DJ',
    description: 'Set en vivo con DJ residente experimentado, controladores Pioneer Nexus, mezcla en vivo de todos los géneros (Pop, Cumbia, Reggaeton, 80s/90s, Electrónica, Rock).',
    basePrice: 120000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Controlador Pioneer DDJ-1000 / CDJ 2000 Nexus', 'Micrófono inalámbrico Shure', 'Repertorio personalizado con reunión previa']
  },
  {
    id: 's-animacion',
    name: 'Animación & Locución Dinámica',
    category: 'Animación',
    description: 'Animador profesional para conducción de tandas de baile, juegos grupales interactivos, sorteos, presentación de homenajeados y coordinación general.',
    basePrice: 85000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Conducción formal e informal', 'Juegos con premios y accesorios', 'Coreografías masivas e interacción']
  },
  {
    id: 's-sonido-line',
    name: 'Sistema de Sonido de Alta Potencia (Line Array)',
    category: 'Sonido',
    description: 'Bafles y subwoofers RCF / JBL profesionales de alta fidelidad. Configuración modular adaptable desde 50 hasta 1000+ invitados.',
    basePrice: 150000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Bafles RCF ART 745-A & Subwoofers 18"', 'Consola digital Behringer X32', 'Ecualización activa de salón'],
    requiresPowerKw: 4.5
  },
  {
    id: 's-luces-roboticas',
    name: 'Iluminación Inteligente & Cabezas Móviles Beam',
    category: 'Iluminación',
    description: 'Parrilla o estructuras Truss con cabezas móviles Beam 230W, arañas LED, baños de luz ambient y control DMX por consola Sunlite.',
    basePrice: 110000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Cabezas móviles 7R Beam & Spot', 'Control DMX en vivo con técnico operador', 'Luz negra UV y estrobos']
  },
  {
    id: 's-robot-led',
    name: 'Show de Robot LED Gigante & Megatrón',
    category: 'Animación',
    description: 'Robot Megatron con traje de Luces LED RGB de 2.6 metros de altura, disparadores de CO2 cryogenic, laser de alta potencia y efectos visuales impactantes para la tanda del carnaval.',
    basePrice: 95000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Robot de 2.60m con zancos', 'Pistola de CO2 frío y láser verde', 'Duración tanda de 45 mins con fotos']
  },
  {
    id: 's-pantalla-led',
    name: 'Pantalla LED Gigante P3.9 High Definition',
    category: 'Pantallas',
    description: 'Pantalla modular LED indoor/outdoor para proyección de videos de cronología, clips en vivo de baile, logos institucionales y efectos visuales sincronizados con la música.',
    basePrice: 180000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Módulos HD P3.9mm de alta luminosidad', 'Procesador de video VSN', 'Estructura de elevación segura']
  },
  {
    id: 's-humo-burbujas',
    name: 'Efectos Especiales: Humo Bajo, Burbujas y Fuego Frío',
    category: 'Efectos',
    description: 'Máquinas de humo denso bajo estilo nube (para el primer vals o presentación), lanzadores de chispa fría Sparks no inflamables y disparadores de burbujas continuas.',
    basePrice: 70000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    active: true,
    specs: ['4 Chisperos de fuego frío indoor seguras', 'Máquina de humo en seco CO2', 'Líquidos neutros sin olor']
  },
  {
    id: 's-cabina-fotos',
    name: 'Cabina Fotográfica Totem Touch + Impresión Instantánea',
    category: 'Extras',
    description: 'Tótem de fotos interactivo con pantalla táctil, utilería divertidos sombreros y carteles, impresiones térmicas ilimitadas en papel foto y galería digital descargable por QR.',
    basePrice: 130000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
    active: true,
    featured: true,
    specs: ['Cámara réflex Canon 24MP', 'Impresiones 10x15cm personalizadas con marco del evento', 'Asistente técnico durante todo el servicio']
  },
  {
    id: 's-microfonos',
    name: 'Micrófonos Inalámbricos adicionales & Monitoreo In-Ear',
    category: 'Sonido',
    description: 'Set de 4 micrófonos corbateros/de mano Sennheiser UHF de largo alcance y monitores de piso o in-ear para bandas o shows en vivo.',
    basePrice: 45000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=800&q=80',
    active: true
  },
  {
    id: 's-generador',
    name: 'Grupo Electrógeno Insonorizado de Respaldo (40 KVA)',
    category: 'Energía',
    description: 'Generador autónomo insonorizado a diésel para garantía 100% ininterrumpida frente a posibles cortes de luz en el salón.',
    basePrice: 160000,
    unit: 'evento',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    active: true,
    specs: ['40 KVA trifásico', 'Tanque lleno para 8 horas continuas', 'Conexión automática de emergencia ATS']
  }
];

export const INITIAL_PRICING_CONFIG: PricingConfig = {
  baseHourlyRate: 25000,
  baseGuestRate: 120, // cost calculated per guest above 50
  perKmRate: 800,
  baseFreightFee: 15000,
  speakersUnitCost: 15000,
  subwooferUnitCost: 20000,
  movingHeadUnitCost: 12000,
  parLightUnitCost: 6000,
  powerKwRate: 5000,
  djHourlyRate: 20000,
  animatorHourlyRate: 18000,
  technicianHourlyRate: 15000,
  weekendSurchargePercent: 15, // Saturday & Sunday
  holidaySurchargePercent: 25,
  highSeasonSurchargePercent: 20, // Nov, Dec, Jan
  defaultTaxPercent: 21,
  depositPercentage: 30
};

export const INITIAL_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Bafle Potenciado RCF ART 745-A 1400W',
    category: 'Altavoces / Sonido',
    totalStock: 16,
    availableStock: 12,
    unitPowerWatts: 1400,
    metersLength: 0,
    mountType: 'Trípode reforzado / Colgado Truss',
    branchId: 'b-concordia',
    condition: 'Excelente',
    brandModel: 'RCF Italy ART 745-A',
    notes: 'Bafles de alto rendimiento para pista principal'
  },
  {
    id: 'eq-2',
    name: 'Subwoofer Activo RCF SUB 8003-AS II 2200W',
    category: 'Altavoces / Sonido',
    totalStock: 10,
    availableStock: 8,
    unitPowerWatts: 2200,
    metersLength: 0,
    mountType: 'Piso / Apilado sobre goma',
    branchId: 'b-concordia',
    condition: 'Excelente',
    brandModel: 'RCF SUB 8003',
    notes: 'Graves profundos de 18 pulgadas'
  },
  {
    id: 'eq-3',
    name: 'Cabeza Móvil Beam 230W 7R DMX',
    category: 'Iluminación',
    totalStock: 24,
    availableStock: 18,
    unitPowerWatts: 350,
    metersLength: 0,
    mountType: 'Clamps para Truss Q30 / Base de piso',
    branchId: 'b-concordia',
    condition: 'Excelente',
    brandModel: 'PR Lighting 7R Beam',
    notes: 'Incluye frizza de seguridad y ganchos rápidos'
  },
  {
    id: 'eq-4',
    name: 'Cableado Multipar XLR / Trifásico 380V (Tramos)',
    category: 'Cables & Cableado',
    totalStock: 30,
    availableStock: 25,
    unitPowerWatts: 0,
    metersLength: 25,
    mountType: 'Pasa cables de goma ignífugo',
    branchId: 'all',
    condition: 'Excelente',
    brandModel: 'Mogami / Neutrik',
    notes: 'Mangueras de 25m y 50m con fichas schuko y trifásicas 32A'
  },
  {
    id: 'eq-5',
    name: 'Tramos de Estructura Truss de Aluminio Q30 (3 Metros)',
    category: 'Soportes & Trusses',
    totalStock: 18,
    availableStock: 14,
    unitPowerWatts: 0,
    metersLength: 3,
    mountType: 'Torre de elevación Genie / Base pesada 50kg',
    branchId: 'b-posadas',
    condition: 'Excelente',
    brandModel: 'Eurotruss Q30',
    notes: 'Tramos cuadrados certificados para soportar cabezales y pantallas'
  },
  {
    id: 'eq-6',
    name: 'Par LED RGBW 54x3W High Power Ambient',
    category: 'Iluminación',
    totalStock: 40,
    availableStock: 32,
    unitPowerWatts: 180,
    metersLength: 0,
    mountType: 'Trípode / Base perimetral de piso',
    branchId: 'b-posadas',
    condition: 'Bueno',
    brandModel: 'Big Dipper LPC007',
    notes: 'Ideal para bañado de paredes y arbolado'
  },
  {
    id: 'eq-7',
    name: 'Pantalla LED P3.9mm High Definition (Gabinete 50x50cm)',
    category: 'Pantallas & Proyección',
    totalStock: 48,
    availableStock: 40,
    unitPowerWatts: 150,
    metersLength: 12,
    mountType: 'Bumper de colgado / Estructura Floor Stand',
    branchId: 'b-concordia',
    condition: 'Excelente',
    brandModel: 'Absen P3.9 Outdoor',
    notes: 'Suma 12 m2 de pantalla modular combinable'
  },
  {
    id: 'eq-8',
    name: 'Soportes de Elevación & Torretas de Iluminación 5.5m',
    category: 'Soportes & Trusses',
    totalStock: 8,
    availableStock: 6,
    unitPowerWatts: 0,
    metersLength: 5.5,
    mountType: 'Malacate autofrenante con patas telescópicas',
    branchId: 'all',
    condition: 'Excelente',
    brandModel: 'KUZAR K-5',
    notes: 'Carga máxima 250kg por torre con freno de seguridad'
  }
];

export const INITIAL_MESSAGES: any[] = [
  {
    id: 'msg-101',
    name: 'Mariana Peralta',
    email: 'marianaperalta@gmail.com',
    phone: '+54 9 3454 88-9922',
    subject: 'Consulta Presupuesto Boda Noviembre 2026',
    message: 'Hola! Queremos averiguar disponibilidad para nuestro casamiento el 14 de noviembre en Concordia. Seremos 160 invitados y nos interesa sonido Line Array con pista de luces LED.',
    date: '2026-08-02 18:40',
    branchId: 'b-concordia',
    status: 'Nuevo',
    eventType: 'Casamiento',
    source: 'Formulario Web'
  },
  {
    id: 'msg-102',
    name: 'Lic. Roberto Godoy',
    email: 'rgodoy@agroempresa.com.ar',
    phone: '+54 9 3454 44-5511',
    subject: 'Evento Corporativo Anual 300 personas',
    message: 'Buenas tardes. Necesitamos cotizar sonido para disertantes, pantallas LED y micrófono corbatero para nuestro evento institucional en Posadas Misiones.',
    date: '2026-08-01 11:15',
    branchId: 'b-posadas',
    status: 'Respondido',
    eventType: 'Evento Empresarial',
    source: 'Cotizador'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'v-1', name: 'Furgón Mercedes Sprinter 515 (Carga Pesada)', licensePlate: 'AF-204-KL', type: 'Furgón Grande', capacityKg: 2500, branchId: 'b-capital', status: 'Disponible' },
  { id: 'v-2', name: 'Camioneta Toyota Hilux Equipamiento', licensePlate: 'AD-991-OP', type: 'Camioneta', capacityKg: 1000, branchId: 'b-capital', status: 'Disponible' },
  { id: 'v-3', name: 'Furgón Peugeot Boxer Logística', licensePlate: 'AC-332-WX', type: 'Furgón Grande', capacityKg: 1800, branchId: 'b-norte', status: 'Disponible' },
  { id: 'v-4', name: 'Camión Isuzu NQR Sonido & Estructuras', licensePlate: 'AA-881-ZZ', type: 'Camión Ligero', capacityKg: 4500, branchId: 'b-oeste', status: 'Disponible' }
];

export const INITIAL_STAFF: Staff[] = [
  { id: 'st-1', name: 'Lucas "DJ Lex" Morales', role: 'DJ Principal', phone: '+54 9 11 8899-1122', branchId: 'b-capital', active: true, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { id: 'st-2', name: 'Martín "MC Vibe" Rossi', role: 'Animador / Locutor', phone: '+54 9 11 7766-3344', branchId: 'b-capital', active: true, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { id: 'st-3', name: 'Ing. Gabriel Torres', role: 'Técnico de Sonido', phone: '+54 9 11 6655-4433', branchId: 'b-capital', active: true, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
  { id: 'st-4', name: 'Sofía Méndez (Lighting Designer)', role: 'Técnico de Luces', phone: '+54 9 11 5544-2211', branchId: 'b-norte', active: true, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    customerName: 'Valeria & Gonzalo',
    eventType: 'Casamiento',
    date: '2026-06-12',
    rating: 5,
    comment: '¡Fue una noche MÁGICA! La pista de baile nunca estuvo vacía. La combinación de la pantalla LED con la iluminación robótica y el robot LED dejó a todos los invitados boquiabiertos. El nivel de sonido impecable y super profesional.',
    avatarUrl: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=200&q=80',
    featured: true,
    verified: true,
    branchId: 'all'
  },
  {
    id: 't-2',
    customerName: 'Familia D’Amico',
    eventType: 'Cumpleaños de XV',
    date: '2026-07-04',
    rating: 5,
    comment: 'Contratamos el servicio completo para los 15 de nuestra hija Delfina. El animador mantuvo la energía arriba todo el tiempo, las chispas frías en la entrada quedaron espectaculares en las fotos y la cabina de fotos fue el gran éxito.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    featured: true,
    verified: true,
    branchId: 'b-concordia'
  },
  {
    id: 't-3',
    customerName: 'TechCorp Argentina - Gala Anual',
    eventType: 'Evento Empresarial',
    date: '2026-05-20',
    rating: 5,
    comment: 'Puntualidad británica, sonido cristalino para las ponencias y una fiesta de fin de año inolvidable con más de 400 empleados. La cotización fue súper transparente desde el minuto uno.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    featured: true,
    verified: true,
    branchId: 'b-posadas'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g-1',
    title: 'Casamiento Soñado en Estancia La Sofía',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=500&q=80',
    category: 'Casamiento',
    tags: ['Iluminación Ambient', 'Sonido Premium', 'Vals Humo Bajo'],
    eventTitle: 'Boda Valeria & Gonzalo',
    featured: true
  },
  {
    id: 'g-2',
    title: 'Fiesta de XV Cumpleaños Delfina',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=500&q=80',
    category: 'Cumpleaños de XV',
    tags: ['Robot LED', 'Cabezas Móviles', 'Carnaval Carioca'],
    eventTitle: 'XV Delfina',
    featured: true
  },
  {
    id: 'g-3',
    title: 'Show Robot Megatrón en Vivo',
    mediaType: 'reel',
    mediaUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80',
    category: 'Fiesta de Egreso',
    tags: ['CO2 Megatrón', 'Pista Llena'],
    eventTitle: 'Fiesta Colegio San Martín',
    featured: true
  },
  {
    id: 'g-4',
    title: 'Gala Anual Corporativa 500 Personas',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=500&q=80',
    category: 'Evento Empresarial',
    tags: ['Pantalla LED P3.9', 'Line Array', 'Microfonía Sennheiser'],
    eventTitle: 'TechCorp Annual Night',
    featured: true
  },
  {
    id: 'g-5',
    title: 'Set DJ Pista Exterior Quinta Olivos',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=500&q=80',
    category: 'Cumpleaños Adultos',
    tags: ['DJ Live', 'Luces Vintage', 'Chillout'],
    eventTitle: 'Cumple 40 Nicolás'
  },
  {
    id: 'g-6',
    title: 'Entrada Triunfal Fuego Frío',
    mediaType: 'video',
    mediaUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80',
    category: 'Casamiento',
    tags: ['Chispas Frías', 'Lanzadores Sparks'],
    eventTitle: 'Boda Camila & Mateo'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-101',
    firstName: 'Valeria',
    lastName: 'Gómez',
    company: 'Particular',
    phone: '1148293021',
    whatsapp: '1123456789',
    email: 'valegomez@gmail.com',
    city: 'San Isidro',
    address: 'Av. Santa Fe 1240',
    status: 'Confirmado',
    notes: 'Boda en salón Astilleros. Solicitaron pista retro y show de luces.',
    createdAt: '2026-05-10',
    totalEventsCount: 1,
    totalSpent: 680000,
    registeredUser: true
  },
  {
    id: 'c-102',
    firstName: 'Mariano',
    lastName: 'Sosa',
    company: 'TechCorp SA',
    phone: '1198765432',
    whatsapp: '1198765432',
    email: 'msosa@techcorp.com.ar',
    city: 'CABA',
    address: 'Puerto Madero',
    status: 'Cliente frecuente',
    notes: 'Cliente corporativo vip. Siempre pide grupo electrógeno y pantalla LED.',
    createdAt: '2026-02-15',
    totalEventsCount: 3,
    totalSpent: 1850000,
    registeredUser: true
  }
];

export const INITIAL_EVENTS: EventRecord[] = [
  {
    id: 'ev-201',
    eventNumber: 'EV-2026-081',
    title: 'Casamiento Valeria & Gonzalo',
    eventType: 'Casamiento',
    customerId: 'c-101',
    customerName: 'Valeria Gómez',
    customerPhone: '1123456789',
    branchId: 'b-norte',
    branchName: 'Sucursal Zona Norte - San Isidro',
    eventDate: '2026-08-15',
    startTime: '20:00',
    endTime: '05:00',
    venueName: 'Salón Astilleros Milberg',
    venueAddress: 'Ruta 27 Km 8.5, Tigre',
    city: 'Tigre',
    guestCount: 180,
    status: 'Confirmado',
    totalPrice: 680000,
    depositPaid: 250000,
    paymentStatus: 'Anticipo Pagado',
    assignedStaff: [
      { staffId: 'st-1', name: 'Lucas "DJ Lex" Morales', role: 'DJ Principal' },
      { staffId: 'st-2', name: 'Martín "MC Vibe" Rossi', role: 'Animador / Locutor' },
      { staffId: 'st-4', name: 'Sofía Méndez', role: 'Técnico de Luces' }
    ],
    assignedEquipment: [
      { equipmentId: 'eq-1', name: 'Bafle Potenciado RCF ART 745-A', quantity: 4 },
      { equipmentId: 'eq-2', name: 'Subwoofer Activo RCF SUB 8003-AS II', quantity: 2 },
      { equipmentId: 'eq-3', name: 'Cabeza Móvil Beam 230W 7R', quantity: 8 },
      { equipmentId: 'eq-8', name: 'Traje de Robot LED Megatrón', quantity: 1 }
    ],
    assignedVehicle: 'Furgón Mercedes Sprinter 515',
    timelineNotes: '20:00 Recepción acústica | 22:30 Plato principal | 00:00 Vals humo bajo | 01:30 Robot LED carnaval | 05:00 Cierre',
    contractSigned: true,
    contractSignedAt: '2026-05-12 14:30'
  },
  {
    id: 'ev-202',
    eventNumber: 'EV-2026-082',
    title: 'Cumpleaños de 15 Sofia',
    eventType: 'Cumpleaños de XV',
    customerId: 'c-102',
    customerName: 'Roberto Fernandez',
    customerPhone: '1155443322',
    branchId: 'b-capital',
    branchName: 'Sucursal Central - Capital Federal',
    eventDate: '2026-08-22',
    startTime: '21:00',
    endTime: '05:30',
    venueName: 'Quinta Las Magnolias',
    venueAddress: 'Av. De Mayo 1400',
    city: 'Ramos Mejía',
    guestCount: 130,
    status: 'En Preparación',
    totalPrice: 520000,
    depositPaid: 200000,
    paymentStatus: 'Anticipo Pagado',
    assignedStaff: [
      { staffId: 'st-1', name: 'Lucas "DJ Lex" Morales', role: 'DJ Principal' }
    ],
    assignedEquipment: [
      { equipmentId: 'eq-1', name: 'Bafle Potenciado RCF ART 745-A', quantity: 2 },
      { equipmentId: 'eq-3', name: 'Cabeza Móvil Beam 230W 7R', quantity: 4 }
    ],
    contractSigned: true,
    contractSignedAt: '2026-06-01'
  }
];

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'bk-501',
    bookingNumber: 'RES-2026-01',
    customerId: 'c-101',
    customerName: 'Valeria Gómez',
    customerEmail: 'valegomez@gmail.com',
    customerPhone: '1123456789',
    customerWhatsApp: '1123456789',
    eventType: 'Casamiento',
    eventDate: '2026-08-15',
    startTime: '20:00',
    durationHours: 9,
    branchId: 'b-norte',
    venueName: 'Salón Astilleros Milberg',
    venueAddress: 'Ruta 27 Km 8.5',
    city: 'Tigre',
    guestCount: 180,
    status: 'Aprobada',
    totalAmount: 680000,
    depositPaid: 250000,
    pendingBalance: 430000,
    termsAccepted: true,
    createdAt: '2026-05-11 10:15'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'AURA2026', discountPercent: 10, description: 'Descuento de bienvenida 10% en reservas anticipadas', validUntil: '2026-12-31', active: true },
  { code: 'BODASVIP', discountPercent: 15, description: '15% de descuento exclusivo en combos de Bodas y XV', validUntil: '2026-11-30', active: true },
  { code: 'CORPORATE', discountPercent: 12, description: 'Descuento empresarial para eventos corporativos', validUntil: '2026-12-31', active: true }
];

export const INITIAL_NOTIFICATION_CONFIG: NotificationEmailConfig = {
  adminEmails: ['fecsoul@gmail.com', 'admin@aurasound.com.ar'],
  notifyNewQuote: true,
  notifyNewBooking: true,
  notifyStatusChange: true,
  notifyEventCancellation: true,
  notifyNewTestimonial: true,
  smtpServerConfigured: true
};

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: 'pkg-boda-gold',
    name: 'Combo Boda & XV Gold',
    category: 'Casamiento',
    tagline: 'Solución integral de sonido Line Array, iluminación robótica y DJ en vivo.',
    price: 480000,
    popular: true,
    features: [
      'DJ Profesional con cabina LED Neón',
      'Sistema de Sonido Line Array RCF (hasta 250 personas)',
      'Estructura Truss con 8 Cabezales Móviles Beam 10R',
      'Pista de Baile LED RGB 6x6 metros',
      'Máquina de Humo Denso & Chispa Fría (Cold Spark)'
    ],
    equipmentIncluded: ['Bafles RCF', 'Cabezales 10R', 'Pista LED', 'Chispas Frías']
  },
  {
    id: 'pkg-xv-premium',
    name: 'Pack XV Deluxe Aura',
    category: 'Cumpleaños de XV',
    tagline: 'El máximo show de iluminación, robot LED gigante y pantalla LED P3.',
    price: 590000,
    popular: false,
    features: [
      'Show de Robot LED con Megáfono Láser y Megatrón de CO2',
      'Pantalla LED Gigante HD 4x2 metros para videos de recuerdo',
      'Iluminación Computarizada DMX con Láser RGB 3D',
      'DJ + Animador / Locutor de protocolo',
      'Estructura de Iluminación en Cuadrilátero 6x6 m'
    ],
    equipmentIncluded: ['Robot LED', 'Pantalla LED 4x2m', 'Láser 3D', 'Chispa Fría']
  },
  {
    id: 'pkg-empresariales',
    name: 'Corporate Gala & Conferencia',
    category: 'Evento Empresarial',
    tagline: 'Equipamiento sobrio y sonido cristalino para presentaciones corporativas.',
    price: 380000,
    popular: false,
    features: [
      'Micrófonos Corbateros Inalámbricos Shure & Vincha',
      'Sonido Distribución Direccional para Salón Completo',
      'Pantallas LED P3.9 para Presentaciones Keynote',
      'Iluminación Arquitectónica Ámbar / Warm White',
      'Técnico Operador Dedicado en Vivo'
    ],
    equipmentIncluded: ['Mics Shure', 'Sonido Distribución', 'Pantalla P3.9']
  }
];

export const INITIAL_PROCEDURES: EventProcedure[] = [
  // Cumpleaños de XV
  {
    id: 'proc-xv-01',
    title: 'Recepción & Cocktail de Bienvenida',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '21:00 hs',
    durationMinutes: 45,
    category: 'Entrada & Recepción',
    suggestedMusic: 'Pop internacional, Acoustic Hits, Deep House suave',
    description: 'Música ambiental sobria para llegada de invitados. Proyección de logo o fotos fijas de la quinceañera.',
    requiredEquipment: 'Sonido ambiental distribuido, iluminación tenue',
    order: 1,
    active: true
  },
  {
    id: 'proc-xv-02',
    title: 'Entrada Principal de la Quinceañera (Canción Solicitada)',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '22:00 hs',
    durationMinutes: 15,
    category: 'Entrada & Recepción',
    suggestedMusic: 'Canción favorita elegida por la quinceañera (Hit emocional / Pop epic)',
    description: 'Apagado total de luces. Encendido de robóticas en modo haz blanco/rosa. Humo denso y disparo de chispas frías (Cold Spark) en alfombra roja.',
    requiredEquipment: 'Robóticas Beam, humo denso, 4 chispas frías, micrófono inalámbrico',
    order: 2,
    active: true
  },
  {
    id: 'proc-xv-03',
    title: 'Vals con Papá, Familiares & Amigos',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '22:15 hs',
    durationMinutes: 20,
    category: 'Momentos Clave',
    suggestedMusic: 'Vals clásico de Strauss, Danubio Azul o versión instrumental moderna',
    description: 'Bailes de vals en tanda. Anuncio por locutor/DJ de familiares y padrinos.',
    requiredEquipment: 'Luz ambiental cálida, micrófono para llamada de familia',
    order: 3,
    active: true
  },
  {
    id: 'proc-xv-04',
    title: 'Cena & Plato Principal (Música Sugerida)',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '22:45 hs',
    durationMinutes: 60,
    category: 'Cena & Fondo',
    suggestedMusic: 'Música sugerida: Indie Pop, Reggaeton suave, Bossa Nova lounge',
    description: 'Acompañamiento musical a volumen moderado para permitir conversación entre comensales.',
    requiredEquipment: 'Ecualización cena, luces fijas de ambiente',
    order: 4,
    active: true
  },
  {
    id: 'proc-xv-05',
    title: 'Parte Emotiva & Video Homenaje / Timeline',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '23:50 hs',
    durationMinutes: 20,
    category: 'Momentos Clave',
    suggestedMusic: 'Banda sonora emotiva para video cronológico de la infancia',
    description: 'Proyección del video en pantalla LED. Apagado de luces de pista. Audio conectado a consola principal.',
    requiredEquipment: 'Pantalla LED / Proyector HD, conexión audio estéreo',
    order: 5,
    active: true
  },
  {
    id: 'proc-xv-06',
    title: 'Etapa de Baile 1: Hits, Cumbia & Reggaeton (Canciones Sugeridas)',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '00:15 hs',
    durationMinutes: 75,
    category: 'Pista & Baile',
    suggestedMusic: 'Lista sugerida de temas de fiesta actual (RKT, Cumbia 420, Reggaeton clásico & 2026)',
    description: 'Apertura de la pista a pleno. Luces rítmicas computarizadas, estrobos, láseres y humo.',
    requiredEquipment: 'Sistema de sonido completo, cabezales móviles, láser 3D, máquinas de humo',
    order: 6,
    active: true
  },
  {
    id: 'proc-xv-07',
    title: 'Banda / Show en Vivo o Robot LED Megatrón',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '01:30 hs',
    durationMinutes: 45,
    category: 'Show / Animación',
    suggestedMusic: 'Cumbia en vivo / Set electrónico con robot LED y pistola de CO2',
    description: 'Presentación del show interactivo. Pruebas de micrófono previas y asistencia técnica en escenario.',
    requiredEquipment: 'Monitores de escenario, micrófono en mano, jet de CO2, traje LED',
    order: 7,
    active: true
  },
  {
    id: 'proc-xv-08',
    title: 'Animación & Juegos / Preguntas Íntimas / Momento de Parejas',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '02:15 hs',
    durationMinutes: 30,
    category: 'Show / Animación',
    suggestedMusic: 'Cortinas cómicas, música de suspenso y éxitos románticos',
    description: 'Interacción del animador con la agasajada y sus mejores amigos. Preguntas íntimas divertidas y dinámicas de parejas.',
    requiredEquipment: '2 Micrófonos inalámbricos, consola con cortinados de efectos de sonido',
    order: 8,
    active: true
  },
  {
    id: 'proc-xv-09',
    title: 'Dedicatorias del Público al Anfitrión',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '02:45 hs',
    durationMinutes: 20,
    category: 'Momentos Clave',
    suggestedMusic: 'Música de fondo suave e inspiradora',
    description: 'Micrófono circulante por las mesas o amigos cercanos para expresar mensajes y buenos deseos.',
    requiredEquipment: 'Micrófono inalámbrico de largo alcance con filtro anti-pop',
    order: 9,
    active: true
  },
  {
    id: 'proc-xv-10',
    title: 'Carnaval Carioca & Cotillón Luminoso',
    eventType: 'Cumpleaños de XV',
    estimatedTime: '03:05 hs',
    durationMinutes: 40,
    category: 'Cierre & Especiales',
    suggestedMusic: 'Samba brasilera, Murga argentina, Remixes carioca explosivos',
    description: 'Reparto de cotillón flúor y luminoso. Máximo despliegue de luces LED y efecto fiesta de espuma/humo.',
    requiredEquipment: 'Luces ultraviolentas (UV), lásers, cañón de cotillón',
    order: 10,
    active: true
  },

  // Casamiento
  {
    id: 'proc-cas-01',
    title: 'Recepción & Cocktail de Bienvenida',
    eventType: 'Casamiento',
    estimatedTime: '20:30 hs',
    durationMinutes: 60,
    category: 'Entrada & Recepción',
    suggestedMusic: 'Jazz, Bossa Nova, Smooth Lounge o versiones acústicas de clásicos',
    description: 'Música ambiental distinguida mientras llegan los novios y se sirven los bocadillos iniciales.',
    requiredEquipment: 'Sonido perimetral de alta fidelidad, luces cálidas fijas',
    order: 1,
    active: true
  },
  {
    id: 'proc-cas-02',
    title: 'Ingreso Triunfal de los Novios (Canción Solicitada)',
    eventType: 'Casamiento',
    estimatedTime: '21:30 hs',
    durationMinutes: 15,
    category: 'Entrada & Recepción',
    suggestedMusic: 'Tema representativo de la pareja (Pop Épico / Rock Clásico / Romántico)',
    description: 'Entrada con aplausos masivos, focos robóticos siguiendo a la pareja y lluvia de chispas frías.',
    requiredEquipment: 'Cabezales Beam en modo seguimiento, chispas frías',
    order: 2,
    active: true
  },
  {
    id: 'proc-cas-03',
    title: 'Vals de Novios & Baile de Apertura',
    eventType: 'Casamiento',
    estimatedTime: '21:45 hs',
    durationMinutes: 15,
    category: 'Momentos Clave',
    suggestedMusic: 'Vals elegido o balada lenta especial',
    description: 'Bailan primero los novios y luego se incorporan los padres y padrinos. Efecto nube de humo bajo.',
    requiredEquipment: 'Máquina de humo bajo (nube), luz focalizada suave',
    order: 3,
    active: true
  },
  {
    id: 'proc-cas-04',
    title: 'Cena Principal (Música Sugerida)',
    eventType: 'Casamiento',
    estimatedTime: '22:00 hs',
    durationMinutes: 75,
    category: 'Cena & Fondo',
    suggestedMusic: 'Música sugerida: Boleros, Soul, Pop acústico en español e inglés',
    description: 'Nivel sonoro ideal para que los comensales disfruten del menú y conversen cómodamente.',
    requiredEquipment: 'Ecualización limpia y equilibrada',
    order: 4,
    active: true
  },
  {
    id: 'proc-cas-05',
    title: 'Tanda de Baile 1: Cumbia, Retro & Pop Hits',
    eventType: 'Casamiento',
    estimatedTime: '23:15 hs',
    durationMinutes: 60,
    category: 'Pista & Baile',
    suggestedMusic: 'Cumbia clásica (Los Palmeras, Gilda), Pop 80s/90s, Hits del momento',
    description: 'Primer bloque de pista bailable para todas las edades.',
    requiredEquipment: 'Luces robóticas rítmicas, humo',
    order: 5,
    active: true
  },
  {
    id: 'proc-cas-06',
    title: 'Preguntas Íntimas / Trivia de Novios & Momento de Parejas',
    eventType: 'Casamiento',
    estimatedTime: '00:15 hs',
    durationMinutes: 30,
    category: 'Show / Animación',
    suggestedMusic: 'Música de juego, cortina de concurso y romántica',
    description: 'Juego de los zapatos o preguntas cruzadas sobre la historia de amor. Animador coordina las risas del público.',
    requiredEquipment: '2 Micrófonos inalámbricos, sillas al centro de la pista',
    order: 6,
    active: true
  },
  {
    id: 'proc-cas-07',
    title: 'Carioca, Ramo, Liga & Brindis Final',
    eventType: 'Casamiento',
    estimatedTime: '01:30 hs',
    durationMinutes: 45,
    category: 'Cierre & Especiales',
    suggestedMusic: 'Samba, carnaval festivo, marcha nupcial remix',
    description: 'Lanzamiento tradicional de ramo y liga, seguido de fiesta descontrolada de carnaval carioca.',
    requiredEquipment: 'Micrófono en mano, cañón de confeti/cotillón',
    order: 7,
    active: true
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  heroTag: 'Servicio Premium de DJ, Sonido, Luces & Animación',
  heroTitleLine1: 'HACEMOS DE TU EVENTO',
  heroTitleLine2: 'UNA EXPERIENCIA INOLVIDABLE',
  heroSubtitle: 'Equipamiento RCF de alta fidelidad, iluminación robótica DMX, robot LED CO2, pantallas gigantes y DJ residente para casamientos, fiestas de 15, corporativos y egresos.',
  heroCtaQuoteText: 'COTIZAR MI EVENTO AHORA',
  heroCtaServicesText: 'EXPLORAR SERVICIOS',

  servicesTag: 'Nuestra Propuesta Comercial',
  servicesTitle: 'SERVICIOS DE PRODUCCIÓN Y SHOWS',
  servicesSubtitle: 'Equipamiento propio homologado, personal técnico calificado e innovación visual para hacer tu celebración inolvidable.',

  faqTag: 'Resolución de Dudas',
  faqTitle: 'PREGUNTAS FRECUENTES',
  faqSubtitle: 'Respuestas claras para que organices tu evento con total tranquilidad.',

  quoteBannerTag: 'Cotización Online Instantánea',
  quoteBannerTitle: '¿Querés saber cuánto cuesta tu evento?',
  quoteBannerSubtitle: 'Calculá en menos de 1 minuto con precios oficiales, promociones por combo y disponibilidad para Concordia y Posadas.'
};

