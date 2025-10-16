import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api('/api/auth/me')
      .then((res: any) => {
        if (!mounted) return;
        if (!res.user || res.user.role !== 'ADMIN') {
          navigate('/admin/login');
        } else {
          setLoading(false);
        }
      })
      .catch(() => { if (mounted) navigate('/admin/login'); })
    return () => { mounted = false; };
  }, [navigate]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading admin…</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const linkClass = ({ isActive }: { isActive: boolean }) => `block px-3 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-gray-50 p-4">
        <Link to="/" className="block mb-6 font-semibold">← Back to Store</Link>
        <nav className="space-y-1">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass}>Products</NavLink>
          <NavLink to="/admin/orders" className={linkClass}>Orders</NavLink>
          <NavLink to="/admin/tickets" className={linkClass}>Support Tickets</NavLink>
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

