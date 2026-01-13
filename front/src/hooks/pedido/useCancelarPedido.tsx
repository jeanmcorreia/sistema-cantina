import { api } from "../../services/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";

async function cancelarPedido(pedidoId: number) {
  // O endpoint é PUT /pedidos/:id/cancelar
  const response = await api.put<{ message: string }>(`/pedidos/${pedidoId}/cancelar`);
  return response.data;
}

export function useCancelarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelarPedido,
    onSuccess: (data, pedidoId) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      queryClient.invalidateQueries({ queryKey: ['pedidos', pedidoId] });
    },
  });
}