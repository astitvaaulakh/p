import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ProductForm from '@/components/admin/ProductForm';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) notFound();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-[#6C757D] hover:text-[#1A1A2E] transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Edit Product</h1>
        <p className="text-sm text-[#6C757D] mt-1">
          Update the product details below.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-6 sm:p-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
