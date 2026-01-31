import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Trophy, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Crown,
  Award,
  Sparkles,
  ThumbsUp,
  Eye,
  Share2,
  User
} from 'lucide-react';
import { toast } from 'sonner';

// Community creation interface
interface CommunityCreation {
  id: string;
  title: string;
  creator: string;
  creatorAvatar?: string;
  thumbnailUrl: string;
  votes: number;
  views: number;
  category: 'character' | 'environment' | 'animation' | 'game' | 'short-film';
  featured: boolean;
  rank: number;
  createdAt: Date;
}

// Mock data for featured creations
const FEATURED_CREATIONS: CommunityCreation[] = [
  {
    id: '1',
    title: 'Cyberpunk Street Scene',
    creator: 'NeonArtist',
    thumbnailUrl: '/placeholder.svg',
    votes: 2847,
    views: 15420,
    category: 'environment',
    featured: true,
    rank: 1,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Warrior Princess',
    creator: 'CharacterMaster',
    thumbnailUrl: '/placeholder.svg',
    votes: 2156,
    views: 12300,
    category: 'character',
    featured: true,
    rank: 2,
    createdAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Dragon Flight Animation',
    creator: 'MotionWizard',
    thumbnailUrl: '/placeholder.svg',
    votes: 1932,
    views: 9870,
    category: 'animation',
    featured: true,
    rank: 3,
    createdAt: new Date('2024-01-13'),
  },
  {
    id: '4',
    title: 'Medieval Castle Defense',
    creator: 'GameDevPro',
    thumbnailUrl: '/placeholder.svg',
    votes: 1645,
    views: 8540,
    category: 'game',
    featured: false,
    rank: 4,
    createdAt: new Date('2024-01-12'),
  },
  {
    id: '5',
    title: 'The Last Journey',
    creator: 'CinematicArt',
    thumbnailUrl: '/placeholder.svg',
    votes: 1423,
    views: 7200,
    category: 'short-film',
    featured: false,
    rank: 5,
    createdAt: new Date('2024-01-11'),
  },
];

interface CommunitySpotlightProps {
  position?: 'top' | 'bottom';
  showVoting?: boolean;
  maxItems?: number;
}

export function CommunitySpotlight({ 
  position = 'bottom', 
  showVoting = true,
  maxItems = 5 
}: CommunitySpotlightProps) {
  const [creations, setCreations] = useState<CommunityCreation[]>(FEATURED_CREATIONS.slice(0, maxItems));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const [isHovering, setIsHovering] = useState(false);
  
  // Auto-rotate carousel
  useEffect(() => {
    if (isHovering) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % creations.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [creations.length, isHovering]);
  
  const handleVote = (creationId: string) => {
    if (votedIds.has(creationId)) {
      toast.info('You already voted for this creation!');
      return;
    }
    
    setVotedIds((prev) => new Set(prev).add(creationId));
    setCreations((prev) => 
      prev.map((c) => 
        c.id === creationId ? { ...c, votes: c.votes + 1 } : c
      ).sort((a, b) => b.votes - a.votes)
    );
    
    toast.success('Vote recorded! 🎉');
  };
  
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % creations.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + creations.length) % creations.length);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-amber-400" />;
      case 2: return <Award className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <Star className="w-5 h-5 text-primary" />;
    }
  };
  
  const getCategoryColor = (category: CommunityCreation['category']) => {
    const colors = {
      character: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      environment: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      animation: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      game: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'short-film': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    };
    return colors[category];
  };

  return (
    <section className={`py-16 ${position === 'top' ? 'border-b' : 'border-t'} border-primary/20`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-amber-500/30 mb-6"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">Community Spotlight</span>
          </motion.div>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Featured Creations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vote for your favorite creations! The top-voted projects get featured on the homepage.
          </p>
        </div>
        
        {/* Featured Winner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative max-w-4xl mx-auto">
            {/* Navigation arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-background/50 backdrop-blur-sm"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-background/50 backdrop-blur-sm"
              onClick={nextSlide}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-primary/20">
                  <div className="grid md:grid-cols-2 gap-0">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                      <img 
                        src={creations[currentIndex].thumbnailUrl} 
                        alt={creations[currentIndex].title}
                        className="w-full h-full object-cover"
                      />
                      {creations[currentIndex].featured && (
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-amber-500 text-black gap-1">
                            <Crown className="w-3 h-3" />
                            Featured
                          </Badge>
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        {getRankIcon(creations[currentIndex].rank)}
                      </div>
                    </div>
                    
                    {/* Details */}
                    <CardContent className="p-6 flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className={`mb-3 ${getCategoryColor(creations[currentIndex].category)}`}>
                          {creations[currentIndex].category}
                        </Badge>
                        
                        <h3 className="font-display text-2xl font-bold mb-2">
                          {creations[currentIndex].title}
                        </h3>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-muted-foreground">
                            by <span className="text-foreground font-medium">{creations[currentIndex].creator}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {creations[currentIndex].views.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {creations[currentIndex].votes.toLocaleString()} votes
                          </span>
                        </div>
                      </div>
                      
                      {showVoting && (
                        <div className="flex gap-3 mt-6">
                          <Button 
                            variant="cyber" 
                            className="flex-1 gap-2"
                            onClick={() => handleVote(creations[currentIndex].id)}
                            disabled={votedIds.has(creations[currentIndex].id)}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {votedIds.has(creations[currentIndex].id) ? 'Voted!' : 'Vote'}
                          </Button>
                          <Button variant="outline" size="icon">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
            
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {creations.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex 
                      ? 'w-6 bg-primary' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Leaderboard grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {creations.map((creation, idx) => (
            <motion.div
              key={creation.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              <Card className={`overflow-hidden transition-all ${
                idx === currentIndex 
                  ? 'border-primary shadow-[0_0_20px_hsl(var(--primary)/0.3)]' 
                  : 'border-primary/10 hover:border-primary/30'
              }`}>
                <div className="aspect-square relative">
                  <img 
                    src={creation.thumbnailUrl} 
                    alt={creation.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded px-2 py-0.5">
                    {getRankIcon(creation.rank)}
                    <span className="text-xs font-bold">#{creation.rank}</span>
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs font-medium truncate">{creation.title}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {creation.votes.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want your creation featured? Submit your best work!
          </p>
          <Button variant="outline" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Submit Your Creation
          </Button>
        </div>
      </div>
    </section>
  );
}
