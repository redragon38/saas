import { generationEngine, titleSchema } from "@/lib/services/generation.service";
import { runApiEndpoint } from "@/lib/services/api-endpoint-wrapper";

export async function POST(req: Request) {
  return runApiEndpoint(req, "/api/v1/generate-title", titleSchema, async (input) => ({
    titles: generationEngine.generateTitles(input)
  }));
}
