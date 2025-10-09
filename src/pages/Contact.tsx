import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import SeoHead from '@/components/Seo/SeoHead';
import JsonLd from '@/components/Seo/JsonLd';
import { BASE_URL } from '@/config/seo';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead title="Contact Support — Maninfini Trends" description="We’re here to help with sizing, orders, shipping and returns." canonicalPath="/contact" />
      <JsonLd data={{ '@context':'https://schema.org','@type':'ContactPage', name:'Contact Support', url: `${BASE_URL}/contact` }} />
      <Header />
      <main className="pt-20">
        <section className="hero-gradient py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-display text-4xl mb-2">We’d love to help</h1>
            <p className="text-muted-foreground">Sizing, orders, shipping, returns — ask us anything.</p>
          </div>
        </section>
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">
          <Card className="card-premium p-6 space-y-4">
            <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-primary" /><a href="mailto:manita4599@gmail.com" className="hover:underline">manita4599@gmail.com</a></div>
            <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary" /><span>+91 98765 43210 (9 AM – 7 PM IST)</span></div>
            <div className="flex items-start gap-3"><MapPin className="h-4 w-4 text-primary mt-1" /><span>Flat 3093, 10th Block, Janapriya Heavens, Allalasandra, Bangalore, 560065</span></div>
            <Button variant="outline" onClick={()=>window.dispatchEvent(new CustomEvent('mnf:chat-open'))}>Chat with us</Button>
          </Card>
          <Card className="card-glass p-6">
            <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
            <form className="space-y-3" onSubmit={(e)=>{e.preventDefault(); alert('Thanks! We will get back to you.')}}>
              <Input placeholder="Full name" required />
              <Input placeholder="Email" type="email" required />
              <Input placeholder="Phone" />
              <Textarea placeholder="How can we help?" rows={5} required />
              <Button type="submit" className="btn-primary"><Send className="h-4 w-4 mr-2"/>Send</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

