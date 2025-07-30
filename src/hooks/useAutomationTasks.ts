import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutomationTaskData {
  task_id: string;
  completed: boolean;
  completed_at?: string;
}

export const useAutomationTasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<AutomationTaskData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('automation_tasks')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching automation tasks:', error);
          return;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error fetching automation tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const toggleTask = async (taskId: string) => {
    if (!user) return;

    const existingTask = tasks.find(t => t.task_id === taskId);
    const newCompletedState = !existingTask?.completed;

    try {
      const { error } = await supabase
        .from('automation_tasks')
        .upsert({
          user_id: user.id,
          task_id: taskId,
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null
        });

      if (error) {
        console.error('Error updating task:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update task. Please try again.",
        });
        return;
      }

      setTasks(prev => {
        const existing = prev.find(t => t.task_id === taskId);
        if (existing) {
          return prev.map(t => 
            t.task_id === taskId 
              ? { ...t, completed: newCompletedState, completed_at: newCompletedState ? new Date().toISOString() : undefined }
              : t
          );
        } else {
          return [...prev, { task_id: taskId, completed: newCompletedState, completed_at: newCompletedState ? new Date().toISOString() : undefined }];
        }
      });

      toast({
        title: newCompletedState ? "Task Completed!" : "Task Unchecked",
        description: newCompletedState ? "Great progress on your automation!" : "Task marked as incomplete",
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const isTaskCompleted = (taskId: string): boolean => {
    const task = tasks.find(t => t.task_id === taskId);
    return task?.completed || false;
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return {
    tasks,
    loading,
    toggleTask,
    isTaskCompleted,
    completedCount
  };
};