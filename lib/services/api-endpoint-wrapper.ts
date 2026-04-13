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
    const code = auth.reason === "quota_exceeded" ? 429 : 401;
    return fail(auth.reason.toUpperCase(), auth.reason === "quota_exceeded" ? "Quota mensuel dépassé" : "API key invalide", code);
  }

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      await logUsage({ userId: auth.userId, endpoint, statusCode: 422, durationMs: Date.now() - start, errorMessage: "VALIDATION_ERROR" });
      return fail("VALIDATION_ERROR", "Payload invalide", 422, parsed.error.flatten());
    }

    const data = await handler(parsed.data);
    await logUsage({ userId: auth.userId, endpoint, statusCode: 200, durationMs: Date.now() - start });
    return ok(data, { quota: auth.quota });
  } catch (error) {
    await logUsage({ userId: auth.userId, endpoint, statusCode: 500, durationMs: Date.now() - start, errorMessage: String(error) });
    return fail("INTERNAL_ERROR", "Erreur interne", 500);
  }
}
