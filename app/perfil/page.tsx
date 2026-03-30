"use client";

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

// SOLUÇÃO SONAR: Função separada para lidar com as cores das etiquetas
const getStatusBadge = (status: string, t: any) => {
  if (status === 'aprovado') return { text: t.aprovado, style: 'bg-emerald-500 text-black' };
  if (status === 'recusado') return { text: t.recusado, style: 'bg-red-500 text-white' };
  return { text: t.pendente, style: 'bg-amber-500 text-black' };
};

export default function Perfil() {
  const [projetos, setProjetos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [userEmail, setUserEmail] = useState('');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [atualizando, setAtualizando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      
      setUserEmail(user.email || '');
      setNomeUsuario(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.id);

      const { data } = await supabase.from('projetos').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setProjetos(data);
      setLoading(false);
    }
    carregarPerfil();
  }, [router]);

  const handleAtualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setAtualizando(true);

    try {
      let novaAvatarUrl = avatarUrl;

      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('fotos').upload(fileName, file);
        if (uploadError) throw uploadError;

        novaAvatarUrl = supabase.storage.from('fotos').getPublicUrl(fileName).data.publicUrl;
        setAvatarUrl(novaAvatarUrl);
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: nomeUsuario, avatar_url: novaAvatarUrl }
      });
      if (updateError) throw updateError;

      if (novaSenha.trim() !== '') {
        const { error: passError } = await supabase.auth.updateUser({ password: novaSenha });
        if (passError) throw passError;
        setNovaSenha(''); 
      }

      alert(t.sucessoPerfil);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setAtualizando(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-blue-500 font-bold uppercase tracking-widest">{t.carregando}</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 border-b border-gray-800 pb-8 flex items-center gap-6">
          <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover bg-gray-800" />
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-1">{t.meuPerfil}</h1>
            <p className="text-gray-400">{t.olaMundo} <strong className="text-white">{nomeUsuario || userEmail}</strong></p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest">{t.configuracoesDaConta}</h2>
            <form onSubmit={handleAtualizarPerfil} className="bg-gray-900 border border-gray-800 p-8 rounded-[2rem] shadow-xl space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">{t.fotoPerfil}</label>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" ref={fileInputRef} className="hidden" id="foto-upload" />
                  <label htmlFor="foto-upload" className="w-full text-center cursor-pointer p-4 bg-gray-950 border border-gray-800 rounded-2xl hover:border-blue-500 transition-colors text-xs font-bold uppercase">
                    {t.alterarFoto} 📷
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">{t.nome}</label>
                <input type="text" value={nomeUsuario} onChange={e => setNomeUsuario(e.target.value)} className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase ml-2">{t.novaSenha}</label>
                <input type="password" placeholder="******" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl focus:border-blue-500 outline-none transition-colors placeholder-gray-700" />
              </div>
              <button type="submit" disabled={atualizando} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs mt-4">
                {atualizando ? t.atualizando : t.guardarAlteracoes}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-xl font-black mb-6 uppercase tracking-widest">{t.meusProjetos} ({projetos.length})</h2>
            {projetos.length === 0 ? (
              <div className="bg-gray-900 border border-gray-800 p-10 rounded-[2rem] text-center text-gray-500 italic h-full flex items-center justify-center">
                {t.nenhumProjeto}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {projetos.map((p) => {
                  // SOLUÇÃO SONAR: Usar a função limpa em vez de ternários aninhados
                  const badge = getStatusBadge(p.status, t);
                  return (
                    <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden relative shadow-xl hover:border-blue-500/30 transition-colors">
                      <div className={`absolute top-4 right-4 z-10 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl ${badge.style}`}>
                        {badge.text}
                      </div>
                      <div className="aspect-video bg-gray-800">
                        <img src={p.foto_url} alt={p.nome} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-1 truncate">{p.nome || 'Sem Nome'}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}