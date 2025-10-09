import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setIsSubscribed(false);
      }, 3000);
    }
  };

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Card className="card-premium overflow-hidden relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--accent)) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)`
            }} />
          </div>

          <div className="relative p-8 lg:p-16 text-center">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20 text-sm font-medium mb-6">
                <Gift className="h-4 w-4 text-accent" />
                <span className="text-accent">Exclusive Offer</span>
              </div>
              
              <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
                Join Our Style Circle
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Be the first to discover new arrivals, exclusive collections, and sustainable fashion insights. 
                Plus, get ₹200 off your first order!
              </p>
            </motion.div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                {
                  icon: '🎁',
                  title: '₹200 Welcome Bonus',
                  description: 'Instant discount on your first purchase'
                },
                {
                  icon: '✨',
                  title: 'Early Access',
                  description: 'Shop new collections before anyone else'
                },
                {
                  icon: '💝',
                  title: 'Exclusive Offers',
                  description: 'Member-only sales and special prices'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-3">{benefit.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </motion.div>

            {/* Subscription Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-md mx-auto"
            >
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 px-4 bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="btn-accent h-12 px-8 whitespace-nowrap"
                      disabled={!email}
                    >
                      Get ₹200 Off
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By subscribing, you agree to our{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> and{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to the Family!</h3>
                  <p className="text-muted-foreground mb-4">
                    Check your email for your ₹200 discount code
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Confirmation sent
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-background"
                    />
                  ))}
                </div>
                <span>5,000+ subscribers</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <span className="hidden sm:inline">No spam, unsubscribe anytime</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};