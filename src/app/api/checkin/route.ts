import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { mealId, status, description } = await req.json();

    const user = await sql`SELECT id FROM profiles WHERE email = ${session.user.email} LIMIT 1`;
    const studentId = user[0].id;

    // Registra o check-in do dia para aquela refeição
    await sql`
      INSERT INTO checkins (student_id, meal_id, status, description, created_at)
      VALUES (${studentId}, ${mealId}, ${status}, ${description}, CURRENT_DATE)
      ON CONFLICT (student_id, meal_id, created_at) 
      DO UPDATE SET status = ${status}, description = ${description}
    `;

    return NextResponse.json({ message: 'Check-in realizado!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 500 });
  }
}