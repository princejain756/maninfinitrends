import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';

export default function AccountOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    api('/api/auth/me')
      .then((res: any) => {
        if (!res.user) { navigate('/account/login'); return; }
        return api('/api/orders/my');
      })
      .then((data: any) => { if (!mounted || !data) return; setOrders(data); setLoading(false); })
      .catch((e:any) => { if (!mounted) return; setError(e?.message || 'Failed to load'); setLoading(false); });
    return () => { mounted = false; };
  }, [navigate]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <Link className="underline" to="/track">Track Order</Link>
      </div>
      {orders.length === 0 && <p>You don’t have any orders yet.</p>}
      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Order</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total</th>
                <th className="p-2">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2 text-left">{o.id.slice(0,8)}…</td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">₹{Math.round((o.totalCents||0)/100)}</td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

