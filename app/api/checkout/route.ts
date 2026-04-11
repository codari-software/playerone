import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId } = body;

    const priceMap: Record<string, string> = {
      "iniciante": process.env.STRIPE_PRICE_INICIANTE || "",
      "heroi": process.env.STRIPE_PRICE_HEROI || "",
      "lenda": process.env.STRIPE_PRICE_LENDA || "",
    };

    const priceId = priceMap[planId?.toLowerCase()];

    if (!priceId) {
      return NextResponse.json({ error: "Plano inválido" }, { status: 400 });
    }

    const host = req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Mudança: Agora aponta para o validador
      success_url: `${host}/api/checkout/validate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/?checkout=canceled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
