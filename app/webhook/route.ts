import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// 1. Inicializa o Stripe com a versão correta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

// 2. Inicializa o Supabase com a chave de ADMIN (Service Role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  // O Stripe exige o corpo da requisição em formato de texto "cru"
  const body = await req.text();
  
  // CORREÇÃO: Aguardamos (await) os headers antes de pegar a assinatura
  const headersList = await headers();
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    // 3. Verifica se a mensagem veio mesmo do Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error('Erro na assinatura do Webhook:', err.message);
    return NextResponse.json({ error: 'Erro de Autenticação do Webhook' }, { status: 400 });
  }

  // 4. Se o evento for "Pagamento Concluído com Sucesso"...
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Apanha o ID do utilizador que guardámos nos metadata
    const userId = session.metadata?.userId;

    if (userId) {
      // 5. A MÁGICA: Vai ao Supabase e muda a conta do utilizador para VIP
      const { error } = await supabaseAdmin
        .from('perfis')
        .update({ is_premium: true })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar Supabase:', error.message);
        return NextResponse.json({ error: 'Erro ao guardar no banco de dados' }, { status: 500 });
      }
      
      console.log('SUCESSO! Utilizador promovido a VIP. ID:', userId);
    }
  }

  // 6. Responde ao Stripe com um "OK"
  return NextResponse.json({ recebido: true }, { status: 200 });
}