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

  const updateResult = await db.monthlyUsage.updateMany({
    where: {
      id: usage.id,
      requestCount: { lt: usage.quotaLimit }
    },
    data: { requestCount: { increment: 1 } }
  });

  const refreshed = await db.monthlyUsage.findUnique({ where: { id: usage.id } });
  if (!refreshed) {
    return { allowed: false as const, remaining: 0, used: usage.requestCount, limit: usage.quotaLimit };
  }

  if (updateResult.count === 0) {
    return { allowed: false as const, remaining: 0, used: refreshed.requestCount, limit: refreshed.quotaLimit };
  }

  return {
    allowed: true as const,
    remaining: Math.max(refreshed.quotaLimit - refreshed.requestCount, 0),
    used: refreshed.requestCount,
    limit: refreshed.quotaLimit
  };
}
