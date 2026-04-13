import { Plan, SubscriptionStatus } from "@prisma/client";
import { db } from "@/lib/db";

export async function getOrCreateSubscription(userId: string) {
  const existing = await db.subscription.findUnique({ where: { userId } });
  if (existing) return existing;
  return db.subscription.create({ data: { userId, plan: Plan.FREE, status: SubscriptionStatus.ACTIVE } });
}

export function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) return Plan.FREE;
  if (priceId === process.env.STRIPE_PRICE_ID_STARTER) return Plan.STARTER;
  if (priceId === process.env.STRIPE_PRICE_ID_PRO) return Plan.PRO;
  if (priceId === process.env.STRIPE_PRICE_ID_AGENCY) return Plan.AGENCY;
  return Plan.FREE;
}
