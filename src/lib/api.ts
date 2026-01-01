// Prefer same-origin by default so Nginx can proxy /api to the backend.
// Only use an absolute base if VITE_API_BASE_URL is explicitly provided.
const __ENV_BASE = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
export const API_BASE_URL = __ENV_BASE && __ENV_BASE !== 'undefined' && __ENV_BASE !== 'null' ? __ENV_BASE : '';

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return res.json();
}
