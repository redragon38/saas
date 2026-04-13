import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { fail, ok } from "@/lib/services/api-response";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getRequiredSession();
  const { plan } = await req.json();

  const priceId = plan === "STARTER" ? env.STRIPE_PRICE_ID_STARTER : plan === "PRO" ? env.STRIPE_PRICE_ID_PRO : plan === "AGENCY" ? env.STRIPE_PRICE_ID_AGENCY : null;
  if (!priceId) return fail("INVALID_PLAN", "Plan invalide", 422);

  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({ email: session.user.email ?? undefined, metadata: { userId: session.user.id } });
    customerId = customer.id;
    await db.subscription.update({ where: { userId: session.user.id }, data: { stripeCustomerId: customerId } });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.APP_URL}/dashboard/billing?success=1`,
    cancel_url: `${env.APP_URL}/pricing?canceled=1`
  });

  return ok({ url: checkout.url });
}
