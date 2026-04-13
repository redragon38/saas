import { Plan } from "@prisma/client";
import { db } from "@/lib/db";
import { quotaForPlan } from "@/lib/plans";
import { monthKey } from "@/lib/utils";

export async function checkAndConsumeQuota(userId: string, plan: Plan) {
  const quotaLimit = quotaForPlan(plan);
  const key = monthKey();

  const usage = await db.monthlyUsage.upsert({
    where: { userId_monthKey: { userId, monthKey: key } },
    create: { userId, monthKey: key, requestCount: 0, quotaLimit },
    update: { quotaLimit }
  });

  if (usage.requestCount >= usage.quotaLimit) {
    return { allowed: false as const, remaining: 0, used: usage.requestCount, limit: usage.quotaLimit };
  }

  const updated = await db.monthlyUsage.update({
    where: { id: usage.id },
    data: { requestCount: { increment: 1 } }
  });

  return {
    allowed: true as const,
    remaining: Math.max(updated.quotaLimit - updated.requestCount, 0),
    used: updated.requestCount,
    limit: updated.quotaLimit
  };
}
