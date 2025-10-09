import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Coffee, CheckCircle, ArrowRight } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/config/seo';

const CoffeeHusk = () => {
  const href = '/shop/eco?q=coffee%20husk';

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Coffee Husk Products — Minimal Eco Materials"
        description="Upcycled coffee husk accessories with rich, natural textures. Minimal and sustainable."
        canonicalPath="/eco/coffee-husk"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Coffee Husk Products',
          url: `${BASE_URL}/eco/coffee-husk`,
        }}
      />
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20 text-sm font-medium mb-4">
                <Coffee className="h-4 w-4 text-accent" />
                <span className="text-accent">Eco Material</span>
              </div>
              <h1 className="text-display text-4xl font-semibold">Coffee Husk Products</h1>
              <p className="text-muted-foreground mt-3">Upcycled waste turned into durable everyday essentials.</p>
            </div>

            <Card className="p-6 max-w-3xl mx-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {['Upcycled Waste', 'Natural Aroma', 'Durable', 'Water Resistant'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full">
                <Link to={href} aria-label="Explore Coffee Husk Products">
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

export default CoffeeHusk;

