import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { Product } from "../../interface/product";

async function toggleAtivo(id: number) {
  const response = await api.patch<{ produto: Product }>(
    `/produtos/${id}/ativo`
  );
  return response.data;
}

export function useToggleAtivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleAtivo,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["produtos"] });

      const previousProdutos = queryClient.getQueryData<Product[]>(["produtos"]);

      queryClient.setQueryData<Product[]>(["produtos"], (old) =>
        old?.map((p) =>
          p.id === id ? { ...p, ativo: !p.ativo } : p
        )
      );

      return { previousProdutos };
    },

    onError: (_err, _id, context) => {
      if (context?.previousProdutos) {
        queryClient.setQueryData(["produtos"], context.previousProdutos);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
  });
}
