import { useState, useEffect } from 'react';
import { checkSupabaseConnection, SupabaseHealthStatus } from '../lib/supabase';

export function useSupabaseStatus() {
  const [status, setStatus] = useState<SupabaseHealthStatus>({
    isConfigured: false,
    url: '',
    projectId: '',
    isConnected: false,
  });
  const [loading, setLoading] = useState(true);

  const verify = async () => {
    setLoading(true);
    const res = await checkSupabaseConnection();
    setStatus(res);
    setLoading(false);
  };

  useEffect(() => {
    verify();
  }, []);

  return {
    ...status,
    loading,
    recheck: verify,
  };
}
