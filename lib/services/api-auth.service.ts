import { Plan, SubscriptionStatus } from "@prisma/client";
import { headers } from "next/headers";
import { validateApiKey } from "@/lib/services/api-key.service";
import { checkAndConsumeQuota } from "@/lib/services/quota.service";
import { consumeRateLimit } from "@/lib/services/rate-limit.service";

function effectivePlan(plan: Plan | undefined, status: SubscriptionStatus | undefined): Plan {
  if (!plan) return "FREE";
  if (plan === "FREE") return "FREE";
  if (status === "ACTIVE" || status === "TRIALING") return plan;
  return "FREE";
}

export async function authenticateApiRequest() {
  const h = headers();
  const auth = h.get("authorization") ?? "";
  const rawKey = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!rawKey) return { ok: false as const, reason: "missing_key" };

  const key = await validateApiKey(rawKey);
  if (!key) return { ok: false as const, reason: "invalid_key" };

  const rate = consumeRateLimit(`${key.userId}:${key.id}`);
  if (!rate.allowed) return { ok: false as const, reason: "rate_limited", userId: key.userId, rate };

  const plan = effectivePlan(key.user.subscription?.plan, key.user.subscription?.status);
  const quota = await checkAndConsumeQuota(key.userId, plan);
  if (!quota.allowed) return { ok: false as const, reason: "quota_exceeded", userId: key.userId, quota };

  return {
    ok: true as const,
    userId: key.userId,
    plan,
    quota,
    rate
  };
}
