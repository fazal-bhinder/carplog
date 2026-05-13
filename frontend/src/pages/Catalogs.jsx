import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCatalogs, useCreateCatalog, useDeleteCatalog } from '../hooks/useCatalogs';
import { SkeletonCatalogCard } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import KebabMenu from '../components/ui/KebabMenu';
import { Plus, BookOpen, ExternalLink, Trash2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

const EmptyState = ({ onNew }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center bg-surface border border-border border-dashed rounded-xl">
    <svg className="w-16 h-16 mb-5 text-border" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M20 16V12a4 4 0 014-4h16a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2"/>
      <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <h3 className="text-lg font-semibold text-ink mb-1">No catalogs yet</h3>
    <p className="text-sm text-muted mb-5 max-w-xs">Create your first catalog to start grouping products and generating PDFs.</p>
    <Button onClick={onNew}><Plus className="w-4 h-4" /> Create your first catalog</Button>
  </div>
);

const Catalogs = () => {
  const navigate = useNavigate();
  const { data: catalogs, isLoading } = useCatalogs();
  const createCatalog = useCreateCatalog();
  const deleteCatalog = useDeleteCatalog();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    createCatalog.mutate(data, {
      onSuccess: () => { setIsModalOpen(false); reset(); }
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink mb-1">Catalogs</h1>
          <p className="text-sm text-muted">Build and export beautiful product catalogs as PDFs.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> New Catalog
        </Button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-stagger">
          {Array(6).fill(null).map((_, i) => <SkeletonCatalogCard key={i} />)}
        </div>
      ) : catalogs?.length === 0 ? (
        <EmptyState onNew={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-stagger">
          {catalogs.map((catalog) => (
            <div key={catalog.id}
              className="card-animate bg-surface border border-border rounded-xl p-5 hover:-translate-y-[1px] hover:shadow-md hover:border-border-dark transition-all duration-200 group relative">
              {/* Kebab */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <KebabMenu items={[
                  { label: 'Open',         icon: ExternalLink, onClick: () => navigate(`/catalogs/${catalog.id}`) },
                  { label: 'Delete',       icon: Trash2,       onClick: () => {
                    if (window.confirm(`Delete "${catalog.name}"?`)) deleteCatalog.mutate(catalog.id);
                  }, danger: true },
                ]} />
              </div>

              <Link to={`/catalogs/${catalog.id}`} className="block">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--color-accent-light)' }}>
                    <BookOpen className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <h3 className="font-semibold text-ink truncate">{catalog.name}</h3>
                    <p className="text-sm text-muted mt-0.5">{catalog._count?.products ?? 0} products · {catalog.template}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge status={catalog.status}>{catalog.status}</Badge>
                  <span className="text-xs text-muted flex items-center gap-1 hover:text-accent transition-colors">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Catalog Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); reset(); }} title="New Catalog">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Catalog Name <span className="text-danger">*</span></label>
            <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Summer 2025 Collection" />
            {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Template</label>
            <select {...register('template')}>
              <option value="standard">Standard</option>
              <option value="minimal">Minimal</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); reset(); }}>Cancel</Button>
            <Button type="submit" isLoading={createCatalog.isPending}>Create Catalog</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Catalogs;
