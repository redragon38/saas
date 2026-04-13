import { PrismaClient, Plan, SubscriptionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "demo@seoapipack.dev";
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, name: "Demo User" },
    update: {}
  });

  await prisma.subscription.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      plan: Plan.FREE,
      status: SubscriptionStatus.ACTIVE
    },
    update: {}
  });
}

main().finally(async () => prisma.$disconnect());
