import { redirect } from "next/navigation";
import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = await getRequiredSession();
  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  if (!subscription?.stripeCustomerId) redirect("/pricing");

  const portal = await stripe.billingPortal.sessions.create({ customer: subscription.stripeCustomerId, return_url: `${env.APP_URL}/dashboard/billing` });
  redirect(portal.url);
}
