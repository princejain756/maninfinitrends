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

  const sarees = await prisma.category.create({ data: { name: 'Sarees', slug: 'sarees' } });

  const p1 = await prisma.product.create({
    data: {
      slug: 'silk-saree-emerald',
      title: 'Emerald Silk Saree',
      description: 'Handwoven silk saree with intricate zari work.',
      images: { create: [{ url: '/images/saree1.jpg', alt: 'Emerald Silk Saree' }] },
      categories: { create: [{ categoryId: sarees.id }] },
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

