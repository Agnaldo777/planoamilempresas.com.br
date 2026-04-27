import { NextResponse } from 'next/server';
import type { Lead } from '@/lib/sanity/types';

export async function POST(request: Request) {
  try {
    const body: Lead = await request.json();

    if (!body.nome || !body.whatsapp) {
      return NextResponse.json({ error: 'Nome e WhatsApp são obrigatórios' }, { status: 400 });
    }

    // TODO: Save to Sanity CMS when configured
    // const result = await sanityClient.create({ _type: 'lead', ...body, created_at: new Date().toISOString() });

    console.log('Lead received:', body);

    return NextResponse.json({ success: true, message: 'Lead recebido com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao processar lead' }, { status: 500 });
  }
}
