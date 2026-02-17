import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db'; // Ajustado para caminho relativo direto
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    // Proteção: garante que só coaches logados usem essa rota
    if (!session?.user?.email) {
      return NextResponse.json({ message: 'Não autorizado' }, { status: 401 });
    }

    const { full_name, email, password, goal } = await req.json();

    // 1. Pega o ID do Coach logado (Paulo ou Vane)
    const coach = await sql`
      SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1
    `;
    
    if (!coach[0]) {
      return NextResponse.json({ message: 'Coach não encontrado' }, { status: 404 });
    }

    const coachId = coach[0].id;

    // 2. Insere o aluno vinculado ao seu Coach ID e salva o Objetivo (goal)
    await sql`
      INSERT INTO profiles (full_name, email, password, role, coach_id, goal)
      VALUES (${full_name}, ${email}, ${password}, 'aluno', ${coachId}, ${goal})
    `;

    return NextResponse.json({ message: 'Sucesso' });
  } catch (error: any) {
    console.error("Erro no cadastro:", error);
    
    // Tratamento básico para e-mail duplicado
    if (error.message?.includes("unique")) {
      return NextResponse.json({ message: 'Este e-mail já está em uso.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Erro ao cadastrar no banco de dados' }, { status: 500 });
  }
}