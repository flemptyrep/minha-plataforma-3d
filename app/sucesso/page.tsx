"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Sucesso() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const ativarPremium = async () => {
      // 1. Pega quem é o usuário que acabou de voltar do Stripe
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // 2. Avisa o banco de dados: "Pode liberar o VIP pra essa pessoa!"
      const { error } = await supabase
        .from('perfis')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (error) {
        console.error("Erro ao liberar acesso:", error.message);
      }

      setLoading(false); // Tira a tela de carregamento
    };

    ativarPremium();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center text-2xl font-bold animate-pulse">Liberando seus arquivos VIP...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4 text-center">
      <div className="max-w-lg w-full bg-gray-900 border border-emerald-500/30 rounded-3xl p-10 shadow-2xl">
        
        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-600/50">
          <span className="text-4xl">🎉</span>
        </div>
        
        <h1 className="text-4xl font-black mb-4 text-emerald-500">
          Pagamento Aprovado!
        </h1>
        
        <p className="text-gray-400 mb-8 text-lg">
          Muito obrigado! Sua conta agora é <span className="text-blue-500 font-bold">Premium</span> e todos os cadeados foram abertos.
        </p>

        <Link href="/projetos" className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition shadow-lg shadow-blue-600/20 text-lg">
          🚀 Ir para a Galeria de Arquivos
        </Link>
        
      </div>
    </div>
  );
}