import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ok } from "@/lib/services/api-response";

export async function GET() {
  const session = await getRequiredSession();
  const usage = await db.monthlyUsage.findMany({ where: { userId: session.user.id }, orderBy: { monthKey: "desc" }, take: 6 });
  return ok({ usage });
}
