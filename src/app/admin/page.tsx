import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Package, Tag, TrendingUp, Plus } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: categoryCount }, { data: recentProducts }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase
        .from('products')
        .select('id, title, created_at, categories(name)')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

  const stats = [
    {
      label: 'Total Products',
      value: productCount ?? 0,
      icon: Package,
      color: 'from-[#FF6B35] to-[#FF8C5A]',
      href: '/admin/products',
    },
    {
      label: 'Categories',
      value: categoryCount ?? 0,
      icon: Tag,
      color: 'from-[#6C63FF] to-[#8B85FF]',
      href: '/admin/categories',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
        <p className="text-sm text-[#6C757D] mt-1">
          Welcome back! Here&apos;s an overview of your store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl p-6 border border-[#F1F3F5] shadow-sm hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#6C757D]">{label}</p>
                <p className="text-3xl font-bold text-[#1A1A2E] mt-1">{value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
              >
                <Icon size={22} className="text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-[#FF6B35]" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            href="/admin/products/new"
            id="dash-add-product"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[#E9ECEF] hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center group-hover:bg-[#FF6B35]/20 transition-colors">
              <Plus size={16} className="text-[#FF6B35]" />
            </div>
            <span className="text-sm font-medium text-[#6C757D] group-hover:text-[#1A1A2E] transition-colors">
              Add New Product
            </span>
          </Link>
          <Link
            href="/admin/categories"
            id="dash-manage-categories"
            className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-[#E9ECEF] hover:border-[#6C63FF] hover:bg-[#6C63FF]/5 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/10 flex items-center justify-center group-hover:bg-[#6C63FF]/20 transition-colors">
              <Tag size={16} className="text-[#6C63FF]" />
            </div>
            <span className="text-sm font-medium text-[#6C757D] group-hover:text-[#1A1A2E] transition-colors">
              Manage Categories
            </span>
          </Link>
        </div>
      </div>

      {/* Recent products */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#1A1A2E]">
            Recently Added Products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm font-medium text-[#FF6B35] hover:text-[#E55A24] transition-colors"
          >
            View all →
          </Link>
        </div>

        {(!recentProducts || recentProducts.length === 0) ? (
          <div className="py-8 text-center">
            <p className="text-[#ADB5BD] text-sm">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="text-sm font-medium text-[#FF6B35] hover:underline mt-1 inline-block"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-2 border-b border-[#F8F9FA] last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A1A2E] truncate max-w-xs">
                    {product.title}
                  </p>
                  <p className="text-xs text-[#ADB5BD]">
                    {(product.categories as { name: string } | null)?.name ?? 'Uncategorized'}
                  </p>
                </div>
                <p className="text-xs text-[#ADB5BD]">
                  {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
