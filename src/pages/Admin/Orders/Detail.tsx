import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrder, adminCapturePayment, adminRefundPayment, adminCaptureCodPayment, adminDeleteOrder } from '@/lib/adminApi';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('PENDING');
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    adminGetOrder(id)
      .then((o) => { setOrder(o); setStatus(o.status); setLoading(false); })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  }, [id]);

  const save = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const o = await adminUpdateOrder(id, status);
      setOrder(o);
    } finally {
      setSaving(false);
    }
  };

  const capture = async () => {
    if (!id) return;
    setActionMsg(null);
    try { await adminCapturePayment(id); setActionMsg('Capture requested'); const o = await adminGetOrder(id); setOrder(o); }
    catch (e: any) { setActionMsg(e?.message || 'Capture failed'); }
  };

  const captureCOD = async () => {
    if (!id) return;
    setActionMsg(null);
    try {
      await adminCaptureCodPayment(id);
      setActionMsg('COD captured');
      const o = await adminGetOrder(id); setOrder(o);
    } catch (e: any) {
      setActionMsg(e?.message || 'COD capture failed');
    }
  };

  const refund = async () => {
    if (!id) return;
    setActionMsg(null);
    try { await adminRefundPayment(id); setActionMsg('Refund requested'); const o = await adminGetOrder(id); setOrder(o); }
    catch (e: any) { setActionMsg(e?.message || 'Refund failed'); }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const hasRazorpay = Array.isArray(order?.payments) && order.payments.some((p: any) => p.provider === 'razorpay');
  const codPayment = Array.isArray(order?.payments) ? order.payments.find((p: any) => p.provider === 'cod') : null;
  const codPending = !!codPayment && codPayment.status !== 'CAPTURED';
  const codCaptured = !!codPayment && codPayment.status === 'CAPTURED';

  const displayName: string = (order?.user?.name && String(order.user.name).trim()) || order?.shippingAddress?.name || order?.user?.email || 'Guest';

  return (
    <div>
      <h1 className="text-2xl font-semibold">Order #{(order.orderNumber ?? 0).toString().padStart(3, '0')}</h1>
      <p className="text-sm text-muted-foreground mb-4">Customer: {displayName}</p>
      <div className="mb-4">
        <label className="mr-2">Status</label>
        <select className="border rounded px-2 py-1" value={status} onChange={e=>setStatus(e.target.value)}>
          {['PENDING','PAID','FULFILLED','CANCELLED','REFUNDED'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="ml-2 px-3 py-1 bg-black text-white rounded" disabled={saving} onClick={save}>{saving?'Saving…':'Save'}</button>
      </div>
      <div className="border rounded p-4 bg-white">
        <h2 className="font-semibold mb-2">Items</h2>
        <ul className="list-disc ml-6">
          {order.items.map((it: any) => (
            <li key={it.id}>
              {it.quantity} x {it.variant?.product?.title} ({it.variant?.sku}) — ₹{Math.round((it.unitPrice||0)/100)}
              {(it.options?.Size || it.options?.Length || it.options?.Material) && (
                <span className="text-sm text-muted-foreground">
                  {' '}
                  —
                  {it.options?.Size ? ` Size: ${it.options.Size}` : ''}
                  {it.options?.Length ? `${it.options?.Size ? ' • ' : ''} Length: ${it.options.Length}` : ''}
                  {it.options?.Material ? `${(it.options?.Size || it.options?.Length) ? ' • ' : ''} Material: ${it.options.Material}` : ''}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 border rounded p-4 bg-white">
        <h2 className="font-semibold mb-2">Payment Actions</h2>
        {codCaptured && (
          <div className="inline-flex items-center px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-medium mb-2">
            COD Received
          </div>
        )}
        {actionMsg && <p className="text-sm mb-2">{actionMsg}</p>}
        <div className="space-x-2">
          {hasRazorpay && (
            <>
              <button className="px-3 py-1 rounded bg-black text-white" onClick={capture}>Capture</button>
              <button className="px-3 py-1 rounded border" onClick={refund}>Refund</button>
            </>
          )}
          {codPending && (
            <button className="px-3 py-1 rounded border bg-yellow-50" onClick={captureCOD}>Mark COD Received</button>
          )}
        </div>
      </div>
      <div className="mt-4 border rounded p-4 bg-white">
        <h2 className="font-semibold mb-2">Danger Zone</h2>
        <p className="text-sm text-muted-foreground mb-2">Delete this order if it is fake or created in error.</p>
        <button
          className="px-3 py-1 rounded bg-red-600 text-white"
          onClick={async () => {
            if (!id) return;
            if (!confirm('Delete this order permanently? This cannot be undone.')) return;
            try {
              await adminDeleteOrder(id);
              navigate('/admin/orders');
            } catch (e:any) {
              setActionMsg(e?.message || 'Delete failed');
            }
          }}
        >
          Delete Order
        </button>
      </div>
    </div>
  );
}
