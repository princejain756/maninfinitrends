import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const Track = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Track Your Order — Maninfini Trends" description="Check your order status with your Order ID and email/phone." canonicalPath="/track" />
      <JsonLd data={{ '@context':'https://schema.org','@type':'WebPage', name:'Track Order', url: `${BASE_URL}/track` }} />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-display text-4xl mb-2">Track your order</h1>
            <p className="text-muted-foreground">Get real‑time updates on dispatch and delivery.</p>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 py-10">
          <Card className="card-premium p-6 space-y-4">
            <Input placeholder="Order ID (e.g., MNF12345)" />
            <Input placeholder="Email or Phone" />
            <Button className="btn-primary w-full"><Truck className="h-4 w-4 mr-2"/>Track</Button>
            <p className="text-xs text-muted-foreground">Need help? <button className="underline" onClick={()=>window.dispatchEvent(new CustomEvent('mnf:chat-open'))}>Chat with us</button>.</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Track;

