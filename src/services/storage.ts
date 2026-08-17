import {
  Branch,
  ServiceItem,
  PricingConfig,
  Equipment,
  Vehicle,
  Staff,
  Testimonial,
  GalleryItem,
  Customer,
  EventRecord,
  BookingRequest,
  QuoteResult,
  Coupon,
  NotificationEmailConfig,
  AuditLog,
  ContactMessage,
  EventProcedure,
  SiteContent
} from '../types';

import {
  INITIAL_BRANCHES,
  INITIAL_SERVICES,
  INITIAL_PACKAGES,
  INITIAL_PRICING_CONFIG,
  INITIAL_EQUIPMENT,
  INITIAL_VEHICLES,
  INITIAL_STAFF,
  INITIAL_TESTIMONIALS,
  INITIAL_GALLERY,
  INITIAL_CUSTOMERS,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_COUPONS,
  INITIAL_NOTIFICATION_CONFIG,
  INITIAL_MESSAGES,
  INITIAL_PROCEDURES,
  INITIAL_SITE_CONTENT
} from '../data/initialData';

import { SupabaseService } from './supabase';

import { idbGet, idbSet, idbRemove } from './indexedDb';

const STORAGE_KEYS = {
  BRANCHES: 'aura_branches_v1',
  SERVICES: 'aura_services_v1',
  PRICING: 'aura_pricing_v1',
  EQUIPMENT: 'aura_equipment_v1',
  VEHICLES: 'aura_vehicles_v1',
  STAFF: 'aura_staff_v1',
  TESTIMONIALS: 'aura_testimonials_v1',
  GALLERY: 'aura_gallery_v1',
  CUSTOMERS: 'aura_customers_v1',
  EVENTS: 'aura_events_v1',
  BOOKINGS: 'aura_bookings_v1',
  QUOTES: 'aura_quotes_v1',
  COUPONS: 'aura_coupons_v1',
  NOTIFICATIONS: 'aura_notifications_v1',
  AUDIT_LOGS: 'aura_audit_logs_v1',
  MESSAGES: 'aura_messages_v1',
  PROCEDURES: 'aura_procedures_v1',
  SITE_CONTENT: 'aura_site_content_v1'
};

// In-Memory Synchronous Cache to eliminate latency and survive LocalStorage Quota limits
const memoryCache: Record<string, any> = {};

function getItem<T>(key: string, fallback: T): T {
  if (memoryCache[key] !== undefined) {
    return memoryCache[key];
  }
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      memoryCache[key] = fallback;
      return fallback;
    }
    const parsed = JSON.parse(raw);
    memoryCache[key] = parsed;
    return parsed;
  } catch (e) {
    memoryCache[key] = fallback;
    return fallback;
  }
}

function setItem<T>(key: string, val: T): void {
  // 1. Immediately store in memory cache
  memoryCache[key] = val;

  // 2. Persist to IndexedDB asynchronously (handles >100MB of images)
  idbSet(key, val).catch(() => {});

  // 3. Best-effort LocalStorage write
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`LocalStorage quota reached for ${key}, data safely preserved in IndexedDB and memory cache.`);
  }
}

export class AppStorage {
  static initStorage(): void {
    const MIGRATION_KEY = 'monkeydj_clean_defaults_v2';
    if (!localStorage.getItem(MIGRATION_KEY)) {
      // Clean slate migration for initial setup
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify([]));
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify([]));
      localStorage.setItem(MIGRATION_KEY, 'true');
    }

    if (!localStorage.getItem(STORAGE_KEYS.BRANCHES)) {
      setItem(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES);
    }

    // 1. Load asynchronous high-capacity data from local IndexedDB into memory cache first
    idbGet<GalleryItem[]>(STORAGE_KEYS.GALLERY).then((idbGallery) => {
      if (idbGallery && Array.isArray(idbGallery) && idbGallery.length > 0) {
        memoryCache[STORAGE_KEYS.GALLERY] = idbGallery;
        window.dispatchEvent(new CustomEvent('monkeydj_gallery_updated', { detail: idbGallery }));
      }
    });

    idbGet<ServiceItem[]>(STORAGE_KEYS.SERVICES).then((idbServices) => {
      if (idbServices && Array.isArray(idbServices) && idbServices.length > 0) {
        memoryCache[STORAGE_KEYS.SERVICES] = idbServices;
        window.dispatchEvent(new CustomEvent('monkeydj_services_updated', { detail: idbServices }));
      }
    });

    // 2. Fetch latest data from Supabase Cloud Database (for cross-browser / multi-device synchronization)
    SupabaseService.syncGallery().then((cloudGallery) => {
      if (cloudGallery && Array.isArray(cloudGallery) && cloudGallery.length > 0) {
        memoryCache[STORAGE_KEYS.GALLERY] = cloudGallery;
        idbSet(STORAGE_KEYS.GALLERY, cloudGallery).catch(() => {});
        try {
          localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(cloudGallery));
        } catch {}
        window.dispatchEvent(new CustomEvent('monkeydj_gallery_updated', { detail: cloudGallery }));
      }
    });

    SupabaseService.syncServices().then((cloudServices) => {
      if (cloudServices && Array.isArray(cloudServices) && cloudServices.length > 0) {
        memoryCache[STORAGE_KEYS.SERVICES] = cloudServices;
        idbSet(STORAGE_KEYS.SERVICES, cloudServices).catch(() => {});
        try {
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(cloudServices));
        } catch {}
        window.dispatchEvent(new CustomEvent('monkeydj_services_updated', { detail: cloudServices }));
      }
    });

    SupabaseService.syncTestimonials().then((cloudTestimonials) => {
      if (cloudTestimonials && Array.isArray(cloudTestimonials) && cloudTestimonials.length > 0) {
        memoryCache[STORAGE_KEYS.TESTIMONIALS] = cloudTestimonials;
        try {
          localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(cloudTestimonials));
        } catch {}
        window.dispatchEvent(new CustomEvent('monkeydj_testimonials_updated', { detail: cloudTestimonials }));
      }
    });

    SupabaseService.syncSiteContent().then((cloudContent) => {
      if (cloudContent && typeof cloudContent === 'object') {
        memoryCache[STORAGE_KEYS.SITE_CONTENT] = cloudContent;
        try {
          localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(cloudContent));
        } catch {}
        window.dispatchEvent(new CustomEvent('monkeydj_site_content_updated', { detail: cloudContent }));
      }
    });

    SupabaseService.syncBranches().then((cloudBranches) => {
      if (cloudBranches && Array.isArray(cloudBranches) && cloudBranches.length > 0) {
        memoryCache[STORAGE_KEYS.BRANCHES] = cloudBranches;
        try {
          localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(cloudBranches));
        } catch {}
        window.dispatchEvent(new CustomEvent('monkeydj_branches_updated', { detail: cloudBranches }));
      }
    });
  }

  static clearGallery(): void {
    memoryCache[STORAGE_KEYS.GALLERY] = [];
    setItem(STORAGE_KEYS.GALLERY, []);
    idbRemove(STORAGE_KEYS.GALLERY).catch(() => {});
    SupabaseService.saveGallery([]);
    window.dispatchEvent(new CustomEvent('monkeydj_gallery_updated', { detail: [] }));
    this.addAuditLog('Admin', 'Galería Vaciada', 'Se eliminaron todas las fotos y videos');
  }

  static clearServices(): void {
    memoryCache[STORAGE_KEYS.SERVICES] = [];
    setItem(STORAGE_KEYS.SERVICES, []);
    idbRemove(STORAGE_KEYS.SERVICES).catch(() => {});
    SupabaseService.saveServices([]);
    window.dispatchEvent(new CustomEvent('monkeydj_services_updated', { detail: [] }));
    this.addAuditLog('Admin', 'Catálogo de Servicios Vaciado', 'Se eliminaron todos los servicios');
  }

  static getPackages() {
    return INITIAL_PACKAGES;
  }

  static getBranches(): Branch[] {
    return getItem(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES);
  }
  static saveBranches(data: Branch[]): void {
    setItem(STORAGE_KEYS.BRANCHES, data);
    SupabaseService.saveBranches(data);
    this.addAuditLog('Sistema', 'Actualización de Sucursales', `${data.length} sucursales en total`);
  }

  static getServices(): ServiceItem[] {
    return getItem(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  }
  static saveServices(data: ServiceItem[]): void {
    setItem(STORAGE_KEYS.SERVICES, data);
    SupabaseService.saveServices(data);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('monkeydj_services_updated', { detail: data }));
    }
    this.addAuditLog('Admin', 'Actualización de Catálogo de Servicios', `${data.length} servicios`);
  }

  static getPricingConfig(): PricingConfig {
    return getItem(STORAGE_KEYS.PRICING, INITIAL_PRICING_CONFIG);
  }
  static savePricingConfig(data: PricingConfig): void {
    setItem(STORAGE_KEYS.PRICING, data);
    this.addAuditLog('Admin', 'Configuración de Precios Modificada', 'Actualización de matriz tarifaria');
  }

  static getEquipment(): Equipment[] {
    return getItem(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  }
  static saveEquipment(data: Equipment[]): void {
    setItem(STORAGE_KEYS.EQUIPMENT, data);
    SupabaseService.saveEntity('equipment', STORAGE_KEYS.EQUIPMENT, data);
  }

  static getVehicles(): Vehicle[] {
    return getItem(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  }
  static saveVehicles(data: Vehicle[]): void {
    setItem(STORAGE_KEYS.VEHICLES, data);
  }

  static getStaff(): Staff[] {
    return getItem(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }
  static saveStaff(data: Staff[]): void {
    setItem(STORAGE_KEYS.STAFF, data);
  }

  static getTestimonials(): Testimonial[] {
    return getItem(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
  }
  static saveTestimonials(data: Testimonial[]): void {
    setItem(STORAGE_KEYS.TESTIMONIALS, data);
    SupabaseService.saveTestimonials(data);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('monkeydj_testimonials_updated', { detail: data }));
    }
  }

  static getGallery(): GalleryItem[] {
    return getItem(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  }
  static saveGallery(data: GalleryItem[]): void {
    setItem(STORAGE_KEYS.GALLERY, data);
    SupabaseService.saveGallery(data);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('monkeydj_gallery_updated', { detail: data }));
    }
  }

  static getCustomers(): Customer[] {
    return getItem(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  }
  static saveCustomers(data: Customer[]): void {
    setItem(STORAGE_KEYS.CUSTOMERS, data);
    SupabaseService.saveEntity('customers', STORAGE_KEYS.CUSTOMERS, data);
  }

  static getEvents(): EventRecord[] {
    return getItem(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  }
  static saveEvents(data: EventRecord[]): void {
    setItem(STORAGE_KEYS.EVENTS, data);
    SupabaseService.saveEntity('events', STORAGE_KEYS.EVENTS, data);
  }

  static getBookings(): BookingRequest[] {
    return getItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
  }
  static saveBookings(data: BookingRequest[]): void {
    setItem(STORAGE_KEYS.BOOKINGS, data);
    SupabaseService.saveEntity('bookings', STORAGE_KEYS.BOOKINGS, data);
  }


  static getQuotes(): QuoteResult[] {
    return getItem(STORAGE_KEYS.QUOTES, []);
  }
  static saveQuote(quote: QuoteResult): void {
    const list = this.getQuotes();
    list.unshift(quote);
    setItem(STORAGE_KEYS.QUOTES, list);
    this.addAuditLog('Cliente', 'Nuevo Presupuesto Generado', `Presupuesto N° ${quote.quoteNumber} - Total $${quote.total}`);
  }

  static getMessages(): ContactMessage[] {
    return getItem(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }
  static saveMessages(data: ContactMessage[]): void {
    setItem(STORAGE_KEYS.MESSAGES, data);
    SupabaseService.saveEntity('messages', STORAGE_KEYS.MESSAGES, data);
  }
  static addMessage(msg: Partial<ContactMessage>): ContactMessage {
    const list = this.getMessages();
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msg.name || 'Cliente Web',
      email: msg.email || '',
      phone: msg.phone || '',
      subject: msg.subject || 'Consulta Web',
      message: msg.message || '',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      branchId: msg.branchId || 'all',
      status: 'Nuevo',
      eventType: msg.eventType || 'Otro',
      source: msg.source || 'Formulario Web'
    };
    const updated = [newMsg, ...list];
    this.saveMessages(updated);
    this.addAuditLog('Cliente', 'Nuevo Mensaje de Contacto', `De ${newMsg.name} (${newMsg.email})`);
    return newMsg;
  }

  static getCoupons(): Coupon[] {
    return getItem(STORAGE_KEYS.COUPONS, INITIAL_COUPONS);
  }
  static saveCoupons(data: Coupon[]): void {
    setItem(STORAGE_KEYS.COUPONS, data);
  }

  static getNotificationConfig(): NotificationEmailConfig {
    return getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATION_CONFIG);
  }
  static saveNotificationConfig(data: NotificationEmailConfig): void {
    setItem(STORAGE_KEYS.NOTIFICATIONS, data);
  }

  static getAuditLogs(): AuditLog[] {
    return getItem(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        timestamp: new Date().toISOString(),
        userRole: 'Sistema',
        userName: 'Aura Core',
        action: 'Sistema Inicializado',
        details: 'Plataforma lista con configuración multi-sucursal'
      }
    ]);
  }

  static addAuditLog(role: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userRole: role,
      userName: role === 'Admin' ? 'Administrador' : role === 'Cliente' ? 'Usuario Web' : 'Operador',
      action,
      details
    };
    logs.unshift(newLog);
    setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep last 100
  }

  // Double booking & availability check
  static checkAvailability(dateStr: string, branchId: string): { available: boolean; conflictReason?: string } {
    const events = this.getEvents();
    const bookings = this.getBookings();

    const confirmedEventsSameDate = events.filter(
      (e) => e.eventDate === dateStr && e.branchId === branchId && e.status !== 'Cancelado'
    );

    const approvedBookingsSameDate = bookings.filter(
      (b) => b.eventDate === dateStr && b.branchId === branchId && (b.status === 'Aprobada' || b.status === 'Pendiente')
    );

    // Limit per branch per date e.g. max 3 concurrent events
    if (confirmedEventsSameDate.length >= 3) {
      return {
        available: false,
        conflictReason: `La sucursal seleccionada ya posee ${confirmedEventsSameDate.length} eventos confirmados para esta fecha (capacidad máxima alcanzada).`
      };
    }

    return { available: true };
  }

  // Event Procedures & Timeline Protocols
  static getProcedures(): EventProcedure[] {
    return getItem(STORAGE_KEYS.PROCEDURES, INITIAL_PROCEDURES);
  }

  static saveProcedures(data: EventProcedure[]): void {
    setItem(STORAGE_KEYS.PROCEDURES, data);
  }

  // Public Landing & Site Content Customizer
  static getSiteContent(): SiteContent {
    return getItem(STORAGE_KEYS.SITE_CONTENT, INITIAL_SITE_CONTENT);
  }

  static saveSiteContent(data: SiteContent): void {
    setItem(STORAGE_KEYS.SITE_CONTENT, data);
    SupabaseService.saveSiteContent(data);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('monkeydj_site_content_updated', { detail: data }));
    }
    this.addAuditLog('Sistema', 'Actualización de Textos Landing Page', 'Textos e itinerarios de portada actualizados');
  }
}
