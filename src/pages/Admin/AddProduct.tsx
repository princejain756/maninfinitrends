import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { adminUploadImages, adminUploadImage, adminListUploads, adminFindUploadUsages, adminDetachUploads, adminDeleteUploads, adminUpdateCategory, adminUpdateMaterial, adminDeleteCategory, adminDeleteMaterial } from '@/lib/adminApi';
import { fetchCategories, type CategoryDto } from '@/lib/categoriesApi';
import { fetchMaterials, type MaterialDto } from '@/lib/materialsApi';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '@/components/ImageUploader';
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
  const [price, setPrice] = useState(''); // selling price (rupees)
  const [compareAt, setCompareAt] = useState(''); // original/MRP (rupees)
  const [stock, setStock] = useState(''); // quantity
  const [images, setImages] = useState(''); // comma separated
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // uploaded image URLs
  // Specifications
  const [specs, setSpecs] = useState<Record<string, string>>({
    Fabric: '', Color: '', Neckline: '', 'Pack Contain': '', Technique: '', 'Product Length': '', Sleeves: '', Fit: '', Lining: ''
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<{ name: string; url: string; size: number; mtime: number }[]>([]);
  const [librarySelected, setLibrarySelected] = useState<Record<string, boolean>>({});
  const [libraryQuery, setLibraryQuery] = useState('');
  const [librarySort, setLibrarySort] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');
  const [categories, setCategories] = useState(''); // comma separated
  const [files, setFiles] = useState<File[]>([]);
  type UploadItem = { id: string; name: string; size: number; progress: number; status: 'uploading' | 'done' | 'error'; url?: string; error?: string };
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  // Category selection helpers
  const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // slugs
  const [categoryInput, setCategoryInput] = useState('');
  const [showManageCats, setShowManageCats] = useState(false);
  const [catEdits, setCatEdits] = useState<Record<string, { name: string; saving?: boolean; error?: string; success?: boolean }>>({});
  // Materials
  const [availableMaterials, setAvailableMaterials] = useState<MaterialDto[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]); // slugs
  const [materialInput, setMaterialInput] = useState('');
  const [showManageMats, setShowManageMats] = useState(false);
  const [matEdits, setMatEdits] = useState<Record<string, { name: string; saving?: boolean; error?: string; success?: boolean }>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadMore = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const arr = Array.from(list).filter(f => f.type.startsWith('image/'));
    if (arr.length === 0) return;
    setFiles(arr);
    setError(null);
    const newItems: UploadItem[] = arr.map((f, i) => ({ id: `${Date.now()}-${i}-${f.name}`, name: f.name, size: f.size, progress: 0, status: 'uploading' }));
    setUploads(prev => [...prev, ...newItems]);
    for (let i = 0; i < arr.length; i++) {
      const f = arr[i];
      const id = newItems[i].id;
      try {
        const { url } = await adminUploadImage(f, (p) => {
          setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: p } : u));
        });
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress: 100, status: 'done', url } : u));
        setImageUrls(prev => {
          const merged = Array.from(new Set([...prev, url]));
          setImages(merged.join(', '));
          return merged;
        });
      } catch (e: any) {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'error', error: e?.message || 'Upload failed' } : u));
        setError(e?.message || 'Upload failed');
      }
    }
    setFiles([]);
    setSuccess(`${arr.length} image(s) processed`);
  };

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
      .catch(() => { });
    fetchMaterials()
      .then((mats) => { if (mounted) setAvailableMaterials(mats); })
      .catch(() => { });
    return () => { mounted = false; };
  }, []);

  // Keep imageUrls in sync with the text field
  useEffect(() => {
    const list = images.split(',').map(s => s.trim()).filter(Boolean);
    setImageUrls(list);
  }, [images]);

  // Load image library when opened
  useEffect(() => {
    if (!showLibrary) return;
    adminListUploads().then(({ files }) => setLibrary(files)).catch(() => setLibrary([]));
  }, [showLibrary]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      const urlImageList = images.split(',').map((s) => s.trim()).filter(Boolean);
      let allImages = Array.from(new Set([...uploadedImages, ...urlImageList, ...imageUrls]));

      // Upload files if provided (legacy handler)
      if (files.length > 0) {
        const { urls } = await adminUploadImages(files);
        allImages = Array.from(new Set([...allImages, ...urls]));
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
          compareAtPriceCents: (Number(compareAt) > Number(price)) ? Math.round(Number(compareAt) * 100) : undefined,
          images: allImages,
          categories: categoryList,
          materials: Array.from(new Set([...selectedMaterials])),
          care: careText.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          seoKeywords: seoKeywords || undefined,
          stock: stock ? Number(stock) : undefined,
          specs: Object.fromEntries(Object.entries(specs).filter(([, v]) => v && v.trim()))
        }),
      });
      setSuccess(`Product created: ${product.title}`);
      setSlug(''); setTitle(''); setDescription(''); setCareText(''); setSeoTitle(''); setSeoDescription(''); setSeoKeywords(''); setSku(''); setPrice(''); setCompareAt(''); setStock(''); setImages(''); setCategories(''); setFiles([]); setSpecs({ Fabric: '', Color: '', Neckline: '', 'Pack Contain': '', Technique: '', 'Product Length': '', Sleeves: '', Fit: '', Lining: '' });
      setSelectedCategories([]); setCategoryInput('');
      setSelectedMaterials([]); setMaterialInput('');
      setUploadedImages([]);
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
              <label className="block text-sm font-medium mb-1">Selling Price (INR)</label>
              <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input type="number" min="0" className="w-full border rounded px-3 py-2" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Original Price / MRP (INR)</label>
              <input type="number" step="0.01" className="w-full border rounded px-3 py-2" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} />
              {Number(compareAt) > 0 && Number(price) > 0 && Number(compareAt) > Number(price) && (
                <p className="text-xs text-muted-foreground mt-1">Discount: {Math.round(((Number(compareAt) - Number(price)) / Number(compareAt)) * 100)}%</p>
              )}
            </div>
          </div>
          {/* Image Uploader */}
          <div>
            <ImageUploader
              onImagesChange={setUploadedImages}
              initialImages={uploadedImages}
              maxImages={8}
            />
          </div>

          {/* Additional Image URLs */}
          <div>
            <label className="block text-sm font-medium mb-1">Additional Image URLs (optional, comma separated)</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">You can add additional images via URLs if needed</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Upload More</label>
            <div
              className="border-2 border-dashed rounded p-6 text-center cursor-pointer hover:bg-muted/30"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); handleUploadMore(e.dataTransfer.files); }}
            >
              <p className="text-sm">Drag & drop images here, or click to choose</p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button type="button" className="border px-3 py-2 rounded" onClick={() => fileInputRef.current?.click()}>Choose Files</button>
              <span className="text-sm text-muted-foreground">Select one or multiple images</span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleUploadMore(e.target.files)}
              className="hidden"
            />
            {uploads.length > 0 && (
              <div className="space-y-2 mt-3">
                {uploads.map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate max-w-[60%]" title={u.name}>{u.name}</span>
                        <span>{u.status === 'done' ? 'Done' : u.status === 'error' ? 'Error' : `${u.progress}%`}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded overflow-hidden">
                        <div className={`h-2 ${u.status === 'error' ? 'bg-red-500' : 'bg-black'}`} style={{ width: `${u.status === 'done' ? 100 : u.progress}%` }} />
                      </div>
                      {u.status === 'error' && <div className="text-xs text-red-600">{u.error}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button type="button" className="mt-2 underline" onClick={() => setShowLibrary(true)}>Choose from Library</button>
            {/* Reorder current image URLs */}
            {imageUrls.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div
                    key={url + idx}
                    draggable
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { const to = Math.max(0, idx - 1); const arr = [...imageUrls]; const [m] = arr.splice(idx, 1); arr.splice(to, 0, m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault(); }
                      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { const to = Math.min(imageUrls.length - 1, idx + 1); const arr = [...imageUrls]; const [m] = arr.splice(idx, 1); arr.splice(to, 0, m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault(); }
                    }}
                    onDragStart={(ev) => ev.dataTransfer.setData('text/plain', String(idx))}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(ev) => { ev.preventDefault(); const from = Number(ev.dataTransfer.getData('text/plain')); const to = idx; if (!Number.isNaN(from)) { const arr = [...imageUrls]; const [m] = arr.splice(from, 1); arr.splice(to, 0, m); setImageUrls(arr); setImages(arr.join(', ')); } }}
                    className="w-20 h-20 border rounded overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <img src={url} alt="img" className="w-full h-full object-cover" />
                    <button type="button" title="Set as cover" className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1" onClick={() => { const arr = [...imageUrls]; const [m] = arr.splice(idx, 1); arr.unshift(m); setImageUrls(arr); setImages(arr.join(', ')); }}>★</button>
                    <button type="button" className="absolute top-0 right-0 bg-black/50 text-white text-xs px-1" onClick={() => { const arr = imageUrls.filter((_, i) => i !== idx); setImageUrls(arr); setImages(arr.join(', ')); }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Categories</label>
              <button type="button" className="text-xs underline text-gray-600 hover:text-black" onClick={() => setShowManageCats(true)}>Manage</button>
            </div>
            <div className="border rounded p-2">
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map((slug) => {
                    const name = availableCategories.find(c => c.slug === slug)?.name || slug;
                    return (
                      <span key={slug} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm capitalize">
                        {name}
                        <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => setSelectedCategories(prev => prev.filter(s => s !== slug))}>×</button>
                      </span>
                    );
                  })}
                </div>
              )}
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type to search or add…"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
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
                        onChange={(e) => setSelectedCategories(prev => e.target.checked ? Array.from(new Set([...prev, c.slug])) : prev.filter(s => s !== c.slug))}
                      />
                    </label>
                  ))}
              </div>
              {categoryInput.trim() && !availableCategories.some(c => c.slug === categoryInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                <button type="button" className="mt-2 text-sm underline" onClick={() => { const slug = categoryInput.trim().toLowerCase().replace(/\s+/g, '-'); setSelectedCategories(prev => Array.from(new Set([...prev, slug]))); setCategoryInput(''); }}>
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

          {/* Materials */}
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium mb-1">Materials</label>
              <button type="button" className="text-xs underline text-gray-600 hover:text-black" onClick={() => setShowManageMats(true)}>Manage</button>
            </div>
            <div className="border rounded p-2">
              {selectedMaterials.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedMaterials.map((slug) => {
                    const name = availableMaterials.find(m => m.slug === slug)?.name || slug;
                    return (
                      <span key={slug} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm capitalize">
                        {name}
                        <button type="button" className="text-gray-500 hover:text-red-600" onClick={() => setSelectedMaterials(prev => prev.filter(s => s !== slug))}>×</button>
                      </span>
                    );
                  })}
                </div>
              )}
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Type to search or add…"
                value={materialInput}
                onChange={(e) => setMaterialInput(e.target.value)}
              />
              <div className="max-h-40 overflow-auto divide-y">
                {availableMaterials
                  .filter(m => !materialInput || m.name.toLowerCase().includes(materialInput.toLowerCase()) || m.slug.includes(materialInput.toLowerCase()))
                  .map(m => (
                    <label key={m.id} className="flex items-center justify-between py-1 cursor-pointer">
                      <span className="capitalize">{m.name}</span>
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(m.slug)}
                        onChange={(e) => setSelectedMaterials(prev => e.target.checked ? Array.from(new Set([...prev, m.slug])) : prev.filter(s => s !== m.slug))}
                      />
                    </label>
                  ))}
              </div>
              {materialInput.trim() && !availableMaterials.some(m => m.slug === materialInput.trim().toLowerCase().replace(/\s+/g, '-')) && (
                <button type="button" className="mt-2 text-sm underline" onClick={() => { const slug = materialInput.trim().toLowerCase().replace(/\s+/g, '-'); setSelectedMaterials(prev => Array.from(new Set([...prev, slug]))); setMaterialInput(''); }}>
                  + Add "{materialInput}" as new material
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Care Instructions (one per line)</label>
            <textarea className="w-full border rounded px-3 py-2" rows={4} value={careText} onChange={(e) => setCareText(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">SEO Title</label>
              <input className="w-full border rounded px-3 py-2" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SEO Keywords (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
          {/* Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fabric</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Fabric'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Fabric']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Color'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Color']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Neckline</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Neckline'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Neckline']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pack Contain</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Pack Contain'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Pack Contain']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Technique</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Technique'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Technique']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product Length</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Product Length'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Product Length']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sleeves</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Sleeves'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Sleeves']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fit</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Fit'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Fit']: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lining</label>
              <input className="w-full border rounded px-3 py-2" value={specs['Lining'] || ''} onChange={(e) => setSpecs(s => ({ ...s, ['Lining']: e.target.value }))} />
            </div>
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowLibrary(false)}>
          <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Image Library</h3>
              <button className="text-sm" onClick={() => setShowLibrary(false)}>Close</button>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <input className="border rounded px-2 py-1 w-full" placeholder="Search files" value={libraryQuery} onChange={(e) => setLibraryQuery(e.target.value)} />
              <select className="border rounded px-2 py-1" value={librarySort} onChange={(e) => setLibrarySort(e.target.value as any)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="name">Name</option>
                <option value="size">Size</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-auto">
              {library
                .filter(f => !libraryQuery || f.name.toLowerCase().includes(libraryQuery.toLowerCase()))
                .sort((a, b) => {
                  switch (librarySort) {
                    case 'oldest': return a.mtime - b.mtime;
                    case 'name': return a.name.localeCompare(b.name);
                    case 'size': return a.size - b.size;
                    default: return b.mtime - a.mtime; // newest
                  }
                })
                .map(f => (
                  <label key={f.url} className="relative border rounded overflow-hidden cursor-pointer">
                    <img src={f.url} alt={f.name} className="w-full h-40 object-cover" />
                    <input type="checkbox" className="absolute top-1 left-1 bg-white" checked={!!librarySelected[f.url]} onChange={(e) => setLibrarySelected(prev => ({ ...prev, [f.url]: e.target.checked }))} />
                  </label>
                ))}
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button className="border px-3 py-1 rounded" onClick={() => setLibrarySelected({})}>Clear</button>
              <button className="border px-3 py-1 rounded" onClick={async () => {
                const names = Object.entries(librarySelected).filter(([, v]) => v).map(([u]) => u.split('/').pop() as string);
                if (names.length === 0) return;
                const { usages } = await adminFindUploadUsages(names);
                const total = Object.values(usages).reduce((s, arr) => s + (arr?.length || 0), 0);
                if (total > 0) {
                  const list = Object.entries(usages).filter(([, arr]) => arr && arr.length).map(([n, arr]) => `- ${n}: ${arr.length} usage(s)`).join('\n');
                  const ok = confirm(`Selected images are used in ${total} place(s):\n${list}\n\nDetach from products and delete files?`);
                  if (!ok) return;
                  await adminDetachUploads({ names });
                } else {
                  const ok2 = confirm(`Delete ${names.length} image(s) from library?`);
                  if (!ok2) return;
                }
                await adminDeleteUploads({ names });
                setLibrary(library.filter(f => !names.includes(f.url.split('/').pop() as string)));
                setLibrarySelected({});
              }}>Delete Selected</button>
              <button className="bg-black text-white px-3 py-1 rounded" onClick={() => { const picked = Object.entries(librarySelected).filter(([, v]) => v).map(([k]) => k); if (picked.length) { const arr = [...imageUrls, ...picked]; setImageUrls(arr); setImages(arr.join(', ')); } setShowLibrary(false); }}>Add Selected</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showManageCats && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowManageCats(false)}>
          <div className="bg-white max-w-xl w-full p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Manage Categories</h3>
              <button className="text-sm" onClick={() => setShowManageCats(false)}>Close</button>
            </div>
            <div className="max-h-[60vh] overflow-auto divide-y">
              {availableCategories.map((c) => {
                const st = catEdits[c.id] || { name: c.name };
                return (
                  <div key={c.id} className="py-2 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Slug: {c.slug} • Products: {c.productCount}</div>
                      <input
                        className="border rounded px-2 py-1 w-full mt-1"
                        value={st.name}
                        onChange={(e) => setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || {}), name: e.target.value } }))}
                      />
                      {st.error && <div className="text-xs text-red-600 mt-1">{st.error}</div>}
                      {st.success && <div className="text-xs text-green-600 mt-1">Saved</div>}
                    </div>
                    <button
                      className="border px-3 py-1 rounded"
                      disabled={!!st.saving}
                      onClick={async () => {
                        const name = (catEdits[c.id]?.name ?? c.name).trim();
                        if (!name) { setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name: '' }), error: 'Name is required' } })); return; }
                        setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name }), saving: true, error: undefined, success: false } }));
                        try {
                          const updated = await adminUpdateCategory(c.id, { name });
                          setAvailableCategories(prev => prev.map(x => x.id === c.id ? { ...x, name: updated.name } : x));
                          setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name }), saving: false, success: true } }));
                          setTimeout(() => setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name }), success: false } })), 1500);
                        } catch (e: any) {
                          setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name }), saving: false, error: e?.message || 'Save failed' } }));
                        }
                      }}
                    >
                      {st.saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      className="border px-3 py-1 rounded text-red-600"
                      onClick={async () => {
                        const inUse = (c.productCount || 0) > 0;
                        const ok = confirm(inUse ? `"${c.name}" is used in ${c.productCount} product(s). Detach and delete?` : `Delete category "${c.name}"?`);
                        if (!ok) return;
                        try {
                          await adminDeleteCategory(c.id, { force: inUse });
                          setAvailableCategories(prev => prev.filter(x => x.id !== c.id));
                          setSelectedCategories(prev => prev.filter(s => s !== c.slug));
                        } catch (e: any) {
                          setCatEdits(prev => ({ ...prev, [c.id]: { ...(prev[c.id] || { name: c.name }), error: e?.message || 'Delete failed' } }));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              {availableCategories.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">No categories yet</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manage Materials Modal */}
      {showManageMats && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={() => setShowManageMats(false)}>
          <div className="bg-white max-w-xl w-full p-4 rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Manage Materials</h3>
              <button className="text-sm" onClick={() => setShowManageMats(false)}>Close</button>
            </div>
            <div className="max-h-[60vh] overflow-auto divide-y">
              {availableMaterials.map((m) => {
                const st = matEdits[m.id] || { name: m.name };
                return (
                  <div key={m.id} className="py-2 flex items-center gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Slug: {m.slug} • Products: {m.productCount}</div>
                      <input
                        className="border rounded px-2 py-1 w-full mt-1"
                        value={st.name}
                        onChange={(e) => setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || {}), name: e.target.value } }))}
                      />
                      {st.error && <div className="text-xs text-red-600 mt-1">{st.error}</div>}
                      {st.success && <div className="text-xs text-green-600 mt-1">Saved</div>}
                    </div>
                    <button
                      className="border px-3 py-1 rounded"
                      disabled={!!st.saving}
                      onClick={async () => {
                        const name = (matEdits[m.id]?.name ?? m.name).trim();
                        if (!name) { setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name: '' }), error: 'Name is required' } })); return; }
                        setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name }), saving: true, error: undefined, success: false } }));
                        try {
                          const updated = await adminUpdateMaterial(m.id, { name });
                          setAvailableMaterials(prev => prev.map(x => x.id === m.id ? { ...x, name: updated.name } : x));
                          setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name }), saving: false, success: true } }));
                          setTimeout(() => setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name }), success: false } })), 1500);
                        } catch (e: any) {
                          setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name }), saving: false, error: e?.message || 'Save failed' } }));
                        }
                      }}
                    >
                      {st.saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      className="border px-3 py-1 rounded text-red-600"
                      onClick={async () => {
                        const inUse = (m.productCount || 0) > 0;
                        const ok = confirm(inUse ? `"${m.name}" is used in ${m.productCount} product(s). Detach and delete?` : `Delete material "${m.name}"?`);
                        if (!ok) return;
                        try {
                          await adminDeleteMaterial(m.id, { force: inUse });
                          setAvailableMaterials(prev => prev.filter(x => x.id !== m.id));
                          setSelectedMaterials(prev => prev.filter(s => s !== m.slug));
                        } catch (e: any) {
                          setMatEdits(prev => ({ ...prev, [m.id]: { ...(prev[m.id] || { name: m.name }), error: e?.message || 'Delete failed' } }));
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
              {availableMaterials.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">No materials yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
