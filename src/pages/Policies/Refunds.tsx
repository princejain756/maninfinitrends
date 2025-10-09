import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeoHead } from '@/components/Seo/SeoHead';
import { RefreshCw, Clock, CreditCard, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';

const Refunds = () => {
  const refundScenarios = [
    {
      title: "Product Not Received",
      description: "Order shows delivered but you haven't received it",
      process: [
        "Contact our support team within 7 days of delivery date",
        "Provide order number and delivery tracking information",
        "We'll investigate with our courier partner",
        "Full refund processed if delivery cannot be confirmed"
      ],
      timeline: "3-5 business days after investigation",
      eligible: true
    },
    {
      title: "Damaged or Defective Item",
      description: "Product arrived damaged or has manufacturing defects",
      process: [
        "Contact support with photos of the damaged item",
        "We'll arrange free return pickup or replacement",
        "Quality check performed at our warehouse",
        "Full refund or replacement provided based on your preference"
      ],
      timeline: "5-7 business days after return receipt",
      eligible: true
    },
    {
      title: "Wrong Item Received",
      description: "You received a different product than ordered",
      process: [
        "Contact support immediately with order details and photos",
        "We'll arrange immediate replacement or refund",
        "No return shipping required",
        "Correct item shipped at our expense"
      ],
      timeline: "2-3 business days after confirmation",
      eligible: true
    },
    {
      title: "Size/Fit Issues",
      description: "Item doesn't fit as expected",
      process: [
        "Contact support within 7 days of delivery",
        "We'll arrange free return pickup",
        "Item must be unused with original tags",
        "Exchange for different size or full refund"
      ],
      timeline: "3-5 business days after return receipt",
      eligible: true
    }
  ];

  const refundMethods = [
    {
      icon: CreditCard,
      method: "Credit/Debit Cards",
      description: "UPI, Net Banking, Wallets",
      timeline: "3-5 business days",
      notes: "Refund processed through Razorpay to original payment method"
    },
    {
      icon: DollarSign,
      method: "Cash on Delivery",
      description: "COD Orders",
      timeline: "5-7 business days",
      notes: "Store credit issued or bank transfer arranged"
    }
  ];

  const nonRefundable = [
    "Custom or personalized items",
    "Items damaged due to misuse or normal wear",
    "Items returned after 7-day window",
    "Items without original tags or packaging",
    "Gift cards and vouchers",
    "Shipping charges (unless our error)"
  ];

  return (
    <>
      <SeoHead
        title="Refund Policy | Maninfini Trends"
        description="Comprehensive refund policy with clear timelines and processes. Learn how we handle returns, exchanges, and refund processing."
        canonicalPath="/refunds"
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
                <RefreshCw className="w-4 h-4 mr-2" />
                Refund Policy
              </Badge>

              <h1 className="text-4xl md:text-6xl font-cormorant font-medium mb-6">
                <span className="text-display">Refund</span>
                <br />
                <span className="text-luxury">Policy</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We're committed to your satisfaction. Our transparent refund process ensures you can shop
                with complete confidence and peace of mind.
              </p>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>7-day return window</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  <span>Free return pickup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span>Fast processing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Refund Scenarios */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                When Can You Get a Refund?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We offer refunds in various situations to ensure your complete satisfaction with every purchase.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {refundScenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-premium h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        {scenario.title}
                      </CardTitle>
                      <p className="text-muted-foreground">{scenario.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-3">Process:</h4>
                        <ol className="space-y-2">
                          {scenario.process.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary font-medium min-w-[1.5rem]">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Processing Time:</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {scenario.timeline}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Refund Methods */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                How Refunds Are Processed
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We process refunds through secure methods to ensure your money is safely returned to you.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {refundMethods.map((method, index) => (
                <motion.div
                  key={method.method}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-glass">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <method.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-cormorant font-medium">
                            {method.method}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Processing Time:</span>
                          <Badge variant="outline">{method.timeline}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.notes}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Non-Refundable Items */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Non-Refundable Items
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Certain items and situations are not eligible for refunds to ensure fairness and product quality.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-glass">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-cormorant font-medium mb-2">
                        Items Not Eligible for Refund
                      </h3>
                      <p className="text-muted-foreground">
                        The following items and situations do not qualify for refunds:
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {nonRefundable.map((item, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <span className="text-red-500 mt-1">•</span>
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </div>
      </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Card className="card-glass bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <RefreshCw className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-medium mb-4">
                    Need Help with a Refund?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Our dedicated customer service team is here to help you with any refund-related questions
                    or concerns. We strive to resolve all refund requests promptly and fairly.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-sm font-medium">Quick Response</div>
                      <div className="text-xs text-muted-foreground">Within 24 hours</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                      </div>
                      <div className="text-sm font-medium">Transparent Process</div>
                      <div className="text-xs text-muted-foreground">Clear timelines</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <RefreshCw className="w-4 h-4 text-accent" />
                      </div>
                      <div className="text-sm font-medium">Fair Resolution</div>
                      <div className="text-xs text-muted-foreground">Customer-first approach</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="text-sm text-muted-foreground">
                      Email: refunds@maninfini.in
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

export default Refunds;

