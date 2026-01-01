import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function AccountForgot() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await api('/api/auth/request-reset', { method: 'POST', body: JSON.stringify({ email }) });
      setSent(true);
    } catch (e:any) {
      setError(e?.message || 'Failed to send');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-md mx-auto p-6">
          <Card className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Reset your password</h1>
            {sent ? (
              <p className="text-sm text-muted-foreground">If an account exists for {email}, a reset link has been sent. Please check your email.</p>
            ) : (
              <form className="space-y-3" onSubmit={submit}>
                <label className="block text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <Button disabled={loading} className="btn-primary w-full">{loading?'Sending…':'Send reset link'}</Button>
              </form>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

