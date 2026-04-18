import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true }
  });
  console.log("ALL USERS:", users);

  const myUser = await prisma.user.findUnique({
    where: { email: 'karthanvenkateshvenkatesh@gmail.com' }
  });
  console.log("MY USER:", myUser);

  if (myUser) {
    const cards = await prisma.vCard.findMany({
      where: { userId: myUser.id }
    });
    console.log("MY CARDS:", cards.map(c => ({
      slug: c.slug,
      firstName: c.firstName,
      lastName: c.lastName,
      displayName: c.displayName
    })));
  }
}
main().finally(() => prisma.$disconnect());
