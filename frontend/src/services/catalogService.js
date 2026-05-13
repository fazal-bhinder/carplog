import api from './api';

export const getCatalogs = async () => {
  const { data } = await api.get('/catalogs');
  return data.data;
};

export const getCatalog = async (id) => {
  const { data } = await api.get(`/catalogs/${id}`);
  return data.data;
};

export const createCatalog = async (catalogData) => {
  const { data } = await api.post('/catalogs', catalogData);
  return data.data;
};

export const updateCatalog = async (id, catalogData) => {
  const { data } = await api.put(`/catalogs/${id}`, catalogData);
  return data.data;
};

export const deleteCatalog = async (id) => {
  const { data } = await api.delete(`/catalogs/${id}`);
  return data.data;
};

export const addProductToCatalog = async (catalogId, productData) => {
  const { data } = await api.post(`/catalogs/${catalogId}/products`, productData);
  return data.data;
};

export const removeProductFromCatalog = async (catalogId, productId) => {
  const { data } = await api.delete(`/catalogs/${catalogId}/products/${productId}`);
  return data.data;
};
