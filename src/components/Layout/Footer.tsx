import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  ChevronDown,
  ExternalLink,
  Shield,
  Truck,
  CreditCard,
  Headphones
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Track Order', href: '/track' },
  { name: 'Size Guide', href: '/size-guide' },
  { name: 'Care Instructions', href: '/care' },
  { name: 'Bulk Orders', href: '/bulk' },
  { name: 'Become a Partner', href: '/partner' }
];

const policies = [
  { name: 'Shipping & Returns', href: '/shipping-returns' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Refund Policy', href: '/refunds' },
  { name: 'Cookie Policy', href: '/cookies' }
];

const collections = [
  { name: 'Sarees', href: '/collections/sarees' },
  { name: 'Kurtis', href: '/collections/kurtis' },
  { name: 'Salwars', href: '/collections/salwars' },
  { name: 'Indo-Western', href: '/collections/indo-western' },
  { name: 'Jewellery', href: '/collections/jewellery' },
  { name: 'Eco Collection', href: '/eco-collection' }
];

export const Footer = () => {
  const [isCorpInfoOpen, setIsCorpInfoOpen] = useState(false);

  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-display text-2xl font-semibold text-primary mb-3">
                  Maninfini Trends
                </h3>
                <p className="text-sm text-muted-foreground italic mb-6">
                  Ethnic elegance. Eco-smart style.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Premium ethnic wear, sustainable fashion, and exquisite imitation jewellery. 
                  Celebrating Indian craftsmanship with modern sensibilities.
                </p>
                
                {/* Social Links */}
                <div className="flex items-center gap-4">
                  {[
                    { icon: Instagram, href: '#', color: 'from-purple-500 to-pink-500' },
                    { icon: Facebook, href: '#', color: 'from-blue-600 to-blue-700' },
                    { icon: Twitter, href: '#', color: 'from-blue-400 to-blue-500' },
                    { icon: Linkedin, href: '#', color: 'from-blue-700 to-blue-800' }
                  ].map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center group"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Collections */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="font-semibold text-foreground mb-6">Collections</h4>
                <ul className="space-y-3">
                  {collections.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
                <ul className="space-y-3">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Info */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="font-semibold text-foreground mb-6">Contact Us</h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p>Flat no 3093, 10th Block,</p>
                      <p>Janapriya Heavens, Allalasandra,</p>
                      <p>Bangalore, Karnataka, 560065</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                    <a 
                      href="mailto:manita4599@gmail.com"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      manita4599@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      +91 98765 43210
                    </span>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="mt-6 p-4 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Headphones className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Support Hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mon - Sat: 9:00 AM - 7:00 PM IST<br />
                    Sunday: 10:00 AM - 6:00 PM IST
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="py-8 border-y border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, text: 'Secure Payments' },
              { icon: Truck, text: 'Free Shipping ₹999+' },
              { icon: CreditCard, text: 'Easy Returns' },
              { icon: Headphones, text: '24/7 Support' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Corporate Information */}
        <div className="py-6">
          <Collapsible open={isCorpInfoOpen} onOpenChange={setIsCorpInfoOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left">
              <span className="font-medium text-foreground">Corporate Information</span>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isCorpInfoOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-xl">
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">CIN:</span> U52609KA2022PTC165298
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Registration No:</span> 165298
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">ROC:</span> Bangalore
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Status:</span> Active, Unlisted
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Incorporated:</span> 2022
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">AGM:</span> 2023
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Directors:</span> MANITA DEEPAK JAIN, NEERAV DEEPAK JAIN
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">NIC:</span> 5260 - Repair of personal & household goods
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Policies & Copyright */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {policies.map((policy, index) => (
                <a 
                  key={policy.name}
                  href={policy.href}
                  className="hover:text-foreground transition-colors"
                >
                  {policy.name}
                </a>
              ))}
            </div>
            <div className="text-xs text-muted-foreground">
              © 2024 Maninfini Trends Private Limited. All rights reserved.
            </div>
          </div>
          
          {/* GST Notice */}
          <div className="mt-4 text-xs text-muted-foreground text-center md:text-left">
            GST included in all prices. Invoice will be generated for all purchases.
          </div>
        </div>
      </div>
    </footer>
  );
};