import React, { useState, useEffect } from 'react';

// Common UI
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { AuthModal } from './components/common/AuthModal';

// Public Web Pages
import { Hero } from './components/public/Hero';
import { ServicesList } from './components/public/ServicesList';
import { QuoteModal } from './components/public/QuoteModal';
import { BookingModal } from './components/public/BookingModal';
import { GallerySection } from './components/public/GallerySection';
import { TestimonialsSection } from './components/public/TestimonialsSection';
import { FaqSection } from './components/public/FaqSection';
import { ClientPortal } from './components/public/ClientPortal';
import { ConsultasCombosModal } from './components/public/ConsultasCombosModal';

// Admin System
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLockGuard } from './components/admin/AdminLockGuard';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { AgendaCalendar } from './components/admin/AgendaCalendar';
import { EventsManager } from './components/admin/EventsManager';
import { EventProceduresManager } from './components/admin/EventProceduresManager';
import { SiteContentManager } from './components/admin/SiteContentManager';
import { QuotesCRM } from './components/admin/QuotesCRM';
import { MessagesManager } from './components/admin/MessagesManager';
import { CostConfigManager } from './components/admin/CostConfigManager';
import { ServicesManager } from './components/admin/ServicesManager';
import { InventoryLogistics } from './components/admin/InventoryLogistics';
import { BranchesManager } from './components/admin/BranchesManager';
import { MediaManager } from './components/admin/MediaManager';
import { TestimonialsManager } from './components/admin/TestimonialsManager';
import { NotificationsConfig } from './components/admin/NotificationsConfig';
import { AuditLogView } from './components/admin/AuditLogView';
import { UserRolesManager } from './components/admin/UserRolesManager';

// Domain Services & Storage
import { AppStorage } from './services/storage';
import { SupabaseService, supabase } from './services/supabase';
import { QuoteResult, BookingRequest, Testimonial, Branch, ServicePackage, Equipment, ServiceItem } from './types';

export function App() {
  // Navigation & Role State (Default to public landing page on initial load)
  const [activeView, setActiveView] = useState<'public' | 'client' | 'admin'>('public');
  const [portalMode, setPortalMode] = useState<'public' | 'client' | 'admin'>(() => {
    const storedRole = localStorage.getItem('monkeydj_user_role');
    const storedEmail = localStorage.getItem('monkeydj_user_email');
    if (storedRole === 'admin' || storedEmail === 'fecsoul@gmail.com') return 'admin';
    if (storedRole === 'client') return 'client';
    return 'public';
  });
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [consultasModalOpen, setConsultasModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Authenticated user session state
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('monkeydj_user_email');
  });
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'client' | null>(() => {
    return localStorage.getItem('monkeydj_user_role') as any;
  });

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
    } catch (err) {
      console.warn('Signout error:', err);
    }
    localStorage.removeItem('monkeydj_user_email');
    localStorage.removeItem('monkeydj_user_role');
    localStorage.removeItem('monkeydj_admin_session_v1');
    setCurrentUserEmail(null);
    setCurrentUserRole(null);
    setActiveView('public');
    setPortalMode('public');
  };

  // Active Quote attached to booking flow
  const [activeQuote, setActiveQuote] = useState<QuoteResult | null>(null);

  // Storage synced lists
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<ServicePackage[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState(AppStorage.getGallery());
  const [siteContent, setSiteContent] = useState(AppStorage.getSiteContent());

  useEffect(() => {
    // Initialise seed state
    AppStorage.initStorage();
    const bList = AppStorage.getBranches();
    setBranches(bList);
    if (bList.length > 0) {
      setSelectedBranch(bList[0]);
    }
    setServices(AppStorage.getServices());
    setPackages(AppStorage.getPackages());
    setEquipment(AppStorage.getEquipment());
    setTestimonials(AppStorage.getTestimonials());
    setGallery(AppStorage.getGallery());
    setSiteContent(AppStorage.getSiteContent());

    // Listen to Supabase OAuth changes (sync user state without forcing screen change)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('monkeydj_user_email');
        localStorage.removeItem('monkeydj_user_role');
        localStorage.removeItem('monkeydj_admin_session_v1');
        setCurrentUserEmail(null);
        setCurrentUserRole(null);
        setActiveView('public');
        setPortalMode('public');
      } else if (session?.user?.email) {
        const email = session.user.email;
        const isAdmin = await SupabaseService.checkIsAdmin(email);
        const role = isAdmin ? 'admin' : 'client';
        setCurrentUserEmail(email);
        setCurrentUserRole(role);
        localStorage.setItem('monkeydj_user_email', email);
        localStorage.setItem('monkeydj_user_role', role);
        setPortalMode(role);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setSiteContent(AppStorage.getSiteContent());
  }, [activeView, adminTab]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleBookNow = (quote?: QuoteResult) => {
    if (quote) {
      setActiveQuote(quote);
    }
    setBookingModalOpen(true);
  };

  const handleBookingSubmitted = (booking: BookingRequest) => {
    // Switch or alert if needed
  };

  const handleTestimonialSubmitted = (t: Testimonial) => {
    setTestimonials(AppStorage.getTestimonials());
  };

  const DEFAULT_BRANCH: Branch = {
    id: 'b-concordia',
    name: 'Sucursal Concordia',
    code: 'CON',
    city: 'Concordia',
    address: 'Av. Eva Perón 1850, Concordia, Entre Ríos',
    phone: '+54 345 421-9000',
    whatsapp: '5493454219000',
    email: 'concordia@monkeydj.com.ar',
    coverageKm: 150,
    baseTravelFee: 8000,
    perKmFee: 200,
    branchMultiplier: 1.0,
    active: true,
    staffCount: 8,
    vehiclesCount: 3
  };

  const currentBranch = selectedBranch || branches[0] || DEFAULT_BRANCH;

  const branchServices = services.filter((s) => {
    if (!s.branchId || s.branchId === 'all' || s.branchId === 'todas') return true;
    return s.branchId === currentBranch?.id;
  });

  const branchGallery = gallery.filter((g) => {
    if (!g.branchId || g.branchId === 'all' || g.branchId === 'todas') return true;
    return g.branchId === currentBranch?.id;
  });

  const branchTestimonials = testimonials.filter((t) => {
    if (!t.branchId || t.branchId === 'all' || t.branchId === 'todas') return true;
    return t.branchId === currentBranch?.id;
  });

  return (
    <div className="min-h-screen bg-[#050508] text-slate-100 font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient Mesh Decorative Blurs for Frosted Glass Depth */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-purple-900/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-blue-900/20 blur-[130px] rounded-full pointer-events-none z-0" />
      <div className="fixed top-[45%] left-[30%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col min-h-screen">
      {/* 1. PUBLIC WEBSITE VIEW */}
      {activeView === 'public' && (
        <div className="min-h-screen flex flex-col">
          <Header
            branches={branches}
            selectedBranch={currentBranch}
            onSelectBranch={(b) => setSelectedBranch(b)}
            activeView={activeView}
            setActiveView={(v) => setActiveView(v as any)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            portalMode={portalMode}
            setPortalMode={(m) => {
              setPortalMode(m);
              setActiveView(m);
            }}
            onOpenQuote={() => setQuoteModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenConsultas={() => setConsultasModalOpen(true)}
            currentUserEmail={currentUserEmail}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            {/* Hero Section with Video Background */}
            <Hero
              branch={currentBranch}
              siteContent={siteContent}
              gallery={branchGallery}
              onOpenQuote={() => setQuoteModalOpen(true)}
              onOpenServices={() => {
                const el = document.getElementById('servicios');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Services & Packages List */}
            <ServicesList
              services={branchServices}
              packages={packages}
              siteContent={siteContent}
              onSelectServiceForQuote={() => setQuoteModalOpen(true)}
              onSelectPackage={() => setQuoteModalOpen(true)}
            />

            {/* Quote Banner CTA */}
            <section className="py-12 bg-gradient-to-r from-purple-950/60 via-slate-900 to-pink-950/60 border-y border-purple-500/30 my-8">
              <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/40">
                  {siteContent.quoteBannerTag || 'Cotización Online Instantánea'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {siteContent.quoteBannerTitle || '¿Querés saber cuánto cuesta tu evento?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                  {siteContent.quoteBannerSubtitle || 'Calculá en menos de 1 minuto con precios oficiales, promociones por combo y disponibilidad para Concordia y Posadas.'}
                </p>
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="mt-2 py-3.5 px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-xl shadow-purple-600/30 transition-all cursor-pointer transform hover:scale-105 inline-flex items-center gap-2"
                >
                  ABRIR COTIZADOR INTELIGENTE
                </button>
              </div>
            </section>

            {/* Multimedia Gallery */}
            <GallerySection items={branchGallery} />

            {/* Real Testimonials */}
            <TestimonialsSection
              testimonials={branchTestimonials}
              onTestimonialSubmitted={handleTestimonialSubmitted}
              currentBranchId={currentBranch?.id}
            />

            {/* FAQ Accordion */}
            <FaqSection siteContent={siteContent} />
          </main>

          <Footer
            branches={branches}
            onSelectBranch={(b) => setSelectedBranch(b)}
            setPortalMode={(m) => {
              setPortalMode(m);
              setActiveView(m);
            }}
            setActiveView={(v) => setActiveView(v as any)}
          />

          {/* Fixed Floating WhatsApp Contact Widget */}
          <WhatsAppButton branch={currentBranch} />
        </div>
      )}

      {/* 2. CLIENT PORTAL VIEW */}
      {activeView === 'client' && (
        <div className="min-h-screen flex flex-col">
          <Header
            branches={branches}
            selectedBranch={currentBranch}
            onSelectBranch={(b) => setSelectedBranch(b)}
            activeView={activeView}
            setActiveView={(v) => setActiveView(v as any)}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            portalMode={portalMode}
            setPortalMode={(m) => {
              setPortalMode(m);
              setActiveView(m);
            }}
            onOpenQuote={() => {
              setActiveView('public');
              setTimeout(() => {
                const el = document.getElementById('cotizador');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenConsultas={() => setConsultasModalOpen(true)}
            currentUserEmail={currentUserEmail}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            <ClientPortal />
          </main>

          <Footer
            branches={branches}
            onSelectBranch={(b) => setSelectedBranch(b)}
            setPortalMode={(m) => {
              setPortalMode(m);
              setActiveView(m);
            }}
            setActiveView={(v) => setActiveView(v as any)}
          />
          <WhatsAppButton branch={currentBranch} />
        </div>
      )}

      {/* 3. ADMINISTRATIVE BACKOFFICE SYSTEM */}
      {activeView === 'admin' && (
        <AdminLockGuard onExitAdmin={() => setActiveView('public')}>
          <AdminLayout
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            onExitAdmin={() => setActiveView('public')}
          >
            {adminTab === 'dashboard' && <DashboardOverview />}
            {adminTab === 'agenda' && <AgendaCalendar />}
            {adminTab === 'events' && <EventsManager />}
            {adminTab === 'procedures' && <EventProceduresManager />}
            {adminTab === 'site-content' && <SiteContentManager />}
            {adminTab === 'crm' && <QuotesCRM />}
            {adminTab === 'messages' && <MessagesManager />}
            {adminTab === 'services' && (
              <ServicesManager
                onServicesUpdated={() => setServices(AppStorage.getServices())}
              />
            )}
            {adminTab === 'pricing' && <CostConfigManager />}
            {adminTab === 'inventory' && <InventoryLogistics />}
            {adminTab === 'branches' && <BranchesManager />}
            {adminTab === 'media' && (
              <MediaManager
                onGalleryUpdated={() => setGallery(AppStorage.getGallery())}
              />
            )}
            {adminTab === 'testimonials' && (
              <TestimonialsManager
                onTestimonialsUpdated={() => setTestimonials(AppStorage.getTestimonials())}
              />
            )}
            {adminTab === 'notifications' && <NotificationsConfig />}
            {adminTab === 'roles' && <UserRolesManager />}
            {adminTab === 'audit' && <AuditLogView />}
          </AdminLayout>
        </AdminLockGuard>
      )}

      {/* Dedicated Quote Calculator Modal */}
      {quoteModalOpen && (
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          branches={branches}
          services={services}
          equipmentList={equipment}
          onRequestBooking={handleBookNow}
          onBookNow={handleBookNow}
        />
      )}

      {/* Booking Modal */}
      {bookingModalOpen && (
        <BookingModal
          quote={activeQuote}
          branches={branches}
          onClose={() => setBookingModalOpen(false)}
          onBookingSubmitted={handleBookingSubmitted}
        />
      )}

      {/* Consultas & Combos Modal */}
      {consultasModalOpen && (
        <ConsultasCombosModal
          onClose={() => setConsultasModalOpen(false)}
          onOpenQuote={() => setQuoteModalOpen(true)}
        />
      )}

      {/* Authentication Modal */}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={(role, email) => {
            setAuthModalOpen(false);
            setCurrentUserRole(role);
            setCurrentUserEmail(email);
            localStorage.setItem('monkeydj_user_email', email);
            localStorage.setItem('monkeydj_user_role', role);
            if (role === 'admin') {
              setActiveView('admin');
              setPortalMode('admin');
            } else {
              setActiveView('client');
              setPortalMode('client');
            }
          }}
        />
      )}
      </div>
    </div>
  );
}

export default App;
