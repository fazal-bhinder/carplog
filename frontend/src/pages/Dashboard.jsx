import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCatalogs } from '../hooks/useCatalogs';
import { SkeletonCatalogCard } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Plus, BookOpen, Package, ArrowRight } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-surface border border-border rounded-xl p-5 flex items-center gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: 'var(--color-accent-light)' }}>
      <Icon className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-ink">{value ?? '—'}</p>
      <p className="text-sm text-muted">{label}</p>
    </div>
  </div>
);

const EmptyCatalogs = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <svg className="w-16 h-16 mb-5 text-border" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M20 16V12a4 4 0 014-4h16a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2" />
      <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="38" x2="36" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <h3 className="text-lg font-semibold text-ink mb-1">No catalogs yet</h3>
    <p className="text-sm text-muted mb-5 max-w-xs">Create your first catalog to start grouping products and generating PDFs.</p>
    <Link to="/catalogs">
      <Button><Plus className="w-4 h-4" /> New Catalog</Button>
    </Link>
  </div>
);

const Dashboard = () => {
  const { data: products } = useProducts();
  const { data: catalogs, isLoading: catalogsLoading } = useCatalogs();

  const liveCatalogs = catalogs?.filter((c) => c.status === 'live').length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="rounded-xl p-6 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #C2692A 0%, #A85520 100%)' }}>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h2>
          <p className="text-white/80 text-sm">Manage your carpet collection and generate stunning catalogs.</p>
        </div>
        <Link to="/products/new">
          <Button className="bg-white !text-accent hover:bg-white/90">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Products"   value={products?.length ?? 0}  icon={Package}   />
        <StatCard label="Total Catalogs"   value={catalogs?.length ?? 0}  icon={BookOpen}  />
        <StatCard label="Live Catalogs"    value={liveCatalogs}           icon={ArrowRight} />
      </div>

      {/* Catalogs section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Your Catalogs</h2>
          <Link to="/catalogs" className="text-sm text-accent hover:underline font-medium flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {catalogsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-stagger">
            {Array(3).fill(null).map((_, i) => <SkeletonCatalogCard key={i} />)}
          </div>
        ) : catalogs?.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl">
            <EmptyCatalogs />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 card-stagger">
            {catalogs.slice(0, 6).map((catalog) => (
              <Link key={catalog.id} to={`/catalogs/${catalog.id}`}
                className="card-animate bg-surface border border-border rounded-xl p-5 hover:-translate-y-[1px] hover:shadow-md hover:border-border-dark transition-all duration-200 block">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--color-accent-light)' }}>
                    <BookOpen className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <Badge status={catalog.status}>{catalog.status}</Badge>
                </div>
                <h3 className="font-semibold text-ink mb-1">{catalog.name}</h3>
                <p className="text-sm text-muted">{catalog._count?.products ?? 0} products</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
