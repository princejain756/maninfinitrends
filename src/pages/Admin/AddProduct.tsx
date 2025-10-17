import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { adminUploadImages, adminListUploads, adminFindUploadUsages, adminDetachUploads, adminDeleteUploads } from '@/lib/adminApi';
import { fetchCategories, type CategoryDto } from '@/lib/categoriesApi';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AddProduct() {
  const makeSlug = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [careText, setCareText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(''); // rupees
  const [stock, setStock] = useState(''); // quantity
  const [images, setImages] = useState(''); // comma separated
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<{ name: string; url: string; size: number; mtime: number }[]>([]);
  const [librarySelected, setLibrarySelected] = useState<Record<string, boolean>>({});
  const [libraryQuery, setLibraryQuery] = useState('');
  const [librarySort, setLibrarySort] = useState<'newest'|'oldest'|'name'|'size'>('newest');
  const [categories, setCategories] = useState(''); // comma separated
  const [files, setFiles] = useState<File[]>([]);
  // Category selection helpers
  const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // slugs
  const [categoryInput, setCategoryInput] = useState('');
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

  // Load available categories for dropdown
  useEffect(() => {
    let mounted = true;
    fetchCategories()
      .then((cats) => { if (mounted) setAvailableCategories(cats); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Keep imageUrls in sync with the text field
  useEffect(() => {
    const list = images.split(',').map(s=>s.trim()).filter(Boolean);
    setImageUrls(list);
  }, [images]);

  // Load image library when opened
  useEffect(() => {
    if (!showLibrary) return;
    adminListUploads().then(({ files }) => setLibrary(files)).catch(()=>setLibrary([]));
  }, [showLibrary]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      let imageList = [...imageUrls];
      // Upload files if provided
      if (files.length > 0) {
        const { urls } = await adminUploadImages(files);
        imageList = [...imageList, ...urls];
      }
      // Merge legacy free-text with selected slugs
      const legacy = categories.split(',').map((s) => s.trim()).filter(Boolean);
      const categoryList = Array.from(new Set([...legacy, ...selectedCategories]));
      const product = await api('/api/admin/products', {
        method: 'POST',
        body: JSON.stringify({
          slug,
          title,
          description,
          sku,
          priceCents,
          images: imageList,
          categories: categoryList,
          care: careText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          seoKeywords: seoKeywords || undefined,
          stock: stock ? Number(stock) : undefined,
        }),
      });
      setSuccess(`Product created: ${product.title}`);
      setSlug(''); setTitle(''); setDescription(''); setCareText(''); setSeoTitle(''); setSeoDescription(''); setSeoKeywords(''); setSku(''); setPrice(''); setStock(''); setImages(''); setCategories(''); setFiles([]);
      setSelectedCategories([]); setCategoryInput('');
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
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Slug</label>
              <button
                type="button"
                className="text-xs underline text-gray-600 hover:text-black"
                onClick={() => setSlug(makeSlug(title || slug))}
                title="Generate from title"
              >
                Generate from title
              </button>
            </div>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. emerald-silk-saree"
              aria-describedby="slug-help"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={(e) => setSlug(makeSlug(e.target.value))}
              required
            />
            <p id="slug-help" className="text-xs text-gray-500 mt-1">
              The slug is the short, URL-friendly identifier used in the product link.
              Only lowercase letters, numbers and hyphens. Examples: <code>emerald-silk-saree</code>,
              <code>kurtis-cotton-pink</code>. Final URL: <code>/product/{slug || 'your-slug'}</code>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <ReactQuill theme="snow" value={description} onChange={setDescription} />
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
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" min="0" className="w-full border rounded px-3 py-2" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={images} onChange={(e) => setImages(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
              className="w-full border rounded px-3 py-2"
            />
            {files.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">{files.length} image(s) selected (will upload on create)</p>
            )}
            <button type="button" className="mt-2 underline" onClick={()=>setShowLibrary(true)}>Choose from Library</button>
            {/* Reorder current image URLs */}
            {imageUrls.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div
                    key={url+idx}
                    draggable
                    tabIndex={0}
                    onKeyDown={(e)=>{
                      if (e.key==='ArrowLeft' || e.key==='ArrowUp') { const to=Math.max(0, idx-1); const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault(); }
                      if (e.key==='ArrowRight' || e.key==='ArrowDown') { const to=Math.min(imageUrls.length-1, idx+1); const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault(); }
                    }}
                    onDragStart={(ev)=>ev.dataTransfer.setData('text/plain', String(idx))}
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={(ev)=>{ ev.preventDefault(); const from = Number(ev.dataTransfer.getData('text/plain')); const to = idx; if (!Number.isNaN(from)) { const arr=[...imageUrls]; const [m]=arr.splice(from,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); } }}
                    className="w-20 h-20 border rounded overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img src={url} alt="img" className="w-full h-full object-cover" />
                    <button type="button" title="Set as cover" className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1" onClick={()=>{ const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.unshift(m); setImageUrls(arr); setImages(arr.join(', ')); }}>★</button>
                    <button type="button" className="absolute top-0 right-0 bg-black/50 text-white text-xs px-1" onClick={()=>{ const arr=imageUrls.filter((_,i)=>i!==idx); setImageUrls(arr); setImages(arr.join(', ')); }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <div className="border rounded p-2">
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map((slug) => {
                    const name = availableCategories.find(c=>c.slug===slug)?.name || slug;
                    return (
                      <span key={slug} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm capitalize">
                        {name}
                        <button type="button" className="text-gray-500 hover:text-red-600" onClick={()=>setSelectedCategories(prev=>prev.filter(s=>s!==slug))}>×</button>
                      </span>
                    );
                  })}
                </div>
              )}
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type to search or add…"
                value={categoryInput}
                onChange={(e)=>setCategoryInput(e.target.value)}
              />
              <div className="max-h-40 overflow-auto divide-y">
                {availableCategories
                  .filter(c => !categoryInput || c.name.toLowerCase().includes(categoryInput.toLowerCase()) || c.slug.includes(categoryInput.toLowerCase()))
                  .map(c => (
                    <label key={c.id} className="flex items-center justify-between py-1 cursor-pointer">
                      <span className="capitalize">{c.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c.slug)}
                        onChange={(e)=>setSelectedCategories(prev => e.target.checked ? Array.from(new Set([...prev, c.slug])) : prev.filter(s=>s!==c.slug))}
                      />
                    </label>
                  ))}
              </div>
              {categoryInput.trim() && !availableCategories.some(c => c.slug === categoryInput.trim().toLowerCase().replace(/\s+/g,'-')) && (
                <button type="button" className="mt-2 text-sm underline" onClick={()=>{ const slug = categoryInput.trim().toLowerCase().replace(/\s+/g,'-'); setSelectedCategories(prev=>Array.from(new Set([...prev, slug]))); setCategoryInput(''); }}>
                  + Add "{categoryInput}" as new category
                </button>
              )}
            </div>
            {/* Optional: keep legacy comma input for quick paste */}
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">Or paste categories (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" value={categories} onChange={(e) => setCategories(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Care Instructions (one per line)</label>
            <textarea className="w-full border rounded px-3 py-2" rows={4} value={careText} onChange={(e)=>setCareText(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input className="w-full border rounded px-3 py-2" value={seoTitle} onChange={(e)=>setSeoTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Keywords (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" value={seoKeywords} onChange={(e)=>setSeoKeywords(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={seoDescription} onChange={(e)=>setSeoDescription(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <div className="flex gap-2">
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded disabled:opacity-60">{loading ? 'Creating...' : 'Create Product'}</button>
          <button type="button" className="border px-4 py-2 rounded" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </form>
      {showLibrary && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={()=>setShowLibrary(false)}>
          <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Image Library</h3>
              <button className="text-sm" onClick={()=>setShowLibrary(false)}>Close</button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input className="border rounded px-2 py-1 w-full" placeholder="Search files" value={libraryQuery} onChange={(e)=>setLibraryQuery(e.target.value)} />
              <select className="border rounded px-2 py-1" value={librarySort} onChange={(e)=>setLibrarySort(e.target.value as any)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-auto">
              {library
                .filter(f => !libraryQuery || f.name.toLowerCase().includes(libraryQuery.toLowerCase()))
                .sort((a,b)=>{
                  switch(librarySort){
                    case 'oldest': return a.mtime - b.mtime;
                    case 'name': return a.name.localeCompare(b.name);
                    case 'size': return a.size - b.size;
                    default: return b.mtime - a.mtime; // newest
                  }
                })
                .map(f => (
                <label key={f.url} className="relative border rounded overflow-hidden cursor-pointer">
                  <img src={f.url} alt={f.name} className="w-full h-40 object-cover" />
                  <input type="checkbox" className="absolute top-1 left-1 bg-white" checked={!!librarySelected[f.url]} onChange={(e)=>setLibrarySelected(prev=>({ ...prev, [f.url]: e.target.checked }))} />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="border px-3 py-1 rounded" onClick={()=>setLibrarySelected({})}>Clear</button>
              <button className="border px-3 py-1 rounded" onClick={async ()=>{
                const names = Object.entries(librarySelected).filter(([,v])=>v).map(([u])=>u.split('/').pop() as string);
                if (names.length===0) return;
                const { usages } = await adminFindUploadUsages(names);
                const total = Object.values(usages).reduce((s, arr)=>s+(arr?.length||0), 0);
                if (total>0) {
                  const list = Object.entries(usages).filter(([,arr])=>arr && arr.length).map(([n,arr])=>`- ${n}: ${arr.length} usage(s)`).join('\n');
                  const ok = confirm(`Selected images are used in ${total} place(s):\n${list}\n\nDetach from products and delete files?`);
                  if (!ok) return;
                  await adminDetachUploads({ names });
                } else {
                  const ok2 = confirm(`Delete ${names.length} image(s) from library?`);
                  if (!ok2) return;
                }
                await adminDeleteUploads({ names });
                setLibrary(library.filter(f=>!names.includes(f.url.split('/').pop() as string)));
                setLibrarySelected({});
              }}>Delete Selected</button>
              <button className="bg-black text-white px-3 py-1 rounded" onClick={()=>{ const picked = Object.entries(librarySelected).filter(([,v])=>v).map(([k])=>k); if (picked.length) { const arr=[...imageUrls, ...picked]; setImageUrls(arr); setImages(arr.join(', ')); } setShowLibrary(false); }}>Add Selected</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
