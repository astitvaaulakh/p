'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pencil, Trash2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Product } from '@/lib/types';
import { formatDate, truncate } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface ProductTableProps {
  products: Product[];
  onDeleted: () => void;
}

export default function ProductTable({ products, onDeleted }: ProductTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const supabase = createClient();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError('');

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', deleteTarget.id);

    setDeleting(false);

    if (error) {
      setDeleteError(`Delete failed: ${error.message}`);
      return;
    }

    setDeleteTarget(null);
    onDeleted();
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-12 text-center">
        <div className="text-5xl mb-4">📦</div>
        <p className="text-[#1A1A2E] font-semibold text-lg mb-2">No products yet</p>
        <p className="text-[#6C757D] text-sm mb-6">
          Start building your catalog by adding your first product.
        </p>
        <Link href="/admin/products/new">
          <Button size="md">Add First Product</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F1F3F5] bg-[#F8F9FA]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase tracking-wide w-16">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                  Added
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[#6C757D] uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F8F9FA]">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F8F9FA] relative overflow-hidden border border-[#F1F3F5]">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    </div>
                  </td>
                  {/* Title */}
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#1A1A2E] max-w-xs">
                      {truncate(product.title, 50)}
                    </p>
                    <a
                      href={product.affiliate_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#ADB5BD] hover:text-[#FF6B35] transition-colors truncate max-w-xs block"
                    >
                      {truncate(product.affiliate_link, 40)}
                    </a>
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F1F3F5] text-xs font-medium text-[#6C757D]">
                      {product.categories
                        ? (product.categories as { name: string }).name
                        : 'Uncategorized'}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 text-xs text-[#ADB5BD] whitespace-nowrap">
                    {formatDate(product.created_at)}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button
                          className="p-2 rounded-lg text-[#6C757D] hover:bg-[#F1F3F5] hover:text-[#1A1A2E] transition-colors"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Pencil size={15} />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-2 rounded-lg text-[#6C757D] hover:bg-red-50 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !deleting && setDeleteTarget(null)}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{deleteError}</p>
            </div>
          )}
          <p className="text-sm text-[#6C757D]">
            Are you sure you want to delete{' '}
            <strong className="text-[#1A1A2E]">
              &quot;{truncate(deleteTarget?.title ?? '', 40)}&quot;
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex gap-3 pt-2">
            <Button
              variant="danger"
              loading={deleting}
              onClick={handleDelete}
              size="md"
              id="confirm-delete-product"
            >
              Delete
            </Button>
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              size="md"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
