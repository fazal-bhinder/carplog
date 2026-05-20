import React, { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCatalog, useUpdateCatalog, useRemoveProductFromCatalog, useAddProductToCatalog } from '../hooks/useCatalogs';
import { useProducts } from '../hooks/useProducts';
import useAppStore from '../store/useAppStore';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { ArrowLeft, Download, Plus, Trash2, Check, Settings } from 'lucide-react';
import api from '../services/api';

const CatalogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: catalog, isLoading } = useCatalog(id);
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const addToast = useAppStore((s) => s.addToast);

  const updateCatalog = useUpdateCatalog();
  const removeProduct = useRemoveProductFromCatalog();
  const addProductToCatalog = useAddProductToCatalog();

  const [activeTab, setActiveTab] = useState('products');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productStatus, setProductStatus] = useState({});
  const [optimisticTemplate, setOptimisticTemplate] = useState(null);

  // Status toggle popover
  const [showStatusPopover, setShowStatusPopover] = useState(false);

  if (isLoading) return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Catalogs', href: '/catalogs' }, { label: '…' }]} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-8 card-stagger">
        {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
  if (!catalog) return <div className="text-center py-20 text-muted">Catalog not found.</div>;

  const changeTemplate = (t) => {
    setOptimisticTemplate(t);
    updateCatalog.mutate(
      { id: catalog.id, data: { template: t } },
      {
        onSuccess: () => addToast({ title: 'Template saved', message: `Switched to ${t} template.`, type: 'success' }),
        onError: () => { setOptimisticTemplate(catalog.template); addToast({ title: 'Error', message: 'Failed to switch template.', type: 'error' }); },
      }
    );
  };

  const handleToggleStatus = () => {
    const newStatus = catalog.status === 'live' ? 'draft' : 'live';
    updateCatalog.mutate({ id: catalog.id, data: { status: newStatus } }, {
      onSuccess: () => { setShowStatusPopover(false); addToast({ title: 'Status updated', message: `Catalog is now ${newStatus}.`, type: 'success' }); },
    });
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    const toastId = addToast({ title: 'Generating PDF…', type: 'loading' });
    try {
      const response = await api.get(`/catalogs/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${catalog.name.replace(/\s+/g, '-')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      addToast({ title: 'PDF ready', message: 'Your catalog PDF has been downloaded.', type: 'success' });
    } catch {
      addToast({ title: 'Error', message: 'Failed to generate PDF.', type: 'error' });
    } finally {
      setIsGeneratingPDF(false);
      useAppStore.getState().removeToast(toastId);
    }
  };

  const handleAddProductClick = () => {
    if (!allProducts || allProducts.length === 0) navigate('/products/new');
    else { setProductStatus({}); setIsModalOpen(true); }
  };

  const handleAddProduct = (productId) => {
    setProductStatus((p) => ({ ...p, [productId]: 'adding' }));
    addProductToCatalog.mutate(
      { catalogId: catalog.id, data: { productId } },
      {
        onSuccess: () => { setProductStatus((p) => ({ ...p, [productId]: 'added' })); addToast({ title: 'Added!', message: 'Product added to catalog.', type: 'success' }); },
        onError: (err) => { setProductStatus((p) => ({ ...p, [productId]: undefined })); addToast({ title: 'Failed', message: err.response?.data?.error || 'Could not add product.', type: 'error' }); },
      }
    );
  };

  const catalogProductIds = catalog.products?.map((cp) => cp.product.id) || [];
  const activeTemplate = optimisticTemplate ?? catalog.template;

  const templatePreviews = {
    'luxury-catalog-template': (
     <svg viewBox="0 0 120 168" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="168" fill="#111827" rx="4"/>
        <rect x="0" y="0" width="120" height="50" fill="#000000" rx="4"/>
        <rect x="25" y="14" width="70" height="10" fill="#C2692A" rx="1"/>
        <rect x="40" y="27" width="40" height="4" fill="#6b7280" rx="1"/>
        <rect x="8" y="58" width="50" height="40" fill="#374151" rx="1" stroke="#C2692A" strokeWidth="0.5"/>
        <rect x="64" y="58" width="48" height="8" fill="#C2692A" rx="1"/>
        <rect x="64" y="69" width="40" height="5" fill="#9ca3af" rx="1"/>
        <rect x="8" y="110" width="50" height="40" fill="#4b5563" rx="1" stroke="#C2692A" strokeWidth="0.5"/>
        <rect x="64" y="110" width="48" height="8" fill="#C2692A" rx="1"/>
        <rect x="64" y="121" width="40" height="5" fill="#9ca3af" rx="1"/>
      </svg>
    ),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-0">
      <Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Catalogs', href: '/catalogs' }, { label: catalog.name }]} />

      <div className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/catalogs" className="text-muted hover:text-ink transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-2xl font-bold text-ink">{catalog.name}</h1>
              {/* Inline status toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusPopover((o) => !o)}
                  className="transition-all"
                >
                  <Badge status={catalog.status}>{catalog.status}</Badge>
                </button>
                {showStatusPopover && (
                  <div className="absolute left-0 top-8 bg-surface border border-border rounded-xl shadow-lg p-4 z-20 min-w-[200px]"
                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                    <p className="text-sm font-medium text-ink mb-3">
                      Set to <strong>{catalog.status === 'live' ? 'Draft' : 'Live'}</strong>?
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleToggleStatus}
                        isLoading={updateCatalog.isPending}
                        className="flex-1 text-xs py-1.5"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setShowStatusPopover(false)}
                        className="flex-1 text-xs py-1.5"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-muted pl-7">Template: <span className="font-medium text-body capitalize">{catalog.template}</span></p>
          </div>

          <Button className="cursor-pointer" onClick={handleGeneratePDF} isLoading={isGeneratingPDF}>
            <Download className="w-4 h-4" /> Generate PDF
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="-mb-px flex gap-6">
            {['products', 'settings'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted hover:text-body'
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Products tab */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            <div className="flex justify-between items-center bg-surface-alt p-4 rounded-xl border border-border">
              <p className="text-sm text-muted">Select products from your inventory to include in this catalog.</p>
              <Button onClick={handleAddProductClick} variant="secondary">
                <Plus className="w-4 h-4" /> Add Products
              </Button>
            </div>

            {catalog.products?.length === 0 ? (
              <div className="text-center py-14 border border-border border-dashed rounded-xl">
                <p className="text-muted text-sm">No products in this catalog yet.</p>
                <button onClick={handleAddProductClick} className="mt-3 text-accent text-sm font-medium hover:underline">+ Add products now</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 card-stagger">
                {catalog.products.map((cp) => (
                  <div key={cp.id} className="card-animate bg-surface border border-border rounded-xl overflow-hidden group">
                    <div className="h-44 bg-surface-alt relative overflow-hidden">
                      {(cp.product.thumbnailUrl || cp.product.imageUrl) ? (
                        <img
                          src={(cp.product.thumbnailUrl || cp.product.imageUrl).startsWith('http') ? (cp.product.thumbnailUrl || cp.product.imageUrl) : `http://localhost:5001${cp.product.thumbnailUrl || cp.product.imageUrl}`}
                          alt={cp.product.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-muted">No Image</div>
                      )}
                      <button
                        onClick={() => removeProduct.mutate({ catalogId: catalog.id, productId: cp.product.id })}
                        className="absolute top-2 right-2 bg-surface/90 p-1.5 rounded-lg text-danger hover:bg-danger-bg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-ink text-sm mb-1 truncate">{cp.product.name}</h4>
                      <p className="text-xs text-muted line-clamp-2 mb-3">{cp.product.description}</p>
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="text-xs text-muted">Price</span>
                        <div className="flex items-center gap-1">
                          <span className="text-muted text-xs">₹</span>
                          <input
                            type="number"
                            className="w-18 text-right font-bold text-accent text-sm bg-transparent border-0 shadow-none focus:ring-0 p-0"
                            defaultValue={cp.customPrice || cp.product.price}
                            style={{ outline: 'none', boxShadow: 'none' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-ink mb-1">PDF Template</h3>
              <p className="text-sm text-muted mb-6">Choose the visual style for your generated catalog PDFs.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { id: 'luxury-catalog-template', label: 'Carpet Story', desc: 'Premium editorial layout' },
                ].map(({ id: t, label, desc }) => {
                  const active = activeTemplate === t;
                  return (
                    <div key={t} onClick={() => changeTemplate(t)}
                      className={`cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-150 ${
                        active ? 'border-accent shadow-md ring-2 ring-accent/20' : 'border-border hover:border-border-dark'
                      }`}>
                      <div className="bg-surface p-2 border-b border-border">
                        {templatePreviews[t]}
                      </div>
                      <div className={`px-3 py-2.5 flex items-center justify-between ${active ? 'bg-accent-light' : 'bg-surface'}`}>
                        <div>
                          <p className={`text-sm font-semibold capitalize ${active ? 'text-accent' : 'text-ink'}`}>{label}</p>
                          <p className="text-[10px] text-muted">{desc}</p>
                        </div>
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="text-lg font-semibold text-danger mb-1">Danger Zone</h3>
              <p className="text-sm text-muted mb-4">Deleting a catalog is permanent. Products remain in your inventory.</p>
              <Button variant="danger">Delete Catalog</Button>
            </div>
          </div>
        )}
      </div>

      {/* Add Products Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Products to Catalog">
        <div className="max-h-[60vh] overflow-y-auto space-y-2 pr-1">
          {productsLoading ? (
            <div className="space-y-2">
              {Array(4).fill(null).map((_, i) => (
                <div key={i} className="h-16 shimmer-bg rounded-xl" />
              ))}
            </div>
          ) : (
            allProducts?.map((product) => {
              const isInCatalog = catalogProductIds.includes(product.id);
              const status = productStatus[product.id];
              const isAdded = isInCatalog || status === 'added';
              const isAdding = status === 'adding';

              return (
                <div key={product.id}
                  className="flex items-center gap-3 p-3 border border-border rounded-xl bg-surface hover:bg-surface-alt transition-colors">
                  <div className="w-11 h-11 rounded-lg bg-surface-alt overflow-hidden flex-shrink-0">
                    {(product.thumbnailUrl || product.imageUrl) ? (
                      <img
                        src={(product.thumbnailUrl || product.imageUrl).startsWith('http') ? (product.thumbnailUrl || product.imageUrl) : `http://localhost:5001${product.thumbnailUrl || product.imageUrl}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-muted">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-ink truncate">{product.name}</h4>
                    <p className="text-xs text-muted">₹{product.price}</p>
                  </div>
                  {isAdded ? (
                    <span className="flex items-center gap-1 text-success text-xs font-semibold px-2 py-1">
                      <Check className="w-3.5 h-3.5" /> Added
                    </span>
                  ) : isAdding ? (
                    <span className="flex items-center gap-1 text-muted text-xs px-2 py-1">
                      <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Adding…
                    </span>
                  ) : (
                    <Button onClick={() => handleAddProduct(product.id)} className="text-xs py-1 px-3 h-auto cursor-pointer">
                      Add
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CatalogDetail;
