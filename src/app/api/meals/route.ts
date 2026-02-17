import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { title, time, calories, protein, carbs, fats, items, studentId } = await req.json();

    // 1. Insere a refeição e recebe o ID gerado
    const result = await sql`
      INSERT INTO meals (student_id, title, time, calories, protein, carbs, fats)
      VALUES (${studentId}, ${title}, ${time}, ${calories}, ${protein}, ${carbs}, ${fats})
      RETURNING id
    `;
    
    const mealId = result[0].id;

    // 2. Insere os itens da refeição em massa
    for (const item of items) {
      if (item.name) {
        await sql`
          INSERT INTO meal_items (meal_id, name, amount, substitutions)
          VALUES (${mealId}, ${item.name}, ${item.amount}, ${item.substitutions})
        `;
      }
    }

    return NextResponse.json({ message: 'Refeição e itens salvos com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar refeição:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}