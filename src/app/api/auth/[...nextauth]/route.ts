import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sql } from "../../../../lib/db"; 

// Nota: Em produção, o ideal é usar bcrypt para comparar senhas. 
// Para os testes iniciais no Neon, usaremos a comparação direta.

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

        try {
          // Busca o usuário no banco de dados Neon
          const users = await sql`
            SELECT id, full_name, email, password, role 
            FROM profiles 
            WHERE email = ${credentials.email} 
            LIMIT 1
          `;

          const user = users[0];

          // Validação: compara a senha digitada com a do banco (texto simples)
          if (user && user.password === credentials.password) {
            return {
              id: user.id,
              name: user.full_name,
              email: user.email,
              role: user.role,
            };
          }
          
          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adiciona o 'role' (coach ou aluno) ao token JWT
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      // Passa o 'role' do token para a sessão do cliente
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };