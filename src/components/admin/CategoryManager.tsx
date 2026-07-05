'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const supabase = createClient();

  const fetchCategories = useCallback(async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    setCategories(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    const name = newName.trim();
    if (!name) { setAddError('Category name is required.'); return; }

    setAddLoading(true);
    const { error } = await supabase.from('categories').insert({ name });
    setAddLoading(false);

    if (error) {
      setAddError(
        error.code === '23505'
          ? 'A category with that name already exists.'
          : `Error: ${error.message}`
      );
      return;
    }

    setNewName('');
    fetchCategories();
  };

  const startEdit = (cat: Category) => {
    setEditTarget(cat);
    setEditName(cat.name);
  };

  const saveEdit = async () => {
    if (!editTarget || !editName.trim()) return;
    setEditLoading(true);
    await supabase
      .from('categories')
      .update({ name: editName.trim() })
      .eq('id', editTarget.id);
    setEditLoading(false);
    setEditTarget(null);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    setDeleteError('');

    // Check if category has products
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', deleteTarget.id);

    if (count && count > 0) {
      setDeleteError(
        `This category has ${count} product${count === 1 ? '' : 's'}. Please move or delete them first before removing the category.`
      );
      setDeleteLoading(false);
      return;
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteTarget.id);

    setDeleteLoading(false);

    if (error) {
      setDeleteError(`Delete failed: ${error.message}`);
      return;
    }

    setDeleteTarget(null);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* Add category */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm p-6">
        <h2 className="text-base font-semibold text-[#1A1A2E] mb-4">
          Add New Category
        </h2>
        <form onSubmit={handleAdd} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              id="new-category-name"
              placeholder="e.g. Electronics, Gym Equipment…"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              error={addError}
            />
          </div>
          <Button
            type="submit"
            loading={addLoading}
            size="md"
            id="add-category-btn"
            className="shrink-0"
          >
            <Plus size={16} />
            Add
          </Button>
        </form>
      </div>

      {/* Category list */}
      <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F8F9FA]">
          <h2 className="text-base font-semibold text-[#1A1A2E]">
            All Categories
            <span className="ml-2 text-sm font-medium text-[#ADB5BD]">
              ({categories.length})
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin h-6 w-6 rounded-full border-2 border-[#E9ECEF] border-t-[#FF6B35]" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-[#ADB5BD] text-sm">No categories yet. Add one above!</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F8F9FA]">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-[#FAFAFA] transition-colors"
              >
                {editTarget?.id === cat.id ? (
                  /* Edit inline */
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditTarget(null); }}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#FF6B35] text-sm outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      disabled={editLoading}
                      className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      aria-label="Save edit"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={() => setEditTarget(null)}
                      className="p-1.5 rounded-lg bg-[#F8F9FA] text-[#6C757D] hover:bg-[#F1F3F5] transition-colors"
                      aria-label="Cancel edit"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{cat.name}</p>
                    <p className="text-xs text-[#ADB5BD]">
                      {new Date(cat.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {editTarget?.id !== cat.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 rounded-lg text-[#6C757D] hover:bg-[#F1F3F5] hover:text-[#1A1A2E] transition-colors"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => { setDeleteError(''); setDeleteTarget(cat); }}
                      className="p-2 rounded-lg text-[#6C757D] hover:bg-red-50 hover:text-red-500 transition-colors"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => !deleteLoading && setDeleteTarget(null)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          {deleteError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{deleteError}</p>
            </div>
          )}
          {!deleteError && (
            <p className="text-sm text-[#6C757D]">
              Are you sure you want to delete the category{' '}
              <strong className="text-[#1A1A2E]">&quot;{deleteTarget?.name}&quot;</strong>?
              This cannot be undone.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            {!deleteError && (
              <Button
                variant="danger"
                loading={deleteLoading}
                onClick={handleDelete}
                size="md"
                id="confirm-delete-category"
              >
                Delete
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteLoading}
              size="md"
            >
              {deleteError ? 'Close' : 'Cancel'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
