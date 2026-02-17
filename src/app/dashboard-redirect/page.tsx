import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db"; // Ajustado para caminho relativo

export default async function DashboardRedirect() {
  const session = await getServerSession();
  
  if (!session?.user?.email) redirect('/login');

  const userData = await sql`
    SELECT role FROM profiles WHERE email = ${session.user.email} LIMIT 1
  `;

  const user = userData[0];

  if (user?.role === 'coach') {
    redirect('/dashboard-coach');
  } else {
    redirect('/dashboard-aluno');
  }

  return null;
}