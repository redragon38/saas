import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { planFromPriceId } from "@/lib/services/subscription.service";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.created") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = String(sub.customer);
    const priceId = sub.items.data[0]?.price.id;

    await db.subscription.updateMany({
      where: { stripeCustomerId: customerId },
      data: {
        stripeSubscriptionId: sub.id,
        stripePriceId: priceId,
        plan: planFromPriceId(priceId),
        status: sub.status === "active" ? "ACTIVE" : sub.status === "past_due" ? "PAST_DUE" : "INACTIVE",
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end
      }
    });
  }

  return new Response("ok", { status: 200 });
}
