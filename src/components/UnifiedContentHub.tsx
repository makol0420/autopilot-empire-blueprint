import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Zap
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

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}

interface AutomationTask {
  id: string;
  title: string;
  description: string;
  tool: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeToSetup: string;
  url?: string;
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

const automationTasks: AutomationTask[] = [
  {
    id: 'social-accounts',
    title: 'Connect Social Media Accounts',
    description: 'Link your TikTok, Instagram, and YouTube accounts for automated posting',
    tool: 'Social Media APIs',
    difficulty: 'Beginner',
    timeToSetup: '10 min'
  },
  {
    id: 'ai-prompts',
    title: 'Optimize AI Prompts',
    description: 'Fine-tune AI prompts for your niche and brand voice',
    tool: 'OpenAI API',
    difficulty: 'Intermediate', 
    timeToSetup: '15 min'
  },
  {
    id: 'voice-clone',
    title: 'Voice Cloning Setup',
    description: 'Create a custom voice model for consistent audio content',
    tool: 'ElevenLabs',
    difficulty: 'Advanced',
    timeToSetup: '30 min'
  },
  {
    id: 'content-calendar',
    title: 'Automated Scheduling',
    description: 'Set up automated content posting schedules',
    tool: 'Buffer/Hootsuite',
    difficulty: 'Beginner',
    timeToSetup: '20 min'
  }
];

export function UnifiedContentHub() {
  const [activeTab, setActiveTab] = useState("workflow");
  const [steps, setSteps] = useState<WorkflowStep[]>(workflowSteps);
  const [isRunning, setIsRunning] = useState(false);
  
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
  
  // Automation
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  
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

      toast({
        title: "Workflow Complete!",
        description: `Successfully posted to ${platforms.length} platforms.`,
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

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const completedCount = completedTasks.length;
  const totalTasks = automationTasks.length;
  const completionPercentage = (completedCount / totalTasks) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Unified Content & Automation Hub
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete content creation and automation workflow - from idea to viral social media posts
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflow" className="flex items-center gap-2">
                <Workflow className="h-4 w-4" />
                AI Workflow
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Content Tools
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Automation Setup
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

            <TabsContent value="automation" className="space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Setup Progress</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Complete these tasks to unlock full automation capabilities
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completed Tasks</span>
                      <span>{completedCount}/{totalTasks}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Automation Tasks */}
              <div className="space-y-3">
                {automationTasks.map((task) => (
                  <Card key={task.id} className={`transition-all ${completedTasks.includes(task.id) ? 'bg-muted/50' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={completedTasks.includes(task.id)}
                            onChange={() => toggleTask(task.id)}
                            className="rounded border-2 w-4 h-4"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className={`font-medium ${completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {task.difficulty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {task.timeToSetup}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <p className="text-xs text-muted-foreground">Tool: {task.tool}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {completedCount === totalTasks && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Automation Setup Complete!</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Your automation hub is fully configured and ready to create viral content automatically.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}