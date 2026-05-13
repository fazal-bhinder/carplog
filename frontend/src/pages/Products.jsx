import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { SkeletonCard } from '../components/ui/Skeleton';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import { Plus, Search, Edit2, Trash2, Filter, Package } from 'lucide-react';
import KebabMenu from '../components/ui/KebabMenu';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center bg-surface border border-border border-dashed rounded-xl">
    <svg className="w-16 h-16 mb-5 text-border" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="20" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M22 20V16a2 2 0 012-2h16a2 2 0 012 2v4" stroke="currentColor" strokeWidth="2"/>
      <circle cx="32" cy="36" r="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M32 33v3l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <h3 className="text-lg font-semibold text-ink mb-1">No products yet</h3>
    <p className="text-sm text-muted mb-5 max-w-xs">Add your first carpet to get started. You can then assign it to catalogs.</p>
    <Link to="/products/new">
      <Button><Plus className="w-4 h-4" /> Add your first product</Button>
    </Link>
  </div>
);

const Products = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();
  const [search, setSearch] = useState('');

  const filtered = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"?`)) deleteProduct.mutate(id);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-0">
      <Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Products' }]} />

      <div className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">Products</h1>
            <p className="text-sm text-muted">Manage your carpet inventory and assign products to catalogs.</p>
          </div>
          <Link to="/products/new">
            <Button><Plus className="w-4 h-4" /> Add Product</Button>
          </Link>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 items-center bg-surface border border-border rounded-xl p-3">
          <Search className="w-4 h-4 text-muted flex-shrink-0 ml-1" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or SKU…"
            className="flex-1 bg-transparent text-sm outline-none border-0 shadow-none py-0 px-0"
            style={{ boxShadow: 'none' }}
          />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 card-stagger">
            {Array(10).fill(null).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered?.length === 0 ? (
          search ? (
            <div className="text-center py-16 text-muted">
              <p className="font-medium">No results for "{search}"</p>
              <p className="text-sm mt-1">Try a different search term.</p>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 card-stagger">
            {filtered?.map((product) => (
              <div key={product.id}
                className="card-animate bg-surface border border-border rounded-xl overflow-hidden group hover:-translate-y-[1px] hover:shadow-md hover:border-border-dark transition-all duration-200 relative">
                {/* Kebab menu */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <KebabMenu items={[
                    { label: 'Edit',   icon: Edit2,  onClick: () => navigate(`/products/${product.id}/edit`) },
                    { label: 'Delete', icon: Trash2, onClick: () => handleDelete(product.id, product.name), danger: true },
                  ]} />
                </div>

                {/* Image */}
                <div className="h-52 bg-surface-alt relative overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:5001${product.imageUrl}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-2">
                      <Package className="w-8 h-8 opacity-30" />
                      <span className="text-xs">No image</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-ink text-sm line-clamp-2 mb-1">{product.name}</h3>
                  <p className="text-xs text-muted mb-3">{product.sku || 'No SKU'}</p>
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-bold text-accent">₹{parseFloat(product.price).toFixed(2)}</span>
                    {product.category && (
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted bg-surface-alt px-2 py-0.5 rounded-full">
                        {product.category.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
