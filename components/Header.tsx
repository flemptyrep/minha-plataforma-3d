"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = 'reislorenasouza@gmail.com';
  const router = useRouter();
  
  const { idioma, mudarIdioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsAdmin(user?.email === ADMIN_EMAIL);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      setIsAdmin(currentUser?.email === ADMIN_EMAIL);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-gray-950/95 backdrop-blur-xl border-b border-gray-700 sticky top-0 z-50 py-4 px-6 md:px-12 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-white">
          3D<span className="text-blue-500">Vault</span>
        </Link>

        {/* NAVEGAÇÃO */}
        <nav className="flex items-center gap-4 md:gap-6">
          <Link href="/projetos" className="text-sm font-bold text-gray-200 hover:text-white hover:underline underline-offset-4 transition-all">
            {t.galeria}
          </Link>
          <Link href="/assinatura" className="text-sm font-bold text-gray-200 hover:text-white hover:underline underline-offset-4 transition-all">
            {t.planos}
          </Link>
          
          {isAdmin && (
            <Link href="/admin" className="text-xs font-black bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 transition-all border border-emerald-400">
              {t.salaComando}
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-4 ml-2">
              <Link href="/login" className="text-sm font-bold text-gray-200 hover:text-white transition-all">{t.entrar}</Link>
              <Link href="/cadastro" className="hidden md:block text-sm font-bold bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/30 border border-blue-500">
                {t.registar}
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-xs font-bold bg-red-500/10 text-red-500 px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest ml-2 border border-red-500/20">
              {t.sair}
            </button>
          )}

          {/* 🌍 CÁPSULA DE IDIOMAS COM IMAGENS REAIS */}
          <div className="flex items-center gap-1 bg-gray-900 p-1.5 rounded-full border border-gray-600 shadow-inner ml-2 md:ml-4">
            
            <button 
              onClick={() => mudarIdioma('pt')} 
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 overflow-hidden ${idioma === 'pt' ? 'bg-blue-600 shadow-lg scale-105 border-2 border-blue-500' : 'hover:bg-gray-800 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'}`}
              title="Português"
            >
              <img src="https://flagcdn.com/w40/pt.png" alt="Portugal" className="w-5 h-auto rounded-[2px]" />
            </button>
            
            <button 
              onClick={() => mudarIdioma('es')} 
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 overflow-hidden ${idioma === 'es' ? 'bg-blue-600 shadow-lg scale-105 border-2 border-blue-500' : 'hover:bg-gray-800 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'}`}
              title="Español"
            >
              <img src="https://flagcdn.com/w40/es.png" alt="España" className="w-5 h-auto rounded-[2px]" />
            </button>
            
            <button 
              onClick={() => mudarIdioma('en')} 
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 overflow-hidden ${idioma === 'en' ? 'bg-blue-600 shadow-lg scale-105 border-2 border-blue-500' : 'hover:bg-gray-800 grayscale hover:grayscale-0 opacity-70 hover:opacity-100'}`}
              title="English"
            >
              <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-5 h-auto rounded-[2px]" />
            </button>

          </div>
        </nav>
      </div>
    </header>
  );
}