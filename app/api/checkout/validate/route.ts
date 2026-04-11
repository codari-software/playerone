import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items']
    });

    console.log("--- STRIPE VALIDATION START ---");
    console.log("Status:", session.payment_status);

    if (session.payment_status === "paid" || session.payment_status === "no_payment_required") {
      const email = session.customer_details?.email;
      const priceId = session.line_items?.data[0]?.price?.id || '';
      
      console.log("Email:", email);
      console.log("Price ID:", priceId);

      // Mapeamento de Preço -> Plano
      const priceToPlan: Record<string, string> = {
        [process.env.STRIPE_PRICE_INICIANTE || '']: 'INICIANTE',
        [process.env.STRIPE_PRICE_HEROI || '']: 'HERO',
        [process.env.STRIPE_PRICE_LENDA || '']: 'LEGEND'
      };

      const plan = priceToPlan[priceId] || 'HERO';
      console.log("Plan Mapped to:", plan);

      if (email) {
        try {
          // Atualiza o usuário se ele já existir
          const updated = await prisma.user.updateMany({
            where: { email },
            data: { plan: plan as any }
          });
          console.log("DB Update Result:", updated.count > 0 ? "User Updated" : "User not found (will be created on signup)");
        } catch (dbErr: any) {
          console.error("DB Update Failed:", dbErr.message);
        }
      }

      cookies().set("playerone_access", plan, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      console.log("Access Cookie Set for:", plan);
      console.log("--- STRIPE VALIDATION SUCCESS ---");
      return NextResponse.redirect(new URL("/checkout/success", req.url));
    } else {
      console.log("Payment status not paid:", session.payment_status);
      return NextResponse.redirect(new URL("/?error=payment_pending", req.url));
    }
  } catch (error: any) {
    console.error("CRITICAL ERROR verifying Stripe session:", error.message);
    return NextResponse.redirect(new URL("/?error=invalid_session&msg=" + encodeURIComponent(error.message), req.url));
  }
}
