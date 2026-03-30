"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { dicionario } from '@/lib/dicionario';

export default function EnviarProjeto() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const router = useRouter();

  const { idioma } = useLanguage();
  const t = dicionario[idioma as keyof typeof dicionario];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto || !arquivo) return alert(t.avisoAnexo);
    
    setEnviando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // 1. Upload da Foto
      const fotoNome = `${Date.now()}_${foto.name}`;
      const { error: errFoto } = await supabase.storage.from('fotos').upload(fotoNome, foto);
      if (errFoto) throw errFoto;

      // 2. Upload do Ficheiro (STL/3MF)
      const arquivoNome = `${Date.now()}_${arquivo.name}`;
      const { error: errArq } = await supabase.storage.from('arquivos').upload(arquivoNome, arquivo);
      if (errArq) throw errArq;

      // 3. Pegar os Links Públicos
      const fotoUrl = supabase.storage.from('fotos').getPublicUrl(fotoNome).data.publicUrl;
      const arqUrl = supabase.storage.from('arquivos').getPublicUrl(arquivoNome).data.publicUrl;

      // 4. Guardar no Banco de Dados
      const { error: dbError } = await supabase.from('projetos').insert([{
        nome, descricao, foto_url: fotoUrl, arquivo_url: arqUrl, status: 'pendente', user_id: user.id
      }]);

      if (dbError) throw dbError;

      alert(t.sucessoEnvio);
      router.push('/perfil');
    } catch (err: any) {
      alert(t.erroEnvio + err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 flex items-center justify-center font-sans">
      <form onSubmit={handleUpload} className="max-w-xl w-full bg-gray-900 p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-6">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{t.enviarTitulo1} <span className="text-blue-500">{t.enviarTitulo2}</span></h1>
        
        <input type="text" placeholder={t.nomeModelo} required className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl" onChange={e => setNome(e.target.value)} />
        <textarea placeholder={t.descModelo} className="w-full p-4 bg-gray-950 border border-gray-800 rounded-2xl h-32" onChange={e => setDescricao(e.target.value)} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">{t.fotoImpressao}</label>
            <input type="file" accept="image/*" required className="w-full text-xs p-3 bg-gray-950 border border-gray-800 rounded-xl" onChange={e => setFoto(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-2">{t.ficheiro3D}</label>
            <input type="file" accept=".stl,.3mf" required className="w-full text-xs p-3 bg-gray-950 border border-gray-800 rounded-xl" onChange={e => setArquivo(e.target.files?.[0] || null)} />
          </div>
        </div>

        <button type="submit" disabled={enviando} className="w-full py-4 bg-blue-600 font-black rounded-2xl hover:bg-blue-500 transition shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm">
          {enviando ? t.carregandoFicheiros : t.submeterBtn}
        </button>
      </form>
    </div>
  );
}