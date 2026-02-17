import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "@/lib/db";
// Nota: Em produção, use bcrypt para comparar senhas. 
// Aqui faremos a lógica base para o Neon.

const handler = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca o usuário no Neon
        const users = await sql`
          SELECT * FROM profiles WHERE email = ${credentials.email} LIMIT 1
        `;

        const user = users[0];

        // Comparação simples de senha (em produção, use hash!)
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    }
  }
});

export { handler as GET, handler as POST };