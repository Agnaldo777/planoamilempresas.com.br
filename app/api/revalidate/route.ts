import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const secret = request.headers.get('x-revalidate-secret');
    if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { type, slug } = body;

    const pathMap: Record<string, string> = {
      plano: `/planos/${slug}`,
      cidade: `/plano-amil-${slug}`,
      blogPost: `/blog/${slug}`,
      faq: `/perguntas-frequentes/${slug}`,
    };

    const path = pathMap[type];
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
