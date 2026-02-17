import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { studentId, waterGoal } = await req.json();

    await sql`
      UPDATE profiles 
      SET water_goal = ${waterGoal} 
      WHERE id = ${studentId}
    `;

    return NextResponse.json({ message: 'Meta atualizada com sucesso!' });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar meta' }, { status: 500 });
  }
}