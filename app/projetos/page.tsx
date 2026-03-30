"use client";

export const dynamic = 'force-dynamic'; 

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

interface Projeto {
  id: string;
  nome: string;
  foto_url: string;
  descricao: string;
  status: string;
}

export default function GaleriaPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const ADMIN_EMAIL = 'reislorenasouza@gmail.com';

  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  useEffect(() => {
    async function carregarDados() {
      const { data: { user } } = await supabase.auth.getUser();
      const ehAdmin = user?.email === ADMIN_EMAIL;
      setIsAdmin(ehAdmin);

      const { data } = await supabase.from('projetos').select('*').order('created_at', { ascending: false });

      if (data) {
        // SOLUÇÃO SONAR: Evitar o "!" (Não) e fazer a verificação positiva primeiro
        if (ehAdmin) {
          setProjetos(data);
        } else {
          setProjetos(data.filter(p => p.status === 'aprovado'));
        }
      }
      setLoading(false);
    }
    carregarDados();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest">{t.carregando}</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-16">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase italic">{t.cofreProjetos}</h1>
          {isAdmin && <p className="text-emerald-500 text-[10px] font-bold mt-2 uppercase">{t.adminAtivo}</p>}
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {projetos.map((p) => (
            <div key={p.id} className="group bg-gray-900 border border-gray-800 rounded-[2.5rem] overflow-hidden relative">
              {isAdmin && (
                <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[9px] font-black uppercase ${p.status === 'aprovado' ? 'bg-emerald-500' : 'bg-amber-500 text-black'}`}>
                  {p.status}
                </div>
              )}
              <div className="aspect-square bg-gray-800 overflow-hidden">
                <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-2 truncate">{p.nome || 'Sem Nome'}</h2>
                <p className="text-gray-500 text-sm line-clamp-2 mb-8 italic">{p.descricao || t.semDescricao}</p>
                <Link href={`/projetos/${p.id}`} className="block w-full text-center py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-600 hover:text-white transition uppercase text-xs">
                  {t.verDetalhes}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}