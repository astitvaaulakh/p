'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import ProductTable from '@/components/admin/ProductTable';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const supabase = createClient();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, categories(id, name, created_at)')
      .order('created_at', { ascending: false });
    setProducts(data || []);
    setFiltered(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Client-side filter
  useEffect(() => {
    if (!query.trim()) {
      setFiltered(products);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.categories && (p.categories as { name: string }).name.toLowerCase().includes(q))
      )
    );
  }, [query, products]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Products</h1>
          <p className="text-sm text-[#6C757D] mt-1">
            {products.length} product{products.length !== 1 ? 's' : ''} in your catalog
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button size="md" id="add-product-btn">
            <Plus size={16} />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#ADB5BD]"
        />
        <input
          type="search"
          id="admin-product-search"
          placeholder="Filter by title or category…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E9ECEF] bg-white text-sm text-[#1A1A2E] placeholder:text-[#ADB5BD] focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner size="lg" className="py-24" text="Loading products…" />
      ) : (
        <ProductTable products={filtered} onDeleted={fetchProducts} />
      )}
    </div>
  );
}
