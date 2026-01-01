import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear all data for idempotent seed
  await prisma.orderItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  // Clear minimal tables for idempotent seed in dev
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productMaterial.deleteMany();
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
    { name: 'Accessories', slug: 'accessories' },
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
  // Add Accessories Products
  const accessoryProduct1 = await prisma.product.create({
    data: {
      slug: 'brown-velvet-potli-bag',
      title: 'Brown Velvet Potli Bag with Beaded Handle',
      description: 'Elegant brown velvet potli bag with intricate beaded handle. Perfect for weddings and festive occasions. Handcrafted with premium materials.',
      images: { create: [{ url: '/src/assets/icons/icons/Accesories.webp', alt: 'Brown Velvet Potli Bag' }] },
      categories: { create: [{ categoryId: catBySlug['accessories'].id }] },
      variants: {
        create: [
          { sku: 'BAG-001', name: 'Standard', priceCents: 129900, compareAtPriceCents: 169900, currency: 'INR' },
        ],
      },
    },
    include: { variants: true },
  });

  const accessoryProduct2 = await prisma.product.create({
    data: {
      slug: 'art-canvas-tote-bag',
      title: 'Art Canvas Tote Bag',
      description: 'Sustainable hand-painted canvas tote bag. Perfect for daily use and eco-conscious lifestyle.',
      images: { create: [{ url: '/src/assets/icons/icons/Accesories.webp', alt: 'Art Canvas Tote Bag' }] },
      categories: { create: [{ categoryId: catBySlug['accessories'].id }] },
      variants: {
        create: [
          { sku: 'BAG-002', name: 'Standard', priceCents: 89900, currency: 'INR' },
        ],
      },
    },
    include: { variants: true },
  });

  const accessoryProduct3 = await prisma.product.create({
    data: {
      slug: 'blue-brocade-designer-handbag',
      title: 'Blue Brocade Designer Handbag',
      description: 'Designer handbag with intricate brocade work. Perfect for weddings and special occasions.',
      images: { create: [{ url: '/src/assets/icons/icons/Accesories.webp', alt: 'Blue Brocade Designer Handbag' }] },
      categories: { create: [{ categoryId: catBySlug['accessories'].id }] },
      variants: {
        create: [
          { sku: 'BAG-003', name: 'Standard', priceCents: 159900, currency: 'INR' },
        ],
      },
    },
    include: { variants: true },
  });

  // Add inventory for accessories
  await prisma.inventory.create({ data: { variantId: accessoryProduct1.variants[0].id, quantity: 20 } });
  await prisma.inventory.create({ data: { variantId: accessoryProduct2.variants[0].id, quantity: 15 } });
  await prisma.inventory.create({ data: { variantId: accessoryProduct3.variants[0].id, quantity: 12 } });


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
