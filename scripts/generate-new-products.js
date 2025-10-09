// Node script to generate Product entries from assets folder
// Scans `src/assets/Maninfini new Products` and groups files into products
// Outputs: `src/data/new_products.generated.ts`

import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve('src/assets/Maninfini new Products');
const OUT_FILE = path.resolve('src/data/new_products.generated.ts');

const IMG_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MIN_FILE_SIZE_BYTES = 25 * 1024; // ~25KB
const MIN_SHORT_SIDE = 450; // px

function titleCase(str) {
  return str
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

function deriveBaseName(filename) {
  // Without extension
  let base = filename.replace(/\.[^.]+$/, '');

  // Remove bracketed bits like (2), (3), etc
  base = base.replace(/\s*\([^)]*\)/g, '');

  // Remove verbose suffixes starting with keywords like 'crafted', 'made', 'with', 'using'
  base = base.replace(/\s+(crafted|made|with|using)\b[\s\S]*$/i, '');

  // Collapse whitespace
  base = base.replace(/\s+/g, ' ').trim();

  return base;
}

function dropLeadingNumber(str) {
  return str.replace(/^\s*\d+\s+/, '').trim();
}

function leadingNumber(str) {
  const m = str.match(/^\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

function detectSubcategory(base) {
  const s = base.toLowerCase();
  if (s.includes('planter') || s.includes('pot') || s.includes('balcony')) return 'planters';
  if (s.includes('plate') || s.includes('bowl') || s.includes('tray') || s.includes('tortilla')) return 'tableware';
  if (s.includes('cup') || s.includes('tumbler') || s.includes('bottle') || s.includes('glass')) return 'drinkware';
  if (s.includes('spoon') || s.includes('fork') || s.includes('knife') || s.includes('cutlery')) return 'cutlery';
  if (s.includes('basket') || s.includes('box') || s.includes('storage') || s.includes('organizer')) return 'storage';
  if (s.includes('board') || s.includes('chopping') || s.includes('strainer') || s.includes('squeezer')) return 'kitchenware';
  return 'home';
}

function priceFor(sub, signalStr, fileCount) {
  const s = signalStr.toLowerCase();
  // Base price by subcategory
  let price = (() => {
    switch (sub) {
      case 'planters': return 799;
      case 'tableware': return 299;
      case 'drinkware': return 249;
      case 'cutlery': return 129;
      case 'storage': return 599;
      case 'serveware': return 699;
      case 'kitchenware': return 499;
      default: return 399;
    }
  })();

  // Size/feature signals
  const upsellSignals = [
    '6 partition', 'with lid', 'double', 'duo', 'pair', 'stand', 'set', 'xl', 'large', 'big', '3 tier', 'rack'
  ];
  const downsellSignals = ['mini', 'small', 'single'];
  const premiumSignals = ['embossed', 'textured', 'handmade', 'designer'];

  // Adjust for signals
  if (upsellSignals.some((t) => s.includes(t))) price += 200;
  if (premiumSignals.some((t) => s.includes(t))) price += 150;
  if (downsellSignals.some((t) => s.includes(t))) price -= 100;

  // More images -> likely variants/angles; small bump
  if (fileCount >= 4) price += 50;

  // Clamp sensible range
  price = Math.max(99, Math.min(price, 1999));
  // Round to 9 for INR pricing charm
  price = Math.round(price / 10) * 10 - 1;
  return price;
}

function compareAtFor(price, sub, signalStr) {
  const s = signalStr.toLowerCase();
  let pct = 0.2;
  if (['planters', 'storage', 'serveware', 'kitchenware'].includes(sub)) pct = 0.25;
  if (s.includes('with lid') || s.includes('set')) pct = 0.3;
  const cmp = Math.round(price * (1 + pct));
  // Round to nearest 9 again
  return Math.round(cmp / 10) * 10 - 1;
}

function assetUrlLiteral(filename) {
  // We output a TS expression using Vite new URL loader
  const rel = `@/assets/Maninfini new Products/${filename}`;
  return `new URL('${rel}', import.meta.url).href`;
}

async function generate() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error('Assets directory not found:', ASSETS_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(ASSETS_DIR)
    .filter((f) => IMG_EXTS.has(path.extname(f).toLowerCase()));

  const groups = new Map(); // key: slug, value: { base, files: Set }

  // First pass: decide when to ignore leading numbers by detecting siblings with same remainder
  const restMap = new Map(); // rest -> { bases: Set<string>, numbers: Set<number|null> }
  for (const f of files) {
    const base = deriveBaseName(f);
    const rest = dropLeadingNumber(base);
    if (!restMap.has(rest)) restMap.set(rest, { bases: new Set(), numbers: new Set() });
    restMap.get(rest).bases.add(base);
    restMap.get(rest).numbers.add(leadingNumber(base));
  }
  const normalizeRest = new Set();
  for (const [rest, info] of restMap) {
    if (info.bases.size >= 2) {
      // multiple variants same remainder => treat leading number as sequence indicator
      normalizeRest.add(rest);
    }
  }

  // Second pass: group by either base or remainder (without leading number) if normalizeRest
  const keyToGroup = (f) => {
    const base = deriveBaseName(f);
    const rest = dropLeadingNumber(base);
    return normalizeRest.has(rest) ? rest : base;
  };

  for (const f of files) {
    const groupBase = keyToGroup(f);
    const slug = slugify(groupBase);
    if (!slug) continue;
    if (!groups.has(slug)) {
      groups.set(slug, { base: groupBase, files: new Set() });
    }
    groups.get(slug).files.add(f);
  }

  const today = new Date().toISOString();

  // lazy import to keep runtime light when not used
  const { default: imageSizeDefault, imageSize: imageSizeNamed } = await import('image-size');
  const imageSize = imageSizeNamed || imageSizeDefault;

  function isGoodImage(filename) {
    try {
      const p = path.join(ASSETS_DIR, filename);
      const st = fs.statSync(p);
      if (!st.isFile()) return false;
      if (st.size < MIN_FILE_SIZE_BYTES) return false;
      const dim = imageSize(p);
      if (!dim || !dim.width || !dim.height) return false;
      const shortSide = Math.min(dim.width, dim.height);
      return shortSide >= MIN_SHORT_SIDE;
    } catch (e) {
      return false;
    }
  }

  const productBlocks = [];
  for (const [slug, { base, files: fset }] of groups) {
    const title = titleCase(slug.replace(/-/g, ' '));
    const subcategory = detectSubcategory(base);
    const fileListAll = Array.from(fset);
    const filteredGood = fileListAll.filter(isGoodImage);
    if (filteredGood.length === 0) {
      // Skip product if nothing passes quality gates
      continue;
    }
    const signalStr = (base + ' ' + fileListAll.join(' ')).toLowerCase();
    const price = priceFor(subcategory, signalStr, fileListAll.length);
    const compareAt = compareAtFor(price, subcategory, signalStr);
    const id = `eco-${slug}`;
    const sku = `ECO-${slug.toUpperCase().replace(/-/g, '')}`;

    // Select up to 6 images for brevity
    const fileList = filteredGood.slice(0, 6);
    const imagesLiteral = `[\n      ${fileList.map((fn) => assetUrlLiteral(fn)).join(',\n      ')}\n    ]`;

    const desc = `Eco-friendly ${title} made from bio-composite materials like rice husk and bamboo fiber.`;
    const shortDesc = `${title} (eco-friendly)`;

    const block = `{
    id: '${id}',
    title: '${title}',
    handle: '${slug}',
    sku: '${sku}',
    category: 'eco',
    subcategory: '${subcategory}',
    price: ${price},
    ${compareAt ? `compareAtPrice: ${compareAt},` : ''}
    taxRate: 0.05,
    stock: 50,
    images: ${imagesLiteral},
    description: '${desc.replace(/'/g, "\\'")}',
    shortDescription: '${shortDesc.replace(/'/g, "\\'")}',
    attributes: {
      material: 'Bio-composite (rice husk, bamboo fiber)',
      eco: 'Biodegradable, sustainable',
      care: '${subcategory === 'tableware' || subcategory === 'drinkware' ? 'Hand wash recommended, avoid harsh chemicals' : 'Wipe clean with damp cloth'}'
    },
    badges: ['eco-friendly', 'new-arrival'],
    relatedIds: [],
    reviews: { rating: 4.7, count: 18 },
    seo: {
      title: '${title} - Eco-Friendly Home & Living - Maninfini Trends',
      description: '${desc.replace(/'/g, "\\'")}',
      keywords: ['eco', '${subcategory}', '${title.replace(/'/g, "\\'")}', 'bio-composite']
    },
    createdAt: '${today}',
    updatedAt: '${today}'
  }`;
    productBlocks.push(block);
  }

  productBlocks.sort();

  const out = `// Auto-generated from assets in: ${ASSETS_DIR}\n` +
    `// Do not edit manually. Re-run scripts/generate-new-products.js to refresh.\n` +
    `import { Product } from '@/types/product';\n\n` +
    `export const generatedProducts: Product[] = [\n${productBlocks.map((b) => '  ' + b).join(',\n')}\n];\n`;

  fs.writeFileSync(OUT_FILE, out, 'utf8');
  console.log(`Generated ${productBlocks.length} products to`, OUT_FILE);
}

generate();
