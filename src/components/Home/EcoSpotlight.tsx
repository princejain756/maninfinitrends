import { motion } from 'framer-motion';
import { Leaf, Coffee, Wheat, ArrowRight, CheckCircle, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ecoMaterials = [
  {
    id: 'bamboo',
    title: 'Bamboo Collection',
    subtitle: 'Naturally antibacterial & biodegradable',
    description: 'Soft, breathable fabrics made from sustainable bamboo fibers. Naturally moisture-wicking and hypoallergenic.',
    icon: Leaf,
    color: 'secondary',
    features: ['100% Biodegradable', 'Antibacterial', 'UV Resistant', 'Moisture Wicking'],
    impact: 'Grows 30x faster than cotton',
    // Minimal UX: send to shop filtered by eco + bamboo search
    href: '/shop/eco?q=bamboo'
  },
  {
    id: 'coffee',
    title: 'Coffee Husk Products',
    subtitle: 'Upcycled coffee waste innovation',
    description: 'Unique accessories crafted from coffee husks, giving new life to agricultural waste with rich, natural textures.',
    icon: Coffee,
    color: 'accent',
    features: ['Upcycled Waste', 'Natural Aroma', 'Durable', 'Water Resistant'],
    impact: 'Reduces 1000kg waste per year',
    href: '/shop/eco?q=coffee%20husk'
  },
  {
    id: 'rice',
    title: 'Rice Husk Range',
    subtitle: 'Agricultural waste to beautiful products',
    description: 'Home accents and accessories made from rice husks, transforming farm waste into elegant, sustainable products.',
    icon: Wheat,
    color: 'primary',
    features: ['Zero Waste', 'Natural Finish', 'Heat Resistant', 'Long Lasting'],
    impact: 'Prevents 500kg farm burning',
    href: '/shop/eco?q=rice%20husk'
  }
];

export const EcoSpotlight = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20 text-sm font-medium mb-6">
          <Leaf className="h-4 w-4 text-secondary" />
          <span className="text-secondary">Sustainable Innovation</span>
        </div>
        
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          Eco-Smart Materials
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Discover our revolutionary eco-friendly collection, where agricultural waste becomes beautiful, 
          sustainable fashion. Each piece tells a story of environmental responsibility and conscious luxury.
        </p>
      </motion.div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
        {ecoMaterials.map((material, index) => {
          const Icon = material.icon;
          
          return (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                ease: "easeOut"
              }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Card className="card-premium overflow-hidden h-full relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full" style={{
                    backgroundImage: `radial-gradient(circle at 30% 40%, hsl(var(--${material.color})) 0%, transparent 50%),
                                     radial-gradient(circle at 80% 80%, hsl(var(--${material.color})) 0%, transparent 50%)`
                  }} />
                </div>

                <div className="relative p-8">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-2xl bg-${material.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`h-8 w-8 text-${material.color}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-display text-xl font-semibold text-foreground mb-2">
                    {material.title}
                  </h3>
                  <p className={`text-sm font-medium text-${material.color} mb-4`}>
                    {material.subtitle}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {material.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {material.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Impact Badge */}
                  <div className={`bg-${material.color}/10 border border-${material.color}/20 rounded-xl p-3 mb-6`}>
                    <div className="flex items-center gap-2">
                      <Star className={`h-4 w-4 text-${material.color}`} />
                      <span className="text-sm font-medium text-foreground">Environmental Impact</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{material.impact}</p>
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    <Link to={material.href} aria-label={`Explore ${material.title}`}>
                      Explore Collection
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-8 max-w-4xl mx-auto">
          <h3 className="text-display text-2xl font-semibold text-foreground mb-4">
            Join the Sustainability Movement
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every purchase supports sustainable practices and helps reduce agricultural waste. 
            Together, we're creating a more eco-conscious future for fashion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="btn-secondary">
              <Link to="/collections/eco-collection" aria-label="View Eco Collection">
              View Full Eco Collection
              <Leaf className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-card/80 backdrop-blur-sm">
              <Link to="/about" aria-label="Learn About Our Process">
                Learn About Our Process
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
