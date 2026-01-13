import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

async function deleteProduto(id: number) {
  const response = await api.delete(`/produtos/${id}`);
  return response.data;
}

export function useDeleteProduto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
