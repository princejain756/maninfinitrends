import { Header } from '@/components/Layout/Header';
import { Hero } from '@/components/Home/Hero';
import { FeaturedCollections } from '@/components/Home/FeaturedCollections';
import { NewArrivals } from '@/components/Home/NewArrivals';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedCollections />
        <NewArrivals />
      </main>
    </div>
  );
};

export default Index;
