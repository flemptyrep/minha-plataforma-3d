"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();
  
  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);

    if (error) {
      alert(error.message);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl">
        <h2 className="text-3xl font-black mb-8 text-center">{t.bemVindo} 💎</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.email}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.senha}</label>
            <input type="password" required value={senha} onChange={e => setSenha(e.target.value)}
              className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none transition-colors" />
          </div>
          
          <button type="submit" disabled={carregando}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm">
            {carregando ? t.carregando : t.entrarBtn}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          {t.semConta} <Link href="/cadastro" className="text-blue-500 font-bold hover:underline">{t.registar}</Link>
        </p>
      </div>
    </div>
  );
}