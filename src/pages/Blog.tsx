import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Eye, Heart, Share2, ArrowRight, TrendingUp,
  Users, Award, Star, BookOpen, Zap, Target, Search, Filter,
  ChevronDown, ChevronUp, Facebook, Twitter, Instagram, Linkedin,
  MessageCircle, ThumbsUp, User, Bookmark, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { BlogSeo } from '@/components/Seo/BlogSeo';
import { BlogFomo } from '@/components/Blog/BlogFomo';
import { ReadingProgress } from '@/components/Blog/ReadingProgress';
import { AISummarizer } from '@/components/Blog/AISummarizer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  image: string;
  featured: boolean;
  trending: boolean;
};

type Category = {
  name: string;
  count: number;
  color: string;
};

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Sustainable Fashion: Trends for 2025',
    excerpt: 'Discover how eco-conscious fashion is revolutionizing the industry with innovative materials and timeless designs that honor both style and sustainability.',
    content: 'Sustainable fashion is no longer just a trend—it\'s the future of style. As we move into 2025, consumers are increasingly demanding transparency, ethical production, and environmentally friendly materials...',
    author: {
      name: 'Priya Sharma',
      avatar: '/api/placeholder/64/64',
      bio: 'Fashion Director & Sustainability Expert'
    },
    category: 'Sustainability',
    tags: ['Eco Fashion', 'Sustainable Materials', '2025 Trends'],
    publishedAt: '2024-01-15',
    readTime: 8,
    views: 12450,
    likes: 892,
    image: '/api/placeholder/800/500',
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'Mastering the Art of Saree Draping: Traditional Techniques',
    excerpt: 'Learn the ancient art of saree draping with step-by-step guidance from our expert designers, perfect for both beginners and seasoned wearers.',
    content: 'The saree is more than just fabric—it\'s a canvas of tradition, elegance, and personal expression. Mastering the art of draping opens up endless possibilities...',
    author: {
      name: 'Anjali Verma',
      avatar: '/api/placeholder/64/64',
      bio: 'Traditional Textile Specialist'
    },
    category: 'How-to',
    tags: ['Saree', 'Traditional', 'Draping'],
    publishedAt: '2024-01-12',
    readTime: 12,
    views: 9876,
    likes: 654,
    image: '/api/placeholder/800/500',
    featured: false,
    trending: true
  },
  {
    id: '3',
    title: 'Color Psychology in Fashion: What Your Wardrobe Says About You',
    excerpt: 'Explore how the colors you choose in fashion can influence your mood, confidence, and how others perceive you in professional and personal settings.',
    content: 'Color is one of the most powerful tools in fashion design. Each hue carries psychological weight and can dramatically impact how we feel and how others respond to us...',
    author: {
      name: 'Dr. Meera Patel',
      avatar: '/api/placeholder/64/64',
      bio: 'Fashion Psychologist & Color Consultant'
    },
    category: 'Lifestyle',
    tags: ['Color Psychology', 'Fashion Psychology', 'Personal Style'],
    publishedAt: '2024-01-10',
    readTime: 6,
    views: 8567,
    likes: 432,
    image: '/api/placeholder/800/500',
    featured: false,
    trending: false
  },
  {
    id: '4',
    title: 'The Rise of Handcrafted Jewelry: Artistry Meets Wearability',
    excerpt: 'Celebrating the renaissance of artisanal jewelry making and how modern techniques are preserving ancient craftsmanship while creating contemporary pieces.',
    content: 'In an age of mass production, handcrafted jewelry represents the pinnacle of personal expression and artisanal excellence. Each piece tells a unique story...',
    author: {
      name: 'Ravi Kumar',
      avatar: '/api/placeholder/64/64',
      bio: 'Master Jeweler & Artisan'
    },
    category: 'Jewelry',
    tags: ['Handcrafted', 'Artisanal', 'Jewelry Design'],
    publishedAt: '2024-01-08',
    readTime: 10,
    views: 7234,
    likes: 567,
    image: '/api/placeholder/800/500',
    featured: true,
    trending: false
  },
  {
    id: '5',
    title: 'Wardrobe Essentials: Building a Timeless Collection',
    excerpt: 'Create a versatile wardrobe that transcends seasons and trends with these carefully curated pieces that form the foundation of elegant style.',
    content: 'A timeless wardrobe is about quality over quantity, versatility over trend-chasing. These essential pieces will serve you for years to come...',
    author: {
      name: 'Sneha Rao',
      avatar: '/api/placeholder/64/64',
      bio: 'Style Director & Wardrobe Consultant'
    },
    category: 'Style Guide',
    tags: ['Wardrobe Essentials', 'Timeless Style', 'Quality Fashion'],
    publishedAt: '2024-01-05',
    readTime: 9,
    views: 6543,
    likes: 398,
    image: '/api/placeholder/800/500',
    featured: false,
    trending: false
  }
];

const CATEGORIES: Category[] = [
  { name: 'All', count: 25, color: 'bg-primary' },
  { name: 'Sustainability', count: 8, color: 'bg-secondary' },
  { name: 'How-to', count: 6, color: 'bg-accent' },
  { name: 'Lifestyle', count: 5, color: 'bg-primary' },
  { name: 'Jewelry', count: 4, color: 'bg-secondary' },
  { name: 'Style Guide', count: 2, color: 'bg-accent' }
];

const SOCIAL_PROOF = [
  { icon: Eye, label: '12.5K', description: 'Monthly Readers' },
  { icon: Users, label: '8.2K', description: 'Newsletter Subscribers' },
  { icon: Star, label: '4.9/5', description: 'Reader Rating' },
  { icon: Award, label: '15+', description: 'Expert Contributors' }
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPosts = BLOG_POSTS.filter(post => post.featured);
  const trendingPosts = BLOG_POSTS.filter(post => post.trending);

  const handleLike = (postId: string) => {
    setLikedPosts(prev =>
      prev.includes(postId)
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const sharePost = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: `${window.location.origin}/blog/${post.id}`
      });
    }
  };

  return (
    <>
      <BlogSeo isBlogIndex={true} />

      <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/30">
        <ReadingProgress />
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
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
                  className="h-32 md:h-44 lg:h-52 mx-auto object-contain drop-shadow-2xl"
                  animate={{
                    filter: [
                      "drop-shadow(0 25px 50px rgba(0,0,0,0.25))",
                      "drop-shadow(0 35px 60px rgba(0,0,0,0.15))",
                      "drop-shadow(0 25px 50px rgba(0,0,0,0.25))"
                    ]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 3,
                    filter: "brightness(1.2) drop-shadow(0 40px 80px rgba(0,0,0,0.3))"
                  }}
                />
              </motion.div>

              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <BookOpen className="w-4 h-4 mr-2" />
                Fashion Insights
              </Badge>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-cormorant font-medium mb-6">
                <span className="text-display">The Art of</span>
                <br />
                <span className="text-luxury">Elegant Style</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Discover timeless fashion wisdom, sustainable trends, and expert insights that elevate your style journey.
                Join thousands of fashion enthusiasts on their quest for elegance and sustainability.
              </p>

              {/* Social Proof */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto mb-12">
                {SOCIAL_PROOF.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.label}</div>
                    <div className="text-sm text-muted-foreground">{stat.description}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="btn-primary group">
                  Explore Latest Posts
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="btn-glass">
                  Subscribe to Newsletter
                  <TrendingUp className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-16 bg-card/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-cormorant font-medium mb-4">
                <span className="text-display">Featured</span> Stories
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Handpicked articles that capture the essence of modern elegance and sustainable fashion
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${post.id}`}>
                    <Card className="card-premium h-full overflow-hidden hover:scale-[1.02] transition-all duration-300">
                      <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent text-accent-foreground shadow-glow">
                          Featured
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`p-2 rounded-full backdrop-blur-md border transition-all ${
                            likedPosts.includes(post.id)
                              ? 'bg-red-500/20 border-red-500/30 text-red-500'
                              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => sharePost(post)}
                          className="p-2 rounded-full bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 transition-all backdrop-blur-md"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {post.readTime} min read
                        </div>
                      </div>

                      <h3 className="text-xl font-cormorant font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="text-sm font-medium">{post.author.name}</div>
                            <div className="text-xs text-muted-foreground">{post.publishedAt}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Blog Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                  {/* Search */}
                  <Card className="card-glass">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Articles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Search topics, tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-background/50 border-border/50"
                      />
                    </CardContent>
                  </Card>

                  {/* Categories */}
                  <Card className="card-glass">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Categories
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                            selectedCategory === category.name
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span className="font-medium">{category.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </button>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Trending Posts */}
                  <Card className="card-glass">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Trending Now
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {trendingPosts.slice(0, 3).map((post) => (
                        <div key={post.id} className="flex gap-3">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              {post.views.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Newsletter Signup */}
                  <Card className="card-premium bg-gradient-to-br from-primary/5 to-secondary/5">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-cormorant font-medium mb-2">
                        Stay Inspired
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Get weekly fashion insights delivered to your inbox
                      </p>
                      <Button className="btn-primary w-full">
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-cormorant font-medium mb-2">
                      Latest Articles
                    </h2>
                    <p className="text-muted-foreground">
                      {filteredPosts.length} articles found
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory + searchQuery}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    {filteredPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                      >
                        <Link to={`/blog/${post.id}`}>
                          <Card className="card-premium overflow-hidden hover:scale-[1.01] transition-all duration-300 cursor-pointer">
                          <div className="md:flex">
                            <div className="md:w-1/3">
                              <div className="relative overflow-hidden">
                                <img
                                  src={post.image}
                                  alt={post.title}
                                  className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {post.trending && (
                                  <div className="absolute top-3 left-3">
                                    <Badge className="bg-accent text-accent-foreground shadow-glow animate-pulse">
                                      <TrendingUp className="w-3 h-3 mr-1" />
                                      Trending
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="md:w-2/3 p-6">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  {post.category}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  {post.readTime} min read
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(post.publishedAt).toLocaleDateString()}
                                </div>
                              </div>

                              <h3 className="text-xl md:text-2xl font-cormorant font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h3>

                              <p className="text-muted-foreground mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    className="w-10 h-10 rounded-full"
                                  />
                                  <div>
                                    <div className="font-medium text-sm">{post.author.name}</div>
                                    <div className="text-xs text-muted-foreground">{post.author.bio}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Eye className="w-4 h-4" />
                                    {post.views.toLocaleString()}
                                  </div>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Heart className="w-4 h-4" />
                                    {post.likes}
                                  </div>
                                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                    Read More
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                        </Link>
                      </motion.article>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg" className="btn-glass">
                    Load More Articles
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Summarizer Demo Section */}
        <section className="py-16 bg-gradient-to-br from-background to-muted/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                AI-Powered Insights
              </Badge>
              <h2 className="text-3xl md:text-4xl font-cormorant font-medium mb-4">
                <span className="text-display">Experience the Future of</span>
                <br />
                <span className="text-luxury">Reading</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our advanced AI analyzes articles instantly, extracting key insights and generating comprehensive summaries in seconds.
              </p>
            </motion.div>

            <AISummarizer
              variant="inline"
              postTitle="The Future of Sustainable Fashion: Trends for 2025"
              postId="sustainable-fashion"
            />
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl font-cormorant font-medium mb-4">
                <span className="text-display">Join the Conversation</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and be the first to know about new articles, exclusive insights, and special fashion tips.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="flex-1 bg-background/50 border-border/50"
                />
                <Button className="btn-primary whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Join 8,200+ fashion enthusiasts • No spam • Unsubscribe anytime
              </p>

              {/* Social Proof Numbers */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">15K+</div>
                    <div className="text-xs text-muted-foreground">Monthly Readers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">500+</div>
                    <div className="text-xs text-muted-foreground">Articles Published</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">98%</div>
                    <div className="text-xs text-muted-foreground">Reader Satisfaction</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />

        {/* FOMO Elements */}
        <BlogFomo />

        {/* AI Summarizer - Floating */}
        <AISummarizer variant="floating" />
      </div>
    </>
  );
};

export default Blog;
