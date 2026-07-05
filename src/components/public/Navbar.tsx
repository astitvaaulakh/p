'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import SearchOverlay from './SearchOverlay';

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#F1F3F5] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="1minproduct home"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#E55A24] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="text-white font-black text-xs leading-none">1m</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[#1A1A2E]">
                1min<span className="text-[#FF6B35]">product</span>
              </span>
            </Link>

            {/* Search icon */}
            <button
              onClick={openSearch}
              aria-label="Open search"
              id="navbar-search-btn"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F9FA] border border-[#E9ECEF] text-[#6C757D] hover:bg-[#F1F3F5] hover:text-[#1A1A2E] hover:border-[#FF6B35]/30 transition-all duration-200 group"
            >
              <Search size={16} className="group-hover:text-[#FF6B35] transition-colors" />
              <span className="text-sm font-medium hidden sm:block">Search products…</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  );
}
