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
import ErrorBoundary from '@/components/util/ErrorBoundary';

const SectionGuard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <ErrorBoundary fallback={<div style={{padding:16,color:'#b91c1c'}}>Section failed: {label}</div>}>
    {children}
  </ErrorBoundary>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead canonicalPath="/" />
      <Header />
      <main>
        <SectionGuard label="Hero"><Hero /></SectionGuard>
        <SectionGuard label="FeaturedCollections"><FeaturedCollections /></SectionGuard>
        <SectionGuard label="NewArrivals"><NewArrivals /></SectionGuard>
        <SectionGuard label="EcoSpotlight"><EcoSpotlight /></SectionGuard>
        <SectionGuard label="Bestsellers"><Bestsellers /></SectionGuard>
        <SectionGuard label="RepairsTeaser"><RepairsTeaser /></SectionGuard>
        <SectionGuard label="Testimonials"><Testimonials /></SectionGuard>
        <SectionGuard label="Newsletter"><Newsletter /></SectionGuard>
        <SectionGuard label="InstagramFeed"><InstagramFeed /></SectionGuard>
      </main>
      {/* Global cart for Home so quick-add opens immediately */}
      <CartSidebar />
      <Footer />
    </div>
  );
};

export default Index;
