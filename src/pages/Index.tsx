import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Hero } from '@/components/Home/Hero';
import { FeaturedCollections } from '@/components/Home/FeaturedCollections';
import { NewArrivals } from '@/components/Home/NewArrivals';
import { EcoSpotlight } from '@/components/Home/EcoSpotlight';
import { Bestsellers } from '@/components/Home/Bestsellers';
import { RepairsTeaser } from '@/components/Home/RepairsTeaser';
import { Testimonials } from '@/components/Home/Testimonials';
import { Newsletter } from '@/components/Home/Newsletter';
import { InstagramFeed } from '@/components/Home/InstagramFeed';
import SeoHead from '@/components/Seo/SeoHead';
import { CartSidebar } from '@/components/Cart/CartSidebar';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead canonicalPath="/" />
      <Header />
      <main>
        <Hero />
        <FeaturedCollections />
        <NewArrivals />
        <EcoSpotlight />
        <Bestsellers />
        <RepairsTeaser />
        <Testimonials />
        <Newsletter />
        <InstagramFeed />
      </main>
      {/* Global cart for Home so quick-add opens immediately */}
      <CartSidebar />
      <Footer />
    </div>
  );
};

export default Index;
