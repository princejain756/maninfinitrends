import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function extract(desc: string | null | undefined) {
  if (!desc) return { description: '', meta: null as null | any };
  const m = desc.match(/<!--META[\r\n]+([\s\S]*?)[\r\n]+META-->/i);
  if (!m) return { description: desc, meta: null };
  try {
    const meta = JSON.parse(m[1]);
    const clean = desc.replace(m[0], '').trim();
    return { description: clean, meta };
  } catch {
    return { description: desc, meta: null };
  }
}

async function main() {
  const products = await prisma.product.findMany({ take: 1000 });
  for (const p of products) {
    const { description, meta } = extract(p.description || '');
    if (!meta && p.care && p.seoTitle) continue; // likely already migrated
    const data: any = {};
    if (meta) {
      if (!p.care && Array.isArray(meta.care)) data.care = meta.care.map((s: any)=>String(s));
      if (!p.seoTitle && meta.seo?.title) data.seoTitle = String(meta.seo.title);
      if (!p.seoDescription && meta.seo?.description) data.seoDescription = String(meta.seo.description);
      if (!p.seoKeywords && Array.isArray(meta.seo?.keywords)) data.seoKeywords = meta.seo.keywords.join(', ');
    }
    if (p.description && p.description !== description && description) data.description = description;
    if (Object.keys(data).length) {
      await prisma.product.update({ where: { id: p.id }, data });
      console.log(`Migrated ${p.slug}`);
    }
  }
}

main().then(()=>prisma.$disconnect()).catch((e)=>{ console.error(e); prisma.$disconnect(); process.exit(1); });

