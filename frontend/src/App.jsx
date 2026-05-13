import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PageWrapper from './components/layout/PageWrapper';
import CommandPalette from './components/ui/CommandPalette';
import Dashboard from './pages/Dashboard';
import Catalogs from './pages/Catalogs';
import CatalogDetail from './pages/CatalogDetail';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import Categories from './pages/Categories';
import useAppStore from './store/useAppStore';

function App() {
  const { openCommandPalette } = useAppStore();

  // Global Cmd+K handler
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [openCommandPalette]);

  return (
    <>
      <CommandPalette />
      <PageWrapper>
        <Routes>
          <Route path="/"                   element={<Dashboard />} />
          <Route path="/catalogs"           element={<Catalogs />} />
          <Route path="/catalogs/:id"       element={<CatalogDetail />} />
          <Route path="/products"           element={<Products />} />
          <Route path="/products/new"       element={<AddProduct />} />
          <Route path="/products/:id/edit"  element={<AddProduct />} />
          <Route path="/categories"         element={<Categories />} />
        </Routes>
      </PageWrapper>
    </>
  );
}

export default App;
