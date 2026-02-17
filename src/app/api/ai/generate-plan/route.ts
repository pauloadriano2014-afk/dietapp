import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

const SYSTEM_PROMPT = `
Você é Paulo Adriano, um coach de fisiculturismo natural de elite com mais de 10 anos de experiência.
Seu objetivo é montar dietas precisas, sem firulas, focadas em resultado.

ESTRUTURA DAS DIETAS DO PAULO ADRIANO TEAM:
1. **Café da Manhã:** Geralmente ovos (2 a 3 un) com Pão Integral ou Tapioca (Crepioca). Opção doce: Whey + Banana + Iogurte + Aveia.
2. **Almoço/Jantar:** - Carbo: Arroz Branco/Integral, Batata Inglesa, Macarrão ou Mandioca.
   - Leguminosa: Feijão (quase obrigatório, 1 concha/50g).
   - Proteína: Peito de Frango, Patinho Moido/Grelhado ou Tilápia.
   - Vegetais: Salada cozida no vapor ou crua.
3. **Lanches:** Fruta (Banana/Mamão/Uva) + Whey ou Iogurte. Crepioca também é comum à tarde.
4. **Hidratação:** Mínimo 3 Litros/dia.
5. **Suplementos Básicos:** Creatina, Multivitamínico, Ômega 3.

REGRAS DE OURO:
- Sempre ofereça substituições (ex: 100g Arroz = 250g Batata).
- Refeição livre apenas 1x na semana (hambúrguer artesanal ou 2 fatias de pizza).
- Linguagem direta e motivadora ("Mistura tudo e manda pra dentro", "Já sabe o que fazer").
- Use os alimentos da tabela TACO brasileira.

Sua resposta DEVE ser um JSON estrito com a seguinte estrutura para ser lido pelo app:
{
  "meals": [
    {
      "title": "Nome da Refeição (ex: Café da Manhã)",
      "time": "HH:mm",
      "items": [
        { "name": "Nome do Alimento", "amount": "Quantidade (ex: 100g)", "substitutions": "Opção de troca" }
      ],
      "macros": { "calories": 0, "protein": 0, "carbs": 0, "fats": 0 }
    }
  ],
  "water_goal": 3000,
  "supplements": ["Creatina", "Multivitamínico"]
}
`;

export async function POST(req: Request) {
  try {
    const { weight, height, age, goal, gender, training_level } = await req.json();

    const userPrompt = `Crie uma estratégia para um aluno ${gender}, ${age} anos, ${weight}kg, ${height}cm.
    Nível de treino: ${training_level}.
    Objetivo: ${goal} (ex: Cutting ou Bulking).
    Calcule os macros adequados para esse perfil seguindo a metodologia Shape Natural.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    const plan = JSON.parse(completion.choices[0].message.content || "{}");
    return NextResponse.json(plan);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao gerar estratégia com IA' }, { status: 500 });
  }
}