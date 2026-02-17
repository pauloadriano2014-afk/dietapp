import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é o assistente do Paulo Adriano Team." },
        { role: "user", content: "Gere uma frase motivacional curta para um aluno que quer ser um Shape Natural de Elite." }
      ],
    });

    return NextResponse.json({ 
      status: "Conexão OK!", 
      mensagem: completion.choices[0].message.content 
    });
  } catch (error: any) {
    return NextResponse.json({ status: "Erro", details: error.message }, { status: 500 });
  }
}