import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'trendsadmin';
  const passwordPlain = 'trendsa1asf3#4134';
  const email = 'admin@example.com';

  const password = await bcrypt.hash(passwordPlain, 10);

  const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { username, email, password, role: 'ADMIN' } });
    console.log('Admin user updated');
  } else {
    await prisma.user.create({ data: { username, email, password, role: 'ADMIN' } });
    console.log('Admin user created');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

