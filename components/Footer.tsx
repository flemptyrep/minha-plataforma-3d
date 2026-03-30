"use client";

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function Footer() {
  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8 px-6 md:px-12 text-gray-300 font-sans mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* 1. Logo e Descrição */}
        <div>
          <h3 className="text-3xl font-black tracking-tighter text-white mb-4">
            3D<span className="text-blue-500">Vault</span>
          </h3>
          <p className="text-sm leading-relaxed max-w-xs text-gray-400">
            {t.footerDesc}
          </p>
        </div>

        {/* 2. Navegação */}
        <div>
          <h4 className="text-white font-black mb-6 uppercase tracking-widest text-sm">
            {t.navTitulo}
          </h4>
          <div className="flex flex-col gap-4 text-sm font-bold text-gray-400">
            <Link href="/projetos" className="hover:text-blue-500 transition-colors">{t.navGaleria}</Link>
            <Link href="/enviar" className="hover:text-blue-500 transition-colors">{t.navEnviar}</Link>
            <Link href="/perfil" className="hover:text-blue-500 transition-colors">{t.navPerfil}</Link>
            <Link href="/assinatura" className="hover:text-blue-500 transition-colors">{t.navPlanos}</Link>
          </div>
        </div>

        {/* 3. Termos e Entrega */}
        <div>
          <h4 className="text-white font-black mb-6 uppercase tracking-widest text-sm">
            {t.termosTitulo}
          </h4>
          <div className="flex flex-col gap-6 text-sm">
            <div className="flex gap-3 items-start">
              <span className="text-amber-500 text-lg">⚡</span>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">{t.termoEntregaTitulo}</strong> {t.termoEntregaDesc}
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-red-500 text-lg">🚫</span>
              <p className="text-gray-400 leading-relaxed">
                <strong className="text-white">{t.termoReembolsoTitulo}</strong> {t.termoReembolsoDesc}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Segurança */}
        <div>
          <h4 className="text-white font-black mb-6 uppercase tracking-widest text-sm">
            {t.segurancaTitulo}
          </h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
              <span className="text-blue-500 text-lg">💳</span>
              <span className="text-xs font-bold text-gray-300">{t.segStripe}</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 px-4 py-3 rounded-2xl">
              <span className="text-emerald-500 text-lg">🛡️</span>
              <span className="text-xs font-bold text-gray-300">{t.segSupabase}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Barra Inferior */}
      <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-black tracking-widest text-gray-500 uppercase">
        <p>{t.direitos}</p>
        <p className="text-blue-500">{t.suporte}</p>
      </div>
    </footer>
  );
}