import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { adminGetOrder, adminUpdateOrder, adminCapturePayment, adminRefundPayment } from '@/lib/adminApi';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('PENDING');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

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

  const refund = async () => {
    if (!id) return;
    setActionMsg(null);
    try { await adminRefundPayment(id); setActionMsg('Refund requested'); const o = await adminGetOrder(id); setOrder(o); }
    catch (e: any) { setActionMsg(e?.message || 'Refund failed'); }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order {order.id}</h1>
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
            <li key={it.id}>{it.quantity} x {it.variant?.product?.title} ({it.variant?.sku}) — ₹{Math.round((it.unitPrice||0)/100)}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 border rounded p-4 bg-white">
        <h2 className="font-semibold mb-2">Payment Actions</h2>
        {actionMsg && <p className="text-sm mb-2">{actionMsg}</p>}
        <div className="space-x-2">
          <button className="px-3 py-1 rounded bg-black text-white" onClick={capture}>Capture</button>
          <button className="px-3 py-1 rounded border" onClick={refund}>Refund</button>
        </div>
      </div>
    </div>
  );
}
