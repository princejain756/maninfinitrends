import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, Heart, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import sareeIcon from '@/assets/icons/sareebg.png';
import salwarIcon from '@/assets/icons/salwarbg.png';
import kurtiIcon from '@/assets/icons/kurtisbg.png';
import indoIcon from '@/assets/icons/indo-westernbg.png';
import fabricsIcon from '@/assets/icons/fabricsbg.png';
import { useCartStore } from '@/store/cart';

export const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Derive live cart count from store for instant updates
  const cartCount = useCartStore((s) => s.items.reduce((t, i) => t + i.quantity, 0));
  const [timeLeft, setTimeLeft] = useState<{d:number;h:number;m:number;s:number}>({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FOMO countdown: persists per-visitor using localStorage
  useEffect(() => {
    const KEY = 'mnf_sale_deadline_ms';
    let deadlineMs = Number(localStorage.getItem(KEY));
    const now = Date.now();
    if (!deadlineMs || deadlineMs < now) {
      // New 2-hour window from now for strong urgency
      deadlineMs = now + 2 * 60 * 60 * 1000;
      localStorage.setItem(KEY, String(deadlineMs));
    }

    const tick = () => {
      const remaining = Math.max(0, deadlineMs - Date.now());
      const d = Math.floor(remaining / (24 * 60 * 60 * 1000));
      const h = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const m = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
      const s = Math.floor((remaining % (60 * 1000)) / 1000);
      setTimeLeft({ d, h, m, s });

      if (remaining <= 0) {
        // Immediately roll a new short window (45–90 min) to maintain momentum
        const nextWindow = 45 + Math.floor(Math.random() * 46);
        const nextDeadline = Date.now() + nextWindow * 60 * 1000;
        localStorage.setItem(KEY, String(nextDeadline));
      }
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Removed API fetch for cart badge; Zustand store keeps it reactive.

  const collections = [
    { name: 'Sarees', href: '/collections/sarees', featured: true, icon: sareeIcon },
    { name: 'Salwars', href: '/collections/salwars', icon: salwarIcon },
    { name: 'Kurtis', href: '/collections/kurtis', icon: kurtiIcon },
    { name: 'Indo-Western', href: '/collections/indo-western', icon: indoIcon },
    { name: 'Fabrics', href: '/collections/fabrics', icon: fabricsIcon },
  ];

  return (
    <>
      {/* Announcement Bar + FOMO Countdown */}
      <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="hidden md:inline">FESTIVE SALE | UPTO 50% OFF SITEWIDE</span>
            <span className="md:inline hidden">—</span>
            <span className="uppercase tracking-widest text-xs">Only {String(timeLeft.h).padStart(2,'0')}h {String(timeLeft.m).padStart(2,'0')}m left</span>
          </div>
          <div className="hidden sm:flex items-center gap-5">
            {[
              { label: 'DAY', value: timeLeft.d },
              { label: 'HRS', value: timeLeft.h },
              { label: 'MIN', value: timeLeft.m },
              { label: 'SEC', value: timeLeft.s },
            ].map((k) => (
              <div key={k.label} className="flex flex-col items-center min-w-10">
                <div className="text-lg font-semibold tabular-nums">{String(k.value).padStart(2,'0')}</div>
                <div className="text-[10px] opacity-80 tracking-wide">{k.label}</div>
              </div>
            ))}
          </div>
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
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <Link to="/" className="block group">
                <motion.img
                  src="/logo.png"
                  alt="Maninfini Trends"
                  className="h-16 lg:h-24 w-auto object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                  whileHover={{ filter: "brightness(1.1)" }}
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="relative group">
                <button className="font-medium text-foreground hover:text-primary transition-colors">
                  Collections
                </button>
                <div className="absolute top-full left-0 w-[320px] bg-card/95 backdrop-blur-md shadow-elegant rounded-2xl border border-border/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2 p-4">
                  <div className="space-y-2">
                    {collections.map((collection) => (
                      <a
                        key={collection.name}
                        href={collection.href}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group/item"
                      >
                        <img src={collection.icon} alt={collection.name} className="w-9 h-9 object-contain" />
                        <span className="font-medium flex-1">{collection.name}</span>
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
              <a href="/services" className="font-medium text-foreground hover:text-primary transition-colors">
                Services
              </a>
              <a href="/blog" className="font-medium text-foreground hover:text-secondary transition-colors">
                Blog
              </a>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Search */}
              <button
                className="p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label="Search"
                onClick={() => navigate('/shop')}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Account */}
              <button
                className="hidden md:flex p-2 rounded-xl hover:bg-muted transition-colors"
                aria-label="Account"
                onClick={() => navigate('/account/login')}
              >
                <User className="h-5 w-5" />
              </button>

              {/* Wishlist */}
              <button
                className="hidden md:flex p-2 rounded-xl hover:bg-muted transition-colors relative"
                aria-label="Wishlist"
                onClick={() => navigate('/shop')}
              >
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent text-accent-foreground text-[10px] leading-none px-1 border-2 border-background shadow-sm">
                  3
                </span>
              </button>

              {/* Cart */}
              <button
                className="p-2 rounded-xl hover:bg-muted transition-colors relative"
                aria-label={`Cart with ${cartCount} items`}
                onClick={() => navigate('/cart')}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] leading-none px-1 border-2 border-background shadow-sm">
                    {cartCount}
                  </span>
                )}
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
                <Link to="/" className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="Maninfini Trends"
                    className="h-14 w-auto object-contain"
                  />
                </Link>
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
                        className="flex items-center gap-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <img src={collection.icon} alt={collection.name} className="w-6 h-6 object-contain" />
                        <span>{collection.name}</span>
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
                <a href="/services" className="block py-3 font-medium text-foreground hover:text-primary transition-colors">
                  Services & Restoration
                </a>
                <a href="/blog" className="block py-3 font-medium text-foreground hover:text-secondary transition-colors">
                  Fashion Blog
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
