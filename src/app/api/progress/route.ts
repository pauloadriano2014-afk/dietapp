import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { weight, waist, abs, hips } = await req.json();

    // Busca o ID do usuário pelo email da sessão
    const user = await sql`SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1`;
    
    if (user.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Insere os dados no Neon
    await sql`
      INSERT INTO progress_logs (student_id, weight, waist, abs, hips)
      VALUES (${user[0].id}, ${weight}, ${waist}, ${abs}, ${hips})
    `;

    return NextResponse.json({ message: 'Progresso salvo com sucesso!' });
  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}