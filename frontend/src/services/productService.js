import api from './api';

export const getProducts = async (categoryId) => {
  const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
  const { data } = await api.get(url);
  return data.data;
};

export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (productData) => {
  const { data } = await api.post('/products', productData);
  return data.data;
};

export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data.data;
};

export const enhanceImage = async (id) => {
  const { data } = await api.post(`/products/${id}/enhance`);
  return data.data;
};

export const describeImage = async (id, imageUrl) => {
  // If id is new/undefined, we might just pass imageUrl. 
  // Let's assume the backend handles it gracefully if we just POST to a placeholder or have a generic endpoint.
  // We'll use id 'new' and handle it if needed.
  const path = id ? `/products/${id}/describe` : '/products/new/describe';
  const { data } = await api.post(path, { imageUrl });
  return data.data;
};
