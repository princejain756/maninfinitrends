import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES: { name: string; slug: string }[] = [
  { name: 'Sarees', slug: 'sarees' },
  { name: 'Eco Collection', slug: 'eco-collection' },
  { name: 'Kurtis', slug: 'kurtis' },
  { name: 'Indo-Western', slug: 'indo-western' },
  { name: 'Fabrics', slug: 'fabrics' },
  { name: 'Jewellery', slug: 'jewellery' },
];

async function main() {
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    console.log(`✔ Seeded category: ${c.name} (${c.slug})`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

