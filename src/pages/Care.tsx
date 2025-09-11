import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const items = [
  { t:'Silk', d:'Dry clean only. Store in breathable cotton bag; avoid sunlight.' },
  { t:'Organic Cotton', d:'Machine wash cold, gentle cycle. Line dry in shade.' },
  { t:'Bamboo Silk', d:'Hand wash recommended. Do not wring; lay flat to dry.' },
];

const Care = () => (
  <div className="min-h-screen bg-background">
    <SeoHead title="Fabric Care — Maninfini Trends" description="Care instructions for silk, organic cotton, bamboo silk and more." canonicalPath="/care" />
    <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Care Instructions', url: `${BASE_URL}/care` }} />
    <JsonLd data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: items.map(i=>({ '@type':'Question', name:`How to care for ${i.t}?`, acceptedAnswer:{ '@type':'Answer', text:i.d }})) }} />
    <Header />
    <main className="pt-20">
      <section className="hero-gradient py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-display text-4xl mb-2">Care instructions</h1>
          <p className="text-muted-foreground">Keep your favorites beautiful for years to come.</p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Card className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {items.map((i,idx)=> (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger>{i.t}</AccordionTrigger>
                <AccordionContent>{i.d}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>
    </main>
    <Footer />
  </div>
);

export default Care;

