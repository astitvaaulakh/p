import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Product } from '@/lib/types';
import { truncate } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={product.affiliate_link}
      target="_blank"
      rel="noopener noreferrer"
      id={`product-card-${product.id}`}
      aria-label={`View ${product.title} on Amazon`}
      className="group block bg-white rounded-2xl overflow-hidden border border-[#F1F3F5] shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-[#F8F9FA] overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Amazon badge on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm">
            <ExternalLink size={12} className="text-[#FF6B35]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3
          className="text-sm font-semibold text-[#1A1A2E] leading-snug line-clamp-2 group-hover:text-[#FF6B35] transition-colors duration-200"
          title={product.title}
        >
          {truncate(product.title, 80)}
        </h3>

        {/* CTA Button */}
        <div className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white text-xs font-semibold text-center flex items-center justify-center gap-1.5 group-hover:from-[#E55A24] group-hover:to-[#FF6B35] transition-all duration-200 shadow-sm group-hover:shadow-md">
          <span>View on Amazon</span>
          <ExternalLink size={11} />
        </div>
      </div>
    </a>
  );
}
