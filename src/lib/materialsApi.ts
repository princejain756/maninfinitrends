import { api } from '@/lib/api';

export interface MaterialDto {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}

export async function fetchMaterials(): Promise<MaterialDto[]> {
  return api('/api/materials');
}

