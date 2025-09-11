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
      <Footer />
    </div>
  );
};

export default Index;
