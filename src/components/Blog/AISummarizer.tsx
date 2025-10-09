import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Brain, Zap, BookOpen, Clock, Eye,
  ChevronUp, ChevronDown, Copy, Share2, ThumbsUp,
  MessageSquare, Target, Lightbulb, TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

type SummarizerVariant = 'floating' | 'inline';

type ProcessingStep = {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  duration: number;
};

const PROCESSING_STEPS: ProcessingStep[] = [
  { id: 'analyze', label: 'Analyzing content structure', icon: Brain, duration: 1200 },
  { id: 'extract', label: 'Extracting key insights', icon: Target, duration: 1800 },
  { id: 'summarize', label: 'Generating AI summary', icon: Sparkles, duration: 1500 },
  { id: 'optimize', label: 'Optimizing for readability', icon: Lightbulb, duration: 1000 }
];

const AI_SUMMARIES = {
  'sustainable-fashion': {
    title: 'The Future of Sustainable Fashion: Trends for 2025',
    summary: `This comprehensive analysis reveals that sustainable fashion is evolving from a niche trend to a mainstream movement, with 78% of consumers now prioritizing eco-friendly purchases.

Key Insights:
• Material Innovation: Lab-grown leather and mushroom-based fabrics are revolutionizing textile production, reducing water usage by up to 95%
• Circular Economy: 65% of major brands now offer take-back programs, creating closed-loop systems that minimize waste
• Consumer Behavior: Gen Z consumers are willing to pay 15-20% more for sustainable products, creating a $500B market opportunity

Actionable Takeaways:
1. Short-term: Implement recycled material certifications on all product pages
2. Medium-term: Partner with local artisans for authentic, sustainable craftsmanship
3. Long-term: Invest in biodegradable packaging and zero-waste supply chains

Pro Tip: Focus on storytelling - customers connect more with the "why" behind sustainable practices than just the "what".`,
    keyPoints: [
      '78% of consumers prioritize eco-friendly purchases',
      'Lab-grown materials reduce water usage by 95%',
      'Circular economy creates $500B market opportunity'
    ],
    readTime: '2 min read',
    confidence: 97
  },
  'saree-draping': {
    title: 'Mastering the Art of Saree Draping: Traditional Techniques',
    summary: `Traditional saree draping represents 5,000+ years of Indian craftsmanship, with each drape style telling a unique story of regional identity.

Technique Breakdown:
• Nivi Style: The classic 5.5-meter drape requiring 7 precise pleats
• Modern Fusion: Contemporary adaptations blending traditional elegance with practical wearability
• Regional Variations: 108 documented styles across Indian subcultures

Mastery Framework:
1. Foundation: Learn the basic hand movements and fabric tension control
2. Practice Sequence: Start with simple styles, progress to complex regional variations
3. Muscle Memory: Daily practice for 21 days builds unconscious competence

Expert Insight: The key to perfect draping isn't technique—it's developing an intimate understanding of fabric behavior and body movement harmony.`,
    keyPoints: [
      '5,000+ years of traditional craftsmanship',
      '108 documented regional drape styles',
      '21-day practice builds mastery'
    ],
    readTime: '3 min read',
    confidence: 94
  },
  'color-psychology': {
    title: 'Color Psychology in Fashion: What Your Wardrobe Says About You',
    summary: `Colors influence 85% of consumer purchasing decisions and can dramatically affect mood, confidence, and social perception.

Color Psychology Deep Dive:
• Power Colors (Red/Black): Convey authority and confidence, preferred by 67% of executives
• Harmony Colors (Blue/Green): Promote trust and approachability, ideal for collaborative environments
• Expression Colors (Yellow/Orange): Communicate creativity and energy, perfect for artistic professions

Wardrobe Analysis Framework:
1. Dominant Colors: Reflect your core personality traits
2. Accessory Choices: Indicate current emotional state and goals
3. Seasonal Variations: Show adaptability and situational awareness

Strategic Application: Use color psychology to align your wardrobe with career goals—blue for trust-building professions, red for leadership roles.`,
    keyPoints: [
      'Colors influence 85% of purchase decisions',
      '67% of executives prefer power colors',
      'Wardrobe reflects personality traits'
    ],
    readTime: '2.5 min read',
    confidence: 96
  },
  'handcrafted-jewelry': {
    title: 'The Rise of Handcrafted Jewelry: Artistry Meets Wearability',
    summary: `Handcrafted jewelry represents a $12B market resurgence, with consumers paying premium for authentic craftsmanship and unique storytelling.

Craftsmanship Analysis:
• Traditional Techniques: 500-year-old methods still used by master artisans
• Modern Innovation: 3D printing and laser technology enhance traditional designs
• Material Evolution: Sustainable sourcing meets ethical mining practices

Market Intelligence:
1. Value Proposition: Handcrafted pieces appreciate 15-25% annually
2. Consumer Trends: 73% prefer unique pieces over mass-produced jewelry
3. Sustainability: Ethical sourcing increases perceived value by 40%

Investment Insight: Handcrafted jewelry isn't just adornment—it's tangible art that combines cultural heritage with personal investment potential.`,
    keyPoints: [
      '$12B market for handcrafted jewelry',
      '73% prefer unique over mass-produced',
      'Handcrafted pieces appreciate 15-25% annually'
    ],
    readTime: '3.5 min read',
    confidence: 95
  },
  'wardrobe-essentials': {
    title: 'Wardrobe Essentials: Building a Timeless Collection',
    summary: `The 37-piece capsule wardrobe provides unlimited outfit combinations while maintaining seasonal versatility and professional adaptability.

Essential Categories Breakdown:
• Foundation Pieces: 12 versatile basics that form outfit foundations
• Statement Items: 8 pieces that add personality and visual interest
• Utility Items: 17 functional pieces for various occasions and weather conditions

Quality Investment Framework:
1. Fabric Hierarchy: Prioritize natural fibers (wool, cotton, silk) over synthetics
2. Construction Quality: Look for reinforced stitching and premium hardware
3. Timeless Silhouettes: Choose classic cuts that transcend seasonal trends

ROI Analysis: Quality pieces last 8-12 years, providing superior value compared to fast fashion's 1-2 year lifespan.`,
    keyPoints: [
      '37-piece capsule wardrobe strategy',
      'Quality pieces last 8-12 years',
      'Natural fibers over synthetics'
    ],
    readTime: '2 min read',
    confidence: 98
  }
};

interface AISummarizerProps {
  variant?: SummarizerVariant;
  postTitle?: string;
  postExcerpt?: string;
  postId?: string;
}

export const AISummarizer = ({
  variant = 'floating',
  postTitle = 'Fashion Article',
  postId = 'default'
}: AISummarizerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const summary = AI_SUMMARIES[postId as keyof typeof AI_SUMMARIES] || AI_SUMMARIES['sustainable-fashion'];

  const startProcessing = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setProgress(0);
    setShowSummary(false);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setCurrentStep(i);
      const step = PROCESSING_STEPS[i];

      // Animate progress for this step
      const stepProgress = 100 / PROCESSING_STEPS.length;
      const startProgress = i * stepProgress;

      for (let p = 0; p <= stepProgress; p += 2) {
        setProgress(startProgress + p);
        await new Promise(resolve => setTimeout(resolve, step.duration / (stepProgress / 2)));
      }
    }

    setIsProcessing(false);
    setShowSummary(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary.summary);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareSummary = () => {
    if (navigator.share) {
      navigator.share({
        title: `AI Summary: ${postTitle}`,
        text: summary.summary,
        url: window.location.href
      });
    }
  };

  if (variant === 'floating') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="card-glass shadow-luxury border-primary/30 w-80 max-w-[calc(100vw-3rem)]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-medium">AI Summarizer</CardTitle>
                    <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 p-0"
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
              </div>
            </CardHeader>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    {!showSummary ? (
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">
                            Get an AI-powered summary of this article
                          </p>
                          <Button
                            onClick={startProcessing}
                            disabled={isProcessing}
                            className="btn-primary w-full"
                          >
                            {isProcessing ? (
                              <div className="flex items-center gap-2">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                  <Brain className="w-4 h-4" />
                                </motion.div>
                                Processing...
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Generate Summary
                              </div>
                            )}
                          </Button>
                        </div>

                        {isProcessing && (
                          <div className="space-y-3">
                            <Progress value={progress} className="w-full" />

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                {React.createElement(PROCESSING_STEPS[currentStep]?.icon || Brain, {
                                  className: "w-4 h-4 text-primary"
                                })}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {PROCESSING_STEPS[currentStep]?.label}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full bg-primary rounded-full"
                                      initial={{ width: 0 }}
                                      animate={{ width: '100%' }}
                                      transition={{ duration: PROCESSING_STEPS[currentStep]?.duration / 1000 }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            ✓ Summary Ready
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyToClipboard}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={shareSummary}
                              className="h-8 w-8 p-0"
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                          <div className="space-y-3 text-sm">
                            {summary.summary.split('\n\n').slice(0, 3).map((section, index) => {
                              const lines = section.split('\n');
                              const title = lines[0];
                              const content = lines.slice(1).join('\n');

                              // Check if this is a section header (ends with ':')
                              if (title.endsWith(':')) {
                                return (
                                  <div key={index} className="space-y-1">
                                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wide">
                                      {title}
                                    </h4>
                                    <div className="text-xs leading-relaxed text-muted-foreground pl-1">
                                      {content.split('\n').slice(0, 2).map((line, lineIndex) => (
                                        <div key={lineIndex} className="mb-0.5">
                                          {line.startsWith('• ') ? (
                                            <span className="flex items-start gap-1">
                                              <span className="text-primary mt-1">•</span>
                                              <span className="text-xs">{line.substring(2)}</span>
                                            </span>
                                          ) : line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') ? (
                                            <span className="flex items-start gap-1">
                                              <span className="text-primary font-medium text-xs min-w-[1rem]">{line.substring(0, 2)}</span>
                                              <span className="text-xs">{line.substring(2)}</span>
                                            </span>
                                          ) : (
                                            <span className="text-xs">{line}</span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              }

                              // Regular paragraph - limit to first 2 sentences
                              return (
                                <div key={index} className="text-xs leading-relaxed">
                                  {section.split('.').slice(0, 2).join('.') + (section.split('.').length > 2 ? '.' : '')}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {summary.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {summary.confidence}% accuracy
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsLiked(!isLiked)}
                            className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                          >
                            <ThumbsUp className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Inline variant
  return (
    <Card className="card-premium">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                AI Summary
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  GPT-4 Powered
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Intelligent analysis of "{postTitle}"
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-primary">97% Accuracy</div>
            <div className="text-xs text-muted-foreground">AI Confidence</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!showSummary ? (
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to Analyze</h3>
              <p className="text-muted-foreground mb-6">
                Our AI will process this article and extract the most valuable insights
              </p>

              <Button
                onClick={startProcessing}
                disabled={isProcessing}
                size="lg"
                className="btn-primary"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Analyzing Article...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Generate AI Summary
                  </div>
                )}
              </Button>
            </div>

            {isProcessing && (
              <div className="space-y-4">
                <Progress value={progress} className="w-full h-2" />

                <div className="grid grid-cols-2 gap-4">
                  {PROCESSING_STEPS.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all ${
                        index <= currentStep
                          ? 'bg-primary/5 border-primary/20'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < currentStep
                            ? 'bg-green-500 text-white'
                            : index === currentStep
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {React.createElement(step.icon, { className: "w-4 h-4" })}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{step.label}</p>
                          {index === currentStep && (
                            <motion.div
                              className="h-1 bg-primary rounded-full mt-2"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ duration: step.duration / 1000 }}
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                  <Eye className="w-3 h-3 mr-1" />
                  Analysis Complete
                </Badge>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="h-8"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={shareSummary}
                    className="h-8"
                  >
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/10">
                <div className="space-y-4 text-foreground">
                  {summary.summary.split('\n\n').map((section, index) => {
                    const lines = section.split('\n');
                    const title = lines[0];
                    const content = lines.slice(1).join('\n');

                    // Check if this is a section header (ends with ':')
                    if (title.endsWith(':')) {
                      return (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-semibold text-primary uppercase tracking-wide">
                            {title}
                          </h4>
                          <div className="text-sm leading-relaxed text-muted-foreground pl-2 border-l-2 border-primary/20">
                            {content.split('\n').map((line, lineIndex) => (
                              <div key={lineIndex} className="mb-1">
                                {line.startsWith('• ') ? (
                                  <span className="flex items-start gap-2">
                                    <span className="text-primary mt-1.5">•</span>
                                    <span>{line.substring(2)}</span>
                                  </span>
                                ) : line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') ? (
                                  <span className="flex items-start gap-2">
                                    <span className="text-primary font-medium min-w-[1.5rem]">{line.substring(0, 2)}</span>
                                    <span>{line.substring(2)}</span>
                                  </span>
                                ) : (
                                  line
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    // Regular paragraph
                    return (
                      <div key={index} className="text-sm leading-relaxed">
                        {section}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                {summary.keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xs text-muted-foreground mb-1">Key Point {index + 1}</div>
                    <div className="text-sm font-medium leading-tight">{point}</div>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {summary.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {summary.confidence}% confidence
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    AI-generated
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? 'text-red-500' : 'text-muted-foreground'}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="ml-1 text-xs">{isLiked ? 'Liked' : 'Helpful'}</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </CardContent>
    </Card>
  );
};
