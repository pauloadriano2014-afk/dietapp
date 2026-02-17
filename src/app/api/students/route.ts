import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    const { full_name, email, password } = await req.json();

    // 1. Pega o ID do Coach logado (Você ou a Vane)
    const coach = await sql`SELECT id FROM profiles WHERE email = ${session?.user?.email} LIMIT 1`;
    const coachId = coach[0].id;

    // 2. Insere o aluno vinculado ao Coach
    await sql`
      INSERT INTO profiles (full_name, email, password, role, coach_id)
      VALUES (${full_name}, ${email}, ${password}, 'aluno', ${coachId})
    `;

    return NextResponse.json({ message: 'Sucesso' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao cadastrar' }, { status: 500 });
  }
}