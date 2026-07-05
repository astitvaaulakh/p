import { ChevronRight } from 'lucide-react';
import { Category, Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface CategorySectionProps {
  category: Category;
  products: Product[];
  index?: number;
}

export default function CategorySection({
  category,
  products,
  index = 0,
}: CategorySectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="opacity-0-init animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
      aria-labelledby={`category-${category.id}`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2
          id={`category-${category.id}`}
          className="text-xl sm:text-2xl font-bold text-[#1A1A2E] flex items-center gap-3"
        >
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-[#FF6B35] to-[#FF8C5A] inline-block" />
          {category.name}
          <span className="text-sm font-medium text-[#ADB5BD] ml-1">
            ({products.length})
          </span>
        </h2>
        {/* View all button placeholder for future feature */}
        {products.length > 6 && (
          <button className="flex items-center gap-1 text-sm font-medium text-[#FF6B35] hover:text-[#E55A24] transition-colors">
            View all <ChevronRight size={16} />
          </button>
        )}
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
