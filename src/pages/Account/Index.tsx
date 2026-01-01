import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

export default function AccountIndex() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { user } = await api<{ user: any }>('/api/auth/me');
        if (cancelled) return;
        if (user) navigate('/account/orders', { replace: true });
        else navigate('/account/login', { replace: true });
      } catch {
        if (!cancelled) navigate('/account/login', { replace: true });
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return <div className="p-6">Loading…</div>;
}

