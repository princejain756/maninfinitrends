import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      <p className="text-sm mt-4">New here? <Link className="underline" to="/account/register">Create an account</Link></p>
    </div>
  );
}

