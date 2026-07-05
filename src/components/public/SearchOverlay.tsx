'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Search, X, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { truncate } from '@/lib/utils';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Live search with debounce
  const search = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }
      setLoading(true);
      setHasSearched(true);

      const { data } = await supabase
        .from('products')
        .select('*, categories(name)')
        .or(`title.ilike.%${q}%`)
        .order('created_at', { ascending: false })
        .limit(20);

      setResults(data || []);
      setLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      role="dialog"
      aria-label="Search products"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search panel - slides down from top */}
      <div className="relative z-10 animate-slide-down">
        {/* Search input bar */}
        <div className="bg-white shadow-xl border-b border-[#F1F3F5]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3">
              <Search size={20} className="text-[#FF6B35] shrink-0" />
              <input
                ref={inputRef}
                type="search"
                placeholder="Search products, categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-lg text-[#1A1A2E] placeholder:text-[#ADB5BD] bg-transparent border-none outline-none"
                id="search-input"
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full hover:bg-[#F8F9FA] text-[#ADB5BD] hover:text-[#6C757D] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#6C757D] hover:text-[#1A1A2E] transition-colors"
                aria-label="Close search"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Results dropdown */}
        {(hasSearched || loading) && (
          <div className="bg-white border-b border-[#F1F3F5] shadow-lg max-h-[70vh] overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
              {loading && (
                <div className="flex items-center gap-3 py-6 justify-center">
                  <div className="animate-spin h-5 w-5 rounded-full border-2 border-[#E9ECEF] border-t-[#FF6B35]" />
                  <span className="text-sm text-[#6C757D]">Searching…</span>
                </div>
              )}

              {!loading && results.length === 0 && hasSearched && (
                <div className="py-10 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-[#1A1A2E] font-semibold mb-1">
                    No results for &quot;{query}&quot;
                  </p>
                  <p className="text-sm text-[#6C757D]">
                    Try a different keyword or browse by category
                  </p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[#ADB5BD] uppercase tracking-wide mb-3">
                    {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                  </p>
                  <div className="grid gap-2">
                    {results.map((product) => (
                      <a
                        key={product.id}
                        href={product.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F8F9FA] transition-colors group"
                        id={`search-result-${product.id}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-[#F8F9FA] relative overflow-hidden shrink-0 border border-[#F1F3F5]">
                          <Image
                            src={product.image_url}
                            alt={product.title}
                            fill
                            className="object-contain p-1"
                            sizes="56px"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1A1A2E] truncate group-hover:text-[#FF6B35] transition-colors">
                            {truncate(product.title, 60)}
                          </p>
                          {product.categories && (
                            <p className="text-xs text-[#ADB5BD] mt-0.5">
                              {(product.categories as { name: string }).name}
                            </p>
                          )}
                        </div>
                        {/* Arrow */}
                        <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1 text-xs font-medium text-[#FF6B35]">
                            Amazon <ExternalLink size={12} />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
