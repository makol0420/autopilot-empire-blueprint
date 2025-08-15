import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  Sparkles,
  Copy,
  Download,
  History,
  Workflow,
  Zap,
  ExternalLink,
  Calendar,
  Clock,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  description: string;
  icon: any;
  progress?: number;
}

interface GeneratedVideo {
  id: string;
  title: string;
  topic: string;
  style: string;
  duration: string;
  platforms: string[];
  status: 'generating' | 'ready' | 'posted' | 'error';
  thumbnailUrl?: string;
  videoUrl?: string;
  createdAt: string;
  postsCompleted: number;
  totalPosts: number;
}

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}

const workflowSteps: WorkflowStep[] = [
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

const aiTools: AITool[] = [
  {
    id: "viral-script",
    name: "Viral Video Script",
    description: "Generate engaging scripts for short-form videos",
    category: "Video",
    prompt: "Create a viral video script about [TOPIC] that hooks viewers in the first 3 seconds, provides value, and encourages sharing. Make it 30-60 seconds long."
  },
  {
    id: "social-caption",
    name: "Social Media Caption",
    description: "Write compelling captions with hashtags",
    category: "Social",
    prompt: "Create an engaging social media caption for [TOPIC] that drives engagement, includes relevant hashtags, and encourages interaction."
  },
  {
    id: "thread-content",
    name: "Twitter Thread",
    description: "Generate viral Twitter threads",
    category: "Social",
    prompt: "Create a viral Twitter thread about [TOPIC] that provides value, includes hooks, and encourages sharing. Make it 5-7 tweets long."
  },
  {
    id: "video-hook",
    name: "Video Hook Generator",
    description: "Create attention-grabbing video openings",
    category: "Video",
    prompt: "Generate 5 powerful hook variations for a video about [TOPIC] that will make viewers stop scrolling and watch."
  }
];

const mockGeneratedVideos: GeneratedVideo[] = [
  {
    id: '1',
    title: 'Productivity Tips for Entrepreneurs',
    topic: 'productivity tips for entrepreneurs',
    style: 'educational',
    duration: '30',
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    status: 'posted',
    createdAt: '2024-01-15T10:30:00Z',
    postsCompleted: 3,
    totalPosts: 3
  },
  {
    id: '2', 
    title: 'Morning Routine Secrets',
    topic: 'morning routine secrets',
    style: 'motivational',
    duration: '60',
    platforms: ['TikTok', 'Instagram Reels'],
    status: 'ready',
    createdAt: '2024-01-14T15:20:00Z',
    postsCompleted: 0,
    totalPosts: 2
  },
  {
    id: '3',
    title: 'Social Media Growth Hacks',
    topic: 'social media growth hacks',
    style: 'viral',
    duration: '45',
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Twitter'],
    status: 'generating',
    createdAt: '2024-01-16T09:15:00Z',
    postsCompleted: 0,
    totalPosts: 4
  }
];

export function UnifiedContentHub() {
  const [activeTab, setActiveTab] = useState("workflow");
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>(mockGeneratedVideos);
  
  // Workflow settings
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [duration, setDuration] = useState("30");
  const [platforms, setPlatforms] = useState<string[]>([]);
  
  // AI Tools
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();

  const updateStepStatus = (stepId: string, status: WorkflowStep['status'], progress?: number) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, progress }
        : step
    ));
  };

  const runWorkflow = async () => {
    if (!topic || !style || platforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one platform.",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    
    try {
      // Step 1: Generate Content Prompt
      updateStepStatus('generate-prompt', 'running');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('generate-prompt', 'completed');

      // Step 2: Text to Audio
      updateStepStatus('text-to-audio', 'running');
      await new Promise(resolve => setTimeout(resolve, 3000));
      updateStepStatus('text-to-audio', 'completed');

      // Step 3: Audio to Video
      updateStepStatus('audio-to-video', 'running');
      await new Promise(resolve => setTimeout(resolve, 4000));
      updateStepStatus('audio-to-video', 'completed');

      // Step 4: Post to Social Media
      updateStepStatus('post-social', 'running');
      await new Promise(resolve => setTimeout(resolve, 2000));
      updateStepStatus('post-social', 'completed');

      // Create a new video entry
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        title: `${style} content about ${topic}`,
        topic,
        style,
        duration,
        platforms: [...platforms],
        status: 'ready',
        createdAt: new Date().toISOString(),
        postsCompleted: platforms.length,
        totalPosts: platforms.length
      };

      setGeneratedVideos(prev => [newVideo, ...prev]);

      toast({
        title: "Workflow Complete!",
        description: `Successfully created content for ${platforms.length} platforms.`,
      });

    } catch (error) {
      console.error('Workflow error:', error);
      toast({
        title: "Workflow Failed",
        description: "Something went wrong during the workflow execution.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const generateContent = async () => {
    if (!selectedTool || !topic) return;

    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const content = `Generated ${selectedTool.name.toLowerCase()} for "${topic}":\n\n[This would be the actual AI-generated content based on the prompt and topic]`;
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready to use.",
      });
    }, 2000);
  };

  const postToSocialMedia = async (videoId: string) => {
    const video = generatedVideos.find(v => v.id === videoId);
    if (!video) return;

    setGeneratedVideos(prev => prev.map(v => 
      v.id === videoId 
        ? { ...v, status: 'posted' as const, postsCompleted: v.totalPosts }
        : v
    ));

    toast({
      title: "Posted Successfully!",
      description: `Content posted to ${video.platforms.length} platforms.`,
    });
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: GeneratedVideo['status']) => {
    switch (status) {
      case 'generating': return 'bg-blue-500';
      case 'ready': return 'bg-yellow-500'; 
      case 'posted': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Unified Content & Automation Hub
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            AI workflow automation and content library - create, track, and distribute viral content
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                Create Content
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Tools
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Content Library
              </TabsTrigger>
            </TabsList>

            <TabsContent value="workflow" className="space-y-6">
              {/* Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Content Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., 'productivity tips for entrepreneurs'"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isRunning}
                  />
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
                {steps.map((step) => {
                  const StepIcon = step.icon;
                  return (
                    <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                        <StepIcon className="h-4 w-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{step.name}</span>
                          <Badge variant={step.status === 'completed' ? 'default' : step.status === 'running' ? 'secondary' : 'outline'} className="text-xs">
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
              <Button 
                onClick={runWorkflow} 
                disabled={isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Workflow...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Complete Workflow
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* AI Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedTool?.id === tool.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedTool(tool)}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{tool.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Content Generator */}
              {selectedTool && (
                <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {selectedTool.name}
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Topic / Subject</Label>
                      <Input
                        placeholder="Enter your topic..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={generateContent}
                      disabled={!topic || isGenerating}
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Generated Content */}
              {generatedContent && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Generated Content</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(generatedContent)}>
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="library" className="space-y-6">
              {/* Generated Videos Library */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Generated Content Library</h3>
                  <Badge variant="secondary" className="text-xs">
                    {generatedVideos.length} videos created
                  </Badge>
                </div>

                <div className="grid gap-4">
                  {generatedVideos.map((video) => (
                    <Card key={video.id} className="relative overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Video Thumbnail Placeholder */}
                          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                          
                          {/* Video Details */}
                          <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(video.status)}`}></div>
                                <Badge variant="outline" className="text-xs">
                                  {video.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {video.platforms.map((platform) => (
                                <Badge key={platform} variant="secondary" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {video.duration}s
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(video.createdAt)}
                              </div>
                            </div>

                            {/* Progress for posting */}
                            {video.status === 'ready' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                  <span>Ready to post</span>
                                  <span>{video.postsCompleted}/{video.totalPosts} platforms</span>
                                </div>
                                <Progress value={(video.postsCompleted / video.totalPosts) * 100} className="h-2" />
                              </div>
                            )}

                            {video.status === 'posted' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-green-600">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Posted successfully
                                  </span>
                                  <span>{video.postsCompleted}/{video.totalPosts} platforms</span>
                                </div>
                                <Progress value={100} className="h-2" />
                              </div>
                            )}

                            {video.status === 'generating' && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-xs text-blue-600">
                                  <span className="flex items-center gap-1">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Generating content...
                                  </span>
                                  <span>0/{video.totalPosts} platforms</span>
                                </div>
                                <Progress value={25} className="h-2" />
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2">
                            {video.status === 'ready' && (
                              <Button
                                size="sm"
                                onClick={() => postToSocialMedia(video.id)}
                                className="text-xs"
                              >
                                <Upload className="h-3 w-3 mr-1" />
                                Post Now
                              </Button>
                            )}
                            
                            {video.status === 'posted' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Posts
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {generatedVideos.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">No content generated yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use the AI workflow to create your first viral content
                      </p>
                      <Button onClick={() => setActiveTab("workflow")} size="sm">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Start Creating
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}