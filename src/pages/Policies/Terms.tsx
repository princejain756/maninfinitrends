import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SeoHead } from '@/components/Seo/SeoHead';
import { FileText, Shield, CreditCard, Truck, RefreshCw, Lock } from 'lucide-react';

const Terms = () => {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Maninfini Trends website and services, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service."
      ]
    },
    {
      icon: Shield,
      title: "Use License",
      content: [
        "Permission is granted to temporarily use the materials (information or software) on Maninfini Trends' website for personal, non-commercial transitory viewing only.",
        "This is the grant of a license, not a transfer of title, and under this license you may not:",
        "• Modify or copy the materials",
        "• Use the materials for any commercial purpose or for any public display (commercial or non-commercial)",
        "• Attempt to decompile or reverse engineer any software contained on Maninfini Trends website",
        "• Remove any copyright or other proprietary notations from the materials"
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "All payments are processed securely through Razorpay payment gateway.",
        "We accept various payment methods including credit cards, debit cards, UPI, net banking, and digital wallets.",
        "All transactions are subject to Razorpay's terms and conditions.",
        "Prices are subject to change without notice, but changes will not affect orders already placed.",
        "Payment must be received in full before order processing begins."
      ]
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      content: [
        "We strive to deliver your orders within the estimated delivery timeframe provided at checkout.",
        "Delivery times may vary based on your location and product availability.",
        "Risk of loss passes to the buyer upon delivery to the carrier.",
        "We are not responsible for delays caused by factors beyond our control."
      ]
    },
    {
      icon: RefreshCw,
      title: "Returns & Refunds",
      content: [
        "Items may be returned within 7 days of delivery for a full refund or exchange.",
        "Items must be in original condition with tags attached and packaging intact.",
        "Return shipping costs are borne by the customer unless the item is defective.",
        "Refunds are processed within 5-7 business days after receipt of returned items.",
        "Custom or personalized items are not eligible for returns."
      ]
    },
    {
      icon: Lock,
      title: "Privacy & Data Protection",
      content: [
        "We are committed to protecting your privacy and personal information.",
        "Your data is collected, processed, and stored in accordance with our Privacy Policy.",
        "We use industry-standard encryption for all payment information.",
        "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent.",
        "You have the right to access, update, or delete your personal information at any time."
      ]
    }
  ];

  return (
    <>
      <SeoHead
        title="Terms of Service | Maninfini Trends"
        description="Read our comprehensive terms of service covering website usage, payments, shipping, returns, and data protection policies."
        canonicalPath="/terms"
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
                <Shield className="w-4 h-4 mr-2" />
                Legal Agreement
              </Badge>

              <h1 className="text-4xl md:text-6xl font-cormorant font-medium mb-6">
                <span className="text-display">Terms of</span>
                <br />
                <span className="text-luxury">Service</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Please read these terms carefully before using our services. By accessing our website,
                you agree to be bound by these terms and conditions.
              </p>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span>Last updated: January 15, 2025</span>
                <span>•</span>
                <span>Effective immediately</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-premium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <section.icon className="w-5 h-5 text-primary" />
                        </div>
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <p key={pIndex} className="text-muted-foreground leading-relaxed">
                          {paragraph.startsWith('•') ? (
                            <span className="flex items-start gap-2">
                              <span className="text-primary mt-1.5">•</span>
                              <span>{paragraph.substring(2)}</span>
                            </span>
                          ) : (
                            paragraph
                          )}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-medium mb-4">
                    Questions About These Terms?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    If you have any questions about these terms of service or need clarification
                    on any section, please don't hesitate to contact our customer service team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="text-sm text-muted-foreground">
                      Email: legal@maninfini.in
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Phone: +91 98765 43210
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

export default Terms;

