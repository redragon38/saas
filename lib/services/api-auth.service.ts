import { headers } from "next/headers";
import { validateApiKey } from "@/lib/services/api-key.service";
import { checkAndConsumeQuota } from "@/lib/services/quota.service";

export async function authenticateApiRequest() {
  const h = headers();
  const auth = h.get("authorization") ?? "";
  const rawKey = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!rawKey) return { ok: false as const, reason: "missing_key" };

  const key = await validateApiKey(rawKey);
  if (!key) return { ok: false as const, reason: "invalid_key" };

  const quota = await checkAndConsumeQuota(key.userId, key.user.subscription?.plan ?? "FREE");
  if (!quota.allowed) return { ok: false as const, reason: "quota_exceeded", userId: key.userId, quota };

  return {
    ok: true as const,
    userId: key.userId,
    plan: key.user.subscription?.plan ?? "FREE",
    quota
  };
}
