import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    // Verifica se é o Coach acessando (opcional, mas recomendado por segurança)
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Busca todos os alimentos cadastrados
    const foods = await sql`
      SELECT id, food_name, category, base_grams, protein, carbs, fats 
      FROM food_equivalents 
      ORDER BY food_name ASC
    `;

    return NextResponse.json(foods);
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error);
    return NextResponse.json({ error: 'Erro ao carregar lista de alimentos' }, { status: 500 });
  }
}