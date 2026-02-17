import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isCoachPage = req.nextUrl.pathname.startsWith("/dashboard-coach");
    const isStudentPage = req.nextUrl.pathname.startsWith("/dashboard-aluno");

    // Proteção de Rota: Se for página de Coach e o usuário não for coach, volta pro login
    if (isCoachPage && token?.role !== "coach") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Proteção de Rota: Se for página de Aluno e o usuário não for aluno, volta pro login
    if (isStudentPage && token?.role !== "aluno") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard-coach/:path*", "/dashboard-aluno/:path*"],
};