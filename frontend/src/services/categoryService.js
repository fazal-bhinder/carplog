import api from './api';

export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data;
};

export const createCategory = async (categoryData) => {
  const { data } = await api.post('/categories', categoryData);
  return data.data;
};

export const updateCategory = async (id, categoryData) => {
  const { data } = await api.put(`/categories/${id}`, categoryData);
  return data.data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data.data;
};
