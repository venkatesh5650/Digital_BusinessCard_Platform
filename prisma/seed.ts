import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
});

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clean any previous demo data
    await prisma.vCard.deleteMany({ where: { slug: "demo" } });
    await prisma.user.deleteMany({ where: { email: "demo@example.com" } });

    // Create a demo user
    const demoUser = await prisma.user.create({
      data: {
        email: "demo@example.com",
        name: "Demo User",
        password: await bcrypt.hash("demo123", 10),
      },
    });

    console.log(`✅ Demo user created with ID: ${demoUser.id}`);

    // Create a demo VCard linked to the user
    await prisma.vCard.create({
      data: {
        userId: demoUser.id,
        slug: "ravikumar",
        isPublished: true,
        vcfDownloadEnabled: true,
        firstName: "Ravi",
        lastName: "Kumar",
        displayName: "Ravi Kumar",
        jobTitle: "Founder & CEO at Computer Port",
        avatarUrl: "/placeholder-avatar.png",
        bio: "Managing digital presence and operations at Computer Port.",
        socialLinks: {
          create: [
            {
              platform: "linkedin",
              url: "https://linkedin.com/in/demo",
              handle: "@demo",
            },
          ],
        },
      },
    });

    console.log("✅ Demo vCard created successfully");
    console.log("🎉 Seeding completed!");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("❌ Fatal error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Prisma client disconnected");
  });