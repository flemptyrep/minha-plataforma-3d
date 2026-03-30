import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 1. Recebemos a "impressão digital" (Token) de quem clicou no botão
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Acesso negado. Intruso detetado 🛡️' }, { status: 401 });
    }

    // 2. Criamos a ligação ao Supabase assumindo a tua identidade (via token)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { projetoId, acao } = await request.json();
    const novoStatus = acao === 'aprovar' ? 'aprovado' : 'recusado';

    // 3. O RLS agora vai verificar automaticamente se este token pertence ao teu email!
    const { data, error } = await supabase
      .from('projetos')
      .update({ status: novoStatus })
      .eq('id', projetoId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: data[0] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}