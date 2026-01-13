import { api } from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


async function pagarPedido(pedidoId: number) {
  const response = await api.put<{ message: string }>(`/pedidos/${pedidoId}/pagar`);
  return response.data;
}

export function usePagarPedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pagarPedido,
    onSuccess: (data, pedidoId) => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] }); 
      queryClient.invalidateQueries({ queryKey: ['pedidos', pedidoId] }); 
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });
}