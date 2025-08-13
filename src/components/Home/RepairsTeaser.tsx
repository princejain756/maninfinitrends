import { motion } from 'framer-motion';
import { Wrench, Clock, Award, ArrowRight, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const services = [
  'Saree hemming & alterations',
  'Jewellery stone setting',
  'Clasp & chain repairs',
  'Zipper replacements',
  'Lining repairs',
  'Restoration of vintage pieces'
];

export const RepairsTeaser = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 text-sm font-medium mb-6">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-primary">Expert Care</span>
          </div>
          
          <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
            Repairs & Restoration
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Give your cherished pieces new life with our expert repair and restoration services. 
            Our skilled artisans handle everything from delicate saree alterations to intricate jewellery repairs.
          </p>

          {/* Services List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-sm text-foreground">{service}</span>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="btn-primary">
              Book a Repair
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="bg-card/80 backdrop-blur-sm">
              Get WhatsApp Estimate
              <Phone className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Visual Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="card-premium p-8 bg-gradient-to-br from-card to-muted/30">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-display text-xl font-semibold text-foreground mb-2">
                Professional Service
              </h3>
              <p className="text-muted-foreground text-sm">
                Licensed & insured repair specialists
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">24hrs</div>
                <div className="text-xs text-muted-foreground">Estimate Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs text-muted-foreground">Items Restored</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">98%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">5★</div>
                <div className="text-xs text-muted-foreground">Avg Rating</div>
              </div>
            </div>

            {/* Process */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground text-center mb-4">How It Works</h4>
              {[
                { step: 1, text: 'Share photos & description' },
                { step: 2, text: 'Get estimate on WhatsApp' },
                { step: 3, text: 'Schedule pickup' },
                { step: 4, text: 'Expert restoration' },
                { step: 5, text: 'Doorstep delivery' }
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                    {item.step}
                  </div>
                  <span className="text-sm text-foreground">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Quick turnaround</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Free pickup</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>Guaranteed quality</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};