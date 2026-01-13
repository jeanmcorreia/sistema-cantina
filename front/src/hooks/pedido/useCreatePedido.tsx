import { api } from "../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";



export interface ItemPedidoCreateData {
  produtoId: number;
  quantidade: number;
}

export interface PedidoCreateData {
  clienteId: number;
  itens: ItemPedidoCreateData[];
}

// Tipagem para o retorno da API
export interface PedidoCreateResponse {
  message: string;
  pedidoId: number;
  total: number;
}

async function createPedido(data: PedidoCreateData) {
  console.log("Enviando pedido:", data);
  const response = await api.post<PedidoCreateResponse>('/pedidos', data);
  console.log("Resposta do servidor:", response);
  return response.data;
}

export function useCreatePedido() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPedido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
  });
}