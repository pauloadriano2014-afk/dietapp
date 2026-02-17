import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const user = await sql`SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1`;

    await sql`
      INSERT INTO cheat_meals (student_id, description)
      VALUES (${user[0].id}, 'Refeição Livre Registrada')
    `;

    return NextResponse.json({ message: 'Refeição registrada' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registar' }, { status: 500 });
  }
}