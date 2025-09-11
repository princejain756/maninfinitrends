import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SeoHead } from '@/components/Seo/SeoHead';
import { Truck, RotateCcw, MapPin, Clock, Package, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const ShippingReturns = () => {
  const shippingOptions = [
    {
      icon: Truck,
      title: "Standard Delivery",
      description: "Reliable shipping across India",
      time: "2-7 business days",
      cost: "₹99",
      freeThreshold: "Free on orders ₹999+",
      features: ["Doorstep delivery", "SMS/Email tracking", "Secure packaging"]
    },
    {
      icon: Package,
      title: "Express Delivery",
      description: "Fast delivery for urgent needs",
      time: "1-3 business days",
      cost: "₹199",
      freeThreshold: "Free on orders ₹2499+",
      features: ["Priority handling", "Real-time tracking", "Dedicated support"]
    },
    {
      icon: MapPin,
      title: "Local Delivery",
      description: "Same-day delivery in select cities",
      time: "Same day (before 2 PM)",
      cost: "₹149",
      freeThreshold: "Free on orders ₹1499+",
      features: ["Order before 12 PM", "Dedicated courier", "Instant updates"]
    }
  ];

  const returnProcess = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Contact our customer service or use the return portal",
      icon: RotateCcw,
      time: "Within 7 days"
    },
    {
      step: 2,
      title: "Schedule Pickup",
      description: "We'll arrange free pickup from your doorstep",
      icon: Truck,
      time: "1-2 business days"
    },
    {
      step: 3,
      title: "Quality Check",
      description: "Our team inspects the returned item",
      icon: CheckCircle,
      time: "2-3 business days"
    },
    {
      step: 4,
      title: "Refund Processed",
      description: "Refund credited to your original payment method",
      icon: RefreshCw,
      time: "3-5 business days"
    }
  ];

  return (
    <>
      <SeoHead
        title="Shipping & Returns | Maninfini Trends"
        description="Free shipping over ₹999. Easy 7-day returns. Track your orders and manage returns with our comprehensive shipping policy."
        canonicalPath="/shipping-returns"
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/30">
    <Header />

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.img
                  src="/logo.png"
                  alt="Maninfini Trends"
                  className="h-24 md:h-32 lg:h-40 mx-auto object-contain drop-shadow-2xl"
                  animate={{
                    filter: [
                      "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
                      "drop-shadow(0 30px 60px rgba(0,0,0,0.1))",
                      "drop-shadow(0 20px 40px rgba(0,0,0,0.2))"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{
                    scale: 1.08,
                    rotate: 2,
                    filter: "brightness(1.15) drop-shadow(0 35px 70px rgba(0,0,0,0.25))"
                  }}
                />
              </motion.div>

              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Truck className="w-4 h-4 mr-2" />
                Shipping & Returns
              </Badge>

              <h1 className="text-4xl md:text-6xl font-cormorant font-medium mb-6">
                <span className="text-display">Shipping</span>
                <br />
                <span className="text-luxury">& Returns</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Fast, reliable shipping with hassle-free returns. We make it easy for you to shop with confidence
                and receive exactly what you love.
              </p>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Free shipping over ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span>7-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Secure packaging</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Shipping Options */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Shipping Options
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose the delivery option that best fits your needs. All orders are carefully packaged
                and tracked from dispatch to delivery.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {shippingOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-premium h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <option.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div>{option.title}</div>
                          <div className="text-sm font-normal text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Delivery Time:</span>
                        <Badge variant="outline">{option.time}</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Shipping Cost:</span>
                        <div className="text-right">
                          <div className="font-medium">{option.cost}</div>
                          <div className="text-xs text-muted-foreground">{option.freeThreshold}</div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <h4 className="font-medium mb-3">What's Included:</h4>
                        <ul className="space-y-2">
                          {option.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Easy Return Process
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We're committed to your satisfaction. Our hassle-free return process ensures you can shop
                with confidence and return items that don't meet your expectations.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {returnProcess.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Card className="card-premium">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <step.icon className="w-6 h-6 text-primary" />
                      </div>

                      <div className="text-2xl font-bold text-primary mb-2">
                        {step.step}
                      </div>

                      <h3 className="text-lg font-cormorant font-medium mb-2">
                        {step.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3">
                        {step.description}
                      </p>

                      <Badge variant="outline" className="text-xs">
                        {step.time}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

        {/* Return Policy Details */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Return Policy Details
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Understand what qualifies for returns and how the process works.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="card-glass">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-cormorant font-medium mb-4">
                      Eligible for Returns
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Items in original condition with tags attached</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Within 7 days of delivery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Original packaging and accessories included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Valid proof of purchase</span>
                      </li>
          </ul>
                  </CardContent>
        </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="card-glass">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-cormorant font-medium mb-4">
                      Not Eligible for Returns
                    </h3>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>Items damaged due to misuse or normal wear</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>Custom or personalized items</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>Items without original tags or packaging</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-1">•</span>
                        <span>Beyond 7-day return window</span>
                      </li>
          </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Card className="card-glass bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-medium mb-4">
                    Need Help with Shipping or Returns?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Our customer service team is here to help with any questions about your order,
                    shipping status, or return process. We're committed to making your shopping experience exceptional.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="text-sm text-muted-foreground">
                      Email: support@maninfini.in
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Phone: +91 98765 43210
                    </div>
                    <div className="text-sm text-muted-foreground">
                      WhatsApp: +91 98765 43210
                    </div>
                  </div>
                </CardContent>
        </Card>
            </motion.div>
      </div>
        </section>

    <Footer />
  </div>
    </>
);
};

export default ShippingReturns;

