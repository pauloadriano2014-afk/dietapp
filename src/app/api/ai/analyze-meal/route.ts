import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(req: Request) {
  try {
    const { imageBase64, mealContext } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um assistente de nutricionista. Analise a foto do prato e estime os macros. Seja rigoroso. Responda em JSON."
        },
        {
          role: "user",
          content: [
            { type: "text", text: `O aluno deveria comer: ${mealContext}. Analise a imagem e diga se parece correto, estimando as calorias e macros visíveis.` },
            { type: "image_url", image_url: { url: imageBase64 } },
          ],
        },
      ],
      max_tokens: 300,
    });

    return NextResponse.json({ analysis: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao analisar imagem' }, { status: 500 });
  }
}