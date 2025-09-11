import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Eye } from 'lucide-react';

export const ReadingProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [wordsRead, setWordsRead] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };

    const handleReadingProgress = () => {
      const wordsPerMinute = 200; // Average reading speed
      const totalWords = 2500; // Estimated words on page
      const scrolledWords = Math.floor((scrollProgress / 100) * totalWords);
      const timeSpent = Math.floor((scrolledWords / wordsPerMinute) * 60); // in seconds

      setWordsRead(scrolledWords);
      setReadingTime(timeSpent);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleReadingProgress);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleReadingProgress);
    };
  }, [scrollProgress]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary z-50"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrollProgress / 100 }}
        transition={{ duration: 0.1 }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Floating Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: scrollProgress > 5 ? 1 : 0, y: scrollProgress > 5 ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 right-4 z-40 hidden lg:block"
      >
        <div className="bg-card/90 backdrop-blur-md border border-border/50 rounded-2xl p-4 shadow-elegant">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">
                Reading Progress
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round(scrollProgress)}% complete
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Words read</span>
              <span className="font-medium">{wordsRead.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Time spent</span>
              <span className="font-medium">{formatTime(readingTime)}</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${scrollProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Progress Indicator */}
      <div className="fixed top-16 left-4 right-4 z-40 lg:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: scrollProgress > 5 ? 1 : 0, scale: scrollProgress > 5 ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
          className="bg-card/90 backdrop-blur-md border border-border/50 rounded-xl p-3 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatTime(readingTime)}
            </div>
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-1">
            <motion.div
              className="bg-primary h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${scrollProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};
