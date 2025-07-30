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

        if (error) throw error;

        setProgress((data || []).map(item => ({
          step_id: item.step_id,
          status: item.status,
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

  const updateStepStatus = async (stepId: number, status: RoadmapProgress['status']) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('roadmap_progress').upsert({
        user_id: user.id,
        step_id: stepId,
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      });

      if (error) throw error;

      setProgress(prev => {
        const existing = prev.find(p => p.step_id === stepId);
        if (existing) {
          return prev.map(p =>
            p.step_id === stepId ? { ...p, status, completed_at: status === 'completed' ? new Date().toISOString() : undefined } : p
          );
        } else {
          return [...prev, { step_id: stepId, status, completed_at: status === 'completed' ? new Date().toISOString() : undefined }];
        }
      });

      toast({
        title: 'Progress Updated',
        description: `Step ${stepId} marked as ${status}`
      });
    } catch (error) {
      console.error('Error updating roadmap progress:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update progress. Please try again.'
      });
    }
  };

  const getStepStatus = (stepId: number): RoadmapProgress['status'] => {
    const stepProgress = progress.find(p => p.step_id === stepId);
    return stepProgress?.status || 'pending';
  };

  return {
    progress,
    loading,
    updateStepStatus,
    getStepStatus
  };
};
