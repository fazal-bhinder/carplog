import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as productService from '../services/productService';
import useAppStore from '../store/useAppStore';

export const useProducts = (categoryId) => {
  return useQuery({
    queryKey: ['products', categoryId],
    queryFn: () => productService.getProducts(categoryId),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id && id !== 'new',
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Success', message: 'Product created successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to create product', type: 'error' });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
      addToast({ title: 'Success', message: 'Product updated successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to update product', type: 'error' });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast({ title: 'Success', message: 'Product deleted successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to delete product', type: 'error' });
    },
  });
};
