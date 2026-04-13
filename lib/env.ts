import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(16),
  NEXTAUTH_URL: z.string().url(),
  APP_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith("whsec_"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
  STRIPE_PRICE_ID_STARTER: z.string().min(1),
  STRIPE_PRICE_ID_PRO: z.string().min(1),
  STRIPE_PRICE_ID_AGENCY: z.string().min(1),
  PROVIDER_API_KEY: z.string().optional(),
  PROVIDER_MODEL: z.string().default("heuristic-v1")
});

export const env = envSchema.parse(process.env);
