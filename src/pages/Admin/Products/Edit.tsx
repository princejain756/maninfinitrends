import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGetProduct, adminUpdateProduct, adminUploadImages, adminListUploads, adminAddVariant, adminUpdateVariant, adminDeleteVariant, adminFindUploadUsages, adminDetachUploads, adminDeleteUploads } from '@/lib/adminApi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fetchCategories, type CategoryDto } from '@/lib/categoriesApi';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [careText, setCareText] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [slug, setSlug] = useState('');
  const [active, setActive] = useState(true);
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState('');
  const [availableCategories, setAvailableCategories] = useState<CategoryDto[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [stock, setStock] = useState('');
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<{ name: string; url: string; size: number; mtime: number }[]>([]);
  const [librarySelected, setLibrarySelected] = useState<Record<string, boolean>>({});
  const [libraryQuery, setLibraryQuery] = useState('');
  const [librarySort, setLibrarySort] = useState<'newest'|'oldest'|'name'|'size'>('newest');
  const [variants, setVariants] = useState<Array<{ id: string; sku: string; name: string; priceCents: number; stock: number }>>([]);
  const [newVar, setNewVar] = useState<{ sku: string; name: string; price: string; stock: string }>({ sku: '', name: '', price: '', stock: '' });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    adminGetProduct(id)
      .then((p) => {
        setTitle(p.title || '');
        // Extract META block if present
        let desc = p.description || '';
        const metaMatch = desc.match(/<!--META[\r\n]+([\s\S]*?)[\r\n]+META-->/i);
        if (metaMatch) {
          try {
            const meta = JSON.parse(metaMatch[1]);
            if (Array.isArray(meta?.care)) setCareText(meta.care.join('\n'));
            if (meta?.seo) {
              setSeoTitle(meta.seo.title || '');
              setSeoDescription(meta.seo.description || '');
              setSeoKeywords(Array.isArray(meta.seo.keywords) ? meta.seo.keywords.join(', ') : '');
            }
          } catch {}
          desc = desc.replace(metaMatch[0], '').trim();
        }
        // Prefer DB fields if available
        if ((p as any).care && Array.isArray((p as any).care)) setCareText(((p as any).care as string[]).join('\n'));
        if ((p as any).seoTitle) setSeoTitle(String((p as any).seoTitle));
        if ((p as any).seoDescription) setSeoDescription(String((p as any).seoDescription));
        if ((p as any).seoKeywords) setSeoKeywords(String((p as any).seoKeywords));
        setDescription(desc);
        setSlug(p.slug || '');
        setActive(!!p.active);
        const v = p.variants?.[0];
        setSku(v?.sku || '');
        setPrice(v ? String((v.priceCents||0)/100) : '');
        if (v?.inventory?.quantity != null) setStock(String(v.inventory.quantity));
        const vs = (p.variants || []).map((vv:any)=>({ id: vv.id, sku: vv.sku, name: vv.name, priceCents: vv.priceCents, stock: vv.inventory?.quantity || 0 }));
        setVariants(vs);
        const imgs = (p.images||[]).map((i:any)=>i.url);
        setImages(imgs.join(', '));
        setImageUrls(imgs);
        const catSlugs = (p.categories||[]).map((c:any)=>c.category?.slug||'').filter(Boolean);
        setCategories(catSlugs.join(', '));
        setSelectedCategories(catSlugs);
        setLoading(false);
      })
      .catch((e) => { setError(e?.message || 'Failed'); setLoading(false); });
  }, [id]);

  useEffect(() => { fetchCategories().then(setAvailableCategories).catch(()=>{}); }, []);
  useEffect(() => { setImageUrls(images.split(',').map(s=>s.trim()).filter(Boolean)); }, [images]);
  useEffect(() => {
    if (!showLibrary) return;
    adminListUploads().then(({ files }) => setLibrary(files)).catch(()=>setLibrary([]));
  }, [showLibrary]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const priceCents = Math.round(parseFloat(price) * 100);
      let finalImages = [...imageUrls];
      if (newFiles.length > 0) {
        const { urls } = await adminUploadImages(newFiles);
        finalImages = [...finalImages, ...urls];
      }
      // Add selections from library
      const picked = Object.entries(librarySelected).filter(([,v])=>v).map(([k])=>k);
      if (picked.length) finalImages = [...finalImages, ...picked];
      await adminUpdateProduct(id, {
        title, description, slug, active,
        sku, priceCents,
        images: finalImages,
        categories: Array.from(new Set([...categories.split(',').map(s=>s.trim()).filter(Boolean), ...selectedCategories])),
        care: careText.split(/\r?\n/).map(s=>s.trim()).filter(Boolean),
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        seoKeywords: seoKeywords || undefined,
        stock: stock ? Number(stock) : undefined,
      });
      navigate('/admin/products');
    } catch (e:any) {
      setError(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const saveVariant = async (vr: { id: string; sku: string; name: string; priceCents: number; stock: number }) => {
    await adminUpdateVariant(vr.id, { sku: vr.sku, name: vr.name, priceCents: vr.priceCents, stock: vr.stock });
  };

  const removeVariant = async (vid: string) => {
    await adminDeleteVariant(vid);
    setVariants(vs=>vs.filter(v=>v.id!==vid));
  };

  const addVariant = async () => {
    if (!id) return;
    const data = { sku: newVar.sku.trim(), name: newVar.name.trim(), priceCents: Math.round(parseFloat(newVar.price||'0')*100), stock: parseInt(newVar.stock||'0',10) };
    const v = await adminAddVariant(id, data as any);
    setVariants(vs=>[...vs, { id: v.id, sku: v.sku, name: v.name, priceCents: v.priceCents, stock: v.inventory?.quantity || 0 }]);
    setNewVar({ sku: '', name: '', price: '', stock: '' });
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
          <div>
            <label className="block text-sm mb-1">Stock Quantity</label>
            <input type="number" min="0" className="w-full border rounded px-3 py-2" value={stock} onChange={e=>setStock(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <ReactQuill theme="snow" value={description} onChange={setDescription} />
        </div>
        <div>
          <label className="block text-sm mb-1">Care Instructions (one per line)</label>
          <textarea className="w-full border rounded px-3 py-2" rows={4} value={careText} onChange={(e)=>setCareText(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">SEO Title</label>
            <input className="w-full border rounded px-3 py-2" value={seoTitle} onChange={(e)=>setSeoTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">SEO Keywords (comma separated)</label>
            <input className="w-full border rounded px-3 py-2" value={seoKeywords} onChange={(e)=>setSeoKeywords(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">SEO Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={seoDescription} onChange={(e)=>setSeoDescription(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Images</label>
            <input className="w-full border rounded px-3 py-2" value={images} onChange={e=>setImages(e.target.value)} />
            {imageUrls.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {imageUrls.map((url, idx) => (
                  <div
                    key={url+idx}
                    className="w-20 h-20 border rounded overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-primary"
                    draggable
                    tabIndex={0}
                    onKeyDown={(e)=>{
                      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                        const to = Math.max(0, idx-1); const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault();
                      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                        const to = Math.min(imageUrls.length-1, idx+1); const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); e.preventDefault();
                      }
                    }}
                    onDragStart={(ev)=>ev.dataTransfer.setData('text/plain', String(idx))}
                    onDragOver={(e)=>e.preventDefault()}
                    onDrop={(ev)=>{ ev.preventDefault(); const from = Number(ev.dataTransfer.getData('text/plain')); const to = idx; if (!Number.isNaN(from)) { const arr=[...imageUrls]; const [m]=arr.splice(from,1); arr.splice(to,0,m); setImageUrls(arr); setImages(arr.join(', ')); } }}
                  >
                    <img src={url} alt="img" className="w-full h-full object-cover" />
                    <button type="button" title="Set as cover" className="absolute bottom-0 left-0 bg-black/70 text-white text-xs px-1" onClick={()=>{ const arr=[...imageUrls]; const [m]=arr.splice(idx,1); arr.unshift(m); setImageUrls(arr); setImages(arr.join(', ')); }}>★</button>
                    <button type="button" className="absolute top-0 right-0 bg-black/50 text-white text-xs px-1" onClick={()=>{ const arr=imageUrls.filter((_,i)=>i!==idx); setImageUrls(arr); setImages(arr.join(', ')); }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2">
              <label className="block text-sm mb-1">Upload More</label>
              <input type="file" accept="image/*" multiple className="w-full border rounded px-3 py-2" onChange={(e)=>setNewFiles(e.target.files?Array.from(e.target.files):[])} />
              {newFiles.length>0 && <p className="text-xs text-gray-600 mt-1">{newFiles.length} image(s) will be uploaded on save</p>}
              <button type="button" className="mt-2 underline" onClick={()=>setShowLibrary(true)}>Choose from Library</button>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Categories</label>
            <div className="border rounded p-2">
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCategories.map((slug) => (
                    <span key={slug} className="inline-flex items-center gap-1 bg-gray-100 rounded px-2 py-1 text-sm capitalize">
                      {availableCategories.find(c=>c.slug===slug)?.name || slug}
                      <button type="button" onClick={()=>setSelectedCategories(prev=>prev.filter(s=>s!==slug))}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Type to search or add…" value={categoryInput} onChange={(e)=>setCategoryInput(e.target.value)} />
              <div className="max-h-40 overflow-auto divide-y">
                {availableCategories.filter(c=>!categoryInput || c.name.toLowerCase().includes(categoryInput.toLowerCase()) || c.slug.includes(categoryInput.toLowerCase())).map(c=> (
                  <label key={c.id} className="flex items-center justify-between py-1 cursor-pointer">
                    <span className="capitalize">{c.name}</span>
                    <input type="checkbox" checked={selectedCategories.includes(c.slug)} onChange={(e)=>setSelectedCategories(prev=>e.target.checked?Array.from(new Set([...prev,c.slug])):prev.filter(s=>s!==c.slug))} />
                  </label>
                ))}
              </div>
              {categoryInput.trim() && !availableCategories.some(c=>c.slug===categoryInput.trim().toLowerCase().replace(/\s+/g,'-')) && (
                <button type="button" className="mt-2 text-sm underline" onClick={()=>{ const slug=categoryInput.trim().toLowerCase().replace(/\s+/g,'-'); setSelectedCategories(prev=>Array.from(new Set([...prev, slug]))); setCategoryInput(''); }}>+ Add "{categoryInput}" as new category</button>
              )}
            </div>
            {/* Legacy input */}
            <div className="mt-2">
              <label className="block text-xs text-gray-500 mb-1">Or paste categories (comma separated)</label>
              <input className="w-full border rounded px-3 py-2" value={categories} onChange={e=>setCategories(e.target.value)} />
            </div>
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
                    default: return b.mtime - a.mtime;
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

      {/* Variants */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Variants (beta)</h2>
        <div className="overflow-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">SKU</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Price (INR)</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((vr, idx) => (
                <tr key={vr.id} className={idx % 2 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={vr.sku} onChange={(e)=>setVariants(vs=>vs.map(v=>v.id===vr.id?{...v, sku:e.target.value}:v))} /></td>
                  <td className="p-2"><input className="border rounded px-2 py-1 w-full" value={vr.name} onChange={(e)=>setVariants(vs=>vs.map(v=>v.id===vr.id?{...v, name:e.target.value}:v))} /></td>
                  <td className="p-2"><input type="number" step="0.01" className="border rounded px-2 py-1 w-full" value={(vr.priceCents/100).toString()} onChange={(e)=>setVariants(vs=>vs.map(v=>v.id===vr.id?{...v, priceCents: Math.round(parseFloat(e.target.value||'0')*100)}:v))} /></td>
                  <td className="p-2"><input type="number" min="0" className="border rounded px-2 py-1 w-full" value={vr.stock} onChange={(e)=>setVariants(vs=>vs.map(v=>v.id===vr.id?{...v, stock: parseInt(e.target.value||'0',10)}:v))} /></td>
                  <td className="p-2 flex gap-2 justify-center">
                    <button className="border px-2 py-1 rounded" onClick={()=>saveVariant(vr)}>Save</button>
                    <button className="border px-2 py-1 rounded" onClick={()=>removeVariant(vr.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td className="p-2"><input className="border rounded px-2 py-1 w-full" placeholder="SKU" value={newVar.sku} onChange={(e)=>setNewVar(s=>({...s, sku:e.target.value}))} /></td>
                <td className="p-2"><input className="border rounded px-2 py-1 w-full" placeholder="Name" value={newVar.name} onChange={(e)=>setNewVar(s=>({...s, name:e.target.value}))} /></td>
                <td className="p-2"><input className="border rounded px-2 py-1 w-full" type="number" step="0.01" placeholder="Price" value={newVar.price} onChange={(e)=>setNewVar(s=>({...s, price:e.target.value}))} /></td>
                <td className="p-2"><input className="border rounded px-2 py-1 w-full" type="number" min="0" placeholder="Stock" value={newVar.stock} onChange={(e)=>setNewVar(s=>({...s, stock:e.target.value}))} /></td>
                <td className="p-2 text-center"><button className="bg-black text-white px-3 py-1 rounded" onClick={addVariant}>Add</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
