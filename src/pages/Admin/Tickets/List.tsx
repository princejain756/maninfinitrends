import { useEffect, useState } from 'react';
import { adminListTickets, adminUpdateTicket } from '@/lib/adminApi';

export default function AdminTicketsList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = () => {
    adminListTickets()
      .then((data) => { setItems(data); setLoading(false); })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const update = async (id: string, status: string) => {
    setSavingId(id);
    try { await adminUpdateTicket(id, status); load(); }
    finally { setSavingId(null); }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Support Tickets</h1>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2">Email</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2 text-left">{t.subject}</td>
                  <td className="p-2">{t.email}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="p-2">
                    <select className="border rounded px-2 py-1" disabled={savingId===t.id} value={t.status} onChange={e=>update(t.id, e.target.value)}>
                      {['OPEN','IN_PROGRESS','RESOLVED','CLOSED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
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

