"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: novaSenha
    });

    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      alert('Senha atualizada com sucesso! Já pode fazer login.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-black text-white mb-6">Nova Senha 🔑</h1>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Digite a sua nova senha"
            required
            className="w-full p-4 bg-gray-950 border border-gray-800 rounded-xl text-white outline-none focus:border-blue-500"
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? 'A atualizar...' : 'Confirmar Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  );
}