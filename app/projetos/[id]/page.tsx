"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function ProjetoDetalhes() {
  const [projeto, setProjeto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const params = useParams();
  const id = params.id as string;
  
  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  useEffect(() => {
    async function carregarProjeto() {
      if (!id) return;
      const { data, error } = await supabase.from('projetos').select('*').eq('id', id).single();
      
      if (error) {
        console.error("Erro ao buscar projeto:", error);
      } else if (data) {
        setProjeto(data);
      }
      setLoading(false);
    }
    carregarProjeto();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest">{t.carregando}</div>;
  if (!projeto) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">{t.projetoNaoEncontrado}</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link href="/projetos" className="text-blue-500 text-sm font-bold uppercase tracking-widest hover:text-white mb-8 inline-block transition">
          &larr; {t.voltarGaleria}
        </Link>
        
        <div className="bg-gray-900 border border-gray-800 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
          <div className="md:w-1/2 bg-gray-800">
            <img src={projeto.foto_url} alt={projeto.nome} className="w-full h-full object-cover min-h-[400px]" />
          </div>
          
          <div className="p-10 md:w-1/2 flex flex-col">
            <h1 className="text-4xl font-black mb-8">{projeto.nome}</h1>
            
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-800 mb-8 flex-1">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap italic">
                {projeto.descricao || t.semDescricao}
              </p>
            </div>
            
            <a href={projeto.arquivo_url} target="_blank" download rel="noopener noreferrer" className="w-full text-center py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/30 uppercase tracking-widest text-sm">
              📂 {t.baixarArquivo}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}