import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as catalogService from '../services/catalogService';
import useAppStore from '../store/useAppStore';

export const useCatalogs = () => {
  return useQuery({
    queryKey: ['catalogs'],
    queryFn: catalogService.getCatalogs,
  });
};

export const useCatalog = (id) => {
  return useQuery({
    queryKey: ['catalog', id],
    queryFn: () => catalogService.getCatalog(id),
    enabled: !!id,
  });
};

export const useCreateCatalog = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: catalogService.createCatalog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      addToast({ title: 'Success', message: 'Catalog created successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to create catalog', type: 'error' });
    },
  });
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ id, data }) => catalogService.updateCatalog(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      queryClient.invalidateQueries({ queryKey: ['catalog', variables.id] });
      addToast({ title: 'Success', message: 'Catalog updated successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to update catalog', type: 'error' });
    },
  });
};

export const useDeleteCatalog = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: catalogService.deleteCatalog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      addToast({ title: 'Success', message: 'Catalog deleted successfully', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to delete catalog', type: 'error' });
    },
  });
};

export const useAddProductToCatalog = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ catalogId, data }) => catalogService.addProductToCatalog(catalogId, data),
    onSuccess: () => {
      // Use prefix-only invalidation to avoid string/number ID type mismatch from useParams
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to add product', type: 'error' });
    },
  });
};

export const useRemoveProductFromCatalog = () => {
  const queryClient = useQueryClient();
  const addToast = useAppStore((state) => state.addToast);

  return useMutation({
    mutationFn: ({ catalogId, productId }) => catalogService.removeProductFromCatalog(catalogId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      queryClient.invalidateQueries({ queryKey: ['catalogs'] });
      addToast({ title: 'Success', message: 'Product removed from catalog', type: 'success' });
    },
    onError: (error) => {
      addToast({ title: 'Error', message: error.response?.data?.error || 'Failed to remove product from catalog', type: 'error' });
    },
  });
};
