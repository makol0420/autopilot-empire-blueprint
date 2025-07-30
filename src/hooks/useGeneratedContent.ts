import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GeneratedContent {
  id: string;
  tool_id: string;
  topic: string;
  content: string;
  created_at: string;
}

export const useGeneratedContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contentHistory, setContentHistory] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setContentHistory([]);
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('generated_content')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Error fetching generated content:', error);
          return;
        }

        setContentHistory(data || []);
      } catch (error) {
        console.error('Error fetching generated content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [user]);

  const saveGeneratedContent = async (toolId: string, topic: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('generated_content')
        .insert({
          user_id: user.id,
          tool_id: toolId,
          topic,
          content
        });

      if (error) {
        console.error('Error saving generated content:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save content. Please try again.",
        });
        return;
      }

      // Refresh content history
      const { data } = await supabase
        .from('generated_content')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setContentHistory(data || []);
    } catch (error) {
      console.error('Error saving generated content:', error);
    }
  };

  return {
    contentHistory,
    loading,
    saveGeneratedContent
  };
};