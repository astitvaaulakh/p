import { Clock } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface RecentlyAddedProps {
  products: Product[];
}

export default function RecentlyAdded({ products }: RecentlyAddedProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="opacity-0-init animate-fade-in-up"
      style={{ animationFillMode: 'forwards' }}
      aria-labelledby="recently-added-heading"
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center shadow-sm">
            <Clock size={15} className="text-white" />
          </div>
          <h2
            id="recently-added-heading"
            className="text-xl sm:text-2xl font-bold text-[#1A1A2E]"
          >
            Recently Added
          </h2>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-semibold">
          NEW
        </span>
      </div>

      {/* Horizontal scroll row */}
      <div className="scroll-container">
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[160px] sm:w-[200px] md:w-[220px] lg:w-[240px] xl:w-[220px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
