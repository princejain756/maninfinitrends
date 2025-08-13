import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, Heart, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const collections = [
    { name: 'Sarees', href: '/collections/sarees', featured: true },
    { name: 'Salwars', href: '/collections/salwars' },
    { name: 'Kurtis', href: '/collections/kurtis' },
    { name: 'Indo-Western', href: '/collections/indo-western' },
    { name: 'Fabrics', href: '/collections/fabrics' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-medium">
        <div className="flex items-center justify-center gap-4 max-w-7xl mx-auto">
          <span>Free shipping over ₹999</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Easy returns</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">COD available</span>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-soft border-b border-border/50' 
            : 'bg-background/80 backdrop-blur-sm'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-display text-2xl lg:text-3xl text-primary font-semibold">
                Maninfini Trends
              </h1>
              <p className="text-xs text-muted-foreground font-inter italic">
                Ethnic elegance. Eco-smart style.
              </p>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="font-medium text-foreground hover:text-primary transition-colors">
                  Collections
                </button>
                <div className="absolute top-full left-0 w-64 bg-card/95 backdrop-blur-md shadow-elegant rounded-2xl border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2 p-6">
                  <div className="space-y-3">
                    {collections.map((collection) => (
                      <a
                        key={collection.name}
                        href={collection.href}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-muted transition-colors group/item"
                      >
                        <span className="font-medium">{collection.name}</span>
                        {collection.featured && (
                          <Badge className="bg-accent text-accent-foreground">New</Badge>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <a href="/eco-collection" className="font-medium text-foreground hover:text-secondary transition-colors">
                Eco Collection
              </a>
              <a href="/jewellery" className="font-medium text-foreground hover:text-accent transition-colors">
                Jewellery
              </a>
              <a href="/repairs" className="font-medium text-foreground hover:text-primary transition-colors">
                Repairs
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search */}
              <button className="p-2 rounded-xl hover:bg-muted transition-colors">
                <Search className="h-5 w-5" />
              </button>

              {/* User Account */}
              <button className="hidden md:flex p-2 rounded-xl hover:bg-muted transition-colors">
                <User className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <button className="hidden md:flex p-2 rounded-xl hover:bg-muted transition-colors relative">
                <Heart className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-accent text-accent-foreground">
                  3
                </Badge>
              </button>

              {/* Cart */}
              <button className="p-2 rounded-xl hover:bg-muted transition-colors relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
                  2
                </Badge>
              </button>

              {/* Quick Links */}
              <div className="hidden lg:flex items-center space-x-4 ml-4 pl-4 border-l border-border">
                <a href="/track" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Track Order
                </a>
                <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
            <motion.div
              className="absolute left-0 top-0 h-full w-80 bg-card shadow-elegant border-r border-border p-6"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-display text-xl text-primary font-semibold">Menu</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Collections</h3>
                  <div className="space-y-2 ml-4">
                    {collections.map((collection) => (
                      <a
                        key={collection.name}
                        href={collection.href}
                        className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {collection.name}
                      </a>
                    ))}
                  </div>
                </div>
                
                <a href="/eco-collection" className="block py-3 font-medium text-foreground hover:text-secondary transition-colors">
                  Eco Collection
                </a>
                <a href="/jewellery" className="block py-3 font-medium text-foreground hover:text-accent transition-colors">
                  Jewellery
                </a>
                <a href="/repairs" className="block py-3 font-medium text-foreground hover:text-primary transition-colors">
                  Repairs & Restoration
                </a>
                
                <div className="pt-6 border-t border-border">
                  <a href="/track" className="block py-2 text-muted-foreground hover:text-foreground transition-colors">
                    Track Order
                  </a>
                  <a href="/contact" className="block py-2 text-muted-foreground hover:text-foreground transition-colors">
                    Contact Support
                  </a>
                  <a href="/account" className="block py-2 text-muted-foreground hover:text-foreground transition-colors">
                    My Account
                  </a>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};