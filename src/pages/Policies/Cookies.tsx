import { motion } from 'framer-motion';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SeoHead } from '@/components/Seo/SeoHead';
import { Cookie, Settings, BarChart3, Target, Shield, Eye } from 'lucide-react';

const Cookies = () => {
  const cookieTypes = [
    {
      icon: Shield,
      title: "Essential Cookies",
      description: "Required for website functionality",
      purpose: "These cookies are necessary for our website to function properly. They enable core functionality such as page navigation, access to secure areas, and basic shopping cart operations.",
      examples: ["Session management", "Security features", "Shopping cart functionality", "User authentication"],
      duration: "Session or 30 days",
      required: true
    },
    {
      icon: BarChart3,
      title: "Analytics Cookies",
      description: "Help us understand user behavior",
      purpose: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website performance and user experience.",
      examples: ["Page views", "Time on site", "Traffic sources", "Conversion tracking"],
      duration: "2 years",
      required: false
    },
    {
      icon: Target,
      title: "Marketing Cookies",
      description: "Personalize your experience",
      purpose: "These cookies are used to deliver advertisements that are more relevant to you and your interests. They also help us measure the effectiveness of our advertising campaigns.",
      examples: ["Retargeting ads", "Social media pixels", "Email marketing tracking", "Affiliate tracking"],
      duration: "90 days",
      required: false
    },
    {
      icon: Settings,
      title: "Preference Cookies",
      description: "Remember your choices",
      purpose: "These cookies remember your preferences and settings to provide you with a personalized experience on subsequent visits.",
      examples: ["Language preferences", "Location settings", "Display preferences", "Accessibility settings"],
      duration: "1 year",
      required: false
    }
  ];

  const manageCookies = () => {
    // This would typically open a cookie consent management modal
    alert('Cookie preference management will be available soon. You can currently manage cookies through your browser settings.');
  };

  return (
    <>
      <SeoHead
        title="Cookie Policy | Maninfini Trends"
        description="Learn about our use of cookies and how to manage your privacy preferences. We explain each type of cookie and give you control over your choices."
        canonicalPath="/cookies"
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
                <Cookie className="w-4 h-4 mr-2" />
                Cookie Management
              </Badge>

              <h1 className="text-4xl md:text-6xl font-cormorant font-medium mb-6">
                <span className="text-display">Cookie</span>
                <br />
                <span className="text-luxury">Policy</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience, provide personalized content,
                and analyze site traffic. Learn how to manage your preferences below.
              </p>

              <div className="mt-8">
                <Button onClick={manageCookies} className="btn-primary">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Cookie Preferences
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What Are Cookies */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                What Are Cookies?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cookies are small text files that are stored on your device when you visit our website.
                They help us provide you with a better browsing experience and allow certain features to work properly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="card-premium">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-cormorant font-medium mb-4">Why We Use Cookies</h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Remember your preferences and settings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Keep you logged in to your account</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Analyze website performance and user behavior</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Show relevant advertisements and content</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-xl font-cormorant font-medium mb-4">Your Cookie Rights</h3>
                      <ul className="space-y-3 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Accept or reject non-essential cookies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Withdraw consent at any time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Delete existing cookies from your browser</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Opt out of targeted advertising</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Cookie Types */}
        <section className="py-16 bg-muted/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Types of Cookies We Use
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We categorize our cookies based on their purpose and functionality.
                Essential cookies cannot be disabled as they are required for basic website operation.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-premium h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <cookie.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            {cookie.title}
                            {cookie.required && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-normal mt-1">
                            {cookie.description}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        {cookie.purpose}
                      </p>

                      <div>
                        <h4 className="font-medium mb-2">Examples:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                          {cookie.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Duration:</span>
                          <span className="font-medium">{cookie.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

        {/* How to Manage Cookies */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-cormorant font-medium mb-4">
                Managing Your Cookies
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                You have several options to control how cookies are used on our website.
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
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                      <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-cormorant font-medium mb-4">
                      Browser Settings
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Most web browsers allow you to control cookies through their settings preferences.
                      You can usually find these settings in the 'Options' or 'Preferences' menu.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Block all cookies</li>
                      <li>• Block third-party cookies</li>
                      <li>• Delete existing cookies</li>
                      <li>• Receive notifications about cookies</li>
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
                    <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-6">
                      <Eye className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="text-xl font-cormorant font-medium mb-4">
                      Our Cookie Controls
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      We provide additional tools to help you manage your cookie preferences
                      and understand how your data is used.
                    </p>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Cookie consent banner</li>
                      <li>• Preference center (coming soon)</li>
                      <li>• Opt-out of marketing cookies</li>
                      <li>• Data subject access requests</li>
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
                    <Cookie className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-cormorant font-medium mb-4">
                    Questions About Cookies?
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    If you have any questions about our use of cookies or need help managing your preferences,
                    please don't hesitate to contact our privacy team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="text-sm text-muted-foreground">
                      Email: privacy@maninfini.in
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

export default Cookies;

