import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { fail, ok } from "@/lib/services/api-response";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(80).optional()
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return fail("INVALID_INPUT", "Payload invalide", 422, parsed.error.flatten());

  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return fail("EMAIL_TAKEN", "Email déjà utilisé", 409);

  const passwordHash = await hash(parsed.data.password, 10);
  const user = await db.user.create({ data: { email: parsed.data.email, name: parsed.data.name, passwordHash } });
  await db.subscription.create({ data: { userId: user.id, status: "ACTIVE", plan: "FREE" } });
  return ok({ userId: user.id }, undefined, 201);
}
