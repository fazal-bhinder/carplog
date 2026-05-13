import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as categoryService from '../services/categoryService';
import useAppStore from '../store/useAppStore';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ title: 'Success', message: 'Category created successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to create category', type: 'error' });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ title: 'Success', message: 'Category updated successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to update category', type: 'error' });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addToast({ title: 'Success', message: 'Category deleted successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to delete category', type: 'error' });
    },
  });
};
