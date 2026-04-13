import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { quotaForPlan } from "@/lib/plans";

export default async function DashboardPage() {
  const session = await getRequiredSession();
  const subscription = await db.subscription.findUnique({ where: { userId: session.user.id } });
  const usage = await db.monthlyUsage.findFirst({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" } });
  const apiKey = await db.apiKey.findFirst({ where: { userId: session.user.id, revokedAt: null }, orderBy: { createdAt: "desc" } });
  const logs = await db.usageLog.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 10 });

  const plan = subscription?.plan ?? "FREE";
  const limit = quotaForPlan(plan);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Overview</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-white p-4">Plan actuel: <b>{plan}</b></div>
        <div className="rounded-lg border bg-white p-4">Usage mensuel: <b>{usage?.requestCount ?? 0}/{limit}</b></div>
        <div className="rounded-lg border bg-white p-4">API key: <b>{apiKey?.keyPrefix ?? "Aucune"}******</b></div>
      </div>
      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-2 text-xl font-semibold">Logs récents</h2>
        <ul className="space-y-1 text-sm">
          {logs.map((log) => <li key={log.id}>{log.endpoint} · {log.statusCode} · {new Date(log.createdAt).toLocaleString()}</li>)}
        </ul>
      </div>
    </div>
  );
}
