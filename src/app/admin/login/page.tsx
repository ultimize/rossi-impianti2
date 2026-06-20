'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if redirect query parameter contains an error code
    const err = searchParams.get('error');
    if (err === 'unauthorized') {
      setErrorMsg('Accesso negato: il tuo utente non è abilitato come amministratore.');
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Check if user is in `admins` whitelist
      const { data: adminCheck, error: adminErr } = await supabase
        .from('admins')
        .select('id')
        .or(`id.eq.${data.user.id},email.eq.${data.user.email}`)
        .maybeSingle();

      if (adminErr || !adminCheck) {
        await supabase.auth.signOut();
        setErrorMsg('Accesso negato: il tuo utente non è presente nella lista amministratori.');
        setLoading(false);
        return;
      }

      // Redirect to admin main page
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      console.error(err);
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Credenziali non valide. Riprova.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#101214] font-plex px-6">
      <div className="w-full max-w-[420px] bg-[#16191d] border border-[#20242a] rounded-card p-8 md:p-10 text-left shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-baseline gap-1 justify-center font-archivo leading-none">
            <span className="font-extrabold text-[24px] tracking-tight text-white">ADMIN PORTAL</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-rosso text-[12px] font-bold tracking-[0.5px] mt-2.5 uppercase">
            <ShieldAlert size={14} />
            <span>Rossi Impianti srl</span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-rosso/10 border border-rosso/30 text-rosso text-[13.5px] p-4 rounded-btn mb-6 leading-relaxed">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
              Indirizzo Email
            </label>
            <input
              type="email"
              required
              placeholder="admin@rossimpiantisrl.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso"
            />
          </div>

          <div>
            <label className="block text-[13px] text-muted uppercase tracking-[0.5px] mb-1.5 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#101214] border border-[#2c3137] rounded-btn p-3.5 text-white font-plex text-[15px] outline-none focus:border-rosso"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-saira font-bold text-[18px] tracking-[0.5px] uppercase text-white bg-rosso hover:bg-rosso-hover disabled:bg-faint rounded-btn p-4 mt-2 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> Accesso in corso...
              </>
            ) : (
              <span>Accedi</span>
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-[13px] text-muted hover:text-white transition-colors underline">
            ← Torna al sito pubblico
          </Link>
        </div>
      </div>
    </div>
  );
}
