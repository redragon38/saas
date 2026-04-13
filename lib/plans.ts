import { Plan } from "@prisma/client";

export const PLAN_CONFIG: Record<Plan, { name: string; quota: number; priceLabel: string; stripePriceId?: string }> = {
  FREE: { name: "Free", quota: 100, priceLabel: "$0" },
  STARTER: { name: "Starter", quota: 2000, priceLabel: "$29", stripePriceId: process.env.STRIPE_PRICE_ID_STARTER },
  PRO: { name: "Pro", quota: 10000, priceLabel: "$79", stripePriceId: process.env.STRIPE_PRICE_ID_PRO },
  AGENCY: { name: "Agency", quota: 50000, priceLabel: "$199", stripePriceId: process.env.STRIPE_PRICE_ID_AGENCY }
};

export function quotaForPlan(plan: Plan): number {
  return PLAN_CONFIG[plan].quota;
}
