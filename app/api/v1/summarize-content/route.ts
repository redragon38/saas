import { generationEngine, summarySchema } from "@/lib/services/generation.service";
import { runApiEndpoint } from "@/lib/services/api-endpoint-wrapper";

export async function POST(req: Request) {
  return runApiEndpoint(req, "/api/v1/summarize-content", summarySchema, async (input) => generationEngine.summarize(input));
}
