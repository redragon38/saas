import { generationEngine, faqSchema } from "@/lib/services/generation.service";
import { runApiEndpoint } from "@/lib/services/api-endpoint-wrapper";

export async function POST(req: Request) {
  return runApiEndpoint(req, "/api/v1/generate-faq", faqSchema, async (input) => ({
    faq: generationEngine.generateFaq(input)
  }));
}
