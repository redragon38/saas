import { headers } from "next/headers";
import { validateApiKey } from "@/lib/services/api-key.service";
import { checkAndConsumeQuota } from "@/lib/services/quota.service";
import { consumeRateLimit } from "@/lib/services/rate-limit.service";

export async function authenticateApiRequest() {
  const h = headers();
  const auth = h.get("authorization") ?? "";
  const rawKey = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";

  if (!rawKey) return { ok: false as const, reason: "missing_key" };

  const key = await validateApiKey(rawKey);
  if (!key) return { ok: false as const, reason: "invalid_key" };

  const rate = consumeRateLimit(`${key.userId}:${key.id}`);
  if (!rate.allowed) return { ok: false as const, reason: "rate_limited", userId: key.userId, rate };

  const quota = await checkAndConsumeQuota(key.userId, key.user.subscription?.plan ?? "FREE");
  if (!quota.allowed) return { ok: false as const, reason: "quota_exceeded", userId: key.userId, quota };

  return {
    ok: true as const,
    userId: key.userId,
    plan: key.user.subscription?.plan ?? "FREE",
    quota,
    rate
  };
}
