import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    review: 'The Banarasi saree I ordered exceeded my expectations! The silk quality is exceptional and the zari work is absolutely stunning. Perfect for my sister\'s wedding.',
    product: 'Royal Banarasi Silk Saree',
    date: '2 weeks ago',
    verified: true,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 2,
    name: 'Anita Patel',
    location: 'Bangalore, Karnataka',
    rating: 5,
    review: 'I love how Maninfini combines tradition with sustainability. The bamboo kurti is so comfortable and the craftsmanship is beautiful. Highly recommend!',
    product: 'Bamboo Silk Kurti Set',
    date: '1 month ago',
    verified: true,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 3,
    name: 'Meera Gupta',
    location: 'Delhi, NCR',
    rating: 5,
    review: 'Outstanding customer service! My kundan necklace needed repair and their restoration service was quick and professional. The piece looks brand new.',
    product: 'Heritage Kundan Choker',
    date: '3 weeks ago',
    verified: true,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 4,
    name: 'Kavya Reddy',
    location: 'Hyderabad, Telangana',
    rating: 5,
    review: 'The eco-collection is amazing! It\'s wonderful to see a brand that cares about the environment. The coffee husk bag is unique and beautifully made.',
    product: 'Coffee Husk Handbag',
    date: '1 week ago',
    verified: true,
    avatar: '/api/placeholder/60/60'
  },
  {
    id: 5,
    name: 'Sunita Singh',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    review: 'Fast delivery and beautiful packaging! The handblock print dress fits perfectly and the colors are vibrant. Will definitely order again.',
    product: 'Handblock Print Dress',
    date: '2 days ago',
    verified: true,
    avatar: '/api/placeholder/60/60'
  }
];

export const Testimonials = () => {
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
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-sm font-medium mb-6">
          <Star className="h-4 w-4 text-primary" />
          <span className="text-primary">Customer Love</span>
        </div>
        
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          What Our Customers Say
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust Maninfini Trends for premium ethnic wear, 
          sustainable fashion, and exceptional service.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
      >
        {[
          { value: '4.9', label: 'Average Rating', suffix: '/5' },
          { value: '10k+', label: 'Happy Customers', suffix: '' },
          { value: '98%', label: 'Satisfaction Rate', suffix: '' },
          { value: '2k+', label: 'Reviews', suffix: '' }
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {stat.value}
              <span className="text-lg text-muted-foreground">{stat.suffix}</span>
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            className="group"
          >
            <Card className="card-premium p-6 h-full relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote className="h-8 w-8 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review */}
              <blockquote className="text-foreground leading-relaxed mb-6 relative z-10">
                "{testimonial.review}"
              </blockquote>

              {/* Product */}
              <div className="text-sm text-primary font-medium mb-4">
                Purchased: {testimonial.product}
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <div 
                    className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-full"
                    style={{
                      backgroundImage: `url(${testimonial.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{testimonial.name}</span>
                    {testimonial.verified && (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.location} • {testimonial.date}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 text-center"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium text-foreground">Excellence Award</div>
            <div className="text-xs text-muted-foreground">Best Ethnic Wear 2023</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl mb-2">🌿</div>
            <div className="text-sm font-medium text-foreground">Eco Certified</div>
            <div className="text-xs text-muted-foreground">Sustainable Fashion</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl mb-2">🤝</div>
            <div className="text-sm font-medium text-foreground">Trusted Seller</div>
            <div className="text-xs text-muted-foreground">5+ Years Experience</div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-2xl mb-2">💎</div>
            <div className="text-sm font-medium text-foreground">Quality Assured</div>
            <div className="text-xs text-muted-foreground">Handcrafted Premium</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};