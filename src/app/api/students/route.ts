import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { full_name, email, password } = await req.json();

    // Verifica se o e-mail já existe
    const existing = await sql`SELECT id FROM profiles WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ message: 'Este e-mail já está cadastrado.' }, { status: 400 });
    }

    // Insere o novo aluno
    await sql`
      INSERT INTO profiles (full_name, email, password, role)
      VALUES (${full_name}, ${email}, ${password}, 'aluno')
    `;

    return NextResponse.json({ message: 'Aluno cadastrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    return NextResponse.json({ message: 'Erro interno no servidor' }, { status: 500 });
  }
}