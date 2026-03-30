"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';
import Link from 'next/link';

export default function PlanosPage() {
  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-16 font-sans flex flex-col items-center">
      
      <header className="text-center mb-16 mt-10">
        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">{t.nossosPlanos}</h1>
        <p className="text-gray-400">{t.planosSub}</p>
      </header>

      {/* PROMOÇÃO 10 PROJETOS */}
      <div className="w-full max-w-4xl bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-emerald-500/50 p-8 rounded-[2rem] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div>
          <h3 className="text-xl font-black text-emerald-400 mb-2">{t.promoPlanosTitulo}</h3>
          <p className="text-gray-300 text-sm">{t.promoPlanosDesc}</p>
        </div>
        <Link href="/enviar" className="bg-emerald-500 text-black px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          {t.comecarEnviar}
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* PLANO GRATUITO */}
        <div className="bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] flex flex-col shadow-xl">
          <h2 className="text-2xl font-black mb-2">{t.planoGratis}</h2>
          <div className="text-4xl font-black mb-8 mt-4 text-gray-400">€0 <span className="text-sm font-medium">{t.mes}</span></div>
          
          <ul className="space-y-4 mb-10 flex-1 text-gray-400 text-sm">
            <li>✔️ {t.featGratis1}</li>
            <li>✔️ {t.featGratis2}</li>
            <li className="opacity-50 line-through">❌ {t.featGratis3}</li>
            <li className="opacity-50 line-through">❌ {t.featGratis4}</li>
          </ul>
          
          <Link href="/cadastro" className="block w-full text-center py-4 bg-gray-800 text-white font-black rounded-2xl hover:bg-gray-700 transition uppercase tracking-widest text-xs">
            {t.registarBtn}
          </Link>
        </div>

        {/* PLANO VIP */}
        <div className="bg-gradient-to-br from-gray-900 to-blue-950/50 border border-blue-500/30 p-10 rounded-[2.5rem] flex flex-col shadow-2xl relative">
          <div className="absolute top-6 right-6 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">VIP</div>
          <h2 className="text-2xl font-black mb-2 text-blue-400">{t.planoVip}</h2>
          <div className="text-4xl font-black mb-8 mt-4 text-white">{t.precoVip} <span className="text-sm font-medium text-gray-400">{t.mes}</span></div>
          
          <ul className="space-y-4 mb-10 flex-1 text-gray-300 text-sm">
            <li>✔️ {t.featGratis1}</li>
            <li>✔️ {t.featGratis2}</li>
            <li className="font-bold text-blue-400">✔️ {t.featVip1}</li>
            <li className="font-bold text-blue-400">✔️ {t.featVip2}</li>
          </ul>
          
          {/* BOTÃO DO STRIPE RESTAURADO */}
          <a 
            href="https://buy.stripe.com/9B6fZja3ufTG4k14Su1kA00" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-500/30 uppercase tracking-widest text-xs"
          >
            {t.assinarAgora}
          </a>
        </div>
      </div>
    </div>
  );
}