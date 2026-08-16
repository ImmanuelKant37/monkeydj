export type Role = 'admin' | 'operator' | 'client';

export type EventType = 
  | 'Casamiento'
  | 'Cumpleaños de XV'
  | 'Cumpleaños Adultos'
  | 'Fiesta Infantil'
  | 'Evento Empresarial'
  | 'Fiesta de Egreso'
  | 'Evento Privado'
  | 'Festival / Concierto'
  | 'Otro';

export type CustomerStatus = 
  | 'Prospecto'
  | 'Presupuesto enviado'
  | 'Pendiente'
  | 'Confirmado'
  | 'Cliente frecuente'
  | 'Finalizado'
  | 'Cancelado';

export type BookingStatus = 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Completada' | 'Cancelada';

export type EventStatus = 'Presupuestado' | 'Reservado' | 'En Preparación' | 'Confirmado' | 'En Curso' | 'Finalizado' | 'Cancelado';

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  coverageKm: number;
  baseTravelFee: number;
  perKmFee: number;
  branchMultiplier: number;
  active: boolean;
  staffCount: number;
  vehiclesCount: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'DJ' | 'Sonido' | 'Iluminación' | 'Animación' | 'Efectos' | 'Pantallas' | 'Estructuras' | 'Extras' | 'Energía';
  description: string;
  basePrice: number;
  unit: 'evento' | 'hora' | 'unidad' | 'm2';
  imageUrl: string;
  videoUrl?: string;
  active: boolean;
  featured?: boolean;
  specs?: string[];
  requiresPowerKw?: number;
  branchId?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: EventType;
  tagline: string;
  price: number;
  popular?: boolean;
  features: string[];
  equipmentIncluded: string[];
}

export interface QuoteCalculationInput {
  eventType: EventType;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationHours: number;
  guestCount: number;
  branchId: string;
  city: string;
  distanceKm: number;
  selectedServices: string[]; // service IDs
  selectedExtras: { serviceId: string; quantity: number }[];
  appliedCoupon?: string;
}

export interface QuoteBreakdownItem {
  concept: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface RecommendedEquipment {
  speakersCount: number;
  subwoofersCount: number;
  totalWattage: number;
  movingHeadsCount: number;
  parLightsCount: number;
  laserCount: number;
  monitorsCount: number;
  microphonesCount: number;
}

export interface QuoteResult {
  id: string;
  quoteNumber: string;
  createdAt: string;
  input: QuoteCalculationInput;
  recommendedEquipment: RecommendedEquipment;
  items: QuoteBreakdownItem[];
  subtotal: number;
  guestFee: number;
  durationFee: number;
  travelFee: number;
  equipmentFee: number;
  surcharges: { name: string; amount: number }[];
  discounts: { name: string; amount: number }[];
  taxAmount: number;
  taxPercentage: number;
  total: number;
  suggestedDeposit: number; // e.g. 30%
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  address?: string;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
  totalEventsCount: number;
  totalSpent: number;
  registeredUser: boolean;
}

export interface BookingRequest {
  id: string;
  bookingNumber: string;
  quoteId?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerWhatsApp: string;
  eventType: EventType;
  eventDate: string;
  startTime: string;
  durationHours: number;
  branchId: string;
  venueName: string;
  venueAddress: string;
  city: string;
  guestCount: number;
  status: BookingStatus;
  totalAmount: number;
  depositPaid: number;
  pendingBalance: number;
  termsAccepted: boolean;
  notes?: string;
  createdAt: string;
}

export interface EventRecord {
  id: string;
  eventNumber: string;
  title: string;
  eventType: EventType;
  customerId: string;
  customerName: string;
  customerPhone: string;
  branchId: string;
  branchName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  city: string;
  guestCount: number;
  status: EventStatus;
  totalPrice: number;
  depositPaid: number;
  paymentStatus: 'Pendiente' | 'Anticipo Pagado' | 'Pagado Total';
  assignedStaff: { staffId: string; name: string; role: string }[];
  assignedEquipment: { equipmentId: string; name: string; quantity: number }[];
  assignedVehicle?: string;
  timelineNotes?: string;
  internalNotes?: string;
  contractSigned: boolean;
  contractSignedAt?: string;
  contractSignatureData?: string; // base64 canvas image signature
  protocolProcedures?: EventProcedure[];
}

export interface EventProcedure {
  id: string;
  title: string;
  eventType: EventType | 'Todos';
  estimatedTime?: string;
  durationMinutes?: number;
  category: 'Entrada & Recepción' | 'Cena & Fondo' | 'Momentos Clave' | 'Pista & Baile' | 'Show / Animación' | 'Cierre & Especiales';
  suggestedMusic?: string;
  description?: string;
  requiredEquipment?: string;
  order: number;
  active?: boolean;
}

export interface PricingConfig {
  baseHourlyRate: number;
  baseGuestRate: number; // rate per 50 guests or per guest
  perKmRate: number;
  baseFreightFee: number;
  speakersUnitCost: number; // per speaker
  subwooferUnitCost: number;
  movingHeadUnitCost: number;
  parLightUnitCost: number;
  powerKwRate: number;
  djHourlyRate: number;
  animatorHourlyRate: number;
  technicianHourlyRate: number;
  weekendSurchargePercent: number; // % for Saturday/Sunday
  holidaySurchargePercent: number; // % for holidays
  highSeasonSurchargePercent: number; // % for Nov-Dec-Jan
  defaultTaxPercent: number; // e.g. 21% IVA or 0
  depositPercentage: number; // e.g. 30%
}

export interface Equipment {
  id: string;
  name: string;
  category: 'Altavoces / Sonido' | 'Iluminación' | 'Consolas & DJ' | 'Pantallas & Proyección' | 'Efectos Especiales' | 'Estructuras & Módulos' | 'Energía' | 'Cables & Cableado' | 'Soportes & Trusses' | 'Otro';
  totalStock: number;
  availableStock: number;
  unitPowerWatts: number; // potencia en Watts o kW
  metersLength?: number; // metros de cable/longitud/superficie
  mountType?: string; // soportes, trípodes, agarres, clamps, etc.
  branchId: string;
  condition: 'Excelente' | 'Bueno' | 'En Mantenimiento' | 'Baja';
  notes?: string;
  brandModel?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  date: string;
  branchId?: string;
  status: 'Nuevo' | 'Leído' | 'Respondido' | 'Archivado';
  eventType?: EventType;
  source?: 'Formulario Web' | 'Cotizador' | 'WhatsApp' | 'Directo';
}

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  type: 'Camioneta' | 'Furgón Grande' | 'Camión Ligero';
  capacityKg: number;
  branchId: string;
  status: 'Disponible' | 'En Evento' | 'En Servicio';
}

export interface Staff {
  id: string;
  name: string;
  role: 'DJ Principal' | 'Animador / Locutor' | 'Técnico de Sonido' | 'Técnico de Luces' | 'Operador de FX';
  phone: string;
  branchId: string;
  active: boolean;
  avatarUrl?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  eventType: EventType;
  date: string;
  rating: number; // 1-5
  comment: string;
  avatarUrl?: string;
  featured: boolean;
  verified: boolean;
  branchId?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  mediaType: 'photo' | 'video' | 'reel';
  mediaUrl: string;
  thumbnailUrl: string;
  category: EventType;
  tags: string[];
  eventTitle?: string;
  featured?: boolean;
  branchId?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  validUntil: string;
  active: boolean;
}

export interface NotificationEmailConfig {
  adminEmails: string[];
  notifyNewQuote: boolean;
  notifyNewBooking: boolean;
  notifyStatusChange: boolean;
  notifyEventCancellation: boolean;
  notifyNewTestimonial: boolean;
  smtpServerConfigured: boolean;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userRole: string;
  userName: string;
  action: string;
  details: string;
}

export interface SiteContent {
  heroTag: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroCtaQuoteText: string;
  heroCtaServicesText: string;

  servicesTag: string;
  servicesTitle: string;
  servicesSubtitle: string;

  faqTag: string;
  faqTitle: string;
  faqSubtitle: string;

  quoteBannerTag: string;
  quoteBannerTitle: string;
  quoteBannerSubtitle: string;
}
