import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import { BASE_URL } from '@/config/seo';
import JsonLd from '@/components/Seo/JsonLd';

const steps = ['Share issue & photos','Get quote & timeline','Ship to us','Repair & QA','Ship back'];

const Repairs = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Repairs & Restoration — Maninfini Trends" description="Expert repairs for beloved pieces — embroidery fixes, replating, clasp repairs and more." canonicalPath="/repairs" />
    <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Repairs & Restoration', url: `${BASE_URL}/repairs` }} />
    <Header />
    <main className="pt-20">
      <section className="hero-gradient py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-display text-4xl mb-2">Repairs & restoration</h1>
          <p className="text-muted-foreground">Give your favorites a second life.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-5 gap-4">
        {steps.map((s,i)=>(
          <Card key={i} className="p-4 text-center">
            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-semibold">{i+1}</span></div>
            <div className="text-sm font-medium">{s}</div>
          </Card>
        ))}
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-14">
        <Card className="card-glass p-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-1">Request a repair</h3>
            <p className="text-muted-foreground">Share photos and get a quote within 24–48 hours.</p>
          </div>
          <Button className="btn-primary" onClick={()=>window.location.href='/contact'}><Wrench className="h-4 w-4 mr-2"/>Start</Button>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default Repairs;

