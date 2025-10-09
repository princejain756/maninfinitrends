import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Leaf, CheckCircle, ArrowRight } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/config/seo';

const Bamboo = () => {
  const href = '/shop/eco?q=bamboo';

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Bamboo Collection — Minimal Eco Materials"
        description="Naturally antibacterial and biodegradable bamboo-based products. Explore minimal, sustainable essentials."
        canonicalPath="/eco/bamboo"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Bamboo Collection',
          url: `${BASE_URL}/eco/bamboo`,
        }}
      />
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 text-sm font-medium mb-4">
                <Leaf className="h-4 w-4 text-secondary" />
                <span className="text-secondary">Eco Material</span>
              </div>
              <h1 className="text-display text-4xl font-semibold">Bamboo Collection</h1>
              <p className="text-muted-foreground mt-3">Naturally antibacterial, breathable and biodegradable.</p>
            </div>

            <Card className="p-6 max-w-3xl mx-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {['100% Biodegradable', 'Antibacterial', 'UV Resistant', 'Moisture Wicking'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full">
                <Link to={href} aria-label="Explore Bamboo Products">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Bamboo;

