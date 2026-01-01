import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function AccountOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<string | null>(null);

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

  const renderDateTime = (iso: string) => {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
    const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    return (
      <div className="leading-tight">
        <div>{date}</div>
        <div className="text-muted-foreground">{time}</div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <div className="flex items-center gap-3">
          <Link className="underline" to="/track">Track Order</Link>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
              navigate('/account/login');
            }}
            aria-label="Sign out"
          >
            Sign out
          </Button>
        </div>
      </div>
      {orders.length === 0 && <p>You don’t have any orders yet.</p>}
      {orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total</th>
                <th className="p-2">Placed</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <>
                  <tr key={o.id} className="border-t">
                    <td className="p-2 text-left font-mono">
                      <button className="underline" onClick={()=>navigate(`/account/orders/${o.id}`)}>
                        #{(o.orderNumber ?? 0).toString().padStart(3, '0')}
                      </button>
                    </td>
                    <td className="p-2 text-left">
                      {o.shippingAddress?.name || '—'}
                    </td>
                    <td className="p-2">{o.status}</td>
                    <td className="p-2">₹{Math.round((o.totalCents||0)/100)}</td>
                    <td className="p-2">{renderDateTime(o.createdAt)}</td>
                    <td className="p-2 text-right">
                      <Button variant="outline" size="sm" onClick={()=>setOpenId(openId===o.id?null:o.id)}>
                        {openId===o.id ? 'Hide details' : 'Show details'}
                      </Button>
                    </td>
                  </tr>
                  {openId===o.id && (
                    <tr>
                      <td colSpan={5} className="p-3 bg-muted/30">
                        <Card className="p-4">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                              <div>
                                <div><span className="font-medium text-foreground">Status:</span> {o.status}</div>
                                <div><span className="font-medium text-foreground">Total:</span> ₹{Math.round((o.totalCents||0)/100)}</div>
                              </div>
                              <div>
                                <div className="flex items-start gap-2"><span className="font-medium text-foreground">Placed:</span> {renderDateTime(o.createdAt)}</div>
                                {o.payments?.[0] && (
                                  <div>
                                    <span className="font-medium text-foreground">Payment:</span>{' '}
                                    {(o.payments[0].provider === 'cod' ? 'Cash on Delivery' : o.payments[0].provider)} — {o.payments[0].status}
                                  </div>
                                )}
                              </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                              {o.items.map((it: any) => {
                                const p = it.variant?.product;
                                const img = p?.images?.[0]?.url || '/api/placeholder/100/100';
                                return (
                                  <div key={it.id} className="flex items-center gap-3">
                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                      <img src={img} alt={p?.title||'Product'} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium line-clamp-1">{p?.title} {it.variant?.name ? `— ${it.variant.name}` : ''}</div>
                                      <div className="text-sm text-muted-foreground">Qty: {it.quantity}{it.options?.Size ? ` • Size: ${it.options.Size}` : ''}{it.options?.Length ? ` • Length: ${it.options.Length}` : ''}</div>
                                    </div>
                                    <div className="text-sm font-medium">₹{Math.round((it.unitPrice||0)/100)}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </Card>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
