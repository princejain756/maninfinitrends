import { api } from '@/lib/api';

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
