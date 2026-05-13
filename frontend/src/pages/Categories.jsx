import React, { useState } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory } from '../hooks/useCategories';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { SkeletonRow } from '../components/ui/Skeleton';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';

const EmptyState = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center bg-surface border border-border border-dashed rounded-xl">
    <Tag className="w-12 h-12 text-border mb-4" />
    <h3 className="text-lg font-semibold text-ink mb-1">No categories yet</h3>
    <p className="text-sm text-muted mb-5 max-w-xs">Categories help you organize your carpet collection by type or room.</p>
    <Button onClick={onNew}><Plus className="w-4 h-4" /> Add your first category</Button>
  </div>
);

const Categories = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    createCategory.mutate(data, {
      onSuccess: () => { setIsModalOpen(false); reset(); }
    });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete category "${name}"?`)) deleteCategory.mutate(id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-0">
      <Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Categories' }]} />

      <div className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">Categories</h1>
            <p className="text-sm text-muted">Organize your product catalog into logical groups.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Add Category</Button>
        </div>

        {/* List */}
        {isLoading ? (
          <div className="space-y-3">
            {Array(4).fill(null).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : categories?.length === 0 ? (
          <EmptyState onNew={() => setIsModalOpen(true)} />
        ) : (
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id}
                className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl group hover:border-border-dark transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--color-accent-light)' }}>
                  <Tag className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink text-sm">{cat.name}</h3>
                  {cat.description && <p className="text-xs text-muted truncate">{cat.description}</p>}
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-2 text-muted hover:text-danger hover:bg-danger-bg rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); reset(); }} title="Add Category">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Name <span className="text-danger">*</span></label>
            <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Living Room Rugs" />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Optional description" className="resize-none" />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); reset(); }}>Cancel</Button>
            <Button type="submit" isLoading={createCategory.isPending}>Add Category</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Categories;
