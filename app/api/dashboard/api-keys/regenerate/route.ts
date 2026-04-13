import { getRequiredSession } from "@/lib/auth/session";
import { createApiKey } from "@/lib/services/api-key.service";
import { ok } from "@/lib/services/api-response";

export async function POST() {
  const session = await getRequiredSession();
  const rawKey = await createApiKey(session.user.id);
  return ok({ rawKey, hint: "Cette clé ne sera plus affichée après fermeture." });
}
