import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const toTitleCase = (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());

async function main() {
  const cats = await prisma.category.findMany();
  for (const c of cats) {
    const name = toTitleCase(c.name);
    if (name !== c.name) {
      await prisma.category.update({ where: { id: c.id }, data: { name } });
      console.log(`Updated: ${c.slug} -> ${name}`);
    }
  }
}

main().then(()=>prisma.$disconnect()).catch((e)=>{ console.error(e); prisma.$disconnect(); process.exit(1); });

