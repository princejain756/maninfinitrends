import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear minimal tables for idempotent seed in dev
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Seed default categories
  const categories = [
    { name: 'Sarees', slug: 'sarees' },
    { name: 'Eco Collection', slug: 'eco-collection' },
    { name: 'Kurtis', slug: 'kurtis' },
    { name: 'Indo-Western', slug: 'indo-western' },
    { name: 'Fabrics', slug: 'fabrics' },
    { name: 'Jewellery', slug: 'jewellery' },
    // Keep legacy ones that might already exist in some DBs
    { name: 'Drinkware', slug: 'drinkware' },
    { name: 'Kitchen', slug: 'kitchen' },
  ];

  const catBySlug: Record<string, { id: string; name: string; slug: string }> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catBySlug[c.slug] = created;
  }

  const p1 = await prisma.product.create({
    data: {
      slug: 'silk-saree-emerald',
      title: 'Emerald Silk Saree',
      description: 'Handwoven silk saree with intricate zari work.',
      images: { create: [{ url: '/images/saree1.jpg', alt: 'Emerald Silk Saree' }] },
      categories: { create: [{ categoryId: catBySlug['sarees'].id }] },
      variants: {
        create: [
          { sku: 'EMR-001', name: 'Standard', priceCents: 899900, currency: 'INR' },
        ],
      },
    },
    include: { variants: true },
  });

  await prisma.inventory.create({ data: { variantId: p1.variants[0].id, quantity: 10 } });

  console.log('Seed complete');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
