import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-04-10" as any,
});

const PIXEL_ID = "1702390777841107";
const META_ACCESS_TOKEN = process.env.META_PIXEL_ACCESS_TOKEN || "";

async function sendMetaEvent(eventName: string, userData: object, customData: object) {
  if (!META_ACCESS_TOKEN) return; // Só envia se o token estiver configurado
  try {
    await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              user_data: userData,
              custom_data: customData,
            },
          ],
        }),
      }
    );
  } catch (err) {
    console.error("Meta Conversions API error:", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, fbc, fbp } = body;

    const priceMap: Record<string, string> = {
      "iniciante": process.env.STRIPE_PRICE_INICIANTE || "",
      "heroi": process.env.STRIPE_PRICE_HEROI || "",
      "lenda": process.env.STRIPE_PRICE_LENDA || "",
    };

    const priceMap2Value: Record<string, number> = {
      "iniciante": 49.9,
      "heroi": 49.9,
      "lenda": 79.9,
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
      success_url: `${host}/api/checkout/validate?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/?checkout=canceled`,
    });

    // Dispara InitiateCheckout via Conversions API (server-side, burla ad blocker)
    const value = priceMap2Value[planId?.toLowerCase()] ?? 49.9;
    await sendMetaEvent(
      "InitiateCheckout",
      { fbc: fbc || "", fbp: fbp || "" },
      { currency: "BRL", value, content_name: planId }
    );

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
