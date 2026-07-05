// Shared TypeScript types for 1minproduct

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  image_url: string;
  affiliate_link: string;
  category_id: string | null;
  created_at: string;
  categories?: Category | null;
}

export interface ProductWithCategory extends Product {
  categories: Category | null;
}

export interface CategoryWithProducts extends Category {
  products: Product[];
}

export type FormState = 'idle' | 'loading' | 'success' | 'error';
