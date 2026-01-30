import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Activity,
  Eye,
  Zap,
  Circle,
  Target,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface JointData {
  id: string;
  name: string;
  group: 'head' | 'torso' | 'arms' | 'legs';
  currentAngle: number;
  predictedAngle: number;
  velocity: number;
  confidence: number;
}

interface MotionCapturePanelProps {
  isRecording?: boolean;
}

const skeletonJoints: JointData[] = [
  { id: 'head', name: 'Head', group: 'head', currentAngle: 0, predictedAngle: 5, velocity: 0.2, confidence: 0.95 },
  { id: 'neck', name: 'Neck', group: 'head', currentAngle: 0, predictedAngle: 3, velocity: 0.1, confidence: 0.92 },
  { id: 'spine_upper', name: 'Upper Spine', group: 'torso', currentAngle: 0, predictedAngle: 2, velocity: 0.05, confidence: 0.98 },
  { id: 'spine_lower', name: 'Lower Spine', group: 'torso', currentAngle: 0, predictedAngle: -1, velocity: 0.03, confidence: 0.97 },
  { id: 'l_shoulder', name: 'L. Shoulder', group: 'arms', currentAngle: 45, predictedAngle: 50, velocity: 0.8, confidence: 0.89 },
  { id: 'l_elbow', name: 'L. Elbow', group: 'arms', currentAngle: 30, predictedAngle: 45, velocity: 1.2, confidence: 0.91 },
  { id: 'l_wrist', name: 'L. Wrist', group: 'arms', currentAngle: 0, predictedAngle: 10, velocity: 0.5, confidence: 0.85 },
  { id: 'r_shoulder', name: 'R. Shoulder', group: 'arms', currentAngle: -45, predictedAngle: -40, velocity: 0.6, confidence: 0.90 },
  { id: 'r_elbow', name: 'R. Elbow', group: 'arms', currentAngle: -30, predictedAngle: -20, velocity: 0.9, confidence: 0.88 },
  { id: 'r_wrist', name: 'R. Wrist', group: 'arms', currentAngle: 0, predictedAngle: -5, velocity: 0.4, confidence: 0.84 },
  { id: 'l_hip', name: 'L. Hip', group: 'legs', currentAngle: 0, predictedAngle: 15, velocity: 0.7, confidence: 0.93 },
  { id: 'l_knee', name: 'L. Knee', group: 'legs', currentAngle: 0, predictedAngle: 30, velocity: 1.5, confidence: 0.94 },
  { id: 'l_ankle', name: 'L. Ankle', group: 'legs', currentAngle: 0, predictedAngle: 5, velocity: 0.3, confidence: 0.87 },
  { id: 'r_hip', name: 'R. Hip', group: 'legs', currentAngle: 0, predictedAngle: -10, velocity: 0.5, confidence: 0.92 },
  { id: 'r_knee', name: 'R. Knee', group: 'legs', currentAngle: 0, predictedAngle: -5, velocity: 0.6, confidence: 0.91 },
  { id: 'r_ankle', name: 'R. Ankle', group: 'legs', currentAngle: 0, predictedAngle: -3, velocity: 0.2, confidence: 0.86 },
];

export function MotionCapturePanel({ isRecording = false }: MotionCapturePanelProps) {
  const [joints, setJoints] = useState<JointData[]>(skeletonJoints);
  const [showPrediction, setShowPrediction] = useState(true);
  const [predictionFrames, setPredictionFrames] = useState([5]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isLive, setIsLive] = useState(false);

  // Simulate live motion capture data
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setJoints(prev => prev.map(joint => {
        const noise = (Math.random() - 0.5) * 10;
        const predictedNoise = (Math.random() - 0.5) * 15;
        return {
          ...joint,
          currentAngle: joint.currentAngle + noise * 0.1,
          predictedAngle: joint.currentAngle + predictedNoise + (joint.velocity * predictionFrames[0]),
          velocity: Math.max(0, joint.velocity + (Math.random() - 0.5) * 0.2),
          confidence: Math.min(1, Math.max(0.5, joint.confidence + (Math.random() - 0.5) * 0.05)),
        };
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [isLive, predictionFrames]);

  const filteredJoints = selectedGroup === 'all' 
    ? joints 
    : joints.filter(j => j.group === selectedGroup);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-success';
    if (confidence >= 0.8) return 'text-warning';
    return 'text-destructive';
  };

  const getMovementIndicator = (current: number, predicted: number) => {
    const diff = predicted - current;
    if (Math.abs(diff) < 2) return null;
    if (diff > 0) return <ArrowUp className="w-3 h-3 text-success" />;
    return <ArrowDown className="w-3 h-3 text-primary" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-xl p-4 w-80 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-display text-sm font-semibold">Motion Capture</h3>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge variant="outline" className="text-xs bg-success/20 text-success border-success/30">
              <Circle className="w-2 h-2 fill-current mr-1 animate-pulse" />
              LIVE
            </Badge>
          )}
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-2">
            <Eye className="w-3 h-3" />
            Show Joint Prediction
          </Label>
          <Switch
            checked={showPrediction}
            onCheckedChange={setShowPrediction}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs flex items-center gap-2">
            <Zap className="w-3 h-3" />
            Live Capture
          </Label>
          <Switch
            checked={isLive}
            onCheckedChange={setIsLive}
          />
        </div>

        {showPrediction && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Prediction Frames Ahead</Label>
              <span className="text-xs text-muted-foreground font-mono">{predictionFrames[0]}f</span>
            </div>
            <Slider
              value={predictionFrames}
              onValueChange={setPredictionFrames}
              min={1}
              max={30}
              step={1}
              className="w-full"
            />
          </div>
        )}
      </div>

      <Separator className="bg-border/50" />

      {/* Body Group Filter */}
      <div className="flex gap-1 flex-wrap">
        {['all', 'head', 'torso', 'arms', 'legs'].map((group) => (
          <Button
            key={group}
            variant={selectedGroup === group ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7 px-2 capitalize"
            onClick={() => setSelectedGroup(group)}
          >
            {group}
          </Button>
        ))}
      </div>

      {/* Skeleton Visualization */}
      <div className="relative h-32 bg-muted/30 rounded-lg border border-border/50 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 100 120" className="h-full w-auto">
          {/* Head */}
          <motion.circle
            cx="50" cy="15" r="8"
            className="fill-primary/30 stroke-primary stroke-2"
            animate={{ scale: isLive ? [1, 1.05, 1] : 1 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          {/* Neck */}
          <line x1="50" y1="23" x2="50" y2="30" className="stroke-primary/50 stroke-2" />
          {/* Torso */}
          <line x1="50" y1="30" x2="50" y2="60" className="stroke-primary/50 stroke-2" />
          {/* Shoulders */}
          <line x1="30" y1="35" x2="70" y2="35" className="stroke-primary/50 stroke-2" />
          {/* Left Arm */}
          <motion.line
            x1="30" y1="35" x2="20" y2="55"
            className="stroke-primary stroke-2"
            animate={isLive ? { x2: [20, 18, 22, 20], y2: [55, 53, 57, 55] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.line
            x1="20" y1="55" x2="15" y2="70"
            className="stroke-primary stroke-2"
            animate={isLive ? { x2: [15, 12, 18, 15] } : {}}
            transition={{ repeat: Infinity, duration: 0.6 }}
          />
          {/* Right Arm */}
          <motion.line
            x1="70" y1="35" x2="80" y2="55"
            className="stroke-secondary stroke-2"
            animate={isLive ? { x2: [80, 82, 78, 80], y2: [55, 57, 53, 55] } : {}}
            transition={{ repeat: Infinity, duration: 0.9 }}
          />
          <motion.line
            x1="80" y1="55" x2="85" y2="70"
            className="stroke-secondary stroke-2"
            animate={isLive ? { x2: [85, 88, 82, 85] } : {}}
            transition={{ repeat: Infinity, duration: 0.7 }}
          />
          {/* Hips */}
          <line x1="40" y1="60" x2="60" y2="60" className="stroke-primary/50 stroke-2" />
          {/* Left Leg */}
          <motion.line
            x1="40" y1="60" x2="35" y2="85"
            className="stroke-primary stroke-2"
            animate={isLive ? { x2: [35, 33, 37, 35] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
          <line x1="35" y1="85" x2="33" y2="110" className="stroke-primary stroke-2" />
          {/* Right Leg */}
          <motion.line
            x1="60" y1="60" x2="65" y2="85"
            className="stroke-secondary stroke-2"
            animate={isLive ? { x2: [65, 67, 63, 65] } : {}}
            transition={{ repeat: Infinity, duration: 0.55 }}
          />
          <line x1="65" y1="85" x2="67" y2="110" className="stroke-secondary stroke-2" />
          
          {/* Prediction indicators */}
          {showPrediction && isLive && (
            <>
              <motion.circle
                cx="15" cy="70" r="4"
                className="fill-warning/50 stroke-warning stroke-1"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
              />
              <motion.circle
                cx="85" cy="70" r="4"
                className="fill-warning/50 stroke-warning stroke-1"
                animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }}
              />
            </>
          )}
        </svg>
        
        {showPrediction && (
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-[10px] bg-warning/20 text-warning border-warning/30">
              <Target className="w-2.5 h-2.5 mr-1" />
              Predicting
            </Badge>
          </div>
        )}
      </div>

      {/* Joint List */}
      <ScrollArea className="h-40">
        <div className="space-y-1">
          {filteredJoints.map((joint) => (
            <motion.div
              key={joint.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/30 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getConfidenceColor(joint.confidence)} bg-current`} />
                <span className="text-xs font-medium">{joint.name}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-mono">{joint.currentAngle.toFixed(1)}°</div>
                  {showPrediction && (
                    <div className="flex items-center gap-1 text-[10px] text-warning">
                      {getMovementIndicator(joint.currentAngle, joint.predictedAngle)}
                      <span>{joint.predictedAngle.toFixed(1)}°</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-muted-foreground w-8 text-right">
                  {(joint.confidence * 100).toFixed(0)}%
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>16 joints tracked</span>
        <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
          <RotateCcw className="w-3 h-3" />
          Reset Pose
        </Button>
      </div>
    </motion.div>
  );
}
