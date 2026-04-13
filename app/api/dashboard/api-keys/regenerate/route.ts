import { redirect } from "next/navigation";
import { getRequiredSession } from "@/lib/auth/session";
import { createApiKey } from "@/lib/services/api-key.service";

export async function POST() {
  const session = await getRequiredSession();
  await createApiKey(session.user.id);
  redirect("/dashboard/api");
}
