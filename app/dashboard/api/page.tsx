import { getRequiredSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";

export default async function DashboardApiPage() {
  const session = await getRequiredSession();
  const apiKey = await db.apiKey.findFirst({ where: { userId: session.user.id, revokedAt: null }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">API Key</h1>
      <ApiKeyManager maskedPrefix={apiKey?.keyPrefix ?? "Aucune"} />
    </div>
  );
}
