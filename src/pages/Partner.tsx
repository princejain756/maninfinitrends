import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const Partner = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Become a Partner — Maninfini Trends" description="Collaborate as reseller, influencer, or artisan partner." canonicalPath="/partner" />
    <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Become a Partner', url: `${BASE_URL}/partner` }} />
    <Header />
    <main className="pt-20">
      <section className="hero-gradient py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-display text-4xl mb-2">Partner with us</h1>
          <p className="text-muted-foreground">Let’s grow ethical fashion together.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        {[{t:'Resellers',d:'Curate and sell our bestsellers with preferred margins.'},{t:'Influencers',d:'Earn on every sale with tracked links and drops.'},{t:'Artisans',d:'Showcase your craft to a wider audience.'}].map((b,i)=>(
          <Card key={i} className="card-premium p-6">
            <h3 className="text-xl font-semibold mb-2">{b.t}</h3>
            <p className="text-muted-foreground mb-4">{b.d}</p>
            <Button variant="outline" onClick={()=>window.location.href='/contact'}>Apply</Button>
          </Card>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Partner;

