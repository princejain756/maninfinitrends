import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type FomoEvent = {
  id: string;
  type: 'reading' | 'subscribed' | 'shared' | 'liked';
  user: string;
  action: string;
  timeAgo: string;
  postTitle?: string;
};

const LIVE_EVENTS: FomoEvent[] = [
  {
    id: '1',
    type: 'reading',
    user: 'Priya M.',
    action: 'is reading',
    timeAgo: 'just now',
    postTitle: 'Sustainable Fashion Trends 2025'
  },
  {
    id: '2',
    type: 'subscribed',
    user: 'Rahul K.',
    action: 'subscribed to',
    timeAgo: '2 min ago'
  },
  {
    id: '3',
    type: 'shared',
    user: 'Anjali S.',
    action: 'shared',
    timeAgo: '5 min ago',
    postTitle: 'Traditional Saree Draping Guide'
  },
  {
    id: '4',
    type: 'liked',
    user: 'Vikram T.',
    action: 'liked',
    timeAgo: '7 min ago',
    postTitle: 'Color Psychology in Fashion'
  }
];

const URGENCY_MESSAGES = [
  "Limited-time exclusive insights available now!",
  "Only 24 hours left for early access to premium content!",
  "Trending article - readers are loving this!",
  "New article just published - be the first to read!",
  "Weekly newsletter subscribers get exclusive content!"
];

export const BlogFomo = () => {
  const [currentEvent, setCurrentEvent] = useState<FomoEvent | null>(null);
  const [urgencyMessage, setUrgencyMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Reset to 1 hour when it reaches 0
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Rotate FOMO events
    const eventInterval = setInterval(() => {
      const randomEvent = LIVE_EVENTS[Math.floor(Math.random() * LIVE_EVENTS.length)];
      setCurrentEvent(randomEvent);

      // Auto-hide after 8 seconds
      setTimeout(() => setCurrentEvent(null), 8000);
    }, 12000); // Show new event every 12 seconds

    return () => clearInterval(eventInterval);
  }, []);

  useEffect(() => {
    // Rotate urgency messages
    const messageInterval = setInterval(() => {
      const randomMessage = URGENCY_MESSAGES[Math.floor(Math.random() * URGENCY_MESSAGES.length)];
      setUrgencyMessage(randomMessage);
    }, 15000); // Change message every 15 seconds

    return () => clearInterval(messageInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEventIcon = (type: FomoEvent['type']) => {
    switch (type) {
      case 'reading':
        return <Users className="w-4 h-4" />;
      case 'subscribed':
        return <TrendingUp className="w-4 h-4" />;
      case 'shared':
        return <Zap className="w-4 h-4" />;
      case 'liked':
        return <Users className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {/* Urgency Countdown */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="hidden lg:block"
      >
        <Card className="card-glass shadow-luxury border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground mb-1">
                  Special Content Expires In:
                </div>
                <div className="font-mono text-lg font-bold text-primary">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <Badge className="bg-accent text-accent-foreground animate-pulse">
                Limited
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Urgency Message */}
      <AnimatePresence>
        {urgencyMessage && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-glass shadow-elegant border-secondary/20 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">
                      {urgencyMessage}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Activity Feed */}
      <AnimatePresence>
        {currentEvent && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="card-glass shadow-soft border-accent/20 max-w-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {getEventIcon(currentEvent.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">{currentEvent.user}</span>{' '}
                      {currentEvent.action}{' '}
                      {currentEvent.postTitle && (
                        <span className="font-medium text-secondary">"{currentEvent.postTitle}"</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentEvent.timeAgo}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0 mt-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};





