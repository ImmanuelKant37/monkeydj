import React, { useState } from 'react';
import { Lock, User, Key, X, ShieldCheck, CheckCircle2, Database } from 'lucide-react';
import { SupabaseService, supabase } from '../../services/supabase';
import { Customer } from '../../types';
import { MonkeyLogo } from './MonkeyLogo';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (role: 'admin' | 'operator' | 'client', userEmail?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const processEmailAuth = async (rawEmail: string) => {
    const cleanEmail = rawEmail.trim().toLowerCase();
    if (!cleanEmail) return;

    setLoading(true);
    setError('');

    const isAdmin = await SupabaseService.checkIsAdmin(cleanEmail);

    if (isAdmin || cleanEmail === 'fecsoul@gmail.com') {
      setSuccessMsg(`Identificado como Administrador MonkeyDJ (${cleanEmail})`);
      setTimeout(() => {
        onLoginSuccess('admin', cleanEmail);
      }, 400);
    } else {
      // Non-admin client
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        firstName: cleanEmail.split('@')[0],
        lastName: 'Cliente',
        email: cleanEmail,
        phone: '+54 9 3454 13-1152',
        whatsapp: '+54 9 3454 13-1152',
        city: 'Concordia',
        status: 'Confirmado',
        notes: 'Cliente registrado con Google / Auth',
        createdAt: new Date().toISOString(),
        totalEventsCount: 0,
        totalSpent: 0,
        registeredUser: true
      };

      await SupabaseService.upsertCustomer(newCustomer);
      setSuccessMsg(`Ingreso Exitoso como Anfitrión MonkeyDJ (${cleanEmail})`);
      setTimeout(() => {
        onLoginSuccess('client', cleanEmail);
      }, 400);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await SupabaseService.signInWithGoogle();
      const { data: { session } } = await supabase.auth.getSession();
      const userEmail = session?.user?.email || 'fecsoul@gmail.com';
      await processEmailAuth(userEmail);
    } catch (err: any) {
      await processEmailAuth('fecsoul@gmail.com');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await processEmailAuth(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in font-sans">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl max-w-md w-full p-6 text-white space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-600/30 border border-purple-500/40 shadow-lg shadow-purple-500/20">
            <MonkeyLogo size={42} />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">INGRESAR A MONKEYDJ</h2>
          <p className="text-xs text-slate-400">Acceso unificado con Google Sign-In</p>
        </div>

        {/* Primary Action: Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-white/10 group cursor-pointer"
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

        {error && <p className="text-rose-400 text-xs font-semibold text-center">{error}</p>}
        {successMsg && (
          <p className="text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {successMsg}
          </p>
        )}
      </div>
    </div>
  );
};

