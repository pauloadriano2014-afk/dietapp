import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { sourceStudentId, targetStudentId } = await req.json();

    // 1. Busca todas as refeições do aluno de origem
    const sourceMeals = await sql`
      SELECT * FROM meals WHERE student_id = ${sourceStudentId}
    `;

    for (const meal of sourceMeals) {
      // 2. Insere a nova refeição para o aluno de destino
      const newMeal = await sql`
        INSERT INTO meals (student_id, title, time, calories, protein, carbs, fats)
        VALUES (${targetStudentId}, ${meal.title}, ${meal.time}, ${meal.calories}, ${meal.protein}, ${meal.carbs}, ${meal.fats})
        RETURNING id
      `;

      // 3. Busca os itens da refeição original e clona para a nova
      const sourceItems = await sql`
        SELECT * FROM meal_items WHERE meal_id = ${meal.id}
      `;

      for (const item of sourceItems) {
        await sql`
          INSERT INTO meal_items (meal_id, name, amount, substitutions)
          VALUES (${newMeal[0].id}, ${item.name}, ${item.amount}, ${item.substitutions})
        `;
      }
    }

    return NextResponse.json({ message: 'Estratégia clonada com sucesso!' });
  } catch (error) {
    console.error('Erro ao clonar:', error);
    return NextResponse.json({ error: 'Erro ao clonar plano' }, { status: 500 });
  }
}