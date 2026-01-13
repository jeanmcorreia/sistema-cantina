import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Product } from "../../interface/product";

async function createProduto(data: Omit<Product, "id">) {
  const response = await api.post<Product>("/produtos", data);
  return response.data;
}

export function useCreateProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
