import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { amount } = await req.json();
    const user = await sql`SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1`;

    await sql`
      INSERT INTO water_logs (student_id, amount_ml, created_at)
      VALUES (${user[0].id}, ${amount}, CURRENT_DATE)
      ON CONFLICT (student_id, created_at) 
      DO UPDATE SET amount_ml = ${amount}
    `;

    return NextResponse.json({ message: 'Água atualizada' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }
}