import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface ScheduledPost {
  id: string;
  user_id: string;
  video_url: string;
  caption: string;
  platforms: string[];
  scheduled_at: string;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed' | 'cancelled';
}

interface SocialPosterResponse {
  postId?: string;
}

export function SchedulerRunner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!user) return;

    const tick = async () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      try {
        const nowIso = new Date().toISOString();
        const { data: due, error } = await supabase
          .from('scheduled_posts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'pending')
          .lte('scheduled_at', nowIso)
          .limit(5);

        if (error) {
          console.error('Scheduler fetch error', error);
          return;
        }

        if (!due || due.length === 0) return;

        for (const post of due as ScheduledPost[]) {
          try {
            await supabase
              .from('scheduled_posts')
              .update({ status: 'processing' })
              .eq('id', post.id);

            const results: Array<{ platform: string; success: boolean; postId?: string; error?: string }> = [];
            for (const platform of post.platforms) {
              try {
                const { data, error: fnError } = await supabase.functions.invoke<SocialPosterResponse>('social-media-poster', {
                  body: {
                    platform,
                    videoUrl: post.video_url,
                    caption: post.caption,
                  },
                });
                if (fnError) throw fnError;
                results.push({ platform, success: true, postId: data?.postId });
              } catch (e) {
                const message = e instanceof Error ? e.message : 'Unknown error';
                results.push({ platform, success: false, error: message });
              }
            }

            const successCount = results.filter(r => r.success).length;
            const status: ScheduledPost['status'] = successCount === results.length
              ? 'completed'
              : successCount === 0
                ? 'failed'
                : 'partial';

            await supabase
              .from('scheduled_posts')
              .update({ status, results: results as unknown as Record<string, unknown>[], processed_at: new Date().toISOString() })
              .eq('id', post.id);

            toast({ title: 'Scheduled post processed', description: `${successCount}/${results.length} platforms succeeded` });
          } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error';
            await supabase
              .from('scheduled_posts')
              .update({ status: 'failed', last_error: message, processed_at: new Date().toISOString() })
              .eq('id', post.id);
          }
        }
      } finally {
        isRunningRef.current = false;
      }
    };

    // Poll every 30 seconds
    timerRef.current = window.setInterval(tick, 30000) as unknown as number;
    // Also run immediately on mount
    tick();

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [user, toast]);

  return null;
}