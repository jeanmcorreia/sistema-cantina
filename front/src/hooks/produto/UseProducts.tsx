import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import type { Product } from '../../interface/product';

async function fetchProducts() {
  const response = await api.get<Product[]>('/produtos');
  return response.data;
}

export function useProducts() {
  return useQuery({
    queryKey: ['produtos'],
    queryFn: fetchProducts,
  });
}
