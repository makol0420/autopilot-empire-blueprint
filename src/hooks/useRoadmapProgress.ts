import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoadmapProgress {
  step_id: number;
  status: 'completed' | 'in-progress' | 'pending';
  completed_at?: string;
}

export const useRoadmapProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [progress, setProgress] = useState<RoadmapProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProgress([]);
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('roadmap_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching roadmap progress:', error);
          return;
        }

        setProgress((data || []).map(item => ({
          step_id: item.step_id,
          status: item.status as 'completed' | 'in-progress' | 'pending',
          completed_at: item.completed_at
        })));
      } catch (error) {
        console.error('Error fetching roadmap progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  const getStepStatus = (stepId: number): 'completed' | 'in-progress' | 'pending' => {
    const stepProgress = progress.find(p => p.step_id === stepId);
    return stepProgress?.status || 'pending';
  };

  const updateStepStatus = async (
    stepId: number,
    status: 'completed' | 'in-progress' | 'pending'
  ) => {
    if (!user) return;

    const currentStatus = getStepStatus(stepId);

    // ❌ Prevent starting a step unless previous is completed
    if (status === 'in-progress' && stepId > 1) {
      const prevStepStatus = getStepStatus(stepId - 1);
      if (prevStepStatus !== 'completed') {
        toast({
          variant: 'destructive',
          title: 'Hold up!',
          description: `You must complete Step ${stepId - 1} before starting Step ${stepId}.`,
        });
        return;
      }
    }

    // ❌ Prevent marking step completed if it wasn’t started
    if (status === 'completed' && currentStatus !== 'in-progress') {
      toast({
        variant: 'destructive',
        title: 'Start Step First',
        description: `You must start Step ${stepId} before marking it complete.`,
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('roadmap_progress')
        .upsert({
          user_id: user.id,
          step_id: stepId,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Error updating roadmap progress:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update progress. Please try again.",
        });
        return;
      }

      setProgress(prev => {
        const existing = prev.find(p => p.step_id === stepId);
        if (existing) {
          return prev.map(p =>
            p.step_id === stepId
              ? {
                  ...p,
                  status,
                  completed_at: status === 'completed' ? new Date().toISOString() : undefined
                }
              : p
          );
        } else {
          return [
            ...prev,
            {
              step_id: stepId,
              status,
              completed_at: status === 'completed' ? new Date().toISOString() : undefined
            }
          ];
        }
      });

      toast({
        title: "Progress Updated",
        description: `Step ${stepId} marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating roadmap progress:', error);
    }
  };

  return {
    progress,
    loading,
    updateStepStatus,
    getStepStatus
  };
};
