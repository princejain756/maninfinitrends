import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const UPLOADS_DIR = path.resolve(process.cwd(), 'dist/uploads');

async function main() {
    const files = fs.readdirSync(UPLOADS_DIR);
    const productImages: Record<string, string[]> = {};

    // Group files by product name
    for (const file of files) {
        if (!file.endsWith('.webp')) continue;

        // Normalize name: "art canvas tote bag1.webp" -> "art canvas tote bag"
        let productName = file.replace(/\.webp$/, '')
            .replace(/\d+$/, '')
            .replace(/\s\(\d+\)$/, '')
            .trim();

        if (!productImages[productName]) {
            productImages[productName] = [];
        }
        productImages[productName].push(file);
    }

    const categoryMap: Record<string, string> = {
        'saree': 'sarees',
        'potli': 'accessories',
        'tote': 'accessories',
        'handbag': 'accessories',
        'sling': 'accessories',
        'purse': 'accessories',
        'pouch': 'accessories',
        'mat': 'kitchen',
        'pillow': 'accessories',
        'strap': 'accessories',
    };

    const catBySlug: Record<string, string> = {};
    const categorySlugs = ['sarees', 'accessories', 'kitchen', 'home-decor', 'eco-collection'];

    for (const slug of categorySlugs) {
        const name = slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
        const cat = await prisma.category.upsert({
            where: { slug },
            update: {},
            create: { slug, name }
        });
        catBySlug[slug] = cat.id;
    }

    console.log(`Found ${Object.keys(productImages).length} products to seed.`);

    for (const [name, imgs] of Object.entries(productImages)) {
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Determine category
        let catSlug = 'accessories';
        for (const [key, slugValue] of Object.entries(categoryMap)) {
            if (name.toLowerCase().includes(key)) {
                catSlug = slugValue;
                break;
            }
        }

        const catId = catBySlug[catSlug];
        console.log(`Seeding: ${name} (Category: ${catSlug})`);

        try {
            await prisma.product.upsert({
                where: { slug },
                update: {},
                create: {
                    slug,
                    title: name.charAt(0).toUpperCase() + name.slice(1),
                    description: `High-quality ${name}. Handcrafted with care and premium materials. Perfect for adding a touch of elegance to your style.`,
                    images: {
                        create: imgs.map(img => ({
                            url: `/uploads/${img}`,
                            alt: name
                        }))
                    },
                    categories: {
                        create: {
                            category: { connect: { id: catId } }
                        }
                    },
                    variants: {
                        create: {
                            sku: `PROD-${slug.slice(0, 5).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
                            name: 'Standard',
                            priceCents: (500 + Math.floor(Math.random() * 2000)) * 100,
                            currency: 'INR',
                            inventory: {
                                create: { quantity: 10 + Math.floor(Math.random() * 50) }
                            }
                        }
                    }
                }
            });
        } catch (err) {
            console.error(`Failed to seed ${name}:`, err);
        }
    }

    console.log('Seeding complete.');
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
