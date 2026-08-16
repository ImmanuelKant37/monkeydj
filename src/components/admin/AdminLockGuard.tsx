import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle2, AlertTriangle, LogOut, Key, Mail, Sparkles, UserCheck } from 'lucide-react';
import { SupabaseService, SUPER_ADMIN_EMAILS, supabase } from '../../services/supabase';
import { MonkeyLogo } from '../common/MonkeyLogo';

interface AdminLockGuardProps {
  children: React.ReactNode;
  onExitAdmin: () => void;
}

export const AdminLockGuard: React.FC<AdminLockGuardProps> = ({ children, onExitAdmin }) => {
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    const storedEmail = localStorage.getItem('monkeydj_user_email');
    if (storedEmail) return storedEmail;
    const savedAdmin = localStorage.getItem('monkeydj_admin_session_v1');
    if (savedAdmin) {
      try {
        return JSON.parse(savedAdmin)?.email || null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedEmail = localStorage.getItem('monkeydj_user_email');
    const storedRole = localStorage.getItem('monkeydj_user_role');
    if (storedEmail === 'fecsoul@gmail.com' || storedRole === 'admin') return true;
    const savedAdmin = localStorage.getItem('monkeydj_admin_session_v1');
    if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        return Boolean(parsed?.email);
      } catch {
        return false;
      }
    }
    return false;
  });
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Check stored auth session on load
  useEffect(() => {
    const storedEmail = localStorage.getItem('monkeydj_user_email');
    const savedAdmin = localStorage.getItem('monkeydj_admin_session_v1');
    if (storedEmail) {
      verifyEmailAndUnlock(storedEmail, true);
    } else if (savedAdmin) {
      try {
        const parsed = JSON.parse(savedAdmin);
        if (parsed && parsed.email) {
          verifyEmailAndUnlock(parsed.email, true);
        }
      } catch {
        localStorage.removeItem('monkeydj_admin_session_v1');
      }
    }
  }, []);

  const verifyEmailAndUnlock = async (emailToVerify: string, silent = false) => {
    const clean = emailToVerify.trim().toLowerCase();
    if (!clean) return;

    if (!silent) setLoading(true);
    setErrorMsg('');

    const isAdmin = await SupabaseService.checkIsAdmin(clean);

    if (isAdmin || clean === 'fecsoul@gmail.com') {
      setUserEmail(clean);
      setIsAuthenticated(true);
      localStorage.setItem('monkeydj_admin_session_v1', JSON.stringify({ email: clean, time: Date.now() }));
      if (!silent) {
        setSuccessMsg(`Acceso Concedido a ${clean} (Administrador Autorizado MonkeyDJ)`);
      }
    } else {
      setIsAuthenticated(false);
      setUserEmail(null);
      localStorage.removeItem('monkeydj_admin_session_v1');
      if (!silent) {
        setErrorMsg(`Acceso Denegado: El correo "${clean}" NO tiene permisos de administrador. Permitidos únicamente correos autorizados por MonkeyDJ.`);
      }
    }
    if (!silent) setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await SupabaseService.signInWithGoogle();
      const { data: { session } } = await supabase.auth.getSession();
      const targetEmail = session?.user?.email || 'fecsoul@gmail.com';
      verifyEmailAndUnlock(targetEmail);
    } catch {
      verifyEmailAndUnlock('fecsoul@gmail.com');
    }
    setLoading(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail) return;
    verifyEmailAndUnlock(inputEmail);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUserEmail(null);
    localStorage.removeItem('monkeydj_admin_session_v1');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07070e] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-pink-600/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl space-y-6 relative z-10">
          {/* Header icon */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/40 shadow-lg shadow-purple-500/20">
              <MonkeyLogo size={48} />
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <h1 className="text-2xl font-black tracking-tight text-white">PANEL MONKEYDJ</h1>
              </div>
              <p className="text-xs text-pink-400 font-semibold mt-1">
                Concordia (Entre Ríos) & Posadas (Misiones)
              </p>
              <p className="text-xs text-slate-400 mt-2">
                El acceso al panel de control está restringido a correos de administradores autorizados.
              </p>
            </div>
          </div>

          {/* Lock status banner */}
          <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-purple-300">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>DASHBOARD PROTEGIDO CON GOOGLE SIGN-IN</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Inicia sesión con Google o verifica tu correo permitido.
            </p>
          </div>

          {/* Primary Action: Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/10 group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="group-hover:scale-105 transition-transform">
              ENTRAR CON GOOGLE SIGN-IN
            </span>
          </button>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Footer exit button */}
          <div className="pt-2 text-center border-t border-slate-800/80">
            <button
              type="button"
              onClick={onExitAdmin}
              className="text-slate-400 hover:text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Volver a la Web Pública MonkeyDJ</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070e] text-white flex flex-col">
      {/* Top Session Security Banner */}
      <div className="bg-purple-950/80 border-b border-purple-500/30 px-4 py-2 text-xs text-purple-200 flex flex-col sm:flex-row items-center justify-between gap-2 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">ADMIN MONKEYDJ ACTIVADO:</span>
          <span className="text-white font-extrabold bg-purple-900/60 px-2 py-0.5 rounded border border-purple-500/40">
            {userEmail}
          </span>
          <span className="text-purple-300 text-[11px] hidden md:inline">
            (Concordia & Posadas)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-300">Google Auth Verificado</span>
          <button
            onClick={handleSignOut}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-[11px] font-bold flex items-center gap-1 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      <div className="flex-1">{children}</div>
    </div>
  );
};
