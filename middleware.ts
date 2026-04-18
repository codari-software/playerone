import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Obtém o token da sessão (se existir)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const hasPurchaseCookie = req.cookies.has("playerone_access");
  const isAuth = !!token;

  // --- REGRA: LOGADO NÃO VOLTA PRA HOME ---
  if (pathname === "/") {
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  // --- REGRA DE BLOQUEIO DO SIGNUP ---
  // Se estiver tentando acessar signup
  if (pathname === "/signup") {
    // Se já estiver logado, manda pro dashboard
    if (isAuth) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
    }
  }

  // --- REGRA DE PROTEÇÃO DO DASHBOARD REMOVIDA ---
  // A verificação será feita dentro da página para permitir estados customizados


  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*", 
    "/login", 
    "/signup"
  ],
};
