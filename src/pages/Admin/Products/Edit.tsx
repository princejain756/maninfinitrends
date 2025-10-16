import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGetProduct, adminUpdateProduct } from '@/lib/adminApi';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [active, setActive] = useState(true);
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [categories, setCategories] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminGetProduct(id)
      .then((p) => {
        setTitle(p.title || '');
        setDescription(p.description || '');
        setSlug(p.slug || '');
        setActive(!!p.active);
        const v = p.variants?.[0];
        setSku(v?.sku || '');
        setPrice(v ? String((v.priceCents||0)/100) : '');
        setImages((p.images||[]).map((i:any)=>i.url).join(', '));
        setCategories((p.categories||[]).map((c:any)=>c.category?.slug||'').filter(Boolean).join(', '));
        setLoading(false);
      })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      await adminUpdateProduct(id, {
        title, description, slug, active,
        sku, priceCents,
        images: images.split(',').map(s=>s.trim()).filter(Boolean),
        categories: categories.split(',').map(s=>s.trim()).filter(Boolean),
      });
      navigate('/admin/products');
    } catch (e:any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input className="w-full border rounded px-3 py-2" value={slug} onChange={e=>setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">SKU</label>
            <input className="w-full border rounded px-3 py-2" value={sku} onChange={e=>setSku(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Price (INR)</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={price} onChange={e=>setPrice(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Image URLs (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={images} onChange={e=>setImages(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Categories (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={categories} onChange={e=>setCategories(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="active" type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)} />
          <label htmlFor="active">Active</label>
        </div>
        <div className="flex gap-2">
          <button disabled={saving} className="bg-black text-white px-4 py-2 rounded">{saving? 'Saving…':'Save'}</button>
          <button type="button" className="border px-4 py-2 rounded" onClick={()=>navigate('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

