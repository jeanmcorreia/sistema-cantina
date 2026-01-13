import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Product } from "../../interface/product";

async function updateProduto(id: number, data: Partial<Product>) {
  const response = await api.put<Product>(`/produtos/${id}`, data);
  return response.data;
}

export function useUpdateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: number; data: Partial<Product> }) =>
      updateProduto(params.id, params.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
