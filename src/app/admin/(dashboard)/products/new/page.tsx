import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
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
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Add New Product</h1>
        <p className="text-sm text-[#6C757D] mt-1">
          Fill in the details below to add a product to your catalog.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-6 sm:p-8">
        <ProductForm />
      </div>
    </div>
  );
}
