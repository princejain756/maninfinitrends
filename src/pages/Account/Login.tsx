import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

export default function AccountLogin() {
  const [identifier, setIdentifier] = useState(''); // email or username
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password };
      await api('/api/auth/login', { method: 'POST', body: JSON.stringify(body) });
      // who am i?
      const { user } = await api<{ user: any }>('/api/auth/me');
      if (user?.role === 'ADMIN') navigate('/admin');
      else navigate('/account/orders');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email or Username</label>
          <input className="w-full border rounded px-3 py-2" value={identifier} onChange={(e)=>setIdentifier(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">{loading?'Signing in…':'Sign In'}</button>
      </form>
      <div className="mt-3 text-sm">
        <Link className="underline" to="/account/forgot">Forgot password?</Link>
      </div>
      <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex-1 h-px bg-border"></span>
        <span>OR</span>
        <span className="flex-1 h-px bg-border"></span>
      </div>
      <Button asChild variant="outline" className="w-full">
        <a href="/api/auth/google/start">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48" className="mr-2"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.084,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.084,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.164,0,9.86-1.977,13.409-5.193l-6.19-5.238C29.128,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-3.997,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
          Continue with Google
        </a>
      </Button>
      <p className="text-sm mt-4">New here? <Link className="underline" to="/account/register">Create an account</Link></p>
    </div>
  );
}
