import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Eye, Heart, Share2, ArrowLeft,
  User, BookOpen, Tag, Link2, Facebook, Twitter,
  Instagram, MessageCircle, ThumbsUp, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BlogSeo } from '@/components/Seo/BlogSeo';
import { AISummarizer } from '@/components/Blog/AISummarizer';
import { ReadingProgress } from '@/components/Blog/ReadingProgress';
import { BlogFomo } from '@/components/Blog/BlogFomo';
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
    credentials: string[];
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
  relatedPosts: string[];
};

const BLOG_POSTS: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Future of Sustainable Fashion: Trends for 2025',
    excerpt: 'Discover how eco-conscious fashion is revolutionizing the industry with innovative materials and timeless designs that honor both style and sustainability.',
    content: `# The Future of Sustainable Fashion: Trends for 2025

## The Sustainable Revolution

Fashion has always been about self-expression, but in 2025, it's also about taking responsibility for our planet. The industry is undergoing a dramatic transformation, with sustainability becoming the cornerstone of modern fashion design.

### Innovative Materials Leading the Way

The most exciting development in sustainable fashion is the emergence of innovative materials that don't compromise on style or comfort:

- **Lab-grown leather**: Created from plant-based materials, lab-grown leather uses 95% less water than traditional leather production
- **Mushroom-based fabrics**: Mycelium materials offer the luxurious feel of leather with a fraction of the environmental impact
- **Recycled ocean plastics**: Transformed into high-performance fabrics that are both durable and ocean-friendly

### The Circular Economy in Action

Leading fashion brands are embracing circular economy principles:

1. **Take-back programs**: Customers can return old garments for recycling or store credit
2. **Modular design**: Clothing designed to be easily disassembled and repurposed
3. **Upcycling initiatives**: Transforming existing garments into new, contemporary pieces

### Consumer Behavior Shifts

Today's fashion consumers are more informed and demanding than ever:

- **Transparency**: 78% of consumers want to know the full lifecycle impact of their purchases
- **Quality over quantity**: Preference for timeless pieces over fast fashion trends
- **Ethical sourcing**: Willingness to pay premium prices for verified sustainable products

## The Economic Impact

The sustainable fashion market represents a $500 billion opportunity by 2025. Early adopters who embrace these trends will not only contribute to a healthier planet but also capture significant market share.

### Implementation Strategies

**For Fashion Brands:**
- Audit your supply chain for environmental impact
- Invest in sustainable material research and development
- Educate consumers about your sustainability initiatives

**For Consumers:**
- Choose quality over quantity
- Support brands with transparent sustainability practices
- Participate in take-back and recycling programs

## The Road Ahead

The future of fashion is sustainable, innovative, and inclusive. By embracing these trends, we can create a fashion industry that honors both human creativity and environmental responsibility.

The transformation has already begun. The question isn't whether sustainable fashion will dominate the market—it's which brands will lead this revolution.`,
    author: {
      name: 'Priya Sharma',
      avatar: '/api/placeholder/128/128',
      bio: 'Fashion Director & Sustainability Expert with 15+ years in eco-fashion innovation',
      credentials: ['PhD in Sustainable Fashion', 'Certified B Corp Consultant', 'Published Author']
    },
    category: 'Sustainability',
    tags: ['Eco Fashion', 'Sustainable Materials', '2025 Trends', 'Circular Economy', 'Innovation'],
    publishedAt: '2024-01-15',
    readTime: 8,
    views: 12450,
    likes: 892,
    image: '/api/placeholder/1200/800',
    featured: true,
    trending: true,
    relatedPosts: ['2', '4', '5']
  },
  '2': {
    id: '2',
    title: 'Mastering the Art of Saree Draping: Traditional Techniques',
    excerpt: 'Learn the ancient art of saree draping with step-by-step guidance from our expert designers, perfect for both beginners and seasoned wearers.',
    content: `# Mastering the Art of Saree Draping: Traditional Techniques

## The Ancient Art of Elegance

The saree is more than just a garment—it's a 5,000-year-old tradition that embodies grace, culture, and personal expression. Each drape tells a story of regional identity and cultural heritage.

### Understanding the Basics

Before diving into specific techniques, it's essential to understand the fundamental principles:

- **Fabric Tension**: The key to elegant draping lies in maintaining consistent tension throughout the fabric
- **Body Awareness**: Understanding how the saree interacts with your body's natural curves
- **Practice Philosophy**: Mastery comes from daily practice and muscle memory development

### The Classic Nivi Style

The Nivi drape is the foundation of saree wearing, requiring a 5.5-meter saree and seven precise pleats:

1. **Preparation**: Ensure the saree is properly folded and the pallu is identified
2. **Initial Tuck**: Create the basic structure by tucking the saree at the waist
3. **Pleat Formation**: Master the art of creating even, flowing pleats
4. **Final Adjustments**: Perfect the drape for comfort and elegance

### Regional Variations

India's diverse cultural landscape has given rise to numerous draping styles:

- **Maharashtrian Style**: Known for its practical yet elegant drape
- **Bengali Style**: Features intricate pleating and decorative elements
- **Kerala Style**: Emphasizes comfort and natural flow
- **Gujarati Style**: Combines traditional motifs with modern sensibilities

### Modern Adaptations

Contemporary designers are reimagining traditional techniques:

- **Fusion Drapes**: Combining elements from different regional styles
- **Contemporary Cuts**: Adapting traditional drapes for modern lifestyles
- **Functional Innovation**: Making traditional techniques more accessible

### Practice Framework

**21-Day Mastery Program:**
- **Days 1-7**: Focus on basic techniques and muscle memory
- **Days 8-14**: Practice regional variations and complex pleats
- **Days 15-21**: Master advanced techniques and personal styling

### Common Challenges and Solutions

- **Fabric Slipping**: Use proper tension and secure tucking techniques
- **Uneven Pleats**: Practice consistent hand movements
- **Comfort Issues**: Choose the right fabric and practice proper posture

### The Deeper Meaning

Beyond technique, saree draping is about connecting with cultural heritage and personal expression. Each drape is an opportunity to honor tradition while embracing modernity.

The journey of mastering saree draping is ultimately about self-discovery and cultural appreciation.`,
    author: {
      name: 'Anjali Verma',
      avatar: '/api/placeholder/128/128',
      bio: 'Traditional Textile Specialist and Cultural Preservation Expert',
      credentials: ['Master Weaver Certification', 'Cultural Heritage Consultant', 'Traditional Arts Educator']
    },
    category: 'How-to',
    tags: ['Saree', 'Traditional', 'Draping', 'Cultural Heritage', 'Mastery'],
    publishedAt: '2024-01-12',
    readTime: 12,
    views: 9876,
    likes: 654,
    image: '/api/placeholder/1200/800',
    featured: false,
    trending: true,
    relatedPosts: ['1', '3', '5']
  },
  '3': {
    id: '3',
    title: 'Color Psychology in Fashion: What Your Wardrobe Says About You',
    excerpt: 'Explore how the colors you choose in fashion can influence your mood, confidence, and how others perceive you in professional and personal settings.',
    content: `# Color Psychology in Fashion: What Your Wardrobe Says About You

## The Language of Color

Colors are powerful communicators. In fashion, they speak volumes about our personality, mood, and intentions. Understanding color psychology can transform how you present yourself to the world.

### The Psychology Behind Colors

**Power Colors (Red, Black, Navy):**
- Convey authority and confidence
- Preferred by 67% of corporate executives
- Signal leadership and decision-making capability

**Harmony Colors (Blue, Green, Earth Tones):**
- Promote trust and approachability
- Ideal for collaborative environments
- Create feelings of stability and reliability

**Expression Colors (Yellow, Orange, Bright Hues):**
- Communicate creativity and energy
- Perfect for artistic and dynamic professions
- Express optimism and enthusiasm

### Wardrobe Analysis Framework

Your clothing choices reveal subconscious preferences:

1. **Dominant Colors**: Reflect core personality traits
2. **Accessory Choices**: Indicate current emotional state
3. **Seasonal Variations**: Show adaptability and situational awareness

### Professional Applications

**Career Advancement:**
- Use blue for trust-building interviews
- Incorporate red for leadership presentations
- Choose green for collaborative team settings

**Personal Branding:**
- Align colors with your professional goals
- Use color to reinforce your personal narrative
- Create visual consistency across platforms

### Emotional Impact

Colors don't just influence others—they affect our own psychology:

- **Red**: Increases energy and confidence
- **Blue**: Promotes calm and focus
- **Yellow**: Enhances creativity and optimism
- **Green**: Encourages balance and growth

### Cultural Considerations

Color meanings vary across cultures:
- White symbolizes purity in Western cultures but mourning in some Eastern traditions
- Red represents good fortune in Chinese culture but danger in Western contexts
- Purple signifies royalty in many cultures

### Practical Implementation

**Building a Color Strategy:**
1. Assess your current wardrobe's color palette
2. Identify your professional and personal goals
3. Select colors that align with your objectives
4. Gradually incorporate new colors into your wardrobe

**Color Combinations:**
- Monochromatic: Creates sophisticated, professional looks
- Analogous: Promotes harmony and approachability
- Complementary: Adds energy and visual interest

### The Science of Perception

Research shows that people form opinions within 7 seconds of meeting someone. Your color choices contribute significantly to that first impression.

**Key Statistics:**
- 85% of consumers base purchasing decisions on color
- Color influences brand recognition by 80%
- People make subconscious judgments based on color within 90 seconds

### Personal Style Evolution

Your relationship with color evolves throughout life:
- **Youth**: Bright, expressive colors
- **Early Career**: Professional, trustworthy hues
- **Mid-Career**: Confident, authoritative colors
- **Established**: Sophisticated, personal palettes

### Color and Mood

Your wardrobe can actively influence your emotional state:
- Wear blue when you need to focus
- Choose yellow for creative brainstorming
- Opt for green during stressful periods
- Use red when you need confidence boosts

### Final Thoughts

Color psychology in fashion is both an art and a science. By understanding how colors affect perception and emotion, you can use your wardrobe as a powerful tool for personal and professional success.

The next time you get dressed, consider not just the cut and fabric—but the message your colors are sending to the world.`,
    author: {
      name: 'Dr. Meera Patel',
      avatar: '/api/placeholder/128/128',
      bio: 'Fashion Psychologist and Color Therapy Specialist',
      credentials: ['PhD in Color Psychology', 'Certified Color Consultant', 'Behavioral Science Researcher']
    },
    category: 'Lifestyle',
    tags: ['Color Psychology', 'Fashion Psychology', 'Personal Style', 'Professional Image'],
    publishedAt: '2024-01-10',
    readTime: 6,
    views: 8567,
    likes: 432,
    image: '/api/placeholder/1200/800',
    featured: false,
    trending: false,
    relatedPosts: ['2', '4', '5']
  }
};

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const post = id ? BLOG_POSTS[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    }
  };

  return (
    <>
      <BlogSeo post={post} />

      <div className="min-h-screen bg-gradient-to-br from-background via-card/50 to-muted/30">
        <ReadingProgress />
        <Header />

        {/* Hero Section */}
        <section className="relative pt-24 pb-12">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                {post.category}
              </Badge>

              <h1 className="text-3xl md:text-5xl font-cormorant font-medium mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                {post.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-center gap-6 mb-8">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-16 h-16 rounded-full"
                />
                <div className="text-left">
                  <h3 className="text-lg font-medium">{post.author.name}</h3>
                  <p className="text-muted-foreground">{post.author.bio}</p>
                  <div className="flex gap-2 mt-2">
                    {post.author.credentials.slice(0, 2).map((cred, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {cred}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Article Meta */}
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime} min read
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Image */}
              <div className="mb-8">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-96 object-cover rounded-2xl"
                />
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none mb-12">
                <div className="leading-relaxed text-foreground space-y-6">
                  {post.content.split('\n\n').map((section, index) => {
                    if (!section.trim()) return null;

                    // Handle headers
                    if (section.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-4xl font-cormorant font-medium mt-16 mb-8 text-display">
                          {section.replace('# ', '')}
                        </h1>
                      );
                    }
                    if (section.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-3xl font-cormorant font-medium mt-12 mb-6 text-foreground">
                          {section.replace('## ', '')}
                        </h2>
                      );
                    }
                    if (section.startsWith('### ')) {
                      return (
                        <h3 key={index} className="text-2xl font-cormorant font-medium mt-8 mb-4 text-primary">
                          {section.replace('### ', '')}
                        </h3>
                      );
                    }

                    // Handle lists
                    if (section.includes('\n- ') || section.includes('\n1. ')) {
                      const lines = section.split('\n');
                      const isNumbered = lines.some(line => /^\d+\./.test(line.trim()));

                      if (isNumbered) {
                        return (
                          <ol key={index} className="list-decimal list-inside mb-6 space-y-2 ml-6">
                            {lines.filter(line => line.trim()).map((line, lineIndex) => (
                              <li key={lineIndex} className="text-foreground">
                                {line.replace(/^\d+\.\s*\*\*/, '').replace(/\*\*$/, '')}
                              </li>
                            ))}
                          </ol>
                        );
                      } else {
                        return (
                          <ul key={index} className="list-disc list-inside mb-6 space-y-2 ml-6">
                            {lines.filter(line => line.trim()).map((line, lineIndex) => (
                              <li key={lineIndex} className="text-foreground">
                                {line.replace(/^- \*\*/, '').replace(/\*\*$/, '')}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                    }

                    // Handle bold text in paragraphs
                    const cleanSection = section
                      .replace(/\*\*(.*?)\*\*/g, '$1')
                      .replace(/\*(.*?)\*/g, '$1');

                    return (
                      <p key={index} className="text-lg leading-relaxed text-foreground">
                        {cleanSection}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between py-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {post.likes + (isLiked ? 1 : 0)}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                  >
                    <Bookmark className={`w-4 h-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={sharePost}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  <Button variant="outline" size="sm">
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Instagram className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-12">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Summarizer */}
              <div className="mb-12">
                <AISummarizer
                  variant="inline"
                  postTitle={post.title}
                  postId={post.id}
                />
              </div>

              {/* Related Posts */}
              <div>
                <h3 className="text-2xl font-cormorant font-medium mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {post.relatedPosts.slice(0, 2).map((relatedId) => {
                    const relatedPost = BLOG_POSTS[relatedId];
                    if (!relatedPost) return null;

                    return (
                      <Card key={relatedId} className="card-premium group cursor-pointer">
                        <div className="p-6">
                          <Badge className="mb-3" variant="outline">
                            {relatedPost.category}
                          </Badge>
                          <h4 className="font-medium mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{relatedPost.readTime} min read</span>
                            <span>{relatedPost.views} views</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Author Card */}
                <Card className="card-premium">
                  <CardContent className="p-6 text-center">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                    />
                    <h4 className="font-medium mb-2">{post.author.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {post.author.bio}
                    </p>
                    <div className="space-y-2">
                      {post.author.credentials.map((cred, index) => (
                        <Badge key={index} variant="outline" className="text-xs w-full justify-center">
                          {cred}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Article Stats */}
                <Card className="card-glass">
                  <CardContent className="p-6">
                    <h4 className="font-medium mb-4">Article Stats</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="font-medium">{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Likes</span>
                        <span className="font-medium">{post.likes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Read Time</span>
                        <span className="font-medium">{post.readTime} min</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="card-premium bg-gradient-to-br from-primary/5 to-secondary/5">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h4 className="font-medium mb-2">Stay Updated</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest fashion insights delivered to your inbox
                    </p>
                    <Button className="btn-primary w-full">
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </article>

        <Footer />

        {/* FOMO Elements */}
        <BlogFomo />

        {/* Floating AI Summarizer */}
        <AISummarizer variant="floating" postTitle={post.title} postId={post.id} />
      </div>
    </>
  );
};

export default BlogPost;
