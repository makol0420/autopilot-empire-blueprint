import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type StepStatus = 'completed' | 'in-progress' | 'pending';

interface StepProgress {
  [stepId: number]: StepStatus;
}

export const useRoadmapProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stepStatus, setStepStatus] = useState<StepProgress>({});

  // Load from Supabase or fallback to localStorage
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        const local = localStorage.getItem('stepStatus');
        if (local) setStepStatus(JSON.parse(local));
        return;
      }

      const { data, error } = await supabase
        .from('roadmap_progress')
        .select('step_id, status')
        .eq('user_id', user.id);

      if (error) {
        console.error('Supabase error:', error);
        toast({ title: 'Failed to load progress', variant: 'destructive' });
        const local = localStorage.getItem('stepStatus');
        if (local) setStepStatus(JSON.parse(local));
        return;
      }

      const progressFromDB: StepProgress = {};
      data.forEach(({ step_id, status }) => {
        progressFromDB[step_id] = status;
      });

      setStepStatus(progressFromDB);
      localStorage.setItem('stepStatus', JSON.stringify(progressFromDB));
    };

    loadProgress();
  }, [user]);

  const getStepStatus = (id: number): StepStatus => {
    return stepStatus[id] || 'pending';
  };

  const updateStepStatus = async (id: number, newStatus: StepStatus) => {
    const currentStatus = getStepStatus(id);
    const prevStatus = getStepStatus(id - 1);

    // Restrict invalid transitions
    if ((newStatus === 'in-progress' || newStatus === 'completed') && id > 1 && prevStatus !== 'completed') {
      toast({
        title: 'Blocked',
        description: `You must complete Step ${id - 1} first.`,
        variant: 'destructive'
      });
      return;
    }

    if (newStatus === 'completed' && currentStatus !== 'in-progress') {
      toast({
        title: 'Start Step First',
        description: `You must start Step ${id} before completing it.`,
        variant: 'destructive'
      });
      return;
    }

    const updated = { ...stepStatus, [id]: newStatus };
    setStepStatus(updated);
    localStorage.setItem('stepStatus', JSON.stringify(updated));

    if (user) {
      const { error } = await supabase
        .from('roadmap_progress')
        .upsert({
          user_id: user.id,
          step_id: id,
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Error saving to Supabase:', error);
        toast({
          title: 'Save Failed',
          description: 'Progress saved locally, but failed to sync online.',
          variant: 'destructive'
        });
      } else {
        toast({ title: 'Progress Updated', description: `Step ${id} marked ${newStatus}` });
      }
    }
  };

  return {
    getStepStatus,
    updateStepStatus,
    stepStatus,
  };
};
