import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const faq = [
  { q: 'How do I measure bust/waist/hip?', a: 'Use a soft tape parallel to the floor. Bust at fullest part, waist at natural bend, hips at widest.' },
  { q: 'What if I’m between sizes?', a: 'Size up for comfort or check fabric stretch. Our chat can suggest fits.' },
];

const SizeGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Size Guide — Maninfini Trends" description="Find your perfect size with our simple charts and fit tips." canonicalPath="/size-guide" />
      <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Size Guide', url: `${BASE_URL}/size-guide` }} />
      <JsonLd data={{ '@context':'https://schema.org','@type':'FAQPage', mainEntity: faq.map(({q,a})=>({ '@type':'Question', name:q, acceptedAnswer:{ '@type':'Answer', text:a }})) }} />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-12">
          <div className="max-w-5xl mx-auto px-4">
            <h1 className="text-display text-4xl mb-2">Size & fit guide</h1>
            <p className="text-muted-foreground">Clear charts, easy measuring, and personalized help.</p>
          </div>
        </section>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Tabs defaultValue="kurtis">
            <TabsList>
              <TabsTrigger value="kurtis">Kurtis</TabsTrigger>
              <TabsTrigger value="salwars">Salwars</TabsTrigger>
              <TabsTrigger value="sarees">Sarees</TabsTrigger>
            </TabsList>
            <TabsContent value="kurtis">
              <Card className="p-6">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                  <div>Size</div><div>Bust (in)</div><div>Waist (in)</div>
                  {[
                    ['XS','32-33','26-27'],['S','34-35','28-29'],['M','36-37','30-31'],['L','38-40','32-34'],['XL','41-43','35-37'],['XXL','44-46','38-40']
                  ].map((r,i)=>(<><div key={`s-${i}`}>{r[0]}</div><div>{r[1]}</div><div>{r[2]}</div></>))}
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="salwars">
              <Card className="p-6">Use waist and hip. Choose length based on height.</Card>
            </TabsContent>
            <TabsContent value="sarees">
              <Card className="p-6">Sarees are free size; blouse piece included unless noted. See bust chart for blouse sizing.</Card>
            </TabsContent>
          </Tabs>
          <div className="mt-6 flex gap-3">
            <Button onClick={()=>window.dispatchEvent(new CustomEvent('mnf:chat-open',{ detail:{ step:'size' }}))} className="btn-primary">Find my size</Button>
            <Button variant="outline" onClick={()=>window.location.href='/care'}>Care & fabrics</Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SizeGuide;

