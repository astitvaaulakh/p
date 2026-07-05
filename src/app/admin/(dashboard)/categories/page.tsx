import CategoryManager from '@/components/admin/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Categories</h1>
        <p className="text-sm text-[#6C757D] mt-1">
          Manage product categories. Each category becomes a section on the homepage.
        </p>
      </div>

      <CategoryManager />
    </div>
  );
}
