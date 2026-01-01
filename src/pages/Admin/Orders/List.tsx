import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminListOrders } from '@/lib/adminApi';

export default function AdminOrdersList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminListOrders()
      .then((data) => { setItems(data); setLoading(false); })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Customer</th>
                <th className="p-2 text-left">Size/Material</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total</th>
                <th className="p-2">Currency</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-2 text-left font-mono">#{(o.orderNumber ?? 0).toString().padStart(3, '0')}</td>
                  <td className="p-2 text-left whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis">
                    {o.user?.name?.trim() || o.shippingAddress?.name || o.user?.email || 'Guest'}
                  </td>
                  <td className="p-2 text-left whitespace-nowrap max-w-[180px] overflow-hidden text-ellipsis">
                    {(() => {
                      const values: string[] = (o.items || []).map((it: any) => (it.options?.Size || it.options?.Length || it.options?.Material || '')).filter(Boolean);
                      if (values.length === 0) return '—';
                      const uniq = Array.from(new Set(values));
                      return uniq.join(', ');
                    })()}
                  </td>
                  <td className="p-2">{o.status}</td>
                  <td className="p-2">₹{Math.round((o.totalCents||0)/100)}</td>
                  <td className="p-2">{o.currency}</td>
                  <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <Link className="underline" to={`/admin/orders/${o.id}`}>View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
