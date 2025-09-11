import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { useParams, Navigate } from 'react-router-dom';
import { collections, products } from '@/data/products';
import { ProductCard } from '@/components/Product/ProductCard';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const Collection = () => {
  const { handle } = useParams();
  const found = collections.find((c) => c.handle === handle);

  // If not a collection, redirect to category in Shop
  if (!found && handle) return <Navigate to={`/shop/${handle}`} replace />;
  if (!found) return null;

  const prods = products.filter((p) => found.productIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={`${found.title} — Maninfini Trends`} description={found.seo?.description || found.description} canonicalPath={`/collections/${found.handle}`} />
      <JsonLd data={{ '@context':'https://schema.org','@type':'CollectionPage', name: found.title, url: `${BASE_URL}/collections/${found.handle}` }} />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-display text-4xl mb-2">{found.title}</h1>
            <p className="text-muted-foreground">{found.description}</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {prods.map((p) => (
              <Card key={p.id} className="card-premium">
                <ProductCard product={p} viewMode="grid" />
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Collection;

