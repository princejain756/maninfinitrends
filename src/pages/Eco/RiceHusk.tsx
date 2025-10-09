import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wheat, CheckCircle, ArrowRight } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { Link } from 'react-router-dom';
import { BASE_URL } from '@/config/seo';

const RiceHusk = () => {
  const href = '/shop/eco?q=rice%20husk';

  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Rice Husk Range — Minimal Eco Materials"
        description="Elegant homeware made from rice husk bio-composites. Minimal, heat‑resistant and long‑lasting."
        canonicalPath="/eco/rice-husk"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Rice Husk Range',
          url: `${BASE_URL}/eco/rice-husk`,
        }}
      />
      <Header />
      <main className="pt-20">
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-sm font-medium mb-4">
                <Wheat className="h-4 w-4 text-primary" />
                <span className="text-primary">Eco Material</span>
              </div>
              <h1 className="text-display text-4xl font-semibold">Rice Husk Range</h1>
              <p className="text-muted-foreground mt-3">Zero-waste products with a natural matte finish.</p>
            </div>

            <Card className="p-6 max-w-3xl mx-auto">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {['Zero Waste', 'Natural Finish', 'Heat Resistant', 'Long Lasting'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button asChild className="w-full">
                <Link to={href} aria-label="Explore Rice Husk Products">
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

export default RiceHusk;

