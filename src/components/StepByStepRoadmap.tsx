import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Clock, ArrowRight, Check } from 'lucide-react';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { useRoadmapTaskProgress } from '@/hooks/useRoadmapTaskProgress';

interface Step {
  id: number;
  title: string;
  description: string;
  timeline: string;
  status: 'completed' | 'in-progress' | 'pending';
  revenue: string;
  tools: string[];
}

const roadmapSteps: Step[] = [
  { id: 1, title: 'AI Content Factory Setup', description: 'Build your AI-powered content creation system using ChatGPT, Claude, and automation tools', timeline: 'Days 1-7', status: 'in-progress', revenue: '$0-500', tools: ['ChatGPT', 'Claude', 'Zapier', 'Buffer'] },
  { id: 2, title: 'Digital Product Creation', description: 'Create your first digital products: guides, templates, and mini-courses', timeline: 'Days 8-21', status: 'pending', revenue: '$500-1500', tools: ['Canva', 'Notion', 'Gumroad', 'Lemon Squeezy'] },
  { id: 3, title: 'Audience Building Engine', description: 'Launch viral content loops on Twitter, LinkedIn, and TikTok', timeline: 'Days 22-45', status: 'pending', revenue: '$1500-3000', tools: ['Hootsuite', 'Hypefury', 'TikTok Creator', 'LinkedIn'] },
  { id: 4, title: 'Email Automation System', description: 'Build email sequences that convert followers into customers automatically', timeline: 'Days 46-60', status: 'pending', revenue: '$3000-4000', tools: ['ConvertKit', 'Mailchimp', 'Typeform', 'Calendly'] },
  { id: 5, title: 'Scaling & Optimization', description: 'Scale successful products and optimize for $5000+ recurring revenue', timeline: 'Days 61-90', status: 'pending', revenue: '$4000-5000+', tools: ['Google Analytics', 'Hotjar', 'A/B Testing', 'Affiliate Programs'] }
];

export function StepByStepRoadmap() {
  const { getStepStatus, updateStepStatus } = useRoadmapProgress();
  const { toggleTaskCompletion, isTaskCompleted } = useRoadmapTaskProgress();

  const getStatusIcon = (status: Step['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-warning" />;
      default: return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: Step['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          90-Day Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {roadmapSteps.map((step) => {
          const actualStatus = getStepStatus(step.id);
          const previousStatus = step.id > 1 ? getStepStatus(step.id - 1) : 'completed';
          const canStart = step.id === 1 || previousStatus === 'completed';

          return (
            <Card key={step.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{getStatusIcon(actualStatus)}</div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                    <Badge variant={getStatusColor(actualStatus)}>{actualStatus.replace('-', ' ')}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="outline">{step.timeline}</Badge>
                    <Badge variant="outline" className="text-success">{step.revenue}</Badge>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tools & Platforms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {step.tools.map(tool => {
                        const isCompleted = isTaskCompleted(step.id, tool);
                        return (
                          <div
                            key={tool}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs cursor-pointer transition-colors ${
                              isCompleted 
                                ? 'bg-success/20 text-success-foreground border border-success/30' 
                                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                            }`}
                            onClick={() => toggleTaskCompletion(step.id, tool)}
                          >
                            <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                              isCompleted ? 'bg-success border-success' : 'border-muted-foreground'
                            }`}>
                              {isCompleted && <Check className="w-2 h-2 text-white" />}
                            </div>
                            <span>{tool}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {actualStatus === 'completed' && (
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => updateStepStatus(step.id, 'in-progress')}>
                      Mark In Progress
                    </Button>
                  )}

                  {actualStatus === 'in-progress' && (
                    <div className="flex gap-2 mt-2">
                      <Button variant="hero" size="sm" onClick={() => updateStepStatus(step.id, 'completed')}>
                        Mark Complete
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => updateStepStatus(step.id, 'pending')}>
                        Reset
                      </Button>
                    </div>
                  )}

                  {actualStatus === 'pending' && canStart && (
                    <Button variant="hero" size="sm" className="mt-2" onClick={() => updateStepStatus(step.id, 'in-progress')}>
                      Start Step
                    </Button>
                  )}

                  {actualStatus === 'pending' && !canStart && (
                    <Button variant="outline" size="sm" className="mt-2" disabled>
                      Complete Previous Steps
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
