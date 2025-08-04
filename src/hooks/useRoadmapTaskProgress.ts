import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TaskProgress {
  step_id: number;
  task_name: string;
  completed: boolean;
  completed_at?: string;
}

export const useRoadmapTaskProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Load task progress from Supabase
  useEffect(() => {
    if (!user) {
      setTaskProgress([]);
      setLoading(false);
      return;
    }

    const fetchTaskProgress = async () => {
      try {
        const { data, error } = await supabase
          .from('roadmap_task_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formatted = (data || []).map(item => ({
          step_id: item.step_id,
          task_name: item.task_name,
          completed: item.completed,
          completed_at: item.completed_at
        }));

        setTaskProgress(formatted);
      } catch (error) {
        console.error('Error fetching task progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskProgress();
  }, [user]);

  // Toggle task completion
  const toggleTaskCompletion = async (stepId: number, taskName: string) => {
    if (!user) return;

    const existingTask = taskProgress.find(
      t => t.step_id === stepId && t.task_name === taskName
    );
    const newCompleted = !existingTask?.completed;

    try {
      const { error } = await supabase
        .from('roadmap_task_progress')
        .upsert(
          {
            user_id: user.id,
            step_id: stepId,
            task_name: taskName,
            completed: newCompleted,
            completed_at: newCompleted ? new Date().toISOString() : null
          },
          {
            onConflict: 'user_id,step_id,task_name'
          }
        );

      if (error) {
        console.error('Error updating task progress:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update task progress. Please try again.",
        });
        return;
      }

      // Update local state
      const newState = existingTask
        ? taskProgress.map(t =>
            t.step_id === stepId && t.task_name === taskName
              ? { ...t, completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : undefined }
              : t
          )
        : [
            ...taskProgress,
            {
              step_id: stepId,
              task_name: taskName,
              completed: newCompleted,
              completed_at: newCompleted ? new Date().toISOString() : undefined
            }
          ];

      setTaskProgress(newState);

      toast({
        title: newCompleted ? "Task Completed" : "Task Unchecked",
        description: `${taskName} ${newCompleted ? 'completed' : 'unchecked'}`,
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

  const isTaskCompleted = (stepId: number, taskName: string): boolean => {
    return taskProgress.find(
      t => t.step_id === stepId && t.task_name === taskName
    )?.completed || false;
  };

  const getStepTaskProgress = (stepId: number): { completed: number; total: number } => {
    const stepTasks = taskProgress.filter(t => t.step_id === stepId);
    const completed = stepTasks.filter(t => t.completed).length;
    return { completed, total: stepTasks.length };
  };

  return {
    taskProgress,
    loading,
    toggleTaskCompletion,
    isTaskCompleted,
    getStepTaskProgress,
  };
};