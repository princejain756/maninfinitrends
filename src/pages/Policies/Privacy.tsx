import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SeoHead } from '@/components/Seo/SeoHead';
import { Eye, Database, Shield, Users, Cookie, Mail, Lock, AlertTriangle } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.",
        "We also automatically collect certain information when you use our website, including:",
        "• Device information and browser type",
        "• IP address and location data",
        "• Pages visited and time spent on our site",
        "• Referral sources and clickstream data",
        "• Payment information processed through Razorpay"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "We use the information we collect to:",
        "• Process and fulfill your orders",
        "• Provide customer support and respond to inquiries",
        "• Send you important updates about your orders",
        "• Improve our website and services",
        "• Send marketing communications (with your consent)",
        "• Prevent fraud and ensure security",
        "• Comply with legal obligations"
      ]
    },
    {
      icon: Shield,
      title: "Data Security & Protection",
      content: [
        "We implement industry-standard security measures to protect your personal information:",
        "• SSL/TLS encryption for all data transmission",
        "• Secure payment processing through Razorpay",
        "• Regular security audits and updates",
        "• Limited access to personal data on a need-to-know basis",
        "• Secure data storage with encrypted databases",
        "• Regular backups and disaster recovery procedures"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:",
        "• With service providers who help us operate our business (payment processors, shipping companies)",
        "• To comply with legal obligations or court orders",
        "• To protect our rights, property, or safety",
        "• With your explicit consent",
        "• In connection with a business transfer or merger"
      ]
    },
    {
      icon: Cookie,
      title: "Cookies & Tracking",
      content: [
        "We use cookies and similar technologies to enhance your browsing experience:",
        "• Essential cookies for website functionality",
        "• Analytics cookies to understand user behavior",
        "• Marketing cookies for personalized advertising",
        "• Preference cookies to remember your settings",
        "You can control cookie preferences through your browser settings or our cookie consent banner."
      ]
    },
    {
      icon: Mail,
      title: "Marketing Communications",
      content: [
        "We may send you marketing communications about our products and services:",
        "• Email newsletters and promotional offers",
        "• Product recommendations based on your preferences",
        "• Updates about new arrivals and special events",
        "You can opt out of marketing communications at any time by:",
        "• Clicking the unsubscribe link in our emails",
        "• Updating your preferences in your account settings",
        "• Contacting our customer service team"
      ]
    },
    {
      icon: Lock,
      title: "Your Rights & Choices",
      content: [
        "You have several rights regarding your personal information:",
        "• Access: Request a copy of your personal data",
        "• Rectification: Correct inaccurate or incomplete data",
        "• Erasure: Request deletion of your personal data",
        "• Portability: Receive your data in a structured format",
        "• Objection: Object to processing based on legitimate interests",
        "• Withdrawal: Withdraw consent for marketing communications"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Children's Privacy",
      content: [
        "Our services are not intended for children under 18 years of age.",
        "We do not knowingly collect personal information from children under 18.",
        "If we become aware that we have collected personal information from a child under 18, we will take steps to delete such information.",
        "Parents or guardians who believe their child has provided us with personal information should contact us immediately."
      ]
    }
  ];

  return (
    <>
      <SeoHead
        title="Privacy Policy | Maninfini Trends"
        description="Learn how we collect, use, and protect your personal information. Our comprehensive privacy policy covers data security, cookies, and your rights."
        canonicalPath="/privacy"
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
                Data Protection
              </Badge>

              <h1 className="text-4xl md:text-6xl font-cormorant font-medium mb-6">
                <span className="text-display">Privacy</span>
                <br />
                <span className="text-luxury">Policy</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your privacy is our priority. Learn how we collect, use, and protect your personal information
                with complete transparency and security.
              </p>

              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <span>Last updated: January 15, 2025</span>
                <span>•</span>
                <span>GDPR & CCPA Compliant</span>
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
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-medium mb-4">
                    Questions About Your Privacy?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Your privacy rights are important to us. If you have any questions about how we handle your data
                    or want to exercise your privacy rights, our team is here to help.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="text-sm text-muted-foreground">
                      Email: privacy@maninfini.in
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Phone: +91 98765 43210
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Data Protection Officer
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

export default Privacy;

