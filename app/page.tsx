"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function Home() {
  const { idioma } = useLanguage();
  
  // Puxa o dicionário da língua escolhida
  const t = dicionario[idioma as keyof typeof dicionario];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center pb-20 font-sans">
      
      {/* 1. SECÇÃO HERO (O Texto Gigante) */}
      <section className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
          {t.heroTitle1} <br />
          <span className="text-blue-300">{t.heroTitle2}</span> <br />
          <span className="text-emerald-400">{t.heroTitle3}</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed">
          {t.heroSubtitle}
        </p>
        <Link href="/projetos" className="inline-block bg-[#F8E1C2] text-black font-black px-8 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(248,225,194,0.4)]">
          {t.explorarModelos}
        </Link>
      </section>

      {/* 2. SECÇÃO PROMOÇÃO VIP */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12">
        <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
          
          <div className="flex-1">
            <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full tracking-widest uppercase mb-6 inline-block">
              {t.promoBadge}
            </span>
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              {t.promoTitulo1} <span className="text-blue-400">{t.promoTitulo2}</span>
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed text-sm md:text-base">
              {t.promoTexto}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/enviar" className="bg-blue-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                {t.comecarEnviar}
              </Link>
              <Link href="/assinatura" className="bg-red-500/10 text-red-500 font-bold px-6 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                {t.saberMais}
              </Link>
            </div>
          </div>
          
          {/* Caixa da Regra à Direita */}
          <div className="bg-black/50 p-8 rounded-[2rem] border border-gray-800 text-center min-w-[280px]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">{t.regraSimples}</p>
            
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-900/30 border border-blue-500/50 text-white flex items-center justify-center font-black text-xl">1</div>
              <div className="h-0.5 w-8 bg-gray-700"></div>
              <div className="w-14 h-14 rounded-full bg-blue-900/30 border border-blue-500/50 text-white flex items-center justify-center font-black text-xl">10</div>
            </div>
            
            <div className="text-2xl mb-4 opacity-50">⬇️</div>
            
            <div className="bg-emerald-500 text-black font-black uppercase tracking-widest py-4 px-4 rounded-2xl shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)] text-sm">
              💎 {t.vipVitalicio}
            </div>
          </div>
          
        </div>
      </section>

      {/* 3. ÚLTIMOS LANÇAMENTOS (Cabeçalho) */}
      <section className="w-full max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-black mb-4">{t.ultimosLancamentos}</h2>
        <p className="text-gray-500 text-sm">{t.ultimosLancamentosSub}</p>
      </section>
      
    </div>
  );
}