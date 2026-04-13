import { ZodSchema } from "zod";
import { authenticateApiRequest } from "@/lib/services/api-auth.service";
import { fail, ok } from "@/lib/services/api-response";
import { logUsage } from "@/lib/services/usage-log.service";

export async function runApiEndpoint<TInput, TResult>(
  req: Request,
  endpoint: string,
  schema: ZodSchema<TInput>,
  handler: (input: TInput) => Promise<TResult> | TResult
) {
  const start = Date.now();
  const auth = await authenticateApiRequest();

  if (!auth.ok) {
    if (auth.reason === "quota_exceeded") return fail("QUOTA_EXCEEDED", "Quota mensuel dépassé", 429);
    if (auth.reason === "rate_limited") return fail("RATE_LIMITED", "Trop de requêtes par minute", 429, { window: "60s", limit: 120 });
    return fail(auth.reason.toUpperCase(), auth.reason === "missing_key" ? "Authorization Bearer manquant" : "API key invalide", 401);
  }

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      await logUsage({ userId: auth.userId, endpoint, statusCode: 422, durationMs: Date.now() - start, errorMessage: "VALIDATION_ERROR" });
      return fail("VALIDATION_ERROR", "Payload invalide", 422, parsed.error.flatten());
    }

    const data = await handler(parsed.data);
    await logUsage({ userId: auth.userId, endpoint, statusCode: 200, durationMs: Date.now() - start });
    return ok(data, { quota: auth.quota, rateLimit: auth.rate });
  } catch (error) {
    await logUsage({ userId: auth.userId, endpoint, statusCode: 500, durationMs: Date.now() - start, errorMessage: String(error) });
    return fail("INTERNAL_ERROR", "Erreur interne", 500);
  }
}
