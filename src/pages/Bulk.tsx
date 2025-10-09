import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/Seo/SeoHead';
import { BASE_URL } from '@/config/seo';
import JsonLd from '@/components/Seo/JsonLd';

const Bulk = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Bulk Orders — Maninfini Trends" description="Corporate gifts, events, weddings — request bulk pricing and curation." canonicalPath="/bulk" />
    <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Bulk Orders', url: `${BASE_URL}/bulk` }} />
    <Header />
    <main className="pt-20">
      <section className="hero-gradient py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-display text-4xl mb-2">Bulk & corporate orders</h1>
          <p className="text-muted-foreground">Tailored catalogs, custom branding, and volume pricing.</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Card className="card-premium p-6 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <Input placeholder="Company / Name" required />
            <Input placeholder="Email" type="email" required />
            <Input placeholder="Phone" />
            <Input placeholder="Quantity (approx.)" />
          </div>
          <Textarea placeholder="Tell us about your needs (timeline, styles, budget)" rows={5} />
          <Button className="btn-primary">Request quote</Button>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default Bulk;

