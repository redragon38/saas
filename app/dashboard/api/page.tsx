import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function DashboardApiPage() {
  const session = await getRequiredSession();
  const apiKey = await db.apiKey.findFirst({ where: { userId: session.user.id, revokedAt: null }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">API Key</h1>
      <p className="rounded border bg-white p-4">Clé active: {apiKey?.keyPrefix ?? "Aucune"}******</p>
      <form action="/api/dashboard/api-keys/regenerate" method="post"><button className="rounded bg-brand px-3 py-2 text-white">Régénérer la clé</button></form>
    </div>
  );
}
