import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Inicializa o Stripe com a versão exata que o erro solicitou: 2026-03-25.dahlia
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia',
});

export async function POST(req: Request) {
  try {
    // Busca os dados enviados pelo componente de assinatura
    const { userId, email } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'Utilizador não identificado' }, { status: 400 });
    }

    // Cria a sessão de checkout no Stripe (Modo Real/Live)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          // Este ID deve estar configurado nas variáveis de ambiente da Vercel
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      
      // URLs de retorno usando concatenação (sem crases/backticks)
      success_url: req.headers.get('origin') + '/projetos?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: req.headers.get('origin') + '/assinatura',
      
      // Identificação do cliente
      customer_email: email,
      
      // Metadata permite que o Stripe nos diga QUEM pagou na hora de ativar o VIP
      metadata: {
        userId: userId,
      },
    });

    // Retorna a URL para o seu site redirecionar para o pagamento seguro
    return NextResponse.json({ url: session.url });

  } catch (err: any) {
    console.error('Erro no Checkout:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}