"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function SalaComando() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const ADMIN_EMAIL = 'reislorenasouza@gmail.com';

  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  useEffect(() => {
    async function verificarAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push('/');
        return;
      }

      const { data } = await supabase
        .from('projetos')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (data) setProjetos(data);
      setLoading(false);
    }
    verificarAdmin();
  }, [router]);

  const handleAcao = async (projetoId: string, acao: 'aprovar' | 'recusar') => {
    setActionLoading(projetoId);
    
    try {
      // 1. Pegamos a tua sessão atual e o Token de Segurança
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 2. Enviamos para a API com o Token
      const res = await fetch('/aprovar', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // A Chave Mágica!
        },
        body: JSON.stringify({ projetoId, acao })
      });

      if (res.ok) {
        setProjetos(projetos.filter(p => p.id !== projetoId));
      } else {
        const errorData = await res.json();
        alert("Erro: " + errorData.error);
      }
    } catch (err: any) {
      alert("Erro na ligação: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-emerald-500 font-bold tracking-widest uppercase">{t.carregando}</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-16 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">{t.salaComandoTitulo}</h1>
        </header>

        {projetos.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 p-16 rounded-[2.5rem] text-center shadow-xl">
            <p className="text-gray-500 font-black text-xl">{t.nenhumPendente}</p>
          </div>
        ) : (
          <div className="space-y-10">
            {projetos.map((p) => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-8 items-stretch shadow-2xl">
                
                <div className="md:w-1/3 bg-gray-800 rounded-3xl overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover aspect-square md:aspect-auto" />
                </div>

                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                      <h2 className="text-3xl font-black">{p.nome || 'Sem Nome'}</h2>
                      <a 
                        href={p.arquivo_url} 
                        download 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-[#F8E1C2] text-black px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_-5px_rgba(248,225,194,0.4)] shrink-0"
                      >
                        📂 {t.abrirFicheiro}
                      </a>
                    </div>
                    
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">
                      {t.autor} <span className="text-white">{p.user_id}</span>
                    </p>
                    
                    <div className="bg-black/40 p-5 rounded-2xl border border-gray-800 mb-8">
                      <p className="text-gray-400 italic font-medium">"{p.descricao || t.semDescricao}"</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => handleAcao(p.id, 'recusar')} 
                      disabled={actionLoading === p.id}
                      className="flex-1 bg-red-900/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                    >
                      {actionLoading === p.id ? t.processando : t.recusarProjeto}
                    </button>
                    
                    <button 
                      onClick={() => handleAcao(p.id, 'aprovar')} 
                      disabled={actionLoading === p.id}
                      className="flex-1 bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]"
                    >
                      {actionLoading === p.id ? t.processando : t.aprovarModelo}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}