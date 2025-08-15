import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Video, 
  Music, 
  MessageSquare, 
  Upload,
  Loader2,
  CheckCircle,
  AlertCircle,
  type LucideIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  icon: LucideIcon;
  progress?: number;
}

const initialSteps: WorkflowStep[] = [
  {
    id: 'generate-prompt',
    name: 'Generate Content Prompt',
    status: 'pending',
    description: 'AI generates optimized prompts for viral content',
    icon: MessageSquare
  },
  {
    id: 'text-to-audio',
    name: 'Text to Audio',
    status: 'pending',
    description: 'Convert text to high-quality speech',
    icon: Music
  },
  {
    id: 'audio-to-video',
    name: 'Audio to Video',
    status: 'pending',
    description: 'Create engaging video from audio',
    icon: Video
  },
  {
    id: 'post-social',
    name: 'Post to Social Media',
    status: 'pending',
    description: 'Auto-post to TikTok, Instagram, YouTube Shorts',
    icon: Upload
  }
];

const NICHES = [
  'AI',
  'Productivity',
  'Entrepreneurship',
  'Marketing',
  'Personal Finance',
  'Tech',
  'Fitness',
  'Self-Improvement',
];

const FALLBACK_TOPICS: Record<string, string[]> = {
  AI: [
    '5 AI tools to automate your content workflow',
    'How to use AI to script videos faster',
    'Beginner-friendly AI content creation tips',
    'Best AI prompts for viral hooks',
  ],
  Productivity: [
    '3 time-blocking tips for busy creators',
    'Morning routine that actually boosts output',
    'How to focus for 2 hours without burnout',
  ],
  Entrepreneurship: [
    'Low-cost business ideas for creators',
    'Validate your idea in 48 hours',
    'Avoid these 3 mistakes launching products',
  ],
  Marketing: [
    'Steal these 3 hooks for your next video',
    'How to repurpose one video into 10 posts',
    'CTA frameworks that convert viewers to buyers',
  ],
  'Personal Finance': [
    '3 money habits for creators',
    'How to budget inconsistent income',
    'Beginner investing for freelancers',
  ],
  Tech: [
    'Top 3 creator gadgets under $100',
    'How to edit faster with keyboard shortcuts',
    'Budget lighting setup for reels',
  ],
  Fitness: [
    '5 quick desk stretches for creators',
    'Healthy snacks when editing all day',
    'Beginner home workout in 10 minutes',
  ],
  'Self-Improvement': [
    'Beat perfectionism and publish more',
    'How to build a daily creator habit',
    'Mindset shifts to show up on camera',
  ],
  General: [
    '3 video ideas you can record today',
    'How to go from 0 to 1k followers',
  ],
};

export function AIAgentWorkflow() {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [topic, setTopic] = useState("");
  const [autoTopic, setAutoTopic] = useState(true);
  const [niche, setNiche] = useState<string>('AI');
  const [style, setStyle] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [duration, setDuration] = useState("30");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: WorkflowStep['status'], progress?: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ));
  };

  const autoPickTopic = async (): Promise<string> => {
    // Try Edge Function first (if implemented), then fallback
    try {
      const { data, error } = await supabase.functions.invoke('ai-content-generator', {
        body: {
          type: 'topic-ideas',
          niche,
          style,
          count: 5,
        }
      });
      if (error) throw error;
      const ideas: unknown = data?.topics ?? data?.ideas ?? [];
      if (Array.isArray(ideas) && ideas.length > 0 && typeof ideas[0] === 'string') {
        return ideas[0] as string;
      }
    } catch {
      // ignore and fallback
    }
    const pool = FALLBACK_TOPICS[niche] ?? FALLBACK_TOPICS['General'];
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const generateContentPrompt = async (topic: string, style: string, duration: string) => {
    const { data, error } = await supabase.functions.invoke('ai-content-generator', {
      body: {
        topic,
        style,
        duration: parseInt(duration),
        type: 'viral-script'
      }
    });

    if (error) throw error;
    return data.script;
  };

  const textToAudio = async (text: string, voice: string) => {
    const { data, error } = await supabase.functions.invoke('text-to-speech', {
      body: {
        text,
        voice,
        format: 'mp3'
      }
    });

    if (error) throw error;
    return data.audioUrl;
  };

  const audioToVideo = async (audioUrl: string, topic: string, duration: string) => {
    const { data, error } = await supabase.functions.invoke('audio-to-video', {
      body: {
        audioUrl,
        topic,
        duration: parseInt(duration),
        format: 'mp4',
        aspectRatio: '9:16' // TikTok/Instagram Reels format
      }
    });

    if (error) throw error;
    return data.videoUrl;
  };

  const postToSocialMedia = async (videoUrl: string, caption: string, platforms: string[]) => {
    const results = [];
    
    for (const platform of platforms) {
      try {
        const { data, error } = await supabase.functions.invoke('social-media-poster', {
          body: {
            platform,
            videoUrl,
            caption,
            hashtags: generateHashtags(topic)
          }
        });

        if (error) throw error;
        results.push({ platform, success: true, postId: data.postId });
      } catch (error) {
        results.push({ platform, success: false, error: (error as Error).message });
      }
    }

    return results;
  };

  const generateHashtags = (topic: string) => {
    // Generate relevant hashtags based on topic
    const baseHashtags = ['#viral', '#trending', '#fyp', '#foryou'];
    const topicHashtags = topic.toLowerCase().split(' ').map(word => `#${word}`);
    return [...baseHashtags, ...topicHashtags].slice(0, 10);
  };

  const runWorkflow = async () => {
    if (platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one platform.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    
    try {
      // Auto-pick topic if enabled or missing
      let workingTopic = topic;
      if (autoTopic || !workingTopic) {
        workingTopic = await autoPickTopic();
        setTopic(workingTopic);
        toast({ title: 'Topic selected', description: workingTopic });
      }

      // Step 1: Generate Content Prompt
      updateStepStatus('generate-prompt', 'running');
      const script = await generateContentPrompt(workingTopic, style, duration);
      updateStepStatus('generate-prompt', 'completed');

      // Step 2: Text to Audio
      updateStepStatus('text-to-audio', 'running');
      const audioUrl = await textToAudio(script, voice);
      updateStepStatus('text-to-audio', 'completed');

      // Step 3: Audio to Video
      updateStepStatus('audio-to-video', 'running');
      const videoUrl = await audioToVideo(audioUrl, workingTopic, duration);
      updateStepStatus('audio-to-video', 'completed');

      // Step 4: Post to Social Media
      updateStepStatus('post-social', 'running');
      const results = await postToSocialMedia(videoUrl, script, platforms);
      updateStepStatus('post-social', 'completed');

      toast({
        title: "Workflow Complete!",
        description: `Successfully posted to ${results.filter(r => r.success).length} platforms.`,
      });

    } catch (error) {
      console.error('Workflow error:', error);
      toast({
        title: "Workflow Failed",
        description: (error as Error).message,
        variant: "destructive"
      });
      
      // Mark current running step as error
      setSteps(prev => prev.map(step => 
        step.status === 'running' 
          ? { ...step, status: 'error' }
          : step
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const resetWorkflow = () => {
    setSteps(initialSteps);
    setIsRunning(false);
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusColor = (
    status: WorkflowStep['status']
  ): "success" | "warning" | "destructive" | "secondary" => {
    switch (status) {
      case 'running': return 'warning';
      case 'completed': return 'success';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Content Creation & Social Media Agent
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Automated workflow: Generate content → Create audio → Produce video → Post to social media
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="topic">Content Topic</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="auto-topic" className="text-xs text-muted-foreground">Auto-pick</Label>
                  <Switch id="auto-topic" checked={autoTopic} onCheckedChange={setAutoTopic} disabled={isRunning} />
                </div>
              </div>
              <Input
                id="topic"
                placeholder={autoTopic ? "Auto-selected based on niche" : "e.g., 'productivity tips for entrepreneurs'"}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isRunning || autoTopic}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niche">Niche</Label>
              <Select value={niche} onValueChange={setNiche} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue placeholder="Select niche" />
                </SelectTrigger>
                <SelectContent>
                  {NICHES.map(n => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="style">Content Style</Label>
              <Select value={style} onValueChange={setStyle} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Educational</SelectItem>
                  <SelectItem value="entertaining">Entertaining</SelectItem>
                  <SelectItem value="motivational">Motivational</SelectItem>
                  <SelectItem value="story">Story-telling</SelectItem>
                  <SelectItem value="viral">Viral Hooks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice">Voice Style</Label>
              <Select value={voice} onValueChange={setVoice} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alloy">Alloy (Natural)</SelectItem>
                  <SelectItem value="echo">Echo (Warm)</SelectItem>
                  <SelectItem value="fable">Fable (Storytelling)</SelectItem>
                  <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                  <SelectItem value="nova">Nova (Energetic)</SelectItem>
                  <SelectItem value="shimmer">Shimmer (Calm)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Select value={duration} onValueChange={setDuration} disabled={isRunning}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">60 seconds</SelectItem>
                  <SelectItem value="90">90 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter', 'LinkedIn'].map(platform => (
                <Button
                  key={platform}
                  variant={platforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (platforms.includes(platform)) {
                      setPlatforms(platforms.filter(p => p !== platform));
                    } else {
                      setPlatforms([...platforms, platform]);
                    }
                  }}
                  disabled={isRunning}
                >
                  {platform}
                </Button>
              ))}
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-3">
            <h3 className="font-medium">Workflow Progress</h3>
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    <StepIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{step.name}</span>
                      <Badge variant={getStatusColor(step.status)} className="text-xs">
                        {step.status}
                      </Badge>
                      {getStatusIcon(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={runWorkflow} 
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Workflow...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start AI Workflow
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={resetWorkflow} disabled={isRunning}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}