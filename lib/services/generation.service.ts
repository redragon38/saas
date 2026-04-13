import { z } from "zod";

const baseSchema = z.object({ language: z.string().default("fr"), tone: z.string().default("professional") });

export const titleSchema = baseSchema.extend({
  keyword: z.string().min(2).optional(),
  topic: z.string().min(2).optional(),
  sourceText: z.string().max(6000).optional(),
  count: z.number().int().min(1).max(10).default(3)
}).refine((v) => !!(v.keyword || v.topic || v.sourceText), "keyword, topic ou sourceText requis");

export const metaSchema = baseSchema.extend({
  keyword: z.string().min(2).optional(),
  topic: z.string().min(2).optional(),
  title: z.string().min(3).optional(),
  sourceText: z.string().max(6000).optional(),
  count: z.number().int().min(1).max(5).default(2)
}).refine((v) => !!(v.keyword || v.topic || v.title || v.sourceText), "Entrée SEO requise");

export const faqSchema = baseSchema.extend({
  topic: z.string().min(2).optional(),
  keyword: z.string().min(2).optional(),
  sourceText: z.string().max(6000).optional(),
  count: z.number().int().min(2).max(8).default(4)
}).refine((v) => !!(v.keyword || v.topic || v.sourceText), "topic, keyword ou sourceText requis");

export const summarySchema = z.object({
  sourceText: z.string().min(120).max(12000),
  language: z.string().default("fr"),
  length: z.enum(["short", "medium", "long"]).default("medium")
});

function baseTopic(input: Record<string, unknown>) {
  return String(input.topic ?? input.keyword ?? "SEO strategy");
}

export const generationEngine = {
  generateTitles(input: z.infer<typeof titleSchema>) {
    const t = baseTopic(input);
    return Array.from({ length: input.count }, (_, i) => `${t}: guide SEO ${2026 + i} (${input.tone})`);
  },
  generateMeta(input: z.infer<typeof metaSchema>) {
    const t = baseTopic(input);
    return Array.from({ length: input.count }, (_, i) => `${t} - Optimisez votre visibilité avec des actions concrètes. Variante ${i + 1}.`);
  },
  generateFaq(input: z.infer<typeof faqSchema>) {
    const t = baseTopic(input);
    return Array.from({ length: input.count }, (_, i) => ({
      question: `Comment améliorer ${t} (${i + 1}) ?`,
      answer: `Définissez un plan éditorial, ciblez les intentions de recherche et mesurez vos performances chaque semaine.`
    }));
  },
  summarize(input: z.infer<typeof summarySchema>) {
    const sentences = input.sourceText.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
    const take = input.length === "short" ? 2 : input.length === "medium" ? 4 : 6;
    return {
      summary: sentences.slice(0, take).join(". ") + ".",
      keyPoints: sentences.slice(0, Math.min(5, sentences.length)).map((s) => s.slice(0, 110))
    };
  }
};
