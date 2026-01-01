import { useEffect, useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

type Address = {
  id: string;
  label?: string | null;
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
};

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Address>>({ label: 'Home', country: 'IN' });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const list = await api<Address[]>('/api/addresses');
      setAddresses(list);
      setError(null);
    } catch (e:any) {
      setError(e?.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api<{ user: any }>('/api/auth/me');
        if (!user) { navigate('/account/login'); return; }
        await load();
      } catch {
        navigate('/account/login');
      }
    })();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api('/api/addresses', { method: 'POST', body: JSON.stringify({
        label: form.label || undefined,
        name: form.name,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country || 'IN',
        phone: form.phone || undefined,
      }) });
      setForm({ label: 'Home', country: 'IN' });
      await load();
    } catch (e:any) { setError(e?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const saveEdit = async (id: string, data: Partial<Address>) => {
    await api(`/api/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    setEditingId(null);
    await load();
  };

  const remove = async (id: string) => {
    await api(`/api/addresses/${id}`, { method: 'DELETE' });
    await load();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          <h1 className="text-3xl font-semibold">My Addresses</h1>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Add new address</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submit}>
              <div>
                <Label>Label</Label>
                <Input value={form.label || ''} onChange={(e)=>setForm(f=>({...f, label: e.target.value}))} placeholder="Home / Office / Other" />
              </div>
              <div>
                <Label>Full name</Label>
                <Input required value={form.name || ''} onChange={(e)=>setForm(f=>({...f, name: e.target.value}))} />
              </div>
              <div className="md:col-span-2">
                <Label>Address line 1</Label>
                <Input required value={form.line1 || ''} onChange={(e)=>setForm(f=>({...f, line1: e.target.value}))} />
              </div>
              <div className="md:col-span-2">
                <Label>Address line 2 (optional)</Label>
                <Input value={form.line2 || ''} onChange={(e)=>setForm(f=>({...f, line2: e.target.value}))} />
              </div>
              <div>
                <Label>City</Label>
                <Input required value={form.city || ''} onChange={(e)=>setForm(f=>({...f, city: e.target.value}))} />
              </div>
              <div>
                <Label>State</Label>
                <Input required value={form.state || ''} onChange={(e)=>setForm(f=>({...f, state: e.target.value}))} />
              </div>
              <div>
                <Label>PIN code</Label>
                <Input required value={form.postalCode || ''} onChange={(e)=>setForm(f=>({...f, postalCode: e.target.value}))} />
              </div>
              <div>
                <Label>Phone (optional)</Label>
                <Input value={form.phone || ''} onChange={(e)=>setForm(f=>({...f, phone: e.target.value}))} />
              </div>
              <div className="md:col-span-2">
                <Button disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save address'}</Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">Saved addresses</h2>
            {loading && <p>Loading…</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {!loading && addresses.length === 0 && <p className="text-sm text-muted-foreground">You have no saved addresses.</p>}
            <div className="space-y-4">
              {addresses.map((a) => (
                <div key={a.id} className="border rounded-lg p-4">
                  {editingId === a.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input defaultValue={a.label || ''} onChange={(e)=>a.label = e.target.value} placeholder="Label" />
                      <Input defaultValue={a.name} onChange={(e)=>a.name = e.target.value} placeholder="Full name" />
                      <Input className="md:col-span-2" defaultValue={a.line1} onChange={(e)=>a.line1 = e.target.value} placeholder="Address line 1" />
                      <Input className="md:col-span-2" defaultValue={a.line2 || ''} onChange={(e)=>a.line2 = e.target.value} placeholder="Address line 2" />
                      <Input defaultValue={a.city} onChange={(e)=>a.city = e.target.value} placeholder="City" />
                      <Input defaultValue={a.state} onChange={(e)=>a.state = e.target.value} placeholder="State" />
                      <Input defaultValue={a.postalCode} onChange={(e)=>a.postalCode = e.target.value} placeholder="PIN code" />
                      <Input defaultValue={a.phone || ''} onChange={(e)=>a.phone = e.target.value} placeholder="Phone" />
                      <div className="md:col-span-2 flex gap-2">
                        <Button size="sm" onClick={()=>saveEdit(a.id, a)}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={()=>setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium">{a.label || 'Address'} — {a.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city}, {a.state} {a.postalCode}
                          {a.phone ? ` • ${a.phone}` : ''}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={()=>setEditingId(a.id)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={()=>remove(a.id)}>Delete</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
