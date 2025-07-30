import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Bot, Sparkles, Copy, Download, RefreshCw, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeneratedContent } from "@/hooks/useGeneratedContent";

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}

const aiTools: AITool[] = [
  {
    id: "viral-twitter",
    name: "Viral Twitter Thread",
    description: "Generate engaging Twitter threads that drive engagement",
    category: "Content",
    prompt: "Create a viral Twitter thread about [TOPIC] that provides value, includes hooks, and encourages sharing. Make it 5-7 tweets long."
  },
  {
    id: "landing-page",
    name: "Landing Page Copy",
    description: "Write high-converting landing page copy",
    category: "Sales",
    prompt: "Write compelling landing page copy for [PRODUCT] that addresses pain points, shows benefits, and includes a strong CTA."
  },
  {
    id: "email-sequence",
    name: "Email Sequence",
    description: "Create nurturing email sequences",
    category: "Email",
    prompt: "Create a 5-email welcome sequence for [NICHE] that builds trust, provides value, and leads to [PRODUCT] purchase."
  },
  {
    id: "product-idea",
    name: "Digital Product Ideas",
    description: "Generate profitable digital product concepts",
    category: "Products",
    prompt: "Generate 10 digital product ideas for [NICHE] that solve real problems, can be created quickly, and priced between $10-100."
  }
];

export function AIToolkit() {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const { contentHistory, saveGeneratedContent } = useGeneratedContent();

  const generateContent = async () => {
    if (!selectedTool || !topic) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(async () => {
      const prompt = selectedTool.prompt.replace("[TOPIC]", topic).replace("[PRODUCT]", topic).replace("[NICHE]", topic);
      const content = `Generated content for: ${prompt}\n\n[This would be AI-generated content based on your input. In a real implementation, this would connect to OpenAI, Claude, or another AI service to generate actual content.]`;
      
      setGeneratedContent(content);
      await saveGeneratedContent(selectedTool.id, topic, content);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready to use.",
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Content Toolkit
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {aiTools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                selectedTool?.id === tool.id ? 'ring-2 ring-primary' : ''
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
                <p className="text-xs text-muted-foreground">{tool.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {selectedTool && (
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {selectedTool.name}
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Topic/Subject</label>
                <Input
                  placeholder="Enter your topic, product, or niche..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={generateContent}
                disabled={!topic || isGenerating}
                variant="hero"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
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

        {showHistory && contentHistory.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Content</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {contentHistory.map((item) => (
                <Card key={item.id} className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => setGeneratedContent(item.content)}>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium truncate">{item.topic}</p>
                      <Badge variant="secondary" className="text-xs">
                        {aiTools.find(t => t.id === item.tool_id)?.name || 'Unknown'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {generatedContent && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Generated Content</h4>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3 mr-1" />
                  Export
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
      </CardContent>
    </Card>
  );
}