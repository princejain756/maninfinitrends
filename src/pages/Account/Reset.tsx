import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function AccountReset() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (!token) navigate('/account/login'); }, [token, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (p1.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (p1 !== p2) { setError('Passwords do not match'); return; }
    setLoading(true); setError(null);
    try {
      await api('/api/auth/reset', { method: 'POST', body: JSON.stringify({ token, password: p1 }) });
      navigate('/account/login');
    } catch (e:any) { setError(e?.message || 'Failed to reset'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto p-6">
          <Card className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Set a new password</h1>
            <form className="space-y-3" onSubmit={submit}>
              <label className="block text-sm font-medium">New password</label>
              <Input type="password" value={p1} onChange={(e)=>setP1(e.target.value)} required />
              <label className="block text-sm font-medium">Confirm new password</label>
              <Input type="password" value={p2} onChange={(e)=>setP2(e.target.value)} required />
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button disabled={loading} className="btn-primary w-full">{loading?'Updating…':'Update password'}</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

