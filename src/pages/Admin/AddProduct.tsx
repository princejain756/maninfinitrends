import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(''); // rupees
  const [images, setImages] = useState(''); // comma separated
  const [categories, setCategories] = useState(''); // comma separated
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { user } = await api<{ user: any }>('/api/auth/me');
        if (!user || user.role !== 'ADMIN') {
          navigate('/admin/login');
        }
      } catch {
        navigate('/admin/login');
      }
    })();
  }, [navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      const imageList = images.split(',').map((s) => s.trim()).filter(Boolean);
      const categoryList = categories.split(',').map((s) => s.trim()).filter(Boolean);
      const product = await api('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({ slug, title, description, sku, priceCents, images: imageList, categories: categoryList }),
      });
      setSuccess(`Product created: ${product.title}`);
      setSlug(''); setTitle(''); setDescription(''); setSku(''); setPrice(''); setImages(''); setCategories('');
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input className="w-full border rounded px-3 py-2" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input className="w-full border rounded px-3 py-2" value={sku} onChange={(e) => setSku(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (INR)</label>
              <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={images} onChange={(e) => setImages(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categories (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={categories} onChange={(e) => setCategories(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <div className="flex gap-2">
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'Creating...' : 'Create Product'}</button>
          <button type="button" className="border px-4 py-2 rounded" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}

