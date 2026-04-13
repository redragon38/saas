import crypto from "crypto";
import { db } from "@/lib/db";

const API_KEY_PREFIX = "seopk_";

function hashKey(rawKey: string) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

export async function createApiKey(userId: string) {
  const secret = crypto.randomBytes(24).toString("hex");
  const rawKey = `${API_KEY_PREFIX}${secret}`;
  const keyPrefix = rawKey.slice(0, 12);
  const hashedKey = hashKey(rawKey);

  await db.apiKey.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  await db.apiKey.create({ data: { userId, keyPrefix, hashedKey } });

  return rawKey;
}

export async function validateApiKey(rawKey: string) {
  const keyPrefix = rawKey.slice(0, 12);
  const hashedKey = hashKey(rawKey);

  const key = await db.apiKey.findFirst({
    where: { keyPrefix, hashedKey, revokedAt: null },
    include: { user: { include: { subscription: true } } }
  });

  if (!key) return null;

  await db.apiKey.update({ where: { id: key.id }, data: { lastUsedAt: new Date() } });
  return key;
}
