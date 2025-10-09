import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const instagramPosts = [
  {
    id: 1,
    image: '/api/placeholder/300/300',
    likes: 234,
    comments: 18,
    caption: 'Stunning Banarasi silk saree perfect for festive occasions! ✨ #ManinfiniTrends #EthnicWear',
    username: '@maninfini_trends',
    isVideo: false
  },
  {
    id: 2,
    image: '/api/placeholder/300/300',
    likes: 189,
    comments: 12,
    caption: 'Behind the scenes: Handcrafting our eco-friendly bamboo collection 🌿',
    username: '@maninfini_trends',
    isVideo: true
  },
  {
    id: 3,
    image: '/api/placeholder/300/300',
    likes: 156,
    comments: 9,
    caption: 'Kundan jewellery that tells a story of tradition and elegance 💎',
    username: '@maninfini_trends',
    isVideo: false
  },
  {
    id: 4,
    image: '/api/placeholder/300/300',
    likes: 298,
    comments: 24,
    caption: 'Customer love! Thank you @priya_style for choosing sustainable fashion 💚',
    username: '@maninfini_trends',
    isVideo: false
  },
  {
    id: 5,
    image: '/api/placeholder/300/300',
    likes: 167,
    comments: 15,
    caption: 'Coffee husk accessories - turning waste into beautiful products ♻️',
    username: '@maninfini_trends',
    isVideo: false
  },
  {
    id: 6,
    image: '/api/placeholder/300/300',
    likes: 203,
    comments: 11,
    caption: 'Artisan spotlight: Meet the talented hands behind our handblock prints 🎨',
    username: '@maninfini_trends',
    isVideo: true
  }
];

export const InstagramFeed = () => {
  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200 text-sm font-medium mb-6">
          <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Follow Our Journey
          </span>
        </div>
        
        <h2 className="text-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground mb-6">
          @maninfini_trends
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Get behind-the-scenes glimpses of our artisans at work, styling tips, 
          and customer stories. Join our community of conscious fashion lovers.
        </p>
        
        <Button className="btn-accent">
          Follow on Instagram
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

      {/* Instagram Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {instagramPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ scale: 1.05 }}
            className="group cursor-pointer"
          >
            <Card className="overflow-hidden aspect-square relative">
              {/* Image */}
              <div 
                className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"
                style={{
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />

              {/* Video Indicator */}
              {post.isVideo && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-black/70 text-white border-0 text-xs">
                    VIDEO
                  </Badge>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </div>
                  </div>
                  <p className="text-xs opacity-90 line-clamp-2 px-2">
                    {post.caption}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* User Generated Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center"
      >
        <Card className="card-premium p-8 bg-gradient-to-br from-card to-accent/5">
          <h3 className="text-display text-2xl font-semibold text-foreground mb-4">
            Share Your Style
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tag us in your photos wearing Maninfini Trends pieces for a chance to be featured. 
            Use <span className="font-medium text-accent">#ManinfiniStyle</span> and 
            <span className="font-medium text-secondary"> #EcoFashion</span> to join our community.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="btn-primary">
              Share Your Look
              <Share2 className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" className="bg-card/80 backdrop-blur-sm">
              View All Posts
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">12.5k</div>
              <div className="text-xs text-muted-foreground">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">450+</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">4.8</div>
              <div className="text-xs text-muted-foreground">Engagement</div>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};