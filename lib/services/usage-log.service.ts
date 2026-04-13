import { db } from "@/lib/db";

export async function logUsage(input: {
  userId: string;
  endpoint: string;
  statusCode: number;
  durationMs?: number;
  errorMessage?: string;
}) {
  await db.usageLog.create({
    data: {
      userId: input.userId,
      endpoint: input.endpoint,
      statusCode: input.statusCode,
      durationMs: input.durationMs,
      errorMessage: input.errorMessage
    }
  });
}
