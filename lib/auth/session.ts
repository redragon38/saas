import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function getRequiredSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("UNAUTHORIZED");
  return session;
}
