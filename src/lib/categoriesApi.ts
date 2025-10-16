import { api } from '@/lib/api';

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  productCount: number;
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  return api('/api/categories');
}

