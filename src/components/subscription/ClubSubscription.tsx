import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  Star,
  Gift,
  Vote,
  Sparkles,
  Users,
  Zap,
  ChevronRight,
  Check,
  Trophy,
} from 'lucide-react';
import { useSubscriptionStore, VoteOption } from '@/store/subscriptionStore';
import { toast } from 'sonner';

const clubBenefits = [
  { icon: Sparkles, title: 'Exclusive Models', description: 'Early access to premium character models' },
  { icon: Gift, title: 'Monthly Rewards', description: 'Bonus points and exclusive gear every month' },
  { icon: Vote, title: 'Community Votes', description: 'Vote on what gets added next' },
  { icon: Users, title: 'Developer Priority', description: 'Your requests get developer attention' },
  { icon: Trophy, title: 'Badge & Recognition', description: 'Exclusive club badge on your profile' },
  { icon: Zap, title: '2x Bonus Points', description: 'Earn double points on all activities' },
];

export function ClubSubscription() {
  const { tier, bonusPoints, monthlyVotes, userVotedFor, setTier, voteFor, hasVotedFor } = useSubscriptionStore();

  const handleSubscribe = () => {
    // This would integrate with PayPal
    toast.success('Redirecting to PayPal...');
    // Simulate subscription
    setTimeout(() => {
      setTier('club');
      toast.success('Welcome to the Club! You earned 500 bonus points!');
    }, 1500);
  };

  const handleVote = (optionId: string) => {
    if (tier !== 'club') {
      toast.error('Join the Club to vote!');
      return;
    }
    if (hasVotedFor(optionId)) {
      toast.info('You already voted for this!');
      return;
    }
    voteFor(optionId);
    toast.success('Vote recorded!');
  };

  const totalVotes = monthlyVotes.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 p-6 border border-primary/30"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/20 glow-primary-sm">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold gradient-text">NStudio Club</h2>
              <p className="text-muted-foreground">Exclusive access to premium content</p>
            </div>
          </div>

          {tier === 'club' ? (
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                <Star className="w-3 h-3 mr-1" />
                Active Member
              </Badge>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span className="font-mono font-bold text-warning">{bonusPoints}</span>
                <span className="text-sm text-muted-foreground">Bonus Points</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-3xl font-display font-bold">
                $9.99<span className="text-lg text-muted-foreground font-normal">/month</span>
              </div>
              <Button variant="cyber" className="gap-2" onClick={handleSubscribe}>
                <Crown className="w-4 h-4" />
                Join the Club
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Benefits Grid */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Club Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {clubBenefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <benefit.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Monthly Vote */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-semibold">Monthly Community Vote</h3>
            <p className="text-sm text-muted-foreground">Vote for what gets added next!</p>
          </div>
          <Badge variant="outline">{totalVotes} total votes</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthlyVotes.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const hasVoted = hasVotedFor(option.id);

            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all ${
                    hasVoted
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/30'
                  }`}
                  onClick={() => handleVote(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {option.name}
                          {hasVoted && <Check className="w-4 h-4 text-primary" />}
                        </h4>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {option.category}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{option.votes} votes</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Refund Policy */}
      <Card className="bg-muted/30 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-success" />
            <span>
              <strong>14-Day Money-Back Guarantee</strong> - Full refund within 2 weeks, no questions asked
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
