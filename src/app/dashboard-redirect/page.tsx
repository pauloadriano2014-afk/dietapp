import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

export default async function DashboardRedirect() {
  const session = await getServerSession();
  
  if (!session?.user?.email) redirect('/login');

  const user = await sql`
    SELECT role FROM profiles WHERE email = ${session.user.email} LIMIT 1
  `;

  if (user[0]?.role === 'coach') {
    redirect('/dashboard-coach');
  } else {
    redirect('/dashboard-aluno');
  }
}