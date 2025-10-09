import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL, BRAND } from '@/config/seo';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title={`About ${BRAND} — Craft, Culture, Conscious Fashion`}
        description="Celebrating Indian craftsmanship with sustainable, modern design. Learn about our mission, materials, and makers."
        canonicalPath="/about"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${BRAND}`,
          url: `${BASE_URL}/about`,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` },
            ],
          },
        }}
      />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-16">
          <div className="max-w-6xl mx-auto px-4">
            <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="text-display text-4xl md:text-5xl mb-3">Our Ethereal Ethnic Story</motion.h1>
            <p className="text-lg text-muted-foreground max-w-2xl">From loom to love — we blend traditional craftsmanship with eco‑smart materials to craft pieces that feel as good as they look.</p>
            <div className="mt-6 flex gap-3">
              <Badge className="bg-accent text-accent-foreground">Handcrafted</Badge>
              <Badge className="bg-secondary text-secondary-foreground">Eco‑friendly</Badge>
              <Badge variant="outline">Women‑led</Badge>
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
          {[{
            title:'Craftsmanship',text:'Partnering with master artisans from Varanasi to Jaipur, each piece is thoughtfully made with time‑honored techniques.'
          },{title:'Materials',text:'We prioritize organic cotton, bamboo silk, and upcycled fibers, balancing comfort, durability, and sustainability.'},{title:'Impact',text:'Fair wages, small‑batch production, and transparent sourcing — because fashion should be kind to people and planet.'}].map((b,i)=>(
            <Card key={i} className="card-premium p-6">
              <h3 className="text-xl font-semibold mb-2">{b.title}</h3>
              <p className="text-muted-foreground">{b.text}</p>
            </Card>
          ))}
        </section>
        <section className="max-w-6xl mx-auto px-4 py-12">
          <Card className="card-glass p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold mb-2">Explore the Eco Collection</h3>
              <p className="text-muted-foreground">Discover pieces made with innovative, sustainable materials — from bamboo silk kurtis to coffee husk handbags.</p>
            </div>
            <Button className="btn-primary" onClick={()=>{window.location.href='/eco-collection'}}>
              Shop Eco Collection
            </Button>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

