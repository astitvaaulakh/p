import { createClient } from '@/lib/supabase/server';
import { Category, Product } from '@/lib/types';
import CategorySection from '@/components/public/CategorySection';
import RecentlyAdded from '@/components/public/RecentlyAdded';

export const dynamic = 'force-dynamic';

// Revalidate every 60 seconds for near-real-time updates
export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: true });

  // Fetch all products with category info, newest first
  const { data: products } = await supabase
    .from('products')
    .select('*, categories(id, name, created_at)')
    .order('created_at', { ascending: false });

  const allCategories: Category[] = categories || [];
  const allProducts: Product[] = products || [];

  // Recently added: latest 12 products
  const recentProducts = allProducts.slice(0, 12);

  // Group products by category
  const productsByCategory = allCategories.reduce<Record<string, Product[]>>(
    (acc, cat) => {
      acc[cat.id] = allProducts.filter((p) => p.category_id === cat.id);
      return acc;
    },
    {}
  );

  const hasAnyProducts = allProducts.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero banner */}
      <div className="mb-12 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-sm font-semibold mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          Curated Amazon Products
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1A1A2E] leading-tight mb-4">
          Discover Amazing Products{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A]">
            in 1 Minute
          </span>
        </h1>
        <p className="text-[#6C757D] text-base sm:text-lg max-w-xl mx-auto">
          Hand-picked products from Amazon across every category. Find what you need, instantly.
        </p>
      </div>

      {/* No products state */}
      {!hasAnyProducts && (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
            Products coming soon!
          </h2>
          <p className="text-[#6C757D] max-w-sm">
            We&apos;re curating the best products for you. Check back soon!
          </p>
        </div>
      )}

      {/* Recently Added */}
      {recentProducts.length > 0 && (
        <div className="mb-12">
          <RecentlyAdded products={recentProducts} />
        </div>
      )}

      {/* Category sections */}
      <div className="flex flex-col gap-12">
        {allCategories.map((category, index) => {
          const catProducts = productsByCategory[category.id] || [];
          if (catProducts.length === 0) return null;
          return (
            <CategorySection
              key={category.id}
              category={category}
              products={catProducts}
              index={index + 1}
            />
          );
        })}
      </div>
    </div>
  );
}
