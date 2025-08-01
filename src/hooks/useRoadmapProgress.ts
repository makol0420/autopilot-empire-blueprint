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

  // Load from Supabase (and sync to localStorage if needed)
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

        const formatted = (data || []).map(item => ({
          step_id: item.step_id,
          status: item.status as 'completed' | 'in-progress' | 'pending',
          completed_at: item.completed_at
        }));

        setProgress(formatted);

        // Optional: sync to localStorage
        localStorage.setItem("stepStatus", JSON.stringify(
          Object.fromEntries(formatted.map(p => [p.step_id, p.status]))
        ));
      } catch (error) {
        console.error('Error fetching roadmap progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  // Update single step
  const updateStepStatus = async (
    stepId: number,
    status: 'completed' | 'in-progress' | 'pending'
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('roadmap_progress')
        .upsert(
          {
            user_id: user.id,
            step_id: stepId,
            status,
            completed_at: status === 'completed' ? new Date().toISOString() : null
          },
          {
            onConflict: 'user_id,step_id'
          }
        );

      if (error) {
        console.error('Error updating roadmap progress:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update progress. Please try again.",
        });
        return;
      }

      const newState = progress.some(p => p.step_id === stepId)
        ? progress.map(p =>
            p.step_id === stepId
              ? { ...p, status, completed_at: status === 'completed' ? new Date().toISOString() : undefined }
              : p
          )
        : [
            ...progress,
            {
              step_id: stepId,
              status,
              completed_at: status === 'completed' ? new Date().toISOString() : undefined
            }
          ];

      setProgress(newState);

      // Optional: sync updated status to localStorage
      localStorage.setItem("stepStatus", JSON.stringify(
        Object.fromEntries(newState.map(p => [p.step_id, p.status]))
      ));

      toast({
        title: "Progress Updated",
        description: `Step ${stepId} marked as ${status}`,
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        variant: "destructive",
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
      });
    }
  };

  const getStepStatus = (stepId: number): RoadmapProgress["status"] => {
    return progress.find(p => p.step_id === stepId)?.status || "pending";
  };

  return {
    progress,
    loading,
    updateStepStatus,
    getStepStatus,
  };
};
