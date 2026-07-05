'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Category, Product } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const isEdit = !!product;
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(product?.title ?? '');
  const [affiliateLink, setAffiliateLink] = useState(product?.affiliate_link ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch categories
  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => setCategories(data || []));
  }, [supabase]);

  const validate = () => {
    if (!title.trim()) return 'Product title is required.';
    if (!affiliateLink.trim()) return 'Amazon affiliate link is required.';
    if (!affiliateLink.startsWith('http'))
      return 'Please enter a valid affiliate link starting with http/https.';
    if (!categoryId) return 'Please select a category.';
    if (!imageUrl) return 'Please upload a product image.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const payload = {
      title: title.trim(),
      affiliate_link: affiliateLink.trim(),
      category_id: categoryId,
      image_url: imageUrl,
    };

    let err;
    if (isEdit && product) {
      const { error: updateErr } = await supabase
        .from('products')
        .update(payload)
        .eq('id', product.id);
      err = updateErr;
    } else {
      const { error: insertErr } = await supabase.from('products').insert(payload);
      err = insertErr;
    }

    setLoading(false);

    if (err) {
      setError(`Failed to save product: ${err.message}`);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/admin/products');
      router.refresh();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Error / Success banners */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 animate-slide-down">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 animate-slide-down">
          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
          <p className="text-sm text-green-600">
            Product {isEdit ? 'updated' : 'created'} successfully! Redirecting…
          </p>
        </div>
      )}

      {/* Fields */}
      <Input
        id="product-title"
        label="Product Title"
        placeholder="e.g. Sony WH-1000XM5 Headphones"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        id="product-link"
        label="Amazon Affiliate Link"
        placeholder="https://amzn.to/…"
        value={affiliateLink}
        onChange={(e) => setAffiliateLink(e.target.value)}
        required
      />

      {/* Category dropdown */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="product-category"
          className="text-sm font-medium text-[#1A1A2E]"
        >
          Category
        </label>
        <select
          id="product-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="w-full rounded-xl border border-[#E9ECEF] bg-white px-4 py-2.5 text-sm text-[#1A1A2E] transition-all duration-200 focus:outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 appearance-none cursor-pointer"
        >
          <option value="" disabled>
            Select a category…
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-[#ADB5BD]">
            No categories yet.{' '}
            <a href="/admin/categories" className="text-[#FF6B35] hover:underline">
              Create one first
            </a>
          </p>
        )}
      </div>

      {/* Image upload */}
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        onError={setError}
      />

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          loading={loading}
          size="lg"
          id="product-form-submit"
        >
          {loading
            ? isEdit
              ? 'Saving…'
              : 'Creating…'
            : isEdit
            ? 'Save Changes'
            : 'Create Product'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
