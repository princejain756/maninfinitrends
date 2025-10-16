import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminDeleteProduct, adminListProducts } from '@/lib/adminApi';

export default function AdminProductsList() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    adminListProducts()
      .then((data) => { setItems(data); setLoading(false); })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const del = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setDeleting(id);
    try {
      await adminDeleteProduct(id);
      load();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="space-x-2">
          <button onClick={() => navigate('/admin/products/new')} className="px-3 py-2 rounded bg-black text-white">Add Product</button>
        </div>
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2">Slug</th>
                <th className="p-2">SKU</th>
                <th className="p-2">Price</th>
                <th className="p-2">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => {
                const v = p.variants?.[0];
                const stock = (p.variants||[]).reduce((s: number, vv: any) => s + (vv.inventory?.quantity || 0), 0);
                return (
                  <tr key={p.id} className="border-t">
                    <td className="p-2 text-left">{p.title}</td>
                    <td className="p-2">{p.slug}</td>
                    <td className="p-2">{v?.sku}</td>
                    <td className="p-2">₹{Math.round((v?.priceCents||0)/100)}</td>
                    <td className="p-2">{stock}</td>
                    <td className="p-2 space-x-2">
                      <Link className="underline" to={`/product/${p.slug}`} target="_blank">View</Link>
                      <Link className="underline" to={`/admin/products/${p.id}/edit`}>Edit</Link>
                      <button className="text-red-600 underline" disabled={deleting===p.id} onClick={() => del(p.id)}>{deleting===p.id?'Deleting…':'Delete'}</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

