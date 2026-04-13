import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function UsagePage() {
  const session = await getRequiredSession();
  const logs = await db.usageLog.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold">Usage logs</h1>
      <div className="rounded border bg-white">
        {logs.map((log) => <div key={log.id} className="border-b p-3 text-sm">{log.endpoint} · {log.statusCode} · {log.durationMs ?? 0}ms</div>)}
      </div>
    </div>
  );
}
