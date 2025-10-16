import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { useParams } from 'react-router-dom';
import { ProductCard } from '@/components/Product/ProductCard';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';
import { useEffect, useState } from 'react';
import { fetchAllProducts } from '@/lib/productsApi';

const Collection = () => {
  const { handle } = useParams();
  const [title, setTitle] = useState<string>('Collection');
  const [description, setDescription] = useState<string>('');
  const [prods, setProds] = useState<import('@/types/product').Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAllProducts()
      .then((all) => {
        if (!mounted) return;
        const list = handle ? all.filter((p) => p.category === handle) : all;
        setProds(list);
        setTitle(handle ? handle.replace(/-/g, ' ') : 'Collection');
        setDescription(handle ? `Products in ${handle}` : 'All products');
        setLoading(false);
      })
      .catch((e) => {
        if (!mounted) return;
        setError(e?.message || 'Failed to load');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [handle]);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead title={`${title} — Maninfini Trends`} description={description} canonicalPath={`/collections/${handle}`} />
      <JsonLd data={{ '@context':'https://schema.org','@type':'CollectionPage', name: title, url: `${BASE_URL}/collections/${handle}` }} />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-12">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-display text-4xl mb-2 capitalize">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10">
          {loading && <div className="text-center text-muted-foreground py-8">Loading…</div>}
          {error && <div className="text-center text-red-600 py-8">{error}</div>}
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
