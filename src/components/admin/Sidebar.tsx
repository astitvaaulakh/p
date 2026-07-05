'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package, exact: false },
  { href: '/admin/categories', label: 'Categories', icon: Tag, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#F1F3F5] flex flex-col h-full shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-[#F1F3F5]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#E55A24] flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-sm">1m</span>
          </div>
          <div>
            <div className="font-extrabold text-[#1A1A2E] leading-tight">
              1min<span className="text-[#FF6B35]">product</span>
            </div>
            <div className="text-[10px] text-[#ADB5BD] font-medium uppercase tracking-wide">
              Admin Panel
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              id={`admin-nav-${label.toLowerCase()}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-[#FF6B35]/10 text-[#FF6B35]'
                  : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1A1A2E]'
              )}
            >
              <Icon
                size={18}
                className={active ? 'text-[#FF6B35]' : 'text-[#ADB5BD] group-hover:text-[#6C757D]'}
              />
              <span>{label}</span>
              {active && (
                <ChevronRight size={14} className="ml-auto text-[#FF6B35]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[#F1F3F5]">
        <button
          onClick={handleLogout}
          id="admin-logout-btn"
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#6C757D] hover:bg-red-50 hover:text-red-500 transition-all duration-150 group"
        >
          <LogOut size={18} className="text-[#ADB5BD] group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
