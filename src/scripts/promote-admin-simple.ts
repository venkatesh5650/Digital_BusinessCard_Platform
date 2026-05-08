import { PrismaClient } from "@prisma/client";

async function promote() {
  const prisma = new PrismaClient();
  const email = "karthanvenkateshvenkatesh@gmail.com";
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" }
    });
    console.log("Successfully promoted:", user.email, "to ADMIN role.");
  } catch (error) {
    console.error("Failed to promote user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

promote();
