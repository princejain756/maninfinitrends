import { api, API_BASE_URL } from '@/lib/api';

export type Id = string;

export async function adminSummary() {
  return api('/api/admin/summary');
}

export async function adminListProducts() {
  return api('/api/admin/products');
}

export async function adminGetProduct(id: Id) {
  return api(`/api/admin/products/${id}`);
}

export async function adminUpdateProduct(id: Id, data: any) {
  return api(`/api/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteProduct(id: Id) {
  return api(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export async function adminListOrders() {
  return api('/api/admin/orders');
}

export async function adminGetOrder(id: Id) {
  return api(`/api/admin/orders/${id}`);
}

export async function adminUpdateOrder(id: Id, status: string) {
  return api(`/api/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function adminListTickets() {
  return api('/api/admin/tickets');
}

export async function adminUpdateTicket(id: Id, status: string) {
  return api(`/api/admin/tickets/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function adminCapturePayment(orderId: Id) {
  return api(`/api/admin/orders/${orderId}/capture`, { method: 'POST' });
}

export async function adminRefundPayment(orderId: Id) {
  return api(`/api/admin/orders/${orderId}/refund`, { method: 'POST' });
}

export async function adminCaptureCodPayment(orderId: Id) {
  return api(`/api/admin/orders/${orderId}/capture-cod`, { method: 'POST' });
}

export async function adminDeleteOrder(orderId: Id) {
  return api(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
}

// Upload one or more images for products. Returns array of absolute URLs.
export async function adminUploadImages(files: File[]): Promise<{ urls: string[] }> {
  const form = new FormData();
  for (const f of files) form.append('files', f);
  const res = await fetch(`${API_BASE_URL}/api/admin/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to upload images');
  }
  return res.json();
}

// Upload a single image with progress callback
export function adminUploadImage(file: File, onProgress?: (percent: number) => void): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE_URL}/api/admin/uploads`);
    xhr.withCredentials = true;
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = xhr.response || JSON.parse(xhr.responseText);
          const url = Array.isArray(data?.urls) ? data.urls[0] : undefined;
          if (url) resolve({ url }); else reject(new Error('No URL returned'));
        } catch (e) {
          reject(new Error('Invalid upload response'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error while uploading'));
    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable) return;
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      };
    }
    const form = new FormData();
    form.append('files', file);
    xhr.send(form);
  });
}

export async function adminListUploads(): Promise<{ files: { name: string; url: string; size: number; mtime: number }[] }> {
  const res = await fetch(`${API_BASE_URL}/api/admin/uploads`, { credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to list uploads');
  }
  return res.json();
}

export async function adminDeleteUploads(items: { urls?: string[]; names?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/api/admin/uploads/delete`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to delete uploads');
  }
  return res.json();
}

export async function adminFindUploadUsages(names: string[]): Promise<{ usages: Record<string, { imageId: string; productId: string; product: { id: string; slug: string; title: string } }[]> }> {
  const params = new URLSearchParams({ names: names.join(',') });
  const res = await fetch(`${API_BASE_URL}/api/admin/uploads/usages?${params.toString()}`, { credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to find usages');
  }
  return res.json();
}

export async function adminDetachUploads(items: { urls?: string[]; names?: string[] }) {
  const res = await fetch(`${API_BASE_URL}/api/admin/uploads/detach`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to detach uploads');
  }
  return res.json();
}

export async function adminAddVariant(productId: Id, data: { sku: string; name: string; priceCents: number; stock?: number }) {
  return api(`/api/admin/products/${productId}/variants`, { method: 'POST', body: JSON.stringify(data) });
}

export async function adminUpdateVariant(variantId: Id, data: { sku?: string; name?: string; priceCents?: number; stock?: number }) {
  return api(`/api/admin/variants/${variantId}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteVariant(variantId: Id) {
  return api(`/api/admin/variants/${variantId}`, { method: 'DELETE' });
}

// Categories: update name and/or slug
export async function adminUpdateCategory(id: Id, data: { name?: string; slug?: string }) {
  return api(`/api/admin/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

// Materials: update name and/or slug
export async function adminUpdateMaterial(id: Id, data: { name?: string; slug?: string }) {
  return api(`/api/admin/materials/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function adminDeleteCategory(id: Id, opts?: { force?: boolean }) {
  const q = opts?.force ? '?force=1' : '';
  return api(`/api/admin/categories/${id}${q}`, { method: 'DELETE' });
}

export async function adminDeleteMaterial(id: Id, opts?: { force?: boolean }) {
  const q = opts?.force ? '?force=1' : '';
  return api(`/api/admin/materials/${id}${q}`, { method: 'DELETE' });
}
