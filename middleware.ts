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
    // Só permite passar se tiver o cookie de compra ou já logado
    if (!isAuth && !hasPurchaseCookie) {
      console.log("Acesso negado ao signup: sem cookie de compra");
      return NextResponse.redirect(new URL("/#planos", req.nextUrl.origin));
    }
  }

  // --- REGRA DE PROTEÇÃO DO DASHBOARD ---
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
    }
  }

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
