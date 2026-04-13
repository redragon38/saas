import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ok } from "@/lib/services/api-response";

export async function GET() {
  const session = await getRequiredSession();
  const logs = await db.usageLog.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return ok({ logs });
}
