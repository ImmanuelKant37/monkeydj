import { createClient } from '@supabase/supabase-js';
import {
  Customer,
  BookingRequest,
  ServiceItem,
  Branch,
  EventRecord,
  Equipment,
  Coupon,
  QuoteResult,
  GalleryItem,
  Testimonial,
  SiteContent
} from '../types';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://eslnyswrhmrnijtzdqis.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_gaRlX_kNju3RenekQ3C4_g_qNB2Beed';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Role assignment interface
export interface UserRoleRecord {
  id?: string;
  email: string;
  role: 'admin' | 'operator' | 'client';
  created_at?: string;
}

export interface CustomerConsulta {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate?: string;
  message: string;
  appliedCombo?: string;
  discountPercentage?: number;
  status: 'Pendiente' | 'Respondida' | 'Convertida';
  createdAt: string;
}

// Default Admin Email & Superusers
export const SUPER_ADMIN_EMAILS = [
  'fecsoul@gmail.com',
  'concordia@monkeydj.com.ar',
  'posadas@monkeydj.com.ar',
  'admin@monkeydj.com.ar',
  'admin@aurasound.com.ar'
];

export class SupabaseService {
  // --- MEDIA / STORAGE UPLOAD ---

  /**
   * Uploads an image or video file directly to Supabase Cloud Storage.
   * Returns the permanent public CDN URL if successful, or null if storage bucket is not available.
   */
  static async uploadMediaFile(file: File | Blob, fileName?: string): Promise<string | null> {
    try {
      const ext = fileName?.split('.').pop() || (file.type.includes('png') ? 'png' : file.type.includes('mp4') ? 'mp4' : 'jpg');
      const cleanName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${ext}`;
      
      const candidateBuckets = ['media', 'gallery', 'public', 'uploads', 'assets'];
      for (const bucket of candidateBuckets) {
        try {
          const { data, error } = await supabase.storage.from(bucket).upload(cleanName, file, {
            cacheControl: '3600',
            upsert: true
          });
          if (!error && data?.path) {
            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
            if (pub?.publicUrl) {
              return pub.publicUrl;
            }
          }
        } catch {
          // Try next bucket
        }
      }
      return null;
    } catch (err) {
      console.warn('Supabase storage upload fallback:', err);
      return null;
    }
  }

  // --- AUTHENTICATION ---

  static async signInWithGoogle() {
    try {
      const redirectUrl = window.location.origin;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      console.warn('Supabase Google OAuth direct redirect fallback:', err);
      return { success: false, error: err.message };
    }
  }

  static async signInWithEmail(email: string, pass: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });
      if (error) throw error;
      return { success: true, user: data.user, session: data.session };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  static async signUpWithEmail(email: string, pass: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass
      });
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  static async signOut() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Sign out error', e);
    }
  }

  static async getCurrentUser() {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user || null;
    } catch {
      return null;
    }
  }

  // --- ROLES ENGINE ---

  static async getUserRoles(): Promise<UserRoleRecord[]> {
    try {
      const { data, error } = await supabase.from('user_roles').select('*');
      if (error || !data) throw error;
      return data;
    } catch {
      // Local fallback
      const local = localStorage.getItem('aura_user_roles_v1');
      if (local) return JSON.parse(local);
      return [
        { email: 'fecsoul@gmail.com', role: 'admin' },
        { email: 'admin@aurasound.com.ar', role: 'admin' },
        { email: 'operaciones@aurasound.com.ar', role: 'operator' }
      ];
    }
  }

  static async saveUserRole(record: UserRoleRecord): Promise<boolean> {
    try {
      const roles = await this.getUserRoles();
      const existingIndex = roles.findIndex((r) => r.email.toLowerCase() === record.email.toLowerCase());
      if (existingIndex >= 0) {
        roles[existingIndex] = record;
      } else {
        roles.push(record);
      }
      localStorage.setItem('aura_user_roles_v1', JSON.stringify(roles));

      // Async write to Supabase
      await supabase.from('user_roles').upsert([record], { onConflict: 'email' });
      return true;
    } catch (err) {
      console.warn('Saved user role locally with Supabase sync pending:', err);
      return true;
    }
  }

  static async checkIsAdmin(email: string | null | undefined): Promise<boolean> {
    if (!email) return false;
    const cleanEmail = email.trim().toLowerCase();
    if (SUPER_ADMIN_EMAILS.some((e) => e.toLowerCase() === cleanEmail)) {
      return true;
    }

    const roles = await this.getUserRoles();
    const match = roles.find((r) => r.email.toLowerCase() === cleanEmail);
    return match ? match.role === 'admin' : false;
  }

  // --- GALLERY SYNC (MULTI-BROWSER CLOUD DATABASE) ---

  static async syncGallery(): Promise<GalleryItem[] | null> {
    try {
      // 1. Try dedicated gallery table
      const { data, error } = await supabase.from('gallery').select('*');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data as GalleryItem[];
      }
      // 2. Try generic app_content / app_config table fallback
      const { data: configData } = await supabase.from('app_config').select('*').eq('key', 'gallery').maybeSingle();
      if (configData?.value && Array.isArray(configData.value) && configData.value.length > 0) {
        return configData.value as GalleryItem[];
      }
    } catch (err) {
      console.warn('Supabase gallery sync note:', err);
    }
    return null;
  }

  static async saveGallery(items: GalleryItem[]): Promise<void> {
    try {
      // 1. Save to dedicated table if present
      if (items.length > 0) {
        await supabase.from('gallery').upsert(items as any[], { onConflict: 'id' });
      }
    } catch (err) {
      // Fallback
    }

    try {
      // 2. Also backup to app_config table for universal cross-browser storage
      await supabase.from('app_config').upsert([
        { key: 'gallery', value: items, updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });
    } catch (err) {
      console.warn('Supabase gallery cloud backup note:', err);
    }
  }

  static async deleteGalleryItem(id: string): Promise<void> {
    try {
      await supabase.from('gallery').delete().eq('id', id);
    } catch {}
  }

  // --- SERVICES SYNC ---

  static async syncServices(): Promise<ServiceItem[] | null> {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data as ServiceItem[];
      }
      const { data: configData } = await supabase.from('app_config').select('*').eq('key', 'services').maybeSingle();
      if (configData?.value && Array.isArray(configData.value) && configData.value.length > 0) {
        return configData.value as ServiceItem[];
      }
    } catch {}
    return null;
  }

  static async saveServices(items: ServiceItem[]): Promise<void> {
    try {
      if (items.length > 0) {
        await supabase.from('services').upsert(items as any[], { onConflict: 'id' });
      }
    } catch {}
    try {
      await supabase.from('app_config').upsert([
        { key: 'services', value: items, updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });
    } catch {}
  }

  // --- TESTIMONIALS SYNC ---

  static async syncTestimonials(): Promise<Testimonial[] | null> {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data as Testimonial[];
      }
      const { data: configData } = await supabase.from('app_config').select('*').eq('key', 'testimonials').maybeSingle();
      if (configData?.value && Array.isArray(configData.value) && configData.value.length > 0) {
        return configData.value as Testimonial[];
      }
    } catch {}
    return null;
  }

  static async saveTestimonials(items: Testimonial[]): Promise<void> {
    try {
      if (items.length > 0) {
        await supabase.from('testimonials').upsert(items as any[], { onConflict: 'id' });
      }
    } catch {}
    try {
      await supabase.from('app_config').upsert([
        { key: 'testimonials', value: items, updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });
    } catch {}
  }

  // --- SITE CONTENT SYNC ---

  static async syncSiteContent(): Promise<SiteContent | null> {
    try {
      const { data, error } = await supabase.from('site_content').select('*').maybeSingle();
      if (!error && data && typeof data === 'object') {
        return data as SiteContent;
      }
      const { data: configData } = await supabase.from('app_config').select('*').eq('key', 'site_content').maybeSingle();
      if (configData?.value && typeof configData.value === 'object') {
        return configData.value as SiteContent;
      }
    } catch {}
    return null;
  }

  static async saveSiteContent(content: SiteContent): Promise<void> {
    try {
      await supabase.from('site_content').upsert([content], { onConflict: 'id' });
    } catch {}
    try {
      await supabase.from('app_config').upsert([
        { key: 'site_content', value: content, updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });
    } catch {}
  }

  // --- BRANCHES SYNC ---

  static async syncBranches(): Promise<Branch[] | null> {
    try {
      const { data, error } = await supabase.from('branches').select('*');
      if (!error && data && Array.isArray(data) && data.length > 0) {
        return data as Branch[];
      }
      const { data: configData } = await supabase.from('app_config').select('*').eq('key', 'branches').maybeSingle();
      if (configData?.value && Array.isArray(configData.value) && configData.value.length > 0) {
        return configData.value as Branch[];
      }
    } catch {}
    return null;
  }

  static async saveBranches(items: Branch[]): Promise<void> {
    try {
      if (items.length > 0) {
        await supabase.from('branches').upsert(items as any[], { onConflict: 'id' });
      }
    } catch {}
    try {
      await supabase.from('app_config').upsert([
        { key: 'branches', value: items, updated_at: new Date().toISOString() }
      ], { onConflict: 'key' });
    } catch {}
  }

  // --- CUSTOMERS & CLIENTS ---

  static async syncCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await supabase.from('customers').select('*').order('createdAt', { ascending: false });
      if (error || !data) throw error;
      return data;
    } catch {
      const local = localStorage.getItem('aura_customers_v1');
      return local ? JSON.parse(local) : [];
    }
  }

  static async upsertCustomer(customer: Customer): Promise<void> {
    try {
      const local = await this.syncCustomers();
      const idx = local.findIndex((c) => c.id === customer.id || c.email === customer.email);
      if (idx >= 0) {
        local[idx] = customer;
      } else {
        local.unshift(customer);
      }
      localStorage.setItem('aura_customers_v1', JSON.stringify(local));

      await supabase.from('customers').upsert([customer], { onConflict: 'id' });
    } catch (err) {
      console.warn('Customer upsert synced locally:', err);
    }
  }

  static async deleteCustomer(id: string): Promise<void> {
    try {
      const local = await this.syncCustomers();
      const filtered = local.filter((c) => c.id !== id);
      localStorage.setItem('aura_customers_v1', JSON.stringify(filtered));

      await supabase.from('customers').delete().eq('id', id);
    } catch (err) {
      console.warn('Customer delete synced locally:', err);
    }
  }

  // --- CONSULTAS & COMBO DISCOUNTS ---

  static async getConsultas(): Promise<CustomerConsulta[]> {
    try {
      const { data, error } = await supabase.from('consultas').select('*').order('createdAt', { ascending: false });
      if (error || !data) throw error;
      return data;
    } catch {
      const local = localStorage.getItem('aura_consultas_v1');
      return local ? JSON.parse(local) : [];
    }
  }

  static async saveConsulta(consulta: CustomerConsulta): Promise<void> {
    try {
      const local = await this.getConsultas();
      local.unshift(consulta);
      localStorage.setItem('aura_consultas_v1', JSON.stringify(local));

      // Automatically register customer if not present
      const customer: Customer = {
        id: `cust-${Date.now()}`,
        firstName: consulta.customerName.split(' ')[0] || 'Cliente',
        lastName: consulta.customerName.split(' ').slice(1).join(' ') || 'Consulta',
        email: consulta.email,
        phone: consulta.phone,
        whatsapp: consulta.phone,
        city: 'Buenos Aires',
        status: 'Prospecto',
        notes: `Consulta enviada: ${consulta.message} ${consulta.appliedCombo ? `(Combo: ${consulta.appliedCombo})` : ''}`,
        createdAt: new Date().toISOString(),
        totalEventsCount: 0,
        totalSpent: 0,
        registeredUser: true
      };
      await this.upsertCustomer(customer);

      await supabase.from('consultas').insert([consulta]);
    } catch (err) {
      console.warn('Consulta saved locally:', err);
    }
  }

  static async deleteConsulta(id: string): Promise<void> {
    try {
      const local = await this.getConsultas();
      const filtered = local.filter((c) => c.id !== id);
      localStorage.setItem('aura_consultas_v1', JSON.stringify(filtered));

      await supabase.from('consultas').delete().eq('id', id);
    } catch (err) {
      console.warn('Consulta deleted locally:', err);
    }
  }

  // --- BOOKINGS & RESERVAS ---

  static async syncBookings(): Promise<BookingRequest[]> {
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('createdAt', { ascending: false });
      if (error || !data) throw error;
      return data;
    } catch {
      const local = localStorage.getItem('aura_bookings_v1');
      return local ? JSON.parse(local) : [];
    }
  }

  static async upsertBooking(booking: BookingRequest): Promise<void> {
    try {
      const local = await this.syncBookings();
      const idx = local.findIndex((b) => b.id === booking.id);
      if (idx >= 0) {
        local[idx] = booking;
      } else {
        local.unshift(booking);
      }
      localStorage.setItem('aura_bookings_v1', JSON.stringify(local));

      // Ensure customer exists in CRM
      const customer: Customer = {
        id: booking.customerId || `cust-${Date.now()}`,
        firstName: booking.customerName.split(' ')[0] || booking.customerName,
        lastName: booking.customerName.split(' ').slice(1).join(' ') || '',
        email: booking.customerEmail,
        phone: booking.customerPhone,
        whatsapp: booking.customerWhatsApp || booking.customerPhone,
        city: booking.city || 'Buenos Aires',
        status: 'Confirmado',
        notes: `Reserva para evento del ${booking.eventDate}`,
        createdAt: new Date().toISOString(),
        totalEventsCount: 1,
        totalSpent: booking.totalAmount,
        registeredUser: true
      };
      await this.upsertCustomer(customer);

      await supabase.from('bookings').upsert([booking], { onConflict: 'id' });
    } catch (err) {
      console.warn('Booking upserted locally:', err);
    }
  }

  static async deleteBooking(id: string): Promise<void> {
    try {
      const local = await this.syncBookings();
      const filtered = local.filter((b) => b.id !== id);
      localStorage.setItem('aura_bookings_v1', JSON.stringify(filtered));

      await supabase.from('bookings').delete().eq('id', id);
    } catch (err) {
      console.warn('Booking deleted locally:', err);
    }
  }

  // --- GENERIC ENTITY SUPABASE CRUD SYNC ---

  static async syncEntity<T>(tableName: string, localKey: string, fallback: T[]): Promise<T[]> {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (error || !data || data.length === 0) throw error;
      localStorage.setItem(localKey, JSON.stringify(data));
      return data as T[];
    } catch {
      const raw = localStorage.getItem(localKey);
      return raw ? JSON.parse(raw) : fallback;
    }
  }

  static async saveEntity<T extends { id: string }>(tableName: string, localKey: string, data: T[]): Promise<void> {
    try {
      localStorage.setItem(localKey, JSON.stringify(data));
      // Replace or upsert in Supabase
      if (data.length > 0) {
        await supabase.from(tableName).upsert(data as any[], { onConflict: 'id' });
      }
    } catch (err) {
      console.warn(`Entity ${tableName} saved locally:`, err);
    }
  }

  static async deleteEntityRecord(tableName: string, localKey: string, recordId: string): Promise<void> {
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        const filtered = parsed.filter((r) => r.id !== recordId);
        localStorage.setItem(localKey, JSON.stringify(filtered));
      }
      await supabase.from(tableName).delete().eq('id', recordId);
    } catch (err) {
      console.warn(`Entity ${tableName} delete recorded locally:`, err);
    }
  }
}
