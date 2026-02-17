import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { sql } from "../lib/db"; // Mudança aqui: usando caminho relativo

export default async function Home() {
  // 1. Verifica se existe uma sessão ativa
  const session = await getServerSession();

  // 2. Se não estiver logado, manda direto para o Login
  if (!session?.user?.email) {
    redirect('/login');
  }

  // 3. Busca o papel (role) no Neon
  const userData = await sql`
    SELECT role FROM profiles WHERE email = ${session.user.email} LIMIT 1
  `;

  const user = userData[0];

  // 4. Redirecionamento baseado na função
  if (user?.role === 'coach') {
    redirect('/dashboard-coach');
  } else {
    redirect('/dashboard-aluno');
  }

  return null;
}