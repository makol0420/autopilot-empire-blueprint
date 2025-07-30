import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  current_revenue: number;
  target_revenue: number;
  start_date: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }

        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateRevenue = async (currentRevenue: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ current_revenue: currentRevenue })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating revenue:', error);
        return;
      }

      setProfile(prev => prev ? { ...prev, current_revenue: currentRevenue } : null);
    } catch (error) {
      console.error('Error updating revenue:', error);
    }
  };

  return {
    profile,
    loading,
    updateRevenue
  };
};