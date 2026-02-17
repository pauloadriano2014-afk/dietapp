import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { title, content, category } = await req.json();

    // Busca o ID do Coach pelo email
    const coach = await sql`SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1`;

    await sql`
      INSERT INTO coach_tips (coach_id, title, content, category)
      VALUES (${coach[0].id}, ${title}, ${content}, ${category})
    `;

    return NextResponse.json({ message: 'Dica salva!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}