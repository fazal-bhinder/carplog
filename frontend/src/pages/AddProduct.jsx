import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useProduct, useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import Breadcrumb from '../components/ui/Breadcrumb';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';
import { Sparkles, UploadCloud, X, ImageIcon, Plus } from 'lucide-react';
import api from '../services/api';

const AddProduct = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: categories } = useCategories();

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [isEnhancingImage, setIsEnhancingImage] = useState(false);

  const watchName  = watch('name', '');
  const watchPrice = watch('price', '0');
  const watchDesc  = watch('description', '');

  useEffect(() => {
    if (product && isEdit) {
      setValue('name', product.name);
      setValue('price', product.price);
      setValue('description', product.description);
      setValue('sku', product.sku);
      setValue('material', product.material);
      setValue('dimensions', product.dimensions);
      setValue('categoryId', product.categoryId);
      if (product.imageUrl) setImageUrl(product.imageUrl);
    }
  }, [product, isEdit, setValue]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageUrl(res.data.data.imageUrl);
    } catch (err) {
      console.error('Upload error', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!imageUrl) return;
    setIsGeneratingDesc(true);
    try {
      const res = await api.post('/products/describe', { imageUrl });
      setValue('description', res.data.data.description);
    } catch {
      console.error('Description generation failed');
    } finally {
      setIsGeneratingDesc(false);
    }
  };

  const handleEnhanceImage = async () => {
    if (!imageUrl) return;
    setIsEnhancingImage(true);
    try {
      const res = await api.post('/products/enhance', { imageUrl });
      setImageUrl(res.data.data.imageUrl);
    } catch {
      console.error('Image enhancement failed');
    } finally {
      setIsEnhancingImage(false);
    }
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      price: parseFloat(data.price),
      categoryId: data.categoryId ? parseInt(data.categoryId) : undefined,
      imageUrl: imageUrl || undefined,
    };
    if (isEdit) {
      updateProduct.mutate({ id, data: payload }, { onSuccess: () => navigate('/products') });
    } else {
      createProduct.mutate(payload, { onSuccess: () => navigate('/products') });
    }
  };

  if (isEdit && productLoading) return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Products', href: '/products' }, { label: 'Edit Product' }]} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {Array(3).fill(null).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-0">
      <Breadcrumb crumbs={[
        { label: 'Dashboard', href: '/' },
        { label: 'Products', href: '/products' },
        { label: isEdit ? 'Edit Product' : 'Add Product' }
      ]} />

      <form onSubmit={handleSubmit(onSubmit)} className="pt-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-sm text-muted mt-0.5">Fill in the details below to {isEdit ? 'update' : 'create'} a product.</p>
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/products')}>Cancel</Button>
            <Button type="submit" isLoading={createProduct.isPending || updateProduct.isPending}>
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </div>

        {/* 3-panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Panel 1 — Basic Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="font-semibold text-ink mb-4">Product Details</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Name <span className="text-danger">*</span></label>
                  <input {...register('name', { required: 'Name is required' })} placeholder="Moroccan Berber Rug" />
                  {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Price (INR) <span className="text-danger">*</span></label>
                  <input type="number" step="0.01" {...register('price', { required: 'Price is required' })} placeholder="299.00" />
                  {errors.price && <p className="text-danger text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">SKU</label>
                  <input {...register('sku')} placeholder="MBR-001" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Material</label>
                  <input {...register('material')} placeholder="Wool, Cotton blend" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Dimensions</label>
                  <input {...register('dimensions')} placeholder="5' x 8'" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Category</label>
                  <select {...register('categoryId')}>
                    <option value="">No category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Description</label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    placeholder="Describe this carpet…"
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2 — Images & AI */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-surface border border-border rounded-xl p-5 h-full">
              <h2 className="font-semibold text-ink mb-4">Photos & AI Tools</h2>

              {/* Upload zone */}
              {!imageUrl ? (
                <label
                  className={`relative flex flex-col items-center justify-center h-56 border-2 border-dashed rounded-xl cursor-pointer transition-colors hover:border-accent hover:bg-accent-light/30 ${isUploading ? 'border-accent bg-accent-light/30' : 'border-border'}`}
                >
                  <input type="file" accept="image/jpeg,image/png,image/jpg" className="sr-only" onChange={handleImageUpload} />
                  {isUploading ? (
                    <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-muted mb-2" />
                      <p className="text-sm font-medium text-body">Click to upload photo</p>
                      <p className="text-xs text-muted mt-1">JPG, PNG — 4MB max</p>
                    </>
                  )}
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-border aspect-square">
                    <img
                      src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5001${imageUrl}`}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-surface/90 p-1.5 rounded-lg text-danger hover:bg-danger-bg shadow-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {/* Add more photos */}
                    <label className="flex-1 flex flex-col items-center justify-center h-20 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-accent hover:bg-accent-light/20 transition-colors">
                      <input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                      <Plus className="w-4 h-4 text-muted mb-1" />
                      <span className="text-xs text-muted">Add photo</span>
                    </label>
                  </div>

                  {/* AI Buttons */}
                  <div className="flex flex-col gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleGenerateDescription}
                      isLoading={isGeneratingDesc}
                      className="w-full justify-center"
                    >
                      <Sparkles className="w-4 h-4" /> AI Generate Description
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleEnhanceImage}
                      isLoading={isEnhancingImage}
                      className="w-full justify-center"
                    >
                      <Sparkles className="w-4 h-4" /> Enhance with AI
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Panel 3 — PDF Preview */}
          <div className="md:col-span-1">
            <div className="bg-surface border border-border rounded-xl overflow-hidden h-full flex flex-col">
              <div className="p-4 border-b border-border bg-surface">
                <h2 className="font-semibold text-ink">PDF Preview</h2>
                <p className="text-xs text-muted mt-0.5">How this product will appear in your catalog</p>
              </div>

              <div className="flex-1 p-4 bg-surface-alt flex items-center justify-center">
                <div className="bg-surface w-[220px] shadow-md rounded border border-border flex flex-col">
                  <div className="h-[220px] bg-surface-alt w-full flex items-center justify-center overflow-hidden rounded-t">
                    {imageUrl ? (
                      <img
                        src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:5001${imageUrl}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-border" />
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <h4 className="font-bold text-ink text-[13px] leading-tight line-clamp-2">
                      {watchName || 'Product Name'}
                    </h4>
                    <div className="font-bold text-accent text-[13px]">
                      ₹{parseFloat(watchPrice || 0).toFixed(2)}
                    </div>
                    <p className="text-[10px] text-muted line-clamp-3 leading-relaxed">{watchDesc}</p>
                  </div>
                  <div className="px-3 py-1.5 border-t border-border flex justify-between">
                    <span className="text-[8px] text-muted">CarpLog</span>
                    <span className="text-[8px] text-muted">Page 1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
